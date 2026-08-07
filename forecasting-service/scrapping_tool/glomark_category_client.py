"""
glomark_catalog_client.py

Pulls the full product catalog straight from Glomark's own AJAX
product-search JSON API instead of rendering pages with Playwright.
This endpoint returns already-structured JSON (no HTML parsing needed).

Confirmed response shape (from the documented API contract):
  products_list[]          - products for this page
    .id, .erpCode, .name
    .stock, .unit
    .price, .promoPrice, .promoRate, .applicablePrice
    .isNew, .isOutOfStock
    .department.name
    .categoryDetails.name
    .subCategoryDetails.name
    .brandDetails.name
    .barcodes[]
    .branchStocks[]         - per-branch stock breakdown, kept as JSON text
  pagination.totalCount      - drives when pagination is complete

Image fields (image / image_url) are intentionally ignored - they're
not needed for the catalog snapshot and only bloat the CSV.

Install:
    pip install requests
"""

import csv
import json
import random
import time
from dataclasses import dataclass, asdict, field
from datetime import date
from pathlib import Path
from typing import Optional

import requests

BASE_URL = "https://glomark.lk/ajax/product-search/0"

HEADERS = {
    "Accept": "application/json",
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Referer": "https://glomark.lk/",
    "X-Requested-With": "XMLHttpRequest",
}

PAGE_LIMIT = 60

# How many times to retry a single page before giving up on it and
# moving on. Kept modest - Glomark's endpoint is generally reliable,
# this just smooths over the occasional dropped connection.
MAX_RETRIES = 3


@dataclass
class GlomarkProductRecord:
    source: str = "glomark"
    product_id: str = ""
    erp_code: str = ""
    name: str = ""
    brand: str = ""
    department: str = ""
    category: str = ""
    sub_category: str = ""
    unit: str = ""
    stock: int = 0
    price: Optional[float] = None
    promo_price: Optional[float] = None
    promo_rate: Optional[float] = None
    applicable_price: Optional[float] = None
    barcode: str = ""              # comma-separated barcodes
    branch_stocks: str = ""        # JSON string, e.g. '[{"branchId":400,"stock":19}]'
    is_new: Optional[bool] = None
    is_out_of_stock: Optional[bool] = None
    scraped_date: str = field(default_factory=lambda: date.today().isoformat())


def fetch_catalog_page(offset: int, limit: int = PAGE_LIMIT) -> dict:
    """One call to Glomark's product-search JSON API. Retries a few
    times on transient network failures, then raises."""
    params = {
        "pagination": "true",
        "offset": offset,
        "limit": limit,
        "data": "true",
        "sortBy[searchPriority]": "ASC",
    }

    last_error: Optional[Exception] = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(BASE_URL, params=params, headers=HEADERS, timeout=20)
            resp.raise_for_status()
            return resp.json()
        except requests.RequestException as e:
            last_error = e
            print(f"[glomark] request failed for offset={offset} "
                  f"(attempt {attempt}/{MAX_RETRIES}): {e}")
            if attempt < MAX_RETRIES:
                time.sleep(random.uniform(1.5, 3.0) * attempt)

    raise last_error  # type: ignore[misc]


def extract_records(payload: dict) -> list[GlomarkProductRecord]:
    items = payload.get("products_list", [])
    records = []
    for item in items:
        department = (item.get("department") or {}).get("name", "")
        category = (item.get("categoryDetails") or {}).get("name", "")
        sub_category = (item.get("subCategoryDetails") or {}).get("name", "")
        brand = (item.get("brandDetails") or {}).get("name", "")

        barcodes = item.get("barcodes") or []
        barcode = ",".join(str(b) for b in barcodes if b)

        branch_stocks = item.get("branchStocks") or []
        branch_stocks_json = json.dumps(branch_stocks)

        records.append(GlomarkProductRecord(
            product_id=str(item.get("id", "")),
            erp_code=item.get("erpCode", ""),
            name=item.get("name", ""),
            brand=brand,
            department=department,
            category=category,
            sub_category=sub_category,
            unit=item.get("unit", ""),
            stock=int(item["stock"]) if item.get("stock") is not None else 0,
            price=float(item["price"]) if item.get("price") is not None else None,
            promo_price=float(item["promoPrice"]) if item.get("promoPrice") is not None else None,
            promo_rate=float(item["promoRate"]) if item.get("promoRate") is not None else None,
            applicable_price=float(item["applicablePrice"]) if item.get("applicablePrice") is not None else None,
            barcode=barcode,
            branch_stocks=branch_stocks_json,
            is_new=item.get("isNew"),
            is_out_of_stock=item.get("isOutOfStock"),
        ))
    return records


def fetch_all_products(limit: int = PAGE_LIMIT, delay_range=(1.0, 3.0)) -> list[GlomarkProductRecord]:
    """Paginates through the entire catalog using offset/limit, stopping
    once pagination.totalCount products have been collected."""
    all_records: list[GlomarkProductRecord] = []
    offset = 0
    total_count: Optional[int] = None

    while True:
        try:
            payload = fetch_catalog_page(offset=offset, limit=limit)
        except requests.RequestException as e:
            print(f"[glomark] giving up on offset={offset} after {MAX_RETRIES} attempts: {e}")
            break

        if total_count is None:
            total_count = payload.get("pagination", {}).get("totalCount", 0)
            print(f"[glomark] total products reported by API: {total_count}")

        page_records = extract_records(payload)
        if not page_records:
            print(f"[glomark] no items at offset={offset} - stopping pagination.")
            break

        all_records.extend(page_records)
        print(f"[glomark] offset={offset}: {len(page_records)} items "
              f"(total so far: {len(all_records)}/{total_count})")

        offset += limit

        if total_count and len(all_records) >= total_count:
            break

        time.sleep(random.uniform(*delay_range))

    return all_records


def save_csv(records: list[GlomarkProductRecord], out_path: str, append: bool = False):
    """append=True writes the header only if the file doesn't exist yet,
    then adds new rows below whatever's already there - so a scheduled
    run builds up history over time instead of erasing yesterday's data."""
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    if not records:
        print("[glomark] no records to save.")
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
    print(f"[glomark] {action} {len(records)} records -> {out_path}")


def main():
    all_records = fetch_all_products()
    save_csv(all_records, "dataset/glomark_catalog_snapshot.csv", append=False)


if __name__ == "__main__":
    main()