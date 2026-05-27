'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    phase: 'MVP',
    label: 'NOW',
    status: 'active',
    year: '2026',
    icon: '🚀',
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.28)',
    items: [
      'Province-level product forecasting',
      'Contextual behavioral signals',
      'Demand ranking dashboard',
      'Synthetic Sri Lankan dataset',
      'AI stocking chatbot (beta)',
    ],
  },
  {
    phase: 'V2',
    label: 'Q3 2026',
    status: 'upcoming',
    year: '2026',
    icon: '⚡',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.28)',
    items: [
      'POS & CSV data integration',
      'Personalized store forecasting',
      'Model retraining with real data',
      'Confidence interval visualization',
      'Multi-language support (Sinhala)',
    ],
  },
  {
    phase: 'V3',
    label: 'Q1 2027',
    status: 'future',
    year: '2027',
    icon: '🌍',
    color: '#38BDF8',
    glow: 'rgba(56,189,248,0.28)',
    items: [
      'Mobile app for field managers',
      'Real-time inventory alerts',
      'Pharmacy & clothing expansion',
      'Supplier integration APIs',
      'Regional franchise dashboards',
    ],
  },
];

export default function ConnectedRoadmap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.roadmap-reveal', {
        opacity: 0,
        y: 35,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: 'left center',
          },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom bottom',
              scrub: 1,
            },
          }
        );
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #020617 0%, #030712 50%, #000000 100%)',
        padding: 'clamp(5rem, 10vw, 9rem) 1.25rem',
      }}
    >
      {/* BACKGROUND GLOW */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '520px',
            height: '520px',
            borderRadius: '999px',
            background: 'rgba(14,165,233,0.12)',
            filter: 'blur(140px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '540px',
            height: '540px',
            borderRadius: '999px',
            background: 'rgba(139,92,246,0.12)',
            filter: 'blur(160px)',
          }}
        />

        {/* GRID */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
            maskImage:
              'radial-gradient(circle at center, black 30%, transparent 100%)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1350px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'clamp(4rem, 7vw, 7rem)',
          }}
        >
          <div
            className="roadmap-reveal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.55rem 1rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '1.4rem',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '999px',
                background: '#38BDF8',
                boxShadow: '0 0 12px #38BDF8',
              }}
            />

            <span
              style={{
                fontSize: '0.72rem',
                color: '#7DD3FC',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              Product Roadmap
            </span>
          </div>

          <h2
            className="roadmap-reveal"
            style={{
              fontSize: 'clamp(2.7rem, 7vw, 5.5rem)',
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: '-0.06em',
              color: '#fff',
              marginBottom: '1.4rem',
            }}
          >
            Building The Future
            <br />

            <span
              style={{
                background:
                  'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Of Lokalens
            </span>
          </h2>

          <p
            className="roadmap-reveal"
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              color: 'rgba(255,255,255,0.58)',
              lineHeight: 1.8,
              fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
            }}
          >
            A clear visual journey showing how Lokalens evolves from an AI
            forecasting prototype into a complete intelligent retail ecosystem
            for Sri Lankan businesses.
          </p>
        </div>

        {/* JOURNEY START */}
        <div
          className="roadmap-reveal"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '4rem',
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: '1.15rem 2.5rem',
              borderRadius: '999px',
              background:
                'linear-gradient(135deg, rgba(14,165,233,0.18), rgba(139,92,246,0.18))',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(18px)',
              boxShadow:
                '0 25px 60px rgba(14,165,233,0.15), 0 8px 20px rgba(0,0,0,0.35)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
                transform: 'translateX(-100%)',
                animation: 'shine 5s linear infinite',
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '0.9rem',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: '#fff',
                  boxShadow: '0 10px 30px rgba(56,189,248,0.25)',
                }}
              >
                ✦
              </div>

              <div>
                <p
                  style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    marginBottom: '0.2rem',
                  }}
                >
                  Journey Begins
                </p>

                <p
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.85rem',
                  }}
                >
                  Launching June 2026
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ROADMAP LINE */}
        <div
          style={{
            position: 'relative',
            marginBottom: '4rem',
          }}
        >
          {/* Static Line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '2px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.08)',
            }}
          />

          {/* Active Animated Line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '3px',
              transform: 'translateY(-50%)',
              background:
                'linear-gradient(90deg, #0EA5E9 0%, #8B5CF6 50%, #38BDF8 100%)',
              boxShadow: '0 0 20px rgba(14,165,233,0.35)',
              borderRadius: '999px',
            }}
          />

          {/* TIMELINE NODES */}
          <div
            className="roadmap-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {phases.map((phase, i) => {
              const isActive = phase.status === 'active';

              return (
                <motion.div
                  whileHover={{
                    y: -10,
                  }}
                  key={i}
                  ref={(el) => void (cardsRef.current[i] = el)}
                  style={{
                    position: 'relative',
                  }}
                >
                  {/* NODE */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '2rem',
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.06, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      style={{
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: '-12px',
                          borderRadius: '999px',
                          background: phase.glow,
                          filter: 'blur(20px)',
                        }}
                      />

                      <div
                        style={{
                          width: '86px',
                          height: '86px',
                          borderRadius: '28px',
                          background:
                            'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                          border: `1px solid ${phase.color}55`,
                          backdropFilter: 'blur(18px)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 20px 50px ${phase.glow}`,
                        }}
                      >
                        <span style={{ fontSize: '1.6rem' }}>
                          {phase.icon}
                        </span>

                        <span
                          style={{
                            marginTop: '0.3rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: '#fff',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {phase.phase}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* CARD */}
                  <div
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '30px',
                      padding: '2rem',
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
                      border: isActive
                        ? `1px solid ${phase.color}55`
                        : '1px solid rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(24px)',
                      minHeight: '420px',
                      boxShadow: isActive
                        ? `0 30px 80px ${phase.glow}`
                        : '0 20px 60px rgba(0,0,0,0.35)',
                    }}
                  >
                    {/* Glow */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-40px',
                        right: '-40px',
                        width: '160px',
                        height: '160px',
                        borderRadius: '999px',
                        background: phase.glow,
                        filter: 'blur(60px)',
                      }}
                    />

                    {/* TOP */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        marginBottom: '2rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem',
                          marginBottom: '1rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            padding: '0.45rem 0.8rem',
                            borderRadius: '999px',
                            background: `${phase.color}18`,
                            color: phase.color,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.12em',
                          }}
                        >
                          {phase.label}
                        </span>

                        <span
                          style={{
                            color: 'rgba(255,255,255,0.35)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                          }}
                        >
                          {phase.year}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: '2rem',
                          fontWeight: 900,
                          letterSpacing: '-0.04em',
                          color: '#fff',
                          marginBottom: '0.8rem',
                        }}
                      >
                        {phase.phase}
                      </h3>

                      <p
                        style={{
                          color: 'rgba(255,255,255,0.58)',
                          lineHeight: 1.7,
                          fontSize: '0.95rem',
                        }}
                      >
                        {phase.status === 'active'
                          ? 'Current active development phase focused on validating forecasting accuracy and core intelligence.'
                          : phase.status === 'upcoming'
                          ? 'Expanding intelligence capabilities with real business data and operational integrations.'
                          : 'Scaling Lokalens into a complete AI-driven retail ecosystem platform.'}
                      </p>
                    </div>

                    {/* FEATURES */}
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.9rem',
                      }}
                    >
                      {phase.items.map((item, j) => (
                        <div
                          key={j}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.9rem',
                            padding: '0.9rem 1rem',
                            borderRadius: '18px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '999px',
                              background: `${phase.color}18`,
                              color: phase.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              marginTop: '0.15rem',
                            }}
                          >
                            ✓
                          </div>

                          <p
                            style={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                            }}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESPONSIVE */}
      <style jsx>{`
        .roadmap-grid {
          align-items: start;
        }

        @media (max-width: 1100px) {
          .roadmap-grid {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
        }

        @keyframes shine {
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </section>
  );
}