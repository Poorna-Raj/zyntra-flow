"use client";

import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

export default function AboutUsPage() {
  return (
    <div className="about-page">
      <style>{`
        .about-page {
          background-color: #000000;
          color: #ffffff;
          font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          min-height: 100vh;
        }

        .about-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 8rem 1rem 10rem 1rem;
        }

        /* =========================================
           HERO HEADER
           ========================================= */
        .about-hero {
          max-width: 800px;
          margin-bottom: 8rem;
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
           CHRONICLE STORY SECTIONS (Alternating)
           ========================================= */
        .story-list {
          display: flex;
          flex-direction: column;
          gap: 10rem; /* Spacious breaks between chapters */
        }

        .story-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 5rem;
        }

        /* Alternates layout direction */
        .story-row:nth-child(even) {
          flex-direction: row-reverse;
        }

        .story-text-side {
          flex: 1;
          max-width: 500px;
        }

        .story-image-side {
          flex: 1;
          max-width: 500px;
          aspect-ratio: 4 / 3;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background-color: #0a0a0a;
          position: relative;
        }

        .story-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) contrast(1.05); /* Colorful, rich, but styled for dark UI */
          transition: transform 0.5s ease;
        }

        .story-image-side:hover .story-img {
          transform: scale(1.03);
        }

        /* Story Details Typography */
        .story-number {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #71717a;
          font-size: 1.25rem;
          margin-bottom: 1rem;
          display: block;
        }

        .story-heading {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .story-quote {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #a1a1aa;
          font-size: 1.05rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          border-left: 2px solid rgba(255, 255, 255, 0.1);
          padding-left: 1.25rem;
        }

        .story-desc {
          color: #71717a;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        /* Highlight box within story */
        .innovation-callout {
          background-color: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 2.5rem;
          margin-top: 8rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .callout-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.01em;
        }

        .callout-body {
          color: #a1a1aa;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* =========================================
           RESPONSIVE DESIGN
           ========================================= */
        @media (max-width: 900px) {
          .about-hero {
            margin-bottom: 5rem;
          }

          .story-list {
            gap: 6rem;
          }

          .story-row, 
          .story-row:nth-child(even) {
            flex-direction: column;
            gap: 3rem;
          }

          .story-text-side, 
          .story-image-side {
            max-width: 100%;
            width: 100%;
          }

          .story-image-side {
            aspect-ratio: 16 / 10;
          }
        }
      `}</style>

      <Navbar />

      <div className="about-container">
        
        {/* =========================================
            HERO HEADER
            ========================================= */}
        <div className="about-hero">
          <span className="section-subtitle">Our Genesis</span>
          <h1 className="section-title">From Dorm Rooms to the Streets of Colombo</h1>
          <p className="hero-desc">
            We did not set out to build another accounting program. Lokalens was founded by a small group of Sri Lankan university undergraduates who saw local family merchants struggling with systemic cash leaks, and decided to do something about it.
          </p>
        </div>

        {/* =========================================
            CHRONICLE STORIES (Alternating Layouts)
            ========================================= */}
        <div className="story-list">
          
          {/* Chapter 1: The Local Retail Blindspot */}
          <div className="story-row">
            
            <div className="story-text-side">
              <span className="story-number">Chapter 01</span>
              <h2 className="story-heading">The Retail Blindspot on Our Streets</h2>
              <p className="story-quote">
                "Small merchants lock up to 35% of their working capital in stagnant inventory that never sells in their town."
              </p>
              <p className="story-desc">
                Sri Lankan retail is built on thousands of neighborhood family-owned shops (*kades*) and boutique grocers. But under current economic patterns, managing inventory is painful. Shopkeepers rely on manual intuition, stocking products that end up stagnant for months. This locks away crucial cash flow, while high-demand items are left empty. Standard, bloated international software fails because it acts as a digital logbook—never predicting what will actually sell.
              </p>
            </div>

            <div className="story-image-side">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop" 
                alt="Traditional Sri Lankan market context representing local retail reality" 
                className="story-img"
              />
            </div>

          </div>

          {/* Chapter 2: The University Spark */}
          <div className="story-row">
            
            <div className="story-text-side">
              <span className="story-number">Chapter 02</span>
              <h2 className="story-heading">Late-Night Ideation</h2>
              <p className="story-quote">
                "We realized that localized demand is not random. It directly syncs with salary cycles, monsoon shifts, and regional holidays."
              </p>
              <p className="story-desc">
                As computer science and data science undergraduates, our founding team began looking closely at localized purchase histories. We discovered that purchase behaviors were highly systemic. Demand spiked and plunged in direct synchronization with salary payday drops, local rain patterns, Poya days, and cultural festivals. Traditional spreadsheets were blind to this, but lightweight, localized machine-learning pipelines could map it perfectly.
              </p>
            </div>

            <div className="story-image-side">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" 
                alt="Undergraduates working at night on algorithmic modeling" 
                className="story-img"
              />
            </div>

          </div>

          {/* Chapter 3: Democratizing Predictive POS */}
          <div className="story-row">
            
            <div className="story-text-side">
              <span className="story-number">Chapter 03</span>
              <h2 className="story-heading">Democratizing Local Forecasts</h2>
              <p className="story-quote">
                "We took our code out of the classroom and configured it on old android devices directly inside local merchant counters."
              </p>
              <p className="story-desc">
                Instead of selling our code as enterprise software, we built an accessible point-of-sale infrastructure tailored for active Sri Lankan merchants. We loaded our forecasting pipelines directly onto the POS interface. Today, Lokalens does not just log sales—it predicts tomorrow’s local demand down to the exact SKU, protecting small merchants from stockouts and protecting their hard-earned cash flow.
              </p>
            </div>

            <div className="story-image-side">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop" 
                alt="Modern checkout layout with digital point of sale tracking" 
                className="story-img"
              />
            </div>

          </div>

        </div>

        {/* =========================================
            INNOVATION CALLOUT
            ========================================= */}
        <div className="innovation-callout">
          <h3 className="callout-title">The Lokalens Philosophy</h3>
          <p className="callout-body">
            Lokalens was born from the belief that modern, enterprise-level predictive analytics should not be locked behind massive budgets. By deploying customized, localized machine-learning models directly onto a simple retail system, we are democratizing economic forecasting for merchants in every province, town, and neighborhood of Sri Lanka.
          </p>
        </div>

      </div>

      <Footer />
    </div>
  );
}