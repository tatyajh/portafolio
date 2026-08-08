"use client";

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TITLE = 'Portafolio';
// Se corta como máximo cerca de los bordes, nunca justo en el borde:
// un corte al 2% no se leería como corte, solo como letra movida.
const MIN_CUT_PCT = 25;
const MAX_CUT_PCT = 75;
const REPAIR_FLASH_MS = 700;

interface ToolMoveDetail {
  x: number;
  y: number;
  category: string;
}

// Título del splash, letra por letra: las tijeras lo cortan y la aguja
// lo vuelve a coser. El texto sigue siendo texto real (el h1 conserva
// su aria-label, así que lectores de pantalla y buscadores leen
// "Portafolio" completo aunque en pantalla esté partido).
//
// La comunicación con la capa Pixi es por eventos de window y solo
// mientras se arrastra una herramienta, no cada frame — mover un
// ícono cualquiera no dispara ni un render de React aquí.
export default function SplashTitle() {
  const letters = TITLE.split('');
  const [cuts, setCuts] = useState<(number | null)[]>(() => letters.map(() => null));
  const [repaired, setRepaired] = useState<Set<number>>(() => new Set());
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const onToolMove = (evt: Event) => {
      const { x, y, category } = (evt as CustomEvent<ToolMoveDetail>).detail;
      if (category !== 'tijeras' && category !== 'aguja') return;

      const repairedNow: number[] = [];

      setCuts(prev => {
        let changed = false;
        const next = prev.slice();

        letterRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;

          if (category === 'tijeras' && next[i] === null) {
            // El corte queda a la altura por donde pasó el filo.
            const pct = ((y - r.top) / r.height) * 100;
            next[i] = Math.min(Math.max(pct, MIN_CUT_PCT), MAX_CUT_PCT);
            changed = true;
          } else if (category === 'aguja' && next[i] !== null) {
            next[i] = null;
            repairedNow.push(i);
            changed = true;
          }
        });

        return changed ? next : prev;
      });

      // Destello dorado breve en la letra recién cosida.
      if (repairedNow.length > 0) {
        setRepaired(prev => {
          const next = new Set(prev);
          repairedNow.forEach(i => next.add(i));
          return next;
        });
        const t = setTimeout(() => {
          setRepaired(prev => {
            const next = new Set(prev);
            repairedNow.forEach(i => next.delete(i));
            return next;
          });
        }, REPAIR_FLASH_MS);
        timeoutsRef.current.push(t);
      }
    };

    window.addEventListener('splash-tool-move', onToolMove);
    return () => {
      window.removeEventListener('splash-tool-move', onToolMove);
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  return (
    <motion.h1
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
      aria-label={TITLE}
      // whitespace-nowrap es obligatorio: al partir el título en un
      // span por letra, cada uno es un inline-block y el navegador
      // puede cortar la palabra entre letras. En móvil el título va
      // justo al ancho de la pantalla, así que la "o" final se caía a
      // la línea de abajo. Como palabra suelta nunca se partía.
      className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 text-ivory leading-none tracking-tight uppercase whitespace-nowrap"
    >
      {letters.map((letter, i) => {
        const cut = cuts[i];
        const justRepaired = repaired.has(i);

        return (
          <span
            key={i}
            ref={el => {
              letterRefs.current[i] = el;
            }}
            aria-hidden="true"
            className="relative inline-block"
          >
            {cut === null ? (
              <motion.span
                className="inline-block"
                // Al volver de un corte: destello dorado que se apaga,
                // como el brillo del hilo recién pasado.
                animate={
                  justRepaired
                    ? { color: ['#E8C9A0', '#f5f0e6'], scale: [1.12, 1] }
                    : { color: '#f5f0e6', scale: 1 }
                }
                transition={{ duration: justRepaired ? 0.7 : 0 }}
              >
                {letter}
              </motion.span>
            ) : (
              <>
                {/* Mantiene el ancho de la letra para que el título no
                    se reacomode al cortarse. */}
                <span className="invisible">{letter}</span>
                <motion.span
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 0 ${100 - cut}% 0)` }}
                  initial={{ y: 0, x: 0, rotate: 0 }}
                  animate={{ y: -4, x: -2, rotate: -2 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                >
                  {letter}
                </motion.span>
                <motion.span
                  className="absolute inset-0"
                  style={{ clipPath: `inset(${cut}% 0 0 0)` }}
                  initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
                  animate={{ y: 14, x: 4, rotate: 6, opacity: 0.8 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 12 }}
                >
                  {letter}
                </motion.span>
              </>
            )}
          </span>
        );
      })}
    </motion.h1>
  );
}
