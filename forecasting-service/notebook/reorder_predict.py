"""
reorder_predict.py

Standalone script version (no notebook) of the restock recommendation model.
Combines:
  1. A trained GradientBoosting model on the general contextual demand dataset
     (province, season, holidays, weather -> historical estimated_units_sold)
  2. A seller's own uploaded sales export (their real selling velocity + stock)
into a ranked "what to restock / buy next week" list.

Usage:
    # Train the model once (creates restock_model.joblib + restock_encoders.joblib)
    python reorder_predict.py train --context path/to/context_dataset.csv

    # Get recommendations for a seller
    python reorder_predict.py recommend --seller path/to/seller_export.xlsx \
        --province Western --week 31 --context path/to/context_dataset.csv
"""

import re
import difflib

import argparse
import sys
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import OrdinalEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error


CATEGORICAL_COLS = [
    "month", "province", "product_name", "category",
    "avg_temperature_level", "rainfall_level", "tourism_level",
    "payday_week", "holiday_type", "festival_season",
    "school_season", "urbanization_level", "avg_income_level",
]
NUMERIC_COLS = ["week_number"]
TARGET_COL = "estimated_units_sold"
FEATURE_COLS = CATEGORICAL_COLS + NUMERIC_COLS

SELLER_WEIGHT = 0.6  # trust the seller's own history more than the general market signal
FUZZY_MATCH_CUTOFF = 0.55  # difflib similarity threshold for matching product names

DEFAULT_MODEL_PATH = "restock_model.joblib"
DEFAULT_ENCODER_PATH = "restock_encoders.joblib"


def _safe_mode(s):
    """Most-common value in a group, including NaN (dropna=False) — a group
    where every row has a missing holiday_type is common (most weeks have no
    holiday), and the correct mode there is "missing", not an error."""
    m = s.mode(dropna=False)
    return m.iloc[0] if not m.empty else None




_SIZE_UNIT_PATTERN = re.compile(
    r"\(?\b\d+(\.\d+)?\s*(ml|l|kg|g|mg|pack|pcs|pc|bottle|bag|cup)\b\)?", re.IGNORECASE
)


def normalize_product_name(name: str) -> str:
    """
    Strip size/unit/packaging info and punctuation so 'Coca-Cola 1.5L' and
    'Coca-Cola' normalize to the same base string for matching.
    """
    name = str(name).lower()
    name = _SIZE_UNIT_PATTERN.sub("", name)
    name = re.sub(r"[()\-,]", " ", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name


def build_product_name_map(seller_names, context_names, cutoff=FUZZY_MATCH_CUTOFF):
    """
    Map each seller product_name to the best-matching context product_name.
    Tries: exact normalized match -> substring containment -> fuzzy ratio.
    Returns dict: seller_name -> matched_context_name (or None if no match found).
    """
    context_names = list(context_names)
    norm_context = {normalize_product_name(c): c for c in context_names}

    mapping = {}
    for seller_name in seller_names:
        norm_seller = normalize_product_name(seller_name)

        # 1. exact normalized match
        if norm_seller in norm_context:
            mapping[seller_name] = norm_context[norm_seller]
            continue

        # 2. substring containment either direction
        substring_hit = None
        for norm_c, orig_c in norm_context.items():
            if norm_seller in norm_c or norm_c in norm_seller:
                substring_hit = orig_c
                break
        if substring_hit:
            mapping[seller_name] = substring_hit
            continue

        # 3. fuzzy ratio fallback
        close = difflib.get_close_matches(norm_seller, list(norm_context.keys()), n=1, cutoff=cutoff)
        mapping[seller_name] = norm_context[close[0]] if close else None

    return mapping


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_context_data(path: str) -> pd.DataFrame:
    """
    Load the contextual demand dataset.
    keep_default_na=False prevents pandas from silently turning the literal
    string 'None' (used in holiday_type) into a missing value.
    """
    if path.lower().endswith((".xlsx", ".xls")):
        df = pd.read_excel(path, keep_default_na=False, na_values=[""])
    else:
        df = pd.read_csv(path, keep_default_na=False, na_values=[""])

    missing = [c for c in FEATURE_COLS + [TARGET_COL] if c not in df.columns]
    if missing:
        raise ValueError(f"Context dataset is missing required columns: {missing}")

    return df


def load_seller_export(path: str, sheet_name: str = "Sales Export") -> pd.DataFrame:
    required = ["sale_date", "product_name", "category", "quantity_sold",
                "unit", "province", "current_stock_qty"]
    df = pd.read_excel(path, sheet_name=sheet_name)
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Seller export is missing required columns: {missing}")

    df["sale_date"] = pd.to_datetime(df["sale_date"])
    df["quantity_sold"] = pd.to_numeric(df["quantity_sold"], errors="coerce")
    df["current_stock_qty"] = pd.to_numeric(df["current_stock_qty"], errors="coerce")
    df = df.dropna(subset=["sale_date", "product_name", "quantity_sold"])
    return df


# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------

def train_model(context_df: pd.DataFrame, model_path: str = DEFAULT_MODEL_PATH,
                 encoder_path: str = DEFAULT_ENCODER_PATH):
    model_df = context_df.copy()

    encoder = OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)
    model_df[CATEGORICAL_COLS] = encoder.fit_transform(model_df[CATEGORICAL_COLS].astype(str))

    X = model_df[FEATURE_COLS]
    y = model_df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    gbr = GradientBoostingRegressor(
        n_estimators=300, max_depth=4, learning_rate=0.05, random_state=42,
    )
    gbr.fit(X_train, y_train)

    preds = gbr.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    print(f"MAE:  {mae:.2f} units")
    print(f"RMSE: {rmse:.2f} units")

    importances = pd.Series(gbr.feature_importances_, index=FEATURE_COLS).sort_values(ascending=False)
    print("\nFeature importance:")
    print(importances)

    joblib.dump(gbr, model_path)
    joblib.dump(encoder, encoder_path)
    print(f"\nSaved model to {model_path}")
    print(f"Saved encoder to {encoder_path}")

    return gbr, encoder


