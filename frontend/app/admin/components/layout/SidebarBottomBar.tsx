interface SidebarBottomBarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
}

export default function SidebarBottomBar({
  darkMode,
  setDarkMode,
  onLogout,
}: SidebarBottomBarProps) {
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";

  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: `1px solid ${
          darkMode ? "rgba(56,189,248,0.2)" : borderClr
        }`,
        background: darkMode
          ? "rgba(255,255,255,0.04)"
          : "rgba(248,250,252,0.8)",
      }}
    >
      {/* Dark Mode Toggle */}
      <button
        className="bottom-action"
        onClick={() => setDarkMode((prev) => !prev)}
        style={{
          width: "100%",
          padding: "13px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${
            darkMode
              ? "rgba(255,255,255,0.06)"
              : borderClr
          }`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: darkMode
                ? "rgba(251,191,36,0.15)"
                : "rgba(56,189,248,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </div>

          <div style={{ textAlign: "left" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: mainTxt,
              }}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </p>

            <p
              style={{
                fontSize: 11,
                color: "#94A3B8",
              }}
            >
              {darkMode
                ? "Switch to light"
                : "Switch to dark"}
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div
          style={{
            width: 44,
            height: 24,
            borderRadius: 99,
            background: darkMode
              ? "linear-gradient(135deg,#38BDF8,#2563EB)"
              : "#CBD5E1",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 3,
              left: darkMode ? 20 : 3,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fff",
              transition: "left .25s",
              boxShadow:
                "0 1px 4px rgba(0,0,0,.2)",
            }}
          />
        </div>
      </button>

      {/* Logout */}
      <button
        className="bottom-action logout-btn"
        onClick={onLogout}
        style={{
          width: "100%",
          padding: "13px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(239,68,68,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          🚪
        </div>

        <div style={{ textAlign: "left" }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ef4444",
            }}
          >
            Logout
          </p>

          <p
            style={{
              fontSize: 11,
              color: "#94A3B8",
            }}
          >
            Sign out of account
          </p>
        </div>
      </button>
    </div>
  );
}