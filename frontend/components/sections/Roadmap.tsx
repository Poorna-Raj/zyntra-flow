'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    phase: 'MVP',
    label: 'Now',
    status: 'active',
    color: '#0EA5E9', // Hyper Blue
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
    color: '#8B5CF6', // Vibrant Purple
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
    color: '#0EA5E9', // Hyper Blue fallback or unified theme accent
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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Reveal Header items
      gsap.from('.roadmap-header', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });

      // 2. Animate the connecting line tree path matching scroll position
      gsap.fromTo('.tree-path', 
        { strokeDashoffset: 1000, strokeDasharray: 1000 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 1,
          }
        }
      );

      // 3. Stagger slide-in for Phase cards as tree links resolve
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
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
        padding: '8rem 2rem',
        background: '#030712', // Rich Dark Theme background environment
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Premium Angular/Radial Gradient Accent Mesh in upper-right corner */}
      <div 
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(14,165,233,0.05) 50%, transparent 100%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 1
        }} 
      />

      {/* ── HEADER FRAME ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
        <span 
          className="roadmap-header"
          style={{ 
            background: 'rgba(197, 243, 123, 0.1)', 
            color: '#A3E635', 
            border: '1px solid rgba(163, 230, 53, 0.2)',
            padding: '0.4rem 1rem', 
            borderRadius: '100px', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            display: 'inline-block',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          Roadmap
        </span>
        <h2 
          className="roadmap-header"
          style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}
        >
          Our future path with <span style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lokalens</span>
        </h2>
        <p className="roadmap-header" style={{ color: '#9CA3AF', fontSize: '1rem', fontWeight: 400 }}>
          From idea to impact.
        </p>
      </div>

      <div style={{ maxWidth: '1140px', margin: '0 auto', position: 'relative' }}>
        
        {/* ── JUNCTION NODE: JOURNEY START ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem', position: 'relative', zIndex: 3 }}>
          <div 
            className="roadmap-header"
            style={{
              background: 'linear-gradient(135deg, #C9F278 0%, #A3E635 100%)', // Multi-tone custom gradient fill
              color: '#1A2E05',
              padding: '1.1rem 2.5rem',
              borderRadius: '100px',
              fontSize: '1.15rem',
              fontWeight: 600,
              boxShadow: '0 10px 40px rgba(163, 230, 53, 0.25)',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center'
            }}
          >
            Our journey begins in 2026 June
          </div>
        </div>

        {/* ── VECTOR PATH TREE LINK LAYER ── */}
        <div style={{ position: 'absolute', top: '2.5rem', left: 0, width: '100%', height: '120px', pointerEvents: 'none', zIndex: 1 }}>
          <svg ref={lineRef} width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
            {/* Base Underlay Track Line */}
            <path d="M 500,0 L 500,45 M 166,45 L 834,45 M 166,45 L 166,100 M 500,45 L 500,100 M 834,45 L 834,100" fill="none" stroke="#1F2937" strokeWidth="2" />
            {/* Animated Active Foreground Core Trace */}
            <path className="tree-path" d="M 500,0 L 500,45 M 166,45 L 834,45 M 166,45 L 166,100 M 500,45 L 500,100 M 834,45 L 834,100" fill="none" stroke="#4B5563" strokeWidth="2" />
          </svg>
        </div>

        {/* ── 3-COLUMN LAYOUT MATRIX ── */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2rem', 
            position: 'relative', 
            zIndex: 2,
            paddingTop: '4.5rem' 
          }}
        >
          {phases.map((phase, i) => {
            const isActive = phase.status === 'active';
            return (
              <div
                key={i}
                ref={(el: HTMLDivElement | null) => void (cardsRef.current[i] = el)}
                style={{
                  background: isActive ? '#0B0F19' : '#0B0F19',
                  border: `1px solid ${isActive ? 'rgba(14, 165, 233, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                  borderRadius: '24px',
                  padding: '2.5rem 2.2rem',
                  boxShadow: isActive 
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(14, 165, 233, 0.05)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Micro Border Accent Strip for Active Highlight */}
                {isActive && (
                  <div style={{ position: 'absolute', top: 0, left: '2.5rem', right: '2.5rem', height: '3px', background: 'linear-gradient(90deg, #0EA5E9, #8B5CF6)', borderRadius: '0 0 4px 4px' }} />
                )}

                {/* Card Title Header Node */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
                  <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: phase.color, margin: 0, letterSpacing: '-0.03em' }}>
                    {phase.phase}
                  </h3>
                  <span
                    style={{
                      background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? '#38BDF8' : '#9CA3AF',
                      border: `1px solid ${isActive ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
                      borderRadius: '100px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {phase.label}
                  </span>
                </div>

                {/* Items Unordered Feature Tree List */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {phase.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.7rem',
                        fontSize: '0.92rem',
                        color: isActive ? '#E5E7EB' : '#9CA3AF',
                        lineHeight: 1.45,
                        fontWeight: isActive ? 450 : 400
                      }}
                    >
                      <span style={{ color: phase.color, flexShrink: 0, marginTop: '0.15rem', fontSize: '0.85rem' }}>
                        ✦
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}