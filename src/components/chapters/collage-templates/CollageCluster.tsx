"use client";

import { motion } from 'framer-motion';
import CollagePhoto from '../CollagePhoto';
import type { CollageItem, CollageMode } from './types';

interface CollageClusterProps {
  items: CollageItem[];
  mode?: CollageMode;
}

// Foto ancla + 2-3 fotos menores superpuestas en distintas esquinas,
// con rotación/escala/z-index mixtos — no una fila ni una grilla.
// Las leyendas van junto a su propia foto (CollagePhoto ya las ubica
// debajo de cada una), no centradas para todo el grupo.
const SLOTS: { className: string; tilt: 'l' | 'r'; tape?: { side: 'left' | 'right' } }[] = [
  { className: 'absolute left-0 top-0 w-[56%] sm:w-[50%] z-10', tilt: 'l', tape: { side: 'left' } },
  { className: 'absolute right-0 top-[6%] w-[40%] sm:w-[36%] z-20', tilt: 'r' },
  { className: 'absolute left-[16%] bottom-0 w-[38%] sm:w-[34%] z-30', tilt: 'r', tape: { side: 'right' } },
  { className: 'absolute right-[4%] bottom-[-2%] w-[32%] sm:w-[28%] z-20', tilt: 'l' },
];

const MODE_CAPTION: Record<CollageMode, 'default' | 'script'> = {
  editorial: 'default',
  journal: 'script',
  documentary: 'script',
  technical: 'default',
};

const MODE_ROTATE: Record<CollageMode, number> = {
  editorial: 3,
  journal: 5,
  documentary: 4,
  technical: 3,
};

export default function CollageCluster({ items, mode = 'journal' }: CollageClusterProps) {
  const visible = items.slice(0, 4);
  const captionVariant = MODE_CAPTION[mode];
  const rotateDeg = MODE_ROTATE[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="relative mb-24 sm:mb-28 min-h-[360px] sm:min-h-[440px] w-full"
    >
      {visible.map((item, i) => {
        const slot = SLOTS[i % SLOTS.length];
        return (
          <div key={i} className={slot.className}>
            <CollagePhoto
              src={item.src}
              alt={item.alt}
              caption={item.caption}
              tilt={slot.tilt}
              tape={slot.tape}
              rotateDeg={rotateDeg}
              captionVariant={captionVariant}
              delay={0.3 + i * 0.15}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
