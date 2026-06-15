export interface MenuItem {
  label: string;
  icon: string;
  path: string;
}

export interface StatCardData {
  title: string;
  value: string;
  growth: string;
  gradient: string;
  icon: string;
}

export interface ActivityRow {
  product: string;
  province: string;
  forecastScore: string;
  status: "High" | "Medium" | "Stable";
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  province: string;
  demandLevel: "High" | "Medium" | "Low";
  createdAt: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  province: string;
  demandLevel: "High" | "Medium" | "Low";
}

export interface Forecast {
  id: string;
  province: string;
  product: string;
  predictedDemand: number;
  confidence: number;
  trend: "Up" | "Down" | "Stable";
  createdAt: string;
}

export interface ForecastFormData {
  province: string;
  product: string;
  predictedDemand: number;
  confidence: number;
  trend: "Up" | "Down" | "Stable";
}