# ---------------------------------------------------------------------------
# Prediction
# ---------------------------------------------------------------------------

def predict_market_demand(context_df, encoder, model, week_number, province):
    """
    For each product, estimate 'next week' conditions by averaging the
    historical rows recorded for that week_number + province, then predict
    demand under those conditions.
    """
    subset = context_df[
        (context_df["week_number"] == week_number) & (context_df["province"] == province)
    ].copy()

    if subset.empty:
        raise ValueError(f"No historical rows found for week {week_number} in {province}.")

    agg_cols = [c for c in CATEGORICAL_COLS if c not in ("province", "product_name", "category")]
    per_product = subset.groupby(["product_name", "category"], as_index=False).agg(
        {**{c: _safe_mode for c in agg_cols}, "week_number": "first"}
    )
    per_product["province"] = province

    encoded = per_product.copy()
    encoded[CATEGORICAL_COLS] = encoder.transform(encoded[CATEGORICAL_COLS].astype(str))

    per_product["predicted_market_demand"] = model.predict(encoded[FEATURE_COLS])
    return per_product[["product_name", "category", "predicted_market_demand"]]


def compute_seller_signals(seller_df: pd.DataFrame) -> pd.DataFrame:
    grouped = seller_df.groupby("product_name").agg(
        category=("category", "first"),
        province=("province", "first"),
        total_sold=("quantity_sold", "sum"),
        first_sale=("sale_date", "min"),
        last_sale=("sale_date", "max"),
        current_stock_qty=("current_stock_qty", "last"),
        num_sales=("quantity_sold", "count"),
    ).reset_index()

    grouped["active_days"] = (grouped["last_sale"] - grouped["first_sale"]).dt.days.clip(lower=1)
    grouped["avg_daily_sales"] = grouped["total_sold"] / grouped["active_days"]
    grouped["seller_predicted_next_7_days"] = (grouped["avg_daily_sales"] * 7).round(1)
    grouped["low_confidence"] = grouped["num_sales"] < 3

    return grouped[["product_name", "category", "current_stock_qty",
                     "seller_predicted_next_7_days", "low_confidence"]]


