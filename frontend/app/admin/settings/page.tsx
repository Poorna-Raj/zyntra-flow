"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [companyName, setCompanyName] =
    useState("LokaLens");

  const [notifications, setNotifications] =
    useState(true);

  const [autoRefresh, setAutoRefresh] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const saveSettings = () => {
    localStorage.setItem(
      "company-name",
      companyName
    );

    localStorage.setItem(
      "notifications",
      JSON.stringify(notifications)
    );

    localStorage.setItem(
      "auto-refresh",
      JSON.stringify(autoRefresh)
    );

    localStorage.setItem(
      "settings-dark-mode",
      JSON.stringify(darkMode)
    );

    alert(
      "Settings saved successfully!"
    );
  };

  const cardStyle: React.CSSProperties =
    {
      background: "#FFFFFF",
      borderRadius: 24,
      padding: "1.5rem",
      border: "1px solid #E2E8F0",
      boxShadow:
        "0 10px 25px rgba(0,0,0,0.05)",
    };

  return (
    <div
      style={{
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#1E293B",
          }}
        >
          ⚙️ Settings
        </h1>

        <p
          style={{
            color: "#64748B",
            marginTop: 8,
          }}
        >
          Configure your application
          preferences and system
          settings.
        </p>
      </div>

      {/* Settings Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Company */}
        <div style={cardStyle}>
          <h2
            style={{
              marginBottom: "1rem",
            }}
          >
            🏢 Company Information
          </h2>

          <input
            type="text"
            value={companyName}
            onChange={(e) =>
              setCompanyName(
                e.target.value
              )
            }
            placeholder="Company Name"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border:
                "1px solid #CBD5E1",
            }}
          />
        </div>

        {/* Notifications */}
        <div style={cardStyle}>
          <h2
            style={{
              marginBottom: "1rem",
            }}
          >
            🔔 Notifications
          </h2>

          <label
            style={{
              display: "block",
              marginBottom:
                "1rem",
            }}
          >
            <input
              type="checkbox"
              checked={
                notifications
              }
              onChange={() =>
                setNotifications(
                  !notifications
                )
              }
            />{" "}
            Enable Notifications
          </label>

          <label>
            <input
              type="checkbox"
              checked={
                autoRefresh
              }
              onChange={() =>
                setAutoRefresh(
                  !autoRefresh
                )
              }
            />{" "}
            Auto Refresh Dashboard
          </label>
        </div>

        {/* Appearance */}
        <div style={cardStyle}>
          <h2
            style={{
              marginBottom: "1rem",
            }}
          >
            🎨 Appearance
          </h2>

          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() =>
                setDarkMode(
                  !darkMode
                )
              }
            />{" "}
            Enable Dark Mode
          </label>
        </div>

        {/* Security */}
        <div style={cardStyle}>
          <h2
            style={{
              marginBottom: "1rem",
            }}
          >
            🔒 Security
          </h2>

          <p
            style={{
              color: "#64748B",
            }}
          >
            Password and account
            security settings will be
            available in future
            updates.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        style={{
          padding: "14px 24px",
          border: "none",
          borderRadius: 14,
          background:
            "linear-gradient(135deg,#38BDF8,#2563EB)",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        💾 Save Settings
      </button>
    </div>
  );
}