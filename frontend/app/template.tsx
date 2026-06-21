'use client';

import { motion } from 'framer-motion';

const DURATION = 0.6; // Slightly slower for a more cinematic, majestic sweep
const EASE = [0.16, 1, 0.3, 1] as const; // Premium "ultra-smooth" cubic bezier

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 1. Page Content (Reveals with soft scale & unblur) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ 
          duration: 0.6, 
          delay: 0.5, // Syncs perfectly with the curtain starting to slide up
          ease: EASE 
        }}
      >
        {children}
      </motion.div>

      {/* 2. Matte Charcoal Curtain (Slides upward) */}
      <motion.div
        aria-hidden
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{
          duration: DURATION,
          delay: 0.5, // Holds screen blank briefly for logo reveal
          ease: EASE,
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#050505', // Deep matte luxury black
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)', // Fine glowing dividing line
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.9)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Logo (Fades & drifts up right before the curtain lifts) */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: [0, 1, 1, 0], 
          y: [10, 0, 0, -15] 
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.3, 0.75, 1], // Stays visible, then drifts up and vanishes at 0.5s
          ease: 'easeInOut',
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Editorial minimalist brandmark */}
          <span style={{
            display: 'inline-flex', width: '40px', height: '40px',
            borderRadius: '8px', 
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', color: '#fff', fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            L
          </span>
          <span style={{
            fontSize: '1.6rem', fontWeight: 700, color: '#fff',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-display, sans-serif)',
          }}>
            Loka<span style={{ opacity: 0.5, fontWeight: 400 }}>lens</span>
          </span>
        </div>
      </motion.div>
    </>
  );
}