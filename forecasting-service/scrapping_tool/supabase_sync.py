"""
supabase_sync.py

Pushes every local CSV in the pipeline - both the 5 raw per-item
snapshots and the 5 category_daily rollups - up to their matching
Supabase tables. Each table upserts on its own unique key so re-running
this (even multiple times for the same day) overwrites that day's rows
instead of creating duplicates.

Handles, per column, across all 10 tables:
  - type casting (str/int/float/bool/date/json) from CSV's raw strings
  - "TRUE"/"FALSE" text -> real booleans
  - ambiguous M/D/YYYY dates -> unambiguous ISO (YYYY-MM-DD) before send
  - Glomark's branch_stocks JSON string -> real jsonb
  - empty cells -> NULL, not the literal empty string

Requires a unique constraint on each table matching its on_conflict
columns below (upsert's ON CONFLICT needs a real constraint to target -
see the ALTER TABLE ... ADD CONSTRAINT ... UNIQUE statements run in
Supabase's SQL Editor before using this script).

Run this as the final phase of the daily pipeline:
    run_all_scrapers.py -> run_all_category_trends.py -> supabase_sync.py

Install:
    pip install supabase python-dotenv
"""

import csv
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Anchored to this script's own folder rather than the current working
# directory, so it works correctly no matter where you run it from.
DATASET_DIR = Path(__file__).resolve().parent / r"C:\Users\User\Downloads\Lokalens\dataset"


# ==================================================
# TYPE CASTING
# ==================================================

def cast_bool(raw: str) -> Optional[bool]:
    if raw is None or raw == "":
        return None
    return str(raw).strip().upper() == "TRUE"


