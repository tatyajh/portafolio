"use client";

import { motion } from 'framer-motion';
import { RESUME_LINKS } from '@/data/resume';
import { SOCIAL_ICONS } from '@/lib/socialIcons';

export default function ResumeLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-wrap justify-center gap-4 mb-12"
    >
      {RESUME_LINKS.map(link => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 border border-burgundy/40 text-gold hover:bg-burgundy/10 transition-all tracking-wider text-sm uppercase rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d={SOCIAL_ICONS[link.label]}/>
          </svg>
          {link.label}
        </a>
      ))}
    </motion.div>
  );
}
