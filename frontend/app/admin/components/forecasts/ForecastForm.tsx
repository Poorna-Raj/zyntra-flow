"use client";

import { useState } from "react";

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

export default function ForecastForm({
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