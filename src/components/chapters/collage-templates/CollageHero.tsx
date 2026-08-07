"use client";

import { motion } from 'framer-motion';
import CollagePhoto from '../CollagePhoto';
import type { CollageMode } from './types';

interface CollageHeroProps {
  src: string;
  alt: string;
  caption?: string;
  mode?: CollageMode;
  delay?: number;
}

// Una sola foto, gran formato, fuera de eje — mucho espacio negativo
// alrededor en vez de centrarla. 'editorial'/'technical' sangran el
// borde derecho; 'journal'/'documentary' quedan ancladas a la izquierda
// con más aire alrededor, como una foto suelta pegada en una página.
const MODE_CONFIG: Record<CollageMode, { tilt: 'l' | 'r'; align: 'left' | 'right'; bleed: boolean; captionVariant: 'default' | 'script' }> = {
  editorial: { tilt: 'r', align: 'right', bleed: true, captionVariant: 'default' },
  journal: { tilt: 'l', align: 'left', bleed: false, captionVariant: 'script' },
  documentary: { tilt: 'r', align: 'left', bleed: false, captionVariant: 'script' },
  technical: { tilt: 'l', align: 'right', bleed: true, captionVariant: 'default' },
};

export default function CollageHero({ src, alt, caption, mode = 'journal', delay = 0.3 }: CollageHeroProps) {
  const cfg = MODE_CONFIG[mode];
  const positionClass =
    cfg.align === 'left'
      ? `left-0 sm:left-[6%] ${cfg.bleed ? '-ml-4 sm:-ml-10' : ''}`
      : `right-0 sm:right-[6%] ${cfg.bleed ? '-mr-4 sm:-mr-10' : ''}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="relative mb-16 w-full"
    >
      <div className={`relative w-[76%] sm:w-[56%] max-w-md ${positionClass}`}>
        <CollagePhoto
          src={src}
          alt={alt}
          caption={caption}
          tilt={cfg.tilt}
          tape={{ side: cfg.align === 'left' ? 'left' : 'right' }}
          rotateDeg={4}
          captionVariant={cfg.captionVariant}
          delay={delay}
        />
      </div>
    </motion.div>
  );
}
