"use client";

import { motion } from 'framer-motion';
import CollagePhoto from '../CollagePhoto';
import type { CollageItem, CollageMode } from './types';

interface CollageSpreadProps {
  items: CollageItem[];
  mode?: CollageMode;
}

// Tablero editorial para galerías grandes (8-11 fotos).
//
// Antes esto usaba filas con posiciones absolutas y alturas fijas
// adivinadas: como las fotos reales tienen proporciones distintas, el
// resultado quedaba apilado en vertical y con piezas diminutas. Ahora
// las fotos fluyen en un contenedor flex que envuelve — se reparten
// solas a lo ancho, caben 2 por fila en móvil y 3 en escritorio — y el
// carácter de collage sale de variar ancho, desfase vertical, rotación
// y profundidad por posición, no de coordenadas absolutas frágiles.
//
// Los anchos nunca bajan de ~35% (móvil) / ~24% (escritorio) para que
// ninguna quede demasiado pequeña.
const SLOTS: {
  width: string;
  offset: string;
  overlap: string;
  z: string;
  tilt: 'l' | 'r';
  tape?: { side: 'left' | 'right' };
}[] = [
  { width: 'w-[56%] sm:w-[38%]', offset: 'mt-0', overlap: '', z: 'z-20', tilt: 'l', tape: { side: 'left' } },
  { width: 'w-[42%] sm:w-[29%]', offset: 'mt-8 sm:mt-14', overlap: '-ml-3 sm:-ml-5', z: 'z-30', tilt: 'r' },
  { width: 'w-[48%] sm:w-[31%]', offset: 'mt-4 sm:mt-3', overlap: '', z: 'z-10', tilt: 'r', tape: { side: 'right' } },
  { width: 'w-[50%] sm:w-[34%]', offset: 'mt-3 sm:mt-10', overlap: '-ml-2 sm:-ml-4', z: 'z-20', tilt: 'l' },
  { width: 'w-[44%] sm:w-[29%]', offset: 'mt-9 sm:mt-2', overlap: '', z: 'z-30', tilt: 'l' },
  { width: 'w-[52%] sm:w-[34%]', offset: 'mt-2 sm:mt-12', overlap: '-ml-3', z: 'z-10', tilt: 'r', tape: { side: 'left' } },
];

// Los capítulos renderizan su contenido dentro de una columna de
// max-w-3xl (768px), pensada para texto. Para el collage eso dejaba
// media pantalla vacía en escritorio. Estos márgenes negativos lo
// sacan de esa columna por etapas — sin unidades de viewport, que
// provocarían scroll horizontal al no contar la barra de scroll.
const BREAKOUT = 'lg:-mx-24 xl:-mx-52 2xl:-mx-80';

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
  const captionVariant = MODE_CAPTION[mode];
  const rotateDeg = MODE_ROTATE[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className={`mb-12 flex w-auto flex-wrap items-start justify-center gap-x-3 gap-y-4 sm:gap-x-5 sm:gap-y-6 ${BREAKOUT}`}
    >
      {items.map((item, i) => {
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
              delay={0.2 + i * 0.08}
              draggable
            />
          </div>
        );
      })}
    </motion.div>
  );
}
