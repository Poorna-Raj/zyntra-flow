"""
keells_catalog_client.py

Pulls product/catalog data straight from Keells Super's own JSON API
(the same one their website's frontend calls) instead of rendering
pages with a browser. Mirrors the structure of daraz_catalog_client.py.

Confirmed endpoint (from a captured browser request):
    GET https://zebraliveback.keellssuper.com/2.0/WebV2/GetItemDetails

Confirmed response shape (item-level fields seen in a real response):
    itemID, itemCode, name, longDescription, amount
    imageUrl, enlargeImageUrl
    isFeatured, isSponsored
    minQty, maxQty, slabQty
    stockInHand, averageSale, uom
    isPromotionApplied, promotionDiscountValue, discountValue, discountedTotal
    isAvailable, quantity
    departmentCode, subDepartmentCode, categoryCode
    isSellingToday, merchantID

IMPORTANT - Cloudflare + session cookie:
    This host is behind Cloudflare (cf_clearance cookie required) and the
    site also issues a per-session auth_cookie_<sessionId> JWT (guest or
    logged-in) that GetItemDetails expects. A captured browser request's
    cf_clearance/auth cookie is short-lived (Cloudflare clearance and the
    auth JWT both expire in well under an hour) and is tied to that
    browser's TLS fingerprint, so you cannot hardcode one from a devtools
    capture and expect it to keep working.

    Practical options, in order of effort:
      1. Paste a *fresh* cookie string (copied from your browser's
         devtools -> Network -> a GetItemDetails request -> "cookie"
         request header) into the KEELLS_COOKIE env var right before you
         run a scrape. Fine for occasional/manual runs.
      2. Automate cookie refresh with a real browser engine (Playwright
         with a persistent context, or curl_cffi with browser TLS
         impersonation) that visits keellssuper.com first, solves the
         Cloudflare challenge, and harvests the resulting cookies, then
         hands them to this client. Needed for a scheduled/unattended job.

    This script does NOT bundle any cookie. Set KEELLS_COOKIE yourself.

Install:
    pip install requests
"""

import csv
import os
import time
import random
from dataclasses import dataclass, asdict, field
from datetime import date
from pathlib import Path
from typing import Optional
from urllib.parse import quote
from dotenv import load_dotenv
from supabase_writer import get_client, upsert_records
load_dotenv()

import requests

BASE_URL = "https://zebraliveback.keellssuper.com/2.0/WebV2/GetItemDetails"

# Outlet code Keells uses to scope stock/pricing to one store. "SCDR" was
# seen in the captured request (padded with trailing spaces by their own
# frontend - looks like a quirk of how they build the querystring, so we
# reproduce it rather than "fix" it in case the backend actually expects
# a fixed-width code).
DEFAULT_OUTLET_CODE = "SCDR"

# departmentId groupings - fill these in as you discover them by browsing
# https://www.keellssuper.com and capturing the GetItemDetails calls per
# category. 16 was seen in the sample request.
DEPARTMENT_IDS = {
    2: "Beverages",
    3: "Dairy",
    4: "Cleaning",       # sample was "Cleaned Handella" - verify this one, category code "S" is ambiguous
    5: "Frozen/Desserts",
    6: "Snacks & Confectionery",
    7: "Grocery",
    9: "Health & Beauty",
    10: "Sauces & Condiments",
    12: "Meats",
    15: "Bakery",
    16: "Vegetables",
    # 13 (Gift Vouchers) and 20 (Electronics) excluded - not relevant to a grocery restocking model
}


def _extract_session_id(cookie: str) -> Optional[str]:
    """The site sends the session id both inside the cookie (as part of
    the auth_cookie_<sessionId> cookie NAME) and again as its own
    top-level 'usersessionid' request header. Pull it out of the cookie
    string automatically so callers don't have to supply it twice."""
    for part in cookie.split(";"):
        part = part.strip()
        if part.startswith("auth_cookie_"):
            key = part.split("=", 1)[0]
            return key[len("auth_cookie_"):]
    return None


def _build_headers(cookie: str, user_session_id: Optional[str] = None) -> dict:
    session_id = user_session_id or _extract_session_id(cookie)
    headers = {
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://www.keellssuper.com",
        "Referer": "https://www.keellssuper.com/",
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Cookie": cookie,
    }
    # Required in addition to the cookie - seen as its own header
    # ("usersessionid") in the captured browser request. Without this the
    # API returns 401 even with an otherwise-valid, fresh cookie.
    if session_id:
        headers["usersessionid"] = session_id
    return headers


