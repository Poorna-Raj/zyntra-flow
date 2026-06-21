"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────── types ─────────────────────────── */
type Province =
  | "All"
  | "Western"
  | "Southern"
  | "Central"
  | "Northern"
  | "Eastern"
  | "North Western"
  | "North Central"
  | "Uva"
  | "Sabaragamuwa";
type Category = "All" | string;
type DemandLevel = "All Levels" | "HIGH" | "MEDIUM" | "LOW";
type SortBy = "Units ↓" | "Units ↑" | "Name A–Z" | "Trend ↓" | "Trend ↑";

interface ForecastRow {
  id: string;
  master_product_id: string;
  province: Exclude<Province, "All">;
  week: string;
  units: number;
}

interface MasterProduct {
  id: string;
  name: string;
  category: string;
  image_url: string | null;
}

interface ProductCard {
  id: string;
  name: string;
  category: string;
  province: Exclude<Province, "All">;
  imageUrl: string | null;
  predictedUnits: number;
  trendPct: number | null; // null when no prior week to compare against
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
  week: string;
}

const PROVINCES: Province[] = [
  "All",
  "Western",
  "Southern",
  "Central",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];
const DEMAND_LEVELS: DemandLevel[] = ["All Levels", "HIGH", "MEDIUM", "LOW"];
const SORT_OPTIONS: SortBy[] = [
  "Units ↓",
  "Units ↑",
  "Name A–Z",
  "Trend ↓",
  "Trend ↑",
];

const demandTextClass: Record<string, string> = {
  HIGH: "demand-high",
  MEDIUM: "demand-medium",
  LOW: "demand-low",
};

// Simple terciles-based demand level from units within the currently loaded set
function computeDemandLevel(
  units: number,
  sorted: number[],
): "HIGH" | "MEDIUM" | "LOW" {
  if (sorted.length === 0) return "MEDIUM";
  const idx = sorted.findIndex((v) => v === units);
  const pct = idx / Math.max(1, sorted.length - 1); // 0 = lowest, 1 = highest (sorted ascending)
  if (pct >= 0.66) return "HIGH";
  if (pct >= 0.33) return "MEDIUM";
  return "LOW";
}

/* ────────────────────────── dropdown ───────────────────────── */
interface DropdownProps<T extends string> {
  value: T;
  onChange: (val: T) => void;
  options: T[];
  labelPrefix?: string;
}

