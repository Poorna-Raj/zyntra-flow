'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  hoverable?: boolean;
}

export default function Card({ children, style, hoverable = false }: CardProps) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-card)',
        transition: hoverable ? 'transform 0.25s var(--ease-out), box-shadow 0.25s' : undefined,
        ...style,
      }}
      onMouseEnter={
        hoverable
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-blue)';
            }
          : undefined
      }
      onMouseLeave={
        hoverable
          ? (e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-card)';
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}