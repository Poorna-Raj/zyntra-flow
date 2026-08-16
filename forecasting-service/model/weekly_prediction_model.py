"""
next_week_prediction.py

Model 2: "next week good sellers" prediction - reads from Supabase AND
writes its output report back to Supabase (table
"next_week_prediction_report"), so nothing in this pipeline stage
touches a local CSV anymore.

This is deliberately a trend-extrapolation model, not a trained ML
forecaster. With only a few days of scraped history per store, fitting
something like ARIMA/regression-with-features would be overfit and
indefensible - there simply aren't enough time points yet. Instead:

  1. Recompute each source's demand_score per category PER DAY
     (not just the latest snapshot, like restock_signal.py does).
  2. Fit a simple linear trend (slope) to each category's daily
     demand_score history.
  3. Project the score 7 days forward using that slope.
  4. Classify the projection into a demand label + trend direction.

Categories with fewer than 2 distinct scraped dates get NO trend
fitted - they're flagged "INSUFFICIENT HISTORY" and given a flat
(non-extrapolated) projection instead of a fabricated slope.

OUTPUT: each run REPLACES the entire contents of
"next_week_prediction_report" (delete-then-insert) - the report
represents the current full prediction set, not an incremental log, so
old rows from a previous run shouldn't linger once fresher ones exist.
A generated_at timestamp column is added so a dashboard/consumer can
tell how fresh the current report is.

Install:
    pip install pandas numpy supabase python-dotenv
"""

import os
import math
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

def _load_env():
    here = Path(__file__).resolve().parent
    for folder in [here, *here.parents]:
        candidate = folder / ".env"
        if candidate.exists():
            load_dotenv(candidate)
            print(f"[seed] loaded .env from {candidate}")
            return
    print("[seed] WARNING: no .env file found searching upward from this script.")


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# category_daily tables - one row per (category, scraped_date)
SOURCE_TABLES = {
    "glomark": "glomark_category_daily",
    "keells": "keells_category_daily",
    "spar": "spar_category_daily",
    "cargills": "cargills_category_daily",
}

# Daraz's raw per-item table - used directly (not category_daily) since
# the demand score needs sold_count_numeric/rating per query, same as
# the original CSV-based version did.
DARAZ_TABLE = "daraz_catalog_client"

OUTPUT_TABLE = "next_week_prediction_report"

PROJECTION_DAYS = 7
MIN_POINTS_FOR_TREND = 2
FLAT_SLOPE_THRESHOLD = 0.01

# Supabase's default REST response caps at 1000 rows per request;
# daraz_catalog_client in particular will exceed that within days, so
# every load paginates rather than trusting a single .select() call.
PAGE_SIZE = 1000


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY missing from .env")
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def load_table(client: Client, table_name: str) -> Optional[pd.DataFrame]:
    """
    Pulls every row from a Supabase table, paginating past the 1000-row
    default limit, and returns it as a DataFrame with scraped_date
    parsed to a real datetime column.
    """
    all_rows = []
    start = 0

    while True:
        response = (
            client.table(table_name)
            .select("*")
            .range(start, start + PAGE_SIZE - 1)
            .execute()
        )
        batch = response.data
        if not batch:
            break
        all_rows.extend(batch)
        if len(batch) < PAGE_SIZE:
            break
        start += PAGE_SIZE

    if not all_rows:
        print(f"[predict] {table_name} has 0 rows in Supabase - skipping.")
        return None

    df = pd.DataFrame(all_rows)
    df["scraped_date"] = pd.to_datetime(df["scraped_date"])

    n_dates = df["scraped_date"].nunique()
    print(f"[predict] loaded {table_name}: {len(df)} rows across {n_dates} day(s).")
    return df


def minmax_normalize(series: pd.Series) -> pd.Series:
    lo, hi = series.min(), series.max()
    if hi == lo:
        return pd.Series([0.5] * len(series), index=series.index)
    return (series - lo) / (hi - lo)


# ==================================================
# DAILY DEMAND SCORING PER SOURCE (unchanged logic)
# ==================================================

