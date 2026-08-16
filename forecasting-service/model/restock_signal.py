"""
restock_signal.py

Model 1: same-day snapshot demand + stock-risk signal per category,
built from the same five Supabase sources as next_week_prediction.py
(Model 2), but deliberately different in scope:

  - next_week_prediction.py fits a trend across several days of
    history and projects 7 days forward.
  - restock_signal.py uses only TODAY's (most recent) snapshot per
    source - no trend fitting, no history requirement - and produces
    TWO separate labels per category instead of one blended score:
      demand_signal: HIGH / MEDIUM / LOW
      stock_signal:  "LOW STOCK ALERT" / "WATCH" / "STABLE"
    kept separate on purpose, since pos_market_adjusted_forecast.py
    (and any other consumer) needs to reason about demand and stock
    risk independently - a category can be HIGH demand and STABLE
    stock (well-supplied, selling well) or HIGH demand and LOW STOCK
    ALERT (selling well AND running out - the most urgent case).

build_recommendations(client) is the public entry point other scripts
import (e.g. pos_market_adjusted_forecast.py) - it does NOT create its
own Supabase client, so it can be pointed at either this project's own
forecasting DB or another one, same as how it's already being called.

Running this file directly also saves its own snapshot to Supabase
(table "restock_signal_report") for standalone viewing/dashboards.

Install:
    pip install pandas numpy supabase python-dotenv
"""

import os
import math
from datetime import datetime, timezone
from typing import Optional

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

SOURCE_TABLES = {
    "glomark": "glomark_category_daily",
    "keells": "keells_category_daily",
    "spar": "spar_category_daily",
    "cargills": "cargills_category_daily",
}
DARAZ_TABLE = "daraz_catalog_client"

OUTPUT_TABLE = "restock_signal_report"

DEMAND_HIGH_THRESHOLD = 0.66
DEMAND_MEDIUM_THRESHOLD = 0.33
STOCK_RISK_HIGH_THRESHOLD = 0.66
STOCK_RISK_MEDIUM_THRESHOLD = 0.33

PAGE_SIZE = 1000


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY missing from .env")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def load_table(client: Client, table_name: str) -> Optional[pd.DataFrame]:
    all_rows = []
    start = 0
    while True:
        resp = client.table(table_name).select("*").range(start, start + PAGE_SIZE - 1).execute()
        batch = resp.data
        if not batch:
            break
        all_rows.extend(batch)
        if len(batch) < PAGE_SIZE:
            break
        start += PAGE_SIZE

    if not all_rows:
        print(f"[restock] {table_name} has 0 rows in Supabase - skipping.")
        return None

    df = pd.DataFrame(all_rows)
    df["scraped_date"] = pd.to_datetime(df["scraped_date"])
    return df


def latest_snapshot(df: pd.DataFrame) -> pd.DataFrame:
    """Filters a table down to its most recent scraped_date only - this
    is a same-day snapshot model, not a trend, so older rows are
    intentionally ignored here (next_week_prediction.py is where the
    full history gets used)."""
    latest_date = df["scraped_date"].max()
    return df[df["scraped_date"] == latest_date].copy()


def minmax_normalize(series: pd.Series) -> pd.Series:
    lo, hi = series.min(), series.max()
    if hi == lo:
        return pd.Series([0.5] * len(series), index=series.index)
    return (series - lo) / (hi - lo)


# ==================================================
# PER-SOURCE: demand_component + stock_risk_component, TODAY only
# Each returns one row per category with both components in [0, 1].
# Higher demand_component = more in-demand. Higher stock_risk_component
# = more likely to run out / already running low.
# ==================================================

def score_glomark(df: pd.DataFrame) -> pd.DataFrame:
    day_df = latest_snapshot(df).set_index("category")
    demand = (
        (1 - minmax_normalize(day_df["promo_rate"])) * 0.5
        + minmax_normalize(day_df["new_product_rate"]) * 0.5
    )
    stock_risk = minmax_normalize(day_df["out_of_stock_rate"])
    return pd.DataFrame({
        "category": day_df.index,
        "demand_component": demand.values,
        "stock_risk_component": stock_risk.values,
    })


