"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

const features = [
  {
    id: "province",
    index: "01",
    tag: "Province Intelligence",
    headline: "Every corner of Sri Lanka,\nprecisely forecast.",
    caption:
      "From coastal humidity in the Southern Province to the tea-country economy of Uva — demand signals modelled with province-level precision across all 9 provinces.",
    stats: [
      { value: "9", label: "Provinces" },
      { value: "40+", label: "Signals/week" },
      { value: "+34%", label: "Accuracy uplift" },
    ],
    accent: "#2563EB",
    accentLight: "rgba(37,99,235,0.12)",
    photo: "/images/features/province.jpg",
    photoAlt: "Sri Lanka coastal market scene",
    photoBg: "#1a2744",
  },
  {
    id: "cultural",
    index: "02",
    tag: "Cultural Signals",
    headline: "Every festival shapes\nthe forecast.",
    caption:
      "Vesak drives coconut oil. Avurudu spikes rice flour and sweets. Ramadan reshapes evening consumption. Sri Lanka's full cultural calendar — encoded.",
    stats: [
      { value: "25+", label: "Cultural events" },
      { value: "12/yr", label: "Payday cycles" },
      { value: "18", label: "Categories" },
    ],
    accent: "#D97706",
    accentLight: "rgba(217,119,6,0.12)",
    photo: "https://www.pettitts.co.uk/img/containers/assets/destinations/1-indian-subcontinent/2-sri-lanka/main-pages/sri-lanka-guides/11-festivals-not-to-miss-in-sri-lanka/vesak-poya.webp/66aeeda884306e5c851f3b76b7a2e11b/vesak-poya.webp",
    photoAlt: "Sri Lanka festival celebration",
    photoBg: "#2a1a0a",
  },
  {
    id: "sku",
    index: "03",
    tag: "SKU Forecasting",
    headline: "Know exactly which\nproduct moves faster.",
    caption:
      "Individual demand scores per product — so you know whether Anchor 400g or Nestomalt 500g is the higher-priority restock in your province this week.",
    stats: [
      { value: "200+", label: "SKUs tracked" },
      { value: "12", label: "Categories" },
      { value: "Weekly", label: "Updates" },
    ],
    accent: "#0891B2",
    accentLight: "rgba(8,145,178,0.12)",
    photo: "/images/features/sku.jpg",
    photoAlt: "Grocery store shelves stocked with products",
    photoBg: "#0a1f24",
  },
  {
    id: "ai",
    index: "04",
    tag: "AI Assistant",
    headline: "Budget-aware advice,\nready in seconds.",
    caption:
      "Tell it your budget and province. It builds a prioritized restock plan — with full reasoning for every recommendation.",
    stats: [
      { value: "<3s", label: "Response time" },
      { value: "5–8", label: "Reasoning steps" },
      { value: "EN/SL", label: "Languages" },
    ],
    accent: "#059669",
    accentLight: "rgba(5,150,105,0.12)",
    photo: "/images/features/ai.jpg",
    photoAlt: "Shop owner using phone for business decisions",
    photoBg: "#0a1f16",
  },
  {
    id: "dashboard",
    index: "05",
    tag: "Visual Dashboard",
    headline: "Your entire market\nin one glance.",
    caption:
      "Heat maps, trend charts, confidence bands, and regional comparisons — no spreadsheet skills needed.",
    stats: [
      { value: "6", label: "Chart types" },
      { value: "Live", label: "Data updates" },
      { value: "CSV+PDF", label: "Export" },
    ],
    accent: "#DC2626",
    accentLight: "rgba(220,38,38,0.12)",
    photo: "/images/features/dashboard.jpg",
    photoAlt: "Business analytics dashboard overview",
    photoBg: "#1f0a0a",
  },
];

