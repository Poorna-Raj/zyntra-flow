import {
  ActivityRow,
  MenuItem,
  StatCardData,
} from "../types/admin.types";
import { Forecast } from "../types/forecast.types";


/* ===========================
   Activity Data
=========================== */

export const activityData: ActivityRow[] = [
  {
    product: "Coca-Cola",
    province: "Western",
    forecastScore: "920",
    status: "High",
  },
  {
    product: "Rice Flour",
    province: "Southern",
    forecastScore: "860",
    status: "Medium",
  },
  {
    product: "Milk Powder",
    province: "Central",
    forecastScore: "780",
    status: "Stable",
  },
  {
    product: "Soft Drinks",
    province: "Northern",
    forecastScore: "970",
    status: "High",
  },
];

/* ===========================
   Filters
=========================== */

export const categoryOptions = [
  "Beverages",
  "Dairy",
  "Bakery",
  "Groceries",
];

export const provinceOptions = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

export const demandOptions = [
  "High",
  "Medium",
  "Low",
];

export const sortOptions = [
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Price: Low to High",
    value: "price-low",
  },
  {
    label: "Price: High to Low",
    value: "price-high",
  },
  {
    label: "Stock: Low to High",
    value: "stock-low",
  },
  {
    label: "Stock: High to Low",
    value: "stock-high",
  },
];

/* ===========================
   Forecast Data
=========================== */

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

/* ===========================
   Menu Data
=========================== */

export const menuData: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "🏠",
    path: "/admin",
  },
  {
    label: "Products",
    icon: "📦",
    path: "/admin/products",
  },
  {
    label: "Forecasts",
    icon: "📊",
    path: "/admin/forecasts",
  },
  {
    label: "Settings",
    icon: "⚙️",
    path: "/admin/settings",
  },
  {
    label: "Profile",
    icon: "👤",
    path: "/admin/profile",
  },
];

/* ===========================
   Dashboard Stats
=========================== */

export const statsData: StatCardData[] = [
  {
    title: "Weekly Sales",
    value: "$15,000",
    growth: "Increased by 60%",
    gradient:
      "linear-gradient(135deg,#FDBA74 0%,#F472B6 100%)",
    icon: "📈",
  },
  {
    title: "Weekly Orders",
    value: "45,634",
    growth: "Decreased by 10%",
    gradient:
      "linear-gradient(135deg,#7DD3FC 0%,#3B82F6 100%)",
    icon: "📘",
  },
  {
    title: "Visitors Online",
    value: "95,741",
    growth: "Increased by 5%",
    gradient:
      "linear-gradient(135deg,#5EEAD4 0%,#2DD4BF 100%)",
    icon: "💎",
  },
];