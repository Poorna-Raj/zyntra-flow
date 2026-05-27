'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [hovered, setHovered] = useState<string | null>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '0' : '0.75rem 1.5rem',
        transition: 'padding 0.4s ease',
      }}
    >
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: scrolled ? '0' : '20px',
          border: scrolled
            ? '0 none'
            : '1px solid rgba(30,144,255,0.12)',
          boxShadow: scrolled
            ? '0 1px 0 rgba(30,144,255,0.08), 0 4px 24px rgba(13,27,42,0.06)'
            : '0 4px 32px rgba(30,144,255,0.1)',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: 'var(--dark)',
            textDecoration: 'none',
            letterSpacing: '-0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--blue-primary), var(--blue-accent))',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: '#fff',
              fontWeight: 800,
            }}
          >
            L
          </span>
          Lokal<span style={{ color: 'var(--blue-primary)' }}>ens</span>
        </a>

        {/* Nav links with hover pill */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onMouseEnter={() => setHovered(link.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: hovered === link.label ? 'var(--blue-primary)' : 'var(--gray-600)',
                textDecoration: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '100px',
                transition: 'color 0.2s',
                zIndex: 1,
              }}
            >
              {/* Hover pill background */}
              <AnimatePresence>
                {hovered === link.label && (
                  <motion.span
                    layoutId="nav-pill"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '100px',
                      background: 'var(--blue-mist)',
                      zIndex: -1,
                    }}
                  />
                )}
              </AnimatePresence>
              {link.label}
            </a>
          ))}
        </div>

        {/* Right CTA group */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href="#"
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: 'var(--gray-600)',
              textDecoration: 'none',
              padding: '0.45rem 0.8rem',
              borderRadius: '100px',
              transition: 'color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--blue-primary)';
              e.currentTarget.style.background = 'var(--blue-mist)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--gray-600)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Sign In
          </a>

          <motion.a
            href="#"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary"
            style={{ padding: '0.55rem 1.3rem', fontSize: '0.84rem' }}
          >
            Get Early Access
            <span className="btn-arrow">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </motion.a>
        </div>
      </motion.nav>
    </div>
  );
}