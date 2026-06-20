"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import storeBg from "pos\public\TSI-POS-Systems-header-1000x500.jpeg";

const supabaseAdmin = createClient(
  "https://qpkznmugehwiiewoznfy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwa3pubXVnZWh3aWlld296bmZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDMyMjQxNiwiZXhwIjoyMDk1ODk4NDE2fQ.0zoKp3UnCtroxmsBlFDStqARokm9mhvWbTIh3gToPGk"
);

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await supabaseAdmin.auth.signInWithPassword({ email, password });
      if (err) throw err;
      router.push("/billing");
    } catch (e: any) {
      setError(e.message ?? "Sign in failed.");
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

        .login-btn {
          width: 100%; font-family: inherit; font-size: 15px; font-weight: 700;
          background: linear-gradient(135deg, #0A84FF, #0055CC);
          color: #fff; border: none; border-radius: 12px;
          padding: 14px; cursor: pointer;
          transition: opacity 0.18s, transform 0.18s;
          box-shadow: 0 6px 20px rgba(10,132,255,0.30);
        }
        .login-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.55; cursor: not-allowed; }

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

        /* Left panel responsive hide */
        @media (max-width: 700px) {
          .left-panel { display: none !important; }
          .right-panel { border-radius: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      {/* ══ LEFT PANEL — Illustration ══ */}
     <div className="left-panel" style={{
  flex: 1,
  backgroundImage: "url('/TSI-POS-Systems-header-1000x500.jpeg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh",
      }}>
        

      
      </div>

      {/* ══ RIGHT PANEL — Login Form ══ */}
      <div className="right-panel" style={{
        width: "100%", maxWidth: 480,
        display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center",
        padding: "48px 40px", background: "#fff",
      }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Header */}
           <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 24, justifyContent: "center" }}>
  <img src="/logo new lokapos.ico" alt="LokaPos Lite" style={{ width: 40, height: 40, borderRadius: 12 }} />
  <span style={{ fontSize: 30, fontWeight: 800, color: "#0B1120", letterSpacing: "-0.02em" }}>
              Loka<span style={{ color: "#0A84FF" }}>POS</span> Lite
            </span>
</div>
            <h1 style={{ fontSize: 26, textAlign: "center", fontWeight: 500, color: "#0B1120", letterSpacing: "-0.03em", marginBottom: 8, lineHeight: 1.2 }}>
              Welcome👋
            </h1>
            <p style={{ fontSize: 14, color: "#9BA8BF", fontWeight: 500, lineHeight: 1.6 }}>
              Join with LokaPos Lite and make your day productive.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && <div className="error-box">⚠️ {error}</div>}

            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Email</label>
              <input className="input-field" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#6B7A99", letterSpacing: "0.06em", textTransform: "uppercase" }}>Password</label>
                <a href="#" style={{ fontSize: 12, fontWeight: 600, color: "#0A84FF", textDecoration: "none" }}>Forgot password?</a>
              </div>
              <div style={{ position: "relative" }}>
                <input className="input-field" type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 60 }} />
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
            </div>

            {/* Login button */}
            <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Signing in…" : "Log In"}
            </button>

            {/* Sign up link */}
            <p style={{ textAlign: "center", fontSize: 13, color: "#9BA8BF", marginTop: 4 }}>
              Don't have an account?{" "}
              <a href="/signup" style={{ color: "#0A84FF", fontWeight: 700, textDecoration: "none" }}>Sign up</a>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}