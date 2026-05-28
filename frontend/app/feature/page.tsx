"use client";

import { useState, useRef } from "react";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: i * 0.1,
    },
  }),
};

interface Feature {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  stats: { label: string; value: string }[];
  accent: string;
  posterSlot: string; // label for the upload zone
}

const features: Feature[] = [
  {
    id: "province",
    tag: "PROVINCE",
    tagColor: "#e879f9",
    title: "Province Intelligence",
    subtitle: "Demand models built for every corner of Sri Lanka.",
    description:
      "Lokalens doesn't treat Sri Lanka as a single market. Every province has its own climate patterns, economic rhythms, and purchasing behaviors — and our forecasting engine captures all of it. From the coastal humidity of the Southern Province to the tea-country economy of Uva, demand signals are modelled with province-level precision.",
    details: [
      "All 9 provinces covered — Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, Sabaragamuwa",
      "Climate-adjusted demand curves per region including temperature and rainfall signals",
      "Urbanization and average income level factored into every prediction",
      "Tourism activity encoded as a seasonal demand multiplier for coastal and heritage regions",
      "Province-specific payday cycles and economic behavior patterns",
    ],
    stats: [
      { label: "Provinces", value: "9" },
      { label: "Signals per Week", value: "40+" },
      { label: "Accuracy Uplift", value: "+34%" },
    ],
    accent: "#e879f9",
    posterSlot: "Province Intelligence Poster",
  },
  {
    id: "cultural",
    tag: "CULTURAL",
    tagColor: "#facc15",
    title: "Cultural Signals",
    subtitle: "Every festival and payday cycle shapes the forecast.",
    description:
      "Sri Lanka's retail demand is deeply tied to its cultural calendar. Vesak drives coconut oil. Sinhala & Tamil New Year spikes rice flour and sweets. Ramadan reshapes evening consumption. Payday weeks create predictable premium-product surges. Lokalens encodes all of this into its forecasting engine so your stocking decisions are culturally aware, not just statistically average.",
    details: [
      "Full Sri Lankan public holiday calendar integrated including Poya days, Vesak, Avurudu, Ramadan, Christmas, and Deepavali",
      "Payday week detection with province-level timing differences",
      "Festival-season demand spikes per product category",
      "School season signals affecting stationery, snacks, and beverages",
      "Religious event encoding for food-category demand shifts",
    ],
    stats: [
      { label: "Cultural Events", value: "25+" },
      { label: "Payday Cycles", value: "12/yr" },
      { label: "Categories Affected", value: "18" },
    ],
    accent: "#facc15",
    posterSlot: "Cultural Signals Poster",
  },
  {
    id: "sku",
    tag: "SKU",
    tagColor: "#38bdf8",
    title: "SKU Forecasting",
    subtitle: "Per-product demand scores. Know exactly which SKU moves faster in your region.",
    description:
      "Generic category-level forecasts are not enough for SMEs making real stocking decisions. Lokalens generates demand scores at the individual product level — so you know whether Anchor 400g or Nestomalt 500g is the higher priority restock in your province this week. Every SKU is scored, ranked, and contextualized against regional behavior.",
    details: [
      "Individual product-level demand score generation (0–1000 scale)",
      "Weekly demand ranking across all tracked SKUs in your province",
      "Category-level breakdowns — Beverages, Cooking Essentials, Dairy, Snacks, Personal Care, and more",
      "Comparative ranking showing which products are trending up vs cooling down",
      "Estimated units sold projection alongside demand score for quantity planning",
    ],
    stats: [
      { label: "SKUs Tracked", value: "200+" },
      { label: "Categories", value: "12" },
      { label: "Update Frequency", value: "Weekly" },
    ],
    accent: "#38bdf8",
    posterSlot: "SKU Forecasting Poster",
  },
  {
    id: "ai-assistant",
    tag: "AI BOT",
    tagColor: "#4ade80",
    title: "AI Assistant",
    subtitle: "Budget-aware stocking recommendations with full reasoning — ready in seconds.",
    description:
      "The Lokalens AI Assistant turns forecast data into conversational business guidance. Tell it your budget and province, and it builds a prioritized restock plan explaining exactly why each product is recommended. It understands cultural context, seasonal pressure, and province-level demand simultaneously — giving SME owners the kind of advice that used to require a data analyst.",
    details: [
      "Natural language interface — ask in plain English or Sinhala-transliterated queries",
      "Budget-aware optimization: input Rs. 50,000 and receive a ranked restock plan",
      "Full reasoning transparency — every recommendation is explained, not just listed",
      "Contextual awareness of upcoming festivals, payday proximity, and climate signals",
      "Phase 3 feature: personalized memory that improves with your sales history",
    ],
    stats: [
      { label: "Response Time", value: "<3s" },
      { label: "Reasoning Steps", value: "5–8" },
      { label: "Languages", value: "EN / SL" },
    ],
    accent: "#4ade80",
    posterSlot: "AI Assistant Poster",
  },
  {
    id: "dashboard",
    tag: "DASHBOARD",
    tagColor: "#f97316",
    title: "Visual Dashboard",
    subtitle: "Heat maps, trend charts, confidence bands, and regional comparisons in one view.",
    description:
      "The Lokalens dashboard gives SME owners a clear visual picture of demand across their province and product range. No spreadsheet skills needed. Demand heat maps show which regions are heating up, trend charts reveal week-on-week momentum, and confidence bands communicate forecast certainty — so you know when to act decisively and when to wait.",
    details: [
      "Province-level demand heat map across Sri Lanka's 9 provinces",
      "Weekly trend charts with momentum indicators per product",
      "Confidence band overlays showing high, medium, and low certainty zones",
      "Top-10 recommended products panel updated every forecasting cycle",
      "Category filter and province switcher for rapid cross-segment comparison",
    ],
    stats: [
      { label: "Chart Types", value: "6" },
      { label: "Data Points", value: "Real-time" },
      { label: "Export", value: "CSV / PDF" },
    ],
    accent: "#f97316",
    posterSlot: "Visual Dashboard Poster",
  },
];