@dataclass
class KeellsProductRecord:
    source: str = "keells"
    department_id: int = 0
    page: int = 0
    rank_on_page: int = 0
    item_id: int = 0
    item_code: str = ""
    name: str = ""
    description: str = ""
    price: Optional[float] = None
    uom: str = ""
    min_qty: Optional[float] = None
    max_qty: Optional[float] = None
    slab_qty: Optional[float] = None
    stock_in_hand: Optional[float] = None
    average_sale: Optional[float] = None
    is_available: Optional[bool] = None
    is_selling_today: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_sponsored: Optional[bool] = None
    is_promotion_applied: Optional[bool] = None
    discount_value: Optional[float] = None
    promotion_discount_value: Optional[float] = None
    discounted_total: Optional[float] = None
    department_code: str = ""
    sub_department_code: str = ""
    category_code: str = ""
    image_url: str = ""
    merchant_id: Optional[int] = None
    scraped_date: str = field(default_factory=lambda: date.today().isoformat())


def fetch_catalog_page(
    department_id: int,
    page_no: int = 1,
    items_per_page: int = 12,
    outlet_code: str = DEFAULT_OUTLET_CODE,
    item_price_from: float = 0,
    item_price_to: float = 5000,
    cookie: Optional[str] = None,
    user_session_id: Optional[str] = None,
    timeout: int = 20,
) -> dict:
    """One call to Keells' GetItemDetails API. Raises on non-200/invalid JSON."""
    cookie = cookie or os.environ.get("KEELLS_COOKIE", "")
    if not cookie:
        raise RuntimeError(
            "No cookie provided. Set the KEELLS_COOKIE env var to a fresh "
            "cookie string copied from a browser devtools request (see the "
            "module docstring) or pass cookie=... explicitly."
        )
    user_session_id = user_session_id or os.environ.get("KEELLS_SESSION_ID")

    params = {
        "pageNo": page_no,
        "itemsPerPage": items_per_page,
        # the live site pads several of these with trailing spaces -
        # reproduced here in case the API is strict about it
        "outletCode": f"{outlet_code}    ",
        "departmentId": department_id,
        "subDepartmentId": "",
        "categoryId": "",
        "itemDescription": "    ",
        "itemPricefrom": item_price_from,
        "itemPriceTo": item_price_to,
        "isFeatured": 0,
        "isPromotionOnly": "false    ",
        "promotionCategory": "",
        "sortBy": "default",
        "BrandId": "",
        "storeName": "    ",
        "subDeaprtmentCode": "",  # typo present in the real API param name
        "isShowOutofStockItems": "true",
        "brandName": "",
    }

    resp = requests.get(
        BASE_URL,
        params=params,
        headers=_build_headers(cookie, user_session_id),
        timeout=timeout,
    )
    resp.raise_for_status()
    return resp.json()


def extract_records(payload: dict, department_id: int, page_no: int) -> list[KeellsProductRecord]:
    item_detail_result = payload.get("result", {}).get("itemDetailResult", {})
    items = item_detail_result.get("itemDetails", [])

    records = []
    for item in items:
        records.append(KeellsProductRecord(
            department_id=department_id,
            page=page_no,
            rank_on_page=item.get("orderId", 0),
            item_id=item.get("itemID", 0),
            item_code=item.get("itemCode", ""),
            name=item.get("name", ""),
            description=item.get("longDescription", ""),
            price=item.get("amount"),
            uom=item.get("uom", ""),
            min_qty=item.get("minQty"),
            max_qty=item.get("maxQty"),
            slab_qty=item.get("slabQty"),
            stock_in_hand=item.get("stockInHand"),
            average_sale=item.get("averageSale"),
            is_available=item.get("isAvailable"),
            is_selling_today=item.get("isSellingToday"),
            is_featured=item.get("isFeatured"),
            is_sponsored=item.get("isSponsored"),
            is_promotion_applied=item.get("isPromotionApplied"),
            discount_value=item.get("discountValue"),
            promotion_discount_value=item.get("promotionDiscountValue"),
            discounted_total=item.get("discountedTotal"),
            department_code=item.get("departmentCode", ""),
            sub_department_code=item.get("subDepartmentCode", ""),
            category_code=item.get("categoryCode", ""),
            image_url=item.get("imageUrl", ""),
            merchant_id=item.get("merchantID"),
        ))
    return records


