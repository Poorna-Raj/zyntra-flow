"""
pos_market_adjusted_forecast.py

Cross-database forecast blender:

  1. Reads each POS store's recent sale history (from the POS Supabase
     project) to compute a baseline weekly-units forecast per product,
     using a simple trailing average - no ML, since we don't control
     how much sales history exists per store and a simple average is
     honest and explainable regardless of history depth.

  2. Reads the market-level category demand/stock signal (from the
     forecasting Supabase project, via restock_signal.py's existing
     scoring logic) for the category each POS product belongs to.

  3. Applies a transparent, rule-based adjustment factor to the
     baseline forecast based on that market signal - e.g. a category
     the wider market is showing HIGH demand + LOW STOCK ALERT nudges
     a shop's own forecast upward, on the logic that market-wide
     demand spikes and depletion are a leading indicator, not just
     noise, even for a single shop's own limited sales history.

  4. Writes the blended result to market_adjusted_forecasts in the
     POS database - so the shop owner sees ONE forecast number, with
     the market context stored alongside it for transparency.

Category matching: POS categories.name is matched against the
forecasting DB's category labels by case-insensitive exact match. A
product whose category doesn't match anything in the market signal
data gets NO adjustment (factor 1.0) rather than a guessed one - this
is logged, not hidden, so unmatched categories are visible and fixable
over time (e.g. by renaming a POS category to match).

Install:
    pip install pandas supabase python-dotenv
"""

import os
from datetime import date, datetime, timedelta
from typing import Optional

import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

POS_SUPABASE_URL = os.getenv("POS_SUPABASE_URL")
POS_SUPABASE_SERVICE_KEY = os.getenv("POS_SUPABASE_SERVICE_KEY")

FORECAST_SUPABASE_URL = os.getenv("FORECAST_SUPABASE_URL")
FORECAST_SUPABASE_SERVICE_KEY = os.getenv("FORECAST_SUPABASE_SERVICE_KEY")

PAGE_SIZE = 1000
SALES_HISTORY_WEEKS = 4          # trailing window used for the baseline average
OUTPUT_TABLE = "market_adjusted_forecasts"

# ==================================================
# Rule-based adjustment factors - transparent, not learned.
# Multiplied together: adjusted = base * demand_multiplier * stock_multiplier
# ==================================================
DEMAND_MULTIPLIERS = {
    "HIGH": 1.15,
    "MEDIUM": 1.00,
    "LOW": 0.85,
}
STOCK_MULTIPLIERS = {
    "LOW STOCK ALERT": 1.05,   # market-wide depletion - treat as a demand signal, nudge up
    "WATCH": 1.00,
    "STABLE": 1.00,
}


def get_pos_client() -> Client:
    if not POS_SUPABASE_URL or not POS_SUPABASE_SERVICE_KEY:
        raise RuntimeError("POS_SUPABASE_URL / POS_SUPABASE_SERVICE_KEY missing from .env")
    return create_client(POS_SUPABASE_URL, POS_SUPABASE_SERVICE_KEY)


def get_forecast_client() -> Client:
    if not FORECAST_SUPABASE_URL or not FORECAST_SUPABASE_SERVICE_KEY:
        raise RuntimeError("FORECAST_SUPABASE_URL / FORECAST_SUPABASE_SERVICE_KEY missing from .env")
    return create_client(FORECAST_SUPABASE_URL, FORECAST_SUPABASE_SERVICE_KEY)


def load_all_rows(client: Client, table_name: str, select: str = "*") -> list[dict]:
    all_rows = []
    start = 0
    while True:
        resp = client.table(table_name).select(select).range(start, start + PAGE_SIZE - 1).execute()
        batch = resp.data
        if not batch:
            break
        all_rows.extend(batch)
        if len(batch) < PAGE_SIZE:
            break
        start += PAGE_SIZE
    return all_rows


# ==================================================
# Step 1: POS sales history -> baseline forecast per product
# ==================================================

