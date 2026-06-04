interface WeeklyForecastChartProps {
  darkMode: boolean;
}

export default function WeeklyForecastChart({
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