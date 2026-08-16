"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        /* WRAPPER TO CENTER THE FLOATING NAV */
        .nav-wrapper {
          position: fixed;
          top: 1.5rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 100;
          font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          padding: 0 1rem;
        }

        /* THE BLACK PILL CONTAINER */
        .pill-nav {
          background-color: #18181b; /* Dark zinc/almost black */
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 960px; /* Expanded slightly to comfortably fit the 6th link */
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* 1. LEFT LOGO (White Circle) */
        .nav-logo {
          width: 44px;
          height: 44px;
          background-color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .nav-logo:hover {
          transform: scale(1.05);
        }

        /* 2. CENTER DESKTOP LINKS */
        .desktop-links {
          display: none;
          align-items: center;
          gap: 1.5rem; /* Tightened gap to support 6 text elements */
          padding: 0 1rem;
        }

        .nav-link {
          color: #e4e4e7; /* Light gray text */
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 400;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #ffffff; /* Turns solid white on hover */
        }

        /* =========================================
           PERSISTENT NEON PURPLE CAPSULE EFFECT 
           (Active by default, intensifies on hover)
           ========================================= */
        .nav-link-glow {
          padding: 0.5rem 1rem;
          border-radius: 999px;
          font-weight: 500;
          
          /* Permanent Base Glow Styles */
          background-color: #09090b; /* Solid dark mask inside */
          border: 1px solid #c084fc; /* Vibrant purple/lilac border line */
          color: #f5f3ff !important; /* Soft white with lilac tint */
          
          /* Double layered default glow */
          box-shadow: 
            0 0 10px rgba(168, 85, 247, 0.35), 
            0 0 20px rgba(168, 85, 247, 0.15),
            inset 0 0 4px rgba(168, 85, 247, 0.3);
            
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Soft highlight breathing effect when hovered */
        .nav-link-glow:hover {
          color: #ffffff !important;
          transform: scale(1.02); /* Slight high-end physical expansion */
          border-color: #d8b4fe; /* Brighter lavender border */
          
          /* Intensified layered glow */
          box-shadow: 
            0 0 16px rgba(168, 85, 247, 0.55), 
            0 0 32px rgba(168, 85, 247, 0.25),
            inset 0 0 6px rgba(168, 85, 247, 0.45) !important;
        }

        /* 3. RIGHT CONTACT BUTTON */
        .nav-contact {
          display: none;
          background-color: #ffffff;
          color: #000000;
          text-decoration: none;
          padding: 0.7rem 1.4rem;
          border-radius: 999px;
          font-size: 0.95rem;
          font-weight: 600;
          transition: transform 0.2s ease;
          white-space: nowrap;
        }

        .nav-contact:hover {
          transform: scale(1.02);
        }

        /* MOBILE MENU ELEMENTS */
        .nav-right-mobile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-right: 0.5rem;
        }

        .mobile-toggle {
          display: flex;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          padding: 0.4rem;
          align-items: center;
          justify-content: center;
        }

        /* FLOATING MOBILE MENU DROPDOWN */
        .mobile-menu-wrapper {
          position: absolute;
          top: 4.5rem;
          left: 0;
          right: 0;
          background-color: #18181b;
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .mobile-menu-wrapper .nav-link {
          font-size: 1.1rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Clean overrides for the glowing pill within mobile dropdown list */
        .mobile-menu-wrapper .nav-link-glow {
          border-bottom: 1px solid transparent !important;
          width: fit-content;
          margin: 0.25rem 0;
        }

        .mobile-menu-wrapper .nav-contact {
          display: block;
          text-align: center;
          margin-top: 1rem;
        }

        /* DESKTOP BREAKPOINT */
        @media (min-width: 890px) { /* Adjusted breakpoint slightly for wider menu array */
          .desktop-links {
            display: flex;
          }
          .nav-contact {
            display: inline-block;
          }
          .mobile-toggle {
            display: none;
          }
          .nav-right-mobile {
            padding-right: 0;
          }
        }
      `}</style>

      <div className="nav-wrapper">
        <nav className="pill-nav">
          
          {/* 1. Left Circular Brand Logo */}
          <Link href="/" className="nav-logo" aria-label="Home">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" fill="currentColor"/>
              <path d="M21.5 12C21.5 14.8 17.2 17 12 17C6.8 17 2.5 14.8 2.5 12C2.5 9.2 6.8 7 12 7C17.2 7 21.5 9.2 21.5 12Z" stroke="currentColor" strokeWidth="2" transform="rotate(-20 12 12)"/>
            </svg>
          </Link>

          {/* 2. Center Desktop Links */}
          <div className="desktop-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/feature" className="nav-link">Features</Link>
            <Link href="/product" className="nav-link nav-link-glow">Lokalens AI</Link>
            <Link href="/team" className="nav-link">Team</Link>
            <Link href="/aboutus" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* 3. Right CTA Button */}
          <div className="nav-right-mobile">
            <Link href="/dowload" className="nav-contact">
              Download Free POS
            </Link>
            
            <button 
              className="mobile-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                // Close Icon (X)
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Menu Icon
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* 4. Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="mobile-menu-wrapper">
              <Link href="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/feature" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
              <Link href="/product" className="nav-link nav-link-glow" onClick={() => setIsMobileMenuOpen(false)}>Lokalens AI</Link>
              <Link href="/team" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Team</Link>
              <Link href="/aboutus" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              <Link href="/contact" className="nav-contact" onClick={() => setIsMobileMenuOpen(false)}>
                Download Free POS
              </Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}