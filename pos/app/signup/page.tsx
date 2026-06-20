"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import storeBg from "pos\public\TSI-POS-Systems-header-1000x500.jpeg";
import { useRouter } from "next/navigation";




export default function SignUpPage() {
  const router = useRouter();
  const [fullName,   setFullName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [phone,      setPhone]      = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);

  async function handleSignUp(e: React.FormEvent) {
  e.preventDefault();
  setError(null);

  if (password !== confirm) { setError("Passwords do not match."); return; }
  if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }

  setLoading(true);
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName, phone }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    // Save email for OTP page
    sessionStorage.setItem("otp_email", email);
    router.push("/OTP");
  } catch (e: any) {
    setError(e.message ?? "Sign up failed.");
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
          padding: 13px 16px; outline: none; color: #0B1120;
          background: #fafbff; transition: border-color 0.18s, box-shadow 0.18s;
        }
        .input-field:focus { border-color: #0A84FF; box-shadow: 0 0 0 3px rgba(10,132,255,0.10); background: #fff; }
        .input-field::placeholder { color: #b0baca; }

        .signup-btn {
          width: 100%; font-family: inherit; font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px; cursor: pointer;
          transition: opacity 0.18s, transform 0.18s;
          box-shadow: 0 6px 20px rgba(10,132,255,0.30);
        }
        .signup-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .signup-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .show-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #9BA8BF; font-family: inherit; font-size: 12px; font-weight: 600;
        }

        .error-box {
          background: #fff0f0; border: 1px solid rgba(231,76,60,0.2);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #c0392b; font-weight: 500;
        }

        @media (max-width: 700px) {
          .left-panel { display: none !important; }
          .right-panel { max-width: 100% !important; }
        }
      `}</style>

      {/* ══ LEFT PANEL ══ */}
      <div className="left-panel" style={{
        flex: 1,
        backgroundColor: "#0A84FF",
        backgroundImage:  "url('/TSI-POS-Systems-header-1000x500.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 48, position: "relative", overflow: "hidden",
      }}>
    
      </div>

      {/* ══ RIGHT PANEL — Sign Up Form ══ */}
      <div className="right-panel" style={{
        width: "100%", maxWidth: 500,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "23px 40px", background: "#fff",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Header */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 24, justifyContent: "center" }}>
  <img src="/logo new lokapos.ico" alt="LokaPos Lite" style={{ width: 40, height: 40, borderRadius: 12 }} />
  <span style={{ fontSize: 30, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
              Loka<span style={{ color: "#0A84FF" }}>POS</span> Lite
            </span>
</div>
            <h1 style={{ fontSize: 24, textAlign: "center", fontWeight: 600, color: "#0B1120", letterSpacing: "-0.03em", marginBottom: 6, lineHeight: 1.2 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 13, color: "#9BA8BF", fontWeight: 500, lineHeight: 1.6 }}>
              Join with <strong style={{ color: "#0A84FF" }}>LokaPos Lite</strong> and make your day productive.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {error && <div className="error-box">⚠️ {error}</div>}

            {/* Full Name */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: 7 }}>Full Name</label>
              <input className="input-field" type="text" placeholder="John Silva"
                value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: 7 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: 7 }}>Phone Number</label>
              <input className="input-field" type="tel" placeholder="+94 77 123 4567"
                value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className="input-field" type={showPass ? "text" : "password"} placeholder="Min. 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 60 }} />
                  <button type="button" className="show-btn" onClick={() => setShowPass(p => !p)}>
  {showConf ? (
    // Eye-off icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    // Eye icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )}
</button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase" as const, display: "block", marginBottom: 7 }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input className="input-field" type={showConf ? "text" : "password"} placeholder="Re-enter password"
                  value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ paddingRight: 60, borderColor: confirm && confirm !== password ? "#e74c3c" : undefined }} />
                 <button type="button" className="show-btn" onClick={() => setShowPass(p => !p)}>
  {showPass ? (
    // Eye-off icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    // Eye icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )}
</button>
              </div>
              {confirm && confirm !== password && (
                <p style={{ fontSize: 12, color: "#e74c3c", marginTop: 5, fontWeight: 500 }}>Passwords don't match</p>
              )}
            </div>

            {/* Create Account button */}
            <button className="signup-btn" type="submit" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>

            {/* Sign in link */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#9BA8BF", marginTop: 4 }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#0A84FF", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}