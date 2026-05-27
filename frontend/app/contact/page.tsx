"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: i * 0.08,
    },
  }),
};

const infoItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "hello@lokalens.io",
    href: "mailto:hello@lokalens.io",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: "Location",
    value: "Colombo, Sri Lanka",
    href: null,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "linear-gradient(160deg, #f0f6ff 0%, #ffffff 50%, #eaf3ff 100%)",
        minHeight: "100vh",
        color: "#0B1120",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .contact-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(10,132,255,0.15);
          background: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #0B1120;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .contact-input::placeholder { color: #A0AABF; font-weight: 400; }
        .contact-input:focus {
          border-color: #0A84FF;
          box-shadow: 0 0 0 3px rgba(10,132,255,0.1);
        }

        .contact-label {
          display: block;
          font-size: 12.5px;
          font-weight: 600;
          color: #4A5568;
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #0A84FF;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(10,132,255,0.35);
        }
        .submit-btn:hover:not(:disabled) {
          background: #0070e0;
          box-shadow: 0 6px 24px rgba(10,132,255,0.45);
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .info-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: #fff;
          border-radius: 14px;
          border: 1px solid rgba(10,132,255,0.1);
          box-shadow: 0 2px 12px rgba(10,132,255,0.05);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .info-card:hover {
          box-shadow: 0 6px 24px rgba(10,132,255,0.1);
          transform: translateY(-2px);
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 100px;
          background: rgba(10,132,255,0.08);
          color: #0A84FF;
        }
        .chip-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #0A84FF;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>

      <Navbar />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "120px 24px 96px" }}>

        {/* Header */}
        <motion.div
          variants={fadeUp} custom={0} initial="hidden" animate="show"
          style={{ marginBottom: 56 }}
        >
          <div className="chip" style={{ marginBottom: 20 }}>
            <span className="chip-dot" />
            Get In Touch
          </div>
          <h1
            style={{
              fontSize: "clamp(38px, 5.5vw, 60px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "#0B1120",
              marginBottom: 16,
            }}
          >
            We'd love to{" "}
            <span style={{ color: "#0A84FF" }}>hear from you.</span>
          </h1>
          <p style={{ fontSize: 16, fontWeight: 400, color: "#6B7A99", lineHeight: 1.65, maxWidth: 480 }}>
            Whether you're an SME exploring smarter stocking decisions or a developer interested in our forecasting API — reach out anytime.
          </p>
        </motion.div>

        <div className="contact-grid">

          {/* LEFT — Form */}
          <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: "1px solid rgba(10,132,255,0.12)",
                  boxShadow: "0 4px 24px rgba(10,132,255,0.08)",
                  padding: "56px 40px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 64, height: 64,
                    borderRadius: "50%",
                    background: "rgba(10,132,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                    color: "#0A84FF",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0B1120", marginBottom: 10, letterSpacing: "-0.02em" }}>
                  Message Sent!
                </h3>
                <p style={{ fontSize: 14.5, color: "#6B7A99", lineHeight: 1.65 }}>
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 20,
                  border: "1px solid rgba(10,132,255,0.1)",
                  boxShadow: "0 4px 24px rgba(10,132,255,0.06)",
                  padding: "36px 36px 32px",
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0B1120", marginBottom: 24, letterSpacing: "-0.02em" }}>
                  Send a Message
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {/* Name + Email */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <label className="contact-label">Full Name</label>
                      <input
                        className="contact-input"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ashan Perera"
                      />
                    </div>
                    <div>
                      <label className="contact-label">Email Address</label>
                      <input
                        className="contact-input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ashan@gmail.com"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="contact-label">Subject</label>
                    <select
                      className="contact-input"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">Select a topic...</option>
                      <option value="early-access">Early Access Request</option>
                      <option value="forecasting">Demand Forecasting Inquiry</option>
                      <option value="api">API Integration</option>
                      <option value="partnership">Partnership</option>
                      <option value="support">General Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="contact-label">Message</label>
                    <textarea
                      className="contact-input"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your business or what you're looking for..."
                      rows={5}
                      style={{ resize: "none" }}
                    />
                  </div>

                  <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={loading || !form.name || !form.email || !form.message}
                  >
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div
            variants={fadeUp} custom={2} initial="hidden" animate="show"
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0B1120", marginBottom: 8, letterSpacing: "-0.02em" }}>
                Contact Information
              </h2>
              <p style={{ fontSize: 14, color: "#6B7A99", lineHeight: 1.65 }}>
                Our team is based in Sri Lanka and actively building Lokalens for SMEs across all 9 provinces.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {infoItems.map((item) => (
                <div key={item.label} className="info-card">
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: "rgba(10,132,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#0A84FF", flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9BA8BF", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 3 }}>
                      {item.label}
                    </div>
                    {item.href ? (
                      <a href={item.href} style={{ fontSize: 14.5, fontWeight: 600, color: "#0B1120", textDecoration: "none" }}>
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: "#0B1120" }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Province tag strip */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid rgba(10,132,255,0.1)",
                padding: "22px 20px",
                boxShadow: "0 2px 12px rgba(10,132,255,0.05)",
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 700, color: "#9BA8BF", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Serving All Provinces
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Western", "Central", "Southern", "Northern", "Eastern", "North Western", "North Central", "Uva", "Sabaragamuwa"].map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: 12, fontWeight: 600,
                      padding: "5px 11px", borderRadius: 100,
                      background: "rgba(10,132,255,0.07)",
                      color: "#0A84FF",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Backed by strip */}
            <div
              style={{
                background: "linear-gradient(135deg, #0A84FF 0%, #0066d6 100%)",
                borderRadius: 16,
                padding: "22px 24px",
                color: "#fff",
                boxShadow: "0 8px 28px rgba(10,132,255,0.28)",
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 700, opacity: 0.75, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Backed by
              </p>
              <p style={{ fontSize: 16, fontWeight: 800 }}>SDGP 2025 · IIT Sri Lanka</p>
              <p style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
                AI-Powered Retail Forecasting Platform
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <Footer />
    </div>
  );
}