"""
cargills_playwright_client.py

Sidesteps the ASP.NET session/delivery-cookie problem entirely: instead
of trying to replicate Cargills' server-side session state with plain
HTTP requests, this drives a real Playwright browser (which naturally
picks up whatever delivery/pincode selection the site requires) and
just listens for the real GetMenuCategoryItemsPagingV3 network response,
reading its JSON directly - no manual cookie/session/encryption
replication needed at all.

Category list itself still comes from GetCategoriesV1 via plain requests
(confirmed working cookie-less earlier) - only the per-category item
fetch needs a real browser.

FIRST RUN IS DIAGNOSTIC: Cargills likely shows a delivery-location/pincode
picker on a fresh browser profile (no saved cookies) - a real user only
sees this once, but every fresh Playwright context looks "new" to the
site. This script tries a few generic strategies to dismiss it and prints
what it finds; if the site doesn't visibly need it, that's fine too -
either way, check the debug screenshot after the first run.

Install:
    pip install playwright requests
    playwright install chromium
"""

import asyncio
import csv
import random
import time
from dataclasses import dataclass, asdict, field
from datetime import date
from pathlib import Path
from typing import Optional
from urllib.parse import quote

import requests
from playwright.async_api import async_playwright, Page

BASE_URL = "https://cargillsonline.com"
CATEGORIES_ENDPOINT = f"{BASE_URL}/Web/GetCategoriesV1"
ITEMS_URL_MARKER = "GetMenuCategoryItemsPagingV3"

RELEVANT_CATEGORY_NAMES = {
    "Vegetables", "Fruits", "Baby Products", "Dairy", "Beverages",
    "Food Cupboard", "Household", "Cooking Essentials", "Bakery",
    "Frozen Food", "Meats", "Seafood", "Snacks & Confectionery",
    "Rice", "Seeds & Spices", "Desserts & Ingredients", "Tea & Coffee",
}


@dataclass
class CargillsProductRecord:
    source: str = "cargills"
    category: str = ""
    rank_sort: int = 0
    item_name: str = ""
    price: Optional[float] = None
    inventory: Optional[int] = None
    is_active: str = ""
    is_saleable: str = ""
    is_sponsored: str = ""
    sku_code: str = ""
    unit_size: Optional[float] = None
    uom: str = ""
    item_id: int = 0
    scraped_date: str = field(default_factory=lambda: date.today().isoformat())


def fetch_categories() -> list[dict]:
    """Confirmed working via plain HTTP - no browser/session needed for this one."""
    resp = requests.post(CATEGORIES_ENDPOINT, json={}, timeout=20, headers={
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
    })
    resp.raise_for_status()
    return resp.json()


async def handle_pincode_picker(page: Page):
    """
    Best-effort dismissal of a delivery-location picker, if one appears.
    Diagnostic: prints whatever it finds so selectors can be corrected
    after seeing the debug screenshot.
    """
    await page.wait_for_timeout(2000)

    # Try clicking a "Colombo" option if a location list/modal is visible.
    for selector in [
        "text=Colombo",
        "li:has-text('Colombo')",
        "button:has-text('Colombo')",
        "a:has-text('Colombo')",
    ]:
        el = await page.query_selector(selector)
        if el:
            try:
                await el.click()
                print(f"[cargills] clicked location option via selector: {selector}")
                await page.wait_for_timeout(1500)
                break
            except Exception:
                pass

    # Try generic confirm/continue/close buttons in case it's a simpler modal.
    for selector in [
        "button:has-text('Continue')",
        "button:has-text('Confirm')",
        "button:has-text('Select')",
        "button:has-text('Close')",
        "[class*='modal'] button",
        "[class*='popup'] button",
    ]:
        el = await page.query_selector(selector)
        if el:
            try:
                await el.click()
                print(f"[cargills] clicked dismiss/confirm button via selector: {selector}")
                await page.wait_for_timeout(1000)
            except Exception:
                pass


