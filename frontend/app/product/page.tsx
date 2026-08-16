"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import { supabase } from "@/lib/supabase";

type ProvinceDemandPrediction = {
  id: number;
  province: string;
  category: string;
  current_score: number | null;
  projected_score: number | null;
  slope_per_day: number | null;
  trend: string | null;
  confidence: string | null;
  days_of_history: number | null;
  avg_listing_count: number | null;
  current_label: string | null;
  predicted_label: string | null;
  predicted_good_seller: boolean | null;
  generated_at: string | null;
  top_items: string | null;
};

type SortBy =
  | "projected-desc"
  | "projected-asc"
  | "current-desc"
  | "current-asc"
  | "category";

const PROVINCES = [
  "All",
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

const DEMAND_LEVELS = [
  "All Levels",
  "HIGH",
  "MEDIUM",
  "LOW",
];

function formatScore(value: number | null) {
  if (value === null) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

function normalize(value: string | null) {
  if (!value) return "UNKNOWN";

  return value
    .trim()
    .toUpperCase()
    .replace(/[_-]/g, " ");
}

function formatNumber(value: number | null) {
  if (value === null) return "—";

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
}

function getDemandClass(label: string | null) {
  const value = normalize(label);

  if (value === "HIGH") return "high";
  if (value === "MEDIUM") return "medium";
  if (value === "LOW") return "low";

  return "unknown";
}

function getTrendClass(trend: string | null) {
  const value = normalize(trend);

  if (value === "RISING") return "rising";
  if (value === "FALLING") return "falling";

  return "stable";
}

function getTrendIcon(trend: string | null) {
  const value = normalize(trend);

  if (value === "RISING") return "↑";
  if (value === "FALLING") return "↓";

  return "→";
}

export default function ProductPage() {
  const [data, setData] = useState<
    ProvinceDemandPrediction[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [province, setProvince] =
    useState("All");

  const [category, setCategory] =
    useState("All");

  const [demandLevel, setDemandLevel] =
    useState("All Levels");

  const [sortBy, setSortBy] =
    useState<SortBy>("projected-desc");

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadPredictions() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("province_demand_prediction")
          .select("*")
          .order("generated_at", {
            ascending: false,
          });

        if (error) {
          throw error;
        }

        setData(data ?? []);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load predictions.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPredictions();
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        data.map((item) => item.category),
      ),
    ).sort();

    return ["All", ...unique];
  }, [data]);

  const filteredData = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return data
      .filter((item) => {
        if (
          province !== "All" &&
          item.province !== province
        ) {
          return false;
        }

        if (
          category !== "All" &&
          item.category !== category
        ) {
          return false;
        }

        if (
          demandLevel !== "All Levels" &&
          normalize(item.predicted_label) !==
            demandLevel
        ) {
          return false;
        }

        if (searchText) {
          const matchesCategory =
            item.category
              .toLowerCase()
              .includes(searchText);

          const matchesProvince =
            item.province
              .toLowerCase()
              .includes(searchText);

          if (
            !matchesCategory &&
            !matchesProvince
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "projected-desc":
            return (
              (b.projected_score ?? 0) -
              (a.projected_score ?? 0)
            );

          case "projected-asc":
            return (
              (a.projected_score ?? 0) -
              (b.projected_score ?? 0)
            );

          case "current-desc":
            return (
              (b.current_score ?? 0) -
              (a.current_score ?? 0)
            );

          case "current-asc":
            return (
              (a.current_score ?? 0) -
              (b.current_score ?? 0)
            );

          case "category":
            return a.category.localeCompare(
              b.category,
            );

          default:
            return 0;
        }
      });
  }, [
    data,
    province,
    category,
    demandLevel,
    sortBy,
    search,
  ]);

  const highCount = filteredData.filter(
    (item) =>
      normalize(item.predicted_label) ===
      "HIGH",
  ).length;

  const mediumCount = filteredData.filter(
    (item) =>
      normalize(item.predicted_label) ===
      "MEDIUM",
  ).length;

  const lowCount = filteredData.filter(
    (item) =>
      normalize(item.predicted_label) ===
      "LOW",
  ).length;

  return (
    <div className="page">
      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #000;
          color: #fff;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 24px 100px;
        }

        .header {
          margin-bottom: 50px;
        }

        .eyebrow {
          color: #10b981;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .title {
          margin: 0;
          font-size: clamp(40px, 6vw, 72px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .description {
          max-width: 650px;
          margin-top: 20px;
          color: #a1a1aa;
          line-height: 1.7;
          font-size: 16px;
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 40px;
          border: 1px solid #1f1f1f;
          border-radius: 24px;
          margin-bottom: 50px;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(16, 185, 129, 0.12),
              transparent 35%
            ),
            #101010;
        }

        .hero-title {
          position: relative;
          z-index: 1;
          margin: 0;
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 38px;
        }

        .hero-text {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin-top: 12px;
          color: #a1a1aa;
          line-height: 1.7;
        }

        .province-tabs {
          display: flex;
          gap: 28px;
          overflow-x: auto;
          border-bottom: 1px solid #202020;
          margin-bottom: 30px;
        }

        .province-button {
          flex-shrink: 0;
          padding: 14px 0;
          border: 0;
          background: transparent;
          color: #71717a;
          cursor: pointer;
          font-size: 14px;
        }

        .province-button.active {
          color: #fff;
          border-bottom: 2px solid #fff;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 30px;
        }

        .select,
        .search {
          min-height: 44px;
          padding: 0 14px;
          border: 1px solid #262626;
          border-radius: 10px;
          background: #111;
          color: #fff;
          font-size: 14px;
        }

        .search {
          min-width: 240px;
        }

        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          margin-bottom: 30px;
          color: #71717a;
          font-size: 14px;
        }

        .stats strong {
          color: #fff;
          margin-left: 5px;
        }

        .grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .card {
          padding: 24px;
          border: 1px solid #1f1f1f;
          border-radius: 20px;
          background: #101010;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .card:hover {
          transform: translateY(-4px);
          border-color: #333;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .category {
          margin: 0;
          font-size: 24px;
          text-transform: capitalize;
        }

        .province {
          margin-top: 6px;
          color: #71717a;
          font-size: 13px;
        }

        .demand {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .demand.high {
          color: #10b981;
        }

        .demand.medium {
          color: #f59e0b;
        }

        .demand.low {
          color: #71717a;
        }

        .demand.unknown {
          color: #52525b;
        }

        .scores {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 24px;
        }

        .score {
          padding: 16px;
          border-radius: 12px;
          background: #171717;
        }

        .score-label {
          display: block;
          margin-bottom: 7px;
          color: #71717a;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .score-value {
          font-family: Georgia, serif;
          font-size: 24px;
        }

        .score-value.projected {
          color: #10b981;
        }

        .seller {
          margin-top: 14px;
          padding: 10px 12px;
          border-radius: 8px;
          background: #171717;
          color: #a1a1aa;
          font-size: 12px;
        }

        .seller.good {
          color: #10b981;
          background: rgba(
            16,
            185,
            129,
            0.08
          );
        }

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #222;
        }

        .detail-label {
          display: block;
          margin-bottom: 5px;
          color: #52525b;
          font-size: 10px;
          text-transform: uppercase;
        }

        .detail-value {
          color: #d4d4d8;
          font-size: 13px;
        }

        .trend {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          color: #a1a1aa;
          font-size: 13px;
        }

        .trend.rising {
          color: #10b981;
        }

        .trend.falling {
          color: #ef4444;
        }

        .trend.stable {
          color: #71717a;
        }

        .empty {
          padding: 80px 20px;
          text-align: center;
          border: 1px dashed #222;
          border-radius: 20px;
          color: #71717a;
        }

        .error {
          color: #ef4444;
        }

        @media (max-width: 1000px) {
          .grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .container {
            padding: 90px 16px 70px;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .hero {
            padding: 28px;
          }

          .hero-title {
            font-size: 30px;
          }

          .search {
            width: 100%;
          }
        }
      `}</style>

      <Navbar />

      <main className="container">
        <header className="header">
          <div className="eyebrow">
            LOKALENS · DEMAND INTELLIGENCE
          </div>

          <h1 className="title">
            Sri Lankan Market Pulse
          </h1>

          <p className="description">
            Explore AI-generated demand predictions
            across Sri Lankan provinces and product
            categories.
          </p>
        </header>

        <section className="hero">
          <h2 className="hero-title">
            See where demand is moving.
          </h2>

          <p className="hero-text">
            Compare current and projected demand
            scores, monitor category trends, and
            understand the confidence behind each
            prediction.
          </p>
        </section>

        <div className="province-tabs">
          {PROVINCES.map((item) => (
            <button
              key={item}
              type="button"
              className={`province-button ${
                province === item
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setProvince(item)
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div className="filters">
          <select
            className="select"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                Category: {item}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={demandLevel}
            onChange={(e) =>
              setDemandLevel(e.target.value)
            }
          >
            {DEMAND_LEVELS.map((item) => (
              <option
                key={item}
                value={item}
              >
                Demand: {item}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as SortBy,
              )
            }
          >
            <option value="projected-desc">
              Projected Score ↓
            </option>

            <option value="projected-asc">
              Projected Score ↑
            </option>

            <option value="current-desc">
              Current Score ↓
            </option>

            <option value="current-asc">
              Current Score ↑
            </option>

            <option value="category">
              Category A–Z
            </option>
          </select>

          <input
            className="search"
            type="search"
            placeholder="Search category or province..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="stats">
          <span>
            Predictions
            <strong>
              {filteredData.length}
            </strong>
          </span>

          <span>
            High
            <strong>{highCount}</strong>
          </span>

          <span>
            Medium
            <strong>{mediumCount}</strong>
          </span>

          <span>
            Low
            <strong>{lowCount}</strong>
          </span>
        </div>

        {loading && (
          <div className="empty">
            Loading demand predictions...
          </div>
        )}

        {!loading && error && (
          <div className="empty">
            <p className="error">
              Failed to load demand predictions.
            </p>

            <p>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredData.length === 0 && (
            <div className="empty">
              No demand predictions found.
            </div>
          )}

        {!loading &&
          !error &&
          filteredData.length > 0 && (
            <div className="grid">
              {filteredData.map((item) => {
                const demandClass =
                  getDemandClass(
                    item.predicted_label,
                  );

                const trendClass =
                  getTrendClass(item.trend);

                return (
                  <article
                    key={item.id}
                    className="card"
                  >
                    <div className="card-header">
                      <div>
                        <h2 className="category">
                          {item.category}
                        </h2>

                        <div className="province">
                          {item.province} Province
                        </div>
                      </div>

                      <span
                        className={`demand ${demandClass}`}
                      >
                        {normalize(
                          item.predicted_label,
                        )}
                      </span>
                    </div>

                    <div className="scores">
                      <div className="score">
                        <span className="score-label">
                          Current Score
                        </span>

                        <span className="score-value">
                          {formatScore(
                            item.current_score,
                          )}
                        </span>
                      </div>

                      <div className="score">
                        <span className="score-label">
                          Projected Score
                        </span>

                        <span className="score-value projected">
                          {formatScore(
                            item.projected_score,
                          )}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`seller ${
                        item.predicted_good_seller
                          ? "good"
                          : ""
                      }`}
                    >
                      {item.predicted_good_seller
                        ? "✓ Predicted Good Seller"
                        : "○ Not predicted as a good seller"}
                    </div>

                    <div className="details">
                      <div>
                        <span className="detail-label">
                          Confidence
                        </span>

                        <span className="detail-value">
                          {normalize(
                            item.confidence,
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="detail-label">
                          History
                        </span>

                        <span className="detail-value">
                          {formatNumber(
                            item.days_of_history,
                          )}{" "}
                          days
                        </span>
                      </div>

                      <div>
                        <span className="detail-label">
                          Avg Listings
                        </span>

                        <span className="detail-value">
                          {formatNumber(
                            item.avg_listing_count,
                          )}
                        </span>
                      </div>

                      <div>
                        <span className="detail-label">
                          Daily Slope
                        </span>

                        <span className="detail-value">
                          {item.slope_per_day !==
                          null
                            ? item.slope_per_day.toFixed(
                                4,
                              )
                            : "—"}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`trend ${trendClass}`}
                    >
                      <span>
                        {getTrendIcon(
                          item.trend,
                        )}{" "}
                        {normalize(item.trend)}
                      </span>

                      <span>
                        {normalize(
                          item.current_label,
                        )}{" "}
                        →{" "}
                        {normalize(
                          item.predicted_label,
                        )}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </main>

      <Footer />
    </div>
  );
}