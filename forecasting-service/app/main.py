"""
Step 3: FastAPI service exposing /predict, /predict-all, and /restock/recommend.

Reads recent province_sale_snapshots from Supabase, builds the same
features used in training, predicts next week's units, and writes the
result into province_forecasts. Also exposes a restock recommendation
endpoint that blends market context + a seller's uploaded sales history.

ENV VARS required:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY   (server-side key, has write access)
  CONTEXT_DATASET_PATH        path to the contextual demand dataset (csv/xlsx)

ENV VARS optional:
  RESTOCK_MODEL_PATH    defaults to restock_model.joblib
  RESTOCK_ENCODER_PATH  defaults to restock_encoders.joblib

Run:
  pip install fastapi uvicorn supabase joblib pandas scikit-learn python-multipart
  uvicorn app:app --reload
"""

import io
import os
import json
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv
from restock_signal import build_recommendations as build_market_signal

from reorder_predict import load_context_data, get_restock_recommendations

load_dotenv()  # reads .env in the current working directory

app = FastAPI(title="Province Forecast + Restock Service")

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

CONTEXT_DATASET_PATH = os.environ.get("CONTEXT_DATASET_PATH")
RESTOCK_MODEL_PATH = os.environ.get("RESTOCK_MODEL_PATH", "restock_model.joblib")
RESTOCK_ENCODER_PATH = os.environ.get("RESTOCK_ENCODER_PATH", "restock_encoders.joblib")

try:
    model = joblib.load("../model/g-model.joblib")
    with open("../model/feature_columns.json") as f:
        meta = json.load(f)
    FEATURE_COLS = meta["feature_cols"]
    PROVINCE_MAP = meta["province_map"]
    PRODUCT_MAP = meta["product_map"]
except Exception as e:
    print(f"[main] g-model artifacts not loaded: {e} - /predict and /predict-all will be unavailable.")
    model = None
    FEATURE_COLS = PROVINCE_MAP = PRODUCT_MAP = {}

# --- restock model artifacts — loaded once at startup, kept separate from g-model ---
_context_df = None
_restock_model = None
_restock_encoder = None


# Replace the startup event's exception-raising with a warning instead:
@app.on_event("startup")
def load_restock_artifacts():
    global _context_df, _restock_model, _restock_encoder

    if not CONTEXT_DATASET_PATH:
        print("[main] CONTEXT_DATASET_PATH not set - /restock/recommend will be unavailable.")
        return

    try:
        _context_df = load_context_data(CONTEXT_DATASET_PATH)
        _restock_model = joblib.load(RESTOCK_MODEL_PATH)
        _restock_encoder = joblib.load(RESTOCK_ENCODER_PATH)
    except Exception as e:
        print(f"[main] Restock model artifacts not loaded: {e} - /restock/recommend will be unavailable.")

class PredictRequest(BaseModel):
    province: str
    master_product_id: str
    target_week: str  # ISO date string, e.g. "2025-07-07"


def build_features(
    province: str, master_product_id: str, target_week: str
) -> pd.DataFrame:
    """Pull last 4 weeks of snapshots for this (province, product) and build features."""
    resp = (
        supabase.table("province_sale_snapshots")
        .select("week, total_units_sold")
        .eq("province", province)
        .eq("master_product_id", master_product_id)
        .order("week", desc=True)
        .limit(4)
        .execute()
    )
    rows = resp.data
    if len(rows) < 4:
        raise HTTPException(
            status_code=400,
            detail=f"Not enough history for {province}/{master_product_id} (need 4 weeks, have {len(rows)})",
        )

    rows = sorted(rows, key=lambda r: r["week"])  # oldest -> newest
    units = [r["total_units_sold"] for r in rows]

    lag_1, lag_2, lag_3, lag_4 = units[-1], units[-2], units[-3], units[-4]
    rolling_mean_4 = sum(units) / 4
    rolling_std_4 = pd.Series(units).std()

    target_date = pd.to_datetime(target_week)

    if province not in PROVINCE_MAP:
        raise HTTPException(status_code=400, detail=f"Unknown province: {province}")
    if master_product_id not in PRODUCT_MAP:
        raise HTTPException(
            status_code=400, detail=f"Unknown master_product_id: {master_product_id}"
        )

    feat = {
        "lag_1": lag_1,
        "lag_2": lag_2,
        "lag_3": lag_3,
        "lag_4": lag_4,
        "rolling_mean_4": rolling_mean_4,
        "rolling_std_4": rolling_std_4,
        "week_of_year": int(target_date.isocalendar().week),
        "month": int(target_date.month),
        "province_enc": PROVINCE_MAP[province],
        "product_enc": PRODUCT_MAP[master_product_id],
    }
    return pd.DataFrame([feat])[FEATURE_COLS]


