"""
daraz_catalog_client.py

Pulls trending-signal data straight from Daraz's own catalog JSON API
instead of rendering pages with Playwright. This endpoint is unsigned
(no sign= param, unlike the mtop.lazada.* API) so a plain HTTP GET works.

Confirmed response shape (from a real captured response):
  mods.listItems[]        - products, already ordered by the active sort
    .name, .price, .originalPrice, .discount
    .ratingScore, .review
    .itemSoldCntShow       - e.g. "865 sold", "46.5K sold" -> demand signal
    .inStock
    .location              - shipping origin province
    .itemUrl               - relative product URL
    .image                 - UNCONFIRMED: assumed key for the listing
                              thumbnail, same //cdn... shape as itemUrl.
                              Verify against a real captured payload
                              before relying on this in production.
    .sku, .skuId, .itemId
  mods.sortBar.sortItems[] - confirms sort=popularity / priceasc / pricedesc
  mainInfo.totalResults, mainInfo.pageSize, mainInfo.page

Position in listItems under sort=popularity IS the trending rank -
no DOM scraping, no rank-guessing required.

Writes:
  - dataset/daraz_trending_signals.csv  (local append-only backup/audit trail)
  - Supabase table "daraz_catalog_client" (source of truth for
    daraz_province_prediction.py - requires SUPABASE_URL and
    SUPABASE_SERVICE_KEY in .env)

Install:
    pip install requests supabase python-dotenv
"""

import csv
import os
import re
import time
import random
from dataclasses import dataclass, asdict, field
from datetime import date
from pathlib import Path
from typing import Optional

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
DB_TABLE = "daraz_catalog_client"
DB_PAGE_SIZE = 500

BASE_URL = "https://www.daraz.lk/catalog/"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.daraz.lk/",
}

# Grocery/household search terms relevant to a restocking model - NOT
# Daraz's full category tree (electronics, fashion, etc. are irrelevant
# here). Expand this list as needed; each term becomes one or more
# catalog API calls.
GROCERY_QUERIES = [
    "rice", "dhal", "sugar", "salt", "flour", "milk powder",
    "tea", "coffee", "coconut oil", "cooking oil", "biscuits",
    "noodles", "instant noodles", "spices", "curry powder",
    "soap", "shampoo", "washing powder", "dishwashing liquid",
    "toothpaste", "baby diapers", "sanitary napkins",
]


@dataclass
class TrendingProductRecord:
    source: str = "daraz"
    query: str = ""
    rank: int = 0
    name: str = ""
    price: Optional[float] = None
    original_price: Optional[float] = None
    discount_pct: Optional[float] = None
    rating_score: Optional[float] = None
    review_count: Optional[int] = None
    sold_count_raw: str = ""       # "865 sold", "46.5K sold" - kept as-is
    sold_count_numeric: Optional[float] = None  # parsed estimate, see _parse_sold_count
    in_stock: Optional[bool] = None
    location: str = ""
    item_url: str = ""
    image_url: str = ""
    sku: str = ""
    item_id: str = ""
    scraped_date: str = field(default_factory=lambda: date.today().isoformat())


def _parse_sold_count(raw: str) -> Optional[float]:
    """'865 sold' -> 865.0, '46.5K sold' -> 46500.0, '' -> None."""
    if not raw:
        return None
    match = re.match(r"([\d.]+)\s*(K)?\s*sold", raw, re.IGNORECASE)
    if not match:
        return None
    value = float(match.group(1))
    if match.group(2):
        value *= 1000
    return value


def fetch_catalog_page(query: str, page: int = 1, sort: str = "popularity") -> dict:
    """One call to Daraz's catalog JSON API. Raises on non-200/invalid JSON."""
    params = {
        "ajax": "true",
        "q": query,
        "page": page,
        "sort": sort,
    }
    resp = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    return resp.json()


