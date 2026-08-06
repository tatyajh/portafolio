"use client";

import { motion } from 'framer-motion';
import { CV_SKILLS } from '@/data/cv';

export default function ResumeSkills() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="mb-12"
    >
      <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1 mb-6">
        habilidades
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CV_SKILLS.map(group => (
          <div key={group.category}>
            <p className="text-xs tracking-widest uppercase text-[#E8C9A0] mb-3 text-center md:text-left">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {group.items.map(item => (
                <span
                  key={item}
                  className="px-3 py-1 border border-[#E8C9A0]/20 text-[#E8C9A0]/70 text-sm tracking-wide"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