@app.post("/predict")
def predict(req: PredictRequest):
    X = build_features(req.province, req.master_product_id, req.target_week)
    pred = model.predict(X)[0]
    pred_units = max(0, round(float(pred)))

    supabase.table("province_forecasts").insert(
        {
            "master_product_id": req.master_product_id,
            "province": req.province,
            "week": req.target_week,
            "demand": float(pred),
            "units": pred_units,
        }
    ).execute()

    return {
        "province": req.province,
        "master_product_id": req.master_product_id,
        "week": req.target_week,
        "predicted_units": pred_units,
    }


@app.post("/predict-all")
def predict_all(target_week: str):
    """Generate forecasts for every (province, product) combo for the given week."""
    results = []
    for province in PROVINCE_MAP:
        for product_id in PRODUCT_MAP:
            try:
                X = build_features(province, product_id, target_week)
                pred = model.predict(X)[0]
                pred_units = max(0, round(float(pred)))
                supabase.table("province_forecasts").insert(
                    {
                        "master_product_id": product_id,
                        "province": province,
                        "week": target_week,
                        "demand": float(pred),
                        "units": pred_units,
                    }
                ).execute()
                results.append(
                    {
                        "province": province,
                        "product_id": product_id,
                        "predicted_units": pred_units,
                    }
                )
            except HTTPException:
                continue
    return {"count": len(results), "results": results}


def _load_seller_export_from_upload(file_bytes: bytes, sheet_name: str = "Sales Export") -> pd.DataFrame:
    """Same validation as restock_model.load_seller_export(), but reads from bytes instead of a path."""
    required = ["sale_date", "product_name", "category", "quantity_sold",
                "unit", "province", "current_stock_qty"]
    try:
        df = pd.read_excel(io.BytesIO(file_bytes), sheet_name=sheet_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read seller export: {e}")

    missing = [c for c in required if c not in df.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"Seller export is missing required columns: {missing}")

    df["sale_date"] = pd.to_datetime(df["sale_date"], errors="coerce")
    df["quantity_sold"] = pd.to_numeric(df["quantity_sold"], errors="coerce")
    df["current_stock_qty"] = pd.to_numeric(df["current_stock_qty"], errors="coerce")
    df = df.dropna(subset=["sale_date", "product_name", "quantity_sold"])

    if df.empty:
        raise HTTPException(status_code=400, detail="Seller export had no valid rows after cleaning.")

    return df


@app.post("/restock/recommend")
async def recommend(
    province: str = Form(...),
    week_number: int = Form(...),
    seller_file: UploadFile = File(...),
):
    if _restock_model is None or _restock_encoder is None or _context_df is None:
        raise HTTPException(status_code=503, detail="Restock model artifacts not loaded yet.")

    file_bytes = await seller_file.read()
    seller_df = _load_seller_export_from_upload(file_bytes)

    try:
        result_df = get_restock_recommendations(
            _context_df, _restock_encoder, _restock_model, seller_df, province, week_number
        )
    except ValueError as e:
        # no historical context rows for that province/week combo
        raise HTTPException(status_code=400, detail=str(e))

    # NaN/inf don't serialize to JSON cleanly
    result_df = result_df.replace([float("inf"), float("-inf")], None)

    return {
        "province": province,
        "week_number": week_number,
        "count": len(result_df),
        "recommendations": result_df.to_dict(orient="records"),
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "forecast_model_loaded": model is not None,
        "restock_model_loaded": _restock_model is not None,
        "context_rows": len(_context_df) if _context_df is not None else 0,
    }
    
@app.get("/market-signal")
def market_signal():
    """
    Live category-level demand/stock signal from the competitor
    scraper pipeline - a same-day snapshot (not a forecast), blending
    each store's demand_score and stock_risk into one row per category.
    Separate from /restock/recommend, which needs an uploaded seller
    export and serves a different, ML-driven recommendation.
    """
    df = build_market_signal(supabase)
    if df.empty:
        raise HTTPException(status_code=503, detail="No market signal data available yet.")
    df = df.replace([float("inf"), float("-inf")], None)
    return {"count": len(df), "signals": df.to_dict(orient="records")}


@app.get("/market-signal/low-stock")
def market_signal_low_stock():
    """Categories currently flagged LOW STOCK ALERT - a quick-glance
    endpoint, same pattern as /market-trend/good-sellers."""
    df = build_market_signal(supabase)
    if df.empty:
        raise HTTPException(status_code=503, detail="No market signal data available yet.")
    alerts = df[df["stock_signal"] == "LOW STOCK ALERT"]
    alerts = alerts.replace([float("inf"), float("-inf")], None)
    return {"count": len(alerts), "low_stock_categories": alerts.to_dict(orient="records")}


@app.get("/market-signal/{category}")
def market_signal_for_category(category: str):
    df = build_market_signal(supabase)
    if df.empty:
        raise HTTPException(status_code=503, detail="No market signal data available yet.")
    match = df[df["category"].str.lower() == category.lower()]
    if match.empty:
        raise HTTPException(status_code=404, detail=f"No market signal found for category '{category}'")
    return match.to_dict(orient="records")[0]