export default function FeaturesPage() {
  const [active, setActive] = useState(0);
  const feat = features[active];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#08090F", minHeight: "100vh", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .feat-page { display: grid; grid-template-columns: 340px 1fr; min-height: 100vh; }
        @media (max-width: 900px) { .feat-page { grid-template-columns: 1fr; } }

        .sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 32px;
          border-right: 1px solid rgba(255,255,255,0.06);
          background: #08090F;
          z-index: 10;
        }

        .sidebar-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          cursor: pointer;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .nav-item:first-of-type { border-top: 1px solid rgba(255,255,255,0.05); }
        .nav-item:hover .nav-title { color: #fff; }

        .nav-num {
          font-size: 11px;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          color: rgba(255,255,255,0.2);
          width: 24px;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .nav-item.active .nav-num { color: var(--accent); }

        .nav-title {
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
          flex: 1;
        }
        .nav-item.active .nav-title { color: #fff; }

        .nav-bar {
          width: 3px;
          height: 0;
          border-radius: 2px;
          background: var(--accent);
          flex-shrink: 0;
          transition: height 0.3s ease;
        }
        .nav-item.active .nav-bar { height: 28px; }

        .main-area {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .photo-zone {
          position: relative;
          height: 70vh;
          overflow: hidden;
          background: #111;
        }

        .photo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .photo-img:hover { transform: scale(1.03); }

        .photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,9,15,0.92) 0%, rgba(8,9,15,0.3) 50%, rgba(8,9,15,0.1) 100%);
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: var(--photo-bg);
          transition: background 0.5s;
        }

        .photo-index {
          position: absolute;
          top: 32px;
          right: 32px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4);
        }

        .content-zone {
          flex: 1;
          padding: 48px 56px 64px;
          background: #08090F;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .feature-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 100px;
          background: var(--accent-light);
          color: var(--accent);
        }
        .feature-tag-dot {
          width: 5px; height: 5px; border-radius: 50%; background: currentColor;
        }

        .headline {
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #fff;
          white-space: pre-line;
        }

        .caption {
          font-size: 16px;
          color: rgba(255,255,255,0.45);
          line-height: 1.75;
          font-weight: 400;
          max-width: 560px;
        }

        .stats-row {
          display: flex;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          overflow: hidden;
          width: fit-content;
        }
        .stat {
          padding: 20px 32px;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }
        .stat:last-child { border-right: none; }
        .stat-val {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--accent);
          display: block;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-lbl {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .progress-bar {
          display: flex;
          gap: 4px;
          margin-top: auto;
          padding-top: 16px;
        }
        .progress-seg {
          height: 2px;
          flex: 1;
          border-radius: 2px;
          background: rgba(255,255,255,0.1);
          cursor: pointer;
          transition: background 0.3s;
          border: none;
        }
        .progress-seg.done { background: rgba(255,255,255,0.35); }
        .progress-seg.active { background: var(--accent); }

        .placeholder-icon {
          width: 64px; height: 64px;
          border-radius: 20px;
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
        }
        .placeholder-text {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.2);
          text-align: center;
          max-width: 200px;
          line-height: 1.5;
        }
        .placeholder-path {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255,255,255,0.12);
          font-family: monospace;
          margin-top: 4px;
        }
      `}</style>

      <Navbar />

      <div style={{ paddingTop: 72 }}>
        <div
          className="feat-page"
          style={{ "--accent": feat.accent, "--accent-light": feat.accentLight, "--photo-bg": feat.photoBg } as React.CSSProperties}
        >

          {/* Sidebar */}
          <aside className="sidebar">
            <p className="sidebar-label">Platform Features</p>

            {features.map((f, i) => (
              <button
                key={f.id}
                className={`nav-item${active === i ? " active" : ""}`}
                style={{ "--accent": f.accent } as React.CSSProperties}
                onClick={() => setActive(i)}
              >
                <span className="nav-num">{f.index}</span>
                <span className="nav-title">{f.tag}</span>
                <span className="nav-bar" />
              </button>
            ))}

            <div style={{ marginTop: 40, padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, fontWeight: 400 }}>
                Five intelligence layers working together — from province-level climate signals to per-SKU demand scores.
              </p>
            </div>
          </aside>

          {/* Main */}
          <main className="main-area">
            <AnimatePresence mode="wait">
              <motion.div
                key={feat.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                {/* Photo zone */}
                <div className="photo-zone">
                  {/* Try loading image; show placeholder if not found */}
                  <ImageWithFallback
                    src={feat.photo}
                    alt={feat.photoAlt}
                    bg={feat.photoBg}
                    tag={feat.tag}
                    accent={feat.accent}
                  />
                  <div className="photo-overlay" />
                  <span className="photo-index">{feat.index} / 05</span>
                </div>

                {/* Content */}
                <div className="content-zone">
                  <div>
                    <span className="feature-tag">
                      <span className="feature-tag-dot" />
                      {feat.tag}
                    </span>
                  </div>

                  <motion.h2
                    className="headline"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {feat.headline}
                  </motion.h2>

                  <motion.p
                    className="caption"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {feat.caption}
                  </motion.p>

                  <motion.div
                    className="stats-row"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {feat.stats.map((s) => (
                      <div key={s.label} className="stat">
                        <span className="stat-val">{s.value}</span>
                        <span className="stat-lbl">{s.label}</span>
                      </div>
                    ))}
                  </motion.div>

                  {/* Progress dots */}
                  <div className="progress-bar">
                    {features.map((_, i) => (
                      <button
                        key={i}
                        className={`progress-seg${i === active ? " active" : i < active ? " done" : ""}`}
                        style={i === active ? { "--accent": feat.accent } as React.CSSProperties : {}}
                        onClick={() => setActive(i)}
                        aria-label={`Go to feature ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function ImageWithFallback({
  src, alt, bg, tag, accent,
}: {
  src: string; alt: string; bg: string; tag: string; accent: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="photo-placeholder" style={{ background: bg }}>
        <div className="placeholder-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="placeholder-text">Add your photo for<br /><strong style={{ color: "rgba(255,255,255,0.35)" }}>{tag}</strong></p>
        <p className="placeholder-path">{src}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="photo-img"
      onError={() => setFailed(true)}
    />
  );
}