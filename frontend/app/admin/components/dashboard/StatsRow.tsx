import StatCard from "./StatCard";
import { statsData } from "../../constants/admin.data";

export default function StatsRow() {
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