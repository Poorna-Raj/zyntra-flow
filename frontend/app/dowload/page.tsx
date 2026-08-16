"use client";

import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

export default function DownloadsPage() {
  return (
    <div className="download-page">
      <style>{`
        .download-page {
          background-color: #000000;
          color: #ffffff;
          font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          min-height: 100vh;
        }

        .download-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 8rem 1rem 10rem 1rem;
        }

        /* =========================================
           HERO HEADER
           ========================================= */
        .download-hero {
          max-width: 800px;
          margin-bottom: 6rem;
        }

        .section-subtitle {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #a1a1aa;
          font-size: 1.1rem;
          margin-bottom: 1rem;
          display: block;
        }

        .section-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }

        .hero-desc {
          color: #a1a1aa;
          font-size: 1.15rem;
          line-height: 1.6;
        }

        /* =========================================
           HIGHLIGHTED APP: LITE WEB (MAIN TIER)
           ========================================= */
        .featured-tier {
          background: radial-gradient(circle at top left, rgba(92, 163, 103, 0.08), transparent 60%);
          border: 1px solid rgba(92, 163, 103, 0.35);
          border-radius: 28px;
          padding: 3rem;
          margin-bottom: 4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 3rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .featured-content {
          max-width: 600px;
        }

        .featured-badge {
          background-color: #f1f7f2;
          color: #5ca367;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 1.25rem;
        }

        .featured-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .featured-desc {
          color: #a1a1aa;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .featured-specs {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .spec-item {
          font-size: 0.9rem;
          color: #71717a;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spec-icon {
          color: #5ca367;
          font-weight: bold;
        }

        .featured-price-block {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1.25rem;
          min-width: 240px;
        }

        .price-label {
          font-size: 0.85rem;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .price-amount {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1;
        }

        .price-currency {
          font-size: 1.5rem;
          font-weight: 600;
          color: #5ca367;
          margin-right: 0.25rem;
        }

        .btn-launch {
          background-color: #5ca367;
          color: #ffffff;
          padding: 1rem 2.25rem;
          border-radius: 14px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.2s ease;
          display: inline-block;
          text-align: center;
          box-shadow: 0 4px 14px rgba(92, 163, 103, 0.3);
        }

        .btn-launch:hover {
          background-color: #4b8954;
          transform: translateY(-2px);
        }

        /* =========================================
           DESKTOP SUITE GRID (3 Columns)
           ========================================= */
        .desktop-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 8rem;
        }

        .desktop-card {
          background-color: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .desktop-card:hover {
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        .card-top {
          margin-bottom: 2.5rem;
        }

        .card-badge {
          background-color: rgba(255, 255, 255, 0.06);
          color: #a1a1aa;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.3rem 0.7rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 1.25rem;
        }

        .card-badge.coming-soon {
          background-color: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }

        .card-desc {
          color: #71717a;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .card-bullets {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .bullet-item {
          font-size: 0.85rem;
          color: #a1a1aa;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          line-height: 1.4;
        }

        .bullet-dot {
          color: #5ca367;
          flex-shrink: 0;
        }

        .card-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-price {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
        }

        .price-period {
          font-size: 0.85rem;
          color: #71717a;
          font-weight: 400;
        }

        .btn-download {
          width: 100%;
          height: 44px;
          background-color: transparent;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .btn-download:hover {
          background-color: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        .btn-download.disabled {
          background-color: rgba(255, 255, 255, 0.02);
          color: #52525b;
          border-color: rgba(255, 255, 255, 0.03);
          cursor: not-allowed;
        }

        /* =========================================
           RESPONSIVE DESIGN
           ========================================= */
        @media (max-width: 1000px) {
          .featured-tier {
            flex-direction: column;
            align-items: flex-start;
            padding: 2.5rem;
          }

          .featured-price-block {
            text-align: left;
            align-items: flex-start;
            width: 100%;
          }

          .desktop-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>

      <Navbar />

      <div className="download-container">
        
        {/* =========================================
            HERO HEADER
            ========================================= */}
        <div className="download-hero">
          <span className="section-subtitle">System Terminals</span>
          <h1 className="section-title">Deploy Lokalens to Your Counter</h1>
          <p className="hero-desc">
            Equip your grocery counter with the optimal retail solution. Run our lightweight cloud POS instantly in your browser, or install robust native desktop runtimes designed to survive regional internet drops.
          </p>
        </div>

        {/* =========================================
            MAIN HIGHLIGHT: LITE WEB (FREE)
            ========================================= */}
        <div className="featured-tier">
          <div className="featured-content">
            <span className="featured-badge">Highly Recommended</span>
            <h2 className="featured-title">Lokalens Lite Web</h2>
            <p className="featured-desc">
              Our standard browser-based deployment. Instantly initialize inventory files, record sales transactions, and configure SKUs from any device without complex installations. Perfect for fast setup on modern registers.
            </p>
            <div className="featured-specs">
              <div className="spec-item">
                <span className="spec-icon">✓</span> Basic Grocery POS
              </div>
              <div className="spec-item">
                <span className="spec-icon">✓</span> Zero Installation Required
              </div>
              <div className="spec-item">
                <span className="spec-icon">✓</span> Direct Thermal Receipt Printing
              </div>
            </div>
          </div>
          <div className="featured-price-block">
            <div>
              <span className="price-label">Monthly License</span>
              <div className="price-amount">
                <span className="price-currency">LKR</span>0
              </div>
            </div>
            <a href="http://localhost:3001/auth/login" className="btn-launch">
              Launch Web App
            </a>
          </div>
        </div>

        {/* =========================================
           DESKTOP SUITE GRID
           ========================================= */}
        <div className="desktop-grid">
          
          {/* Tier 1: Lite Desktop (Coming Soon) */}
          <div className="desktop-card">
            <div className="card-top">
              <span className="card-badge coming-soon">Coming Soon</span>
              <h3 className="card-title">Lite Desktop</h3>
              <p className="card-desc">
                A localized native application designed specifically for areas with volatile connectivity.
              </p>
              <ul className="card-bullets">
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Offline Local Storage:</strong> Transactions log directly to native disk database during WiFi blackouts.</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Automatic Sync:</strong> Silently backs up records to the cloud the moment internet is restored.</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Local Device Backup:</strong> No risk of structural cash leak records dropping.</span>
                </li>
              </ul>
            </div>
            <div className="card-bottom">
              <div className="card-price">
                <span className="price-currency">LKR</span>0 <span className="price-period">/ free forever</span>
              </div>
              <button className="btn-download disabled" disabled>
                Coming Soon
              </button>
            </div>
          </div>

          {/* Tier 2: Pro Desktop */}
          <div className="desktop-card">
            <div className="card-top">
              <span className="card-badge">Commercial</span>
              <h3 className="card-title">Pro Desktop</h3>
              <p className="card-desc">
                Unlocks the predictive potential of your store with automated forecasting engines.
              </p>
              <ul className="card-bullets">
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Province-Based Analytics:</strong> Syncs regional purchase dynamics and demographic demand patterns.</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Predictive AI Demand:</strong> Signals which SKUs to order before they sell out on peak dates.</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Full-Function POS:</strong> Advanced supplier ledgers, store credits, and staff shift audits.</span>
                </li>
              </ul>
            </div>
            <div className="card-bottom">
              <div className="card-price">
                <span className="price-currency">LKR</span>4,500 <span className="price-period">/ month</span>
              </div>
              <a href="/downloads/pro-installer.dmg" className="btn-download">
                Download Runtime (.dmg / .exe)
              </a>
            </div>
          </div>

          {/* Tier 3: Max Desktop */}
          <div className="desktop-card">
            <div className="card-top">
              <span className="card-badge">Enterprise AI</span>
              <h3 className="card-title">Max Desktop</h3>
              <p className="card-desc">
                Our ultimate hardware package embedded with custom-trained machine learning frameworks.
              </p>
              <ul className="card-bullets">
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Includes Everything in Pro:</strong> Fully unrestricted local offline caching and predictive SKU tools.</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Personalized AI Chatbot:</strong> Ask natural questions ("Which brand of milk should I reorder for monsoon?") and get instant insights.</span>
                </li>
                <li className="bullet-item">
                  <span className="bullet-dot">•</span>
                  <span><strong>Unlimited Terminal Links:</strong> Link multiple checkouts under one master AI context.</span>
                </li>
              </ul>
            </div>
            <div className="card-bottom">
              <div className="card-price">
                <span className="price-currency">LKR</span>9,500 <span className="price-period">/ month</span>
              </div>
              <a href="/downloads/max-installer.dmg" className="btn-download">
                Download Runtime (.dmg / .exe)
              </a>
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}