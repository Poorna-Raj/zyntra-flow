'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

const teamMembers = [
  {
    name: 'Poorna Rajapaksha',
    role: 'Project Lead / ML Engineer',
    bio: 'Designing scalable product architecture and crafting elegant digital experiences focused on usability and innovation.',
    image: '/team/poorna.jpg',
    tagId: 'NIRA-01',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    name: 'Arosha Bandara',
    role: 'DevOps Engineer',
    bio: 'Transforming research insights and stakeholder requirements into smart product decisions and business direction.',
    image: '/team/arosha.png',
    tagId: 'NIRA-02',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    name: 'Sachintha Perera',
    role: 'Frontend Developer',
    bio: 'Building reliable backend systems, cloud integrations, and optimized data-driven application workflows.',
    image: '/team/sachintha.jpeg',
    tagId: 'NIRA-03',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
  },
  {
    name: 'Kusal Adithya',
    role: 'Backend Engineer',
    bio: 'Creating engaging visual storytelling, motion graphics, and modern brand-focused media experiences.',
    image: '/team/kusal.jpeg',
    tagId: 'NIRA-04',
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
    },
  },
];

const stats = [
  { value: '04', label: 'Core Team Members' },
  { value: '49%', label: 'Project Completion' },
  { value: '25+', label: 'Research Findings' },
  { value: '100%', label: 'Passion & Dedication' },
];

