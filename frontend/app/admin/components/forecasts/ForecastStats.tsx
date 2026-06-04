import { Forecast } from "../../types/forecast.types";

interface ForecastStatsProps {
  forecasts: Forecast[];
}

export default function ForecastStats({
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