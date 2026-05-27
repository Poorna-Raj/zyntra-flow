'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 0,
    icon: '📍',
    title: 'Province Intelligence',
    short: 'PROVINCE',
    color: '#1E90FF',
    glow: 'rgba(30,144,255,0.45)',
    description:
      'Demand models for all 9 provinces — climate, culture, and economic activity baked in.',
  },
  {
    id: 1,
    icon: '📅',
    title: 'Cultural Signals',
    short: 'CULTURAL',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.55)',
    description:
      'Vesak, Poya, Ramadan, New Year — every festival and payday cycle shapes the forecast.',
  },
  {
    id: 2,
    icon: '🛒',
    title: 'SKU Forecasting',
    short: 'SKU',
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.45)',
    description:
      'Per-product demand scores. Know exactly which SKU moves faster in your region.',
  },
  {
    id: 3,
    icon: '🤖',
    title: 'AI Assistant',
    short: 'AI BOT',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.45)',
    description:
      'Budget-aware stocking recommendations with full reasoning — ready in seconds.',
  },
  {
    id: 4,
    icon: '📊',
    title: 'Visual Dashboard',
    short: 'DASHBOARD',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.45)',
    description:
      'Heat maps, trend charts, confidence bands, and regional comparisons in one view.',
  },
];

export default function SriLankaPerfectVerticalFeatures() {
  const [active, setActive] = useState<number>(3);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-head',
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.feature-card',
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        mapContainerRef.current,
        {
          opacity: 0,
          scale: 0.92,
          rotate: -3,
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const activeFeature = features[active];

  return (
    <section
      id="features"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) 1.2rem',
        background: '#000',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Ambient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top left, rgba(14,165,233,0.10), transparent 30%), radial-gradient(circle at bottom right, rgba(139,92,246,0.12), transparent 30%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          maxWidth: '1350px',
          margin: '0 auto',
          borderRadius: '34px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.06)',
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.96) 0%, rgba(3,3,3,1) 100%)',
          padding: 'clamp(2rem, 5vw, 5rem)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
            maskImage:
              'radial-gradient(circle at center, black 40%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* HEADER */}
        <div
          className="reveal-head"
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 7vw, 6rem)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <p
            style={{
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#38BDF8',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            Core Capabilities
          </p>

          <h2
            style={{
              fontSize: 'clamp(2.3rem, 7vw, 4.5rem)',
              lineHeight: 1,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: '#fff',
            }}
          >
            The Intelligence Layer
          </h2>

          <p
            style={{
              margin: '1rem auto 0',
              maxWidth: '680px',
              color: 'rgba(255,255,255,0.52)',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              lineHeight: 1.7,
            }}
          >
            Hyper-local forecasting powered by regional behavior, AI reasoning,
            and live operational intelligence.
          </p>
        </div>

        {/* MAIN GRID */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          {/* LEFT VISUAL */}
          <div
            ref={mapContainerRef}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '520px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Glow Ring */}
            <motion.div
              animate={{
                background: `radial-gradient(circle, ${activeFeature.glow} 0%, transparent 70%)`,
              }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                width: '110%',
                height: '110%',
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.9,
                zIndex: 1,
              }}
            />

            {/* Floating Orb */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '999px',
                background: activeFeature.glow,
                filter: 'blur(70px)',
                opacity: 0.45,
                zIndex: 1,
              }}
            />

            {/* MAP */}
            <motion.img
              key={activeFeature.id}
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
              }}
              src="/maps/sri-lanka-satellite.png"
              alt="Sri Lanka Intelligence Map"
              style={{
                width: '100%',
                maxWidth: '460px',
                height: 'auto',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 2,
                filter:
                  'brightness(1.2) contrast(1.15) drop-shadow(0 30px 60px rgba(0,0,0,0.8))',
              }}
            />

            {/* FLOATING CARD */}
            <motion.div
              animate={{
                borderColor: activeFeature.color,
                boxShadow: `0 30px 80px ${activeFeature.glow}`,
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: '5%',
                width: 'min(90%, 290px)',
                background: 'rgba(12,12,12,0.72)',
                border: '1px solid',
                borderRadius: '24px',
                backdropFilter: 'blur(24px)',
                padding: '1.5rem',
                zIndex: 3,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        background: `${activeFeature.color}20`,
                        border: `1px solid ${activeFeature.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                      }}
                    >
                      {activeFeature.icon}
                    </div>

                    <div>
                      <p
                        style={{
                          color: activeFeature.color,
                          fontWeight: 800,
                          letterSpacing: '0.14em',
                          fontSize: '0.72rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        LIVE MODULE
                      </p>

                      <h3
                        style={{
                          color: '#fff',
                          fontSize: '1rem',
                          fontWeight: 700,
                        }}
                      >
                        {activeFeature.title}
                      </h3>
                    </div>
                  </div>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6,
                      fontSize: '0.88rem',
                    }}
                  >
                    {activeFeature.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '0.4rem',
              }}
            >
              Explore Operational Layers
            </p>

            {features.map((f) => {
              const isCurrent = active === f.id;

              return (
                <motion.div
                  whileHover={{
                    scale: 1.015,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  key={f.id}
                  className="feature-card"
                  onClick={() => setActive(f.id)}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.3rem',
                    borderRadius: '22px',
                    cursor: 'pointer',
                    border: `1px solid ${
                      isCurrent
                        ? `${f.color}60`
                        : 'rgba(255,255,255,0.05)'
                    }`,
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))'
                      : 'rgba(255,255,255,0.015)',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrent
                      ? `0 10px 40px -10px ${f.glow}`
                      : 'none',
                  }}
                >
                  {/* Active Glow */}
                  {isCurrent && (
                    <motion.div
                      layoutId="activeGlow"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(90deg, ${f.glow}, transparent)`,
                        opacity: 0.15,
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      flexShrink: 0,
                      background: isCurrent
                        ? `${f.color}`
                        : 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: isCurrent
                        ? `0 10px 25px ${f.glow}`
                        : 'none',
                    }}
                  >
                    {f.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <h3
                        style={{
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1rem',
                        }}
                      >
                        {f.title}
                      </h3>

                      <span
                        style={{
                          color: isCurrent
                            ? f.color
                            : 'rgba(255,255,255,0.35)',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          letterSpacing: '0.12em',
                        }}
                      >
                        {f.short}
                      </span>
                    </div>

                    <p
                      style={{
                        marginTop: '0.55rem',
                        color: 'rgba(255,255,255,0.58)',
                        lineHeight: 1.6,
                        fontSize: '0.88rem',
                      }}
                    >
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* CTA */}
            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#forecast"
                style={{
                  textDecoration: 'none',
                  padding: '1rem 1.7rem',
                  borderRadius: '999px',
                  background: '#0EA5E9',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  boxShadow: '0 10px 30px rgba(14,165,233,0.3)',
                }}
              >
                Start Forecasting →
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                href="#roadmap"
                style={{
                  textDecoration: 'none',
                  padding: '1rem 1.7rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.82)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  backdropFilter: 'blur(10px)',
                }}
              >
                View Roadmap
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}