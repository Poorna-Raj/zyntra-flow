'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

const stats = [
  {
    number: '95%',
    label: 'Forecast Accuracy',
  },
  {
    number: '30%',
    label: 'Waste Reduction',
  },
  {
    number: '9',
    label: 'Sri Lankan Provinces',
  },
  {
    number: '24/7',
    label: 'AI Intelligence',
  },
];

const values = [
  {
    icon: '📊',
    title: 'Data-Driven Decisions',
    desc: 'Every recommendation is powered by forecasting models and contextual intelligence.',
  },
  {
    icon: '🌱',
    title: 'Sustainability First',
    desc: 'Reducing food waste while improving profitability for local SMEs.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    desc: 'Smart inventory forecasting tailored for Sri Lankan business behavior.',
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Navbar />

      <section
        style={{
          background:
            'linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 50%, #F5FAFF 100%)',
          minHeight: '100vh',
          overflow: 'hidden',
          position: 'relative',
          padding: '8rem 1.25rem 6rem',
        }}
      >
        {/* Background Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '999px',
            background: 'rgba(37,99,235,0.08)',
            filter: 'blur(120px)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* TOP BREADCRUMB */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                color: '#64748B',
                fontSize: '0.9rem',
              }}
            >
              Home · About Us
            </span>
          </motion.div>

          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              textAlign: 'center',
              marginBottom: '5rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                background: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.1)',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: '#2563EB',
                  boxShadow: '0 0 12px rgba(37,99,235,0.5)',
                }}
              />

              <span
                style={{
                  color: '#2563EB',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                About Syntrix
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: '-0.06em',
                color: '#0F172A',
                marginBottom: '1.5rem',
              }}
            >
              Shaping Smarter
              <br />

              <span
                style={{
                  background:
                    'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Inventory Decisions
              </span>
            </h1>

            <p
              style={{
                maxWidth: '820px',
                margin: '0 auto',
                color: '#64748B',
                lineHeight: 1.9,
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              }}
            >
              SyntrixLK is a research-driven smart inventory and food waste
              reduction platform designed for Sri Lankan SMEs. We combine AI,
              forecasting, and behavioral intelligence to help businesses
              reduce waste, improve efficiency, and make better operational
              decisions.
            </p>
          </motion.div>

          {/* MAIN GRID */}
          <div
            className="about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 0.9fr',
              gap: '2rem',
              marginBottom: '6rem',
            }}
          >
            {/* LEFT LARGE CARD */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '32px',
                minHeight: '520px',
                background:
                  'linear-gradient(180deg, rgba(15,23,42,0.02), rgba(15,23,42,0.04))',
                border: '1px solid rgba(37,99,235,0.08)',
                boxShadow:
                  '0 30px 80px rgba(15,23,42,0.08), 0 8px 20px rgba(15,23,42,0.04)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <Image
                  src="/images/about-food.jpg"
                  alt="Syntrix"
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(2,6,23,0.15), rgba(2,6,23,0.78))',
                }}
              />

              {/* Content */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '2.5rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '22px',
                      background:
                        'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      color: '#fff',
                      marginBottom: '1.5rem',
                      boxShadow: '0 20px 40px rgba(37,99,235,0.3)',
                    }}
                  >
                    ✦
                  </div>

                  <span
                    style={{
                      color: '#7DD3FC',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Sustainability Focus
                  </span>

                  <h2
                    style={{
                      color: '#fff',
                      fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                      lineHeight: 1.05,
                      fontWeight: 900,
                      letterSpacing: '-0.05em',
                      margin: '1rem 0',
                    }}
                  >
                    Reducing Waste
                    <br />
                    Through AI.
                  </h2>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.8,
                      maxWidth: '520px',
                      fontSize: '1rem',
                    }}
                  >
                    Syntrix helps food businesses optimize ingredient usage
                    with intelligent forecasting and regional demand analysis.
                  </p>
                </div>

                {/* Bottom Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2,1fr)',
                    gap: '1rem',
                  }}
                >
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '1.2rem',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(14px)',
                      }}
                    >
                      <h3
                        style={{
                          color: '#fff',
                          fontSize: '1.8rem',
                          fontWeight: 900,
                          marginBottom: '0.35rem',
                        }}
                      >
                        {stat.number}
                      </h3>

                      <p
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.9rem',
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              {/* BRAND CARD */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '32px',
                  padding: '2.5rem',
                  background: '#0F172A',
                  minHeight: '250px',
                  boxShadow:
                    '0 25px 60px rgba(15,23,42,0.2), 0 8px 20px rgba(15,23,42,0.08)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-40px',
                    width: '200px',
                    height: '200px',
                    borderRadius: '999px',
                    background: 'rgba(37,99,235,0.25)',
                    filter: 'blur(70px)',
                  }}
                />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '18px',
                        background:
                          'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: '1.3rem',
                      }}
                    >
                      S
                    </div>

                    <div>
                      <h3
                        style={{
                          color: '#fff',
                          fontSize: '1.8rem',
                          fontWeight: 900,
                          letterSpacing: '-0.04em',
                        }}
                      >
                        SYNTRIX
                      </h3>

                      <p
                        style={{
                          color: '#94A3B8',
                          fontSize: '0.9rem',
                        }}
                      >
                        Smart Inventory Intelligence
                      </p>
                    </div>
                  </div>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      lineHeight: 1.8,
                      fontSize: '0.98rem',
                    }}
                  >
                    Helping Sri Lankan SMEs reduce overbuying, improve
                    inventory efficiency, and forecast smarter with AI-powered
                    decision systems.
                  </p>
                </div>
              </motion.div>

              {/* VALUES */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                }}
              >
                {values.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.12,
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -6,
                    }}
                    style={{
                      padding: '1.5rem',
                      borderRadius: '24px',
                      background: '#fff',
                      border: '1px solid rgba(37,99,235,0.08)',
                      boxShadow:
                        '0 20px 50px rgba(15,23,42,0.06), 0 4px 12px rgba(15,23,42,0.04)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '16px',
                          background:
                            'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.3rem',
                          flexShrink: 0,
                          color: '#fff',
                          boxShadow: '0 12px 24px rgba(37,99,235,0.18)',
                        }}
                      >
                        {value.icon}
                      </div>

                      <div>
                        <h4
                          style={{
                            color: '#0F172A',
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            marginBottom: '0.45rem',
                          }}
                        >
                          {value.title}
                        </h4>

                        <p
                          style={{
                            color: '#64748B',
                            lineHeight: 1.7,
                            fontSize: '0.92rem',
                          }}
                        >
                          {value.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .about-grid {
            align-items: stretch;
          }

          @media (max-width: 1100px) {
            .about-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 640px) {
            .about-grid {
              gap: 1.5rem !important;
            }
          }
        `}</style>
      </section>

      <Footer />
    </>
  );
}