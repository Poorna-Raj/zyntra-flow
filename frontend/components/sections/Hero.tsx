"use client";

import { CSSProperties } from "react";

const s: Record<string, CSSProperties> = {
  hero: {
    position: "relative",
    minHeight: "100vh",
    backgroundColor: "#050505", // Matched to Features section deep black
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-start",
    paddingTop: 100,
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
  },

  /* Dark mode background glows (More vibrant but lower opacity) */
  blobWrap: { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 },
  blob1: {
    position: "absolute",
    top: -150,
    left: "50%",
    transform: "translateX(-50%)",
    width: "80vw",
    maxWidth: 1200,
    height: 700,
    borderRadius: "50%",
    background: "radial-gradient(ellipse at center, rgba(79, 70, 229, 0.2) 0%, rgba(192, 132, 252, 0.1) 40%, transparent 70%)",
    filter: "blur(60px)",
  },
  blob2: {
    position: "absolute",
    top: 150,
    right: "-15%",
    width: 700,
    height: 700,
    borderRadius: "50%",
    background: "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.15) 0%, transparent 60%)",
    filter: "blur(80px)",
  },

  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
    padding: "2rem 2rem 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },

  /* Dark mode glassmorphic badge */
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(255, 255, 255, 0.05)", // Semi-transparent overlay
    border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle white border
    borderRadius: 999,
    padding: "0.35rem 1rem 0.35rem 0.35rem",
    marginBottom: "2.5rem",
    backdropFilter: "blur(12px)",
  },
  badgeNew: {
    background: "linear-gradient(135deg, #4f46e5, #9333ea)",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 600, 
    padding: "0.3rem 0.8rem",
    borderRadius: 999,
  },
  badgeText: {
    fontSize: "0.9rem",
    fontWeight: 500, 
    color: "#e4e4e7", // Light gray text
  },

  /* Stark white headline for dark mode */
  headline: {
    fontSize: "clamp(2.5rem, 6vw, 4.2rem)",
    fontWeight: 600, 
    color: "#ffffff", // Changed to pure white
    lineHeight: 1.15,
    margin: "0 0 1.5rem",
    maxWidth: 900,
    letterSpacing: "normal", 
  },
  
  /* Gradient pops beautifully against the black */
  headlineAccent: {
    backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8, #c084fc)", // Adjusted to match the AI feature colors
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    display: "inline-block", 
  },

  subtext: {
    fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
    color: "#a1a1aa", // Matched to Features section subtitle
    fontWeight: 400, 
    lineHeight: 1.7,
    maxWidth: 720,
    margin: "0 0 3rem",
  },

  ctas: {
    display: "flex",
    gap: "1.25rem",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "5rem",
  },
  ctaPrimary: {
    color: "#fff",
    textDecoration: "none",
    padding: "0.85rem 2rem",
    borderRadius: 999,
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    boxShadow: "0 8px 20px -4px rgba(124, 58, 237, 0.4)", // Stronger glow on dark mode
    fontWeight: 500, 
    fontSize: "1rem",
    transition: "transform 0.2s",
  },
  ctaSecondary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    padding: "0.85rem 2rem",
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.05)", // Dark mode button background
    border: "1px solid rgba(255, 255, 255, 0.1)", // Subtle outline
    fontWeight: 500, 
    fontSize: "1rem",
    color: "#ffffff", // White text
    transition: "transform 0.2s",
  },

  /* EDGE-TO-EDGE PICTURE HOLDER (Dark Mode Enhancements) */
  dashboardWrap: {
    width: "100%",
    maxWidth: 1080,
    borderRadius: "24px 24px 0 0",
    overflow: "hidden", 
    border: "1px solid rgba(255, 255, 255, 0.08)", // Thin frame so it doesn't bleed into the black background
    boxShadow: "0 0 80px rgba(79, 70, 229, 0.15), 0 30px 60px -12px rgba(0, 0, 0, 0.8)", // Glowing drop shadow
  },
  imageContainer: {
    width: "100%",
    aspectRatio: "16 / 9", 
    display: "block",
    position: "relative",
    background: "#0d0d0d", 
  },
  mockupImage: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover", 
    objectPosition: "center",
    border: "none",
    margin: 0,
    padding: 0,
  }
};

export default function Hero() {
  return (
    <section style={s.hero} id="home">
      <div style={s.blobWrap} aria-hidden="true">
        <div style={s.blob1} />
        <div style={s.blob2} />
      </div>

      <div style={s.container}>
        <div style={s.badge}>
          <span style={s.badgeNew}>Update</span>
          <span style={s.badgeText}>
            Our regional forecasting AI engine is now live →
          </span>
        </div>

        <h1 style={s.headline}>
          Optimize Retail Inventory, <br />
          <span style={s.headlineAccent}>Province by Province</span>
        </h1>

        <p style={s.subtext}>
          Leverage predictive analytics to forecast localized retail demand. Minimize stockouts, eliminate overstocking, and distribute your inventory with precision across every region.
        </p>

        <div style={s.ctas}>
          <a href="#start-forecasting" style={s.ctaPrimary}>
            Start Forecasting
          </a>
          <a href="#demo" style={s.ctaSecondary}>
            Request a Demo
          </a>
        </div>

        {/* EDGE TO EDGE IMAGE HOLDER */}
        <div style={s.dashboardWrap}>
          <div style={s.imageContainer}>
             {/* I put a slightly darker analytics dashboard image here to fit the theme better! */}
            <img 
              src="https://saaspo.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/6399d2d87f63ad4774e11dc2/679368b26b9fa18bbe0ad8ac_Amplemarket---Hero.jpeg" 
              alt="Retail Demand Forecasting Dashboard" 
              style={s.mockupImage} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}