interface ForecastFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  selectedProvince: string;
  setSelectedProvince: (
    value: string
  ) => void;

  clearFilters: () => void;

  darkMode?: boolean;
}

const provinces = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

export default function ForecastFilters({
  searchTerm,
  setSearchTerm,
  selectedProvince,
  setSelectedProvince,
  clearFilters,
  darkMode = false,
}: ForecastFiltersProps) {
  const cardBg = darkMode
    ? "#1E293B"
    : "#FFFFFF";

  const borderClr = darkMode
    ? "#334155"
    : "#E2E8F0";

  const mainTxt = darkMode
    ? "#F1F5F9"
    : "#1E293B";

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${borderClr}`,
        borderRadius: 24,
        padding: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search forecast..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          style={{
            flex: 1,
            minWidth: 250,
            padding: "12px",
            borderRadius: 12,
            border: `1px solid ${borderClr}`,
            color: mainTxt,
            outline: "none",
          }}
        />

        {/* Province Filter */}
        <select
          value={selectedProvince}
          onChange={(e) =>
            setSelectedProvince(
              e.target.value
            )
          }
          style={{
            padding: "12px",
            borderRadius: 12,
            border: `1px solid ${borderClr}`,
            minWidth: 220,
            color: mainTxt,
            outline: "none",
          }}
        >
          <option value="">
            All Provinces
          </option>

          {provinces.map(
            (province) => (
              <option
                key={province}
                value={province}
              >
                {province}
              </option>
            )
          )}
        </select>

        {/* Clear */}
        <button
          onClick={clearFilters}
          style={{
            padding:
              "12px 18px",
            borderRadius: 12,
            border: "none",
            background:
              "#EF4444",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}