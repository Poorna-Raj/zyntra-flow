"use client";

import { useState } from "react";

import ForecastForm from "../components/forecasts/ForecastForm";
import ForecastFilters from "../components/forecasts/ForecastFilters";
import ForecastGrid from "../components/forecasts/ForecastGrid";
import ForecastTable from "../components/forecasts/ForecastTable";
import ForecastStats from "../components/forecasts/ForecastStats";

import useForecasts from "../hooks/useForecasts";

import { Forecast } from "../types/forecast.types";

export default function ForecastsPage() {
  const [darkMode] = useState(false);

  const [showForm, setShowForm] =
    useState(false);

  const [editingForecast, setEditingForecast] =
    useState<Forecast | null>(null);

  const [selectedProvince, setSelectedProvince] =
    useState("");

  const {
    forecasts,
    filteredForecasts,
    searchTerm,
    setSearchTerm,
    addForecast,
    updateForecast,
    deleteForecast,
  } = useForecasts();

  const visibleForecasts =
    selectedProvince === ""
      ? filteredForecasts
      : filteredForecasts.filter(
          (forecast) =>
            forecast.province ===
            selectedProvince
        );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProvince("");
  };

  return (
    <div
      style={{
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
            }}
          >
            Forecast Management
          </h1>

          <p
            style={{
              color: "#64748B",
              marginTop: 8,
            }}
          >
            Manage demand forecasts and
            regional predictions.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingForecast(
              null
            );
            setShowForm(
              !showForm
            );
          }}
          style={{
            padding:
              "12px 20px",
            border: "none",
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#38BDF8,#2563EB)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + Add Forecast
        </button>
      </div>

      {/* Stats */}
      <ForecastStats
        forecasts={
          visibleForecasts
        }
      />

      {/* Form */}
      {showForm && (
        <ForecastForm
          darkMode={darkMode}
          initialData={
            editingForecast
              ? {
                  province:
                    editingForecast.province,
                  product:
                    editingForecast.product,
                  predictedDemand:
                    editingForecast.predictedDemand,
                  confidence:
                    editingForecast.confidence,
                  trend:
                    editingForecast.trend,
                }
              : undefined
          }
          onSubmit={(data) => {
            if (
              editingForecast
            ) {
              updateForecast(
                editingForecast.id,
                data
              );
            } else {
              addForecast(
                data
              );
            }

            setEditingForecast(
              null
            );
            setShowForm(false);
          }}
          onCancel={() => {
            setEditingForecast(
              null
            );
            setShowForm(false);
          }}
        />
      )}

      {/* Filters */}
      <ForecastFilters
        searchTerm={searchTerm}
        setSearchTerm={
          setSearchTerm
        }
        selectedProvince={
          selectedProvince
        }
        setSelectedProvince={
          setSelectedProvince
        }
        clearFilters={
          clearFilters
        }
        darkMode={darkMode}
      />

      {/* Cards */}
      <ForecastGrid
        forecasts={
          visibleForecasts
        }
        darkMode={darkMode}
        onEdit={(
          forecast
        ) => {
          setEditingForecast(
            forecast
          );
          setShowForm(true);
        }}
        onDelete={
          deleteForecast
        }
      />

      {/* Table */}
      <ForecastTable
        forecasts={
          visibleForecasts
        }
        darkMode={darkMode}
        onEdit={(
          forecast
        ) => {
          setEditingForecast(
            forecast
          );
          setShowForm(true);
        }}
        onDelete={
          deleteForecast
        }
      />
    </div>
  );
}