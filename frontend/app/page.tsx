'use client';

import Navbar from '@/components/ui/Navbar';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Roadmap from '@/components/sections/Roadmap';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Roadmap />
      <FAQ />
      <Footer />
    </main>
  );
}