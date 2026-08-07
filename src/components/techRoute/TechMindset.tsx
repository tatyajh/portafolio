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
      <p className="font-script text-2xl text-center text-gold-mid -rotate-1 mb-6">
        cómo pienso
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TECH_MINDSET_POINTS.map(point => (
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
