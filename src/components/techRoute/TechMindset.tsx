"use client";

import { motion } from 'framer-motion';
import { TECH_MINDSET_POINTS } from '@/data/techRoute';
import { useLanguage } from '@/context/LanguageContext';

const TECH_MINDSET_EN = [
  { label: 'Make it reliable', quote: 'engineering rigor, automated testing and scalable architectures' },
  { label: 'What design gave me', quote: 'a creative perspective from fashion design, applied to character design and UI/UX decisions' },
  { label: 'AI as a tool', quote: 'I use Spec-Driven Development and AI strategically to prototype and validate ideas faster' },
  { label: 'Security from the start', quote: 'my cybersecurity knowledge strengthens quality and security from the design stage' },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {points.map(point => (
          <div key={point.label} className="paper-card stitch-border p-4">
            <p className="text-xs tracking-widest uppercase text-burgundy/80 mb-2">
              {point.label}
            </p>
            <p className="font-script text-lg leading-tight text-ink-light">
              &quot;{point.quote}&quot;
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
