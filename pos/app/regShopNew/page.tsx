"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);
// Sri Lanka's 9 provinces — adjust/remove if you operate elsewhere
const PROVINCES = [
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

const BUSINESS_TYPES = ["Retail", "Restaurant", "Grocery", "Pharmacy", "Wholesale", "Other"];

export default function ShopRegisterPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [businessType, setBusinessType] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Require login before showing the form ──────────────────────────
  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setCheckingAuth(false);
    }
    check();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Shop name is required.");
      return;
    }
    if (!province) {
      setError("Please select a province.");
      return;
    }
    if (!district.trim()) {
      setError("District is required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { error: insertErr } = await supabase.from("shops").insert({
        name: trimmedName,
        province,
        district: district.trim(),
        address: address.trim() || null,
        business_type: businessType || null,
        created_by: userId,
      });

      if (insertErr) throw new Error(insertErr.message);

      router.push("/billing");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong while creating your shop.");
    } finally {
      setSaving(false);
    }
  }

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f8fc",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: "#9BA8BF",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Checking your account…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#f7f8fc",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .input-field, .select-field {
          width: 100%; font-family: inherit; font-size: 14px;
          border: 1.5px solid #e8eaf0; border-radius: 12px;
          padding: 13px 16px; outline: none; color: #0B1120;
          background: #fafbff; transition: border-color 0.18s, box-shadow 0.18s;
        }
        .input-field:focus, .select-field:focus {
          border-color: #0A84FF; box-shadow: 0 0 0 3px rgba(10,132,255,0.10); background: #fff;
        }
        .input-field::placeholder { color: #b0baca; }
        .select-field { cursor: pointer; appearance: none; }

        .field-label {
          font-size: 12px; font-weight: 700; color: #6B7A99;
          letter-spacing: 0.06em; text-transform: uppercase;
          display: block; margin-bottom: 7px;
        }

        .submit-btn {
          width: 100%; font-family: inherit; font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px; cursor: pointer;
          transition: opacity 0.18s, transform 0.18s;
          box-shadow: 0 6px 20px rgba(10,132,255,0.30);
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .error-box {
          background: #fff0f0; border: 1px solid rgba(231,76,60,0.2);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #c0392b; font-weight: 500;
        }

        .left-panel { display: flex; }
        @media (max-width: 700px) {
          .left-panel { display: none !important; }
          .right-panel { max-width: 100% !important; }
        }
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div
        className="left-panel"
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #0A84FF, #0055CC)",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div style={{ maxWidth: 380, color: "#fff" }}>
          <div style={{ fontSize: 44, marginBottom: 18 }}>🏬</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Set up your shop
          </h2>
          <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.7 }}>
            Tell us a bit about your business so we can get your POS, inventory, and
            sales dashboard ready for you.
          </p>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Form ══ */}
      <div
        className="right-panel"
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          padding: "48px 40px",
          background: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 20,
                justifyContent: "center",
              }}
            >
              <img
                src="/logo new lokapos.ico"
                alt="LokaPos Lite"
                style={{ width: 40, height: 40, borderRadius: 12 }}
              />
              <span style={{ fontSize: 26, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
                Loka<span style={{ color: "#0A84FF" }}>POS</span> Lite
              </span>
            </div>
            <h1
              style={{
                fontSize: 22,
                textAlign: "center",
                fontWeight: 700,
                color: "#0B1120",
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Register your shop
            </h1>
            <p style={{ fontSize: 13, color: "#9BA8BF", textAlign: "center", fontWeight: 500 }}>
              One last step before you start selling
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && <div className="error-box">⚠️ {error}</div>}

            <div>
              <label className="field-label">Shop Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="e.g. Senanayake Stores"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label className="field-label">Province</label>
                <select
                  className="select-field"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">District</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g. Colombo"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Address (optional)</label>
              <input
                className="input-field"
                type="text"
                placeholder="Street, city"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label">Business Type</label>
              <select
                className="select-field"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                <option value="">Select (optional)</option>
                {BUSINESS_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <button className="submit-btn" type="submit" disabled={saving} style={{ marginTop: 6 }}>
              {saving ? "Creating shop…" : "Create Shop"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}