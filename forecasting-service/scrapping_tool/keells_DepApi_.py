"""
keells_discover_departments.py

Standalone helper to find Keells' full list of valid departmentId values,
so keells_catalog_client.py's DEPARTMENT_IDS dict can be filled in beyond
just the one (16 = Vegetables) captured so far.

Two strategies, run one after another:
  1. Probe a handful of likely category-tree/menu endpoint names
     alongside the known-working GetItemDetails endpoint - if any of
     these exist, they'd hand back the full department list in one
     clean call.
  2. Brute-force sweep departmentId 1-40 directly against the endpoint
     we already KNOW works (GetItemDetails) - more reliable than
     guessing endpoint names, since we're reusing a call that's
     confirmed functional and just varying one parameter. Any ID that
     returns real items is a valid department; its first item's
     departmentCode/name gives you a label to put in DEPARTMENT_IDS.

Requires the same cookie as keells_catalog_client.py - either set
KEELLS_COOKIE in your environment, or in a .env file (this script loads
that automatically via python-dotenv if present).

Install:
    pip install requests python-dotenv
"""

import json
import os
import time
import random
from typing import Optional

import requests

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("[keells-discover] python-dotenv not installed - .env file won't "
          "be read automatically. Either `pip install python-dotenv`, or "
          "set KEELLS_COOKIE manually with $env:KEELLS_COOKIE = '...'")

BASE_ROOT = "https://zebraliveback.keellssuper.com/2.0/WebV2/"
ITEM_DETAILS_URL = BASE_ROOT + "GetItemDetails"
DEFAULT_OUTLET_CODE = "SCDR"


def _extract_session_id(cookie: str) -> Optional[str]:
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
    if session_id:
        headers["usersessionid"] = session_id
    return headers


def get_cookie() -> str:
    cookie = os.environ.get("KEELLS_COOKIE", "")
    if not cookie:
        raise RuntimeError(
            "KEELLS_COOKIE is not set. Either add it to a .env file in this "
            "folder (KEELLS_COOKIE=...) or run: "
            "$env:KEELLS_COOKIE = 'your cookie string'"
        )
    return cookie


def probe_candidate_endpoints(cookie: str, timeout: int = 15) -> dict:
    """Strategy 1: try a handful of plausible category/menu endpoint names."""
    candidates = [
        "GetDepartments",
        "GetDepartmentList",
        "GetMenu",
        "GetCategoryTree",
        "GetCategories",
        "GetSubDepartments",
        "GetOutletDepartments",
    ]

    headers = _build_headers(cookie)
    results = {}
    print("[keells-discover] --- Strategy 1: probing candidate endpoint names ---")
    for name in candidates:
        url = BASE_ROOT + name
        try:
            resp = requests.get(url, headers=headers, timeout=timeout)
        except requests.RequestException as e:
            results[name] = {"error": str(e)}
            print(f"[keells-discover] {name}: request error - {e}")
            continue

        entry = {"status_code": resp.status_code}
        if resp.status_code == 200:
            try:
                body = resp.json()
                entry["preview"] = str(body)[:500]
                print(f"[keells-discover] {name}: 200 OK - preview: {entry['preview'][:150]}")
            except ValueError:
                entry["preview"] = resp.text[:200]
                print(f"[keells-discover] {name}: 200 OK but not JSON - "
                      f"preview: {entry['preview'][:150]}")
        else:
            print(f"[keells-discover] {name}: {resp.status_code}")
        results[name] = entry
        time.sleep(random.uniform(0.8, 1.5))

    return results


def sweep_department_ids(
    cookie: str,
    id_range=range(1, 41),
    outlet_code: str = DEFAULT_OUTLET_CODE,
    timeout: int = 20,
) -> dict:
    """Strategy 2: brute-force each departmentId against the endpoint we
    already know works. Returns {department_id: {"item_count": N,
    "sample_item_name": "...", "department_code": "..."}} for every ID
    that returned real items."""
    headers = _build_headers(cookie)
    found = {}

    print(f"\n[keells-discover] --- Strategy 2: sweeping departmentId "
          f"{id_range.start}-{id_range.stop - 1} against GetItemDetails ---")

    for dept_id in id_range:
        params = {
            "pageNo": 1,
            "itemsPerPage": 5,   # small - we only need to confirm it has items
            "outletCode": f"{outlet_code}    ",
            "departmentId": dept_id,
            "subDepartmentId": "",
            "categoryId": "",
            "itemDescription": "    ",
            "itemPricefrom": 0,
            "itemPriceTo": 5000,
            "isFeatured": 0,
            "isPromotionOnly": "false    ",
            "promotionCategory": "",
            "sortBy": "default",
            "BrandId": "",
            "storeName": "    ",
            "subDeaprtmentCode": "",
            "isShowOutofStockItems": "true",
            "brandName": "",
        }

        try:
            resp = requests.get(ITEM_DETAILS_URL, params=params, headers=headers, timeout=timeout)
            resp.raise_for_status()
            payload = resp.json()
        except requests.RequestException as e:
            print(f"[keells-discover] dept {dept_id}: request failed - {e}")
            time.sleep(random.uniform(1.0, 2.0))
            continue
        except ValueError:
            print(f"[keells-discover] dept {dept_id}: response wasn't valid JSON")
            time.sleep(random.uniform(1.0, 2.0))
            continue

        item_result = payload.get("result", {}).get("itemDetailResult", {})
        items = item_result.get("itemDetails", [])
        page_count = item_result.get("pageCount", 0)

        if items:
            sample = items[0]
            found[dept_id] = {
                "item_count_this_page": len(items),
                "total_pages_reported": page_count,
                "sample_item_name": sample.get("name", ""),
                "department_code": sample.get("departmentCode", ""),
            }
            print(f"[keells-discover] dept {dept_id}: FOUND - "
                  f"{page_count} pages, sample item: '{sample.get('name', '')}' "
                  f"(departmentCode={sample.get('departmentCode', '')})")
        else:
            print(f"[keells-discover] dept {dept_id}: empty - likely not a valid department")

        time.sleep(random.uniform(1.2, 2.5))

    return found


def main():
    cookie = get_cookie()

    endpoint_results = probe_candidate_endpoints(cookie)

    dept_results = sweep_department_ids(cookie)

    print("\n[keells-discover] ================ SUMMARY ================")
    print(f"[keells-discover] Valid department IDs found: {sorted(dept_results.keys())}")
    print("\n[keells-discover] Copy this into keells_catalog_client.py's "
          "DEPARTMENT_IDS dict:")
    print("DEPARTMENT_IDS = {")
    for dept_id, info in sorted(dept_results.items()):
        code = info["department_code"] or "unknown"
        sample = info["sample_item_name"]
        print(f'    {dept_id}: "{code}",  # sample item: {sample}')
    print("}")

    # Also dump full results to a JSON file for reference, in case any
    # candidate endpoints from Strategy 1 turned out to be useful too.
    with open("keells_department_discovery_results.json", "w", encoding="utf-8") as f:
        json.dump({
            "candidate_endpoints": endpoint_results,
            "department_sweep": dept_results,
        }, f, indent=2)
    print("\n[keells-discover] Full results also saved to "
          "keells_department_discovery_results.json")


if __name__ == "__main__":
    main()