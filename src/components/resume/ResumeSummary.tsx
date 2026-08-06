"use client";

import { motion } from 'framer-motion';
import { CV_SUMMARY } from '@/data/cv';

export default function ResumeSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-12"
    >
      <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1 mb-4">
        resumen profesional
      </p>
      <div className="paper-card stitch-border p-6">
        <p className="text-[#2a2018]/85 leading-relaxed">{CV_SUMMARY}</p>
      </div>
    </motion.div>
  );
}
