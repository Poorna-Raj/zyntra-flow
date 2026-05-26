'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

/* ── Arrow SVG ───────────────────────────── */
const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 7.5h11M9 3l4.5 4.5L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Stat pill ───────────────────────────── */
function Pill({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(30,144,255,0.14)', borderRadius: '100px',
      padding: '0.35rem 0.9rem', fontSize: '0.75rem', fontWeight: 600,
      color: 'var(--gray-800)',
    }}>
      <span>{icon}</span>{text}
    </div>
  );
}

/* ── Demand bar ──────────────────────────── */
function DemandBar({ name, score, delay }: { name: string; score: number; delay: number }) {
  return (
    <div style={{ marginBottom: '0.72rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.28rem' }}>
        <span style={{ fontSize: '0.77rem', color: 'var(--gray-800)', fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: '0.77rem', color: 'var(--blue-primary)', fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: '5px', background: 'var(--blue-pale)', borderRadius: '100px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--blue-primary), var(--blue-accent))',
            borderRadius: '100px',
          }}
        />
      </div>
    </div>
  );
}

/* ── Marquee logos strip ─────────────────── */
const logos = [
  { name: 'SDGP 2025', symbol: '◈' },
  { name: 'Lokalens',  symbol: '⬡' },
  { name: 'IIT',       symbol: '◉' },
  { name: 'Western',   symbol: '◈' },
  { name: 'Central',   symbol: '⬡' },
  { name: 'Southern',  symbol: '◉' },
  { name: 'Northern',  symbol: '◈' },
  { name: 'Eastern',   symbol: '⬡' },
];

