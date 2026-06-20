"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

/* ─────────────────────────── types ─────────────────────────── */
type Province = "All" | "Western" | "Southern" | "Central" | "Northern" | "Eastern" | "North Western" | "North Central" | "Uva" | "Sabaragamuwa";
type Category = "All" | "Beverages" | "Dairy" | "Snacks" | "Staples";
type DemandLevel = "All Levels" | "HIGH" | "MEDIUM" | "LOW";
type Signal = "All Signals" | "Payday" | "Season" | "Poya" | "Weekend";
type SortBy = "Confidence ↓" | "Confidence ↑" | "Name A–Z";

interface Product {
  id: number;
  name: string;
  category: Category;
  province: Exclude<Province, "All">;
  confidence: number;
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
  signal: Exclude<Signal, "All Signals">;
  emoji: string;
}

/* ─────────────────────────── data ──────────────────────────── */
const PRODUCTS: Product[] = [
  { id: 1,  name: "Coca-Cola 1.5L",         category: "Beverages", province: "Western",       confidence: 91, demandLevel: "HIGH",   signal: "Payday",  emoji: "🥤" },
  { id: 2,  name: "Elephant Basmati 5kg",    category: "Staples",   province: "North Central", confidence: 88, demandLevel: "HIGH",   signal: "Season",  emoji: "🌾" },
  { id: 3,  name: "Anchor Butter 400g",      category: "Dairy",     province: "Western",       confidence: 84, demandLevel: "HIGH",   signal: "Payday",  emoji: "🧈" },
  { id: 4,  name: "Dil Yoghurt",             category: "Dairy",     province: "Southern",      confidence: 81, demandLevel: "HIGH",   signal: "Payday",  emoji: "🍶" },
  { id: 5,  name: "Munchee Choco Shock",     category: "Snacks",    province: "Northern",      confidence: 79, demandLevel: "HIGH",   signal: "Weekend", emoji: "🍫" },
  { id: 6,  name: "Watawala Tea 400g",       category: "Beverages", province: "Uva",           confidence: 78, demandLevel: "HIGH",   signal: "Season",  emoji: "🍃" },
  { id: 7,  name: "Milo Liquid Pack",        category: "Beverages", province: "Sabaragamuwa",  confidence: 76, demandLevel: "HIGH",   signal: "Weekend", emoji: "☕" },
  { id: 8,  name: "Maliban Cream Crackers",  category: "Snacks",    province: "Western",       confidence: 68, demandLevel: "MEDIUM", signal: "Season",  emoji: "🍪" },
  { id: 9,  name: "Highland Full Cream",     category: "Dairy",     province: "Central",       confidence: 64, demandLevel: "MEDIUM", signal: "Poya",    emoji: "🥛" },
  { id: 10, name: "MD Tomato Sauce 400g",    category: "Staples",   province: "North Western", confidence: 62, demandLevel: "MEDIUM", signal: "Weekend", emoji: "🥫" },
  { id: 11, name: "Keells Chicken Sausages", category: "Staples",   province: "Western",       confidence: 59, demandLevel: "MEDIUM", signal: "Weekend", emoji: "🌭" },
  { id: 12, name: "Nestomalt 400g",          category: "Beverages", province: "Eastern",       confidence: 54, demandLevel: "MEDIUM", signal: "Payday",  emoji: "🫙" },
  { id: 13, name: "Lanka Soy Veg 200g",      category: "Staples",   province: "Northern",      confidence: 41, demandLevel: "LOW",    signal: "Season",  emoji: "🫘" },
  { id: 14, name: "Rathna Laundry Liquid",   category: "Staples",   province: "Southern",      confidence: 33, demandLevel: "LOW",    signal: "Weekend", emoji: "🧴" },
];

const PROVINCES:    Province[]    = ["All", "Western", "Southern", "Central", "Northern", "Eastern", "North Western", "North Central", "Uva", "Sabaragamuwa"];
const CATEGORIES:   Category[]    = ["All", "Beverages", "Dairy", "Snacks", "Staples"];
const DEMAND_LEVELS: DemandLevel[] = ["All Levels", "HIGH", "MEDIUM", "LOW"];
const SIGNALS:      Signal[]      = ["All Signals", "Payday", "Season", "Poya", "Weekend"];
const SORT_OPTIONS: SortBy[]      = ["Confidence ↓", "Confidence ↑", "Name A–Z"];

const demandTextClass: Record<string, string> = { HIGH: "demand-high", MEDIUM: "demand-medium", LOW: "demand-low" };

/* ────────────────────────── dropdown ───────────────────────── */
interface DropdownProps<T extends string> {
  value: T;
  onChange: (val: T) => void;
  options: T[];
  labelPrefix?: string;
}

