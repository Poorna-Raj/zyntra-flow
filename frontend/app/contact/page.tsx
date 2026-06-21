"use client";

import React, { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

type InquiryType = "Download Free POS" | "General Inquiry" | "Enterprise Setup" | "Partnership";
type Province = "Western" | "Southern" | "Central" | "Northern" | "Eastern" | "North Western" | "North Central" | "Uva" | "Sabaragamuwa";

const PROVINCES: Province[] = ["Western", "Southern", "Central", "Northern", "Eastern", "North Western", "North Central", "Uva", "Sabaragamuwa"];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState<Province | "">("");
  const [inquiryType, setInquiryType] = useState<InquiryType>("Download Free POS");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Insert your database / submission endpoint logic here
    setIsSubmitted(true);
  };

  return (
    <div className="contact-page">
      <style>{`
        .contact-page {
          background-color: #000000;
          color: #ffffff;
          font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          min-height: 100vh;
        }

        .contact-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 8rem 1rem 10rem 1rem;
        }

        /* =========================================
           HERO HEADER
           ========================================= */
        .contact-header {
          max-width: 700px;
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
          font-size: 1.05rem;
          line-height: 1.7;
        }

        /* =========================================
           TWO-COLUMN GRID LAYOUT
           ========================================= */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 6rem;
          align-items: flex-start;
        }

        /* =========================================
           LEFT COLUMN: TOUCHPOINTS & DETAILS
           ========================================= */
        .touchpoints-area {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .touchpoint-group {
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          padding-left: 1.5rem;
        }

        .touchpoint-label {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #71717a;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .touchpoint-value {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.4;
        }

        .touchpoint-sub {
          color: #71717a;
          font-size: 0.9rem;
          margin-top: 0.25rem;
          display: block;
        }

        /* Steps list */
        .onboarding-steps {
          background-color: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          padding: 2.5rem;
        }

        .steps-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }

        .step-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .step-row:last-child {
          margin-bottom: 0;
        }

        .step-num {
          font-family: "Georgia", serif;
          font-style: italic;
          color: #71717a;
          font-size: 1rem;
          font-weight: bold;
        }

        .step-text h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .step-text p {
          font-size: 0.85rem;
          color: #71717a;
          line-height: 1.5;
        }

        /* =========================================
           RIGHT COLUMN: FORM & STATES
           ========================================= */
        .form-card {
          background-color: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 24px;
          padding: 3rem 2.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-field.full-width {
          grid-column: span 2;
        }

        .field-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #71717a;
          font-weight: 600;
        }

        .minimal-input, 
        .minimal-textarea, 
        .minimal-select {
          font-family: inherit;
          font-size: 0.95rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          transition: border-color 0.3s ease;
          width: 100%;
        }

        .minimal-input::placeholder, 
        .minimal-textarea::placeholder {
          color: #3f3f46;
        }

        .minimal-input:focus, 
        .minimal-textarea:focus, 
        .minimal-select:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .minimal-textarea {
          resize: none;
          height: 120px;
        }

        .minimal-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a1a1aa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 2.5rem;
        }

        .minimal-select option {
          background-color: #0a0a0a;
          color: #ffffff;
        }

        .submit-btn {
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          color: #000000;
          background-color: #ffffff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 999px;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
          width: 100%;
          margin-top: 1rem;
        }

        .submit-btn:hover {
          transform: scale(1.01);
          opacity: 0.95;
        }

        /* =========================================
           SUCCESS STATE
           ========================================= */
        .success-card {
          text-align: center;
          padding: 4rem 2rem;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .success-title {
          font-family: "Georgia", serif;
          font-style: italic;
          font-size: 1.8rem;
          font-weight: 500;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .success-desc {
          color: #a1a1aa;
          font-size: 0.95rem;
          line-height: 1.6;
          max-width: 400px;
          margin: 0 auto;
        }

        /* =========================================
           RESPONSIVE DESIGN
           ========================================= */
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .contact-header {
            margin-bottom: 4rem;
          }
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-field.full-width {
            grid-column: span 1;
          }
          .form-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <Navbar />

      <div className="contact-container">
        
        {/* Hero Header */}
        <div className="contact-header">
          <span className="section-subtitle">Get Started</span>
          <h1 className="section-title">Connect with Our Local Team</h1>
          <p className="hero-desc">
            Submit your inquiry to request a system demo or activate your free POS download. Our local team based in Colombo typically responds within 2 hours.
          </p>
        </div>

        {/* Content Grid */}
        <div className="contact-grid">
          
          {/* Left Side: Touchpoints & Timeline */}
          <div className="touchpoints-area">
            
            <div className="touchpoint-group">
              <span className="touchpoint-label">Office & Support HQ</span>
              <p className="touchpoint-value">Lokalens Sri Lanka (Pvt) Ltd</p>
              <span className="touchpoint-sub">Galle Road, Colombo 03</span>
            </div>

            <div className="touchpoint-group">
              <span className="touchpoint-label">Inquiries & Support</span>
              <p className="touchpoint-value">hello@lokalens.lk</p>
              <span className="touchpoint-sub">+94 (11) 234-5678</span>
            </div>

            {/* Visual Process steps */}
            <div className="onboarding-steps">
              <h3 className="steps-title">What happens next?</h3>
              
              <div className="step-row">
                <span className="step-num">01</span>
                <div className="step-text">
                  <h4>Verify Details</h4>
                  <p>Our team verifies your store details to align regional catalog indexes.</p>
                </div>
              </div>

              <div className="step-row">
                <span className="step-num">02</span>
                <div className="step-text">
                  <h4>POS Link Dispatch</h4>
                  <p>We dispatch your custom free POS download link via secure email.</p>
                </div>
              </div>

              <div className="step-row">
                <span className="step-num">03</span>
                <div className="step-text">
                  <h4>Onboarding Support</h4>
                  <p>An onboarding agent remains on standby to configure your inventories.</p>
                </div>
              </div>

            </div>

          </div>

          {/* Right Side: Interactive Form / Success card */}
          <div className="form-card">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  
                  {/* Full Name */}
                  <div className="form-field">
                    <label className="field-label">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className="minimal-input" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>

                  {/* Business Name */}
                  <div className="form-field">
                    <label className="field-label">Business / Store Name</label>
                    <input 
                      type="text" 
                      required 
                      className="minimal-input" 
                      placeholder="Lanka Retailers" 
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="form-field">
                    <label className="field-label">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      className="minimal-input" 
                      placeholder="name@company.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="form-field">
                    <label className="field-label">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      className="minimal-input" 
                      placeholder="+94 77 123 4567" 
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Province Select */}
                  <div className="form-field">
                    <label className="field-label">Province</label>
                    <select 
                      required 
                      className="minimal-select" 
                      value={province} 
                      onChange={e => setProvince(e.target.value as Province)}
                    >
                      <option value="" disabled>Select Province</option>
                      {PROVINCES.map(p => (
                        <option key={p} value={p}>{p} Province</option>
                      ))}
                    </select>
                  </div>

                  {/* Inquiry Type */}
                  <div className="form-field">
                    <label className="field-label">Reason for reaching out</label>
                    <select 
                      required 
                      className="minimal-select" 
                      value={inquiryType} 
                      onChange={e => setInquiryType(e.target.value as InquiryType)}
                    >
                      <option value="Download Free POS">Download Free POS</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Enterprise Setup">Enterprise Setup</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>

                  {/* Requirements / message */}
                  <div className="form-field full-width">
                    <label className="field-label">Requirements / Message</label>
                    <textarea 
                      className="minimal-textarea" 
                      placeholder="Tell us about your business size, typical inventory count, or general requirements..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>

                </div>

                <button type="submit" className="submit-btn">
                  Submit Request
                </button>
              </form>
            ) : (
              /* Success State Card */
              <div className="success-card">
                <span className="success-icon">📩</span>
                <h2 className="success-title">Thank you, {name.split(" ")[0]}.</h2>
                <p className="success-desc">
                  Your request has been logged successfully. Our team will verify your store details for <strong>{businessName}</strong>, and dispatch your setup instructions shortly.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}