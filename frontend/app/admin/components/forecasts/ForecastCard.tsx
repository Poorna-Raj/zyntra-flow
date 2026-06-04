import { Forecast } from "../../types/forecast.types";

interface ForecastCardProps {
  forecast: Forecast;
  darkMode?: boolean;
  onEdit?: (forecast: Forecast) => void;
  onDelete?: (id: string) => void;
}

export default function ForecastCard({
  forecast,
  darkMode = false,
  onEdit,
  onDelete,
}: ForecastCardProps) {
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
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          height: 6,
          background:
            "linear-gradient(135deg,#38BDF8,#2563EB)",
        }}
      />

      <div
        style={{
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
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
              background:
                trendColor + "20",
              color: trendColor,
              padding:
                "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {forecast.trend}
          </span>
        </div>

        <div
          style={{
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: mainTxt,
            }}
          >
            {forecast.predictedDemand}
          </h2>

          <p
            style={{
              color: subTxt,
            }}
          >
            Predicted Demand
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              color: subTxt,
            }}
          >
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
            onClick={() =>
              onEdit?.(forecast)
            }
            style={{
              flex: 1,
              border: "none",
              borderRadius: 12,
              padding: "10px",
              cursor: "pointer",
              background:
                "#38BDF8",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            ✏️ Edit
          </button>

          <button
            title="Delete Forecast"
            onClick={() =>
              onDelete?.(
                forecast.id
              )
            }
            style={{
              flex: 1,
              border: "none",
              borderRadius: 12,
              padding: "10px",
              cursor: "pointer",
              background:
                "#EF4444",
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