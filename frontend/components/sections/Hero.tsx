'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

const Arrow = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 7.5h11M9 3l4.5 4.5L9 12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function DemandBar({ name, score, delay }: { name: string; score: number; delay: number }) {
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.22rem' }}>
        <span style={{ fontSize: '0.72rem', color: '#1e3a5f', fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: '0.72rem', color: '#1e90ff', fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(30,144,255,0.12)', borderRadius: '100px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #1e90ff, #0ea5e9)', borderRadius: '100px' }}
        />
      </div>
    </div>
  );
}

function Tag({ text, color = '#1e90ff' }: { text: string; color?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: `${color}18`, border: `1px solid ${color}44`,
      color, borderRadius: '100px',
      padding: '0.22rem 0.7rem', fontSize: '0.68rem', fontWeight: 700,
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
    }}>{text}</span>
  );
}

const partners = ['SDGP 2025', 'IIT', 'Western', 'Central', 'Southern', 'Northern', 'Eastern'];

export default function Hero() {
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const socialRef   = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(badgeRef.current,   { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5  })
      .fromTo(headingRef.current, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, '-=0.2')
      .fromTo(subRef.current,     { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, '-=0.38')
      .fromTo(ctaRef.current,     { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5  }, '-=0.32')
      .fromTo(socialRef.current,  { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.28')
      .fromTo(partnersRef.current,{ y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, '-=0.25')
      .fromTo(cardRef.current,    { x: 44, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85, ease: 'back.out(1.1)' }, '-=0.65');

    if (window.matchMedia('(min-width: 1024px)').matches) {
      gsap.to(cardRef.current, { y: -14, duration: 4.2, yoyo: true, repeat: -1, ease: 'sine.inOut', force3D: true });
    }
  }, []);

  return (
    <>
      <style>{`
        .hl-section {
          background: #ffffff;
          min-height: 100svh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding: clamp(5.5rem,12vw,8.5rem) clamp(1.25rem,6vw,3.5rem) clamp(3rem,6vw,5rem);
        }
        .hl-glow-a {
          position: absolute; pointer-events: none; z-index: 0;
          top: -10%; right: -5%;
          width: min(640px,80vw); height: min(640px,80vw);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(30,144,255,0.14) 0%, transparent 68%);
        }
        .hl-glow-b {
          position: absolute; pointer-events: none; z-index: 0;
          bottom: -8%; left: -6%;
          width: min(420px,60vw); height: min(420px,60vw);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 68%);
        }
        .hl-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(30,144,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,144,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 85% 75% at 50% 40%, black 15%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 40%, black 15%, transparent 100%);
        }
        .hl-inner {
          max-width: 1200px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1fr; gap: 3rem;
          align-items: center; position: relative; z-index: 1;
        }
        @media(min-width: 1024px) {
          .hl-inner { grid-template-columns: 1fr 400px; gap: 4rem; }
        }
        .hl-badge {
          display: inline-flex; align-items: center; gap: 0.45rem;
          background: rgba(30,144,255,0.08); border: 1px solid rgba(30,144,255,0.25);
          color: #1e90ff; border-radius: 100px;
          padding: 0.28rem 0.85rem; font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.07em; margin-bottom: 1.4rem;
        }
        .hl-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #1e90ff;
          box-shadow: 0 0 0 3px rgba(30,144,255,0.2);
          animation: hl-pulse 2s ease-in-out infinite;
        }
        @keyframes hl-pulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(30,144,255,0.2); }
          50%      { box-shadow: 0 0 0 5px rgba(30,144,255,0.08); }
        }
        .hl-h1 {
          font-size: clamp(2.5rem,6.5vw,4.4rem);
          font-weight: 800; line-height: 1.05; letter-spacing: -0.03em;
          color: #0f1c2e; margin-bottom: 1.3rem;
        }
        .hl-h1 .acc { color: #1e90ff; }
        .hl-sub {
          font-size: clamp(0.88rem,1.8vw,1rem);
          color: #4a6080; line-height: 1.78;
          font-weight: 300; margin-bottom: 2rem; max-width: 460px;
        }
        .hl-cta { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .hl-btn-fill {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: #1e90ff; color: #fff;
          border: none; border-radius: 100px;
          padding: 0.8rem 1.65rem; font-size: 0.87rem; font-weight: 700;
          cursor: pointer; transition: background 0.18s, transform 0.14s;
          text-decoration: none; white-space: nowrap;
        }
        .hl-btn-fill:hover { background: #1a7de0; transform: translateY(-1px); }
        .hl-btn-ghost {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: #1e3a5f;
          border: 1px solid rgba(30,144,255,0.25); border-radius: 100px;
          padding: 0.8rem 1.65rem; font-size: 0.87rem; font-weight: 600;
          cursor: pointer; transition: border-color 0.18s, background 0.18s;
          text-decoration: none; white-space: nowrap;
        }
        .hl-btn-ghost:hover { border-color: #1e90ff; background: rgba(30,144,255,0.05); }
        .hl-social {
          display: flex; align-items: center; gap: 0.85rem; flex-wrap: wrap;
          margin-top: 1.8rem;
        }
        .hl-avatars { display: flex; }
        .hl-av {
          width: 30px; height: 30px; border-radius: 50%;
          border: 2px solid #ffffff; margin-left: -8px;
          font-size: 0.52rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
        }
        .hl-av:first-child { margin-left: 0; }
        .hl-social-txt { font-size: 0.74rem; color: #4a6080; line-height: 1.45; }
        .hl-social-txt strong { color: #0f1c2e; }
        .hl-partners {
          border-top: 1px solid rgba(30,144,255,0.1);
          margin-top: 3rem; padding-top: 1.8rem;
        }
        .hl-partners-lbl {
          font-size: 0.67rem; color: #8aa0b8;
          letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1.1rem;
        }
        .hl-logos {
          display: flex; align-items: center;
          gap: clamp(1rem,3.5vw,2.2rem); flex-wrap: wrap;
        }
        .hl-logo {
          font-size: 0.78rem; font-weight: 800; letter-spacing: 0.07em;
          color: #b0c4d8; transition: color 0.2s; cursor: default;
        }
        .hl-logo:hover { color: #1e90ff; }
        .hl-cards {
          display: flex; flex-direction: column; gap: 0.8rem;
        }
        @media(max-width: 1023px) {
          .hl-cards { max-width: 400px; margin: 0 auto; width: 100%; }
        }
        .hl-card {
          background: #ffffff;
          border: 1px solid rgba(30,144,255,0.12);
          border-radius: 20px; padding: 1.2rem 1.35rem;
          box-shadow: 0 4px 24px rgba(30,144,255,0.07);
        }
        .hl-surge {
          background: linear-gradient(135deg, #1e6fd4 0%, #0ea5e9 100%);
          border: 1px solid rgba(30,144,255,0.3);
          border-radius: 20px; padding: 1.35rem;
          position: relative; overflow: hidden;
        }
        .hl-surge-orb {
          position: absolute; top: -38%; right: -18%;
          width: 170px; height: 170px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 68%);
          pointer-events: none;
        }
      `}</style>

      <section className="hl-section">
        <div className="hl-glow-a" />
        <div className="hl-glow-b" />
        <div className="hl-grid" />

        <div className="hl-inner">

          {/* ── Copy column ── */}
          <div>
            <div ref={badgeRef}>
              <div className="hl-badge">
                <span className="hl-dot" />
                AI-Powered · Sri Lanka
              </div>
            </div>

            <h1 ref={headingRef} className="hl-h1">
              Smart Predictions.<br />
              <span className="acc">Zero Waste.</span>
            </h1>

            <p ref={subRef} className="hl-sub">
              Lokalens uses localized AI to forecast grocery demand for Sri Lankan SMEs —
              province by province, season by season.
            </p>

            <div ref={ctaRef} className="hl-cta">
              <a href="#" className="hl-btn-fill">Get Early Access <Arrow /></a>
              <a href="#how-it-works" className="hl-btn-ghost">See How It Works <Arrow /></a>
            </div>

            <div ref={socialRef} className="hl-social">
              <div className="hl-avatars">
                {([['#1e90ff','SL'],['#0ea5e9','IIT'],['#10b981','WP'],['#f59e0b','SP']] as [string,string][]).map(([bg,label],i)=>(
                  <div key={i} className="hl-av" style={{background:bg}}>{label}</div>
                ))}
              </div>
              <p className="hl-social-txt">
                <strong>Backed by 20+</strong><br/>
                Research &amp; Development teams
              </p>
            </div>

            <div ref={partnersRef} className="hl-partners">
              <p className="hl-partners-lbl">Supported by</p>
              <div className="hl-logos">
                {partners.map(n => <span key={n} className="hl-logo">{n}</span>)}
              </div>
            </div>
          </div>

          {/* ── Floating cards column ── */}
          <div ref={cardRef} className="hl-cards">

            <div style={{display:'flex',gap:'0.55rem',flexWrap:'wrap'}}>
              <Tag text="SDGP GROUP | CS-87" color="#1e90ff"/>
              <Tag text="LIVE" color="#10b981"/>
            </div>

            {/* Demand forecast card */}
            <div className="hl-card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.85rem'}}>
                <div>
                  <p style={{fontSize:'0.63rem',fontWeight:700,letterSpacing:'0.09em',color:'#1e90ff',textTransform:'uppercase'}}>Demand Forecast</p>
                  <p style={{fontSize:'0.68rem',color:'#8aa0b8',marginTop:'0.08rem'}}>Southern · Week 24</p>
                </div>
                <span style={{background:'rgba(16,185,129,0.1)',color:'#059669',fontSize:'0.58rem',fontWeight:800,padding:'0.18rem 0.58rem',borderRadius:'100px',border:'1px solid rgba(16,185,129,0.2)'}}>↑ HIGH</span>
              </div>
              <DemandBar name="Coca-Cola 1.5L" score={91} delay={0.8}/>
              <DemandBar name="Anchor 400g"    score={84} delay={0.95}/>
              <DemandBar name="Munchee Choco"  score={79} delay={1.1}/>
              <div style={{marginTop:'0.8rem',padding:'0.58rem 0.72rem',background:'rgba(30,144,255,0.06)',border:'1px solid rgba(30,144,255,0.14)',borderRadius:'11px',display:'flex',gap:'0.48rem',alignItems:'center'}}>
                <span style={{fontSize:'0.82rem'}}>📍</span>
                <div>
                  <p style={{fontSize:'0.6rem',color:'#8aa0b8'}}>Province</p>
                  <p style={{fontSize:'0.74rem',fontWeight:700,color:'#0f1c2e'}}>Southern Province</p>
                </div>
              </div>
            </div>

            {/* Surge card */}
            <div className="hl-surge">
              <div className="hl-surge-orb"/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.95rem',position:'relative',zIndex:1}}>
                <p style={{fontSize:'0.76rem',fontWeight:600,color:'rgba(255,255,255,0.9)'}}>Payday Surge</p>
                <span style={{background:'rgba(255,255,255,0.2)',color:'#fff',fontSize:'0.58rem',fontWeight:800,padding:'0.18rem 0.6rem',borderRadius:'100px',border:'1px solid rgba(255,255,255,0.3)'}}>LIVE</span>
              </div>
              <p style={{fontSize:'2.5rem',fontWeight:800,letterSpacing:'-0.04em',lineHeight:1,color:'#fff',position:'relative',zIndex:1}}>+34%</p>
              <p style={{fontSize:'0.74rem',color:'rgba(255,255,255,0.7)',margin:'0.22rem 0 0.95rem',position:'relative',zIndex:1}}>Expected demand spike</p>
              <div style={{background:'rgba(255,255,255,0.15)',borderRadius:'11px',padding:'0.68rem 0.82rem',position:'relative',zIndex:1}}>
                <p style={{fontSize:'0.6rem',color:'rgba(255,255,255,0.65)',marginBottom:'0.12rem'}}>Top Region</p>
                <p style={{fontWeight:700,fontSize:'0.84rem',color:'#fff'}}>Western Province</p>
              </div>
            </div>

            {/* Mini event card */}
            <div className="hl-card" style={{display:'flex',gap:'0.65rem',alignItems:'center',padding:'0.85rem 1.1rem'}}>
              <div style={{width:'34px',height:'34px',borderRadius:'10px',background:'rgba(30,144,255,0.1)',border:'1px solid rgba(30,144,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'0.92rem'}}>
                🎉
              </div>
              <div>
                <p style={{fontSize:'0.62rem',color:'#8aa0b8'}}>Upcoming Signal</p>
                <p style={{fontSize:'0.78rem',fontWeight:700,color:'#0f1c2e'}}>Vesak Poya · 3 days</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}