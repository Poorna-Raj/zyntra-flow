import joblib as jb

import numpy as np
import pandas as pd

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
model = jb.load("../model/glfe/model.pkl")
encoders = jb.load("../model/glfe/encoders.pkl")

PRODUCTS = [
    ("Coca-Cola", "Beverages"),
    ("Pepsi", "Beverages"),
    ("Elephant Ginger Beer", "Beverages"),
    ("Necto", "Beverages"),
    ("Tea Leaves", "Beverages"),
    ("Anchor Milk Powder", "Dairy"),
    ("Milo", "Dairy"),
    ("Kotmale Yoghurt", "Dairy"),
    ("Munchee Biscuits", "Snacks"),
    ("MD Crackers", "Snacks"),
    ("Ritzbury Chocolate", "Snacks"),
    ("Maggi Noodles", "Instant Foods"),
    ("Prima Noodles", "Instant Foods"),
    ("Rice", "Staples"),
    ("Red Rice", "Staples"),
    ("Dhal", "Staples"),
    ("Coconut Oil", "Cooking Essentials"),
    ("Sunflower Oil", "Cooking Essentials"),
    ("Rice Flour", "Cooking Essentials"),
    ("Wheat Flour", "Cooking Essentials"),
    ("Jaggery", "Sweeteners"),
    ("Sugar", "Sweeteners"),
    ("Ice Cream", "Frozen Foods"),
    ("Frozen Fish", "Frozen Foods"),
    ("Candles", "Household"),
    ("Lantern Materials", "Household"),
    ("Washing Powder", "Household"),
    ("Canned Fish", "Canned Goods"),
    ("Arrack", "Alcohol"),
    ("Lion Beer", "Alcohol"),
]

MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]


def week_to_month(week: int) -> str:
    return MONTHS[min(int((week - 1) / 52 * 12), 11)]


def safe_encode(encoder, value):
    classes = list(encoder.classes_)
    if value in classes:
        return encoder.transform([value])[0]
    return 0


class ForecastRequest(BaseModel):
    province: str
    week_number: int
    avg_temperature_level: str  # Low, Medium, High
    rainfall_level: str  # Low, Medium, High
    tourism_level: str  # Low, Medium, High
    payday_week: str  # Yes, No
    holiday_type: str  # None, Vesak, Poya, etc.
    festival_season: str  # Yes, No
    school_season: str  # Yes, No
    urbanization_level: str  # Low, Medium, High
    avg_income_level: str  # Low, Medium, High
    top_n: int = 10


@app.get("/")
def root():
    return {"status": "Demand Forecast API is running"}


@app.post("/forecast")
def forecast(req: ForecastRequest):
    month = week_to_month(req.week_number)
    rows = []

    for product_name, category in PRODUCTS:
        row = {
            "week_number": req.week_number,
            "month": safe_encode(encoders["month"], month),
            "province": safe_encode(encoders["province"], req.province),
            "product_name": safe_encode(encoders["product_name"], product_name),
            "category": safe_encode(encoders["category"], category),
            "avg_temperature_level": safe_encode(
                encoders["avg_temperature_level"], req.avg_temperature_level
            ),
            "rainfall_level": safe_encode(
                encoders["rainfall_level"], req.rainfall_level
            ),
            "tourism_level": safe_encode(encoders["tourism_level"], req.tourism_level),
            "payday_week": safe_encode(encoders["payday_week"], req.payday_week),
            "holiday_type": safe_encode(encoders["holiday_type"], req.holiday_type),
            "festival_season": safe_encode(
                encoders["festival_season"], req.festival_season
            ),
            "school_season": safe_encode(encoders["school_season"], req.school_season),
            "urbanization_level": safe_encode(
                encoders["urbanization_level"], req.urbanization_level
            ),
            "avg_income_level": safe_encode(
                encoders["avg_income_level"], req.avg_income_level
            ),
        }
        rows.append(row)

    X = pd.DataFrame(rows)
    log_preds = model.predict(X)
    preds = np.expm1(log_preds)

    results = []
    for i, (product_name, category) in enumerate(PRODUCTS):
        results.append(
            {
                "product_name": product_name,
                "category": category,
                "demand_score": round(float(preds[i]), 2),
            }
        )

    results.sort(key=lambda x: x["demand_score"], reverse=True)

    return {
        "province": req.province,
        "week_number": req.week_number,
        "month": month,
        "top_products": results[: req.top_n],
    }
