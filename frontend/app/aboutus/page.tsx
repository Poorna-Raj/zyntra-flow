'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

/* ─────────────────────────── DATA ─────────────────────────── */

const storyChapters = [
  {
    year: '2022',
    tag: 'The Problem',
    title: 'Shelves Full. Bins Fuller.',
    body: `Walking through Colombo's markets, we watched SME owners over-order, under-sell, and discard tonnes of inventory every week — not from carelessness, but from lack of tools.`,
    image: '/images/posters/poster-01.jpg',
    accent: '#2563EB',
  },
  {
    year: '2023',
    tag: 'The Build',
    title: 'Turning Data Into Decisions.',
    body: 'We embedded with 40+ Sri Lankan businesses across 9 provinces to understand their rhythms — seasonal spikes, supplier lead times, cash-flow constraints. Then we built the model around them.',
    image: '/images/posters/poster-02.jpg',
    accent: '#0EA5E9',
  },
  {
    year: '2024',
    tag: 'The Impact',
    title: 'Less Waste. More Growth.',
    body: 'Today, Syntrix powers inventory decisions for businesses from Jaffna to Galle — cutting waste by 30% and hitting 95% forecast accuracy. The mission is far from over.',
    image: '/images/posters/poster-03.jpg',
    accent: '#6366F1',
  },
];

const stats = [
  { number: '95%', label: 'Forecast Accuracy' },
  { number: '30%', label: 'Waste Reduction' },
  { number: '9', label: 'Sri Lankan Provinces' },
  { number: '24/7', label: 'AI Intelligence' },
];

const team = [
  {
    name: 'Member 01',
    role: 'AI & Backend',
    quote: '"The model is only as smart as the data it learns from."',
    color: '#2563EB',
    pattern: 'radial-gradient(circle at 30% 30%, #3B82F6 0%, #1E3A8A 100%)',
  },
  {
    name: 'Member 02',
    role: 'Frontend & UI',
    quote: '"Design is the first interface between humans and intelligence."',
    color: '#0EA5E9',
    pattern: 'radial-gradient(circle at 70% 20%, #38BDF8 0%, #0369A1 100%)',
  },
  {
    name: 'Member 03',
    role: 'Data & ML',
    quote: '"Every number tells a story. Our job is to listen."',
    color: '#6366F1',
    pattern: 'radial-gradient(circle at 50% 80%, #818CF8 0%, #3730A3 100%)',
  },
];

/* ─────────────────────────── TEAM CARD ─────────────────────────── */

