"use client";

import { motion } from 'framer-motion';
import GothicCorner from '../GothicCorner';
import type { CollageItem, CollageMode } from './types';

interface CollageAlbumsProps {
  items: CollageItem[];
  /** Cada grupo es una lista de números de archivo (ej. pole-6 → 6), en el orden en que se agrupan. */
  groups: number[][];
  mode?: CollageMode;
  /** Números de archivo que ocupan la fila completa, sin recorte
      (ej. fotos horizontales que el recuadro 3:4 dejaba "mochas"). */
  fullRowNumbers?: number[];
}

const MODE_CAPTION: Record<CollageMode, 'default' | 'script'> = {
  editorial: 'default',
  journal: 'script',
  documentary: 'script',
  technical: 'default',
};

function extractNumber(src: string): number | null {
  const m = src.match(/-(\d+)\.[a-zA-Z]+$/);
  return m ? parseInt(m[1], 10) : null;
}

// Agrupa una galería grande en "álbumes" — subconjuntos con su propia
// tarjeta de papel, separados por una costura, en vez de un solo
// tablero mezclado. Reutiliza el mismo marco gótico y grid estático
// que CollageGrid, pero por grupo.
export default function CollageAlbums({ items, groups, mode = 'documentary', fullRowNumbers = [] }: CollageAlbumsProps) {
  const captionVariant = MODE_CAPTION[mode];
  const byNumber = new Map<number, CollageItem>();
  items.forEach(item => {
    const n = extractNumber(item.src);
    if (n !== null) byNumber.set(n, item);
  });

  return (
    <div className="mb-16 space-y-10">
      {groups.map((groupNums, gi) => {
        const groupItems = groupNums
          .map(n => byNumber.get(n))
          .filter((it): it is CollageItem => Boolean(it));
        if (groupItems.length === 0) return null;

        return (
          <motion.div
            key={gi}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {gi > 0 && <div className="stitch-line w-16 mx-auto mb-8" />}
            <div
              className={`grid gap-4 sm:gap-6 ${
                groupItems.length === 1
                  ? 'grid-cols-1 max-w-xs mx-auto'
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}
            >
              {groupItems.map((item, i) => {
                const n = extractNumber(item.src);
                const isFullRow = n !== null && fullRowNumbers.includes(n);
                return (
                  <motion.figure
                    key={item.src}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                    className={isFullRow ? 'col-span-full' : undefined}
                  >
                    <div className="paper-card gothic-frame relative p-1 sm:p-1.5">
                      <div className={`overflow-hidden rounded-[6px] ${isFullRow ? '' : 'aspect-[3/4]'}`}>
                        <img
                          src={item.src}
                          alt={item.alt}
                          className={
                            isFullRow
                              ? 'h-auto w-full object-contain'
                              : 'h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]'
                          }
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
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
