"""
Step 3: FastAPI service exposing /predict and /retrain.

Reads recent province_sale_snapshots from Supabase, builds the same
features used in training, predicts next week's units, and writes the
result into province_forecasts.

ENV VARS required:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY   (server-side key, has write access)

Run:
  pip install fastapi uvicorn supabase joblib pandas scikit-learn
  uvicorn app:app --reload
"""

import os
import json
import joblib
import pandas as pd
from datetime import timedelta
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()  # reads .env in the current working directory

app = FastAPI(title="Province Forecast Service")

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

model = joblib.load("../model/g-model.joblib")
with open("../model/feature_columns.json") as f:
    meta = json.load(f)

FEATURE_COLS = meta["feature_cols"]
PROVINCE_MAP = meta["province_map"]
PRODUCT_MAP = meta["product_map"]


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

    # write to province_forecasts
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


@app.get("/health")
def health():
    return {"status": "ok"}
