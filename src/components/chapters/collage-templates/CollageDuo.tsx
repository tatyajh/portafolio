"use client";

import { motion } from 'framer-motion';
import CollagePhoto from '../CollagePhoto';
import type { CollageItem, CollageMode } from './types';

interface CollageDuoProps {
  items: CollageItem[];
  mode?: CollageMode;
}

const MODE_CAPTION: Record<CollageMode, 'default' | 'script'> = {
  editorial: 'default',
  journal: 'script',
  documentary: 'script',
  technical: 'default',
};

const MODE_ROTATE: Record<CollageMode, number> = {
  editorial: 2,
  journal: 3,
  documentary: 3,
  technical: 2,
};

// Dos fotos por fila, siempre — a diferencia de Cluster (que las
// desfasa y solapa), acá cada foto ocupa su propia columna, en orden,
// pero se pueden seguir arrastrando y reacomodar como el resto del
// collage.
export default function CollageDuo({ items, mode = 'journal' }: CollageDuoProps) {
  const captionVariant = MODE_CAPTION[mode];
  const rotateDeg = MODE_ROTATE[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mb-16 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10"
    >
      {items.map((item, i) => (
        <CollagePhoto
          key={item.src}
          src={item.src}
          alt={item.alt}
          caption={item.caption}
          tilt={i % 2 === 0 ? 'l' : 'r'}
          tape={i < 2 ? { side: i % 2 === 0 ? 'left' : 'right' } : undefined}
          rotateDeg={rotateDeg}
          captionVariant={captionVariant}
          delay={0.3 + i * 0.12}
          draggable
        />
      ))}
    </motion.div>
  );
}
