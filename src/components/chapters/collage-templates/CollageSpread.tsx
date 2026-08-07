"use client";

import { motion } from 'framer-motion';
import CollagePhoto from '../CollagePhoto';
import type { CollageItem, CollageMode } from './types';

interface CollageSpreadProps {
  items: CollageItem[];
  mode?: CollageMode;
}

// Generalización del layout que ya tenía "diseno" a mano (pares lado a
// lado + piezas anchas sueltas + tríos superpuestos) en un componente
// reutilizable que recorre cualquier cantidad de fotos, no solo 10.
type RowKind = 'pair' | 'wide' | 'trio';
const ROW_CYCLE: RowKind[] = ['pair', 'wide', 'pair', 'trio', 'pair', 'wide'];

function buildRows(items: CollageItem[]) {
  const rows: { kind: RowKind; items: CollageItem[] }[] = [];
  let i = 0;
  let cycleIndex = 0;
  while (i < items.length) {
    const kind = ROW_CYCLE[cycleIndex % ROW_CYCLE.length];
    cycleIndex++;
    const take = kind === 'wide' ? 1 : kind === 'trio' ? 3 : 2;
    const slice = items.slice(i, i + take);
    if (slice.length === 0) break;
    let effectiveKind = kind;
    if (slice.length < take) {
      effectiveKind = slice.length === 1 ? 'wide' : 'pair';
    }
    rows.push({ kind: effectiveKind, items: slice });
    i += slice.length;
  }
  return rows;
}

const MODE_CAPTION: Record<CollageMode, 'default' | 'script'> = {
  editorial: 'default',
  journal: 'script',
  documentary: 'script',
  technical: 'default',
};

const MODE_ROTATE: Record<CollageMode, number> = {
  editorial: 2,
  journal: 4,
  documentary: 3,
  technical: 2,
};

export default function CollageSpread({ items, mode = 'documentary' }: CollageSpreadProps) {
  const rows = buildRows(items);
  const captionVariant = MODE_CAPTION[mode];
  const rotateDeg = MODE_ROTATE[mode];
  let globalIndex = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mb-12 w-full"
    >
      {rows.map((row, rowIdx) => {
        if (row.kind === 'wide') {
          const item = row.items[0];
          const delay = 0.2 + globalIndex * 0.1;
          globalIndex++;
          return (
            <div key={rowIdx} className="mb-4 sm:mb-6">
              <CollagePhoto
                src={item.src}
                alt={item.alt}
                caption={item.caption}
                tilt={rowIdx % 2 === 0 ? 'l' : 'r'}
                tape={rowIdx % 3 === 0 ? { side: 'left' } : undefined}
                rotateDeg={rotateDeg}
                captionVariant={captionVariant}
                delay={delay}
                draggable
              />
            </div>
          );
        }

        if (row.kind === 'trio') {
          const startDelay = 0.2 + globalIndex * 0.1;
          const els = row.items.map((item, i) => {
            const d = startDelay + i * 0.1;
            globalIndex++;
            return { item, i, d };
          });
          // Alto generoso y posiciones escalonadas: con el alto anterior
          // las tres fotos caían una encima de otra en vez de rozarse
          // (feedback directo: "quedan demasiado montadas").
          return (
            <div key={rowIdx} className="relative mb-10 sm:mb-12 min-h-[560px] sm:min-h-[660px]">
              <div className="absolute left-0 top-0 w-[44%] sm:w-[38%] z-10">
                <CollagePhoto
                  src={els[0].item.src}
                  alt={els[0].item.alt}
                  caption={els[0].item.caption}
                  tilt="l"
                  tape={{ side: 'left' }}
                  rotateDeg={rotateDeg}
                  captionVariant={captionVariant}
                  delay={els[0].d}
                  draggable
                />
              </div>
              {els[1] && (
                <div className="absolute right-[6%] top-[18%] w-[36%] sm:w-[32%] z-20">
                  <CollagePhoto
                    src={els[1].item.src}
                    alt={els[1].item.alt}
                    caption={els[1].item.caption}
                    tilt="r"
                    rotateDeg={rotateDeg}
                    captionVariant={captionVariant}
                    delay={els[1].d}
                    draggable
                  />
                </div>
              )}
              {els[2] && (
                <div className="absolute left-[26%] top-[62%] w-[34%] sm:w-[30%] z-30">
                  <CollagePhoto
                    src={els[2].item.src}
                    alt={els[2].item.alt}
                    caption={els[2].item.caption}
                    tilt="l"
                    tape={{ side: 'right' }}
                    rotateDeg={rotateDeg}
                    captionVariant={captionVariant}
                    delay={els[2].d}
                    draggable
                  />
                </div>
              )}
            </div>
          );
        }

        // pair
        const startDelay = 0.2 + globalIndex * 0.1;
        const els = row.items.map((item, i) => {
          const d = startDelay + i * 0.1;
          globalIndex++;
          return { item, i, d };
        });
        return (
          <div key={rowIdx} className="grid grid-cols-2 gap-4 mb-4 sm:mb-6 items-start">
            {els.map(({ item, i, d }) => (
              <CollagePhoto
                key={i}
                src={item.src}
                alt={item.alt}
                caption={item.caption}
                tilt={i === 0 ? 'l' : 'r'}
                tape={i === 0 && rowIdx % 2 === 0 ? { side: 'left' } : undefined}
                rotateDeg={rotateDeg}
                captionVariant={captionVariant}
                delay={d}
                draggable
              />
            ))}
          </div>
        );
      })}
    </motion.div>
  );
}
