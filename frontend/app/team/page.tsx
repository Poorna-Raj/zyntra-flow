'use client';

import { motion } from 'framer-motion';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';

const teamMembers = [
  {
    name: 'Sachintha Perera',
    role: 'Lead Project Architect',
    bio: 'Designing scalable product architecture and crafting elegant digital experiences focused on usability and innovation.',
    image: '/team/sachintha.jpg',
    accent: '#101111',
    tagId: 'NIRA-01',
  },
  {
    name: 'Arosha Bandara',
    role: 'Analytics & Strategy Lead',
    bio: 'Transforming research insights and stakeholder requirements into smart product decisions and business direction.',
    image: '/team/arosha.png',
    accent: '#161616',
    tagId: 'NIRA-02',
  },
  {
    name: 'Harsha Rathnayake',
    role: 'Full-Stack Systems Engineer',
    bio: 'Building reliable backend systems, cloud integrations, and optimized data-driven application workflows.',
    image: '/team/harsha.jpg',
    accent: '#1c1d1d',
    tagId: 'NIRA-03',
  },
  {
    name: 'Zack De Silva',
    role: 'Creative Media Developer',
    bio: 'Creating engaging visual storytelling, motion graphics, and modern brand-focused media experiences.',
    image: '/team/zack.jpg',
    accent: '#201e1d',
    tagId: 'NIRA-04',
  },
];

const stats = [
  { value: '04', label: 'Core Team Members' },
  { value: '49%', label: 'Project Completion' },
  { value: '25+', label: 'Research Findings' },
  { value: '100%', label: 'Passion & Dedication' },
];

export default function TeamPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 30%, #ffffff 100%)',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* HERO SECTION */}
        <section style={{ position: 'relative', paddingTop: '160px', paddingBottom: '120px' }}>
          <div
            style={{
              position: 'absolute',
              top: '-120px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '700px',
              height: '700px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '1440px', margin: '0 auto', padding: '0 2rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '5rem' }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                }}
              >
                SYNTRIXLK TEAM
              </div>

              <h1
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.05em',
                  color: '#0f172a',
                  maxWidth: '900px',
                  margin: '0 auto',
                }}
              >
                Four Minds.
                <br />
                One Vision.
              </h1>

              <p
                style={{
                  maxWidth: '760px',
                  margin: '1.8rem auto 0 auto',
                  color: '#64748b',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                }}
              >
                We are a passionate 4-member development team building intelligent digital systems
                focused on inventory optimization, food-waste reduction, and smarter SME operations.
              </p>
            </motion.div>

            {/* TEAM GRID */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2.5rem',
              }}
            >
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  whileHover="hover"
                  style={{
                    background: 'transparent', /* Changed from white to transparent to remove outer boundary layers */
                    borderRadius: '30px',
                    overflow: 'hidden',
                    boxShadow: 'none', /* Removed outer container shadow completely */
                    position: 'relative',
                  }}
                >
                  {/* Decorative top accent line wrapper */}
                  <div style={{ height: '6px', width: '100%', background: member.accent, borderRadius: '999px', marginBottom: '1.2rem' }} />

                  {/* MAIN IMAGE CONTAINER */}
                  <div style={{ padding: '0' }}> {/* Dropped container padding so it lines up seamlessly with the top accent bar */}
                    <div
                      style={{
                        height: '460px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)',
                      }}
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(15,23,42,0.3), transparent 60%)',
                        }}
                      />

                      {/* HOVER INTERACTIVE NAME TAG PANEL - LIGHT BLUE */}
                      <motion.div
                        variants={{
                          hover: { y: 0, opacity: 1 }
                        }}
                        initial={{ y: 50, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        style={{
                          position: 'absolute',
                          bottom: '1.2rem',
                          left: '1.2rem',
                          right: '1.2rem',
                          background: 'rgba(239, 246, 255, 0.95)', 
                          backdropFilter: 'blur(16px)',
                          border: `1px solid ${member.accent}30`,
                          borderRadius: '18px',
                          padding: '1.2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.1)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 800, letterSpacing: '0.1em' }}>
                            {member.tagId}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: 'auto', fontWeight: 500 }}>
                            VERIFIED MEMBER
                          </span>
                        </div>
                        <div style={{ height: '1px', background: 'rgba(37, 99, 235, 0.1)', margin: '6px 0' }} />
                        <h4 style={{ color: '#0f172a', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                          {member.name}
                        </h4>
                        <p style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>
                          {member.role}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section style={{ paddingBottom: '120px' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 2rem' }}>
            <div
              style={{
                background: '#020617',
                borderRadius: '36px',
                padding: '4rem 2rem',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff' }}>
                  Small Team. Big Vision.
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '24px',
                      padding: '2rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: '#fff' }}>
                      {stat.value}
                    </div>
                    <div style={{ marginTop: '0.8rem', color: '#94a3b8' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}