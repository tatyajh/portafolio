"use client";

import { motion } from 'framer-motion';
import { CV_LANGUAGES, CV_TRAINING, CV_TAGLINE } from '@/data/cv';

export default function ResumeExtras() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="mb-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <div>
          <p className="text-xs tracking-widest uppercase text-[#E8C9A0] mb-3 text-center sm:text-left">
            Idiomas
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {CV_LANGUAGES.map(lang => (
              <span
                key={lang.language}
                className="px-3 py-1 border border-[#8B0000]/40 text-[#E8C9A0]/70 text-sm tracking-wide"
              >
                {lang.language} — {lang.level}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs tracking-widest uppercase text-[#E8C9A0] mb-3 text-center sm:text-left">
            Formación adicional
          </p>
          <ul className="space-y-1.5 text-sm text-[#E8C9A0]/70 text-center sm:text-left">
            {CV_TRAINING.map(t => (
              <li key={t.label}>{t.label} — {t.provider} ({t.year})</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="font-script text-xl text-center text-[#D4A574]/70">
        {CV_TAGLINE}
      </p>
    </motion.div>
  );
}
