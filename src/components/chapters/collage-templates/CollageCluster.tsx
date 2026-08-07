"use client";

import { motion } from 'framer-motion';
import CollagePhoto from '../CollagePhoto';
import type { CollageItem, CollageMode } from './types';

interface CollageClusterProps {
  items: CollageItem[];
  mode?: CollageMode;
}

// Grupo pequeño (3-4 fotos) tipo diario visual: una foto ancla más
// grande y 2-3 acompañantes, repartidas a lo ancho y con desfases
// verticales — no una columna. Mismo enfoque de flujo que
// CollageSpread: nada de posiciones absolutas con alturas adivinadas,
// que era lo que dejaba las fotos apiladas y algunas muy pequeñas.
// Las leyendas van con su propia foto, no centradas para todo el grupo.
const SLOTS: {
  width: string;
  offset: string;
  overlap: string;
  z: string;
  tilt: 'l' | 'r';
  tape?: { side: 'left' | 'right' };
}[] = [
  { width: 'w-[58%] sm:w-[45%]', offset: 'mt-0', overlap: '', z: 'z-20', tilt: 'l', tape: { side: 'left' } },
  { width: 'w-[44%] sm:w-[34%]', offset: 'mt-14 sm:mt-20', overlap: '-ml-3 sm:-ml-5', z: 'z-30', tilt: 'r' },
  { width: 'w-[50%] sm:w-[38%]', offset: 'mt-4 sm:mt-8', overlap: '', z: 'z-10', tilt: 'r', tape: { side: 'right' } },
  { width: 'w-[46%] sm:w-[33%]', offset: 'mt-10 sm:mt-24', overlap: '-ml-2 sm:-ml-4', z: 'z-20', tilt: 'l' },
];

// Mismo motivo que en CollageSpread: sacar el collage de la columna
// de texto (max-w-3xl) para que no quede media pantalla vacía.
const BREAKOUT = 'lg:-mx-20 xl:-mx-40 2xl:-mx-64';

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
      className={`mb-16 flex w-auto flex-wrap items-start justify-center gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8 ${BREAKOUT}`}
    >
      {visible.map((item, i) => {
        const slot = SLOTS[i % SLOTS.length];
        return (
          <div key={i} className={`${slot.width} ${slot.offset} ${slot.overlap} ${slot.z} relative`}>
            <CollagePhoto
              src={item.src}
              alt={item.alt}
              caption={item.caption}
              tilt={slot.tilt}
              tape={slot.tape}
              rotateDeg={rotateDeg}
              captionVariant={captionVariant}
              delay={0.3 + i * 0.12}
              draggable
            />
          </div>
        );
      })}
    </motion.div>
  );
}