function CustomDropdown<T extends string>({ value, onChange, options, labelPrefix = "" }: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        <span>{labelPrefix}{value}</span>
        <svg className="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
  const [province,    setProvince]    = useState<Province>("All");
  const [category,    setCategory]    = useState<Category>("All");
  const [demandLevel, setDemandLevel] = useState<DemandLevel>("All Levels");
  const [signal,      setSignal]      = useState<Signal>("All Signals");
  const [sortBy,      setSortBy]      = useState<SortBy>("Confidence ↓");
  const [minConf,     setMinConf]     = useState(0);
  const [search,      setSearch]      = useState("");

  const filtered = PRODUCTS
    .filter(p =>
      (province    === "All"         || p.province    === province)    &&
      (category    === "All"         || p.category    === category)    &&
      (demandLevel === "All Levels"  || p.demandLevel === demandLevel) &&
      (signal      === "All Signals" || p.signal      === signal)      &&
      p.confidence >= minConf &&
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Confidence ↓") return b.confidence - a.confidence;
      if (sortBy === "Confidence ↑") return a.confidence - b.confidence;
      return a.name.localeCompare(b.name);
    });

  const avgConf = Math.round(filtered.reduce((s, p) => s + p.confidence, 0) / (filtered.length || 1));

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

        /* =========================================
           HEADER SECTION (With Live Status indicators)
           ========================================= */
        .trends-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .header-title-area {
          flex: 1.2;
        }

        /* Real-Time Live Pulse Badge */
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

        /* =========================================
           TOP PAGE IMAGE (Colorful Editorial Banner - Static)
           ========================================= */
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
          filter: brightness(0.7) contrast(1.05); /* Colorful but clean inside dark UI */
        }

        /* =========================================
           PROVINCE TABS (Scroller)
           ========================================= */
        .province-tabs-wrapper {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 3rem;
          padding-bottom: 0.5rem;
          overflow-x: auto;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }

        .province-tabs-wrapper::-webkit-scrollbar {
          display: none;
        }

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

        .province-tab-btn:hover {
          color: #ffffff;
        }

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

        /* =========================================
           CUSTOM PREMIUM DROPDOWN SYSTEM
           ========================================= */
        .custom-dropdown {
          position: relative;
          display: inline-block;
        }

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

        .dropdown-arrow {
          transition: transform 0.3s ease;
        }

        .dropdown-trigger.active .dropdown-arrow {
          transform: rotate(180deg);
        }

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

        /* =========================================
           FILTERS PANEL
           ========================================= */
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

        /* Minimal Range slider */
        .slider-wrapper {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .slider-label {
          font-family: "Georgia", serif;
          font-style: italic;
          font-size: 0.9rem;
          color: #71717a;
        }

        .minimal-slider {
          -webkit-appearance: none;
          width: 120px;
          height: 2px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          cursor: pointer;
        }

        .minimal-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          transition: transform 0.2s ease;
        }

        .minimal-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        /* Minimal Search */
        .minimal-search-wrapper {
          position: relative;
        }

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

        .minimal-search-input::placeholder {
          color: #71717a;
        }

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

        /* =========================================
           SUMMARY METRIC
           ========================================= */
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

        /* =========================================
           TRENDING CARDS
           ========================================= */
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
          margin-bottom: 2rem;
        }

        .emoji-wrapper {
          font-size: 2.2rem;
          line-height: 1;
          transition: transform 0.3s ease; /* No grayscale filter, fully colorful */
        }

        .trend-card:hover .emoji-wrapper {
          transform: scale(1.05);
        }

        .category-tag {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #71717a;
          font-size: 0.85rem;
        }

        .card-middle {
          margin-bottom: auto;
        }

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

        .confidence-area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .confidence-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #71717a;
        }

        .confidence-value {
          font-family: "Georgia", serif;
          font-style: italic;
          font-size: 1.1rem;
          color: #ffffff;
        }

        .conf-track {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .conf-fill {
          height: 100%;
          background-color: #ffffff;
          transition: width 0.4s ease;
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

        .signal-label {
          color: #a1a1aa;
          font-family: "Georgia", serif;
          font-style: italic;
        }

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

        /* =========================================
           RESPONSIVE DESIGN
           ========================================= */
        @media (max-width: 1024px) {
          .trends-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 900px) {
          .trends-header {
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 4rem;
          }
          .header-desc {
            margin-top: 0;
          }
          .filters-panel {
            flex-direction: column;
            align-items: flex-start;
          }
          .filter-group {
            width: 100%;
          }
          .minimal-search-wrapper, .minimal-search-input {
            width: 100%;
          }
          .trends-hero-image {
            height: 250px;
          }
        }

        @media (max-width: 600px) {
          .trends-grid {
            grid-template-columns: 1fr;
            max-width: 380px;
            margin: 0 auto;
          }
        }
      `}</style>

      <Navbar />

      <div className="trends-container">
        
        {/* =========================================
            HEADER SECTION
            ========================================= */}
        <div className="trends-header">
          <div className="header-title-area">
            {/* Blinking Live Telemetry indicator to indicate Real-Time Data */}
            <div className="live-status-badge">
              <span className="live-dot-pulse" />
              Connected · Live POS Telemetry Feed
            </div>
            <span className="section-subtitle">Real-Time Market Telemetry</span>
            <h1 className="section-title">Sri Lankan Market Pulse</h1>
          </div>
          <div className="header-desc">
            Direct insight into provincial consumer velocity. This interface processes active, real-time transaction data mapped directly from checkout systems in Sri Lanka's 9 provinces. The metrics below update continuously as sales occur.
          </div>
        </div>

        {/* =========================================
           TOP PAGE IMAGE (Colorful Editorial Banner - Static)
           ========================================= */}
        <div className="trends-hero-image">
          <img 
            src="https://www.igrain.in/admin/images/1717578894.jpg" 
            alt="Real-time retail network telemetry visualization" 
          />
        </div>

        {/* =========================================
           PROVINCE TABS (Scroller)
           ========================================= */}
        <div className="province-tabs-wrapper">
          {PROVINCES.map(p => (
            <button 
              key={p} 
              className={`province-tab-btn${province === p ? " active" : ""}`}
              onClick={() => setProvince(p)}
            >
              {p}
            </button>
          ))}
        </div>

        {/* =========================================
           FILTERS PANEL
           ========================================= */}
        <div className="filters-panel">
          <div className="filter-group">
            
            {/* Custom Category Dropdown */}
            <CustomDropdown 
              value={category} 
              onChange={setCategory} 
              options={CATEGORIES} 
              labelPrefix="Category: "
            />

            {/* Custom Demand Dropdown */}
            <CustomDropdown 
              value={demandLevel} 
              onChange={setDemandLevel} 
              options={DEMAND_LEVELS} 
              labelPrefix="Demand: "
            />

            {/* Custom Signal Dropdown */}
            <CustomDropdown 
              value={signal} 
              onChange={setSignal} 
              options={SIGNALS} 
              labelPrefix="Signal: "
            />

            {/* Custom Sort Dropdown */}
            <CustomDropdown 
              value={sortBy} 
              onChange={setSortBy} 
              options={SORT_OPTIONS} 
            />

            {/* Confidence Slider */}
            <div className="slider-wrapper">
              <span className="slider-label">Confidence: {minConf}%+</span>
              <input 
                type="range" 
                className="minimal-slider" 
                min={0} 
                max={90} 
                step={5} 
                value={minConf} 
                onChange={e => setMinConf(+e.target.value)} 
              />
            </div>

          </div>

          {/* Minimal Search Input */}
          <div className="minimal-search-wrapper">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              className="minimal-search-input" 
              placeholder="Search regional items..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>

        {/* =========================================
           SUMMARY METRIC
           ========================================= */}
        <div className="metrics-bar">
          <div className="metric-item">
            Showing <strong>{filtered.length}</strong> products
          </div>
          {filtered.length > 0 && (
            <div className="metric-item">
              Average Confidence: <strong>{avgConf}%</strong>
            </div>
          )}
        </div>

        {/* =========================================
           TRENDING CARDS
           ========================================= */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <h3>No demand metrics found</h3>
            <p>Try clearing your current filters or searching for a different product keyword.</p>
          </div>
        ) : (
          <div className="trends-grid">
            {filtered.map(p => (
              <div key={p.id} className="trend-card">
                
                <div className="card-top">
                  <div className="emoji-wrapper">{p.emoji}</div>
                  <span className="category-tag">{p.category}</span>
                </div>

                <div className="card-middle">
                  <h3 className="product-name">{p.name}</h3>
                  <div className="province-name-tag">
                    <svg width="8" height="11" viewBox="0 0 10 13" fill="none">
                      <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5z" fill="#71717a"/>
                    </svg>
                    {p.province} Province
                  </div>
                </div>

                <div className="card-bottom">
                  <div className="confidence-area">
                    <span className="confidence-label">Prediction Accuracy</span>
                    <span className="confidence-value">{p.confidence}%</span>
                  </div>
                  
                  {/* Luxury Thin Progress Line */}
                  <div className="conf-track">
                    <div className="conf-fill" style={{ width: `${p.confidence}%` }} />
                  </div>

                  <div className="card-footer-tags">
                    <span className={`demand-scale ${demandTextClass[p.demandLevel]}`}>
                      {p.demandLevel} VELOCITY
                    </span>
                    <span className="signal-label">{p.signal}</span>
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