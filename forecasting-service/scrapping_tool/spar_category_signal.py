"""
spar_category_trend.py

Rolls up SPAR's product-variant-level Supabase table into daily
category-level trending signals. Reads from and writes to Supabase.

Reads:  Supabase table "spar_catalog_client"
Writes: Supabase table "spar_category_daily"

Install:
    pip install supabase python-dotenv
"""

import os
from collections import defaultdict
from statistics import mean

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

RAW_TABLE = "spar_catalog_client"
OUTPUT_TABLE = "spar_category_daily"
PAGE_SIZE = 1000


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY missing from .env")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def safe_float(value, default=None):
    try:
        if value in (None, ""):
            return default
        return float(value)
    except (ValueError, TypeError):
        return default


def safe_bool(value) -> bool:
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() == "true"


def load_rows(client: Client) -> list[dict]:
    all_rows = []
    start = 0
    while True:
        resp = client.table(RAW_TABLE).select("*").range(start, start + PAGE_SIZE - 1).execute()
        batch = resp.data
        if not batch:
            break
        all_rows.extend(batch)
        if len(batch) < PAGE_SIZE:
            break
        start += PAGE_SIZE
    return all_rows


def aggregate(rows: list[dict]) -> list[dict]:
    groups = defaultdict(list)
    for row in rows:
        # .get(key, "") only falls back to "" if the KEY is missing -
        # if product_type/scraped_date is present but genuinely NULL
        # in Supabase, .get() returns None, and sorting a tuple with a
        # None mixed among strings raises TypeError. `or ""` catches
        # both the missing-key and the None-value cases.
        key = (row.get("product_type") or "", str(row.get("scraped_date") or ""))
        groups[key].append(row)

    output = []
    for (category, scraped_date), group_rows in sorted(groups.items()):
        if not category:
            continue

        available_flags = [safe_bool(r.get("available")) for r in group_rows]
        out_of_stock_flags = [0 if a else 1 for a in available_flags]

        discount_flags = [1 if safe_bool(r.get("is_discounted")) else 0 for r in group_rows]

        prices = [safe_float(r.get("price")) for r in group_rows]
        prices = [p for p in prices if p is not None]

        output.append({
            "category": category,
            "scraped_date": scraped_date,
            "variant_count": len(group_rows),
            "out_of_stock_rate": round(mean(out_of_stock_flags), 3) if out_of_stock_flags else None,
            "discount_rate": round(mean(discount_flags), 3) if discount_flags else None,
            "avg_price": round(mean(prices), 2) if prices else None,
        })

    return output


def replace_table_contents(client: Client, table_name: str, rows: list[dict]):
    if not rows:
        print(f"[spar-cat] no rows to write - leaving {table_name} untouched.")
        return

    client.table(table_name).delete().gte("scraped_date", "2000-01-01").execute()

    for i in range(0, len(rows), PAGE_SIZE):
        batch = rows[i:i + PAGE_SIZE]
        client.table(table_name).insert(batch).execute()

    print(f"[spar-cat] wrote {len(rows)} category-day rows -> Supabase.{table_name}")


def main():
    client = get_client()

    rows = load_rows(client)
    if not rows:
        print(f"[spar-cat] {RAW_TABLE} has 0 rows in Supabase - nothing to aggregate.")
        return
    print(f"[spar-cat] loaded {len(rows)} product-variant rows from Supabase.{RAW_TABLE}")

    agg_rows = aggregate(rows)
    replace_table_contents(client, OUTPUT_TABLE, agg_rows)

    categories = sorted(set(r["category"] for r in agg_rows))
    print(f"[spar-cat] categories covered: {categories}")


if __name__ == "__main__":
    main()