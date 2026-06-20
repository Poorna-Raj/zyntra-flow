"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

/* ─── Types ─────────────────────────────────────────────────── */
type DemandLevel = "ALL Levels" | "HIGH" | "MEDIUM" | "LOW";
type SortBy      = "Confidence ↓" | "Confidence ↑" | "Name A–Z";

interface ProductRow {
  id:          string;
  name:        string;
  category:    string;
  province:    string;
  confidence:  number;
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
  signal:      string;
  emoji:       string;
  imageUrl:    string | null;
}

/* ─── Helpers ───────────────────────────────────────────────── */
const CATEGORY_EMOJI: Record<string, string> = {
  Beverages: "🥤", Dairy: "🧈", Snacks: "🍫",
  Staples: "🌾", Sweeteners: "🍬", Alcohol: "🍺",
  "Cooking Essentials": "🫙", "Seasonal/Ritual": "🪔", default: "📦",
};

function getEmoji(cat: string): string {
  return CATEGORY_EMOJI[cat] ?? CATEGORY_EMOJI.default;
}

function toDemandLevel(conf: number): "HIGH" | "MEDIUM" | "LOW" {
  if (conf >= 75) return "HIGH";
  if (conf >= 45) return "MEDIUM";
  return "LOW";
}

/* ─── Constants ─────────────────────────────────────────────── */
const DEMAND_LEVELS = ["All Levels", "HIGH", "MEDIUM", "LOW"];
const SORT_OPTIONS: SortBy[] = ["Confidence ↓", "Confidence ↑", "Name A–Z"];

