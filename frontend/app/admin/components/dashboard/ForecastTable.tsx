import { activityData } from "../../constants/activity.data";

interface ForecastTableProps {
  darkMode: boolean;
}

export default function ForecastTable({
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