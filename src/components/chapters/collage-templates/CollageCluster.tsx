"use client";

import { motion } from 'framer-motion';
import CollagePhoto from '../CollagePhoto';
import type { CollageItem, CollageMode } from './types';

interface CollageClusterProps {
  items: CollageItem[];
  mode?: CollageMode;
}

// Foto ancla + 2-3 fotos menores en distintas esquinas, con rotación,
// escala y z-index mixtos — no una fila ni una grilla. Las posiciones
// están escalonadas en vertical para que las piezas se rocen en los
// bordes sin taparse: montarlas demasiado hacía ilegibles las fotos
// de abajo (feedback directo). Las leyendas van junto a su propia
// foto, no centradas para todo el grupo.
const SLOTS: { className: string; tilt: 'l' | 'r'; tape?: { side: 'left' | 'right' } }[] = [
  { className: 'absolute left-0 top-0 w-[54%] sm:w-[48%] z-10', tilt: 'l', tape: { side: 'left' } },
  { className: 'absolute right-0 top-[16%] w-[40%] sm:w-[36%] z-20', tilt: 'r' },
  { className: 'absolute left-[6%] top-[54%] w-[42%] sm:w-[38%] z-30', tilt: 'r', tape: { side: 'right' } },
  { className: 'absolute right-[3%] top-[72%] w-[34%] sm:w-[30%] z-20', tilt: 'l' },
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
      className="relative mb-28 sm:mb-32 min-h-[620px] sm:min-h-[760px] w-full"
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
              draggable
            />
          </div>
        );
      })}
    </motion.div>
  );
}