def get_restock_recommendations(context_df, encoder, model, seller_df, province, week_number):
    market_demand_df = predict_market_demand(context_df, encoder, model, week_number, province)
    seller_signals_df = compute_seller_signals(seller_df)

    # --- Fuzzy-match seller product names onto context dataset product names ---
    name_map = build_product_name_map(
        seller_signals_df["product_name"].unique(),
        market_demand_df["product_name"].unique(),
    )
    seller_signals_df = seller_signals_df.copy()
    seller_signals_df["matched_product_name"] = seller_signals_df["product_name"].map(name_map)
    unmatched = seller_signals_df[seller_signals_df["matched_product_name"].isna()]
    if not unmatched.empty:
        print(f"Warning: {len(unmatched)} seller product(s) had no match in the context "
              f"dataset and were excluded from calibration/merge: "
              f"{unmatched['product_name'].tolist()}")

    seller_matched = seller_signals_df.dropna(subset=["matched_product_name"]).copy()

    combined = market_demand_df.merge(
        seller_matched.rename(columns={"product_name": "seller_product_name"}).drop(columns=["category"]),
        left_on="product_name", right_on="matched_product_name", how="left",
    )
    combined["has_sales_history"] = combined["seller_predicted_next_7_days"].notna()

    # --- Calibration: scale market-wide predictions down to this shop's scale ---
    matched_for_calibration = combined[combined["has_sales_history"]].copy()
    matched_for_calibration = matched_for_calibration[matched_for_calibration["predicted_market_demand"] > 0]
    if len(matched_for_calibration) >= 2:
        ratios = (
            matched_for_calibration["seller_predicted_next_7_days"]
            / matched_for_calibration["predicted_market_demand"]
        )
        shop_scale_factor = float(ratios.median())
        shop_scale_factor = min(max(shop_scale_factor, 0.001), 1.0)  # sanity clamp
    else:
        shop_scale_factor = 1.0
        print("Warning: fewer than 2 matched products available to calibrate shop scale; "
              "market-wide predictions for new products may be overstated.")
    print(f"Shop scale factor (this shop's estimated share of regional demand): {shop_scale_factor:.4f}")

    combined["predicted_market_demand_scaled"] = combined["predicted_market_demand"] * shop_scale_factor

    combined["blended_predicted_demand"] = np.where(
        combined["has_sales_history"],
        SELLER_WEIGHT * combined["seller_predicted_next_7_days"].fillna(0)
        + (1 - SELLER_WEIGHT) * combined["predicted_market_demand_scaled"],
        combined["predicted_market_demand_scaled"],  # no seller history -> scaled market signal
    )

    combined["current_stock_qty"] = combined["current_stock_qty"].fillna(0)
    combined["low_confidence"] = combined["low_confidence"].fillna(False)
    combined["suggested_order_qty"] = (
        combined["blended_predicted_demand"] - combined["current_stock_qty"]
    ).clip(lower=0).round(0)

    recommended = combined[combined["suggested_order_qty"] > 0].sort_values(
        "suggested_order_qty", ascending=False
    )

    return recommended[[
        "product_name", "category", "current_stock_qty", "blended_predicted_demand",
        "suggested_order_qty", "has_sales_history", "low_confidence",
    ]]


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Restock recommendation model")
    subparsers = parser.add_subparsers(dest="command", required=True)

    train_p = subparsers.add_parser("train", help="Train the demand model")
    train_p.add_argument("--context", required=True, help="Path to contextual demand dataset")
    train_p.add_argument("--model-out", default=DEFAULT_MODEL_PATH)
    train_p.add_argument("--encoder-out", default=DEFAULT_ENCODER_PATH)

    rec_p = subparsers.add_parser("recommend", help="Generate restock recommendations for a seller")
    rec_p.add_argument("--context", required=True, help="Path to contextual demand dataset")
    rec_p.add_argument("--seller", required=True, help="Path to seller's sales export xlsx")
    rec_p.add_argument("--province", required=True)
    rec_p.add_argument("--week", type=int, required=True, help="week_number (1-52) to predict for")
    rec_p.add_argument("--model", default=DEFAULT_MODEL_PATH)
    rec_p.add_argument("--encoder", default=DEFAULT_ENCODER_PATH)
    rec_p.add_argument("--out", default="restock_recommendations.csv")

    args = parser.parse_args()

    if args.command == "train":
        context_df = load_context_data(args.context)
        train_model(context_df, args.model_out, args.encoder_out)

    elif args.command == "recommend":
        context_df = load_context_data(args.context)
        model = joblib.load(args.model)
        encoder = joblib.load(args.encoder)
        seller_df = load_seller_export(args.seller)

        result = get_restock_recommendations(
            context_df, encoder, model, seller_df, args.province, args.week
        )

        pd.set_option("display.max_columns", None)
        pd.set_option("display.width", 160)

        restock_existing = result[result["has_sales_history"]]
        new_ideas = result[~result["has_sales_history"]]

        print("\nRestock (products this seller already sells):")
        print(restock_existing[["product_name", "current_stock_qty", "suggested_order_qty", "low_confidence"]].to_string(index=False))

        print("\nConsider adding (high predicted demand, not currently stocked):")
        print(new_ideas[["product_name", "suggested_order_qty"]].to_string(index=False))

        result.to_csv(args.out, index=False)
        print(f"\nSaved full output to {args.out}")


if __name__ == "__main__":
    main()