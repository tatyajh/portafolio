"use client";

import { motion } from 'framer-motion';
import { CV_EDUCATION } from '@/data/cv';

export default function ResumeEducation() {
  return (
    <div className="mb-12">
      <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1 mb-6">
        educación
      </p>
      <div className="space-y-4">
        {CV_EDUCATION.map((edu, i) => (
          <motion.div
            key={edu.degree}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1 }}
            className={`paper-card stitch-border p-4 sm:p-5 ${i % 2 === 0 ? 'tilt-r' : 'tilt-l'}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-serif text-lg text-[#2a2018]">{edu.degree}</h3>
              <span className="text-xs uppercase tracking-widest text-[#A0522D]">{edu.date}</span>
            </div>
            <p className="font-script text-base text-[#6b5540]">{edu.institution} — {edu.location}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
