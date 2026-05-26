'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedGradientProps {
  style?: React.CSSProperties;
}

export default function AnimatedGradient({ style }: AnimatedGradientProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      backgroundPosition: '200% 200%',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background:
          'linear-gradient(135deg, #EBF5FF, #D6EDFF, #B3D9FF, #EBF5FF)',
        backgroundSize: '300% 300%',
        backgroundPosition: '0% 0%',
        ...style,
      }}
    />
  );
}