"""
cargills_category_trend.py

Rolls up Cargills' product-level Supabase table into daily category-
level trending signals. Reads from and writes to Supabase.

Reads:  Supabase table "cargills_catalog_client"
Writes: Supabase table "cargills_category_daily"

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

RAW_TABLE = "cargills_catalog_client"
OUTPUT_TABLE = "cargills_category_daily"

LOW_STOCK_THRESHOLD = 20
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
        key = (row.get("category", ""), str(row.get("scraped_date", "")))
        groups[key].append(row)

    output = []
    for (category, scraped_date), group_rows in sorted(groups.items()):
        # is_active is a status CODE, not a boolean - 0 means active/
        # sellable per Cargills' own system, confirmed earlier.
        active_rows = [r for r in group_rows if r.get("is_active") == 0]

        inventories = [safe_float(r.get("inventory")) for r in active_rows]
        inventories = [i for i in inventories if i is not None]

        low_stock_flags = [1 if (i is not None and i < LOW_STOCK_THRESHOLD) else 0
                            for i in inventories]

        prices = [safe_float(r.get("price")) for r in active_rows]
        prices = [p for p in prices if p is not None]

        ranks = [safe_float(r.get("rank_sort")) for r in group_rows]
        ranks = [r for r in ranks if r is not None]

        output.append({
            "category": category,
            "scraped_date": scraped_date,
            "product_count": len(group_rows),
            "active_count": len(active_rows),
            "avg_inventory": round(mean(inventories), 1) if inventories else None,
            "low_stock_rate": round(mean(low_stock_flags), 3) if low_stock_flags else None,
            "avg_price": round(mean(prices), 2) if prices else None,
            "avg_rank_sort": round(mean(ranks), 1) if ranks else None,
        })

    return output


def replace_table_contents(client: Client, table_name: str, rows: list[dict]):
    if not rows:
        print(f"[cargills-cat] no rows to write - leaving {table_name} untouched.")
        return

    client.table(table_name).delete().gte("scraped_date", "2000-01-01").execute()

    for i in range(0, len(rows), PAGE_SIZE):
        batch = rows[i:i + PAGE_SIZE]
        client.table(table_name).insert(batch).execute()

    print(f"[cargills-cat] wrote {len(rows)} category-day rows -> Supabase.{table_name}")


def main():
    client = get_client()

    rows = load_rows(client)
    if not rows:
        print(f"[cargills-cat] {RAW_TABLE} has 0 rows in Supabase - nothing to aggregate.")
        return
    print(f"[cargills-cat] loaded {len(rows)} product rows from Supabase.{RAW_TABLE}")

    agg_rows = aggregate(rows)
    replace_table_contents(client, OUTPUT_TABLE, agg_rows)

    categories = sorted(set(r["category"] for r in agg_rows))
    print(f"[cargills-cat] categories covered: {categories}")


if __name__ == "__main__":
    main()