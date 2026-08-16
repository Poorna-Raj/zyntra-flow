"""
daraz_province_prediction.py

Province-level demand prediction, built ONLY from Daraz - the only one
of your five sources with real geographic data (the 'location' field on
each listing, which is the seller's shipping province). Cargills, SPAR,
and Keells have no location dimension at all (single online
storefronts, not province-differentiated); Glomark's branch_stocks
COULD support this too, pending confirmation of a branchId -> province
mapping - not attempted here.

This mirrors next_week_prediction.py's trend-extrapolation approach
(linear trend fit + 7-day projection, no trained ML model given
limited history), but grouped by (province, category) instead of just
category - so the output is "Rice demand in Western Province is RISING",
not just "Rice demand nationally is RISING".

Daraz's location values include "Overseas" and "Local" alongside real
Sri Lankan provinces (Western, Southern, Central, Northern, Eastern,
North Western, North Central, Uva, Sabaragamuwa) - those two aren't
provinces and are excluded from this report; blank/missing location
values are also excluded. Both exclusions are counted and reported so
nothing silently disappears.

Reads:  Supabase table "daraz_catalog_client"          (raw, all queries, all days)
Writes: Supabase table "province_demand_prediction"     (one row per province+category)
        Supabase table "province_demand_top_items"      (one row per top item,
                                                           FK -> province_demand_prediction.id)

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

RAW_TABLE = "daraz_catalog_client"
OUTPUT_TABLE = "province_demand_prediction"
TOP_ITEMS_TABLE = "province_demand_top_items"

PROJECTION_DAYS = 7
MIN_POINTS_FOR_TREND = 2
FLAT_SLOPE_THRESHOLD = 0.01
PAGE_SIZE = 1000

# Real Sri Lankan provinces only - "Overseas" and "Local" (both seen in
# Daraz's own location filter options) are excluded, along with any
# blank/missing location.
VALID_PROVINCES = {
    "Western", "Central", "Southern", "Northern", "Eastern",
    "North Western", "North Central", "Uva", "Sabaragamuwa",
}


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
        print(f"[province-predict] {table_name} has 0 rows in Supabase.")
        return None

    df = pd.DataFrame(all_rows)
    df["scraped_date"] = pd.to_datetime(df["scraped_date"])
    print(f"[province-predict] loaded {table_name}: {len(df)} rows across "
          f"{df['scraped_date'].nunique()} day(s).")
    return df


def minmax_normalize(series: pd.Series) -> pd.Series:
    lo, hi = series.min(), series.max()
    if hi == lo:
        return pd.Series([0.5] * len(series), index=series.index)
    return (series - lo) / (hi - lo)


def filter_to_valid_provinces(df: pd.DataFrame) -> pd.DataFrame:
    before = len(df)
    df = df.copy()
    df["location"] = df["location"].astype(str).str.strip()
    valid = df[df["location"].isin(VALID_PROVINCES)]
    excluded = before - len(valid)
    if excluded:
        excluded_values = (
            df.loc[~df["location"].isin(VALID_PROVINCES), "location"]
            .value_counts()
            .to_dict()
        )
        print(f"[province-predict] excluded {excluded} row(s) with non-province "
              f"location values: {excluded_values}")
    return valid


def get_top_items_by_province_category(df: pd.DataFrame, limit: int = 10) -> dict:
    """Builds a {(province, category): [(name1, image_url1), ...]} lookup
    from the most recent day's snapshot, ranked by real sold_count_numeric -
    the strongest signal Daraz gives us. Computed once, up front, since
    the whole raw table is already in memory - no extra fetches needed
    per row, unlike the multi-source model. Returns a LIST of (name,
    image_url) tuples since these get written to their own normalized
    table (province_demand_top_items), one row per item.

    image_url comes straight from daraz_catalog_client.image_url (added
    once the scraper started capturing it - see daraz scraper). Rows
    scraped before that column existed will have image_url = None here,
    which is fine - it's a nullable column downstream too.
    """
    latest_date = df["scraped_date"].max()
    latest_df = df[df["scraped_date"] == latest_date].copy()

    has_image_col = "image_url" in latest_df.columns

    lookup = {}
    for (province, category), group in latest_df.groupby(["location", "query"]):
        ranked = group.sort_values("sold_count_numeric", ascending=False, na_position="last")
        ranked = ranked.copy()
        ranked["name"] = ranked["name"].astype(str).str.strip()
        ranked = ranked[ranked["name"] != ""].drop_duplicates(subset="name")

        top_rows = ranked.head(limit)
        items = []
        for _, r in top_rows.iterrows():
            image_url = r["image_url"] if has_image_col else None
            if pd.isna(image_url):
                image_url = None
            items.append((r["name"], image_url))

        if items:
            lookup[(province, category)] = items

    return lookup


def daily_score_by_province_category(df: pd.DataFrame) -> pd.DataFrame:
    """Same demand-score formula as next_week_prediction.py's
    daily_score_daraz(), but grouped by (province, category) instead of
    just category."""
    rows = []
    for dt, day_df in df.groupby("scraped_date"):
        grouped = day_df.groupby(["location", "query"]).agg(
            avg_sold=("sold_count_numeric", "mean"),
            avg_rating=("rating_score", "mean"),
            listing_count=("item_id", "count"),
        )
        if grouped.empty:
            continue

        avg_sold_filled = grouped["avg_sold"].fillna(grouped["avg_sold"].mean())
        avg_rating_filled = grouped["avg_rating"].fillna(grouped["avg_rating"].mean())
        demand = (
            minmax_normalize(avg_sold_filled) * 0.6
            + minmax_normalize(avg_rating_filled) * 0.2
            + minmax_normalize(grouped["listing_count"]) * 0.2
        )

        for (province, category) in grouped.index:
            rows.append({
                "province": province,
                "category": category,
                "scraped_date": dt,
                "demand_score": demand[(province, category)],
                "listing_count": int(grouped.loc[(province, category), "listing_count"]),
            })
    return pd.DataFrame(rows)


def fit_trend_and_project(history: pd.DataFrame) -> pd.DataFrame:
    """Same trend-fitting logic as next_week_prediction.py, operating on
    a (province, category) composite key instead of category alone."""
    results = []

    for (province, category), group in history.groupby(["province", "category"]):
        group = group.sort_values("scraped_date")
        n_points = group["scraped_date"].nunique()

        daily_avg = group.groupby("scraped_date")["demand_score"].mean()
        current_score = daily_avg.iloc[-1]
        avg_listing_count = group["listing_count"].mean()

        if n_points < MIN_POINTS_FOR_TREND:
            results.append({
                "province": province,
                "category": category,
                "current_score": current_score,
                "projected_score": current_score,
                "slope_per_day": np.nan,
                "trend": "INSUFFICIENT HISTORY",
                "confidence": "LOW",
                "days_of_history": n_points,
                "avg_listing_count": round(avg_listing_count, 1),
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

        # Low listing counts make a demand score noisy/unreliable even
        # with several days of history - downgrade confidence rather
        # than reporting a falsely-confident number for a thin sample.
        if avg_listing_count < 5 and confidence == "HIGH":
            confidence = "MEDIUM"
        if avg_listing_count < 3 and confidence == "MEDIUM":
            confidence = "LOW"

        results.append({
            "province": province,
            "category": category,
            "current_score": current_score,
            "projected_score": projected,
            "slope_per_day": slope,
            "trend": trend,
            "confidence": confidence,
            "days_of_history": n_points,
            "avg_listing_count": round(avg_listing_count, 1),
        })

    return pd.DataFrame(results)


def classify_demand(score: float) -> str:
    if score >= 0.66:
        return "HIGH"
    if score >= 0.33:
        return "MEDIUM"
    return "LOW"


def build_prediction(client: Client) -> pd.DataFrame:
    df = load_table(client, RAW_TABLE)
    if df is None:
        return pd.DataFrame()

    df = filter_to_valid_provinces(df)
    if df.empty:
        print("[province-predict] no rows left after filtering to valid provinces.")
        return pd.DataFrame()

    daily = daily_score_by_province_category(df)
    if daily.empty:
        print("[province-predict] no daily scores could be computed.")
        return pd.DataFrame()

    top_items_lookup = get_top_items_by_province_category(df)

    fitted = fit_trend_and_project(daily)

    fitted["current_label"] = fitted["current_score"].apply(classify_demand)
    fitted["predicted_label"] = fitted["projected_score"].apply(classify_demand)
    fitted["predicted_good_seller"] = (
        (fitted["predicted_label"] == "HIGH") & (fitted["trend"] != "FALLING")
    )

    # Kept as a Python list column (not written to province_demand_prediction
    # itself - that table stays flat/normalized). Used by
    # save_prediction_to_supabase() to populate the separate
    # province_demand_top_items table once we know each row's real id.
    fitted["top_items_list"] = fitted.apply(
        lambda r: top_items_lookup.get((r["province"], r["category"]), []), axis=1
    )

    fitted = fitted.sort_values(["province", "projected_score"], ascending=[True, False])
    return fitted


def print_prediction(df: pd.DataFrame) -> None:
    if df.empty:
        print("[province-predict] no predictions to display.")
        return

    print("\n=== PROVINCE-WISE DEMAND PREDICTION ===\n")
    for province, group in df.groupby("province"):
        print(f"--- {province} ---")
        for _, row in group.iterrows():
            flag = "GOOD SELLER (predicted)" if row["predicted_good_seller"] else ""
            print(
                f"  {row['category']:<18} "
                f"Now: {row['current_label']:<6} -> Next week: {row['predicted_label']:<6} "
                f"Trend: {row['trend']:<20} "
                f"Confidence: {row['confidence']:<6} "
                f"(history={row['days_of_history']}d, avg_listings={row['avg_listing_count']}) {flag}"
            )
            if row["predicted_label"] == "HIGH" and row["top_items_list"]:
                names_only = [name for name, _image_url in row["top_items_list"]]
                print(f"      Top products: {', '.join(names_only)}")
        print()


def _json_safe(value):
    if value is None:
        return None
    if isinstance(value, (np.floating, float)) and isinstance(value, float) and math.isnan(value):
        return None
    if isinstance(value, np.floating):
        val = float(value)
        return None if math.isnan(val) else val
    if isinstance(value, np.integer):
        return int(value)
    if isinstance(value, np.bool_):
        return bool(value)
    if isinstance(value, pd.Timestamp):
        return None if pd.isna(value) else value.isoformat()
    return value


def dataframe_to_clean_records(df: pd.DataFrame) -> list[dict]:
    records = df.to_dict(orient="records")
    return [{k: _json_safe(v) for k, v in row.items()} for row in records]


def save_prediction_to_supabase(client: Client, df: pd.DataFrame):
    """Writes the flat prediction rows to province_demand_prediction, then
    writes each row's top items to province_demand_top_items, linked back
    via the real auto-generated `id` that Supabase returns on insert.

    Order matters here: we can only build the FK rows for
    province_demand_top_items AFTER we know the ids Supabase assigned to
    the province_demand_prediction rows, so the two inserts can't be
    parallelized/reordered.
    """
    if df.empty:
        print("[province-predict] nothing to save - prediction was empty.")
        return

    generated_at = datetime.now(timezone.utc).isoformat()
    df = df.copy()
    df["generated_at"] = generated_at

    # top_items_list is NOT a column of province_demand_prediction - it's
    # only used below to populate province_demand_top_items. Keep it out
    # of the main-table records, but keep the full df (with it) around so
    # we can zip it back up against the ids Supabase returns.
    main_df = df.drop(columns=["top_items_list"])
    main_rows = dataframe_to_clean_records(main_df)

    # Deleting existing prediction rows cascades (ON DELETE CASCADE) to
    # province_demand_top_items automatically, so no separate delete is
    # needed against the top-items table.
    client.table(OUTPUT_TABLE).delete().neq("province", "___never_matches___").execute()

    inserted_ids = []
    for i in range(0, len(main_rows), PAGE_SIZE):
        batch = main_rows[i:i + PAGE_SIZE]
        resp = client.table(OUTPUT_TABLE).insert(batch).execute()
        if not resp.data or "id" not in resp.data[0]:
            raise RuntimeError(
                f"[province-predict] insert into {OUTPUT_TABLE} did not return ids - "
                "check that the table has an 'id' primary key column and that the "
                "supabase-py client is returning representation data."
            )
        inserted_ids.extend(row["id"] for row in resp.data)

    if len(inserted_ids) != len(df):
        raise RuntimeError(
            f"[province-predict] mismatch: inserted {len(inserted_ids)} prediction "
            f"row(s) but expected {len(df)} - cannot safely map top items to ids."
        )

    top_item_rows = []
    for prediction_id, top_items in zip(inserted_ids, df["top_items_list"]):
        for rank, (item_name, image_url) in enumerate(top_items, start=1):
            top_item_rows.append({
                "prediction_id": prediction_id,
                "item_rank": rank,
                "item_name": item_name,
                "image_url": image_url,
            })

    if top_item_rows:
        for i in range(0, len(top_item_rows), PAGE_SIZE):
            batch = top_item_rows[i:i + PAGE_SIZE]
            client.table(TOP_ITEMS_TABLE).insert(batch).execute()

    print(f"[province-predict] saved {len(main_rows)} rows -> Supabase.{OUTPUT_TABLE} "
          f"and {len(top_item_rows)} row(s) -> Supabase.{TOP_ITEMS_TABLE} "
          f"(generated_at={generated_at})")


def main():
    client = get_client()

    prediction = build_prediction(client)
    print_prediction(prediction)
    save_prediction_to_supabase(client, prediction)


if __name__ == "__main__":
    main()