def score_keells(df: pd.DataFrame) -> pd.DataFrame:
    day_df = latest_snapshot(df).set_index("category")
    demand = (
        minmax_normalize(day_df["avg_average_sale"].fillna(0)) * 0.5
        + minmax_normalize(day_df["selling_today_rate"]) * 0.3
        + minmax_normalize(day_df["featured_rate"]) * 0.2
    )
    stock_risk = 1 - minmax_normalize(day_df["available_rate"])
    return pd.DataFrame({
        "category": day_df.index,
        "demand_component": demand.values,
        "stock_risk_component": stock_risk.values,
    })


def score_spar(df: pd.DataFrame) -> pd.DataFrame:
    day_df = latest_snapshot(df).set_index("category")
    demand = 1 - minmax_normalize(day_df["discount_rate"])
    stock_risk = minmax_normalize(day_df["out_of_stock_rate"])
    return pd.DataFrame({
        "category": day_df.index,
        "demand_component": demand.values,
        "stock_risk_component": stock_risk.values,
    })


def score_cargills(df: pd.DataFrame) -> pd.DataFrame:
    day_df = latest_snapshot(df).set_index("category")
    demand = 1 - minmax_normalize(day_df["avg_rank_sort"])
    stock_risk = minmax_normalize(day_df["low_stock_rate"])
    return pd.DataFrame({
        "category": day_df.index,
        "demand_component": demand.values,
        "stock_risk_component": stock_risk.values,
    })


SOURCE_SCORERS = {
    "glomark": score_glomark,
    "keells": score_keells,
    "spar": score_spar,
    "cargills": score_cargills,
}


def score_daraz(df: pd.DataFrame) -> pd.DataFrame:
    """Daraz is a raw per-item table (not a category_daily rollup), so
    this groups by 'query' itself, same as next_week_prediction.py's
    daily_score_daraz - just restricted to today only."""
    day_df = latest_snapshot(df)
    grouped = day_df.groupby("query").agg(
        avg_sold=("sold_count_numeric", "mean"),
        avg_rating=("rating_score", "mean"),
        listing_count=("item_id", "count"),
        in_stock_rate=("in_stock", "mean"),
    )
    avg_sold_filled = grouped["avg_sold"].fillna(grouped["avg_sold"].mean())
    avg_rating_filled = grouped["avg_rating"].fillna(grouped["avg_rating"].mean())

    demand = (
        minmax_normalize(avg_sold_filled) * 0.6
        + minmax_normalize(avg_rating_filled) * 0.2
        + minmax_normalize(grouped["listing_count"]) * 0.2
    )
    stock_risk = 1 - grouped["in_stock_rate"].fillna(1.0)

    return pd.DataFrame({
        "category": grouped.index,
        "demand_component": demand.values,
        "stock_risk_component": stock_risk.values,
    })


# ==================================================
# COMBINE ACROSS SOURCES
# ==================================================

def classify_demand(score: float) -> str:
    if score >= DEMAND_HIGH_THRESHOLD:
        return "HIGH"
    if score >= DEMAND_MEDIUM_THRESHOLD:
        return "MEDIUM"
    return "LOW"


def classify_stock_risk(score: float) -> str:
    if score >= STOCK_RISK_HIGH_THRESHOLD:
        return "LOW STOCK ALERT"
    if score >= STOCK_RISK_MEDIUM_THRESHOLD:
        return "WATCH"
    return "STABLE"