function PosterUpload({ label, accent }: { label: string; accent: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={() => !preview && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        width: "100%",
        aspectRatio: "16/9",
        borderRadius: 16,
        border: `2px dashed ${dragging ? accent : "rgba(255,255,255,0.12)"}`,
        background: dragging
          ? `rgba(${hexToRgb(accent)}, 0.06)`
          : "rgba(255,255,255,0.03)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: preview ? "default" : "pointer",
        transition: "all 0.25s ease",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Uploaded poster"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setPreview(null); }}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.6)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              backdropFilter: "blur(8px)",
            }}
          >
            ×
          </button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "24px 20px" }}>
          <div
            style={{
              width: 48, height: 48,
              borderRadius: 12,
              background: `rgba(${hexToRgb(accent)}, 0.1)`,
              border: `1px solid rgba(${hexToRgb(accent)}, 0.2)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 14px",
              color: accent,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
            {label}
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            Drop an image or click to upload
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState("province");
  const active = features.find((f) => f.id === activeFeature)!;

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#0A0F1E",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .feat-tab {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          width: 100%;
        }
        .feat-tab:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.08);
        }
        .feat-tab.active {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.12);
        }

        .stat-card {
          flex: 1;
          padding: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          text-align: center;
        }

        .detail-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .detail-item:last-child { border-bottom: none; }

        .features-grid {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 32px;
          align-items: start;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr; }
          .content-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 96px" }}>

        {/* Hero Header */}
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" animate="show"
          style={{ marginBottom: 64, maxWidth: 640 }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600,
              padding: "5px 12px", borderRadius: 100,
              background: "rgba(10,132,255,0.12)",
              color: "#0A84FF", marginBottom: 20,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0A84FF" }} />
            Platform Features
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 58px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Built for Sri Lankan{" "}
            <span style={{ color: "#0A84FF" }}>retail reality.</span>
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
            Five intelligence layers working together — from province-level climate signals to per-SKU demand scores and AI-driven budget recommendations.
          </p>
        </motion.div>

        {/* Main Layout */}
        <div className="features-grid">

          {/* Sidebar Tabs */}
          <motion.div
            variants={fadeUp} custom={1} initial="hidden" animate="show"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: 10,
              position: "sticky",
              top: 96,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {features.map((f) => (
              <button
                key={f.id}
                className={`feat-tab${activeFeature === f.id ? " active" : ""}`}
                onClick={() => setActiveFeature(f.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: activeFeature === f.id ? "#fff" : "rgba(255,255,255,0.7)" }}>
                      {f.title}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: activeFeature === f.id ? f.tagColor : "rgba(255,255,255,0.25)" }}>
                      {f.tag}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
                    {f.subtitle.split(".")[0]}
                  </span>
                </div>
                {activeFeature === f.id && (
                  <div style={{ width: 3, height: 28, borderRadius: 2, background: f.tagColor, flexShrink: 0 }} />
                )}
              </button>
            ))}
          </motion.div>

          {/* Feature Detail Panel */}
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* Feature Header */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid rgba(${hexToRgb(active.accent)}, 0.2)`,
                borderRadius: 18,
                padding: "32px 32px 28px",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <span
                  style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.12em",
                    color: active.tagColor,
                    background: `rgba(${hexToRgb(active.accent)}, 0.1)`,
                    padding: "4px 10px", borderRadius: 100,
                  }}
                >
                  {active.tag}
                </span>
              </div>

              <h2
                style={{
                  fontSize: "clamp(24px, 3.5vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                {active.title}
              </h2>
              <p style={{ fontSize: 15, color: active.tagColor, fontWeight: 600, marginBottom: 16 }}>
                {active.subtitle}
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>
                {active.description}
              </p>

              {/* Stats Row */}
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                {active.stats.map((s) => (
                  <div key={s.label} className="stat-card">
                    <div style={{ fontSize: 26, fontWeight: 800, color: active.tagColor, letterSpacing: "-0.02em", marginBottom: 4 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-col: Details + Poster */}
            <div className="content-grid">

              {/* Details List */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  padding: "24px 24px 16px",
                }}
              >
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
                  What's Included
                </h3>
                <div>
                  {active.details.map((d, i) => (
                    <div key={i} className="detail-item">
                      <div
                        style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                          background: `rgba(${hexToRgb(active.accent)}, 0.1)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={active.tagColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.65, fontWeight: 400 }}>
                        {d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Poster Upload */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 18,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Feature Poster
                </h3>
                <PosterUpload label={active.posterSlot} accent={active.accent} />
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                  PNG, JPG, WEBP · Recommended 1280×720
                </p>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Bottom — All Features Strip */}
        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate="show"
          style={{ marginTop: 64 }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>
            All Features at a Glance
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {features.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFeature(f.id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 100,
                  border: `1px solid ${activeFeature === f.id ? f.tagColor : "rgba(255,255,255,0.1)"}`,
                  background: activeFeature === f.id ? `rgba(${hexToRgb(f.accent)}, 0.1)` : "transparent",
                  color: activeFeature === f.id ? f.tagColor : "rgba(255,255,255,0.45)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {f.title}
              </button>
            ))}
          </div>
        </motion.div>

      </div>

      <Footer />
    </div>
  );
}

//not working proposaly need fix in the nav bar