const demandColor: Record<string, string> = { HIGH: "#00C48C", MEDIUM: "#F5A623", LOW: "#9BA8BF" };
const signalColor: Record<string, string> = {
  Payday: "#0A84FF", Season: "#9B59B6", Poya: "#E67E22", Weekend: "#00C48C", Regular: "#9BA8BF",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";


const DEFAULT_PARAMS = {
  province:              "Western",
  week_number:           24,
  avg_temperature_level: "High",
  rainfall_level:        "Low",
  tourism_level:         "Medium",
  payday_week:           "Yes",
  holiday_type:          "None",
  festival_season:       "None",
  school_season:         "Yes",
  urbanization_level:    "High",
  avg_income_level:      "Medium",
  top_n:                 31,
};


export default function ProductPage() {
  const [province,    setProvince]    = useState("All");
  const [category,    setCategory]    = useState("All");
  const [demandLevel, setDemandLevel] = useState("All Levels");
  const [sortBy,      setSortBy]      = useState<SortBy>("Confidence ↓");
  const [minConf,     setMinConf]     = useState(0);
  const [search,      setSearch]      = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products,   setProducts]   = useState<ProductRow[]>([]);
  const [provinces,  setProvinces]  = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  /* ── Fetch forecast from FastAPI ── */
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/forecast`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(DEFAULT_PARAMS),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        // Find max demand_score to normalize confidence to 0–100
        const maxScore = Math.max(...data.top_products.map((p: any) => p.demand_score), 1);

        const rows: ProductRow[] = data.top_products.map((p: any) => {
          const conf = Math.min(100, Math.round((p.demand_score / maxScore) * 100));
          return {
            id:          p.product_id,
            name:        p.product_name,
            category:    p.category,
            imageUrl:    p.imageUrl ?? null,
            province:    data.province,
            confidence:  conf,
            demandLevel: toDemandLevel(conf),
            signal:      DEFAULT_PARAMS.payday_week === "Yes" ? "Payday" : "Regular",
            emoji:       getEmoji(p.category),
          };
        });

        setProducts(rows);
        setProvinces([...new Set(rows.map(r => r.province))].sort());
        setCategories([...new Set(rows.map(r => r.category))].sort());
      } catch (e: any) {
        setError(e.message ?? "Failed to load forecast.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── Filter + sort ── */
  const filtered = products
    .filter(p =>
      (province    === "All"        || p.province    === province)    &&
      (category    === "All"        || p.category    === category)    &&
      (demandLevel === "All Levels" || p.demandLevel === demandLevel) &&
      p.confidence >= minConf &&
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Confidence ↓") return b.confidence - a.confidence;
      if (sortBy === "Confidence ↑") return a.confidence - b.confidence;
      return a.name.localeCompare(b.name);
    });

  const avgConf   = Math.round(filtered.reduce((s, p) => s + p.confidence, 0) / (filtered.length || 1));
  const highCount = filtered.filter(p => p.demandLevel === "HIGH").length;

  /* ── Sidebar ── */
  const SidebarContent = () => (
    <>
      <div className="sidebar-section">
        <span className="live-badge"><span className="live-pulse" />Live Feed</span>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Province</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["All", ...provinces].map(p => (
            <button key={p} className={`pill-btn${province === p ? " active" : ""}`}
              onClick={() => { setProvince(p); setSidebarOpen(false); }}>{p}</button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Category</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["All", ...categories].map(c => (
            <button key={c} className={`pill-btn${category === c ? " active" : ""}`}
              onClick={() => { setCategory(c); setSidebarOpen(false); }}>{c}</button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Demand Level</p>
        <select className="filter-select" value={demandLevel}
          onChange={e => setDemandLevel(e.target.value)}>
          {DEMAND_LEVELS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label" style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Min Confidence</span><span style={{ color: "#0A84FF" }}>{minConf}%</span>
        </p>
        <input type="range" min={0} max={90} step={5} value={minConf}
          onChange={e => setMinConf(+e.target.value)} />
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Sort By</p>
        <select className="filter-select" value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}>
          {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
    </>
  );

  return (
    <div style={{
      fontFamily: "'Plus Jakarta Sans', 'Manrope', sans-serif",
      background: "linear-gradient(160deg, #f0f6ff 0%, #ffffff 60%, #eaf3ff 100%)",
      minHeight: "100vh", color: "#0B1120",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pill-btn { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; border: none; background: transparent; cursor: pointer; padding: 7px 14px; border-radius: 100px; color: #6B7A99; transition: all 0.18s ease; white-space: nowrap; }
        .pill-btn:hover { color: #0B1120; background: #e8eeff; }
        .pill-btn.active { background: #0A84FF; color: #fff; box-shadow: 0 4px 12px rgba(10,132,255,0.30); }
        .filter-select { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; border: 1.5px solid rgba(10,132,255,0.14); background: #fff; color: #0B1120; padding: 9px 34px 9px 14px; border-radius: 12px; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%230A84FF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; transition: border-color 0.18s; width: 100%; }
        .filter-select:focus { outline: none; border-color: #0A84FF; }
        .search-input { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 500; border: 1.5px solid rgba(10,132,255,0.14); background: #fff; color: #0B1120; padding: 10px 16px 10px 40px; border-radius: 100px; width: 100%; max-width: 280px; transition: border-color 0.18s, box-shadow 0.18s; }
        .search-input::placeholder { color: #9BA8BF; }
        .search-input:focus { outline: none; border-color: #0A84FF; box-shadow: 0 0 0 3px rgba(10,132,255,0.12); }
        .stat-card { background: #fff; border-radius: 20px; border: 1px solid rgba(10,132,255,0.1); box-shadow: 0 4px 20px rgba(10,132,255,0.05); padding: 24px 28px; flex: 1; min-width: 0; }
        .product-card { background: #fff; border-radius: 18px; border: 1px solid rgba(10,132,255,0.09); box-shadow: 0 2px 12px rgba(10,132,255,0.04); padding: 22px; display: flex; flex-direction: column; gap: 14px; transition: box-shadow 0.2s, transform 0.2s; cursor: default; }
        .product-card:hover { box-shadow: 0 8px 32px rgba(10,132,255,0.13); transform: translateY(-2px); }
        .conf-track { width: 100%; height: 6px; border-radius: 100px; background: #f0f4ff; overflow: hidden; }
        .conf-fill  { height: 100%; border-radius: 100px; background: #0A84FF; transition: width 0.4s ease; }
        .chip { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 100px; background: rgba(10,132,255,0.08); color: #0A84FF; letter-spacing: 0.02em; }
        .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: #0A84FF; }
        .sidebar-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #9BA8BF; margin-bottom: 10px; display: flex; justify-content: space-between; }
        .sidebar-section { display: flex; flex-direction: column; }
        input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 100px; background: #e4eaff; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #0A84FF; box-shadow: 0 2px 6px rgba(10,132,255,0.4); }
        .live-badge { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; color: #00C48C; background: rgba(0,196,140,0.10); padding: 6px 14px; border-radius: 100px; width: fit-content; }
        .live-pulse { width: 7px; height: 7px; border-radius: 50%; background: #00C48C; animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.7); } }
        .signal-banner { background: linear-gradient(135deg, #fff8f0 0%, #fff3e8 100%); border: 1px solid rgba(230,126,34,0.18); border-radius: 20px; padding: 24px 28px; display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
        .sidebar-desktop { width: 224px; flex-shrink: 0; display: flex; flex-direction: column; gap: 24px; background: #fff; border-radius: 20px; border: 1px solid rgba(10,132,255,0.09); box-shadow: 0 4px 20px rgba(10,132,255,0.04); padding: 24px 20px; position: sticky; top: 24px; align-self: flex-start; }
        .drawer-overlay { display: none; position: fixed; inset: 0; background: rgba(11,17,32,0.45); z-index: 200; backdrop-filter: blur(2px); }
        .drawer-panel { position: fixed; top: 0; left: 0; bottom: 0; width: 288px; background: #fff; z-index: 201; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 24px; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); box-shadow: 4px 0 32px rgba(10,132,255,0.12); }
        .drawer-overlay.open { display: block; }
        .drawer-panel.open { transform: translateX(0); }
        .filter-toggle { display: none; align-items: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; color: #0A84FF; background: rgba(10,132,255,0.08); border: none; cursor: pointer; padding: 9px 18px; border-radius: 100px; transition: background 0.18s; }
        .filter-toggle:hover { background: rgba(10,132,255,0.14); }
        @keyframes shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
        .skeleton { border-radius: 18px; height: 180px; background: linear-gradient(90deg, #f0f4ff 25%, #e4eeff 50%, #f0f4ff 75%); background-size: 600px 100%; animation: shimmer 1.4s infinite; }
        @media (max-width: 900px) { .sidebar-desktop { display: none !important; } .filter-toggle { display: inline-flex !important; } }
        @media (max-width: 720px) { .stat-row { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .stat-row { grid-template-columns: 1fr !important; } .stat-card, .signal-banner { padding: 20px 20px !important; } .page-title { font-size: 32px !important; } .search-input { max-width: 100% !important; } .header-actions { flex-direction: column; align-items: flex-start !important; } }
        @media (max-width: 600px) { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Mobile drawer */}
      <div className={`drawer-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />
      <div className={`drawer-panel${sidebarOpen ? " open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#0B1120" }}>Filters</span>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "rgba(10,132,255,0.08)", border: "none", cursor: "pointer", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="#0A84FF" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <SidebarContent />
      </div>

      <Navbar />

      <div style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 20px 96px" }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div className="chip" style={{ marginBottom: 14 }}>
              <span className="chip-dot" />
              AI-Powered Forecasts · Week {DEFAULT_PARAMS.week_number} · {loading ? "…" : `${products.length} products`}
            </div>
            <div className="header-actions" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div>
                <h1 className="page-title" style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#0B1120", marginBottom: 10 }}>
                  Demand <span style={{ color: "#0A84FF" }}>Predictions.</span>
                </h1>
                <p style={{ fontSize: 15, color: "#6B7A99", lineHeight: 1.65, fontWeight: 400 }}>
                  Localised demand forecasts across Sri Lankan provinces — updated weekly.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button className="filter-toggle" onClick={() => setSidebarOpen(true)}>
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none"><path d="M0 1h14M3 6h8M5 11h4" stroke="#0A84FF" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Filters
                </button>
                <div style={{ position: "relative" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9BA8BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid rgba(255,59,48,0.2)", borderRadius: 16, padding: "20px 24px", marginBottom: 28, color: "#c0392b", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 10 }}>
              ⚠️ {error} — make sure your FastAPI server is running at {API_URL}
            </div>
          )}

          {/* Stats */}
          <div className="stat-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
            <div style={{ background: "linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)", borderRadius: 20, padding: "24px 28px", color: "#fff", boxShadow: "0 8px 28px rgba(10,132,255,0.35)" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, opacity: 0.75, marginBottom: 8 }}>Avg Confidence</p>
              <p style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1 }}>{loading ? "…" : `${avgConf}%`}</p>
              <p style={{ fontSize: 12, fontWeight: 500, opacity: 0.7, marginTop: 8 }}>↑ Week on week</p>
            </div>
            <div className="stat-card">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9BA8BF", marginBottom: 8 }}>High Demand</p>
              <p style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: "#0B1120" }}>{loading ? "…" : highCount}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#00C48C", marginTop: 8 }}>↑ {loading ? "…" : filtered.length} products shown</p>
            </div>
            <div className="stat-card">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9BA8BF", marginBottom: 8 }}>Total Products</p>
              <p style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: "#0B1120" }}>{loading ? "…" : products.length}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#9BA8BF", marginTop: 8 }}>↑ From database</p>
            </div>
            <div className="signal-banner">
              <div style={{ fontSize: 32, flexShrink: 0 }}>🪔</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#E67E22", marginBottom: 6 }}>Next Signal</p>
                <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#0B1120", lineHeight: 1.1, whiteSpace: "nowrap" as const }}>Vesak Poya</p>
                <p style={{ fontSize: 12, fontWeight: 500, color: "#9BA8BF", marginTop: 6 }}>in 3 days</p>
              </div>
            </div>
          </div>

          {/* Sidebar + Grid */}
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <aside className="sidebar-desktop"><SidebarContent /></aside>

            <div style={{ flex: 1, minWidth: 0 }}>
              {!loading && (
                <p style={{ fontSize: 13, color: "#9BA8BF", fontWeight: 500, marginBottom: 18 }}>
                  Showing <strong style={{ color: "#0B1120" }}>{filtered.length}</strong> of {products.length} products
                </p>
              )}

              {/* Skeletons */}
              {loading && (
                <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" />)}
                </div>
              )}

              {/* Empty */}
              {!loading && filtered.length === 0 && !error && (
                <div style={{ textAlign: "center", padding: "80px 0", color: "#9BA8BF", background: "#fff", borderRadius: 20, border: "1px solid rgba(10,132,255,0.09)" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#0B1120", marginBottom: 6 }}>No products match your filters</p>
                  <p style={{ fontSize: 13, fontWeight: 400 }}>Try adjusting your filters or search query.</p>
                </div>
              )}

              {/* Cards */}
              {!loading && filtered.length > 0 && (
                <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                  {filtered.map(p => (
                    <div key={p.id} className="product-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #f0f6ff 0%, #e4eeff 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, overflow: "hidden" }}>
                          {p.imageUrl
                            ? <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : p.emoji}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.07em", color: demandColor[p.demandLevel], background: `${demandColor[p.demandLevel]}18`, padding: "4px 10px", borderRadius: 100 }}>
                          {p.demandLevel}
                        </span>
                      </div>

                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#0B1120", letterSpacing: "-0.01em", marginBottom: 3 }}>{p.name}</p>
                        <p style={{ fontSize: 12, fontWeight: 500, color: "#9BA8BF" }}>{p.category}</p>
                      </div>

                      <div>
                        <div className="conf-track"><div className="conf-fill" style={{ width: `${p.confidence}%` }} /></div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 5 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0A84FF" }}>{p.confidence}%</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#9BA8BF", display: "flex", alignItems: "center", gap: 5 }}>
                          <svg width="9" height="12" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5z" fill="#CBD5E0"/><circle cx="5" cy="5" r="1.5" fill="white"/></svg>
                          {p.province}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", color: signalColor[p.signal] ?? "#9BA8BF", background: `${signalColor[p.signal] ?? "#9BA8BF"}15`, padding: "3px 10px", borderRadius: 100 }}>
                          {p.signal}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}