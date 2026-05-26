'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const from: gsap.TweenVars =
      direction === 'up'
        ? { y: 40, opacity: 0 }
        : direction === 'left'
        ? { x: -40, opacity: 0 }
        : { x: 40, opacity: 0 };

    gsap.fromTo(ref.current, from, {
      ...(direction === 'up' ? { y: 0 } : { x: 0 }),
      opacity: 1,
      duration: 0.85,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 88%',
      },
    });
  }, [delay, direction]);

  return <div ref={ref}>{children}</div>;
}