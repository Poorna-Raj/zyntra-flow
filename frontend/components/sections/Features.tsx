'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { id: 0, icon: '📍', title: 'Province Intelligence', short: 'PROVINCE', color: '#1E90FF', glow: 'rgba(30,144,255,0.45)', description: 'Demand models for all 9 provinces — climate, culture, and economic activity baked in.' },
  { id: 1, icon: '📅', title: 'Cultural Signals', short: 'CULTURAL', color: '#8B5CF6', glow: 'rgba(139,92,246,0.55)', description: 'Vesak, Poya, Ramadan, New Year — every festival and payday cycle shapes the forecast.' },
  { id: 2, icon: '🛒', title: 'SKU Forecasting', short: 'SKU', color: '#0EA5E9', glow: 'rgba(14,165,233,0.45)', description: 'Per-product demand scores. Know exactly which SKU moves faster in your region.' },
  { id: 3, icon: '🤖', title: 'AI Assistant', short: 'AI BOT', color: '#10B981', glow: 'rgba(16,185,129,0.45)', description: 'Budget-aware stocking recommendations with full reasoning — ready in seconds.' },
  { id: 4, icon: '📊', title: 'Visual Dashboard', short: 'DASHBOARD', color: '#F59E0B', glow: 'rgba(245,158,11,0.45)', description: 'Heat maps, trend charts, confidence bands, and regional comparisons in one view.' },
];

export default function SriLankaPerfectVerticalFeatures() {
  const [active, setActive] = useState<number>(3); // Set to AI Assistant matching your latest upload
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-head', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: containerRef.current, start: 'top 80%' } }
      );
      gsap.fromTo(mapContainerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: containerRef.current, start: 'top 75%' } }
      );
    });
    return () => ctx.revert();
  }, []);

  const activeFeature = features[active];

  return (
    <section id="features" style={{ padding: '6rem 1.5rem', background: '#000000', color: '#ffffff', overflow: 'hidden' }}>
      
      {/* ── Main Panel Container ── */}
      <div
        ref={containerRef}
        style={{
          background: 'radial-gradient(circle at 50% 0%, #0c0c0c 0%, #020202 100%)',
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.04)',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '5rem 3rem',
          position: 'relative',
        }}
      >
        {/* Background Grid Lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none', borderRadius: '32px' }} />

        {/* Header Block */}
        <div className="reveal-head" style={{ textAlign: 'center', marginBottom: '5.5rem', position: 'relative', zIndex: 3 }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Core Capabilities
          </p>
          <h2 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            What is Lokalens Core?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', marginTop: '0.6rem', fontWeight: 300 }}>
            Five functional layers. Continuous calculations. One clear direction.
          </p>
        </div>

        {/* Layout Split Grid Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 3
        }}>
          
          {/* LEFT COLUMN: The Map viewport container */}
          <div 
            ref={mapContainerRef} 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              position: 'relative', 
              width: '100%', 
              maxWidth: '460px', 
              height: '540px', // Explicit tall layout box 
              margin: '0 auto'
            }}
          >
            <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              
              {/* Massive Hyper-Glow Engine Behind Map */}
              <motion.div 
                animate={{ 
                  background: `radial-gradient(circle, ${activeFeature.glow} 0%, transparent 65%)`
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  width: '130%',
                  height: '130%',
                  pointerEvents: 'none',
                  zIndex: 1,
                  mixBlendMode: 'screen',
                  filter: 'blur(40px)',
                  opacity: 0.85
                }} 
              />

              {/* Sri Lankan Topographic Asset - Cleaned Aspect Ratio Box mapping */}
              <img 
                src="/maps/sri-lanka-satellite.png" 
                alt="Sri Lanka Intel Framework Map" 
                style={{ 
                  position: 'absolute',
                  width: 'auto', 
                  height: '100%', // Locks image proportions vertically
                  maxWidth: 'none',
                  maxHeight: '100%',
                  objectFit: 'contain', 
                  zIndex: 2,
                  filter: 'brightness(1.2) contrast(1.15)',
                }} 
              />

              {/* Centered Glassmorphic Snapshot Metadata Card Over the Map */}
              <motion.div 
                animate={{ borderColor: `${activeFeature.color}30` }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '240px',
                  background: 'rgba(10, 10, 10, 0.82)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid',
                  borderRadius: '20px',
                  padding: '1.6rem',
                  boxShadow: '0 40px 80px rgba(0, 0, 0, 0.95), inset 0 1px 1px rgba(255,255,255,0.15)',
                  zIndex: 3,
                  textAlign: 'center'
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.04)', margin: '0 auto 1rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      {activeFeature.icon}
                    </div>
                    <h3 style={{ fontSize: '0.78rem', fontWeight: 900, color: activeFeature.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      {activeFeature.short} SNAPSHOT
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.45 }}>
                      Comprehensive map view of local parameters and regional comparisons.
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

            </div>
          </div>

          {/* RIGHT COLUMN: Feature Selector List Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
              Select a layer to break down operational logic
            </p>

            {features.map((f) => {
              const isCurrent = active === f.id;
              return (
                <div
                  key={`card-${f.id}`}
                  onClick={() => setActive(f.id)}
                  style={{
                    display: 'flex', gap: '1.35rem', alignItems: 'center',
                    padding: '1.4rem', borderRadius: '18px', cursor: 'pointer',
                    background: isCurrent ? 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)' : 'transparent',
                    border: '1px solid',
                    borderColor: isCurrent ? f.color : 'rgba(255,255,255,0.02)',
                    boxShadow: isCurrent ? `inset 4px 0 0 0 ${f.color}, 0 0 35px -5px ${f.glow}` : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '11px', flexShrink: 0,
                    background: isCurrent ? f.color : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                    border: `1px solid ${isCurrent ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
                    transition: 'all 0.3s'
                  }}>
                    <span>{f.icon}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: isCurrent ? '#FFFFFF' : 'rgba(255,255,255,0.75)' }}>
                      {f.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem', lineHeight: 1.45, fontWeight: 300 }}>
                      {f.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* CTAs Footer Links */}
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a href="#forecast" style={{ background: '#0EA5E9', color: '#fff', padding: '0.9rem 1.85rem', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 24px rgba(14,165,233,0.25)' }}>
                Start Forecasting &rarr;
              </a>
              <a href="#roadmap" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.9rem 1.85rem', borderRadius: '100px', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
                View Roadmap
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}