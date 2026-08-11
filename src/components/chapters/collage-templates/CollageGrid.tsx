"use client";

import { motion } from 'framer-motion';
import GothicCorner from '../GothicCorner';
import type { CollageItem, CollageMode } from './types';

interface CollageGridProps {
  items: CollageItem[];
  mode?: CollageMode;
}

const MODE_CAPTION: Record<CollageMode, 'default' | 'script'> = {
  editorial: 'default',
  journal: 'script',
  documentary: 'script',
  technical: 'default',
};

// Los originales que reemplazan las fotos de figurines son tableros
// técnicos densos (paletas, fichas, bocetos pequeños) — en 2-3
// columnas el texto quedaba ilegible. Una sola columna ancha, cada
// figurín ocupa el ancho completo disponible para poder leerse.
const BREAKOUT = 'lg:-mx-16 xl:-mx-28';

// Grid estático y prolijo: a diferencia de Hero/Cluster/Spread, esta
// plantilla no se arrastra ni se solapa a propósito — es para
// secciones donde se prefiere ver todo ordenado de un vistazo, como
// los figurines de diseño.
export default function CollageGrid({ items, mode = 'editorial' }: CollageGridProps) {
  const captionVariant = MODE_CAPTION[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={`mb-16 flex flex-col items-center gap-8 sm:gap-10 ${BREAKOUT}`}
    >
      {items.map((item, i) => (
        <motion.figure
          key={item.src}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="paper-card gothic-frame relative p-1 sm:p-1.5">
            <div className="overflow-hidden rounded-[6px]">
              <img
                src={item.src}
                alt={item.alt}
                className="h-auto w-full object-contain transition-transform duration-500 hover:scale-[1.02]"
                loading="lazy"
                draggable={false}
              />
            </div>
            <GothicCorner className="-top-[7px] -left-[7px]" />
            <GothicCorner className="-top-[7px] -right-[7px] rotate-90" />
            <GothicCorner className="-bottom-[7px] -right-[7px] rotate-180" />
            <GothicCorner className="-bottom-[7px] -left-[7px] -rotate-90" />
          </div>
          {item.caption && (
            <figcaption
              className={`mt-2 text-center caption-glow ${
                captionVariant === 'script' ? 'font-script text-base' : 'text-xs italic'
              }`}
            >
              — {item.caption} —
            </figcaption>
          )}
        </motion.figure>
      ))}
    </motion.div>
  );
}
