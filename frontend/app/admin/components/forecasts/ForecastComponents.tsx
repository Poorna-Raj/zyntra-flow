"use client";

import { useState } from "react";
import { Forecast } from "../../types/admin.types";

/* =========================
   Forecast Card
========================= */

interface ForecastCardProps {
  forecast: Forecast;
  darkMode?: boolean;
  onEdit?: (forecast: Forecast) => void;
  onDelete?: (id: string) => void;
}

export function ForecastCard({
  forecast,
  darkMode = false,
  onEdit,
  onDelete,
}: ForecastCardProps) {
  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const borderClr = darkMode ? "#334155" : "#E2E8F0";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const subTxt = darkMode ? "#94A3B8" : "#64748B";

  const trendColor =
    forecast.trend === "Up"
      ? "#22C55E"
      : forecast.trend === "Down"
      ? "#EF4444"
      : "#F59E0B";

  return (
    <div
      className="stat-card"
      style={{
        background: cardBg,
        border: `1px solid ${borderClr}`,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          height: 6,
          background:
            "linear-gradient(135deg,#38BDF8,#2563EB)",
        }}
      />

      <div style={{ padding: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h3
              style={{
                color: mainTxt,
                fontSize: "1.1rem",
                fontWeight: 700,
              }}
            >
              {forecast.product}
            </h3>

            <p
              style={{
                color: subTxt,
                marginTop: 4,
              }}
            >
              📍 {forecast.province}
            </p>
          </div>

          <span
            style={{
              background: trendColor + "20",
              color: trendColor,
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {forecast.trend}
          </span>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: mainTxt,
            }}
          >
            {forecast.predictedDemand}
          </h2>

          <p style={{ color: subTxt }}>
            Predicted Demand
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span style={{ color: subTxt }}>
            Confidence
          </span>

          <span
            style={{
              fontWeight: 700,
              color: "#0EA5E9",
            }}
          >
            {forecast.confidence}%
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            title="Edit Forecast"
            onClick={() => onEdit?.(forecast)}
            style={{
              flex: 1,
              border: "none",
              borderRadius: 12,
              padding: "10px",
              cursor: "pointer",
              background: "#38BDF8",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ✏️ Edit
          </button>

          <button
            title="Delete Forecast"
            onClick={() => onDelete?.(forecast.id)}
            style={{
              flex: 1,
              border: "none",
              borderRadius: 12,
              padding: "10px",
              cursor: "pointer",
              background: "#EF4444",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Forecast Grid
========================= */

interface ForecastGridProps {
  forecasts: Forecast[];
  darkMode?: boolean;
  onEdit?: (forecast: Forecast) => void;
  onDelete?: (id: string) => void;
}

export function ForecastGrid({
  forecasts,
  darkMode = false,
  onEdit,
  onDelete,
}: ForecastGridProps) {
  if (forecasts.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          borderRadius: 24,
          border: `1px dashed ${
            darkMode ? "#334155" : "#CBD5E1"
          }`,
          color: darkMode
            ? "#94A3B8"
            : "#64748B",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
          }}
        >
          📊
        </div>

        <h3 style={{ marginBottom: "0.5rem" }}>
          No Forecasts Found
        </h3>

        <p>
          Try changing filters or add a new
          forecast.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fill,minmax(320px,1fr))",
        gap: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      {forecasts.map((forecast) => (
        <ForecastCard
          key={forecast.id}
          forecast={forecast}
          darkMode={darkMode}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
/* =========================
   Forecast Filters
========================= */

interface ForecastFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  selectedProvince: string;
  setSelectedProvince: (
    value: string
  ) => void;

  clearFilters: () => void;

  darkMode?: boolean;
}

const provinces = [
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

export function ForecastFilters({
  searchTerm,
  setSearchTerm,
  selectedProvince,
  setSelectedProvince,
  clearFilters,
  darkMode = false,
}: ForecastFiltersProps) {
  const cardBg = darkMode
    ? "#1E293B"
    : "#FFFFFF";

  const borderClr = darkMode
    ? "#334155"
    : "#E2E8F0";

  const mainTxt = darkMode
    ? "#F1F5F9"
    : "#1E293B";

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${borderClr}`,
        borderRadius: 24,
        padding: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search forecast..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          style={{
            flex: 1,
            minWidth: 250,
            padding: "12px",
            borderRadius: 12,
            border: `1px solid ${borderClr}`,
            color: mainTxt,
            outline: "none",
          }}
        />

        <select
          value={selectedProvince}
          onChange={(e) =>
            setSelectedProvince(
              e.target.value
            )
          }
          style={{
            padding: "12px",
            borderRadius: 12,
            border: `1px solid ${borderClr}`,
            minWidth: 220,
            color: mainTxt,
            outline: "none",
          }}
        >
          <option value="">
            All Provinces
          </option>

          {provinces.map(
            (province) => (
              <option
                key={province}
                value={province}
              >
                {province}
              </option>
            )
          )}
        </select>

        <button
          onClick={clearFilters}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background: "#EF4444",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

/* =========================
   Forecast Stats
========================= */

interface ForecastStatsProps {
  forecasts: Forecast[];
}

export function ForecastStats({
  forecasts,
}: ForecastStatsProps) {
  const totalForecasts =
    forecasts.length;

  const growingTrends =
    forecasts.filter(
      (forecast) =>
        forecast.trend === "Up"
    ).length;

  const avgConfidence =
    forecasts.length > 0
      ? Math.round(
          forecasts.reduce(
            (sum, forecast) =>
              sum +
              forecast.confidence,
            0
          ) / forecasts.length
        )
      : 0;

  const activeProvinces =
    new Set(
      forecasts.map(
        (forecast) =>
          forecast.province
      )
    ).size;

  const stats = [
    {
      title:
        "Total Forecasts",
      value:
        totalForecasts,
      icon: "📊",
    },
    {
      title:
        "Growing Trends",
      value:
        growingTrends,
      icon: "📈",
    },
    {
      title:
        "Avg Confidence",
      value: `${avgConfidence}%`,
      icon: "🎯",
    },
    {
      title:
        "Active Provinces",
      value:
        activeProvinces,
      icon: "🌍",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="stat-card"
          style={{
            background:
              "linear-gradient(135deg,#38BDF8,#2563EB)",
            color: "#fff",
            borderRadius: 24,
            padding: "1.5rem",
            boxShadow:
              "0 15px 35px rgba(37,99,235,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
            }}
          >
            <div>
              <p
                style={{
                  opacity: 0.9,
                  fontSize:
                    "0.9rem",
                }}
              >
                {stat.title}
              </p>

              <h2
                style={{
                  fontSize:
                    "2rem",
                  fontWeight:
                    800,
                  marginTop:
                    "0.4rem",
                }}
              >
                {stat.value}
              </h2>
            </div>

            <div
              style={{
                fontSize:
                  "2.2rem",
              }}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ForecastTableProps {
  forecasts: Forecast[];
  darkMode?: boolean;
  onEdit?: (forecast: Forecast) => void;
  onDelete?: (id: string) => void;
}

export function ForecastTable({
  forecasts,
  darkMode = false,
  onEdit,
  onDelete,
}: ForecastTableProps) {
  const cardBg = darkMode
    ? "#1E293B"
    : "#FFFFFF";

  const borderClr = darkMode
    ? "#334155"
    : "#E2E8F0";

  const mainTxt = darkMode
    ? "#F1F5F9"
    : "#1E293B";

  const subTxt = darkMode
    ? "#94A3B8"
    : "#64748B";

  const getTrendColor = (
    trend: string
  ) => {
    switch (trend) {
      case "Up":
        return "#22C55E";
      case "Down":
        return "#EF4444";
      default:
        return "#F59E0B";
    }
  };

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 24,
        border: `1px solid ${borderClr}`,
        overflow: "hidden",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.5rem",
          background:
            "linear-gradient(135deg,#38BDF8,#2563EB)",
          color: "#fff",
        }}
      >
        <h2
          style={{
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          📊 Forecast Records
        </h2>

        <p
          style={{
            opacity: 0.9,
            marginTop: 4,
            fontSize: "0.9rem",
          }}
        >
          Regional demand predictions
        </p>
      </div>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={headerStyle}>
                Product
              </th>

              <th style={headerStyle}>
                Province
              </th>

              <th style={headerStyle}>
                Demand
              </th>

              <th style={headerStyle}>
                Confidence
              </th>

              <th style={headerStyle}>
                Trend
              </th>

              <th style={headerStyle}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {forecasts.map(
              (forecast) => (
                <tr
                  key={forecast.id}
                >
                  <td
                    style={{
                      ...cellStyle,
                      color: mainTxt,
                      fontWeight: 600,
                    }}
                  >
                    {forecast.product}
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      color: subTxt,
                    }}
                  >
                    📍{" "}
                    {
                      forecast.province
                    }
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                      color: mainTxt,
                    }}
                  >
                    {
                      forecast.predictedDemand
                    }
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#0EA5E9",
                        fontWeight: 700,
                      }}
                    >
                      {
                        forecast.confidence
                      }
                      %
                    </span>
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                    }}
                  >
                    <span
                      style={{
                        background:
                          getTrendColor(
                            forecast.trend
                          ) +
                          "20",
                        color:
                          getTrendColor(
                            forecast.trend
                          ),
                        padding:
                          "6px 12px",
                        borderRadius:
                          20,
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {
                        forecast.trend
                      }
                    </span>
                  </td>

                  <td
                    style={{
                      ...cellStyle,
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        onClick={() =>
                          onEdit?.(
                            forecast
                          )
                        }
                        style={{
                          border:
                            "none",
                          background:
                            "#38BDF8",
                          color:
                            "#fff",
                          padding:
                            "8px 12px",
                          borderRadius:
                            10,
                          cursor:
                            "pointer",
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() =>
                          onDelete?.(
                            forecast.id
                          )
                        }
                        style={{
                          border:
                            "none",
                          background:
                            "#EF4444",
                          color:
                            "#fff",
                          padding:
                            "8px 12px",
                          borderRadius:
                            10,
                          cursor:
                            "pointer",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties =
{
  textAlign: "left",
  padding: "1rem",
  fontSize: "0.9rem",
  fontWeight: 700,
  color: "#64748B",
};

const cellStyle: React.CSSProperties =
{
  padding: "1rem",
  borderTop:
    "1px solid rgba(148,163,184,0.15)",
  fontSize: "0.9rem",
};




interface ForecastFormData {
  province: string;
  product: string;
  predictedDemand: number;
  confidence: number;
  trend: "Up" | "Down" | "Stable";
}

interface ForecastFormProps {
  darkMode?: boolean;
  onSubmit: (
    data: ForecastFormData
  ) => void;
  onCancel: () => void;
  initialData?: ForecastFormData;
}

export function ForecastForm({
  darkMode = false,
  onSubmit,
  onCancel,
  initialData,
}: ForecastFormProps) {
  const [formData, setFormData] =
    useState<ForecastFormData>(
      initialData || {
        province: "",
        product: "",
        predictedDemand: 0,
        confidence: 0,
        trend: "Stable",
      }
    );

  const cardBg = darkMode
    ? "#1E293B"
    : "#FFFFFF";

  const borderClr = darkMode
    ? "#334155"
    : "#E2E8F0";

  const mainTxt = darkMode
    ? "#F1F5F9"
    : "#1E293B";

  const provinces = [
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

  const handleChange = (
    field: keyof ForecastFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.product ||
      !formData.province
    ) {
      alert(
        "Please fill all required fields"
      );
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: cardBg,
        border: `1px solid ${borderClr}`,
        borderRadius: 24,
        padding: "2rem",
        marginBottom: "2rem",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          marginBottom: "1.8rem",
        }}
      >
        <h2
          style={{
            color: mainTxt,
            fontSize: "1.5rem",
            fontWeight: 800,
            marginBottom: "0.4rem",
          }}
        >
          📊 Create Forecast
        </h2>

        <p
          style={{
            color: "#64748B",
            fontSize: "0.9rem",
          }}
        >
          Create a new demand prediction
          for your inventory.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,1fr)",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={formData.product}
          onChange={(e) =>
            handleChange(
              "product",
              e.target.value
            )
          }
          style={inputStyle}
        />

        <select
          value={formData.province}
          onChange={(e) =>
            handleChange(
              "province",
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="">
            Select Province
          </option>

          {provinces.map(
            (province) => (
              <option
                key={province}
                value={province}
              >
                {province}
              </option>
            )
          )}
        </select>

        <input
          type="number"
          placeholder="Predicted Demand"
          value={
            formData.predictedDemand
          }
          onChange={(e) =>
            handleChange(
              "predictedDemand",
              Number(
                e.target.value
              )
            )
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Confidence %"
          value={formData.confidence}
          onChange={(e) =>
            handleChange(
              "confidence",
              Number(
                e.target.value
              )
            )
          }
          style={inputStyle}
        />

        <select
          value={formData.trend}
          onChange={(e) =>
            handleChange(
              "trend",
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="Up">
            📈 Up
          </option>

          <option value="Down">
            📉 Down
          </option>

          <option value="Stable">
            ➖ Stable
          </option>
        </select>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1.8rem",
        }}
      >
        <button
          type="submit"
          style={{
            padding:
              "12px 22px",
            border: "none",
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#38BDF8,#2563EB)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Save Forecast
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            padding:
              "12px 22px",
            borderRadius: 14,
            border:
              "1px solid #CBD5E1",
            background:
              "#FFFFFF",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties =
{
  width: "100%",
  padding: "14px",
  borderRadius: 14,
  border: "1px solid #CBD5E1",
  outline: "none",
  fontSize: "0.95rem",
  background: "#F8FAFC",
};