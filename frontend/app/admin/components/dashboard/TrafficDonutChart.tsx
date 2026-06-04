interface TrafficDonutChartProps {
  darkMode: boolean;
}

export default function TrafficDonutChart({
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