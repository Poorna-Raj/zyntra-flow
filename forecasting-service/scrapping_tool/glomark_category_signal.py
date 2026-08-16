"""
glomark_category_trend.py

Rolls up Glomark's product-level Supabase table into daily category-
level trending signals. Reads from and writes to Supabase.

FIX (this version): Glomark's raw 'category' field is very granular
(~120 distinct values seen in real data - e.g. "Cheese", "Curd", "Milk
Foods", "Pasteurized Liquid Milk" as four SEPARATE categories that
should really all roll up under "Dairy"). Grouping directly by the raw
value was producing a report with ~120 near-duplicate rows instead of
a clean set of canonical categories comparable to Cargills/SPAR/Daraz.
This version maps each raw subcategory to one canonical bucket before
grouping, and drops non-grocery subcategories (E-Vouchers, Batteries &
Chargers, Pet Care, Stationery, etc.) entirely rather than reporting
them as noise.

CANONICAL_CATEGORY_MAP is a manual lookup built from every raw
category value seen in a real Glomark snapshot during this project -
if a NEW raw category value shows up that isn't in this dict, it gets
counted and reported as "unmapped" at the end of the run (not silently
dropped) so you know to add it rather than losing data quietly.

Reads:  Supabase table "glomark_signals"          (raw, one row per product per scrape)
Writes: Supabase table "glomark_category_daily"    (one row per category per day)

Per (category, scraped_date):
  - product_count, out_of_stock_rate, new_product_rate, promo_rate,
    avg_promo_discount_pct, avg_stock, avg_price, avg_branch_count,
    avg_total_branch_stock

NOTE ON branch_stocks: unchanged from the previous version - Glomark
exposes a per-branch stock breakdown (JSON list of {branchId, stock}
per product). If branch IDs can be mapped to real locations/provinces,
this could support real province-level signal beyond just category
level - worth revisiting with your team.

Recomputes fully from the raw table every run and REPLACES the entire
glomark_category_daily table's contents.

Install:
    pip install supabase python-dotenv
"""

import json
import os
from collections import defaultdict
from statistics import mean

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

RAW_TABLE = "glomark_signals"
OUTPUT_TABLE = "glomark_category_daily"

PAGE_SIZE = 1000

