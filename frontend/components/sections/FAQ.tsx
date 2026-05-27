'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';

const faqs = [
  {
    q: 'Do I need a POS system or existing sales data?',
    a: 'No. Lokalens works from day one using contextual behavioral signals — payday cycles, holidays, regional climate, festival seasons, and more. You can start forecasting without any historical sales records.',
  },
  {
    q: 'Which provinces does Lokalens support?',
    a: 'All 9 provinces: Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, and Sabaragamuwa. Each province has its own demand model trained on localized behavioral patterns.',
  },
  {
    q: 'What products can Lokalens forecast?',
    a: 'The current MVP focuses on grocery and FMCG products — beverages, dairy, snacks, staples, and household goods. Future versions will expand to pharmacy, clothing, and restaurant inventory.',
  },
  {
    q: 'How accurate are the demand forecasts?',
    a: 'Accuracy improves over time. The initial synthetic model captures regional behavioral patterns well. Once integrated with your real sales data (V2), the model retrains and predictions become significantly more personalized and precise.',
  },
  {
    q: 'Can the AI chatbot work within my budget?',
    a: 'Yes. The AI stocking assistant accepts a budget in LKR, analyzes forecasted demand scores, and returns a ranked stocking recommendation — explaining which products to prioritize and why.',
  },
  {
    q: 'When will Lokalens be publicly available?',
    a: 'The MVP is being completed as part of an academic project (SDGP). Early access sign-ups are open now. Public launch is planned for after the final evaluation cycle.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      style={{
        padding: '8rem 0',
        background: 'linear-gradient(180deg, #EBF5FF 0%, #fff 100%)',
      }}
    >
      <div className="container" style={{ maxWidth: '760px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge" style={{ marginBottom: '1.2rem' }}>
              FAQ
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: 'var(--dark)',
                letterSpacing: '-0.02em',
              }}
            >
              Questions worth{' '}
              <span className="gradient-text">asking.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid var(--gray-200)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.4rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '1rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: openIndex === i ? 'var(--blue-primary)' : 'var(--dark)',
                    transition: 'color 0.25s',
                  }}
                >
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: openIndex === i ? 'var(--blue-primary)' : 'var(--gray-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: openIndex === i ? '#fff' : 'var(--gray-600)',
                    fontSize: '1.2rem',
                    lineHeight: 1,
                  }}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <p
                      style={{
                        paddingBottom: '1.4rem',
                        fontSize: '0.92rem',
                        color: 'var(--gray-600)',
                        lineHeight: 1.7,
                        fontWeight: 300,
                      }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}