"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = () => {
    if (
      username === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );

      router.push("/admin");
    } else {
      alert(
        "Invalid username or password"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #DFF4FF 0%, #CDEBFF 35%, #B8E3FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "rgba(56,189,248,0.22)",
          filter: "blur(120px)",
          top: "-150px",
          left: "-120px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background:
            "rgba(30,144,255,0.18)",
          filter: "blur(100px)",
          bottom: "-120px",
          right: "-80px",
        }}
      />

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "1250px",
          minHeight: "720px",
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          overflow: "hidden",
          borderRadius: "36px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.32), rgba(30,144,255,0.12))",
          backdropFilter: "blur(20px)",
          border:
            "1px solid rgba(255,255,255,0.45)",
          boxShadow:
            "0 20px 80px rgba(30,144,255,0.18)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* LEFT SIDE */}
        <div
          style={{
            position: "relative",
            padding: "4rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "180px",
              height: "180px",
              borderRadius: "36px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(56,189,248,0.28))",
              top: "70px",
              left: "60px",
              transform:
                "rotate(25deg)",
              backdropFilter:
                "blur(12px)",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "260px",
              height: "260px",
              borderRadius: "50%",
              border:
                "22px solid rgba(255,255,255,0.28)",
              bottom: "-30px",
              left: "-80px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "90px",
              height: "90px",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.45), rgba(255,255,255,0.35))",
              right: "80px",
              bottom: "120px",
              transform:
                "rotate(-20deg)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: "82px",
                height: "82px",
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg, #38BDF8, #1E90FF)",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                fontSize: "2.3rem",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "2rem",
                boxShadow:
                  "0 16px 35px rgba(30,144,255,0.25)",
              }}
            >
              L
            </div>

            <h1
              style={{
                fontSize: "4.5rem",
                fontWeight: 800,
                lineHeight: 1,
                color: "#0F172A",
                marginBottom: "1rem",
              }}
            >
              Loka
              <span
                style={{
                  color: "#1E90FF",
                }}
              >
                lens
              </span>
            </h1>

            <h2
              style={{
                fontSize: "2.1rem",
                fontWeight: 600,
                color: "#334155",
                marginBottom: "2rem",
              }}
            >
              Smart Admin Portal
            </h2>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.9,
                color: "#4A6580",
                maxWidth: "460px",
              }}
            >
              Monitor localized AI
              forecasting, inventory
              intelligence and business
              insights through one
              centralized platform.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "430px",
              background:
                "rgba(255,255,255,0.82)",
              borderRadius: "32px",
              padding: "3rem",
              border:
                "1px solid rgba(255,255,255,0.65)",
            }}
          >
            <div
              style={{
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding:
                    "0.5rem 1rem",
                  borderRadius:
                    "999px",
                  background:
                    "rgba(56,189,248,0.14)",
                  color: "#0284C7",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  marginBottom:
                    "1rem",
                }}
              >
                Secure Login
              </div>

              <h2
                style={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "#0F172A",
                  marginBottom:
                    "0.8rem",
                  lineHeight: 1,
                }}
              >
                Welcome Back
              </h2>

              <p
                style={{
                  color: "#64748B",
                }}
              >
                Sign in to continue to
                the admin dashboard.
              </p>
            </div>

            {/* Username */}
            <div
              style={{
                marginBottom: "1.3rem",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom:
                    "0.55rem",
                  fontWeight: 700,
                }}
              >
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                placeholder="Enter your username"
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius:
                    "18px",
                  border:
                    "1px solid rgba(30,144,255,0.14)",
                  outline: "none",
                }}
              />
            </div>

            {/* Password */}
            <div
              style={{
                marginBottom: "2rem",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom:
                    "0.55rem",
                  fontWeight: 700,
                }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius:
                    "18px",
                  border:
                    "1px solid rgba(30,144,255,0.14)",
                  outline: "none",
                }}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius:
                  "18px",
                border: "none",
                background:
                  "linear-gradient(135deg,#38BDF8,#1E90FF)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Login to Dashboard
            </button>

            <p
              style={{
                marginTop: "1.7rem",
                textAlign: "center",
                color: "#64748B",
                fontSize: "0.85rem",
              }}
            >
              Protected access for
              authorized administrators
              only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}