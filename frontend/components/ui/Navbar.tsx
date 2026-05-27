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
  { label: 'About Us', href: '/aboutus' },
  { label: 'Team', href: '/team' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .lk-nav-links {
          display: flex;
        }

        .lk-nav-cta {
          display: flex;
        }

        .lk-hamburger {
          display: none;
        }

        @media (max-width: 768px) {
          .lk-nav-links {
            display: none;
          }

          .lk-nav-cta {
            display: none;
          }

          .lk-hamburger {
            display: flex;
          }
        }
      `}</style>

      {/* NAVBAR WRAPPER */}
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
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.25rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: scrolled
              ? 'rgba(255,255,255,0.92)'
              : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: scrolled ? '0' : '20px',
            border: scrolled ? '0' : '1px solid rgba(30,144,255,0.12)',
            boxShadow: scrolled
              ? '0 1px 0 rgba(30,144,255,0.08), 0 4px 24px rgba(13,27,42,0.06)'
              : '0 4px 32px rgba(30,144,255,0.1)',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            style={{
              fontWeight: 800,
              fontSize: '1.4rem',
              color: '#1e293b',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.75rem',
              }}
            >
              L
            </span>

            Loka<span style={{ color: '#1e90ff' }}>lens</span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="lk-nav-links" style={{ gap: '0.25rem' }}>
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
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color:
                      isActive || hovered === link.label
                        ? '#1e90ff'
                        : '#475569',
                    textDecoration: 'none',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '100px',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="lk-nav-cta">
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '0.55rem 1.3rem',
                background: '#1e90ff',
                color: '#fff',
                borderRadius: '100px',
                fontSize: '0.84rem',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Get Early Access
            </motion.a>
          </div>

          {/* HAMBURGER */}
          <button
            className="lk-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </motion.nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.4)',
                zIndex: 998,
              }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '280px',
                height: '100%',
                background: '#fff',
                zIndex: 999,
                padding: '1.5rem',
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.8rem 0',
                    textDecoration: 'none',
                    color: '#334155',
                    fontSize: '1rem',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}