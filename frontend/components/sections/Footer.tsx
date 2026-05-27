'use client';

import Button from '../ui/Button';

const links = {
  Product: ['Features', 'How It Works', 'Roadmap', 'Pricing'],
  Company: ['About', 'Team', 'Blog', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Use', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--dark)',
        color: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* CTA Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--blue-deep) 0%, var(--blue-primary) 60%, var(--blue-accent) 100%)',
          padding: '5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          }}
        />
        <div style={{ position: 'relative' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              borderRadius: '100px',
              padding: '0.35rem 1rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            Early Access Open
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            Stop guessing.
            <br />
            Start forecasting.
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '1rem',
              marginBottom: '2.5rem',
              fontWeight: 300,
            }}
          >
            Join Sri Lankan retailers already using Lokalens to make smarter stocking decisions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                background: '#fff',
                color: 'var(--blue-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.92rem',
                padding: '0.85rem 2rem',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.01em',
              }}
            >
              Request Demo
            </button>
            <button
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '0.92rem',
                padding: '0.85rem 2rem',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            >
              Contact Team
            </button>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div
        style={{
          padding: '4rem 2rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.6rem',
                color: '#fff',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              Lokal<span style={{ color: 'var(--blue-sky)' }}>ens</span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
                fontWeight: 300,
                maxWidth: '260px',
              }}
            >
              AI-powered demand intelligence for Sri Lankan grocery SMEs. Province-aware.
              Culture-aware. Budget-aware.
            </p>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                {category}
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item) => (
                  <li key={item} style={{ marginBottom: '0.55rem' }}>
                    <a
                      href="#"
                      style={{
                        color: 'rgba(255,255,255,0.55)',
                        textDecoration: 'none',
                        fontSize: '0.88rem',
                        transition: 'color 0.2s',
                        fontWeight: 300,
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')
                      }
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
            © 2025 Lokalens. Built in Sri Lanka 🇱🇰
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
            SDGP Academic Project · IIT
          </p>
        </div>
      </div>
    </footer>
  );
}