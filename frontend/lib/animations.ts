import { gsap } from 'gsap';
import type { Variants } from 'framer-motion';

// ─── GSAP Presets ────────────────────────────────────────────────

export const fadeUp = (el: Element | null, delay = 0, duration = 0.8) => {
  if (!el) return;
  gsap.fromTo(
    el,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease: 'power3.out' }
  );
};

export const fadeIn = (el: Element | null, delay = 0, duration = 0.7) => {
  if (!el) return;
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration, delay, ease: 'power2.out' });
};

export const staggerChildren = (
  parent: Element | null,
  selector: string,
  stagger = 0.1,
  delay = 0
) => {
  if (!parent) return;
  const children = parent.querySelectorAll(selector);
  gsap.fromTo(
    children,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      delay,
      stagger,
      ease: 'power3.out',
    }
  );
};

export const floatLoop = (el: Element | null, distance = 16, duration = 4) => {
  if (!el) return;
  gsap.to(el, {
    y: `-=${distance}`,
    duration,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
  });
};

// ─── Framer Motion Variants ──────────────────────────────────────

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemFadeUp: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const itemFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export const scaleIn: Variants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const slideInLeft: Variants = {
  hidden: { x: -40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export const slideInRight: Variants = {
  hidden: { x: 40, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};