def daily_score_glomark(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for dt, day_df in df.groupby("scraped_date"):
        day_df = day_df.set_index("category")
        stock_risk = minmax_normalize(day_df["out_of_stock_rate"])
        demand = (
            (1 - minmax_normalize(day_df["promo_rate"])) * 0.4
            + minmax_normalize(day_df["new_product_rate"]) * 0.3
            + (1 - stock_risk) * 0.3
        )
        for cat in day_df.index:
            rows.append({"category": cat, "scraped_date": dt, "demand_score": demand[cat]})
    return pd.DataFrame(rows)


def daily_score_keells(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for dt, day_df in df.groupby("scraped_date"):
        day_df = day_df.set_index("category")
        demand = (
            minmax_normalize(day_df["selling_today_rate"]) * 0.5
            + minmax_normalize(day_df["featured_rate"]) * 0.25
            + minmax_normalize(day_df["sponsored_rate"]) * 0.25
        )
        for cat in day_df.index:
            rows.append({"category": cat, "scraped_date": dt, "demand_score": demand[cat]})
    return pd.DataFrame(rows)


def daily_score_spar(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for dt, day_df in df.groupby("scraped_date"):
        day_df = day_df.set_index("category")
        stock_risk = minmax_normalize(day_df["out_of_stock_rate"])
        demand = (1 - minmax_normalize(day_df["discount_rate"])) * 0.5 + (1 - stock_risk) * 0.5
        for cat in day_df.index:
            rows.append({"category": cat, "scraped_date": dt, "demand_score": demand[cat]})
    return pd.DataFrame(rows)


def daily_score_cargills(df: pd.DataFrame) -> pd.DataFrame:
    rows = []
    for dt, day_df in df.groupby("scraped_date"):
        day_df = day_df.set_index("category")
        stock_risk = minmax_normalize(day_df["low_stock_rate"])
        demand = (1 - minmax_normalize(day_df["avg_rank_sort"])) * 0.6 + (1 - stock_risk) * 0.4
        for cat in day_df.index:
            rows.append({"category": cat, "scraped_date": dt, "demand_score": demand[cat]})
    return pd.DataFrame(rows)


DAILY_SCORERS = {
    "glomark": daily_score_glomark,
    "keells": daily_score_keells,
    "spar": daily_score_spar,
    "cargills": daily_score_cargills,
}


def daily_score_daraz(df: pd.DataFrame) -> pd.DataFrame:
    """Daraz uses 'query' as the category dimension, and a real
    sold_count_numeric signal instead of a proxy."""
    rows = []
    for dt, day_df in df.groupby("scraped_date"):
        grouped = day_df.groupby("query").agg(
            avg_sold=("sold_count_numeric", "mean"),
            avg_rating=("rating_score", "mean"),
            listing_count=("item_id", "count"),
        )
        avg_sold_filled = grouped["avg_sold"].fillna(grouped["avg_sold"].mean())
        avg_rating_filled = grouped["avg_rating"].fillna(grouped["avg_rating"].mean())
        demand = (
            minmax_normalize(avg_sold_filled) * 0.6
            + minmax_normalize(avg_rating_filled) * 0.2
            + minmax_normalize(grouped["listing_count"]) * 0.2
        )
        for cat in grouped.index:
            rows.append({"category": cat, "scraped_date": dt, "demand_score": demand[cat]})
    return pd.DataFrame(rows)


# ==================================================
# TREND FITTING + PROJECTION (unchanged logic)
# ==================================================

def fit_trend_and_project(history: pd.DataFrame) -> pd.DataFrame:
    results = []

    for category, group in history.groupby("category"):
        group = group.sort_values("scraped_date")
        n_points = group["scraped_date"].nunique()

        daily_avg = group.groupby("scraped_date")["demand_score"].mean()
        current_score = daily_avg.iloc[-1]

        if n_points < MIN_POINTS_FOR_TREND:
            results.append({
                "category": category,
                "current_score": current_score,
                "projected_score": current_score,
                "slope_per_day": np.nan,
                "trend": "INSUFFICIENT HISTORY",
                "confidence": "LOW",
                "days_of_history": n_points,
            })
            continue

        day_index = np.arange(len(daily_avg))
        slope, intercept = np.polyfit(day_index, daily_avg.values, 1)

        projected = intercept + slope * (day_index[-1] + PROJECTION_DAYS)
        projected = float(np.clip(projected, 0.0, 1.0))

        if slope > FLAT_SLOPE_THRESHOLD:
            trend = "RISING"
        elif slope < -FLAT_SLOPE_THRESHOLD:
            trend = "FALLING"
        else:
            trend = "STABLE"

        if n_points >= 7:
            confidence = "HIGH"
        elif n_points >= 3:
            confidence = "MEDIUM"
        else:
            confidence = "LOW"

        results.append({
            "category": category,
            "current_score": current_score,
            "projected_score": projected,
            "slope_per_day": slope,
            "trend": trend,
            "confidence": confidence,
            "days_of_history": n_points,
        })

    return pd.DataFrame(results)


def classify_demand(score: float) -> str:
    if score >= 0.66:
        return "HIGH"
    if score >= 0.33:
        return "MEDIUM"
    return "LOW"


def build_prediction(client: Client) -> pd.DataFrame:
    all_history = []

    for name, table_name in SOURCE_TABLES.items():
        df = load_table(client, table_name)
        if df is None:
            continue
        daily = DAILY_SCORERS[name](df)
        daily["category_key"] = daily["category"].str.strip().str.lower()
        daily["source"] = name
        all_history.append(daily)

    daraz_df = load_table(client, DARAZ_TABLE)
    if daraz_df is not None:
        daraz_daily = daily_score_daraz(daraz_df)
        daraz_daily["category_key"] = daraz_daily["category"].str.strip().str.lower()
        daraz_daily["source"] = "daraz"
        all_history.append(daraz_daily)

    if not all_history:
        print("[predict] no source data available - nothing to predict.")
        return pd.DataFrame()

    combined = pd.concat(all_history, ignore_index=True)

    combined_for_fit = combined.rename(columns={"category": "category_display"})
    combined_for_fit["category"] = combined_for_fit["category_key"]

    fitted = fit_trend_and_project(combined_for_fit[["category", "scraped_date", "demand_score"]])

    display_names = (
        combined.groupby("category_key")["category"]
        .agg(lambda s: s.value_counts().idxmax())
    )
    fitted["category"] = fitted["category"].map(display_names).fillna(fitted["category"])

    fitted["current_label"] = fitted["current_score"].apply(classify_demand)
    fitted["predicted_label"] = fitted["projected_score"].apply(classify_demand)
    fitted["predicted_good_seller"] = (
        (fitted["predicted_label"] == "HIGH") & (fitted["trend"] != "FALLING")
    )

    # Guard against corrupted/junk category labels (e.g. single letters
    # from an upstream parsing issue) making it into the final report.
    junk_mask = fitted["category"].str.strip().str.len() <= 2
    if junk_mask.any():
        print(f"[predict] dropping {junk_mask.sum()} row(s) with suspicious "
              f"short/junk category labels: {sorted(fitted.loc[junk_mask, 'category'].tolist())}")
    fitted = fitted[~junk_mask]

    fitted = fitted.sort_values("projected_score", ascending=False)
    return fitted


def print_prediction(df: pd.DataFrame) -> None:
    if df.empty:
        print("[predict] no predictions to display.")
        return

    print("\n=== NEXT WEEK PREDICTION REPORT ===\n")
    for _, row in df.iterrows():
        flag = "GOOD SELLER (predicted)" if row["predicted_good_seller"] else ""
        print(
            f"{row['category']:<20} "
            f"Now: {row['current_label']:<6} -> Next week: {row['predicted_label']:<6} "
            f"Trend: {row['trend']:<20} "
            f"Confidence: {row['confidence']:<6} "
            f"(history={row['days_of_history']}d) {flag}"
        )
    print()


# ==================================================
# SAVE REPORT TO SUPABASE (new)
# ==================================================

def _json_safe(value):
    """Converts a pandas/numpy scalar into something Supabase's client
    can actually JSON-encode: NaN/NaT -> None, numpy int/float/bool ->
    native Python, everything else passed through as-is."""
    if value is None:
        return None
    if isinstance(value, (np.floating, float)) and math.isnan(value):
        return None
    if isinstance(value, np.floating):
        return float(value)
    if isinstance(value, np.integer):
        return int(value)
    if isinstance(value, np.bool_):
        return bool(value)
    if isinstance(value, pd.Timestamp):
        if pd.isna(value):
            return None
        return value.isoformat()
    return value


def dataframe_to_clean_records(df: pd.DataFrame) -> list[dict]:
    records = df.to_dict(orient="records")
    return [{k: _json_safe(v) for k, v in row.items()} for row in records]


def save_prediction_to_supabase(client: Client, df: pd.DataFrame):
    """Replaces the entire next_week_prediction_report table with this
    run's results - the report is a full current-state snapshot, not
    an incremental log, so stale rows from a previous run shouldn't
    stick around once a fresher prediction exists."""
    if df.empty:
        print("[predict] nothing to save - prediction was empty.")
        return

    generated_at = datetime.now(timezone.utc).isoformat()
    df = df.copy()
    df["generated_at"] = generated_at

    rows = dataframe_to_clean_records(df)

    # Delete-then-insert, same pattern as the category_daily aggregators.
    client.table(OUTPUT_TABLE).delete().neq("category", "___never_matches___").execute()

    for i in range(0, len(rows), PAGE_SIZE):
        batch = rows[i:i + PAGE_SIZE]
        client.table(OUTPUT_TABLE).insert(batch).execute()

    print(f"[predict] saved {len(rows)} rows -> Supabase.{OUTPUT_TABLE} "
          f"(generated_at={generated_at})")


def main():
    client = get_client()

    prediction = build_prediction(client)
    print_prediction(prediction)
    save_prediction_to_supabase(client, prediction)


if __name__ == "__main__":
    main()