'use client';

import { motion } from 'framer-motion';

const DURATION = 0.4; // ← reduced from 0.5
const EASE = [0.76, 0, 0.24, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 1. Page content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: DURATION * 1.2 }} // ← was 1.6
      >
        {children}
      </motion.div>

      {/* 2. Blue curtain sweeps IN then OUT */}
      <motion.div
        aria-hidden
        initial={{ x: '-100%' }}             // ← fix: was '−100%' (wrong char)
        animate={{ x: ['-100%', '0%', '0%', '100%'] }} // ← fix same here
        transition={{
          duration: DURATION * 2,
          times: [0, 0.45, 0.55, 1],         // ← tightened hold at midpoint
          ease: EASE,
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'linear-gradient(105deg, #1e90ff 0%, #0ea5e9 60%, #1e90ff 100%)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Logo at midpoint */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: DURATION * 2,
          times: [0, 0.35, 0.45, 0.55, 1],  // ← slightly earlier reveal
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex', width: '44px', height: '44px',
            borderRadius: '12px', background: 'rgba(255,255,255,0.22)',
            border: '1.5px solid rgba(255,255,255,0.4)',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1.15rem', color: '#fff', fontWeight: 800,
          }}>L</span>
          <span style={{
            fontSize: '1.9rem', fontWeight: 800, color: '#fff',
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-display, sans-serif)',
          }}>
            Loka<span style={{ opacity: 0.7 }}>lens</span>
          </span>
        </div>
      </motion.div>
    </>
  );
}