function CustomDropdown<T extends string>({
  value,
  onChange,
  options,
  labelPrefix = "",
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className={`dropdown-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {labelPrefix}
          {value}
        </span>
        <svg
          className="dropdown-arrow"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="#a1a1aa"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`dropdown-item ${value === opt ? "selected" : ""}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── page ──────────────────────────── */
export default function ProductPage() {
  const [province, setProvince] = useState<Province>("All");
  const [category, setCategory] = useState<Category>("All");
  const [demandLevel, setDemandLevel] = useState<DemandLevel>("All Levels");
  const [sortBy, setSortBy] = useState<SortBy>("Units ↓");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<ProductCard[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // 1. Latest two weeks of forecasts (need previous week for trend %)
        const { data: forecastRows, error: forecastErr } = await supabase
          .from("province_forecasts")
          .select("id, master_product_id, province, week, units")
          .order("week", { ascending: false })
          .limit(2000); // adjust as data grows; consider server-side filtering by week range

        if (forecastErr) throw forecastErr;
        if (!forecastRows || forecastRows.length === 0) {
          setCards([]);
          setLoading(false);
          return;
        }

        // 2. Master products for name/category/image
        const { data: products, error: productsErr } = await supabase
          .from("master_products")
          .select("id, name, category, image_url");

        if (productsErr) throw productsErr;

        const productMap = new Map<string, MasterProduct>(
          (products ?? []).map((p) => [p.id, p as MasterProduct]),
        );

        // 3. Group forecasts by (province, master_product_id), sorted by week desc
        const grouped = new Map<string, ForecastRow[]>();
        for (const row of forecastRows as ForecastRow[]) {
          const key = `${row.province}::${row.master_product_id}`;
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key)!.push(row);
        }

        const builtCards: ProductCard[] = [];
        for (const [, rows] of grouped) {
          // rows sorted desc by week already (from query order)
          const latest = rows[0];
          const previous = rows.find((r) => r.week !== latest.week);

          const trendPct =
            previous && previous.units > 0
              ? Math.round(
                  ((latest.units - previous.units) / previous.units) * 1000,
                ) / 10
              : null;

          const product = productMap.get(latest.master_product_id);

          builtCards.push({
            id: `${latest.province}-${latest.master_product_id}`,
            name: product?.name ?? "Unknown product",
            category: product?.category ?? "Uncategorized",
            province: latest.province,
            imageUrl: product?.image_url ?? null,
            predictedUnits: latest.units,
            trendPct,
            demandLevel: "MEDIUM", // placeholder, recalculated below
            week: latest.week,
          });
        }

        // Compute demand level relative to the full loaded set
        const allUnitsSorted = builtCards
          .map((c) => c.predictedUnits)
          .sort((a, b) => a - b);
        for (const card of builtCards) {
          card.demandLevel = computeDemandLevel(
            card.predictedUnits,
            allUnitsSorted,
          );
        }

        const uniqueCategories = Array.from(
          new Set(builtCards.map((c) => c.category)),
        ).sort();
        setCategories(["All", ...uniqueCategories]);
        setCards(builtCards);
      } catch (e: any) {
        setError(e.message ?? "Failed to load forecasts");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return cards
      .filter(
        (p) =>
          (province === "All" || p.province === province) &&
          (category === "All" || p.category === category) &&
          (demandLevel === "All Levels" || p.demandLevel === demandLevel) &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "Units ↓") return b.predictedUnits - a.predictedUnits;
        if (sortBy === "Units ↑") return a.predictedUnits - b.predictedUnits;
        if (sortBy === "Trend ↓")
          return (b.trendPct ?? -Infinity) - (a.trendPct ?? -Infinity);
        if (sortBy === "Trend ↑")
          return (a.trendPct ?? Infinity) - (b.trendPct ?? Infinity);
        return a.name.localeCompare(b.name);
      });
  }, [cards, province, category, demandLevel, sortBy, search]);

  const totalUnits = filtered.reduce((s, p) => s + p.predictedUnits, 0);

  return (
    <div className="trends-page">
      <style>{`
        .trends-page {
          background-color: #000000;
          color: #ffffff;
          font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          min-height: 100vh;
        }

        .trends-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 8rem 1rem 10rem 1rem;
        }

        .trends-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .header-title-area { flex: 1.2; }

        .live-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #10b981;
          background-color: rgba(16, 185, 129, 0.06);
          border: 1px solid rgba(16, 185, 129, 0.15);
          padding: 0.4rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }

        .live-dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: status-pulse 2s infinite ease-in-out;
        }

        @keyframes status-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .section-subtitle {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #a1a1aa;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          display: block;
        }

        .section-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #ffffff;
        }

        .header-desc {
          flex: 1;
          color: #a1a1aa;
          font-size: 1.05rem;
          line-height: 1.7;
          margin-top: 2rem;
        }

        .trends-hero-image {
          width: 100%;
          height: 380px;
          background: #121212;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          margin-bottom: 5rem;
          overflow: hidden;
          position: relative;
        }

        .trends-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) contrast(1.05);
        }

        .province-tabs-wrapper {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 3rem;
          padding-bottom: 0.5rem;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }

        .province-tabs-wrapper::-webkit-scrollbar { display: none; }

        .province-tab-btn {
          background: none;
          border: none;
          color: #71717a;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.75rem 0;
          margin-right: 2rem;
          cursor: pointer;
          transition: color 0.3s ease;
          position: relative;
        }

        .province-tab-btn:hover { color: #ffffff; }

        .province-tab-btn.active {
          color: #ffffff;
          font-weight: 600;
        }

        .province-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -0.6rem;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #ffffff;
        }

        .custom-dropdown { position: relative; display: inline-block; }

        .dropdown-trigger {
          font-family: inherit;
          font-size: 0.9rem;
          color: #a1a1aa;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-width: 160px;
          transition: border-color 0.3s ease, color 0.3s ease;
        }

        .dropdown-trigger:hover,
        .dropdown-trigger.active {
          border-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .dropdown-arrow { transition: transform 0.3s ease; }

        .dropdown-trigger.active .dropdown-arrow { transform: rotate(180deg); }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 100;
          min-width: 100%;
          background-color: #121212;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          padding: 0.4rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dropdown-item {
          background: transparent;
          border: none;
          color: #a1a1aa;
          padding: 0.6rem 1rem;
          text-align: left;
          font-size: 0.9rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .dropdown-item.selected {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-weight: 500;
        }

        .filters-panel {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 4rem;
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .minimal-search-wrapper { position: relative; }

        .minimal-search-input {
          font-family: inherit;
          font-size: 0.9rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 0.6rem 1rem 0.6rem 2.2rem;
          border-radius: 8px;
          width: 220px;
          transition: border-color 0.3s ease;
        }

        .minimal-search-input::placeholder { color: #71717a; }

        .minimal-search-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .metrics-bar {
          display: flex;
          align-items: center;
          gap: 4rem;
          margin-bottom: 3rem;
          color: #71717a;
          font-size: 0.9rem;
        }

        .metric-item strong {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .trends-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .trend-card {
          background-color: #121212;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .trend-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .product-image-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          overflow: hidden;
          background: #1a1a1a;
          flex-shrink: 0;
        }

        .product-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #444;
        }

        .category-tag {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #71717a;
          font-size: 0.85rem;
        }

        .card-middle { margin-bottom: auto; }

        .product-name {
          font-size: 1.3rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
          margin-bottom: 0.4rem;
          letter-spacing: -0.01em;
        }

        .province-name-tag {
          font-size: 0.85rem;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .card-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
          margin-top: 2rem;
        }

        .units-area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .units-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #71717a;
        }

        .units-value {
          font-family: "Georgia", serif;
          font-style: italic;
          font-size: 1.1rem;
          color: #ffffff;
        }

        .card-footer-tags {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          font-size: 0.8rem;
        }

        .demand-scale {
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
        }
        .demand-high { color: #10b981; }
        .demand-medium { color: #f5a623; }
        .demand-low { color: #71717a; }

        .trend-label {
          font-family: "Georgia", serif;
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }
        .trend-flat { color: #71717a; }

        .empty-state {
          text-align: center;
          padding: 8rem 0;
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          color: #71717a;
        }

        .empty-state h3 {
          color: #ffffff;
          font-family: "Georgia", serif;
          font-style: italic;
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }

        @media (max-width: 1024px) {
          .trends-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        }

        @media (max-width: 900px) {
          .trends-header { flex-direction: column; gap: 1.5rem; margin-bottom: 4rem; }
          .header-desc { margin-top: 0; }
          .filters-panel { flex-direction: column; align-items: flex-start; }
          .filter-group { width: 100%; }
          .minimal-search-wrapper, .minimal-search-input { width: 100%; }
          .trends-hero-image { height: 250px; }
        }

        @media (max-width: 600px) {
          .trends-grid { grid-template-columns: 1fr; max-width: 380px; margin: 0 auto; }
        }
      `}</style>

      <Navbar />

      <div className="trends-container">
        <div className="trends-header">
          <div className="header-title-area">
            <div className="live-status-badge">
              <span className="live-dot-pulse" />
              Connected · Live Forecast Feed
            </div>
            <span className="section-subtitle">Real-Time Market Telemetry</span>
            <h1 className="section-title">Sri Lankan Market Pulse</h1>
          </div>
          <div className="header-desc">
            Province-level demand forecasts generated from historical sales
            patterns across Sri Lanka&apos;s 9 provinces.
          </div>
        </div>

        <div className="trends-hero-image">
          <img
            src="https://www.igrain.in/admin/images/1717578894.jpg"
            alt="Real-time retail network telemetry visualization"
          />
        </div>

        <div className="province-tabs-wrapper">
          {PROVINCES.map((p) => (
            <button
              key={p}
              className={`province-tab-btn${province === p ? " active" : ""}`}
              onClick={() => setProvince(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="filters-panel">
          <div className="filter-group">
            <CustomDropdown
              value={category}
              onChange={setCategory}
              options={categories}
              labelPrefix="Category: "
            />

            <CustomDropdown
              value={demandLevel}
              onChange={setDemandLevel}
              options={DEMAND_LEVELS}
              labelPrefix="Demand: "
            />

            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
            />
          </div>

          <div className="minimal-search-wrapper">
            <svg
              className="search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#71717a"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="minimal-search-input"
              placeholder="Search regional items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="metrics-bar">
          <div className="metric-item">
            Showing <strong>{filtered.length}</strong> products
          </div>
          {filtered.length > 0 && (
            <div className="metric-item">
              Total Predicted Units:{" "}
              <strong>{totalUnits.toLocaleString()}</strong>
            </div>
          )}
        </div>

        {loading ? (
          <div className="empty-state">
            <h3>Loading forecasts…</h3>
          </div>
        ) : error ? (
          <div className="empty-state">
            <h3>Couldn&apos;t load forecasts</h3>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No demand metrics found</h3>
            <p>
              Try clearing your current filters or searching for a different
              product keyword.
            </p>
          </div>
        ) : (
          <div className="trends-grid">
            {filtered.map((p) => (
              <div key={p.id} className="trend-card">
                <div className="card-top">
                  <div className="product-image-wrapper">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} />
                    ) : (
                      <div className="product-image-fallback">📦</div>
                    )}
                  </div>
                  <span className="category-tag">{p.category}</span>
                </div>

                <div className="card-middle">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="province-name-tag">
                    <svg width="8" height="11" viewBox="0 0 10 13" fill="none">
                      <path
                        d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5z"
                        fill="#71717a"
                      />
                    </svg>
                    {p.province} Province
                  </div>
                </div>

                <div className="card-bottom">
                  <div className="units-area">
                    <span className="units-label">
                      Predicted Units ({p.week})
                    </span>
                    <span className="units-value">
                      {p.predictedUnits.toLocaleString()}
                    </span>
                  </div>

                  <div className="card-footer-tags">
                    <span
                      className={`demand-scale ${demandTextClass[p.demandLevel]}`}
                    >
                      {p.demandLevel} DEMAND
                    </span>
                    <span
                      className={`trend-label ${
                        p.trendPct === null
                          ? "trend-flat"
                          : p.trendPct > 0
                            ? "trend-up"
                            : p.trendPct < 0
                              ? "trend-down"
                              : "trend-flat"
                      }`}
                    >
                      {p.trendPct === null
                        ? "No prior data"
                        : `${p.trendPct > 0 ? "▲" : p.trendPct < 0 ? "▼" : "—"} ${Math.abs(p.trendPct)}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
