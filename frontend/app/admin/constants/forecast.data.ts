import { Forecast } from "../types/forecast.types";

export const forecastData: Forecast[] = [
  {
    id: "F001",
    province: "Western",
    product: "Coca Cola",
    predictedDemand: 1250,
    confidence: 96,
    trend: "Up",
    createdAt: "2026-06-01",
  },
  {
    id: "F002",
    province: "Central",
    product: "Milk Powder",
    predictedDemand: 850,
    confidence: 91,
    trend: "Stable",
    createdAt: "2026-06-01",
  },
  {
    id: "F003",
    province: "Southern",
    product: "Bread",
    predictedDemand: 720,
    confidence: 88,
    trend: "Down",
    createdAt: "2026-06-01",
  },
  {
    id: "F004",
    province: "Northern",
    product: "Rice",
    predictedDemand: 1500,
    confidence: 97,
    trend: "Up",
    createdAt: "2026-06-01",
  },
];