async def capture_category_items(page: Page, url: str, timeout_ms: int = 15000) -> Optional[list[dict]]:
    """
    Navigates to a category URL and captures the JSON body of the real
    GetMenuCategoryItemsPagingV3 response via network interception.
    Returns None if the request never fired within timeout_ms.
    """
    captured: dict = {}

    async def on_response(response):
        if ITEMS_URL_MARKER in response.url and response.request.method == "POST":
            try:
                captured["data"] = await response.json()
                print(f"[cargills] captured {ITEMS_URL_MARKER} response "
                      f"({len(captured['data']) if isinstance(captured['data'], list) else '?'} items)")
            except Exception as e:
                print(f"[cargills] failed to parse captured response as JSON: {e}")

    page.on("response", on_response)

    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=20000)
    except Exception as e:
        print(f"[cargills] navigation failed for {url}: {e}")
        page.remove_listener("response", on_response)
        return None

    # The site's own JS delays this call by ~2s (setTimeout in product.js);
    # give it real headroom, polling instead of one fixed sleep so we don't
    # wait longer than necessary.
    waited = 0
    poll_interval = 500
    while "data" not in captured and waited < timeout_ms:
        await page.wait_for_timeout(poll_interval)
        waited += poll_interval

    page.remove_listener("response", on_response)
    return captured.get("data")


def extract_records(items: list[dict], category_name: str) -> list[CargillsProductRecord]:
    if not items:
        return []
    if len(items) == 1 and items[0].get("ItemName") == "No Products Found":
        print(f"[cargills] '{category_name}': got the 'No Products Found' sentinel "
              f"even via a real browser - worth checking the debug screenshot.")
        return []

    records = []
    for item in items:
        try:
            price = float(str(item["Price"]).replace(",", "")) if item.get("Price") else None
        except (ValueError, TypeError):
            price = None
        records.append(CargillsProductRecord(
            category=category_name,
            rank_sort=int(item.get("Sort", 0)),
            item_name=item.get("ItemName", ""),
            price=price,
            inventory=item.get("Inventory"),
            is_active=item.get("IsActive", ""),
            is_saleable=item.get("IsSaleable", ""),
            is_sponsored=item.get("IsSponsored", ""),
            sku_code=item.get("SKUCODE", ""),
            unit_size=item.get("UnitSize"),
            uom=item.get("UOM", ""),
            item_id=item.get("Id", 0),
        ))
    return records


def save_csv(records: list[CargillsProductRecord], out_path: str, append: bool = True):
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not records:
        print("[cargills] no records to save.")
        return

    file_exists = path.exists()
    mode = "a" if append else "w"
    write_header = not (append and file_exists)

    with open(out_path, mode, newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(asdict(records[0]).keys()))
        if write_header:
            writer.writeheader()
        for r in records:
            writer.writerow(asdict(r))
    action = "appended" if append else "saved"
    print(f"[cargills] {action} {len(records)} records -> {out_path}")


def category_slug(name: str) -> str:
    """Best-effort URL slug, e.g. 'Baby Products' -> 'Baby-Products'.
    Confirmed pattern from a real captured URL. If Cargills' router turns
    out to ignore this segment entirely (likely, since IC/NC query params
    carry the real identifying info), an imperfect slug shouldn't matter -
    but flagging this as a guess in case category pages 404."""
    return quote(name.replace(" ", "-").replace("&", "and"))


async def main():
    print("[cargills] fetching category list (plain HTTP, no browser needed)...")
    categories = fetch_categories()
    print(f"[cargills] found {len(categories)} top-level categories.")

    all_records: list[CargillsProductRecord] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1366, "height": 768},
        )
        page = await context.new_page()
        page.on("console", lambda msg: print(f"[cargills][console:{msg.type}] {msg.text}"))

        print("[cargills] loading homepage to handle any location picker...")
        await page.goto(BASE_URL, wait_until="domcontentloaded", timeout=20000)
        await handle_pincode_picker(page)

        try:
            await page.screenshot(path="cargills_debug_homepage.png", full_page=True)
            print("[cargills] wrote cargills_debug_homepage.png - check this if "
                  "categories keep coming back empty.")
        except Exception as e:
            print(f"[cargills] failed to save debug screenshot: {e}")

        for cat in categories:
            name = cat.get("MenuCategoryName", "")
            if name not in RELEVANT_CATEGORY_NAMES:
                continue

            en_id = cat.get("EnId", "")
            en_name = cat.get("EnMenuCategoryName", "")
            slug = category_slug(name)
            url = f"{BASE_URL}/Product/{slug}?IC={en_id}&NC={en_name}"

            print(f"[cargills] fetching '{name}' -> {url}")
            items = await capture_category_items(page, url)

            if items is None:
                print(f"[cargills] '{name}': no {ITEMS_URL_MARKER} response captured "
                      f"within timeout - the request may not have fired at all.")
                continue

            records = extract_records(items, name)
            all_records.extend(records)
            print(f"[cargills] '{name}': {len(records)} items")

            await page.wait_for_timeout(random.randint(1500, 3000))

        await browser.close()

    save_csv(all_records, "dataset/cargills_signals.csv", append=True)


if __name__ == "__main__":
    asyncio.run(main())