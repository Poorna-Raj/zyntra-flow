'use client';

import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  highlight?: boolean;
  style?: React.CSSProperties;
}

export default function GlassPanel({ children, highlight = false, style }: GlassPanelProps) {
  if (highlight) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, var(--blue-primary) 0%, var(--blue-deep) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          height: '100%',
          boxShadow: 'var(--shadow-blue)',
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Shine effect */}
        <div
          style={{
            position: 'absolute',
            top: '-40%',
            right: '-20%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative' }}>{children}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--off-white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        height: '100%',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
        ...style,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(30,144,255,0.3)';
        el.style.boxShadow = 'var(--shadow-blue)';
        el.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--gray-200)';
        el.style.boxShadow = 'none';
        el.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
}