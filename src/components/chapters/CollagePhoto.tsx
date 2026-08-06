"use client";

import { motion } from 'framer-motion';

interface CollagePhotoProps {
  src: string;
  alt: string;
  caption?: string;
  tilt?: 'l' | 'r';
  tape?: { side: 'left' | 'right' };
  delay?: number;
}

export default function CollagePhoto({ src, alt, caption, tilt, tape, delay = 0.3 }: CollagePhotoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`paper-card stitch-border-gold relative p-2 sm:p-3 ${tilt === 'l' ? 'tilt-l' : tilt === 'r' ? 'tilt-r' : ''}`}
    >
      {tape && (
        <div className={`tape -top-3 ${tape.side === 'left' ? 'left-6 -rotate-6' : 'right-6 rotate-3'}`} />
      )}
      <div className="overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>
      {caption && (
        <p className="mt-2 text-sm sm:text-base italic text-center caption-glow-dark">
          — {caption} —
        </p>
      )}
    </motion.div>
  );
}
