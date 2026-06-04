"use client";

import StatsRow from "./components/dashboard/StatsRow";
import WeeklyForecastChart from "./components/dashboard/WeeklyForecastChart";
import TrafficDonutChart from "./components/dashboard/TrafficDonutChart";
import ForecastTable from "./components/dashboard/ForecastTable";
import DashboardHeader from "./components/layout/DashboardHeader";

export default function AdminPage() {
  return (
    <>
      <style>{`
        *,*::before,*::after{
          box-sizing:border-box;
          margin:0;
          padding:0;
        }

        body{
          font-family:'Inter',system-ui,sans-serif;
        }

        .menu-btn:hover{
          background:rgba(56,189,248,0.10)!important;
          color:#0EA5E9!important;
          transform:translateX(5px)!important;
        }

        .menu-btn{
          transition:all .2s ease!important;
        }

        .stat-card:hover{
          transform:translateY(-4px);
          box-shadow:0 20px 40px rgba(0,0,0,.15)!important;
        }

        .stat-card{
          transition:transform .2s, box-shadow .2s;
        }

        .icon-btn:hover{
          transform:scale(1.08);
          filter:brightness(.92);
        }

        .icon-btn{
          transition:all .15s;
          cursor:pointer;
        }

        @keyframes fadeIn {
          from{
            opacity:0;
            transform:translateY(8px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }
      `}</style>

      <DashboardHeader />

      <StatsRow />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <WeeklyForecastChart />

        <TrafficDonutChart />
      </div>

      <ForecastTable />
    </>
  );
}