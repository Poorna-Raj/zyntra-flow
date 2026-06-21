"use client";

import React from "react";

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

const teamMembers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    role: "Project Lead",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop", 
    linkedin: "#",
    x: "#", 
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    role: "AI Engineer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    x: "#",
  },
  {
    id: 3,
    firstName: "Alex",
    lastName: "Johnson",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    x: "#",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Lee",
    role: "Product Designer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    linkedin: "#",
    x: "#",
  },
];

export default function AboutUs() {
  return (
    <>
      {/* 1. Render the Navbar at the very top of the page */}
      <Navbar />

      <section className="about-section">
        <style>{`
          .about-section {
            background-color: #000000;
            color: #ffffff;
            padding: 8rem 1rem;
            font-family: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          }

          .about-container {
            max-width: 1100px;
            margin: 0 auto;
          }

          /* =========================================
             PART 1: WHY WE BUILT LOKALENS
             ========================================= */
             
          /* Header Row */
          .mission-header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 4rem;
            margin-bottom: 4rem;
          }

          .mission-title-area {
            flex: 1;
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
          }

          .mission-main-desc {
            flex: 1;
            color: #a1a1aa;
            font-size: 1.1rem;
            line-height: 1.7;
            padding-top: 2.5rem; 
          }

          /* Hero Image */
          .mission-hero-image {
            width: 100%;
            height: 500px;
            background: linear-gradient(135deg, #121212 0%, #0a0a0a 100%);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            margin-bottom: 5rem;
            overflow: hidden;
            position: relative;
          }

          .mission-hero-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: grayscale(80%) contrast(1.1) brightness(0.7);
          }

          /* 3 Pillars List */
          .pillar-list {
            display: flex;
            flex-direction: column;
          }

          .pillar-row {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 4rem;
            padding: 2.5rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .pillar-row:first-child {
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }

          .pillar-name {
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffffff;
            letter-spacing: -0.02em;
          }

          .pillar-desc {
            color: #a1a1aa;
            font-size: 1.05rem;
            line-height: 1.6;
          }

          /* =========================================
             PART 2: THE TEAM GRID
             ========================================= */
             
          .team-wrapper {
            margin-top: 10rem;
          }

          .team-header {
            text-align: center;
            margin-bottom: 5rem;
          }

          .team-desc {
            color: #71717a;
            font-size: 1rem;
            max-width: 650px;
            margin: 1.5rem auto 0 auto;
            line-height: 1.6;
          }

          .team-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }

          /* Card Design */
          .team-card {
            background-color: #121212; 
            border-radius: 20px;
            height: 420px;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.03);
            transition: transform 0.3s ease, border-color 0.3s ease;
          }

          .team-card:hover {
            transform: translateY(-8px);
            border-color: rgba(255, 255, 255, 0.1);
          }

          .card-info {
            padding: 1.5rem 1.5rem 0 1.5rem;
            position: relative;
            z-index: 10;
          }

          .member-name {
            font-size: 1.4rem;
            font-weight: 600;
            color: #ffffff;
            line-height: 1.2;
            margin-bottom: 0.4rem;
            letter-spacing: -0.02em;
          }

          .member-role {
            font-family: "Georgia", serif;
            font-style: italic;
            color: #71717a;
            font-size: 0.9rem;
          }

          /* Image & Socials */
          .card-image-wrapper {
            margin-top: auto; 
            height: 70%;
            width: 100%;
            position: relative;
          }

          .team-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: bottom; 
            filter: grayscale(80%); 
            transition: filter 0.3s ease;
          }

          .team-card:hover .team-img {
            filter: grayscale(0%);
          }

          .card-socials {
            position: absolute;
            bottom: 1rem;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            z-index: 10;
          }

          .social-btn {
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #a1a1aa;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: color 0.2s ease, background 0.2s ease;
          }

          .social-btn:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
          }

          /* =========================================
             RESPONSIVE DESIGN
             ========================================= */
          @media (max-width: 1024px) {
            .team-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 2rem;
            }
          }

          @media (max-width: 900px) {
            .mission-header-row {
              flex-direction: column;
              gap: 2rem;
            }
            .mission-main-desc {
              padding-top: 0;
            }
            .mission-hero-image {
              height: 350px;
            }
            .pillar-row {
              grid-template-columns: 1fr;
              gap: 1rem;
              padding: 2rem 0;
            }
          }

          @media (max-width: 600px) {
            .team-grid {
              grid-template-columns: 1fr;
              max-width: 380px;
              margin: 0 auto;
            }
            .team-wrapper {
              margin-top: 6rem;
            }
          }
        `}</style>

        <div className="about-container">
          
          {/* =========================================
              PART 1: WHY WE BUILT LOKALENS 
              ========================================= */}
          <div className="mission-header-row">
            <div className="mission-title-area">
              <span className="section-subtitle">Our Mission</span>
              <h2 className="section-title">Why We Built Lokalens</h2>
            </div>
            <div className="mission-main-desc">
              We built Lokalens to modernize how Sri Lankan businesses operate. Current POS systems 
              in the country fall completely short of standard levels, acting merely as digital cash 
              registers. We wanted to change that and build intelligent infrastructure that actually 
              moves the needle for your business.
            </div>
          </div>

          <div className="mission-hero-image">
            <img 
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2000&auto=format&fit=crop" 
              alt="Retail Store Tech" 
            />
          </div>

          <div className="pillar-list">
            <div className="pillar-row">
              <div className="pillar-name">Standardize</div>
              <div className="pillar-desc">
                To elevate the standard of retail technology in Sri Lanka. Most local businesses are stuck using 
                legacy systems that only perform basic functions. Lokalens introduces a global-standard POS 
                equipped with powerful, localized AI capabilities.
              </div>
            </div>
            <div className="pillar-row">
              <div className="pillar-name">Optimize</div>
              <div className="pillar-desc">
                To eradicate the massive problem of overstocking. Retailers consistently lose money by stocking 
                items that won't sell in their specific region. Our demographic forecasting predicts exactly what 
                your local customers want, drastically reducing inventory waste.
              </div>
            </div>
            <div className="pillar-row">
              <div className="pillar-name">Empower</div>
              <div className="pillar-desc">
                To empower local business owners with clarity. We replace the stressful, manual guesswork of 
                inventory purchasing with automated, real-time demand insights, allowing you to focus purely on 
                growing your business and connecting with your community.
              </div>
            </div>
          </div>

          {/* =========================================
              PART 2: THE TEAM
              ========================================= */}
          <div className="team-wrapper">
            <div className="team-header">
              <span className="section-subtitle">Meet Our Team</span>
              <h2 className="section-title">Builders. Operators. Dreamers.</h2>
              <p className="team-desc">
                Lokalens is built by a team that believes in smarter work — not harder work. 
                We come from backgrounds in AI, data science, and product design, united by one goal: 
                to make demographic forecasting accessible to Sri Lankan SMEs.
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-card">
                  
                  <div className="card-info">
                    <div className="member-name">
                      {member.firstName} <br />
                      {member.lastName}
                    </div>
                    <div className="member-role">{member.role}</div>
                  </div>

                  <div className="card-image-wrapper">
                    <img 
                      src={member.image} 
                      alt={`${member.firstName} ${member.lastName}`} 
                      className="team-img" 
                    />
                    
                    <div className="card-socials">
                      <a href={member.linkedin} className="social-btn" aria-label="LinkedIn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a href={member.x} className="social-btn" aria-label="X / Twitter">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Render the Footer at the bottom of the page */}
      <Footer />
    </>
  );
}