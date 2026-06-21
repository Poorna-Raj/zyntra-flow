"use client";

import React from "react";

export default function Footer() {
  const links = {
    Product: ["Features", "Forecasting", "Roadmap", "Pricing"],
    Resources: ["Support", "Blog", "Contact Us"],
    Company: ["About Us", "Team", "SDGP Project", "Careers"],
  };

  return (
    <footer className="footer-section">
      <style>{`
        .footer-section {
          background-color: #09090b; /* Deep dark background */
          color: #ffffff;
          font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          position: relative;
          overflow: hidden;
          padding-top: 6rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 10;
        }

        /* -------------------------
           1. TOP CTA SECTION
           ------------------------- */
        .footer-cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 6rem;
        }

        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: #a1a1aa;
          margin-bottom: 2rem;
        }

        .cta-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 2.5rem;
          max-width: 800px;
        }

        /* The Purple/Orange Gradient text from your reference */
        .cta-title span {
          background: linear-gradient(90deg, #a855f7, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn-primary {
          background: #ffffff;
          color: #000000;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.8rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .btn-primary:hover {
          background: #e4e4e7;
        }

        .btn-secondary {
          background: transparent;
          color: #ffffff;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.8rem 2rem;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-decoration: none;
          transition: background 0.2s ease;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* -------------------------
           2. MIDDLE LINKS GRID
           ------------------------- */
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 4rem;
          padding-bottom: 4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Brand & Contact Info Column */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          text-decoration: none;
          letter-spacing: -0.03em;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: #a1a1aa;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .contact-icon {
          color: #71717a;
          margin-top: 2px;
          flex-shrink: 0;
        }

        /* Link Columns */
        .footer-col-title {
          font-weight: 600;
          font-size: 1rem;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }

        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer-link {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #ffffff;
        }

        /* -------------------------
           3. SUB-FOOTER (Socials & Legal)
           ------------------------- */
        .footer-sub {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .social-icons {
          display: flex;
          gap: 1.5rem;
        }

        .social-icon {
          color: #71717a;
          transition: color 0.2s ease;
        }

        .social-icon:hover {
          color: #ffffff;
        }

        .legal-links {
          display: flex;
          gap: 2rem;
        }

        .legal-link {
          color: #71717a;
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .legal-link:hover {
          color: #a1a1aa;
        }

        /* -------------------------
           4. COPYRIGHT & GIANT TEXT
           ------------------------- */
        .footer-copyright {
          text-align: center;
          padding: 2rem 0 0 0;
          color: #52525b;
          font-size: 0.85rem;
        }

        .giant-bg-text {
          font-size: 24vw;
          font-weight: 900;
          color: #ffffff;
          opacity: 0.02; /* Extremely subtle */
          text-align: center;
          line-height: 0.7;
          margin-top: 2rem;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }

        /* -------------------------
           MOBILE RESPONSIVENESS
           ------------------------- */
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-sub {
            flex-direction: column;
            gap: 1.5rem;
            align-items: center;
          }
          .legal-links {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>

      <div className="footer-container">
        {/* 1. TOP CTA SECTION */}
        <div className="footer-cta">
          <div className="cta-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Early Access Open
          </div>
          
          <h2 className="cta-title">
            Stop guessing. Start <br />
            <span>forecasting?</span>
          </h2>
          
          <div className="cta-buttons">
            <a href="#demo" className="btn-primary">
              Start Now
            </a>
            <a href="#contact" className="btn-secondary">
              Book a Demo
            </a>
          </div>
        </div>

        {/* 2. MIDDLE LINKS GRID */}
        <div className="footer-grid">
          {/* Brand & Contact Column */}
          <div className="footer-brand">
            <a href="/" className="brand-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#ffffff"/>
                <circle cx="12" cy="12" r="5" fill="#000000"/>
              </svg>
              Lokalens
            </a>
            
            <div className="contact-info">
              <div className="contact-item">
                <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>
                  Built in Sri Lanka 🇱🇰<br />
                  SDGP Academic Project · IIT
                </span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>(+94) 77 123 4567</span>
              </div>
              <div className="contact-item">
                <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>partnership@lokalens.com</span>
              </div>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="footer-col-title">{category}</h3>
              <ul className="footer-link-list">
                {items.map((item) => (
                  <li key={item}>
                    <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="footer-link">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 3. SUB-FOOTER (Socials & Legal) */}
        <div className="footer-sub">
          <div className="social-icons">
            {/* LinkedIn */}
            <a href="#" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
          
          <div className="legal-links">
            <a href="#terms" className="legal-link">Terms of Service</a>
            <a href="#privacy" className="legal-link">Privacy Policy</a>
          </div>
        </div>

        {/* 4. COPYRIGHT */}
        <div className="footer-copyright">
          © Copyright 2025 Lokalens. All rights reserved.
        </div>
      </div>

      {/* GIANT FADED BACKGROUND TEXT */}
      <div className="giant-bg-text">LOKALENS</div>
      
    </footer>
  );
}