function MarqueeStrip() {
  // Double the array for seamless loop
  const doubled = [...logos, ...logos];
  return (
    <div style={{
      marginTop: '4.5rem',
      position: 'relative',
      overflow: 'hidden',
      padding: '0.5rem 0',
    }}>
      {/* fade edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px',
        background: 'linear-gradient(90deg, rgba(240,248,255,1) 0%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(240,248,255,1) 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      <div className="marquee-track">
        {doubled.map((logo, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
            padding: '0.55rem 2.2rem',
            borderRight: i < doubled.length - 1 ? '1px solid rgba(30,144,255,0.12)' : 'none',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--blue-primary)', opacity: 0.5 }}>{logo.symbol}</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.82rem', color: 'var(--gray-600)',
              letterSpacing: '0.05em', opacity: 0.55,
            }}>
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── */
export default function Hero() {
  const sectionRef   = useRef<HTMLElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const leftCardRef  = useRef<HTMLDivElement>(null);
  const rightCardRef = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Entrance animation ── */
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(badgeRef.current,   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 })
      .fromTo(headingRef.current,  { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, '-=0.3')
      .fromTo(subRef.current,      { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65 }, '-=0.45')
      .fromTo(ctaRef.current,      { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6  }, '-=0.38')
      .fromTo(statsRef.current,    { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6  }, '-=0.36')
      .fromTo(leftCardRef.current, { x: -56, opacity: 0 }, { x: 0, opacity: 1, duration: 0.95, ease: 'back.out(1.2)' }, '-=0.6')
      .fromTo(rightCardRef.current,{ x:  56, opacity: 0 }, { x: 0, opacity: 1, duration: 0.95, ease: 'back.out(1.2)' }, '-=0.85');

    /* ── Gentle float — CSS transform only, no layout reflow ── */
    gsap.to(leftCardRef.current, {
      y: -12, duration: 4, yoyo: true, repeat: -1,
      ease: 'sine.inOut', force3D: true,
    });
    gsap.to(rightCardRef.current, {
      y: 12, duration: 4.4, yoyo: true, repeat: -1,
      ease: 'sine.inOut', force3D: true, delay: 0.7,
    });

    /* ── Scroll-driven native blur (no framer-motion subscription loop) ── */
    const el = contentRef.current;
    if (!el) return;

    const onScroll = () => {
      const sy = window.scrollY;
      const progress = Math.min(sy / 320, 1);
      const blur = progress * 7;
      const op   = 1 - progress * 0.65;
      const ty   = -progress * 36;
      el.style.filter    = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : 'none';
      el.style.opacity   = op.toFixed(3);
      el.style.transform = `translateY(${ty.toFixed(1)}px)`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(155deg, #C8E6FF 0%, #EBF5FF 28%, #FFFFFF 58%, #F0F8FF 100%)',
      }}
    >
      {/* ── Background blobs ── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-8%', left: '-4%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,186,255,0.25) 0%, transparent 70%)', filter: 'blur(55px)' }} />
        <div style={{ position: 'absolute', top: '5%', right: '-6%', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,144,255,0.15) 0%, transparent 70%)', filter: 'blur(55px)' }} />
        <div style={{ position: 'absolute', bottom: '-4%', left: '38%', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,196,255,0.1) 0%, transparent 70%)', filter: 'blur(44px)' }} />
        {/* grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(30,144,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
        }} />
      </div>

      {/* ── Scrollable content wrapper (native scroll blur) ── */}
      <div
        ref={contentRef}
        className="hero-glass-layer"
        style={{ position: 'relative', zIndex: 1, width: '100%', willChange: 'filter, opacity, transform' }}
      >
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '3rem' }}>
          {/* 3-col grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '290px 1fr 290px',
            alignItems: 'center',
            gap: '2rem',
          }}>

            {/* ── LEFT CARD ── */}
            <div ref={leftCardRef} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className="stat-card" style={{
                background: '#fff', borderRadius: '24px', padding: '1.5rem',
                boxShadow: '0 12px 48px rgba(30,144,255,0.15)',
                border: '1px solid rgba(30,144,255,0.09)', width: '265px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                  <div>
                    <p style={{ fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.09em', color: 'var(--blue-primary)', textTransform: 'uppercase' }}>
                      Demand Forecast
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '0.1rem' }}>Southern · Week 24</p>
                  </div>
                  <span style={{ background: '#E8F5E9', color: '#2E7D32', fontSize: '0.63rem', fontWeight: 700, padding: '0.18rem 0.55rem', borderRadius: '100px', letterSpacing: '0.04em' }}>↑ HIGH</span>
                </div>
                <DemandBar name="Coca-Cola 1.5L" score={91} delay={0.85} />
                <DemandBar name="Anchor 400g"    score={84} delay={1.0} />
                <DemandBar name="Munchee Choco"  score={79} delay={1.15} />
                <div style={{ marginTop: '0.9rem', padding: '0.65rem', background: 'var(--blue-mist)', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.95rem' }}>📍</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--gray-400)', fontWeight: 500 }}>Province</p>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dark)' }}>Southern Province</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CENTER ── */}
            <div style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto' }}>
              <div ref={badgeRef} style={{ marginBottom: '1.6rem' }}>
                <span className="badge">
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--blue-primary)', display: 'inline-block', boxShadow: '0 0 0 3px rgba(30,144,255,0.22)' }} />
                  AI-Powered · Sri Lanka
                </span>
              </div>

              <h1
                ref={headingRef}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)',
                  fontWeight: 800, lineHeight: 1.06,
                  color: 'var(--dark)', marginBottom: '1.3rem',
                  letterSpacing: '-0.03em',
                }}
              >
                Know What{' '}
                <span className="gradient-text">Sells Next</span>
                <br />Before It Does.
              </h1>

              <p
                ref={subRef}
                style={{ fontSize: '1.02rem', color: 'var(--gray-600)', lineHeight: 1.74, marginBottom: '2.1rem', fontWeight: 300 }}
              >
                Lokalens uses localized AI to forecast grocery demand for Sri Lankan SMEs —
                province by province, season by season.
              </p>

              <div ref={ctaRef} style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
                <a href="#" className="btn-primary">
                  Get Early Access
                  <span className="btn-arrow"><Arrow /></span>
                </a>
                <a href="#how-it-works" className="btn-ghost">
                  See How It Works
                  <span className="btn-arrow"><Arrow /></span>
                </a>
              </div>

              <div ref={statsRef} style={{ display: 'flex', gap: '0.55rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Pill icon="🏪" text="500+ SMEs targeted" />
                <Pill icon="📍" text="9 Provinces" />
                <Pill icon="🤖" text="ML-Powered" />
              </div>
            </div>

            {/* ── RIGHT CARDS ── */}
            <div ref={rightCardRef} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', width: '255px' }}>
                {/* Blue surge card */}
                <div className="stat-card" style={{
                  background: 'linear-gradient(135deg, #1A6FD4 0%, var(--blue-deep) 100%)',
                  borderRadius: '22px', padding: '1.5rem',
                  boxShadow: '0 16px 48px rgba(30,144,255,0.36)',
                  color: '#fff', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: '-28%', right: '-18%', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.13), transparent 70%)', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                    <p style={{ fontSize: '0.77rem', fontWeight: 600, opacity: 0.85 }}>Payday Surge</p>
                    <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '100px', padding: '0.18rem 0.62rem', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em' }}>LIVE</span>
                  </div>
                  <p style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>+34%</p>
                  <p style={{ fontSize: '0.78rem', opacity: 0.7, margin: '0.28rem 0 1rem' }}>Expected demand spike</p>
                  <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: '13px', padding: '0.75rem' }}>
                    <p style={{ fontSize: '0.66rem', opacity: 0.7, marginBottom: '0.18rem' }}>Top Region</p>
                    <p style={{ fontWeight: 700, fontSize: '0.88rem' }}>Western Province</p>
                  </div>
                </div>

                {/* Vesak alert mini-card */}
                <div className="stat-card" style={{
                  background: '#fff', borderRadius: '18px', padding: '0.95rem 1.1rem',
                  boxShadow: '0 6px 24px rgba(30,144,255,0.1)',
                  border: '1px solid rgba(30,144,255,0.09)',
                  display: 'flex', gap: '0.7rem', alignItems: 'center',
                }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--blue-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.95rem' }}>
                    🎉
                  </div>
                  <div>
                    <p style={{ fontSize: '0.68rem', color: 'var(--gray-400)', fontWeight: 500 }}>Upcoming Signal</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark)' }}>Vesak Poya · 3 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Infinite marquee logos ── */}
          <MarqueeStrip />
        </div>
      </div>
    </section>
  );
}