"""
keells_category_trend.py

Rolls up Keells' product-level Supabase table into daily category-level
trending signals. Reads from and writes to Supabase.

FIX (this version): the raw table's department_code field is a bare
single-letter code (e.g. "V", "B", "C") set by Keells' own API on each
item - NOT the same thing as the human-readable department names you
filled into DEPARTMENT_IDS in keells_catalog_client.py (that dict is
keyed by department_id, a different field, used only for discovery).
Grouping directly by department_code was producing junk single-letter
category rows in the final report. This version maps each code to a
real category name (derived from the sample items seen during the
department-ID discovery sweep) before grouping, and drops codes with
no sensible grocery-category mapping (gift vouchers, electronics)
entirely rather than reporting them as junk.

Reads:  Supabase table "keells_catalog_snapshot"   (raw, one row per product per scrape)
Writes: Supabase table "keells_category_daily"      (one row per category per day)

Per (category, scraped_date):
  - product_count, available_rate, selling_today_rate, featured_rate,
    sponsored_rate, promotion_rate, avg_stock_in_hand, avg_average_sale,
    avg_price, avg_discount_value

Recomputes fully from the raw table every run and REPLACES the entire
keells_category_daily table's contents.

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

RAW_TABLE = "keells_catalog_client"
OUTPUT_TABLE = "keells_category_daily"

PAGE_SIZE = 1000

# department_code (raw, single-letter field on each item) -> real
# category name, derived from sample items captured during the
# department-ID discovery sweep. Codes not listed here (e.g. "U" - Gift
# Vouchers, "D03" - Electronics) are intentionally excluded from the
# rollup entirely - not relevant to a grocery restocking model.
# VERIFY against your own discovery results if this ever looks off -
# these were inferred from one sample item per code, not confirmed
# with your team.
DEPARTMENT_CODE_MAP = {
    "B": "Beverages",
    "C": "Dairy",
    "S": "Seafood",              # sample was "Cleaned Handella" - a fish, not a cleaning product
    "D": "Frozen & Desserts",
    "F": "Snacks & Confectionery",
    "G": "Grocery",
    "H": "Health & Beauty",
    "T": "Sauces & Condiments",
    "M": "Meats",
    "K": "Bakery",
    "V": "Vegetables",
}


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


def to_bool(value) -> bool:
    return str(value).strip().upper() == "TRUE"


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
    skipped_codes = defaultdict(int)

    for row in rows:
        raw_code = row.get("department_code", "")
        category = DEPARTMENT_CODE_MAP.get(raw_code)
        if not category:
            skipped_codes[raw_code] += 1
            continue
        key = (category, row.get("scraped_date", ""))
        groups[key].append(row)

    if skipped_codes:
        print(f"[keells-cat] excluded {sum(skipped_codes.values())} row(s) with "
              f"unmapped department_code(s): {dict(skipped_codes)} - add them to "
              f"DEPARTMENT_CODE_MAP if they're actually grocery-relevant.")

    output = []
    for (category, scraped_date), group_rows in sorted(groups.items()):
        available_flags = [1 if to_bool(r.get("is_available")) else 0 for r in group_rows]
        selling_today_flags = [1 if to_bool(r.get("is_selling_today")) else 0 for r in group_rows]
        featured_flags = [1 if to_bool(r.get("is_featured")) else 0 for r in group_rows]
        sponsored_flags = [1 if to_bool(r.get("is_sponsored")) else 0 for r in group_rows]
        promotion_flags = [1 if to_bool(r.get("is_promotion_applied")) else 0 for r in group_rows]

        stock_vals = [safe_float(r.get("stock_in_hand")) for r in group_rows]
        stock_vals = [s for s in stock_vals if s is not None]

        avg_sale_vals = [safe_float(r.get("average_sale")) for r in group_rows]
        avg_sale_vals = [s for s in avg_sale_vals if s is not None]

        prices = [safe_float(r.get("price")) for r in group_rows]
        prices = [p for p in prices if p is not None]

        discounts = [safe_float(r.get("discount_value")) for r in group_rows]
        discounts = [d for d in discounts if d is not None]

        output.append({
            "category": category,
            "scraped_date": scraped_date,
            "product_count": len(group_rows),
            "available_rate": round(mean(available_flags), 3) if available_flags else None,
            "selling_today_rate": round(mean(selling_today_flags), 3) if selling_today_flags else None,
            "featured_rate": round(mean(featured_flags), 3) if featured_flags else None,
            "sponsored_rate": round(mean(sponsored_flags), 3) if sponsored_flags else None,
            "promotion_rate": round(mean(promotion_flags), 3) if promotion_flags else None,
            "avg_stock_in_hand": round(mean(stock_vals), 2) if stock_vals else None,
            "avg_average_sale": round(mean(avg_sale_vals), 3) if avg_sale_vals else None,
            "avg_price": round(mean(prices), 2) if prices else None,
            "avg_discount_value": round(mean(discounts), 2) if discounts else None,
        })

    return output


def replace_table_contents(client: Client, table_name: str, rows: list[dict]):
    if not rows:
        print(f"[keells-cat] no rows to write - leaving {table_name} untouched.")
        return

    client.table(table_name).delete().gte("scraped_date", "2000-01-01").execute()

    for i in range(0, len(rows), PAGE_SIZE):
        batch = rows[i:i + PAGE_SIZE]
        client.table(table_name).insert(batch).execute()

    print(f"[keells-cat] wrote {len(rows)} category-day rows -> Supabase.{table_name}")


def main():
    client = get_client()

    rows = load_rows(client)
    if not rows:
        print(f"[keells-cat] {RAW_TABLE} has 0 rows in Supabase - nothing to aggregate.")
        return
    print(f"[keells-cat] loaded {len(rows)} product rows from Supabase.{RAW_TABLE}")

    agg_rows = aggregate(rows)
    replace_table_contents(client, OUTPUT_TABLE, agg_rows)

    categories = sorted(set(r["category"] for r in agg_rows))
    print(f"[keells-cat] categories covered: {categories}")


if __name__ == "__main__":
    main()