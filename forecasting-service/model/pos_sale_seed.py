"""
pos_seed.py

Connects directly to the POS Supabase project and generates sample
sales + sale_items for every active product, spread across the last
4 weeks - so pos_market_adjusted_forecast.py has real data to compute
a baseline forecast from.

Pulls real store_id from products, real cashier_id from profiles, and
real product_id values from products - inserts directly via the
Supabase client, no CSV/manual import step needed.

WARNING: This inserts real rows into your POS database. Only run this
against a dev/test project, not production data.

Install:
    pip install supabase python-dotenv
"""

import os
import random
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client


def _load_env():
    """Loads every .env found walking upward from this script's own
    folder, not just the first one - avoids a stray/incomplete .env in
    a closer folder silently shadowing the real one."""
    here = Path(__file__).resolve().parent
    found_any = False
    for folder in [here, *here.parents]:
        candidate = folder / ".env"
        if candidate.exists():
            load_dotenv(candidate)
            print(f"[seed] loaded .env from {candidate}")
            found_any = True
    if not found_any:
        print("[seed] WARNING: no .env file found searching upward from this script.")


_load_env()

FORECAST_SUPABASE_URL = os.getenv("FORECAST_SUPABASE_URL")
FORECAST_SUPABASE_SERVICE_KEY = os.getenv("FORECAST_SUPABASE_SERVICE_KEY")

WEEKS_OF_HISTORY = 4
MIN_SALES_PER_PRODUCT = 3
MAX_SALES_PER_PRODUCT = 10
MIN_QTY = 1
MAX_QTY = 8
INSERT_BATCH_SIZE = 500

PAYMENT_METHODS = ["cash", "card", "bank_transfer", "mobile_payment"]


def get_client() -> Client:
    if not FORECAST_SUPABASE_URL or not FORECAST_SUPABASE_SERVICE_KEY:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY missing from .env")
    return create_client(FORECAST_SUPABASE_URL,FORECAST_SUPABASE_SERVICE_KEY)


def load_all(client: Client, table: str, select: str = "*") -> list[dict]:
    rows, start, page = [], 0, 1000
    while True:
        resp = client.table(table).select(select).range(start, start + page - 1).execute()
        batch = resp.data
        if not batch:
            break
        rows.extend(batch)
        if len(batch) < page:
            break
        start += page
    return rows


def random_timestamp_in_last_n_weeks(weeks: int) -> str:
    now = datetime.utcnow()
    seconds_back = random.randint(0, weeks * 7 * 24 * 3600)
    ts = now - timedelta(seconds=seconds_back)
    return ts.isoformat()


def safe_float(value, default=0.0) -> float:
    try:
        if value in (None, ""):
            return default
        return float(value)
    except (ValueError, TypeError):
        return default


def main():
    client = get_client()

    print("[seed] loading profiles and active products...")
    profiles = load_all(client, "profiles", select="id")
    products = load_all(client, "products",
                         select="id,store_id,name,sku,price,cost_price,is_active")

    active_products = [p for p in products if p.get("is_active")]

    if not profiles:
        print("[seed] no profiles found - create at least one user/profile first (cashier_id needs one).")
        return
    if not active_products:
        print("[seed] no active products found - nothing to generate sales for.")
        return

    cashier_id = profiles[0]["id"]
    print(f"[seed] found {len(profiles)} profile(s), {len(active_products)} active product(s). "
          f"Using cashier_id={cashier_id} for all generated sales.")

    sales_rows = []
    sale_item_rows_by_sale = {}

    for product in active_products:
        store_id = product["store_id"]
        price = safe_float(product.get("price"))
        cost_price = safe_float(product.get("cost_price"))

        num_sales = random.randint(MIN_SALES_PER_PRODUCT, MAX_SALES_PER_PRODUCT)

        for _ in range(num_sales):
            quantity = random.randint(MIN_QTY, MAX_QTY)
            item_total = round(price * quantity, 2)
            created_at = random_timestamp_in_last_n_weeks(WEEKS_OF_HISTORY)

            sale_row = {
                "store_id": store_id,
                "cashier_id": cashier_id,
                "subtotal": item_total,
                "discount": 0,
                "tax": 0,
                "total": item_total,
                "payment_method": random.choice(PAYMENT_METHODS),
                "status": "completed",
                "created_at": created_at,
                "cash_received": item_total,
                "change_amount": 0,
            }
            # receipt_number is left out - it has a DB default sequence,
            # let Postgres generate it rather than risk a collision.

            sales_rows.append(sale_row)
            # Keep the matching sale_item payload alongside, keyed by
            # the row's position - filled in with the real sale_id
            # once the sales insert returns it below.
            sale_item_rows_by_sale[len(sales_rows) - 1] = {
                "product_id": product["id"],
                "product_name": product["name"],
                "sku": product.get("sku") or None,
                "quantity": quantity,
                "unit_price": price,
                "cost_price": cost_price,
                "discount": 0,
                "total": item_total,
            }

    print(f"[seed] inserting {len(sales_rows)} sales in batches of {INSERT_BATCH_SIZE}...")

    sale_items_to_insert = []
    sales_created = 0

    for batch_start in range(0, len(sales_rows), INSERT_BATCH_SIZE):
        batch = sales_rows[batch_start:batch_start + INSERT_BATCH_SIZE]
        resp = client.table("sales").insert(batch).execute()
        inserted = resp.data
        sales_created += len(inserted)

        # Supabase preserves insert order in its response, so position i
        # in `inserted` corresponds to position (batch_start + i) in
        # sales_rows - use that to attach the real sale_id to the
        # matching sale_item payload.
        for i, sale in enumerate(inserted):
            original_index = batch_start + i
            item = sale_item_rows_by_sale[original_index]
            item["sale_id"] = sale["id"]
            sale_items_to_insert.append(item)

    print(f"[seed] {sales_created} sales inserted. Inserting "
          f"{len(sale_items_to_insert)} sale_items in batches of {INSERT_BATCH_SIZE}...")

    sale_items_created = 0
    for batch_start in range(0, len(sale_items_to_insert), INSERT_BATCH_SIZE):
        batch = sale_items_to_insert[batch_start:batch_start + INSERT_BATCH_SIZE]
        client.table("sale_items").insert(batch).execute()
        sale_items_created += len(batch)

    print(f"[seed] done - {sales_created} sales and {sale_items_created} sale_items "
          f"created across {len(active_products)} products, spread over the last "
          f"{WEEKS_OF_HISTORY} weeks.")


if __name__ == "__main__":
    main()