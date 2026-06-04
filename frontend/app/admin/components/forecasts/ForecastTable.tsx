import { Forecast } from "../../types/forecast.types";

interface ForecastTableProps {
  forecasts: Forecast[];
  darkMode?: boolean;
  onEdit?: (forecast: Forecast) => void;
  onDelete?: (id: string) => void;
}

export default function ForecastTable({
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