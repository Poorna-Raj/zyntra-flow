"use client";

import React from "react";
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

const features = [
  {
    id: "01",
    title: "Province Intelligence",
    tagline: "Localize your supply chain to regional realities.",
    description: "Gain granular insights into regional purchasing behaviors. Adapt to local economic drivers and optimize stock distribution province by province.",
    businessImpact: "Eliminates the dead-stock dilemma. Instead of shipping identical inventory island-wide, you align supply with actual regional demand (e.g., Western Province trends vs. Northern Province preferences). This frees up frozen capital, reduces transport costs, and ensures your regional shelves carry items that actually sell.",
    image: "/features/province-intelligence.png",// Dark minimal map/grid concept
    alt: "Regional mapping data visualization"
  },
  {
    id: "02",
    title: "AI Assistant",
    tagline: "Your 24/7 retail analyst, accessible in plain English.",
    description: "Instant inventory decisions. Chat directly with your retail data to get immediate recommendations on restocks, warehouse transfers, and markdown strategies.",
    businessImpact: "Demolishes the need for complex, manual spreadsheets. You don't need a dedicated data analyst to understand your performance. Simply ask, 'Which products in Kandy should I markdown this week?' to get instant, mathematically backed actions. This saves hours of weekly administrative work and prevents human error.",
    image: "/features/ai-assistant.png", // Abstract dark interface/glow concept
    alt: "AI conversational interface concept"
  },
  {
    id: "03",
    title: "SKU Forecasting",
    tagline: "Granular planning down to the individual product unit.",
    description: "Predict product-level demand. Go beyond high-level category trends with hyper-granular forecasting for every individual SKU in your catalog.",
    businessImpact: "Prevents both stockouts of your bestsellers and costly overstocking of slow-movers. By predicting demand down to the exact size, color, or flavor SKU, you ensure customers never walk away empty-handed while protecting your warehouse from being choked by unsellable surplus.",
    image: "/features/sku-forecasting.png", // Highly structured, clean dark warehouse shelves
    alt: "Sleek organized product inventory"
  },
  {
    id: "04",
    title: "Cultural Signals",
    tagline: "Sync your inventory with Sri Lanka's cultural calendar.",
    description: "Anticipate festival-driven demand shifts. Automatically adjust your predictions based on regional holidays, cultural events, and local traditions.",
    businessImpact: "Capitalizes on peak shopping seasons without the stress of panic-buying. The system automatically ramps up stock predictions weeks before major festivals (like Avurudu, Ramadan, Vesak, or Christmas) and winds them down immediately after. This maximizes holiday profit margins while shielding you from post-festival margin erosion.",
    image: "features/cultural-signals.png", // High quality abstract festive lights at night
    alt: "Festive regional celebration lights"
  }
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />

      <section className="features-section">
        <style>{`
          .features-section {
            background-color: #000000;
            color: #ffffff;
            padding: 8rem 1rem;
            font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }

          .features-container {
            max-width: 1100px;
            margin: 0 auto;
          }

          /* =========================================
             HERO HEADER
             ========================================= */
          .features-hero {
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
             ALTERNATING FEATURES LAYOUT
             ========================================= */
          .features-list {
            display: flex;
            flex-direction: column;
            gap: 10rem; /* Space between each feature row */
          }

          .feature-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 5rem;
          }

          /* Alternating side order */
          .feature-row:nth-child(even) {
            flex-direction: row-reverse;
          }

          .feature-text-side {
            flex: 1;
            max-width: 500px;
          }

          .feature-image-side {
            flex: 1;
            max-width: 500px;
            aspect-ratio: 4 / 3;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05);
            background: #0a0a0a;
            position: relative;
          }

          /* Visual styling with grayscale transitions */
          .feature-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(100%) brightness(0.6) contrast(1.1);
            transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .feature-image-side:hover .feature-img {
            filter: grayscale(30%) brightness(0.7) contrast(1);
            transform: scale(1.02);
          }

          /* Text Elements styling */
          .feature-number {
            font-family: "Georgia", serif;
            font-style: italic;
            color: #71717a;
            font-size: 1.2rem;
            margin-bottom: 1rem;
            display: block;
          }

          .feature-name {
            font-size: 2.2rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.02em;
            margin-bottom: 0.5rem;
            line-height: 1.2;
          }

          .feature-tagline {
            font-family: "Georgia", serif;
            font-style: italic;
            color: #a1a1aa;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
            line-height: 1.4;
          }

          .feature-desc {
            color: #a1a1aa;
            font-size: 1rem;
            line-height: 1.7;
            margin-bottom: 2rem;
          }

          /* Business Impact Callout box */
          .impact-box {
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 1.5rem;
            margin-top: 2rem;
          }

          .impact-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #a1a1aa;
            font-weight: 700;
            margin-bottom: 0.75rem;
            display: block;
          }

          .impact-text {
            color: #e4e4e7;
            font-size: 0.95rem;
            line-height: 1.6;
          }

          /* =========================================
             RESPONSIVE DESIGN
             ========================================= */
          @media (max-width: 900px) {
            .features-hero {
              margin-bottom: 5rem;
            }

            .features-list {
              gap: 6rem;
            }

            .feature-row, 
            .feature-row:nth-child(even) {
              flex-direction: column;
              gap: 3rem;
            }

            .feature-text-side, 
            .feature-image-side {
              max-width: 100%;
              width: 100%;
            }

            .feature-image-side {
              aspect-ratio: 16 / 10;
            }
          }
        `}</style>

        <div className="features-container">
          
          {/* Hero Header */}
          <div className="features-hero">
            <span className="section-subtitle">Core Capabilities</span>
            <h1 className="section-title">Built to Solve the Real Complexities of Retail</h1>
            <p className="hero-desc">
              Lokalens bridges the gap between raw point-of-sale data and strategic execution. 
              Here is how we translate complex predictive algorithms into direct growth for your business.
            </p>
          </div>

          {/* Alternating Features List */}
          <div className="features-list">
            {features.map((feature) => (
              <div key={feature.id} className="feature-row">
                
                {/* Text Side */}
                <div className="feature-text-side">
                  <span className="feature-number">{feature.id}</span>
                  <h2 className="feature-name">{feature.title}</h2>
                  <p className="feature-tagline">{feature.tagline}</p>
                  <p className="feature-desc">{feature.description}</p>
                  
                  <div className="impact-box">
                    <span className="impact-label">How it helps your business</span>
                    <p className="impact-text">{feature.businessImpact}</p>
                  </div>
                </div>

                {/* Image Side */}
                <div className="feature-image-side">
                  <img 
                    src={feature.image} 
                    alt={feature.alt} 
                    className="feature-img" 
                  />
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}