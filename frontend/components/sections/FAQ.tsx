"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Do I need a POS system or existing sales data?",
    a: "No. Lokalens works from day one using contextual behavioral signals — payday cycles, holidays, regional climate, festival seasons, and more. You can start forecasting without any historical sales records.",
  },
  {
    q: "Which provinces does Lokalens support?",
    a: "All 9 provinces: Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, and Sabaragamuwa. Each province has its own demand model trained on localized behavioral patterns.",
  },
  {
    q: "What products can Lokalens forecast?",
    a: "The current MVP focuses on grocery and FMCG products — beverages, dairy, snacks, staples, and household goods. Future versions will expand to pharmacy, clothing, and restaurant inventory.",
  },
  {
    q: "How accurate are the demand forecasts?",
    a: "Accuracy improves over time. The initial synthetic model captures regional behavioral patterns well. Once integrated with your real sales data (V2), the model retrains and predictions become significantly more personalized and precise.",
  },
  {
    q: "Can the AI chatbot work within my budget?",
    a: "Yes. The AI stocking assistant accepts a budget in LKR, analyzes forecasted demand scores, and returns a ranked stocking recommendation — explaining which products to prioritize and why.",
  },
  {
    q: "When will Lokalens be publicly available?",
    a: "The MVP is being completed as part of an academic project (SDGP). Early access sign-ups are open now. Public launch is planned for after the final evaluation cycle.",
  },
];

export default function FAQ() {
  // Explicitly allow both number and null
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq-section">
      <style>{`
        .faq-section {
          background-color: #000000;
          color: #ffffff;
          padding: 8rem 1rem;
          font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Subtle background glow mimicking the reference */
        .faq-section::before {
          content: "";
          position: absolute;
          top: 20%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .faq-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 5rem;
          position: relative;
          z-index: 10;
        }

        /* --- LEFT COLUMN --- */
        .faq-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .faq-badge {
          color: #38bdf8;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .faq-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          color: #f4f4f5;
        }

        .faq-desc {
          color: #a1a1aa;
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 3rem;
          max-width: 90%;
        }

        /* GLOWING BUTTON WRAPPER */
        .glow-btn-wrapper {
          position: relative;
          display: inline-flex;
          border-radius: 12px;
          padding: 2px; /* This creates the border thickness */
          background: linear-gradient(90deg, #38bdf8, #818cf8, #f97316);
          z-index: 1;
        }

        /* The actual blur effect behind the button */
        .glow-btn-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #38bdf8, #818cf8, #f97316);
          filter: blur(12px);
          opacity: 0.5;
          z-index: -1;
          border-radius: inherit;
          transition: opacity 0.3s ease;
        }

        .glow-btn-wrapper:hover::before {
          opacity: 0.8;
        }

        .glow-btn {
          background: #0a0a0a;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.9rem 1.8rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .glow-btn:hover {
          background: #121212;
        }

        /* --- RIGHT COLUMN (FAQ ITEMS) --- */
        .faq-right {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-item {
          background: #0f0f11;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          overflow: hidden;
          transition: background 0.2s ease;
        }

        .faq-item:hover {
          background: #141417;
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: #f4f4f5;
          font-size: 1rem;
          font-weight: 500;
          font-family: inherit;
        }

        .faq-icon {
          color: #71717a;
          flex-shrink: 0;
        }

        .faq-answer-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
          color: #a1a1aa;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* --- MOBILE RESPONSIVENESS --- */
        @media (max-width: 960px) {
          .faq-container {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          
          .faq-left {
            align-items: center;
            text-align: center;
          }
          
          .faq-desc {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="faq-container">
        {/* Left Content Area */}
        <div className="faq-left">
          <span className="faq-badge">FAQ</span>
          <h2 className="faq-title">Get all your questions answered here</h2>
          <p className="faq-desc">
            Everything you need to know about how Lokalens forecasts localized demand without requiring historical sales data.
          </p>

          <div className="glow-btn-wrapper">
            <a href="#download" className="glow-btn">
              Start for Free Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Right FAQ List Area */}
        <div className="faq-right">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="faq-question-btn"
              >
                <span>{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="faq-icon"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="faq-answer-content">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}