"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Forecast } from "../types/forecast.types";

const initialForecasts: Forecast[] = [
  {
    id: "F001",
    province: "Western",
    product: "Coca Cola",
    predictedDemand: 1250,
    confidence: 96,
    trend: "Up",
    createdAt: "2026-06-01",
  },
  {
    id: "F002",
    province: "Central",
    product: "Milk Powder",
    predictedDemand: 850,
    confidence: 91,
    trend: "Stable",
    createdAt: "2026-06-01",
  },
];

export default function useForecasts() {
  const [forecasts, setForecasts] =
    useState<Forecast[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  /* Load Forecasts */
  useEffect(() => {
    const savedForecasts =
      localStorage.getItem(
        "forecast-records"
      );

    if (savedForecasts) {
      setForecasts(
        JSON.parse(savedForecasts)
      );
    } else {
      setForecasts(
        initialForecasts
      );
    }
  }, []);

  /* Save Forecasts */
  useEffect(() => {
    localStorage.setItem(
      "forecast-records",
      JSON.stringify(forecasts)
    );
  }, [forecasts]);

  /* Add Forecast */
  const addForecast = (
    forecast: Omit<
      Forecast,
      "id" | "createdAt"
    >
  ) => {
    const newForecast: Forecast = {
      id: `F${Date.now()}`,
      ...forecast,
      createdAt:
        new Date().toISOString(),
    };

    setForecasts((prev) => [
      newForecast,
      ...prev,
    ]);
  };

  /* Update Forecast */
  const updateForecast = (
    forecastId: string,
    forecastData: Omit<
      Forecast,
      "id" | "createdAt"
    >
  ) => {
    setForecasts((prev) =>
      prev.map((forecast) =>
        forecast.id === forecastId
          ? {
              ...forecast,
              ...forecastData,
            }
          : forecast
      )
    );
  };

  /* Delete Forecast */
  const deleteForecast = (
    forecastId: string
  ) => {
    setForecasts((prev) =>
      prev.filter(
        (forecast) =>
          forecast.id !==
          forecastId
      )
    );
  };

  /* Search */
  const filteredForecasts =
    useMemo(() => {
      if (!searchTerm.trim()) {
        return forecasts;
      }

      return forecasts.filter(
        (forecast) =>
          forecast.product
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          forecast.province
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );
    }, [
      forecasts,
      searchTerm,
    ]);

  return {
    forecasts,
    filteredForecasts,

    searchTerm,
    setSearchTerm,

    addForecast,
    updateForecast,
    deleteForecast,
  };
}