def cast_date(raw: str) -> Optional[str]:
    """
    Every scraper in this pipeline writes dates as ambiguous M/D/YYYY
    (e.g. '8/7/2026'). Parsed explicitly as month-first here since
    that's confirmed to be the scraper's actual output format - do NOT
    let Postgres guess, since DD/MM vs MM/DD is exactly the kind of
    silent, undetected corruption that's easy to miss until a demo.
    Returns unambiguous ISO 'YYYY-MM-DD', or None if unparseable.
    """
    if raw is None or raw == "":
        return None
    raw = raw.strip()
    for fmt in ("%m/%d/%Y", "%Y-%m-%d"):  # accept already-ISO dates too
        try:
            return datetime.strptime(raw, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    print(f"[supabase-sync] WARNING: could not parse date '{raw}' - sending NULL.")
    return None


def cast_timestamptz(raw: str) -> Optional[str]:
    """SPAR's product_created_at/updated_at already include an explicit
    UTC offset (e.g. '2026-08-08T00:37:03+05:30') - unambiguous as-is,
    pass through unchanged."""
    if raw is None or raw == "":
        return None
    return raw


def cast_json(raw: str) -> Optional[Any]:
    """Glomark's branch_stocks column is a JSON-encoded string in the
    CSV; parse it into a real Python object so the Supabase client
    sends proper jsonb, not a JSON-string-inside-a-string."""
    if raw is None or raw == "":
        return None
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return None


def cast_value(raw: str, col_type: str) -> Optional[Any]:
    if raw is None or raw == "":
        return None
    try:
        if col_type == "str":
            return raw
        if col_type == "int":
            return int(float(raw))  # handles "0" and "12.0"-style ints safely
        if col_type == "float":
            return float(raw)
        if col_type == "bool":
            return cast_bool(raw)
        if col_type == "date":
            return cast_date(raw)
        if col_type == "timestamptz":
            return cast_timestamptz(raw)
        if col_type == "json":
            return cast_json(raw)
    except (ValueError, TypeError):
        return None
    return raw


# ==================================================
# TABLE DEFINITIONS
# Each entry: csv_filename -> (supabase_table_name, on_conflict_columns, column_type_map)
# Table names here match the LIVE schema currently in Supabase.
# ==================================================

TABLES: dict[str, tuple[str, str, dict[str, str]]] = {

    # ---------- category_daily rollups ----------
    "glomark_category_daily.csv": ("glomark_category_daily", "category,scraped_date", {
        "category": "str", "scraped_date": "date", "product_count": "int",
        "out_of_stock_rate": "float", "new_product_rate": "float",
        "promo_rate": "float", "avg_promo_discount_pct": "float",
        "avg_stock": "float", "avg_price": "float",
        "avg_branch_count": "float", "avg_total_branch_stock": "float",
    }),
    "keells_category_daily.csv": ("keells_category_daily", "category,scraped_date", {
        "category": "str", "scraped_date": "date", "product_count": "int",
        "available_rate": "float", "selling_today_rate": "float",
        "featured_rate": "float", "sponsored_rate": "float",
        "promotion_rate": "float", "avg_stock_in_hand": "float",
        "avg_average_sale": "float", "avg_price": "float",
        "avg_discount_value": "float",
    }),
    "spar_category_daily.csv": ("spar_category_daily", "category,scraped_date", {
        "category": "str", "scraped_date": "date", "variant_count": "int",
        "out_of_stock_rate": "float", "discount_rate": "float",
        "avg_price": "float",
    }),
    "cargills_category_daily.csv": ("cargills_category_daily", "category,scraped_date", {
        "category": "str", "scraped_date": "date", "product_count": "int",
        "active_count": "int", "avg_inventory": "float",
        "low_stock_rate": "float", "avg_price": "float",
        "avg_rank_sort": "float",
    }),
    "daraz_category_daily.csv": ("daraz_category_daily", "category,scraped_date", {
        "category": "str", "scraped_date": "date", "product_count": "int",
        "avg_rank": "float", "top10_avg_sold": "float",
        "total_sold_estimate": "float", "avg_price": "float",
        "min_price": "float", "max_price": "float",
        "discount_rate": "float", "avg_rating": "float",
    }),

    # ---------- raw per-item snapshots ----------
    # Table names here are *_catalog_client, matching the live Supabase
    # schema - NOT *_catalog_snapshot / *_signals / *_trending_signals.
    "keells_catalog_snapshot.csv": ("keells_catalog_client", "item_id,scraped_date", {
        "source": "str", "department_id": "int", "page": "int",
        "rank_on_page": "int", "item_id": "int", "item_code": "str",
        "name": "str", "description": "str", "price": "float", "uom": "str",
        "min_qty": "float", "max_qty": "float", "slab_qty": "float",
        "stock_in_hand": "float", "average_sale": "float",
        "is_available": "bool", "is_selling_today": "bool",
        "is_featured": "bool", "is_sponsored": "bool",
        "is_promotion_applied": "bool", "discount_value": "float",
        "promotion_discount_value": "float", "discounted_total": "float",
        "department_code": "str", "sub_department_code": "str",
        "category_code": "str", "image_url": "str", "merchant_id": "int",
        "scraped_date": "date",
    }),
    "daraz_trending_signals.csv": ("daraz_catalog_client", "item_id,query,scraped_date", {
        "source": "str", "query": "str", "rank": "int", "name": "str",
        "price": "float", "original_price": "float", "discount_pct": "float",
        "rating_score": "float", "review_count": "int",
        "sold_count_raw": "str", "sold_count_numeric": "float",
        "in_stock": "bool", "location": "str", "item_url": "str",
        "sku": "str", "item_id": "int", "scraped_date": "date",
    }),
    "spar_signals.csv": ("spar_catalog_client", "variant_id,scraped_date", {
        "source": "str", "product_id": "int", "title": "str", "handle": "str",
        "product_type": "str", "vendor": "str", "tags": "str",
        "variant_id": "int", "variant_title": "str", "sku": "str",
        "price": "float", "compare_at_price": "float",
        "is_discounted": "bool", "available": "bool",
        "product_created_at": "timestamptz", "product_updated_at": "timestamptz",
        "scraped_date": "date",
    }),
    "glomark_catalog_snapshot.csv": ("glomark_catalog_client", "product_id,scraped_date", {
        "source": "str", "product_id": "int", "erp_code": "str", "name": "str",
        "brand": "str", "department": "str", "category": "str",
        "sub_category": "str", "unit": "str", "stock": "float",
        "price": "float", "promo_price": "float", "promo_rate": "float",
        "applicable_price": "float", "barcode": "str",
        "branch_stocks": "json", "is_new": "bool", "is_out_of_stock": "bool",
        "scraped_date": "date",
    }),
    "cargills_signals.csv": ("cargills_catalog_client", "item_id,scraped_date", {
        "source": "str", "category": "str", "rank_sort": "float",
        "item_name": "str", "price": "float", "inventory": "float",
        "is_active": "int", "is_saleable": "bool", "is_sponsored": "bool",
        "sku_code": "str", "unit_size": "float", "uom": "str",
        "item_id": "int", "scraped_date": "date",
    }),
}


# ==================================================
# SYNC LOGIC
# ==================================================

def load_and_cast_rows(csv_path: Path, column_types: dict[str, str]) -> list[dict]:
    with open(csv_path, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for raw_row in reader:
            row = {
                col: cast_value(raw_row.get(col, ""), col_type)
                for col, col_type in column_types.items()
            }
            rows.append(row)
        return rows


def sync_table(client: Client, csv_filename: str, table_name: str,
                on_conflict: str, column_types: dict[str, str]) -> None:
    csv_path = DATASET_DIR / csv_filename

    if not csv_path.exists():
        print(f"[supabase-sync] {csv_filename} not found at {csv_path} - skipping.")
        return

    rows = load_and_cast_rows(csv_path, column_types)
    if not rows:
        print(f"[supabase-sync] {csv_filename} has no rows - skipping.")
        return

    # Batch in chunks of 500 - keeps individual requests reasonably
    # sized as daraz_trending_signals.csv in particular grows past
    # several thousand rows over the coming days.
    BATCH_SIZE = 500
    total_upserted = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        client.table(table_name).upsert(batch, on_conflict=on_conflict).execute()
        total_upserted += len(batch)

    print(f"[supabase-sync] {table_name}: upserted {total_upserted} rows "
          f"from {csv_filename}.")


def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("[supabase-sync] SUPABASE_URL / SUPABASE_SERVICE_KEY missing "
              "from .env - aborting.")
        sys.exit(1)

    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    failures = []
    for csv_filename, (table_name, on_conflict, column_types) in TABLES.items():
        try:
            sync_table(client, csv_filename, table_name, on_conflict, column_types)
        except Exception as e:
            print(f"[supabase-sync] FAILED syncing {csv_filename} -> "
                  f"{table_name}: {e}")
            failures.append(table_name)

    if failures:
        print(f"[supabase-sync] sync run complete WITH FAILURES: {failures}")
        sys.exit(1)

    print("[supabase-sync] sync run complete - all tables synced.")


if __name__ == "__main__":
    main()