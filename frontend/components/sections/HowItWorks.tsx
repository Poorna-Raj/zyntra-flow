'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: '📍',
    title: 'Select Your Province',
    description:
      'Choose from all 9 Sri Lankan provinces. Lokalens instantly loads regional demand behavior, seasonal trends, and local buying intelligence.',
    detail:
      'Western · Central · Southern · Northern · Eastern · NW · NC · Uva · Sabaragamuwa',
    color: '#2563EB',
    glow: 'rgba(37,99,235,0.18)',
  },
  {
    number: '02',
    icon: '📅',
    title: 'System Reads Context',
    description:
      'The engine analyzes live contextual signals including holidays, weather, tourism activity, and payday cycles affecting demand.',
    detail:
      'Vesak · Poya · Sinhala New Year · School Reopening · Payday Cycles',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.18)',
  },
  {
    number: '03',
    icon: '🤖',
    title: 'AI Forecasts Demand',
    description:
      'Machine learning models predict SKU-level demand using historical patterns, regional activity, and real-time forecasting logic.',
    detail:
      'XGBoost · Random Forest · Confidence Score · Trend Detection',
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.18)',
  },
  {
    number: '04',
    icon: '📊',
    title: 'Get Ranked Recommendations',
    description:
      'Receive smart stocking recommendations, quantity suggestions, and AI-generated reasoning tailored to your inventory goals.',
    detail:
      'Budget-aware · Quantity Suggestions · AI Reasoning · Risk Reduction',
    color: '#1D4ED8',
    glow: 'rgba(29,78,216,0.18)',
  },
];

export default function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          {
            scaleY: 0,
            transformOrigin: 'top center',
          },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 20%',
              end: 'bottom bottom',
              scrub: 1,
            },
          }
        );
      }

      stepRefs.current.forEach((step) => {
        if (!step) return;

        gsap.fromTo(
          step,
          {
            opacity: 0,
            y: 50,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 45%, #EEF6FF 100%)',
        padding: 'clamp(5rem, 10vw, 9rem) 1.25rem',
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: '420px',
            height: '420px',
            borderRadius: '999px',
            background: 'rgba(37,99,235,0.08)',
            filter: 'blur(120px)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            width: '420px',
            height: '420px',
            borderRadius: '999px',
            background: 'rgba(14,165,233,0.08)',
            filter: 'blur(120px)',
          }}
        />

        {/* Grid Pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(37,99,235,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.04) 1px, transparent 1px)',
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
          maxWidth: '1280px',
          margin: '0 auto',
        }}
      >
        {/* HEADER */}
        <ScrollReveal>
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(4rem, 7vw, 7rem)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.55rem 1rem',
                borderRadius: '999px',
                background: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.12)',
                marginBottom: '1.5rem',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: '#2563EB',
                  boxShadow: '0 0 10px rgba(37,99,235,0.5)',
                }}
              />

              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#2563EB',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                How It Works
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.05em',
                color: '#0F172A',
                marginBottom: '1.25rem',
              }}
            >
              From Province
              <br />

              <span
                style={{
                  background:
                    'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                To Prediction
              </span>
            </h2>

            <p
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                color: '#475569',
                lineHeight: 1.8,
                fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
              }}
            >
              Lokalens transforms regional signals into actionable inventory
              forecasting using AI-powered contextual intelligence built for Sri
              Lankan businesses.
            </p>
          </div>
        </ScrollReveal>

        {/* TIMELINE */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1150px',
            margin: '0 auto',
          }}
        >
          {/* Static Line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              transform: 'translateX(-50%)',
              background: 'rgba(37,99,235,0.12)',
            }}
          />

          {/* Animated Line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '3px',
              transform: 'translateX(-50%)',
              borderRadius: '999px',
              background:
                'linear-gradient(180deg, #2563EB 0%, #3B82F6 50%, #0EA5E9 100%)',
              boxShadow: '0 0 20px rgba(37,99,235,0.25)',
            }}
          />

          {steps.map((step, i) => {
            const isEven = i % 2 === 0;

            return (
              <div
                key={i}
                ref={(el) => void (stepRefs.current[i] = el)}
                className="timeline-step"
                style={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: '1fr 90px 1fr',
                  gap: '2rem',
                  marginBottom: 'clamp(3rem, 6vw, 6rem)',
                  alignItems: 'center',
                }}
              >
                {/* LEFT */}
                <div
                  className="timeline-card-wrap"
                  style={{
                    display: 'flex',
                    justifyContent: isEven ? 'flex-end' : 'flex-start',
                  }}
                >
                  {isEven && (
                    <TimelineCard step={step} align="right" />
                  )}
                </div>

                {/* CENTER ICON */}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5,
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                    }}
                    style={{
                      position: 'absolute',
                      width: '76px',
                      height: '76px',
                      borderRadius: '999px',
                      background: step.glow,
                      filter: 'blur(24px)',
                    }}
                  />

                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '24px',
                      background: '#FFFFFF',
                      border: `1px solid ${step.color}22`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow:
                        '0 15px 40px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.04)',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{step.icon}</span>

                    <span
                      style={{
                        marginTop: '0.15rem',
                        fontSize: '0.68rem',
                        color: step.color,
                        fontWeight: 800,
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  className="timeline-card-wrap"
                  style={{
                    display: 'flex',
                    justifyContent: isEven ? 'flex-start' : 'flex-end',
                  }}
                >
                  {!isEven && (
                    <TimelineCard step={step} align="left" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE RESPONSIVE */}
      <style jsx>{`
        @media (max-width: 900px) {
          .timeline-step {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }

          .timeline-card-wrap {
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}

function TimelineCard({
  step,
  align,
}: {
  step: any;
  align: 'left' | 'right';
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 18,
      }}
      style={{
        width: '100%',
        maxWidth: '430px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '28px',
        padding: '2rem',
        background: '#FFFFFF',
        border: '1px solid rgba(37,99,235,0.08)',
        textAlign: align === 'right' ? 'right' : 'left',
        boxShadow:
          '0 25px 60px rgba(15,23,42,0.08), 0 4px 12px rgba(15,23,42,0.04)',
      }}
    >
      {/* Top Glow Accent */}
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          [align === 'right' ? 'right' : 'left']: '-30px',
          width: '120px',
          height: '120px',
          borderRadius: '999px',
          background: step.glow,
          filter: 'blur(50px)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <span
          style={{
            display: 'inline-block',
            marginBottom: '1rem',
            padding: '0.45rem 0.8rem',
            borderRadius: '999px',
            background: `${step.color}12`,
            color: step.color,
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Step {step.number}
        </span>

        <h3
          style={{
            color: '#0F172A',
            fontSize: 'clamp(1.2rem, 2vw, 1.45rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '0.9rem',
          }}
        >
          {step.title}
        </h3>

        <p
          style={{
            color: '#475569',
            lineHeight: 1.75,
            fontSize: '0.95rem',
            marginBottom: '1rem',
          }}
        >
          {step.description}
        </p>

        <div
          style={{
            paddingTop: '1rem',
            borderTop: '1px solid rgba(37,99,235,0.08)',
            color: step.color,
            fontSize: '0.82rem',
            fontWeight: 700,
            lineHeight: 1.7,
          }}
        >
          {step.detail}
        </div>
      </div>
    </motion.div>
  );
}