"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [name, setName] =
    useState("Admin User");

  const [email, setEmail] =
    useState("admin@lokalens.com");

  const [phone, setPhone] =
    useState("+94 77 123 4567");

  const [role, setRole] =
    useState("Project Manager");

  const [department, setDepartment] =
    useState("Operations");

  const saveProfile = () => {
    localStorage.setItem(
      "profile-name",
      name
    );

    localStorage.setItem(
      "profile-email",
      email
    );

    localStorage.setItem(
      "profile-phone",
      phone
    );

    localStorage.setItem(
      "profile-role",
      role
    );

    localStorage.setItem(
      "profile-department",
      department
    );

    alert(
      "Profile updated successfully!"
    );
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
          👤 My Profile
        </h1>

        <p
          style={{
            color: "#64748B",
            marginTop: 8,
          }}
        >
          Manage your profile information
          and account details.
        </p>
      </div>

      {/* Profile Card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "2rem",
          border: "1px solid #E2E8F0",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.05)",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#38BDF8,#2563EB)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: 800,
            }}
          >
            A
          </div>

          <div>
            <h2
              style={{
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              {name}
            </h2>

            <p
              style={{
                color: "#64748B",
              }}
            >
              {role}
            </p>
          </div>
        </div>

        {/* Form */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "1rem",
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Full Name"
            style={inputStyle}
          />

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="Email"
            style={inputStyle}
          />

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            placeholder="Phone"
            style={inputStyle}
          />

          <input
            type="text"
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
            placeholder="Role"
            style={inputStyle}
          />

          <input
            type="text"
            value={department}
            onChange={(e) =>
              setDepartment(
                e.target.value
              )
            }
            placeholder="Department"
            style={inputStyle}
          />
        </div>

        <button
          onClick={saveProfile}
          style={{
            marginTop: "2rem",
            padding:
              "14px 24px",
            border: "none",
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#38BDF8,#2563EB)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          💾 Save Profile
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties =
{
  width: "100%",
  padding: "14px",
  borderRadius: 12,
  border: "1px solid #CBD5E1",
  outline: "none",
};