"use client";

import { motion } from 'framer-motion';
import { CV_EXPERIENCE } from '@/data/cv';

export default function ResumeExperience() {
  return (
    <div className="mb-12">
      <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1 mb-6">
        experiencia
      </p>
      <div className="space-y-6">
        {CV_EXPERIENCE.map((job, i) => (
          <motion.div
            key={`${job.role}-${job.company}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + i * 0.1 }}
            className={`paper-card stitch-border relative p-5 sm:p-6 ${i % 2 === 0 ? 'tilt-l' : 'tilt-r'}`}
          >
            {i === 0 && <div className="tape -top-3 left-8 -rotate-6" />}
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <h3 className="font-serif text-xl text-[#2a2018]">{job.role}</h3>
              <span className="text-xs uppercase tracking-widest text-[#A0522D]">{job.period}</span>
            </div>
            <p className="font-script text-lg text-[#6b5540] mb-3">
              {job.company}{job.location ? ` — ${job.location}` : ''}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-[#2a2018]/80 leading-relaxed">
              {job.bullets.map((bullet, bi) => (
                <li key={bi}>{bullet}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
