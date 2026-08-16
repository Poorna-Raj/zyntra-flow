"""
restock_signal.py

Rule-based, fully transparent restock/demand signal generator - now
reading from Supabase instead of local CSVs, so this stays in sync
with next_week_prediction.py and whatever a live dashboard would show.

This is intentionally NOT a trained model. It combines the signals
each store's category_daily table actually contains into an
explainable 0-100 score per category, per store, then blends across
stores. Demand is proxied from stock depletion, promo activity, and
store-assigned visibility signals where a real sold-count isn't
available - only Daraz has genuine purchase-behavior data
(sold_count_numeric).

Install:
    pip install pandas supabase python-dotenv
"""

import os
from pathlib import Path
from typing import Optional

import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

DATASET_DIR = Path(__file__).resolve().parent / "dataset"

# category_daily tables - one row per (category, scraped_date)
SOURCE_TABLES = {
    "glomark": "glomark_category_daily",
    "keells": "keells_category_daily",
    "spar": "spar_category_daily",
    "cargills": "cargills_category_daily",
}

# Daraz's raw per-item table - used directly since the demand score
# needs sold_count_numeric/rating per query, which only exists at the
# product level, not in a category_daily rollup.
DARAZ_TABLE = "daraz_catalog_client"

# Supabase's default REST response caps at 1000 rows per request.
PAGE_SIZE = 1000


def load_table(client: Client, table_name: str) -> Optional[pd.DataFrame]:
    """Pulls every row from a Supabase table, paginating past the
    1000-row default limit, with scraped_date parsed to a real date."""
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
        print(f"[restock] {table_name} has 0 rows in Supabase - skipping.")
        return None

    df = pd.DataFrame(all_rows)
    df["scraped_date"] = pd.to_datetime(df["scraped_date"])

    n_dates = df["scraped_date"].nunique()
    print(f"[restock] loaded {table_name}: {len(df)} rows, "
          f"{df['category'].nunique() if 'category' in df.columns else 'N/A'} categories, "
          f"{n_dates} day(s) of history.")
    return df


def latest_snapshot(df: pd.DataFrame) -> pd.DataFrame:
    """Collapse to the most recent scraped_date per row set."""
    latest_date = df["scraped_date"].max()
    return df[df["scraped_date"] == latest_date].copy()


def minmax_normalize(series: pd.Series) -> pd.Series:
    lo, hi = series.min(), series.max()
    if hi == lo:
        return pd.Series([0.5] * len(series), index=series.index)
    return (series - lo) / (hi - lo)


# ==================================================
# PER-SOURCE SCORING (unchanged logic)
# ==================================================

def score_glomark(df: pd.DataFrame) -> pd.DataFrame:
    snap = latest_snapshot(df).set_index("category")
    stock_risk = minmax_normalize(snap["out_of_stock_rate"])
    demand = (
        (1 - minmax_normalize(snap["promo_rate"])) * 0.4
        + minmax_normalize(snap["new_product_rate"]) * 0.3
        + (1 - stock_risk) * 0.3
    )
    return pd.DataFrame({"demand_score": demand, "stock_risk": stock_risk})


def score_keells(df: pd.DataFrame) -> pd.DataFrame:
    snap = latest_snapshot(df).set_index("category")
    stock_risk = 1 - minmax_normalize(snap["avg_stock_in_hand"])
    demand = (
        minmax_normalize(snap["selling_today_rate"]) * 0.5
        + minmax_normalize(snap["featured_rate"]) * 0.25
        + minmax_normalize(snap["sponsored_rate"]) * 0.25
    )
    return pd.DataFrame({"demand_score": demand, "stock_risk": stock_risk})


def score_spar(df: pd.DataFrame) -> pd.DataFrame:
    snap = latest_snapshot(df).set_index("category")
    stock_risk = minmax_normalize(snap["out_of_stock_rate"])
    demand = (1 - minmax_normalize(snap["discount_rate"])) * 0.5 + (1 - stock_risk) * 0.5
    return pd.DataFrame({"demand_score": demand, "stock_risk": stock_risk})


def score_cargills(df: pd.DataFrame) -> pd.DataFrame:
    snap = latest_snapshot(df).set_index("category")
    stock_risk = minmax_normalize(snap["low_stock_rate"])
    demand = (1 - minmax_normalize(snap["avg_rank_sort"])) * 0.6 + (1 - stock_risk) * 0.4
    return pd.DataFrame({"demand_score": demand, "stock_risk": stock_risk})


