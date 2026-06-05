import { usePathname, useRouter } from "next/navigation";
import { MenuItem } from "../../types/admin.types";
import { menuData } from "../../constants/admin.data";


interface SidebarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
  onLogout: () => void;
}
interface SidebarBottomBarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
}

function SidebarBottomBar({
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
      <button
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
            }}
          />
        </div>
      </button>

      <button
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

export default function Sidebar({
  darkMode,
  setDarkMode,
  activeMenu,
  setActiveMenu,
  onLogout,
}: SidebarProps) {

  const router = useRouter();
  const pathname = usePathname();

  const sideBg = darkMode ? "#1E293B" : "#ffffff";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";
  const borderClr = darkMode ? "#334155" : "#ECEAF3";

  return (
    <aside
      style={{
        width: 260,
        background: sideBg,
        borderRight: `1px solid ${borderClr}`,
        padding: "2rem 1.4rem",
        display: "flex",
        flexDirection: "column",
        transition: "background .3s",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.8rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#38BDF8,#1E90FF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: "1.1rem",
            boxShadow:
              "0 8px 20px rgba(56,189,248,0.35)",
          }}
        >
          L
        </div>

        <div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              lineHeight: 1,
              color: mainTxt,
            }}
          >
            Loka
            <span style={{ color: "#38BDF8" }}>
              lens
            </span>
          </h1>

          <p
            style={{
              fontSize: "0.75rem",
              color: "#94A3B8",
              marginTop: "0.2rem",
            }}
          >
            AI Forecast Platform
          </p>
        </div>
      </div>

      {/* User Card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          padding: "1rem",
          borderRadius: 16,
          background: darkMode
            ? "rgba(56,189,248,0.06)"
            : "rgba(56,189,248,0.04)",
          border: `1px solid ${
            darkMode
              ? "rgba(56,189,248,0.15)"
              : borderClr
          }`,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#C084FC,#EC4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          A
        </div>

        <div>
          <h3
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: mainTxt,
            }}
          >
            Admin User
          </h3>

          <p
            style={{
              fontSize: "0.78rem",
              color: "#94A3B8",
            }}
          >
            Project Manager
          </p>
        </div>
      </div>

      {/* Menu */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flex: 1,
        }}
      >
        {menuData.map((item: MenuItem) => (
          <button
            key={item.label}
            className="menu-btn"
            onClick={() => {
            setActiveMenu(item.label);
            router.push(item.path);
            }}
            style={{
              padding: "0.85rem 1rem",
              borderRadius: 16,
              background:
            pathname === item.path
            ? "rgba(56,189,248,0.10)"
            : "transparent",
              border:
            pathname === item.path
            ? "1px solid rgba(56,189,248,0.22)"
             : "1px solid transparent",
             color:
            pathname === item.path
            ? "#0EA5E9"
                  : darkMode
                  ? "#94A3B8"
                  : "#334155",
              fontWeight: 600,
              fontSize: "0.95rem",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* AI Box */}
      <div
        style={{
          margin: "1.5rem 0",
          padding: "1.4rem",
          borderRadius: 20,
          background:
            "linear-gradient(135deg,#38BDF8,#1E90FF)",
          color: "#fff",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            marginBottom: "0.6rem",
          }}
        >
          AI Forecast Engine
        </h3>

        <p
          style={{
            fontSize: "0.82rem",
            lineHeight: 1.7,
            opacity: 0.9,
            marginBottom: "0.9rem",
          }}
        >
          AI-powered forecasting system
          currently monitoring regional
          demand patterns.
        </p>

        <button
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: 12,
            border: "none",
            background: "#fff",
            color: "#1E90FF",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          View Analytics
        </button>
      </div>

      {/* Bottom Bar */}
      <SidebarBottomBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={onLogout}
      />
    </aside>
  );
}