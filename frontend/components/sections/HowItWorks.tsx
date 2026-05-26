'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '../ui/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Select Your Province',
    description:
      'Choose from all 9 Sri Lankan provinces. The system immediately loads regional demand patterns, climate data, and cultural event calendars for your area.',
    detail: 'Western · Central · Southern · Northern · Eastern · NW · NC · Uva · Sabaragamuwa',
  },
  {
    number: '02',
    title: 'System Reads Context',
    description:
      'Lokalens analyzes the current week — payday cycles, upcoming holidays, weather trends, tourism activity, and festival seasons affecting your province.',
    detail: 'Vesak · Poya · Sinhala New Year · School Reopening · Payday 15th/30th',
  },
  {
    number: '03',
    title: 'AI Forecasts Demand',
    description:
      'The ML model (XGBoost / Random Forest) predicts demand scores for hundreds of SKUs, ranked by expected sales intensity for the upcoming week.',
    detail: 'Per-product demand score · Confidence band · Historical trend',
  },
  {
    number: '04',
    title: 'Get Ranked Recommendations',
    description:
      'See the top products to prioritize with demand percentages, stocking suggestions, and an AI assistant ready to optimize for your budget.',
    detail: 'Budget-aware · Quantity suggestions · Reason explained',
  },
];

export default function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        }
      );
    }

    stepRefs.current.forEach((step, i) => {
      if (!step) return;
      gsap.fromTo(
        step,
        { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          },
        }
      );
    });
  }, []);

  return (
    <section
      style={{
        padding: '8rem 0',
        background: 'linear-gradient(180deg, #F7FAFC 0%, #EBF5FF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="badge" style={{ marginBottom: '1.2rem' }}>
              How It Works
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: 'var(--dark)',
                letterSpacing: '-0.02em',
              }}
            >
              From province to{' '}
              <span className="gradient-text">prediction</span>
              <br />
              in seconds.
            </h2>
          </div>
        </ScrollReveal>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
          {/* Vertical line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(180deg, var(--blue-primary), var(--blue-accent))',
              transform: 'translateX(-50%)',
              opacity: 0.3,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el: HTMLDivElement | null) => void (stepRefs.current[i] = el)}
              style={{
                display: 'flex',
                gap: '2.5rem',
                marginBottom: '4rem',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
              }}
            >
              {/* Content */}
              <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: 'var(--blue-primary)',
                    letterSpacing: '0.1em',
                    opacity: 0.6,
                  }}
                >
                  STEP {step.number}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--dark)',
                    margin: '0.4rem 0 0.6rem',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--gray-600)',
                    lineHeight: 1.7,
                    fontWeight: 300,
                    marginBottom: '0.6rem',
                  }}
                >
                  {step.description}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--blue-primary)',
                    fontWeight: 600,
                    opacity: 0.7,
                  }}
                >
                  {step.detail}
                </p>
              </div>

              {/* Center dot */}
              <div
                style={{
                  flexShrink: 0,
                  width: '52px',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '0.6rem',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-accent))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-blue)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    color: '#fff',
                  }}
                >
                  {i + 1}
                </div>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}