'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  small?: boolean;
  onClick?: () => void;
  href?: string;
}

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
    <path d="M2 7.5h11M9 3l4.5 4.5L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Button({ children, variant = 'primary', small = false, onClick, href }: ButtonProps) {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-ghost';
  const style = small ? { padding: '0.55rem 1.2rem', fontSize: '0.84rem' } : {};

  const inner = (
    <>
      {children}
      <span className="btn-arrow"><ArrowIcon /></span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={className} style={style}>
        {inner}
      </a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
      style={{ ...style, border: 'none' }}
    >
      {inner}
    </motion.button>
  );
}