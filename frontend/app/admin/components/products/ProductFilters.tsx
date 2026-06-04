import {
  categoryOptions,
  provinceOptions,
  demandOptions,
  sortOptions,
} from "../../constants/admin.data";

interface ProductFiltersProps {
  darkMode: boolean;

  selectedCategory: string;
  setSelectedCategory: (value: string) => void;

  selectedProvince: string;
  setSelectedProvince: (value: string) => void;

  selectedDemand: string;
  setSelectedDemand: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  clearFilters: () => void;
}

export default function ProductFilters({
  darkMode,
  selectedCategory,
  setSelectedCategory,
  selectedProvince,
  setSelectedProvince,
  selectedDemand,
  setSelectedDemand,
  sortBy,
  setSortBy,
  clearFilters,
}: ProductFiltersProps) {
  const cardBg = darkMode ? "#1E293B" : "#FFFFFF";
  const borderClr = darkMode ? "#334155" : "#E2E8F0";
  const mainTxt = darkMode ? "#F1F5F9" : "#1E293B";

  const selectStyle: React.CSSProperties = {
    padding: "12px",
    borderRadius: 12,
    border: `1px solid ${borderClr}`,
    background: cardBg,
    color: mainTxt,
    minWidth: 180,
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        background: cardBg,
        borderRadius: 24,
        padding: "1.5rem",
        border: `1px solid ${borderClr}`,
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            All Categories
          </option>

          {categoryOptions.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        {/* Province */}
        <select
          value={selectedProvince}
          onChange={(e) =>
            setSelectedProvince(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            All Provinces
          </option>

          {provinceOptions.map((province) => (
            <option
              key={province}
              value={province}
            >
              {province}
            </option>
          ))}
        </select>

        {/* Demand */}
        <select
          value={selectedDemand}
          onChange={(e) =>
            setSelectedDemand(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            All Demand Levels
          </option>

          {demandOptions.map((demand) => (
            <option
              key={demand}
              value={demand}
            >
              {demand}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          style={selectStyle}
        >
          <option value="">
            Sort By
          </option>

          {sortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Button */}
        <button
          onClick={clearFilters}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background:
              "linear-gradient(135deg,#EF4444,#DC2626)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}