"use client";

import { motion } from 'framer-motion';
import { CV_PDF_PATH, CV_PDF_DOWNLOAD_NAME } from '@/data/cv';

export default function ResumeDownloadButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex justify-center mb-12"
    >
      <motion.a
        href={CV_PDF_PATH}
        download={CV_PDF_DOWNLOAD_NAME}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 bg-gold text-black font-serif tracking-wider hover:bg-[#F0D0A0] transition-all flex items-center gap-3"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
        </svg>
        Descargar CV (PDF)
      </motion.a>
    </motion.div>
  );
}
