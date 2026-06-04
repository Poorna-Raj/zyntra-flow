import ForecastCard from "./ForecastCard";
import { Forecast } from "../../types/forecast.types";

interface ForecastGridProps {
  forecasts: Forecast[];
  darkMode?: boolean;
  onEdit?: (forecast: Forecast) => void;
  onDelete?: (id: string) => void;
}

export default function ForecastGrid({
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
            darkMode
              ? "#334155"
              : "#CBD5E1"
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

        <h3
          style={{
            marginBottom: "0.5rem",
          }}
        >
          No Forecasts Found
        </h3>

        <p>
          Try changing filters or add a
          new forecast.
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
      {forecasts.map(
        (forecast) => (
          <ForecastCard
            key={forecast.id}
            forecast={forecast}
            darkMode={darkMode}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      )}
    </div>
  );
}