def extract_records(payload: dict, query: str) -> list[TrendingProductRecord]:
    items = payload.get("mods", {}).get("listItems", [])
    records = []
    for rank, item in enumerate(items, start=1):
        discount_raw = item.get("discount", "")  # e.g. "5% Off"
        discount_pct = None
        if discount_raw:
            m = re.match(r"([\d.]+)%", discount_raw)
            if m:
                discount_pct = float(m.group(1))

        review_raw = item.get("review", "")
        review_count = int(review_raw) if str(review_raw).isdigit() else None

        rating_raw = item.get("ratingScore", "")
        rating_score = float(rating_raw) if rating_raw else None

        sold_raw = item.get("itemSoldCntShow", "")

        # NOT in the "confirmed response shape" notes at the top of this
        # file - "image" is the typical key Daraz's catalog API uses for
        # listing thumbnails (same //cdn... protocol-relative shape as
        # itemUrl), but this hasn't been verified against a captured
        # payload the way the other fields were. Print item.keys() on one
        # real response and confirm before relying on this in production;
        # if the real key differs (e.g. "imgUrl", "image_url"), swap it
        # below - everything downstream (dataclass field, CSV column,
        # Supabase column) already expects "image_url" either way.
        raw_image = item.get("image", "")
        image_url = "https:" + raw_image if raw_image.startswith("//") else raw_image

        records.append(TrendingProductRecord(
            query=query,
            rank=rank,
            name=item.get("name", ""),
            price=float(item["price"]) if item.get("price") else None,
            original_price=float(item["originalPrice"]) if item.get("originalPrice") else None,
            discount_pct=discount_pct,
            rating_score=rating_score,
            review_count=review_count,
            sold_count_raw=sold_raw,
            sold_count_numeric=_parse_sold_count(sold_raw),
            in_stock=item.get("inStock"),
            location=item.get("location", ""),
            item_url="https:" + item["itemUrl"] if item.get("itemUrl", "").startswith("//") else item.get("itemUrl", ""),
            image_url=image_url,
            sku=item.get("sku", ""),
            item_id=item.get("itemId", ""),
        ))
    return records


def fetch_all_for_query(query: str, max_pages: int = 3, delay_range=(1.5, 3.5)) -> list[TrendingProductRecord]:
    """Fetches up to max_pages of results for one query, sorted by popularity."""
    all_records: list[TrendingProductRecord] = []
    for page in range(1, max_pages + 1):
        try:
            payload = fetch_catalog_page(query, page=page, sort="popularity")
        except requests.RequestException as e:
            print(f"[daraz] request failed for '{query}' page {page}: {e}")
            break

        page_records = extract_records(payload, query)
        if not page_records:
            print(f"[daraz] no items for '{query}' page {page} - stopping pagination.")
            break

        # keep global rank across pages, not reset per page
        offset = (page - 1) * len(page_records)
        for r in page_records:
            r.rank += offset

        all_records.extend(page_records)
        print(f"[daraz] '{query}' page {page}: {len(page_records)} items "
              f"(total so far: {len(all_records)})")

        no_more = payload.get("mainInfo", {}).get("noMorePages", True)
        if no_more:
            break

        time.sleep(random.uniform(*delay_range))

    return all_records


def save_csv(records: list[TrendingProductRecord], out_path: str, append: bool = False):
    """append=True writes the header only if the file doesn't exist yet,
    then adds new rows below whatever's already there - so a scheduled
    run builds up history over time instead of erasing yesterday's data."""
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not records:
        print("[daraz] no records to save.")
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
    print(f"[daraz] {action} {len(records)} records -> {out_path}")


def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY missing from .env")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def _record_to_db_row(r: TrendingProductRecord) -> dict:
    """Dataclass -> DB row dict. Field names already match
    daraz_catalog_client's columns 1:1 (see the CREATE TABLE), except
    item_id needs a type fix: the dataclass keeps it as str (Daraz's
    JSON isn't guaranteed to send a clean int), but the column is
    bigint - so it's cast here, at the DB boundary, rather than
    upstream where the raw string is still useful for debugging."""
    row = asdict(r)
    raw_item_id = row.get("item_id")
    try:
        row["item_id"] = int(raw_item_id) if raw_item_id not in (None, "") else None
    except (TypeError, ValueError):
        row["item_id"] = None
    return row


def save_to_supabase(records: list[TrendingProductRecord], client: Optional[Client] = None):
    """Appends today's scrape to daraz_catalog_client - no delete, no
    upsert. Every run adds new rows, same as save_csv(append=True), so
    the table accumulates day-over-day history for the trend model in
    daraz_province_prediction.py to fit against."""
    if not records:
        print("[daraz] no records to save to Supabase.")
        return

    client = client or get_supabase_client()
    rows = [_record_to_db_row(r) for r in records]

    for i in range(0, len(rows), DB_PAGE_SIZE):
        batch = rows[i:i + DB_PAGE_SIZE]
        client.table(DB_TABLE).insert(batch).execute()

    print(f"[daraz] saved {len(rows)} records -> Supabase.{DB_TABLE}")


def main():
    all_records: list[TrendingProductRecord] = []
    for query in GROCERY_QUERIES:
        records = fetch_all_for_query(query, max_pages=2)
        all_records.extend(records)
        time.sleep(random.uniform(2.0, 4.0))  # be polite between queries too

    save_csv(all_records, "dataset/daraz_trending_signals.csv", append=True)
    save_to_supabase(all_records)


if __name__ == "__main__":
    main()