/* ── Icons ── */
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── Social button ── */
function SocialBtn({
  href,
  hoverBg,
  children,
}: {
  href: string;
  hoverBg: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: hovered ? hoverBg : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: hovered ? '#fff' : '#cbd5e1',
        textDecoration: 'none',
        transition: 'background 0.2s, color 0.2s, transform 0.15s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

/* ── Team card — tap to reveal on mobile, hover on desktop ── */
function TeamCard({
  member,
  idx,
  isMobile,
}: {
  member: typeof teamMembers[0];
  idx: number;
  isMobile: boolean;
}) {
  const [tapped, setTapped] = useState(false);

  // On mobile: stagger offset is disabled (looks bad single-column)
  const marginTop = isMobile ? '0' : idx % 2 === 1 ? '40px' : '0px';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`lk-card${tapped ? ' lk-card--tapped' : ''}`}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        height: isMobile ? '420px' : '480px',
        cursor: 'default',
        marginTop,
      }}
      onClick={() => isMobile && setTapped((p) => !p)}
    >
      {/* Photo */}
      <img
        src={member.image}
        alt={member.name}
        className="lk-card-photo"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.35) 45%, transparent 75%)',
          zIndex: 1,
        }}
      />

      {/* Tag badge */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 3,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '999px',
          padding: '4px 12px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#fff',
          textTransform: 'uppercase',
        }}
      >
        {member.tagId}
      </div>

      {/* Mobile tap hint */}
      {isMobile && !tapped && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 3,
            background: 'rgba(37,99,235,0.85)',
            borderRadius: '999px',
            padding: '4px 10px',
            fontSize: '10px',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '0.06em',
          }}
        >
          Tap ↑
        </div>
      )}

      {/* Static name — always visible */}
      <div
        className="lk-card-static"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          padding: '1.2rem',
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <p
          style={{
            fontSize: '0.68rem',
            color: '#93c5fd',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0 0 4px',
          }}
        >
          {member.role}
        </p>
        <h3
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {member.name}
        </h3>
      </div>

      {/* Slide-up panel */}
      <div
        className="lk-card-panel"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          background: 'rgba(2,6,23,0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(147,197,253,0.2)',
          padding: '1.2rem',
          transform: tapped ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.42s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <p
          style={{
            fontSize: '0.65rem',
            color: '#93c5fd',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: '0 0 4px',
          }}
        >
          {member.tagId} · {member.role}
        </p>
        <h4
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 0.65rem',
          }}
        >
          {member.name}
        </h4>
        <div
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.1)',
            marginBottom: '0.8rem',
          }}
        />
        <p
          style={{
            fontSize: '0.8rem',
            color: '#94a3b8',
            lineHeight: 1.7,
            margin: '0 0 1rem',
            fontWeight: 300,
          }}
        >
          {member.bio}
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SocialBtn href={member.socials.linkedin} hoverBg="#2563eb">
            <LinkedInIcon />
          </SocialBtn>
          <SocialBtn href={member.socials.github} hoverBg="#1e293b">
            <GitHubIcon />
          </SocialBtn>
          <SocialBtn href={member.socials.twitter} hoverBg="#0ea5e9">
            <TwitterIcon />
          </SocialBtn>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function TeamPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <>
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }

        /* ── Card hover (desktop only) ── */
        @media (hover: hover) {
          .lk-card:hover .lk-card-photo { transform: scale(1.07); }
          .lk-card:hover .lk-card-panel { transform: translateY(0) !important; }
          .lk-card:hover .lk-card-static { transform: translateY(-8px); }
        }

        .lk-card { box-shadow: 0 8px 40px rgba(0,0,0,0.18); }

        /* ── Tapped state (mobile) ── */
        .lk-card--tapped .lk-card-static { transform: translateY(-8px); }

        /* ── Stat card ── */
        .lk-stat-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 2rem 1rem;
          text-align: center;
          transition: background 0.25s, border-color 0.25s;
        }
        .lk-stat-card:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(147,197,253,0.25);
        }

        /* ════════════════════════════
           RESPONSIVE GRID
        ════════════════════════════ */

        /* Mobile: single column, no stagger */
        .lk-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        /* Tablet: 2 columns */
        @media (min-width: 640px) {
          .lk-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
        }

        /* Desktop: 4 columns */
        @media (min-width: 1024px) {
          .lk-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }

        /* ════════════════════════════
           HERO SECTION SPACING
        ════════════════════════════ */
        .lk-hero {
          padding-top: 120px;
          padding-bottom: 60px;
        }
        @media (min-width: 768px) {
          .lk-hero {
            padding-top: 160px;
            padding-bottom: 80px;
          }
        }

        .lk-hero-inner {
          margin-bottom: 3rem;
        }
        @media (min-width: 768px) {
          .lk-hero-inner {
            margin-bottom: 5rem;
          }
        }

        /* ════════════════════════════
           STATS SECTION
        ════════════════════════════ */
        .lk-stats-wrap {
          padding: 2.5rem 1.25rem;
          border-radius: 24px;
        }
        @media (min-width: 768px) {
          .lk-stats-wrap {
            padding: 4rem 2.5rem;
            border-radius: 32px;
          }
        }

        .lk-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .lk-stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* ════════════════════════════
           PADDING
        ════════════════════════════ */
        .lk-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }
        @media (min-width: 640px) {
          .lk-container { padding: 0 1.75rem; }
        }
        @media (min-width: 1024px) {
          .lk-container { padding: 0 2rem; }
        }

        .lk-stats-section {
          padding-bottom: 80px;
          padding-top: 16px;
        }
        @media (min-width: 768px) {
          .lk-stats-section {
            padding-bottom: 120px;
            padding-top: 20px;
          }
        }
      `}</style>

      <main style={{ background: '#f0f4f8', minHeight: '100vh', overflow: 'hidden' }}>

        {/* ── HERO ── */}
        <section ref={heroRef} className="lk-hero" style={{ position: 'relative', overflow: 'hidden' }}>

          {/* Ghost "04" background number — hidden on small screens */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: '60px',
              right: '-40px',
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(120px, 22vw, 320px)',
              fontWeight: 900,
              color: 'rgba(15,23,42,0.04)',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            04
          </div>

          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '700px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(59,130,246,0.09) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div className="lk-container" style={{ position: 'relative', zIndex: 2 }}>

            {/* Heading block */}
            <motion.div
              className="lk-hero-inner"
              style={{ y: titleY, opacity: titleOpacity, textAlign: 'center' }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#2563eb',
                    display: 'inline-block',
                  }}
                />
                Lokalens Team
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'clamp(2.6rem, 7vw, 6.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.04em',
                  color: '#0f172a',
                  margin: '0 auto 1rem',
                }}
              >
                Four Minds.
                <br />
                <span style={{ color: '#1d4ed8' }}>One Vision.</span>
              </motion.h1>

              {/* Rule */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.55, delay: 0.35 }}
                style={{
                  width: '48px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
                  borderRadius: '2px',
                  margin: '0 auto 1.25rem',
                  transformOrigin: 'left',
                }}
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3 }}
                style={{
                  maxWidth: '520px',
                  margin: '0 auto',
                  color: '#64748b',
                  fontSize: 'clamp(0.9rem, 2vw, 1.02rem)',
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                A passionate 4-member team building intelligent digital systems focused on
                inventory optimization, food-waste reduction, and smarter SME operations.
              </motion.p>
            </motion.div>

            {/* ── CARD GRID ── */}
            <div className="lk-grid">
              {teamMembers.map((member, idx) => (
                <TeamCard
                  key={member.name}
                  member={member}
                  idx={idx}
                  // isMobile prop drives tap behaviour — use CSS breakpoint detection via JS
                  // We default to false; CSS handles layout, JS handles interaction
                  isMobile={false}
                />
              ))}
            </div>

            {/* Decorative rule */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '3rem',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(15,23,42,0.1)' }} />
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                Lokalens · Est. 2024
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(15,23,42,0.1)' }} />
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="lk-stats-section">
          <div className="lk-container">
            <div
              className="lk-stats-wrap"
              style={{
                background: '#020617',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Inner glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '-80px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '500px',
                  height: '300px',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, rgba(37,99,235,0.18) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '2.5rem',
                  position: 'relative',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#3b82f6',
                    marginBottom: '0.5rem',
                  }}
                >
                  By The Numbers
                </p>
                <h2
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                    fontWeight: 800,
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  Small Team.{' '}
                  <span style={{ color: '#60a5fa' }}>Big Vision.</span>
                </h2>
              </div>

              <div className="lk-stats-grid" style={{ position: 'relative' }}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="lk-stat-card"
                    whileHover={{ scale: 1.04 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <div
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 900,
                        color: '#fff',
                        lineHeight: 1,
                        marginBottom: '8px',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        width: '28px',
                        height: '2px',
                        background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
                        borderRadius: '2px',
                        margin: '0 auto 10px',
                      }}
                    />
                    <div
                      style={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 400,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}