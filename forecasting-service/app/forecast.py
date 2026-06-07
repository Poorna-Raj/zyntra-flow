import numpy as np
import pandas as pd


def safe_encode(encoder, value) -> int:
    if value in list(encoder.classes_):
        return encoder.transform([value])[0]
    return 0


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


def build_features(req, encoders: dict, products: list[dict]) -> pd.DataFrame:
    month = week_to_month(req.week_number)

    enc = {
        "province": safe_encode(encoders["province"], req.province),
        "month": safe_encode(encoders["month"], month),
        "temp": safe_encode(
            encoders["avg_temperature_level"], req.avg_temperature_level
        ),
        "rain": safe_encode(encoders["rainfall_level"], req.rainfall_level),
        "tourism": safe_encode(encoders["tourism_level"], req.tourism_level),
        "payday": safe_encode(encoders["payday_week"], req.payday_week),
        "holiday": safe_encode(encoders["holiday_type"], req.holiday_type),
        "festival": safe_encode(encoders["festival_season"], req.festival_season),
        "school": safe_encode(encoders["school_season"], req.school_season),
        "urban": safe_encode(encoders["urbanization_level"], req.urbanization_level),
        "income": safe_encode(encoders["avg_income_level"], req.avg_income_level),
    }

    rows = []
    for product in products:
        ep = safe_encode(encoders["product_name"], product["product_name"])
        ec = safe_encode(encoders["category"], product["category"])

        rows.append(
            {
                "week_number": req.week_number,
                "month": enc["month"],
                "province": enc["province"],
                "product_name": ep,
                "category": ec,
                "avg_temperature_level": enc["temp"],
                "rainfall_level": enc["rain"],
                "tourism_level": enc["tourism"],
                "payday_week": enc["payday"],
                "holiday_type": enc["holiday"],
                "festival_season": enc["festival"],
                "school_season": enc["school"],
                "urbanization_level": enc["urban"],
                "avg_income_level": enc["income"],
                "income_urban_index": enc["income"] * enc["urban"],
                "heat_beverage_signal": enc["temp"] * ec,
                "festival_holiday_combo": enc["festival"] * enc["holiday"],
                "payday_snack_signal": enc["payday"] * ec,
                "province_category": enc["province"] * ec,
                "province_product": enc["province"] * ep,
                "week_holiday": req.week_number * enc["holiday"],
            }
        )

    return pd.DataFrame(rows), month


def run_forecast(
    req, model, encoders: dict, products: list[dict], top_n: int
) -> list[dict]:
    X, month = build_features(req, encoders, products)
    predicts = np.expm1(model.predict(X))

    results = sorted(
        [
            {
                "product_id": product["id"],
                "product_name": product["product_name"],
                "category": product["category"],
                "price": product["Price"],
                "imageUrl": product["image_url"],
                "demand_score": round(float(predicts[i]), 2),
            }
            for i, product in enumerate(products)
        ],
        key=lambda x: x["demand_score"],
        reverse=True,
    )

    return month, results[:top_n]
