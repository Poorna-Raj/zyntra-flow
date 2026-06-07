import joblib as jb
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import database
from forecast import run_forecast


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = jb.load("../model/glfe/model.pkl")
    app.state.encoders = jb.load("../model/glfe/encoders.pkl")
    database.refresh_products()
    print(f"Loaded {len(database.get_products())} products from DB")
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.post("/products/refresh")
def refresh_products():
    products = database.refresh_products()
    return {"message": f"Product cache refreshed. {len(products)} products loaded."}


@app.post("/forecast")
def forecast(req: ForecastRequest):
    products = database.get_products()
    if not products:
        raise HTTPException(status_code=503, detail="Product list not loaded yet.")

    month, top_products = run_forecast(
        req,
        model=app.state.model,
        encoders=app.state.encoders,
        products=products,
        top_n=req.top_n,
    )

    return {
        "province": req.province,
        "week_number": req.week_number,
        "month": month,
        "top_products": top_products,
    }