def score_daraz(df: pd.DataFrame) -> pd.DataFrame:
    """Daraz is the only source with a real purchase-behavior signal
    (sold_count_numeric), so it doesn't need a proxy. Grouped by
    'query' (the grocery search term used to collect it), which acts
    as the category dimension here."""
    snap = latest_snapshot(df)

    grouped = snap.groupby("query").agg(
        avg_sold=("sold_count_numeric", "mean"),
        avg_rating=("rating_score", "mean"),
        avg_discount=("discount_pct", "mean"),
        in_stock_rate=("in_stock", "mean"),
        listing_count=("item_id", "count"),
    )
    grouped = grouped.rename_axis("category")

    avg_sold_filled = grouped["avg_sold"].fillna(grouped["avg_sold"].mean())

    demand = (
        minmax_normalize(avg_sold_filled) * 0.6
        + minmax_normalize(grouped["avg_rating"].fillna(grouped["avg_rating"].mean())) * 0.2
        + minmax_normalize(grouped["listing_count"]) * 0.2
    )
    stock_risk = 1 - grouped["in_stock_rate"].fillna(grouped["in_stock_rate"].mean())

    return pd.DataFrame({"demand_score": demand, "stock_risk": stock_risk}, index=grouped.index)


SCORERS = {
    "glomark": score_glomark,
    "keells": score_keells,
    "spar": score_spar,
    "cargills": score_cargills,
    "daraz": score_daraz,
}


def classify_demand(score: float) -> str:
    if score >= 0.66:
        return "HIGH"
    if score >= 0.33:
        return "MEDIUM"
    return "LOW"


def classify_stock(risk: float) -> str:
    if risk >= 0.66:
        return "LOW STOCK ALERT"
    if risk >= 0.33:
        return "WATCH"
    return "STABLE"


def build_recommendations(client: Client) -> pd.DataFrame:
    per_source_scores = []

    for name, table_name in SOURCE_TABLES.items():
        df = load_table(client, table_name)
        if df is None:
            continue
        scored = SCORERS[name](df)
        scored["source"] = name
        scored = scored.reset_index().rename(columns={"index": "category"})
        per_source_scores.append(scored)

    daraz_df = load_table(client, DARAZ_TABLE)
    if daraz_df is not None:
        scored = SCORERS["daraz"](daraz_df)
        scored["source"] = "daraz"
        scored = scored.reset_index().rename(columns={"index": "category"})
        per_source_scores.append(scored)

    if not per_source_scores:
        print("[restock] no source data available - nothing to score.")
        return pd.DataFrame()

    combined = pd.concat(per_source_scores, ignore_index=True)
    combined["category_key"] = combined["category"].str.strip().str.lower()

    blended = (
        combined.groupby("category_key")
        .agg(
            demand_score=("demand_score", "mean"),
            stock_risk=("stock_risk", "mean"),
            sources=("source", lambda s: ", ".join(sorted(set(s)))),
            source_count=("source", "nunique"),
        )
        .reset_index()
    )
    display_names = (
        combined.groupby("category_key")["category"]
        .agg(lambda s: s.value_counts().idxmax())
    )
    blended["category"] = blended["category_key"].map(display_names)

    blended["demand_signal"] = blended["demand_score"].apply(classify_demand)
    blended["stock_signal"] = blended["stock_risk"].apply(classify_stock)

    # Guard against corrupted/junk category labels making it into the
    # final report - same safeguard as next_week_prediction.py.
    junk_mask = blended["category"].str.strip().str.len() <= 2
    if junk_mask.any():
        print(f"[restock] dropping {junk_mask.sum()} row(s) with suspicious "
              f"short/junk category labels: {sorted(blended.loc[junk_mask, 'category'].tolist())}")
    blended = blended[~junk_mask]

    blended = blended[
        ["category", "demand_signal", "stock_signal", "demand_score",
         "stock_risk", "source_count", "sources"]
    ].sort_values("demand_score", ascending=False)

    return blended


def print_recommendations(df: pd.DataFrame) -> None:
    if df.empty:
        print("[restock] no recommendations to display.")
        return

    print("\n=== RESTOCK / DEMAND SIGNAL REPORT ===\n")
    for _, row in df.iterrows():
        print(
            f"{row['category']:<20} "
            f"Demand: {row['demand_signal']:<7} "
            f"Stock: {row['stock_signal']:<17} "
            f"(score={row['demand_score']:.2f}, risk={row['stock_risk']:.2f}, "
            f"sources={row['sources']})"
        )
    print()


def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("[restock] SUPABASE_URL / SUPABASE_SERVICE_KEY missing from .env - aborting.")
        return

    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    recommendations = build_recommendations(client)
    print_recommendations(recommendations)

    if not recommendations.empty:
        out_path = DATASET_DIR / "restock_signal_report.csv"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        recommendations.to_csv(out_path, index=False)
        print(f"[restock] saved report -> {out_path}")


if __name__ == "__main__":
    main()