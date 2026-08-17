"use client";

import React from "react";

export default function Roadmap() {
  const steps = [
    {
      id: "01",
      title: "Building the MVP",
      desc: "Laying the foundation and developing our core AI forecasting engine.",
      date: "Q1 2024",
      left: "10%",
      top: "75%",
      pos: "above",
      color: "#f97316", // Orange
    },
    {
      id: "02",
      title: "Launch",
      desc: "Official public release and onboarding our first cohort of users.",
      date: "Q2 2024",
      left: "30%",
      top: "25%",
      pos: "below",
      color: "#f43f5e", // Rose/Pink
    },
    {
      id: "03",
      title: "Give Away Free POS",
      desc: "To help local businesses digitize, we release our POS software at no cost.",
      date: "Q3 2024",
      left: "50%",
      top: "75%",
      pos: "above",
      color: "#ec4899", // Pink
    },
    {
      id: "04",
      title: "Release Version 2",
      desc: "Introducing advanced demographic analytics and deeper integrations.",
      date: "Q4 2024",
      left: "70%",
      top: "25%",
      pos: "below",
      color: "#d946ef", // Fuchsia
    },
    {
      id: "05",
      title: "Release Version 3",
      desc: "Scaling globally with multi-region support and enterprise features.",
      date: "Q1 2025",
      left: "90%",
      top: "75%",
      pos: "above",
      color: "#8b5cf6", // Purple
    },
  ];

  return (
    <section className="roadmap-section">
      <style>{`
        /* MAIN SECTION BACKGROUND - No more inner box! */
        .roadmap-section {
          background-color: #000000;
          color: #ffffff;
          padding: 6rem 0;
          font-family: "Inter", "Segoe UI", Roboto, sans-serif;
          width: 100%;
          overflow: hidden; /* Prevents horizontal scrolling */
        }

        /* HEADER */
        .roadmap-header {
          text-align: center;
          margin: 0 auto 5rem auto;
          max-width: 700px;
          padding: 0 1rem;
          position: relative;
          z-index: 20;
        }

        .roadmap-subtitle {
          color: #38bdf8; 
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          display: block;
        }

        .roadmap-header h2 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: #ffffff;
        }

        .roadmap-header p {
          color: #a1a1aa;
          line-height: 1.6;
          font-size: 1rem;
        }

        /* ROADMAP WRAPPER - Full width so the road hits the screen edges */
        .roadmap-visual-area {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 1; /* Gives a wide, spacious layout */
          min-height: 500px;
          margin: 0 auto;
        }

        .roadmap-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* STEP CARDS */
        .step-node {
          position: absolute;
          left: var(--left);
          top: var(--top);
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        /* CIRCULAR INDICATOR ON THE ROAD */
        .node-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #000000;
          border: 3px solid var(--color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 2;
        }

        /* GLASSMORPHIC CONTENT CARD */
        .card-content {
          position: absolute;
          width: 250px; 
          background: #0a0a0a; /* Dark card against pure black background */
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          left: 50%;
          transform: translateX(-50%);
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .step-node:hover .card-content {
          border-color: var(--color);
          transform: translateX(-50%) translateY(-5px);
        }

        .step-node.below:hover .card-content {
          transform: translateX(-50%) translateY(5px);
        }

        .step-node.above .card-content {
          bottom: calc(100% + 20px);
        }

        .step-node.below .card-content {
          top: calc(100% + 20px);
        }

        /* THE CONNECTING POINTER TRIANGLE */
        .card-pointer {
          position: absolute;
          width: 16px;
          height: 16px;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          z-index: -1;
        }

        .step-node.above .card-pointer {
          bottom: -8px;
          border-top: none;
          border-left: none;
        }

        .step-node.below .card-pointer {
          top: -8px;
          border-bottom: none;
          border-right: none;
        }

        /* CARD TYPOGRAPHY */
        .card-date {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-title {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #ffffff;
          line-height: 1.3;
        }

        .card-desc {
          font-size: 0.85rem;
          color: #a1a1aa;
          line-height: 1.5;
        }

        /* MOBILE RESPONSIVENESS */
        @media (max-width: 900px) {
          .roadmap-header h2 {
            font-size: 2.2rem;
          }

          .roadmap-visual-area {
            aspect-ratio: auto;
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            padding-left: 20px;
            border-left: 2px dashed #3f3f46;
            width: calc(100% - 2rem);
            margin: 0 auto;
          }

          .roadmap-svg {
            display: none;
          }

          .step-node {
            position: relative;
            left: 0 !important;
            top: 0 !important;
            transform: none !important;
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
          }

          .node-circle {
            position: absolute;
            left: -43px;
            top: 0;
            width: 40px;
            height: 40px;
            background: #000000;
          }

          .card-content {
            position: relative;
            width: 100%;
            max-width: 400px;
            left: 0 !important;
            top: 0 !important;
            bottom: auto !important;
            transform: none !important;
          }

          .step-node:hover .card-content {
            transform: translateY(-3px) !important;
          }

          .card-pointer {
            display: none;
          }
        }
      `}</style>

      {/* Centered Title Block */}
      <div className="roadmap-header">
        <span className="roadmap-subtitle">Product Journey</span>
        <h2>Our Roadmap</h2>
        <p>
          Our journey to revolutionizing demographic forecasting and empowering local businesses with actionable data.
        </p>
      </div>

      {/* Full Width Container holding the SVG Path and the Nodes */}
      <div className="roadmap-visual-area">
        {/* BACKGROUND SVG ROAD - ViewBox stretched widely so road extends infinitely to the edges */}
        <svg
          className="roadmap-svg"
          viewBox="0 0 2000 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" /> {/* Orange */}
              <stop offset="25%" stopColor="#f43f5e" /> {/* Rose */}
              <stop offset="50%" stopColor="#ec4899" /> {/* Pink */}
              <stop offset="75%" stopColor="#d946ef" /> {/* Fuchsia */}
              <stop offset="100%" stopColor="#8b5cf6" /> {/* Purple */}
            </linearGradient>
          </defs>

          {/* Paths start at X=-100 and end at X=2100 intentionally bleeding off the edges */}
          
          {/* 1. Road Glow / Shadow */}
          <path
            d="M -100 450 L 200 450 C 400 450, 400 150, 600 150 C 800 150, 800 450, 1000 450 C 1200 450, 1200 150, 1400 150 C 1600 150, 1600 450, 1800 450 L 2100 450"
            fill="none"
            stroke="rgba(236, 72, 153, 0.25)"
            strokeWidth="50"
            filter="blur(15px)"
          />

          {/* 2. Main Solid Colored Road */}
          <path
            d="M -100 450 L 200 450 C 400 450, 400 150, 600 150 C 800 150, 800 450, 1000 450 C 1200 450, 1200 150, 1400 150 C 1600 150, 1600 450, 1800 450 L 2100 450"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="42"
            strokeLinecap="round"
          />

          {/* 3. Dashed White Center Line */}
          <path
            d="M -100 450 L 200 450 C 400 450, 400 150, 600 150 C 800 150, 800 450, 1000 450 C 1200 450, 1200 150, 1400 150 C 1600 150, 1600 450, 1800 450 L 2100 450"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeDasharray="16 16"
          />
        </svg>

        {/* HTML OVERLAY CARDS */}
        {steps.map((step) => (
          <div
            key={step.id}
            className={`step-node ${step.pos}`}
            style={{
              "--left": step.left,
              "--top": step.top,
              "--color": step.color,
            } as React.CSSProperties}
          >
            {/* The glowing dot on the road */}
            <div className="node-circle">{step.id}</div>

            {/* The info card pointing to the dot */}
            <div className="card-content">
              <div className="card-pointer"></div>
              <span className="card-date">{step.date}</span>
              <h3 className="card-title">{step.title}</h3>
              <p className="card-desc">{step.desc}</p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}