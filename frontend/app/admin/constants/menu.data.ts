import { MenuItem } from "../types/menu.types";

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