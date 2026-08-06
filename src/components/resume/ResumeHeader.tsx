"use client";

import { motion } from 'framer-motion';
import { CV_NAME, CV_TITLE, CV_CONTACT } from '@/data/cv';

export default function ResumeHeader() {
  return (
    <div className="text-center mb-10">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-script text-2xl sm:text-3xl text-[#D4A574]/90 -rotate-2 mb-1"
      >
        mi trayectoria, sin rodeos
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl mb-3 text-[#f5f0e6]"
      >
        {CV_NAME}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-serif text-xl sm:text-2xl italic text-[#E8C9A0] mb-6"
      >
        {CV_TITLE}
      </motion.p>
      <div className="stitch-line w-40 mx-auto mb-6" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#E8C9A0]/70"
      >
        <span>{CV_CONTACT.phone}</span>
        <span>{CV_CONTACT.email}</span>
        <span>{CV_CONTACT.location}</span>
      </motion.div>
    </div>
  );
}