function TeamCard({ member, index }: { member: (typeof team)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 800,
        cursor: 'pointer',
      }}
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
          borderRadius: '28px',
          overflow: 'hidden',
          background: '#fff',
          border: '1px solid rgba(37,99,235,0.08)',
          boxShadow: '0 4px 24px rgba(15,23,42,0.07)',
          position: 'relative',
        }}
        whileHover={{ boxShadow: `0 20px 60px ${member.color}30` }}
        transition={{ duration: 0.3 }}
      >
        {/* Top colour block with initials */}
        <div
          style={{
            height: '160px',
            background: member.pattern,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* decorative rings */}
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '40px solid rgba(255,255,255,0.07)',
              top: '-50px',
              right: '-50px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '25px solid rgba(255,255,255,0.05)',
              bottom: '-30px',
              left: '20px',
            }}
          />
          {/* avatar */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#fff',
              zIndex: 1,
              backdropFilter: 'blur(4px)',
            }}
          >
            {member.name.slice(-2)}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem 1.8rem 2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
            {member.name}
          </h3>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.3rem',
              padding: '0.25rem 0.7rem',
              borderRadius: '999px',
              background: `${member.color}15`,
              color: member.color,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            {member.role}
          </span>
          <p
            style={{
              marginTop: '1rem',
              color: '#64748B',
              fontSize: '0.88rem',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            {member.quote}
          </p>

          {/* Hover-reveal bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            style={{
              marginTop: '1.2rem',
              height: '3px',
              borderRadius: '2px',
              background: `linear-gradient(90deg, ${member.color}, transparent)`,
              transformOrigin: 'left',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────── VISION / MISSION ─────────────────────────── */

function VMCard({
  type,
  title,
  body,
}: {
  type: 'vision' | 'mission';
  title: string;
  body: string;
}) {
  const isDark = type === 'vision';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: '2.5rem',
        borderRadius: '28px',
        background: isDark
          ? 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)'
          : '#fff',
        color: isDark ? '#fff' : '#0F172A',
        border: isDark ? 'none' : '1px solid rgba(37,99,235,0.12)',
        boxShadow: isDark
          ? '0 20px 60px rgba(37,99,235,0.25)'
          : '0 4px 30px rgba(15,23,42,0.06)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {isDark && (
        <>
          <div
            style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent)',
              top: '-80px',
              right: '-80px',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(14,165,233,0.2), transparent)',
              bottom: '-40px',
              left: '20px',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      <span
        style={{
          display: 'inline-block',
          padding: '0.3rem 0.8rem',
          borderRadius: '999px',
          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(37,99,235,0.08)',
          color: isDark ? 'rgba(255,255,255,0.7)' : '#2563EB',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}
      >
        {type}
      </span>

      <h3
        style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          marginBottom: '0.8rem',
          lineHeight: 1.15,
          position: 'relative',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: isDark ? 'rgba(255,255,255,0.65)' : '#64748B',
          lineHeight: 1.8,
          fontSize: '0.95rem',
          position: 'relative',
        }}
      >
        {body}
      </p>

      {/* animated underline on hover */}
      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: '60px' }}
        style={{
          height: '3px',
          borderRadius: '2px',
          background: isDark
            ? 'linear-gradient(90deg, #60A5FA, #818CF8)'
            : 'linear-gradient(90deg, #2563EB, #0EA5E9)',
          marginTop: '1.4rem',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/* ─────────────────────────── STORY CHAPTER ─────────────────────────── */

function StoryChapter({
  chapter,
  index,
}: {
  chapter: (typeof storyChapters)[0];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem',
        alignItems: 'center',
        marginBottom: '5rem',
        direction: isEven ? 'ltr' : 'rtl',
      }}
    >
      {/* Image side */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          height: '360px',
          borderRadius: '28px',
          overflow: 'hidden',
          direction: 'ltr',
          boxShadow: `0 30px 80px ${chapter.accent}25`,
        }}
      >
        <Image
          src={chapter.image}
          alt={chapter.title}
          fill
          style={{ objectFit: 'cover' }}
        />
        {/* colour wash overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${chapter.accent}40, transparent 60%)`,
          }}
        />
        {/* Year badge */}
        <div
          style={{
            position: 'absolute',
            top: '1.2rem',
            left: '1.2rem',
            padding: '0.4rem 1rem',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontWeight: 900,
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
          }}
        >
          {chapter.year}
        </div>
      </motion.div>

      {/* Text side */}
      <div style={{ direction: 'ltr' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.3rem 0.9rem',
            borderRadius: '999px',
            background: `${chapter.accent}15`,
            color: chapter.accent,
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {chapter.tag}
        </span>

        <h3
          style={{
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 900,
            color: '#0F172A',
            marginTop: '0.8rem',
            lineHeight: 1.15,
          }}
        >
          {chapter.title}
        </h3>

        <div
          style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: `linear-gradient(90deg, ${chapter.accent}, transparent)`,
            margin: '1rem 0',
          }}
        />

        <p
          style={{
            color: '#64748B',
            lineHeight: 1.85,
            fontSize: '0.97rem',
          }}
        >
          {chapter.body}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function AboutUsPage() {
  return (
    <>
      <Navbar />

      <section
        style={{
          background:
            'linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 50%, #F5FAFF 100%)',
          minHeight: '100vh',
          overflow: 'hidden',
          padding: '6rem 1rem 4rem',
        }}
      >
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

          {/* ── HERO ── */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '5rem', padding: '0 0.5rem' }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                background: 'rgba(37,99,235,0.08)',
                color: '#2563EB',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
              }}
            >
              ABOUT SYNTRIX
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 7vw, 5.5rem)',
                fontWeight: 900,
                color: '#0F172A',
                lineHeight: 1,
                marginTop: '1.2rem',
              }}
            >
              Shaping Smarter
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Inventory Decisions
              </span>
            </h1>

            <p
              style={{
                maxWidth: '750px',
                margin: '1.2rem auto 0',
                color: '#64748B',
                lineHeight: 1.8,
                fontSize: '1rem',
              }}
            >
              AI-powered forecasting for Sri Lankan SMEs to reduce waste and improve efficiency.
            </p>
          </motion.div>

          {/* ── VISUAL POSTERS GRID ── */}
          <div style={{ marginBottom: '6rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.2rem',
                alignItems: 'end',
              }}
            >
              {storyChapters.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  style={{
                    position: 'relative',
                    height: i === 1 ? '440px' : '360px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(15,23,42,0.1)',
                  }}
                >
                  <Image src={p.image} alt={p.title} fill style={{ objectFit: 'cover' }} />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.78) 100%)',
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${p.accent}35, transparent 60%)`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(8px)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    {p.tag}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, padding: '1.4rem', color: '#fff' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.4rem' }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.75, lineHeight: 1.5 }}>
                      {p.body.split('—')[0]}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── OUR STORY ── */}
          <div style={{ marginBottom: '6rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                  background: 'rgba(37,99,235,0.06)',
                  color: '#2563EB',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.8rem',
                }}
              >
                Our Story
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  fontWeight: 900,
                  color: '#0F172A',
                  lineHeight: 1.1,
                }}
              >
                From Frustration
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #6366F1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  to Intelligence.
                </span>
              </h2>
            </motion.div>

            {/* chapters */}
            <div>
              {storyChapters.map((ch, i) => (
                <StoryChapter key={i} chapter={ch} index={i} />
              ))}
            </div>
          </div>

          {/* ── VISION + MISSION ── */}
          <div style={{ marginBottom: '5rem' }}>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                marginBottom: '2.5rem',
              }}
            >
              Where We're Going
            </motion.h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <VMCard
                type="vision"
                title="Intelligent decisions for every Sri Lankan SME."
                body="We believe every small business, regardless of size, deserves the same predictive intelligence that Fortune 500 companies use to stay ahead of demand."
              />
              <VMCard
                type="mission"
                title="Cut waste. Forecast better. Grow faster."
                body="We build AI tools that fit naturally into how local businesses already operate — removing friction, not adding complexity, so owners can focus on what matters."
              />
            </div>
          </div>

          {/* ── IMPACT ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              marginBottom: '6rem',
            }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(37,99,235,0.15)' }}
                style={{
                  padding: '1.5rem',
                  borderRadius: '18px',
                  background: '#fff',
                  textAlign: 'center',
                  border: '1px solid rgba(37,99,235,0.1)',
                  cursor: 'default',
                }}
              >
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2563EB' }}>
                  {s.number}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.3rem' }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ── TEAM ── */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  borderRadius: '999px',
                  background: 'rgba(37,99,235,0.06)',
                  color: '#2563EB',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  marginBottom: '0.8rem',
                }}
              >
                The Team
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  fontWeight: 900,
                  color: '#0F172A',
                  lineHeight: 1.1,
                  marginBottom: '0.6rem',
                }}
              >
                The Minds Behind
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  the Machine.
                </span>
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>
                A small team with a big obsession: making inventory decisions effortless for every Sri Lankan business.
              </p>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
            >
              {team.map((t, i) => (
                <TeamCard key={i} member={t} index={i} />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 10px 30px rgba(37,99,235,0.3)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '0.85rem 2rem',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
              }}
            >
              View All Members
            </motion.button>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}