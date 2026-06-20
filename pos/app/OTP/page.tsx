"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";


const supabaseAdmin = createClient(
  "https://aosbwlhnyaifworwzqks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2J3bGhueWFpZndvcnd6cWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTE4MDU0MiwiZXhwIjoyMDk2NzU2NTQyfQ.ZLOBJWJuhdEnKkJb6c8l6Z7AFzPUyOQi5Z9eEkFYDqc"
);

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(val: string, idx: number) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, idx: number) {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputs.current[5]?.focus();
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Check your Email for the verification code."); return; }
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual OTP verification logic
      const { error: err } = await supabaseAdmin.auth.verifyOtp({
        email: "", // pass email from router state/query
        token: code,
        type: "signup",
      });
      if (err) throw err;
      router.push("/billing");
    } catch (e: any) {
      setError(e.message ?? "Invalid OTP.");
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

        .otp-input {
          width: 48px; height: 56px;
          font-family: inherit; font-size: 22px; font-weight: 800;
          text-align: center; color: #0B1120;
          border: 1.5px solid #e8eaf0; border-radius: 14px;
          background: #fafbff; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          caret-color: #0A84FF;
        }
        .otp-input:focus {
          border-color: #0A84FF;
          box-shadow: 0 0 0 3px rgba(10,132,255,0.12);
          background: #fff;
        }
        .otp-input.filled {
          border-color: #0A84FF;
          background: #f0f6ff;
        }

        .verify-btn {
          width: 100%; font-family: inherit; font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px; cursor: pointer;
          transition: opacity 0.18s, transform 0.18s;
          box-shadow: 0 6px 20px rgba(10,132,255,0.30);
        }
        .verify-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .verify-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .resend-btn {
          background: none; border: none; cursor: pointer;
          color: #0A84FF; font-family: inherit; font-size: 13px; font-weight: 700;
          padding: 0; text-decoration: none;
        }
        .resend-btn:hover { opacity: 0.75; }

        .error-box {
          background: #fff0f0; border: 1px solid rgba(231,76,60,0.2);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #c0392b; font-weight: 500;
        }

        @media (max-width: 700px) {
          .left-panel { display: none !important; }
          .right-panel { max-width: 100% !important; border-radius: 0 !important; }
        }
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div className="left-panel" style={{
        flex: 1,
        backgroundImage: "url('/TSI-POS-Systems-header-1000x500.jpeg')", // your image here
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }} />

      {/* ══ RIGHT PANEL ══ */}
      <div className="right-panel" style={{
        width: "100%", maxWidth: 480,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 40px", background: "#fff",
      }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 32 }}>
            <img src="/logo new lokapos.ico" alt="LokaPos Lite" style={{ width: 40, height: 40, borderRadius: 12 }} />
            <span style={{ fontSize: 30, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
              Loka<span style={{ color: "#0A84FF" }}>POS</span> Lite
            </span>
          </div>

          {/* Shield icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "linear-gradient(135deg, #e8f3ff, #c8e0ff)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 34,
            }}>🔐</div>
          </div>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.03em", marginBottom: 8 }}>
              Verify Your Email
            </h1>
            <p style={{ fontSize: 13, color: "#9BA8BF", fontWeight: 500, lineHeight: 1.6 }}>
              We sent a verification link to your email.<br />
              <strong style={{ color: "#0A84FF" }}>better security</strong> with{" "}
              <strong style={{ color: "#0B1120" }}>Loka<span style={{ color: "#0A84FF" }}>POS</span> Lite</strong>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {error && <div className="error-box">⚠️ {error}</div>}

            

           {/* Open Gmail button */}
<button
  type="button"
  onClick={() => window.open("https://mail.google.com", "_blank")}
  style={{ 
    width: "100%", 
    padding: "12px",
    borderRadius: "12px",
    border: "1.5px solid #e8eaf0",
    background: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#0B1120",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "8px",
  }}
>
  <img 
    src="https://www.google.com/favicon.ico" 
    width={16} 
    height={16} 
  />
  Open Gmail
</button>

{/* Verify button */}
<button className="verify-btn" type="submit" disabled={loading}>
  {loading ? "Verifying…" : "Verify OTP"}
</button>

            {/* Resend + login link */}
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#9BA8BF", marginBottom: 8 }}>
                Didn't receive the code?{" "}
                <button type="button" className="resend-btn">Resend OTP</button>
              </p>
              <p style={{ fontSize: 13, color: "#9BA8BF" }}>
                Already have an account?{" "}
                <a href="/login" style={{ color: "#0A84FF", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}