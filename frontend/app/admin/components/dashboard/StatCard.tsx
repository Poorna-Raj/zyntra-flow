import { StatCardData } from "../../types/admin.types";

interface StatCardProps {
  stat: StatCardData;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div
      className="stat-card"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: "2rem",
        background: stat.gradient,
        color: "#fff",
        minHeight: 200,
      }}
    >
      {/* Background Circles */}
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          top: -50,
          right: -40,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
          bottom: -70,
          right: 40,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            opacity: 0.95,
          }}
        >
          {stat.title}
        </p>

        <span
          style={{
            fontSize: "1.4rem",
          }}
        >
          {stat.icon}
        </span>
      </div>

      <h2
        style={{
          fontSize: "2.8rem",
          fontWeight: 800,
          marginBottom: "1rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {stat.value}
      </h2>

      <p
        style={{
          fontSize: "0.95rem",
          opacity: 0.95,
          position: "relative",
          zIndex: 2,
        }}
      >
        {stat.growth}
      </p>
    </div>
  );
}