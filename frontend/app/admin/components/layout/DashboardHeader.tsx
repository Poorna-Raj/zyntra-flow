interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title = "Dashboard",
  subtitle = "Monitor forecasting analytics, AI insights and regional demand performance in real time.",
}: DashboardHeaderProps) {
  return (
    <div
      style={{
        marginBottom: "2rem",
        animation: "fadeIn .4s ease",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 800,
          marginBottom: "0.8rem",
          color: "inherit",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          color: "#64748B",
          lineHeight: 1.8,
          maxWidth: "700px",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}