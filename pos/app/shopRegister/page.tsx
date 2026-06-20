"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import storeBg from "pos\public\TSI-POS-Systems-header-1000x500.jpeg";

const supabaseAdmin = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);
const SRI_LANKA_DISTRICTS = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha",
  "Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala",
  "Mannar","Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya","Polonnaruwa",
  "Puttalam","Ratnapura","Trincomalee","Vavuniya",
];

const PROVINCES = [
  "Central","Eastern","North Central","Northern","North Western",
  "Sabaragamuwa","Southern","Uva","Western",
];

const BUSINESS_TYPES = [
  "Grocery / Supermarket"
];

export default function CreateShopPage() {
  const router = useRouter();
  const [shopName,     setShopName]     = useState("");
  const [district,     setDistrict]     = useState("");
  const [province,     setProvince]     = useState("");
  const [address,      setAddress]      = useState("");
  const [businessType, setBusinessType] = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: { user } } = await supabaseAdmin.auth.getUser();
      if (!user) throw new Error("Not authenticated.");

      const { error: err } = await supabaseAdmin.from("shops").insert({
        created_by:      user.id,
        name:          shopName,
        district,
        province,
        address,
        business_type: businessType,
      });
      if (err) throw err;
      router.push("/billing");
    } catch (e: any) {
      setError(e.message ?? "Failed to create shop.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: "#f7f8fc",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .input-field {
          width: 100%; font-family: inherit; font-size: 14px;
          border: 1.5px solid #e8eaf0; border-radius: 12px;
          padding: 11px 16px; outline: none; color: #0B1120;
          background: #fafbff; transition: border-color 0.18s, box-shadow 0.18s;
          appearance: none;
        }
        .input-field:focus {
          border-color: #0A84FF;
          box-shadow: 0 0 0 3px rgba(10,132,255,0.10);
          background: #fff;
        }
        .input-field::placeholder { color: #b0baca; }

        select.input-field {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239BA8BF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
          cursor: pointer;
        }

        .create-btn {
          width: 100%; font-family: inherit; font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; border: none; border-radius: 12px;
          padding: 13px; cursor: pointer;
          transition: opacity 0.18s, transform 0.18s;
          box-shadow: 0 6px 20px rgba(10,132,255,0.28);
        }
        .create-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .create-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .error-box {
          background: #fff0f0; border: 1px solid rgba(231,76,60,0.2);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #c0392b; font-weight: 500;
        }

        label.field-label {
          font-size: 12px; font-weight: 700; color: #6B7A99;
          letter-spacing: 0.06em; text-transform: uppercase;
          display: block; margin-bottom: 6px;
        }

        @media (max-width: 700px) {
          .right-panel { display: none !important; }
          .left-panel  { max-width: 100% !important; }
        }
      `}</style>

      {/* ══ LEFT PANEL — Form ══ */}
      <div className="left-panel" style={{
        width: "100%", maxWidth: 500,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 40px", background: "#fff",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
            <img src="/logo new lokapos.ico" alt="LokaPos Lite" style={{ width: 40, height: 40, borderRadius: 12 }} />
            <span style={{ fontSize: 17, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
              Loka<span style={{ color: "#0A84FF" }}>POS</span> Lite
            </span>
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.03em", marginBottom: 6 }}>
              Create a Shop
            </h1>
            <p style={{ fontSize: 13, color: "#9BA8BF", fontWeight: 500, lineHeight: 1.6 }}>
              Set up your shop with{" "}
              <strong style={{ color: "#0A84FF" }}>Loka<span style={{ color: "#0055CC" }}>POS</span> Lite</strong>{" "}
              and make your shop profitable
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {error && <div className="error-box">⚠️ {error}</div>}

            {/* Shop Name */}
            <div>
              <label className="field-label">Shop Name</label>
              <input className="input-field" type="text" placeholder="e.g. Silva Grocery"
                value={shopName} onChange={e => setShopName(e.target.value)} required />
            </div>

            {/* District */}
            <div>
              <label className="field-label">District</label>
              <select className="input-field" value={district}
                onChange={e => setDistrict(e.target.value)} required>
                <option value="" disabled>Select district</option>
                {SRI_LANKA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div>
              <label className="field-label">Province</label>
              <select className="input-field" value={province}
                onChange={e => setProvince(e.target.value)} required>
                <option value="" disabled>Select province</option>
                {PROVINCES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="field-label">Address</label>
              <input className="input-field" type="text" placeholder="No. 12, Main Street, Colombo"
                value={address} onChange={e => setAddress(e.target.value)} required />
            </div>

            {/* Business Type */}
            <div>
              <label className="field-label">Business Type</label>
              <select className="input-field" value={businessType}
                onChange={e => setBusinessType(e.target.value)} required>
                <option value="" disabled>Select business type</option>
                {BUSINESS_TYPES.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Create Shop button */}
            <button className="create-btn" type="submit" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? "Creating shop…" : "Create Shop"}
            </button>

            {/* Sign in link */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#9BA8BF", marginTop: 2 }}>
              Already have a shop?{" "}
              <a href="/login" style={{ color: "#0A84FF", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
            </p>
          </form>

        </div>
      </div>

      {/* ══ RIGHT PANEL — Image ══ */}
      <div className="right-panel" style={{
        flex: 1,
        backgroundImage: "url('/TSI-POS-Systems-header-1000x500.jpeg')", // 👈 your image here
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }} />

    </div>
  );
}