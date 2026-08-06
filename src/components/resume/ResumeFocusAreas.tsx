"use client";

import { motion } from 'framer-motion';
import { CV_FOCUS_AREAS } from '@/data/cv';

export default function ResumeFocusAreas() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mb-12"
    >
      <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1 mb-6">
        áreas de exploración
      </p>
      <div className="space-y-4">
        {CV_FOCUS_AREAS.map(area => (
          <div key={area.label} className="border-l-2 border-[#8B0000]/40 pl-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-serif text-[#f5f0e6]">{area.label}</span>
              <span className="text-xs uppercase tracking-widest text-[#E8C9A0]/50">{area.period}</span>
            </div>
            <p className="text-sm text-[#E8C9A0]/70">{area.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
