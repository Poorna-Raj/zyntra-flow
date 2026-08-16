"""
daraz_category_aggregate.py

Rolls up Daraz's product-level Supabase table into daily category-
level (query-level) trending signals. Reads from and writes to Supabase.

Reads:  Supabase table "daraz_catalog_client"
Writes: Supabase table "daraz_category_daily"

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

RAW_TABLE = "daraz_catalog_client"
OUTPUT_TABLE = "daraz_category_daily"
PAGE_SIZE = 1000

TOP_N_FOR_HOT_SIGNAL = 10


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


def safe_int(value):
    try:
        if value in (None, ""):
            return None
        return int(value)
    except (ValueError, TypeError):
        return None


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
        key = (row.get("query", ""), str(row.get("scraped_date", "")))
        groups[key].append(row)

    output = []
    for (query, scraped_date), group_rows in sorted(groups.items()):
        if not query:
            continue

        ranks = [safe_int(r.get("rank")) for r in group_rows]
        ranks = [r for r in ranks if r is not None]

        sold_counts = [safe_float(r.get("sold_count_numeric")) for r in group_rows]
        sold_counts = [s for s in sold_counts if s is not None]

        prices = [safe_float(r.get("price")) for r in group_rows]
        prices = [p for p in prices if p is not None]

        ratings = [safe_float(r.get("rating_score")) for r in group_rows]
        ratings = [rt for rt in ratings if rt is not None]

        discount_flags = [1 if safe_float(r.get("discount_pct")) else 0 for r in group_rows]

        ranked_rows = [r for r in group_rows if safe_int(r.get("rank")) is not None]
        sorted_by_rank = sorted(ranked_rows, key=lambda r: safe_int(r.get("rank")))
        top_n = sorted_by_rank[:TOP_N_FOR_HOT_SIGNAL]
        top_n_sold = [safe_float(r.get("sold_count_numeric")) for r in top_n]
        top_n_sold = [s for s in top_n_sold if s is not None]

        output.append({
            "category": query,
            "scraped_date": scraped_date,
            "product_count": len(group_rows),
            "avg_rank": round(mean(ranks), 1) if ranks else None,
            "top10_avg_sold": round(mean(top_n_sold), 1) if top_n_sold else None,
            "total_sold_estimate": round(sum(sold_counts), 1) if sold_counts else None,
            "avg_price": round(mean(prices), 2) if prices else None,
            "min_price": round(min(prices), 2) if prices else None,
            "max_price": round(max(prices), 2) if prices else None,
            "discount_rate": round(mean(discount_flags), 3) if discount_flags else None,
            "avg_rating": round(mean(ratings), 2) if ratings else None,
        })

    return output


def replace_table_contents(client: Client, table_name: str, rows: list[dict]):
    if not rows:
        print(f"[daraz-agg] no rows to write - leaving {table_name} untouched.")
        return

    client.table(table_name).delete().gte("scraped_date", "2000-01-01").execute()

    for i in range(0, len(rows), PAGE_SIZE):
        batch = rows[i:i + PAGE_SIZE]
        client.table(table_name).insert(batch).execute()

    print(f"[daraz-agg] wrote {len(rows)} category-day rows -> Supabase.{table_name}")


def main():
    client = get_client()

    rows = load_rows(client)
    if not rows:
        print(f"[daraz-agg] {RAW_TABLE} has 0 rows in Supabase - nothing to aggregate.")
        return
    print(f"[daraz-agg] loaded {len(rows)} product rows from Supabase.{RAW_TABLE}")

    agg_rows = aggregate(rows)
    replace_table_contents(client, OUTPUT_TABLE, agg_rows)

    categories = sorted(set(r["category"] for r in agg_rows))
    dates = sorted(set(r["scraped_date"] for r in agg_rows))
    print(f"[daraz-agg] categories covered: {categories}")
    print(f"[daraz-agg] dates covered: {dates}")


if __name__ == "__main__":
    main()