def load_pos_context(pos_client: Client) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Pulls products, categories, and recent completed sale_items
    (joined with sales for created_at + status) from the POS DB."""
    products = pd.DataFrame(load_all_rows(pos_client, "products"))
    categories = pd.DataFrame(load_all_rows(pos_client, "categories"))

    cutoff = (datetime.utcnow() - timedelta(weeks=SALES_HISTORY_WEEKS)).isoformat()

    sales = pd.DataFrame(
        load_all_rows(
            pos_client, "sales",
            select="id,store_id,status,created_at",
        )
    )
    if not sales.empty:
        sales = sales[
            (sales["status"] == "completed") & (sales["created_at"] >= cutoff)
        ]

    sale_items = pd.DataFrame(load_all_rows(pos_client, "sale_items"))

    return products, categories, sales.merge(
        sale_items, left_on="id", right_on="sale_id", suffixes=("_sale", "_item")
    ) if not sales.empty and not sale_items.empty else pd.DataFrame()


def compute_baseline_forecast(products: pd.DataFrame, categories: pd.DataFrame,
                               sale_items_joined: pd.DataFrame) -> pd.DataFrame:
    """
    One row per active product: trailing average weekly units sold,
    plus its category name (joined from categories.id) for matching
    against the forecasting DB's market signal.

    Products with zero sales in the trailing window still get a row -
    base_forecast_units = 0, not dropped - since a "no adjustment
    applied" forecast is still meaningful (e.g. a genuinely new
    product), and dropping them would silently hide products that
    might actually benefit most from a market-driven nudge upward.
    """
    if products.empty:
        return pd.DataFrame()

    active_products = products[products["is_active"] == True].copy()  # noqa: E712

    if not sale_items_joined.empty:
        weekly_units = (
            sale_items_joined.groupby("product_id")["quantity"]
            .sum()
            .div(SALES_HISTORY_WEEKS)
            .rename("base_forecast_units")
        )
    else:
        weekly_units = pd.Series(dtype=float, name="base_forecast_units")

    merged = active_products.merge(
        weekly_units, left_on="id", right_index=True, how="left"
    )
    merged["base_forecast_units"] = merged["base_forecast_units"].fillna(0.0)

    if not categories.empty:
        merged = merged.merge(
            categories[["id", "name"]].rename(columns={"id": "category_id", "name": "category_name"}),
            on="category_id", how="left",
        )
    else:
        merged["category_name"] = None

    return merged[["id", "store_id", "name", "category_name", "base_forecast_units"]].rename(
        columns={"id": "product_id", "name": "product_name"}
    )


# ==================================================
# Step 2: Forecasting DB -> market demand/stock signal per category
# (reuses restock_signal.py's own scoring logic against the second DB)
# ==================================================

def load_market_signal(forecast_client: Client) -> pd.DataFrame:
    """
    Imports and reuses restock_signal.py's build_recommendations() -
    same scoring logic already validated earlier, just pointed at the
    forecasting Supabase client instead of duplicating the formulas
    here. Requires restock_signal.py to be importable (same folder or
    on the Python path).
    """
    from restock_signal import build_recommendations

    signal_df = build_recommendations(forecast_client)
    if signal_df.empty:
        print("[pos-forecast] market signal is empty - no adjustment will "
              "be applied to any product this run.")
        return pd.DataFrame(columns=["category_key", "demand_signal", "stock_signal"])

    signal_df = signal_df.copy()
    signal_df["category_key"] = signal_df["category"].str.strip().str.lower()
    return signal_df[["category_key", "demand_signal", "stock_signal"]]


# ==================================================
# Step 3: Blend
# ==================================================

def next_week_start(today: Optional[date] = None) -> date:
    today = today or date.today()
    days_until_monday = (7 - today.weekday()) % 7 or 7
    return today + timedelta(days=days_until_monday)


def blend_forecast(baseline: pd.DataFrame, market_signal: pd.DataFrame) -> pd.DataFrame:
    if baseline.empty:
        return baseline

    baseline = baseline.copy()
    baseline["category_key"] = baseline["category_name"].fillna("").str.strip().str.lower()

    merged = baseline.merge(market_signal, on="category_key", how="left")

    unmatched = merged[merged["demand_signal"].isna()]["category_name"].dropna().unique()
    if len(unmatched) > 0:
        print(f"[pos-forecast] no market signal match for categories: "
              f"{sorted(unmatched)} - these products get adjustment_factor=1.0 "
              f"(no change), not a guessed adjustment.")

    merged["demand_multiplier"] = merged["demand_signal"].map(DEMAND_MULTIPLIERS).fillna(1.0)
    merged["stock_multiplier"] = merged["stock_signal"].map(STOCK_MULTIPLIERS).fillna(1.0)
    merged["adjustment_factor"] = merged["demand_multiplier"] * merged["stock_multiplier"]
    merged["adjusted_forecast_units"] = (
        merged["base_forecast_units"] * merged["adjustment_factor"]
    ).round(2)

    merged["forecast_week"] = next_week_start().isoformat()

    return merged.rename(columns={"category_name": "category"})[[
        "store_id", "product_id", "product_name", "category",
        "base_forecast_units", "demand_signal", "stock_signal",
        "demand_multiplier", "stock_multiplier", "adjustment_factor",
        "adjusted_forecast_units", "forecast_week",
    ]].rename(columns={"demand_signal": "market_demand_signal", "stock_signal": "market_stock_signal"})


# ==================================================
# Step 4: Write back to POS DB
# ==================================================

def write_forecasts(pos_client: Client, rows: list[dict]) -> None:
    if not rows:
        print("[pos-forecast] no rows to write.")
        return

    # Clean NaN -> None on the plain dicts (not the DataFrame) - a
    # DataFrame's float64 columns silently keep NaN even after
    # .where()/.fillna(None), same issue hit in top_products_by_category.py.
    rows = [
        {k: (None if isinstance(v, float) and pd.isna(v) else v) for k, v in row.items()}
        for row in rows
    ]

    for i in range(0, len(rows), PAGE_SIZE):
        batch = rows[i:i + PAGE_SIZE]
        pos_client.table(OUTPUT_TABLE).upsert(batch, on_conflict="product_id,forecast_week").execute()

    print(f"[pos-forecast] upserted {len(rows)} rows -> POS.{OUTPUT_TABLE}")


def main():
    pos_client = get_pos_client()
    forecast_client = get_forecast_client()

    print("[pos-forecast] loading POS sales history...")
    products, categories, sale_items_joined = load_pos_context(pos_client)
    print(f"[pos-forecast] {len(products)} products, {len(categories)} categories, "
          f"{len(sale_items_joined)} recent completed sale-item rows loaded.")

    baseline = compute_baseline_forecast(products, categories, sale_items_joined)
    if baseline.empty:
        print("[pos-forecast] no active products found - nothing to forecast.")
        return

    print("[pos-forecast] loading market demand signal...")
    market_signal = load_market_signal(forecast_client)

    blended = blend_forecast(baseline, market_signal)

    rows = blended.to_dict(orient="records")
    write_forecasts(pos_client, rows)


if __name__ == "__main__":
    main()