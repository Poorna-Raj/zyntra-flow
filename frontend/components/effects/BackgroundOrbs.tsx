'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface OrbConfig {
  x: string;
  y: string;
  size: string;
  color: string;
  duration: number;
  delay: number;
}

const orbs: OrbConfig[] = [
  {
    x: '-10%',
    y: '-5%',
    size: '600px',
    color: 'radial-gradient(circle, rgba(91,186,255,0.18) 0%, transparent 70%)',
    duration: 8,
    delay: 0,
  },
  {
    x: '70%',
    y: '10%',
    size: '500px',
    color: 'radial-gradient(circle, rgba(30,144,255,0.12) 0%, transparent 70%)',
    duration: 10,
    delay: 1.5,
  },
  {
    x: '30%',
    y: '60%',
    size: '400px',
    color: 'radial-gradient(circle, rgba(0,196,255,0.1) 0%, transparent 70%)',
    duration: 9,
    delay: 0.8,
  },
];

export default function BackgroundOrbs() {
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    orbRefs.current.forEach((el, i) => {
      if (!el) return;
      const orb = orbs[i];

      gsap.to(el, {
        y: '+=40',
        x: '+=20',
        duration: orb.duration,
        delay: orb.delay,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          ref={(el: HTMLDivElement | null) => void (orbRefs.current[i] = el)}
          style={{
            position: 'absolute',
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            borderRadius: '50%',
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
}