# Raw Glomark 'category' value -> canonical bucket, aligned with the
# category names used across Cargills/SPAR/Daraz. Values mapped to
# None are intentionally excluded (not grocery-relevant to a
# restocking model). Built from every distinct raw category value
# observed in a real Glomark snapshot during this project.
CANONICAL_CATEGORY_MAP = {
    # Baby
    "Baby Food": "Baby Products",
    "Baby Need": "Baby Products",
    # Health & Beauty
    "Beauty Accessories": "Health & Beauty",
    "Beauty Otc & Natural Beauty Care": "Health & Beauty",
    "Color Cosmetics": "Health & Beauty",
    "Dermatological": "Health & Beauty",
    "Facial Care": "Health & Beauty",
    "Female Fragrances": "Health & Beauty",
    "Hair Care": "Health & Beauty",
    "Oral Care": "Health & Beauty",
    "Personal Hygiene": "Health & Beauty",
    "Skin Care": "Health & Beauty",
    "Toiletries Men": "Health & Beauty",
    "Contraceptive Agents": "Health & Beauty",
    "Herbal Remedies": "Health & Beauty",
    "Neuro Muscular System": "Health & Beauty",
    "Respiratory System": "Health & Beauty",
    "Special Health": "Health & Beauty",
    # Bakery
    "Bread": "Bakery",
    "Buns": "Bakery",
    "Cake": "Bakery",
    # Cooking Essentials & Spices
    "Cereals": "Cooking Essentials & Spices",
    "Pulses": "Cooking Essentials & Spices",
    "Essentials": "Cooking Essentials & Spices",
    "Seasoning": "Cooking Essentials & Spices",
    "Sauce": "Cooking Essentials & Spices",
    "Condiments": "Cooking Essentials & Spices",
    "Oil / Fat": "Cooking Essentials & Spices",
    "Pasta": "Cooking Essentials & Spices",
    "Spreads": "Cooking Essentials & Spices",
    "Dessert & Baking": "Cooking Essentials & Spices",
    "Desserts": "Cooking Essentials & Spices",
    "Soups": "Cooking Essentials & Spices",
    # Dairy
    "Cheese": "Dairy",
    "Processed Cheese": "Dairy",
    "Cream": "Dairy",
    "Curd": "Dairy",
    "Milk Foods": "Dairy",
    "Pasteurized Liquid Milk": "Dairy",
    "FROZEN CHEESE": "Dairy",
    "Eggs": "Dairy",
    # Beverages
    "Chocolate & Malt Drinks": "Beverages",
    "Malt": "Beverages",
    "Juices": "Beverages",
    "Fruit Drinks": "Beverages",
    "Soft Drinks": "Beverages",
    "Water": "Beverages",
    "Concentrated Fruit Drink": "Beverages",
    "Non Alcoholic Beer & Wine": "Beverages",
    "READY TO DRINK": "Beverages",
    "Rtd Single Consumption": "Beverages",
    "Sport & Energy Drinks": "Beverages",
    "SPORT AND ENERGY": "Beverages",
    # Household & Cleaning
    "Bedding & Bed Linen": "Household & Cleaning",
    "Cleaning Consumables": "Household & Cleaning",
    "Cleaning Durables": "Household & Cleaning",
    "Disposables": "Household & Cleaning",
    "Laundry": "Household & Cleaning",
    "Paper Goods": "Household & Cleaning",
    "Plastic & Storage": "Household & Cleaning",
    "Pest Control": "Household & Cleaning",
    "Kitchen & Dining": "Household & Cleaning",
    # Snacks & Confectionery
    "Confectionary": "Snacks & Confectionery",
    "Cookies": "Snacks & Confectionery",
    "Savoury": "Snacks & Confectionery",
    "Snacks": "Snacks & Confectionery",
    "Sweet": "Snacks & Confectionery",
    "Sweets & Snacks": "Snacks & Confectionery",
    # Meat & Seafood
    "Fish": "Meat & Seafood",
    "PRESERVED / PROCESSES FISH": "Meat & Seafood",
    "Preserved / Processed Fish": "Meat & Seafood",
    "Processed / Preserved Fish": "Meat & Seafood",
    "Meat": "Meat & Seafood",
    "Preserved / Processed Meat": "Meat & Seafood",
    "Processed / Preserved Meat": "Meat & Seafood",
    # Frozen Food
    "Frozen RTE Ready Meals": "Frozen Food",
    "Frozen Ready To Eat Meals": "Frozen Food",
    "Frozen Ready To Cook Snacks": "Frozen Food",
    "Frozen Rtc Snacks": "Frozen Food",
    "FROZEN COCONUT": "Frozen Food",
    "Ready To Cook": "Frozen Food",
    # Vegetables / Fruits
    "Vegetable": "Vegetables",
    "Processed/ Preserved Vegetables": "Vegetables",
    "Processed/Preserved Vegetable & Fruit": "Vegetables",
    "Fruits": "Fruits",
    "Processed/ Preserved Fruits": "Fruits",
    # Explicitly excluded - not grocery-relevant to a restocking model
    "Batteries & Chargers": None,
    "Car Care": None,
    "E-Vouchers": None,
    "GLOGREEN Bag - Large": None,
    "GLOGREEN Bag - Small": None,
    "Gardening & Bbq": None,
    "Illumination & Lighting": None,
    "Party-Ware": None,
    "Pet Care": None,
    "Stationery & Office Supplies": None,
    "Travel Accessories": None,
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


def parse_branch_stocks(raw) -> list[dict]:
    if not raw:
        return []
    if isinstance(raw, list):
        return raw
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return []


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
    excluded_count = 0
    unmapped = defaultdict(int)

    for row in rows:
        raw_category = row.get("category", "")
        if raw_category not in CANONICAL_CATEGORY_MAP:
            unmapped[raw_category] += 1
            continue

        canonical = CANONICAL_CATEGORY_MAP[raw_category]
        if canonical is None:
            excluded_count += 1
            continue

        key = (canonical, row.get("scraped_date", ""))
        groups[key].append(row)

    if excluded_count:
        print(f"[glomark-cat] excluded {excluded_count} row(s) from non-grocery "
              f"categories (Pet Care, Stationery, etc.) by design.")
    if unmapped:
        print(f"[glomark-cat] WARNING: {sum(unmapped.values())} row(s) had a "
              f"category value not in CANONICAL_CATEGORY_MAP - these were "
              f"dropped, not silently merged. Add them to the map: "
              f"{dict(unmapped)}")

    output = []
    for (category, scraped_date), group_rows in sorted(groups.items()):
        oos_flags = [1 if to_bool(r.get("is_out_of_stock")) else 0 for r in group_rows]
        new_flags = [1 if to_bool(r.get("is_new")) else 0 for r in group_rows]

        promo_prices = [safe_float(r.get("promo_price")) for r in group_rows]
        promo_flags = [1 if p else 0 for p in promo_prices]

        promo_pcts = [safe_float(r.get("promo_rate")) for r in group_rows]
        promo_pcts = [p for p in promo_pcts if p]

        stocks = [safe_float(r.get("stock")) for r in group_rows]
        stocks = [s for s in stocks if s is not None]

        prices = [safe_float(r.get("price")) for r in group_rows]
        prices = [p for p in prices if p is not None]

        branch_counts = []
        branch_totals = []
        for r in group_rows:
            branches = parse_branch_stocks(r.get("branch_stocks"))
            if branches:
                branch_counts.append(len(branches))
                branch_totals.append(sum(safe_float(b.get("stock"), 0) or 0 for b in branches))

        output.append({
            "category": category,
            "scraped_date": scraped_date,
            "product_count": len(group_rows),
            "out_of_stock_rate": round(mean(oos_flags), 3) if oos_flags else None,
            "new_product_rate": round(mean(new_flags), 3) if new_flags else None,
            "promo_rate": round(mean(promo_flags), 3) if promo_flags else None,
            "avg_promo_discount_pct": round(mean(promo_pcts), 1) if promo_pcts else None,
            "avg_stock": round(mean(stocks), 1) if stocks else None,
            "avg_price": round(mean(prices), 2) if prices else None,
            "avg_branch_count": round(mean(branch_counts), 1) if branch_counts else None,
            "avg_total_branch_stock": round(mean(branch_totals), 1) if branch_totals else None,
        })

    return output


def replace_table_contents(client: Client, table_name: str, rows: list[dict]):
    if not rows:
        print(f"[glomark-cat] no rows to write - leaving {table_name} untouched.")
        return

    client.table(table_name).delete().gte("scraped_date", "2000-01-01").execute()

    for i in range(0, len(rows), PAGE_SIZE):
        batch = rows[i:i + PAGE_SIZE]
        client.table(table_name).insert(batch).execute()

    print(f"[glomark-cat] wrote {len(rows)} category-day rows -> Supabase.{table_name}")


def main():
    client = get_client()

    rows = load_rows(client)
    if not rows:
        print(f"[glomark-cat] {RAW_TABLE} has 0 rows in Supabase - nothing to aggregate.")
        return
    print(f"[glomark-cat] loaded {len(rows)} product rows from Supabase.{RAW_TABLE}")

    agg_rows = aggregate(rows)
    replace_table_contents(client, OUTPUT_TABLE, agg_rows)

    categories = sorted(set(r["category"] for r in agg_rows))
    print(f"[glomark-cat] categories covered: {categories}")


if __name__ == "__main__":
    main()