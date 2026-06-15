interface TopbarProps {
  darkMode: boolean;
}

export default function Topbar({ darkMode }: TopbarProps) {
  const cardBg = darkMode ? "#1E293B" : "#ffffff";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          width: 360,
          background: cardBg,
          borderRadius: 18,
          padding: "0.9rem 1rem",
          border: `1px solid ${borderClr}`,
          color: "#94A3B8",
          transition: "background .3s",
        }}
      >
        🔍 Search forecasts...
      </div>

      {/* Right Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Notification */}
        <button
          className="icon-btn"
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            border: `1px solid ${borderClr}`,
            background: cardBg,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          🔔
        </button>

        {/* Analytics */}
        <button
          className="icon-btn"
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            border: `1px solid ${borderClr}`,
            background: cardBg,
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          📊
        </button>

        {/* Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0.5rem 0.8rem",
            borderRadius: 16,
            border: `1px solid ${borderClr}`,
            background: cardBg,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background:
                "linear-gradient(135deg,#C084FC,#EC4899)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            A
          </div>

          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Admin User
            </p>

            <p
              style={{
                fontSize: 11,
                color: "#94A3B8",
              }}
            >
              Project Manager
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}