def build_recommendations(client: Client) -> pd.DataFrame:
    """
    Public entry point. Returns one row per category with:
      category, demand_score, stock_risk_score, demand_signal,
      stock_signal, contributing_sources
    Does NOT create its own Supabase client - callers (this file's own
    main(), or an external script like pos_market_adjusted_forecast.py)
    pass in whichever client they want this scored against.
    """
    all_scores = []

    for name, table_name in SOURCE_TABLES.items():
        df = load_table(client, table_name)
        if df is None:
            continue
        scored = SOURCE_SCORERS[name](df)
        scored["category_key"] = scored["category"].str.strip().str.lower()
        scored["source"] = name
        all_scores.append(scored)

    daraz_df = load_table(client, DARAZ_TABLE)
    if daraz_df is not None:
        daraz_scored = score_daraz(daraz_df)
        daraz_scored["category_key"] = daraz_scored["category"].str.strip().str.lower()
        daraz_scored["source"] = "daraz"
        all_scores.append(daraz_scored)

    if not all_scores:
        print("[restock] no source data available - nothing to score.")
        return pd.DataFrame()

    combined = pd.concat(all_scores, ignore_index=True)

    display_names = (
        combined.groupby("category_key")["category"]
        .agg(lambda s: s.value_counts().idxmax())
    )
    sources_by_key = combined.groupby("category_key")["source"].unique().apply(list)

    grouped = combined.groupby("category_key").agg(
        demand_score=("demand_component", "mean"),
        stock_risk_score=("stock_risk_component", "mean"),
    )
    grouped["category"] = grouped.index.map(display_names)
    # .map() on an Index returns an Index, not a Series - Index has no
    # .apply(), so the join has to happen inside the map's lambda itself
    # rather than chaining .apply() afterward.
    grouped["contributing_sources"] = grouped.index.map(
        lambda key: ", ".join(sources_by_key.get(key, []))
    )

    grouped["demand_signal"] = grouped["demand_score"].apply(classify_demand)
    grouped["stock_signal"] = grouped["stock_risk_score"].apply(classify_stock_risk)

    # Guard against corrupted/junk category labels making it through,
    # same safeguard as next_week_prediction.py.
    junk_mask = grouped["category"].str.strip().str.len() <= 2
    if junk_mask.any():
        print(f"[restock] dropping {junk_mask.sum()} row(s) with suspicious "
              f"short/junk category labels: {sorted(grouped.loc[junk_mask, 'category'].tolist())}")
    grouped = grouped[~junk_mask]

    grouped = grouped.reset_index(drop=True)
    grouped = grouped.sort_values("demand_score", ascending=False)

    return grouped[[
        "category", "demand_score", "stock_risk_score",
        "demand_signal", "stock_signal", "contributing_sources",
    ]]


def print_recommendations(df: pd.DataFrame) -> None:
    if df.empty:
        print("[restock] no recommendations to display.")
        return

    print("\n=== TODAY'S RESTOCK SIGNAL REPORT ===\n")
    for _, row in df.iterrows():
        urgent = " <-- HIGH DEMAND + LOW STOCK: restock priority" if (
            row["demand_signal"] == "HIGH" and row["stock_signal"] == "LOW STOCK ALERT"
        ) else ""
        print(
            f"{row['category']:<25} "
            f"Demand: {row['demand_signal']:<7} "
            f"Stock: {row['stock_signal']:<16} "
            f"Sources: {row['contributing_sources']}{urgent}"
        )
    print()


def _json_safe(value):
    if value is None:
        return None
    if isinstance(value, np.floating):
        val = float(value)
        return None if math.isnan(val) else val
    if isinstance(value, np.integer):
        return int(value)
    if isinstance(value, np.bool_):
        return bool(value)
    if isinstance(value, float) and math.isnan(value):
        return None
    return value


def save_to_supabase(client: Client, df: pd.DataFrame):
    if df.empty:
        print("[restock] nothing to save - report was empty.")
        return

    generated_at = datetime.now(timezone.utc).isoformat()
    df = df.copy()
    df["generated_at"] = generated_at

    rows = [{k: _json_safe(v) for k, v in row.items()} for row in df.to_dict(orient="records")]

    client.table(OUTPUT_TABLE).delete().neq("category", "___never_matches___").execute()
    for i in range(0, len(rows), PAGE_SIZE):
        client.table(OUTPUT_TABLE).insert(rows[i:i + PAGE_SIZE]).execute()

    print(f"[restock] saved {len(rows)} rows -> Supabase.{OUTPUT_TABLE} "
          f"(generated_at={generated_at})")


def main():
    client = get_client()
    recommendations = build_recommendations(client)
    print_recommendations(recommendations)
    save_to_supabase(client, recommendations)


if __name__ == "__main__":
    main()