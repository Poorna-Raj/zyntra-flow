import { StatCardData } from "../../types/admin.types";
import { statsData, activityData } from "../../constants/admin.data";
interface StatCardProps {
  stat: StatCardData;
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <div
      className="stat-card"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: "2rem",
        background: stat.gradient,
        color: "#fff",
        minHeight: 200,
      }}
    >
      {/* Background Circles */}
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          top: -50,
          right: -40,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
          bottom: -70,
          right: 40,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            opacity: 0.95,
          }}
        >
          {stat.title}
        </p>

        <span
          style={{
            fontSize: "1.4rem",
          }}
        >
          {stat.icon}
        </span>
      </div>

      <h2
        style={{
          fontSize: "2.8rem",
          fontWeight: 800,
          marginBottom: "1rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {stat.value}
      </h2>

      <p
        style={{
          fontSize: "0.95rem",
          opacity: 0.95,
          position: "relative",
          zIndex: 2,
        }}
      >
        {stat.growth}
      </p>
    </div>
  );
  
}
  
  export function StatsRow() { 
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {statsData.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>
    );
}


interface ForecastTableProps {
  darkMode: boolean;
}

export function ForecastTable({
  darkMode,
}: ForecastTableProps) {
  const cardBg = darkMode ? "#1E293B" : "#ffffff";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const subTxt = darkMode ? "#94A3B8" : "#64748B";

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "High":
        return {
          background: "rgba(34,197,94,0.12)",
          color: "#16A34A",
        };

      case "Medium":
        return {
          background: "rgba(250,204,21,0.16)",
          color: "#CA8A04",
        };

      default:
        return {
          background: "rgba(56,189,248,0.12)",
          color: "#0284C7",
        };
    }
  };

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 28,
        padding: "2rem",
        border: `1px solid ${borderClr}`,
        transition: "background .3s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h3
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: mainTxt,
          }}
        >
          Recent Forecast Activity
        </h3>

        <button
          style={{
            padding: "0.8rem 1.4rem",
            borderRadius: 14,
            border: "none",
            background:
              "linear-gradient(135deg,#C084FC,#A855F7)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
            boxShadow:
              "0 4px 14px rgba(168,85,247,0.3)",
          }}
        >
          View Reports
        </button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              color: "#94A3B8",
            }}
          >
            <th
              style={{
                paddingBottom: "1rem",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Product
            </th>

            <th
              style={{
                paddingBottom: "1rem",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Province
            </th>

            <th
              style={{
                paddingBottom: "1rem",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Forecast Score
            </th>

            <th
              style={{
                paddingBottom: "1rem",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {activityData.map((item, index) => {
            const statusStyle = getStatusStyle(item.status);

            return (
              <tr key={index}>
                <td
                  style={{
                    padding: "1.1rem 0",
                    borderTop: `1px solid ${
                      darkMode ? "#334155" : "#F1F5F9"
                    }`,
                    fontWeight: 700,
                    color: mainTxt,
                  }}
                >
                  {item.product}
                </td>

                <td
                  style={{
                    borderTop: `1px solid ${
                      darkMode ? "#334155" : "#F1F5F9"
                    }`,
                    color: subTxt,
                    fontSize: 14,
                  }}
                >
                  {item.province}
                </td>

                <td
                  style={{
                    borderTop: `1px solid ${
                      darkMode ? "#334155" : "#F1F5F9"
                    }`,
                    color: subTxt,
                    fontSize: 14,
                  }}
                >
                  {item.forecastScore}
                </td>

                <td
                  style={{
                    borderTop: `1px solid ${
                      darkMode ? "#334155" : "#F1F5F9"
                    }`,
                  }}
                >
                  <span
                    style={{
                      padding: "0.4rem 1rem",
                      borderRadius: 99,
                      fontWeight: 700,
                      fontSize: 12,
                      background: statusStyle.background,
                      color: statusStyle.color,
                    }}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
interface TrafficDonutChartProps {
  darkMode: boolean;
}

export function TrafficDonutChart({
  darkMode,
}: TrafficDonutChartProps) {
  const cardBg = darkMode ? "#1E293B" : "#ffffff";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const subTxt = darkMode ? "#94A3B8" : "#64748B";

  const trafficSources = [
    {
      label: "Search Engines",
      color: "#EC4899",
      percentage: "40%",
    },
    {
      label: "Direct Click",
      color: "#2DD4BF",
      percentage: "30%",
    },
    {
      label: "Social Media",
      color: "#38BDF8",
      percentage: "30%",
    },
  ];

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 28,
        padding: "2rem",
        border: `1px solid ${borderClr}`,
        transition: "background .3s",
      }}
    >
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          color: mainTxt,
        }}
      >
        Traffic Sources
      </h3>

      {/* Donut Chart */}
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          margin: "0 auto 1.5rem",
          position: "relative",
          background:
            "conic-gradient(#EC4899 0% 40%, #2DD4BF 40% 70%, #38BDF8 70% 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 36,
            borderRadius: "50%",
            background: cardBg,
            transition: "background .3s",
          }}
        />
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
        }}
      >
        {trafficSources.map((source) => (
          <div
            key={source.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.7rem",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: source.color,
                }}
              />

              <span
                style={{
                  color: subTxt,
                  fontWeight: 500,
                  fontSize: 14,
                }}
              >
                {source.label}
              </span>
            </div>

            <span
              style={{
                fontWeight: 700,
                color: mainTxt,
              }}
            >
              {source.percentage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
interface WeeklyForecastChartProps {
  darkMode: boolean;
}

export function WeeklyForecastChart({
  darkMode,
}: WeeklyForecastChartProps) {
  const cardBg = darkMode ? "#1E293B" : "#ffffff";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const subTxt = darkMode ? "#94A3B8" : "#64748B";

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 28,
        padding: "2rem",
        border: `1px solid ${borderClr}`,
        transition: "background .3s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.4rem",
              color: mainTxt,
            }}
          >
            Weekly Demand Forecasts
          </h3>

          <p
            style={{
              color: subTxt,
              fontSize: 14,
            }}
          >
            Regional forecasting performance
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {[
            ["AI", "#A855F7"],
            ["Forecast", "#38BDF8"],
          ].map(([label, color]) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                color,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: color,
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          height: 280,
          position: "relative",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${i * 25}%`,
              left: 0,
              right: 0,
              borderTop: `1px solid ${
                darkMode ? "#334155" : "#F1F5F9"
              }`,
            }}
          />
        ))}

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 280"
          preserveAspectRatio="none"
        >
          {[
            [80, 140, 16, 100, "#A855F7"],
            [180, 100, 16, 140, "#A855F7"],
            [280, 160, 16, 80, "#A855F7"],
            [380, 110, 16, 130, "#A855F7"],
            [480, 70, 16, 170, "#A855F7"],
            [580, 120, 16, 120, "#A855F7"],

            [110, 110, 16, 130, "#EC4899"],
            [210, 160, 16, 90, "#EC4899"],
            [310, 120, 16, 120, "#EC4899"],
            [410, 180, 16, 70, "#EC4899"],
            [510, 150, 16, 100, "#EC4899"],
            [610, 100, 16, 140, "#EC4899"],

            [140, 60, 16, 190, "#38BDF8"],
            [240, 190, 16, 60, "#38BDF8"],
            [340, 140, 16, 110, "#38BDF8"],
            [440, 110, 16, 140, "#38BDF8"],
            [540, 60, 16, 190, "#38BDF8"],
            [640, 160, 16, 90, "#38BDF8"],
          ].map(([x, y, w, h, fill], index) => (
            <rect
              key={index}
              x={Number(x)}
              y={Number(y)}
              width={Number(w)}
              height={Number(h)}
              rx="6"
              fill={String(fill)}
              opacity="0.9"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}