"use client";

import { motion } from 'framer-motion';
import { TECH_MINDSET_POINTS } from '@/data/techRoute';

export default function TechMindset() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-12"
    >
      <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1 mb-6">
        cómo pienso
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TECH_MINDSET_POINTS.map(point => (
          <div key={point.label} className="paper-card stitch-border p-4">
            <p className="text-xs tracking-widest uppercase text-[#8B0000]/80 mb-2">
              {point.label}
            </p>
            <p className="font-script text-lg leading-tight text-[#6b5540]">
              &quot;{point.quote}&quot;
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
