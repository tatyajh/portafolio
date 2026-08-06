"use client";

import { motion } from 'framer-motion';
import { CV_SKILLS } from '@/data/cv';
import { TECH_IDENTITY_ROLES } from '@/data/techRoute';

export default function TechIdentity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-10"
    >
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TECH_IDENTITY_ROLES.map(role => (
          <span
            key={role}
            className="px-3 py-1.5 bg-[#8B0000]/20 border border-[#8B0000]/50 text-[#E8C9A0] text-sm tracking-wide"
          >
            {role}
          </span>
        ))}
      </div>

      <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1 mb-6">
        capacidades
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {CV_SKILLS.map(group => (
          <span
            key={group.category}
            className="px-3 py-1 border border-[#E8C9A0]/20 text-[#E8C9A0]/70 text-sm tracking-wide"
          >
            {group.category}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
