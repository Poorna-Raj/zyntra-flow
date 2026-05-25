export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Team", href: "#team" },
  { label: "Legal", href: "#legal" },
  { label: "Contact Us", href: "#contact" },
];

export const FEATURES = [
  {
    title: "Smart Inventory Management",
    description: "Real-time tracking of product stock levels with automatic low-stock detection to prevent over-ordering, dead stock, and empty shelves.",
    badge: "Average weekly sales",
    metric: "41,379 LKR",
    change: "+9.68%",
    chartData: [40, 55, 45, 60, 50, 75, 40]
  },
  {
    title: "AI Demand Forecasting",
    description: "Supervised machine learning regression models analyze regional behaviors and local conditions to accurately predict upcoming product demand spikes.",
    badge: "Forecasted intensity",
    metric: "91% Confidence",
    change: "High Demand",
    chartData: [30, 40, 35, 50, 65, 45, 30]
  },
  {
    title: "Vendor & Purchase Optimization",
    description: "Automatically recommends optimal purchase quantities and delivery periods based on localized upcoming festive periods and salary cycles.",
    isBackedBadge: true
  },
  {
    title: "Waste Tracking & Analytics",
    description: "Monitors overstock trends, identifies high-risk perishable expiration items, and provides actionable data insights to slash SME capital waste.",
    darkVariant: true,
    lines: true
  },
  {
    title: "Real-Time Dashboard & Alerts",
    description: "A centralized command terminal with clear metrics, regional demand comparisons, and instant predictive alerts for faster decision-making.",
    hasAlertCard: true
  }
];

export const FAQS = [
  {
    question: "What is Syntrix and who is it designed for?",
    answer: "Syntrix is an AI-powered localized product demand forecasting and recommendation platform engineered for Sri Lankan small and medium enterprises (SMEs). It helps small grocery stores, supermarkets, and independent retailers identify which specific items (SKUs) will experience spikes or drops in demand on a weekly basis, bypassing the need for complex POS integrations or historical enterprise data infrastructure."
  },
  {
    question: "Do I need complex historical digital datasets to get started?",
    answer: "Not at all. Syntrix is natively designed for shops that operate without digital systems or databases. It bootstraps immediate predictive parameters using a unique contextual forecasting layer combining regional cultural variations, synthetic baseline records, and localized behavioral demand matrices."
  }
];

export const ROADMAP = [
  {
    phase: "Phase 1 — Foundation (2025)",
    items: [
      "Project concept definition and market friction analysis",
      "Field requirement gathering alongside local SME retailers",
      "System design and modular macro-architecture mapping",
      "Development of core localized data structures"
    ]
  },
  {
    phase: "Phase 2 — Intelligence (2025 Dec - Present)",
    items: [
      "Supervised ML Regression Engine implementation (XGBoost/Random Forest)",
      "Contextual Behavioral and Cultural Signal ingestion pipelines",
      "Dashboard development and interactive layout optimization",
      "LLM-backed AI Business Assistant integration and testing"
    ],
    highlight: true
  },
  {
    phase: "Phase 3 — Expansion",
    items: [
      "Live POS/ERP streaming API structural layer deployment",
      "Dynamic continuous automated model retuning integrations",
      "Multi-industry expansion paths (Pharmacies, Apparel, Electronics)",
      "Localized mobile web variant dashboard buildout"
    ]
  }
];