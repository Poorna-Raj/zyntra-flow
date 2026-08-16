const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface ForecastRequest {
  province: string;
  week_number: number;
  avg_temperature_level: string;
  rainfall_level: string;
  tourism_level: string;
  payday_week: string;
  holiday_type: string;
  festival_season: string;
  school_season: string;
  urbanization_level: string;
  avg_income_level: string;
  top_n?: number;
}

export interface ForecastProduct {
  product_id: string;
  product_name: string;
  category: string;
  price: number | null;
  imageUrl: string | null;
  demand_score: number;
}

export interface ForecastResponse {
  province: string;
  week_number: number;
  month: string;
  top_products: ForecastProduct[];
}

export async function getForecast(req: ForecastRequest): Promise<ForecastResponse> {
  const res = await fetch(`${API_URL}/forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) throw new Error("Forecast request failed");
  return res.json();
}