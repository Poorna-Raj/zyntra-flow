import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global GSAP defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

// ScrollTrigger global settings
ScrollTrigger.config({
  ignoreMobileResize: true,
});

export { gsap, ScrollTrigger };