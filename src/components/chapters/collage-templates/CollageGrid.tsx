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

function GridFigure({
  item,
  i,
  captionVariant,
  className = 'w-full max-w-2xl',
}: {
  item: CollageItem;
  i: number;
  captionVariant: 'default' | 'script';
  className?: string;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
      className={className}
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
  );
}

// Corridas consecutivas de fotos marcadas `paired` (ej. las dos fotos
// de una misma muñeca) se agrupan en un bloque de dos columnas; el
// resto sigue a ancho completo.
type Chunk = { kind: 'single'; item: CollageItem; index: number } | { kind: 'pair'; items: [CollageItem, CollageItem]; index: number };

function chunkItems(items: CollageItem[]): Chunk[] {
  const chunks: Chunk[] = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.paired && items[i + 1]?.paired) {
      chunks.push({ kind: 'pair', items: [item, items[i + 1]], index: i });
      i += 2;
    } else {
      chunks.push({ kind: 'single', item, index: i });
      i += 1;
    }
  }
  return chunks;
}

// Grid estático y prolijo: a diferencia de Hero/Cluster/Spread, esta
// plantilla no se arrastra ni se solapa a propósito — es para
// secciones donde se prefiere ver todo ordenado de un vistazo, como
// los figurines de diseño.
export default function CollageGrid({ items, mode = 'editorial' }: CollageGridProps) {
  const captionVariant = MODE_CAPTION[mode];
  const chunks = chunkItems(items);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className={`mb-16 flex flex-col items-center gap-8 sm:gap-10 ${BREAKOUT}`}
    >
      {chunks.map(chunk =>
        chunk.kind === 'pair' ? (
          <div key={chunk.items[0].src} className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:gap-6">
            {chunk.items.map((item, j) => (
              <GridFigure key={item.src} item={item} i={chunk.index + j} captionVariant={captionVariant} className="w-full" />
            ))}
          </div>
        ) : (
          <GridFigure key={chunk.item.src} item={chunk.item} i={chunk.index} captionVariant={captionVariant} />
        )
      )}
    </motion.div>
  );
}
