"use client";

import { motion } from 'framer-motion';

interface CollagePhotoProps {
  src: string;
  alt: string;
  caption?: string;
  tilt?: 'l' | 'r';
  tape?: { side: 'left' | 'right' };
  delay?: number;
  /** Grados de rotación cuando hay tilt. Default 3 — igual al comportamiento previo. */
  rotateDeg?: number;
  /** 'script' usa tipografía manuscrita (journal/documentary); default mantiene el look original. */
  captionVariant?: 'default' | 'script';
}

export default function CollagePhoto({ src, alt, caption, tilt, tape, delay = 0.3, rotateDeg = 3, captionVariant = 'default' }: CollagePhotoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: tilt === 'l' ? -rotateDeg : tilt === 'r' ? rotateDeg : 0 }}
      transition={{ delay, duration: 0.4 }}
      className="paper-card stitch-border-gold relative p-3 sm:p-4"
    >
      {tape && (
        <div className={`tape -top-4 w-24 h-8 ${tape.side === 'left' ? 'left-4 -rotate-6' : 'right-4 rotate-6'}`} />
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
        <p
          className={`mt-2 text-center caption-glow-dark ${
            captionVariant === 'script' ? 'font-script text-lg sm:text-xl' : 'text-sm sm:text-base italic'
          }`}
        >
          — {caption} —
        </p>
      )}
    </motion.div>
  );
}
