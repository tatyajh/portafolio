"use client";

import { motion } from 'framer-motion';
import { TECH_MINDSET_POINTS } from '@/data/techRoute';
import { useLanguage } from '@/context/LanguageContext';

const TECH_MINDSET_EN = [
  { label: "Don't let it break", quote: 'Before calling something done I test it, with automated tests in Jest, Cypress or Playwright.' },
  { label: 'What design gave me', quote: "Fashion taught me to think about who will use it. I apply that to characters and interfaces." },
  { label: 'Security from the start', quote: 'I know cybersecurity, so I think about risks while designing, not at the end.' },
];

export default function TechMindset() {
  const { locale } = useLanguage();
  const points = locale === 'en' ? TECH_MINDSET_EN : TECH_MINDSET_POINTS;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <p className="font-script text-2xl text-center text-gold-mid -rotate-1 mb-6">
        {locale === 'en' ? 'how I think' : 'cómo pienso'}
      </p>
      {/* Una sola hoja con una lista: cada punto mide lo que tiene que medir */}
      <ul className="paper-card stitch-border px-6 py-5 sm:px-8 divide-y divide-dashed divide-ink-light/30">
        {points.map(point => (
          <li key={point.label} className="py-3 sm:flex sm:gap-6">
            <p className="font-serif text-lg text-burgundy sm:w-56 sm:flex-none">{point.label}</p>
            <p className="text-ink-light leading-relaxed">{point.quote}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
