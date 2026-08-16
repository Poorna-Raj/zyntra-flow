"""
spar_catalog_client.py

Pulls the full product catalog from SPAR Sri Lanka's Shopify store via
the standard, PUBLIC, unauthenticated Shopify /products.json endpoint -
no session cookies, no encryption, no bot detection dance. This is a
built-in feature of every Shopify store, not a reverse-engineered API.

Confirmed endpoint:
  GET https://spar2u.lk/products.json?limit=250&page=N
  -> { "products": [ { id, title, handle, product_type, vendor, tags,
       created_at, updated_at, variants: [ { price, compare_at_price,
       available, sku, title (variant/size), ... } ], images: [...] } ] }

NOTE ON STOCK/DEMAND SIGNALS:
Shopify's public products.json does NOT expose exact inventory counts
or a sold-count field (Shopify treats that as private data) - so this
is less rich than what we got from Cargills (exact Inventory numbers)
or Daraz (itemSoldCntShow). What IS available and useful:
  - variants[].available (True/False) - a binary in-stock flag. Track
    this over time (daily runs) the same way as everything else, and
    "flips to False often" or "stays False for a long stretch" is
    itself a demand signal, same logic as the Keells out-of-stock-
    frequency idea from earlier in this pipeline.
  - variants[].compare_at_price vs .price - when compare_at_price is
    set and higher than price, the item is discounted. Track discount
    frequency per item as a secondary signal.
  - created_at - lets you flag genuinely new products entering the
    catalog.

Pagination: Shopify caps at 250 products per page; loop pages until an
empty result comes back.

Install:
    pip install requests
"""

import csv
import time
import random
from dataclasses import dataclass, asdict, field
from datetime import date
from pathlib import Path
from typing import Optional
from supabase_writer import get_client, upsert_records

import requests

BASE_URL = "https://spar2u.lk"
PRODUCTS_ENDPOINT = f"{BASE_URL}/products.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json",
}


@dataclass
class SparProductRecord:
    source: str = "spar"
    product_id: int = 0
    title: str = ""
    handle: str = ""
    product_type: str = ""
    vendor: str = ""
    tags: str = ""            # comma-joined, tags is a list in the raw data
    variant_id: int = 0
    variant_title: str = ""   # size/option, e.g. "WT / 1000"
    sku: str = ""
    price: Optional[float] = None
    compare_at_price: Optional[float] = None
    is_discounted: bool = False
    available: Optional[bool] = None
    product_created_at: str = ""
    product_updated_at: str = ""
    scraped_date: str = field(default_factory=lambda: date.today().isoformat())


def fetch_products_page(page: int, limit: int = 250) -> list[dict]:
    resp = requests.get(
        PRODUCTS_ENDPOINT,
        params={"limit": limit, "page": page},
        headers=HEADERS,
        timeout=20,
    )
    resp.raise_for_status()
    data = resp.json()
    return data.get("products", [])


def fetch_all_products(max_pages: int = 50, delay_range=(1.0, 2.5)) -> list[dict]:
    """Loops pages until an empty result. max_pages is a safety cap."""
    all_products = []
    for page in range(1, max_pages + 1):
        try:
            products = fetch_products_page(page)
        except requests.RequestException as e:
            print(f"[spar] request failed on page {page}: {e}")
            break

        if not products:
            print(f"[spar] page {page} empty - reached the end of the catalog.")
            break

        all_products.extend(products)
        print(f"[spar] page {page}: {len(products)} products "
              f"(total so far: {len(all_products)})")

        time.sleep(random.uniform(*delay_range))

    return all_products


def extract_records(products: list[dict]) -> list[SparProductRecord]:
    records = []
    for product in products:
        tags = ", ".join(product.get("tags", []))
        for variant in product.get("variants", []):
            price = float(variant["price"]) if variant.get("price") else None
            compare_at = (
                float(variant["compare_at_price"])
                if variant.get("compare_at_price") else None
            )
            is_discounted = bool(compare_at and price and compare_at > price)

            records.append(SparProductRecord(
                product_id=product.get("id", 0),
                title=product.get("title", ""),
                handle=product.get("handle", ""),
                product_type=product.get("product_type", ""),
                vendor=product.get("vendor", ""),
                tags=tags,
                variant_id=variant.get("id", 0),
                variant_title=variant.get("title", ""),
                sku=variant.get("sku", ""),
                price=price,
                compare_at_price=compare_at,
                is_discounted=is_discounted,
                available=variant.get("available"),
                product_created_at=product.get("created_at", ""),
                product_updated_at=product.get("updated_at", ""),
            ))
    return records


def save_to_supabase(records: list[SparProductRecord]) -> None:
    client = get_client()
    upsert_records(
        client, "spar_catalog_client", records,
        on_conflict="variant_id,scraped_date",
    )


def main():
    print("[spar] fetching full product catalog...")
    products = fetch_all_products()
    print(f"[spar] fetched {len(products)} products total.")

    records = extract_records(products)
    print(f"[spar] extracted {len(records)} product-variant rows.")

    save_to_supabase(records)


if __name__ == "__main__":
    main()