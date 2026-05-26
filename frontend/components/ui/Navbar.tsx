'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Roadmap', href: '/#roadmap' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Team', href: '/team' }, // Direct link to your new route
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();

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
          background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: scrolled ? '0' : '20px',
          border: scrolled ? '0 none' : '1px solid rgba(30,144,255,0.12)',
          boxShadow: scrolled
            ? '0 1px 0 rgba(30,144,255,0.08), 0 4px 24px rgba(13,27,42,0.06)'
            : '0 4px 32px rgba(30,144,255,0.1)',
          transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#1e293b',
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
              background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              color: '#fff',
              fontWeight: 800,
            }}
          >
            L
          </span>
          Lokal<span style={{ color: '#1e90ff' }}>ens</span>
        </Link>

        {/* Nav links with hover pill */}
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', position: 'relative' }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'relative',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: isActive || hovered === link.label ? '#1e90ff' : '#475569',
                  textDecoration: 'none',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '100px',
                  transition: 'color 0.2s',
                  zIndex: 1,
                }}
              >
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
                        background: 'rgba(30,144,255,0.08)',
                        zIndex: -1,
                      }}
                    />
                  )}
                </AnimatePresence>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA group */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link
            href="#"
            style={{
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#475569',
              textDecoration: 'none',
              padding: '0.45rem 0.8rem',
              borderRadius: '100px',
              transition: 'color 0.2s',
            }}
          >
            Sign In
          </Link>

          <motion.a
            href="#"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '0.55rem 1.3rem',
              fontSize: '0.84rem',
              background: '#1e90ff',
              color: '#fff',
              borderRadius: '100px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 500,
            }}
          >
            Get Early Access
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </div>
      </motion.nav>
    </div>
  );
}