def get_page_count(payload: dict) -> int:
    """Total number of pages for this query, as reported by the API itself
    - no need to guess pagination end from a short page."""
    return payload.get("result", {}).get("itemDetailResult", {}).get("pageCount", 0)


def fetch_all_for_department(
    department_id: int,
    max_pages: int = 50,
    items_per_page: int = 12,
    cookie: Optional[str] = None,
    user_session_id: Optional[str] = None,
    delay_range=(1.5, 3.5),
) -> list[KeellsProductRecord]:
    """Fetches every page of results for one department, using the API's
    own reported pageCount rather than guessing when to stop."""
    all_records: list[KeellsProductRecord] = []
    total_pages: Optional[int] = None
    page = 1

    while True:
        try:
            payload = fetch_catalog_page(
                department_id,
                page_no=page,
                items_per_page=items_per_page,
                cookie=cookie,
                user_session_id=user_session_id,
            )
        except requests.RequestException as e:
            print(f"[keells] request failed for dept {department_id} page {page}: {e}")
            break

        if total_pages is None:
            total_pages = get_page_count(payload)
            print(f"[keells] dept {department_id}: {total_pages} total pages reported")

        page_records = extract_records(payload, department_id, page)
        if not page_records:
            print(f"[keells] no items for dept {department_id} page {page} - stopping.")
            break

        all_records.extend(page_records)
        print(f"[keells] dept {department_id} page {page}/{total_pages or '?'}: "
              f"{len(page_records)} items (total so far: {len(all_records)})")

        if page >= max_pages:
            print(f"[keells] hit max_pages={max_pages} - stopping early.")
            break
        if total_pages and page >= total_pages:
            break

        page += 1
        time.sleep(random.uniform(*delay_range))

    return all_records


def save_to_supabase(records: list[KeellsProductRecord]) -> None:
    client = get_client()
    upsert_records(
        client, "keells_catalog_client", records,
        on_conflict="item_id,scraped_date",
    )


def discover_department_endpoints(
    cookie: Optional[str] = None,
    user_session_id: Optional[str] = None,
    timeout: int = 15,
) -> dict:
    """Best-effort probe for a menu/category-tree endpoint alongside
    GetItemDetails, so you don't have to click through every category by
    hand in DevTools to find departmentId values.

    I have no way to browse keellssuper.com myself to confirm the real
    endpoint name, so this tries several plausible candidates used by
    similar WebV2-style storefront APIs and reports which ones respond
    with something other than a 404/empty body. Inspect the returned
    dict yourself - whichever key has real category/department data in
    its 'preview' is the one to build a proper parser around.
    """
    cookie = cookie or os.environ.get("KEELLS_COOKIE", "")
    if not cookie:
        raise RuntimeError("Set KEELLS_COOKIE first (see module docstring).")

    root = "https://zebraliveback.keellssuper.com/2.0/WebV2/"
    candidates = [
        "GetDepartments",
        "GetDepartmentList",
        "GetMenu",
        "GetCategoryTree",
        "GetCategories",
        "GetSubDepartments",
        "GetOutletDepartments",
    ]

    headers = _build_headers(cookie, user_session_id)
    results = {}
    for name in candidates:
        url = root + name
        try:
            resp = requests.get(url, headers=headers, timeout=timeout)
        except requests.RequestException as e:
            results[name] = {"error": str(e)}
            continue

        entry = {"status_code": resp.status_code}
        if resp.status_code == 200:
            try:
                body = resp.json()
                entry["preview"] = str(body)[:500]
            except ValueError:
                entry["preview"] = resp.text[:200]
        results[name] = entry
        print(f"[keells] probe {name}: {resp.status_code}")
        time.sleep(random.uniform(0.8, 1.5))

    return results


def main():
    all_records: list[KeellsProductRecord] = []
    for department_id in DEPARTMENT_IDS:
        records = fetch_all_for_department(department_id, max_pages=25)
        all_records.extend(records)
        time.sleep(random.uniform(2.0, 4.0))  # be polite between departments too

    save_to_supabase(all_records)


if __name__ == "__main__":
    main()