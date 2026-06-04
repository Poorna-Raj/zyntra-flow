export interface ActivityRow {
  product: string;
  province: string;
  forecastScore: string;
  status: "High" | "Medium" | "Stable";
}