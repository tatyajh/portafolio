"use client";

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const TITLE = 'Portafolio';
// Se corta como máximo cerca de los bordes, nunca justo en el borde:
// un corte al 2% no se leería como corte, solo como letra movida.
const MIN_CUT_PCT = 18;
const MAX_CUT_PCT = 82;
// Dos cortes por eje: hasta 3x3 = 9 pedazos por letra. Más que eso son
// astillas ilegibles y muchos nodos animándose por letra.
const MAX_CUTS_PER_AXIS = 2;
// Dos cortes muy juntos dejan una tira invisible; se exige separación.
const MIN_CUT_GAP = 16;
const REPAIR_FLASH_MS = 700;
// Cuánto se separan los pedazos. Suficiente para que se lea "roto",
// no tanto como para que el título deje de leerse.
const SPREAD_PX = 13;

interface ToolMoveDetail {
  x: number;
  y: number;
  category: string;
  /** Eje del movimiento de la herramienta en ese instante. */
  axis: 'h' | 'v';
}

// Los cortes de una letra: posiciones (en %) de las líneas de corte
// horizontales y verticales. Las líneas forman una rejilla y cada
// celda de esa rejilla es un pedazo. Una letra sin cortes tiene las
// dos listas vacías.
interface LetterCuts {
  h: number[];
  v: number[];
}

const emptyCuts = (): LetterCuts => ({ h: [], v: [] });

function hasAnyCut(c: LetterCuts) {
  return c.h.length > 0 || c.v.length > 0;
}

// Un corte nuevo solo entra si queda espacio y no pisa a otro.
function canAddCut(existing: number[], pct: number) {
  if (existing.length >= MAX_CUTS_PER_AXIS) return false;
  return existing.every(p => Math.abs(p - pct) >= MIN_CUT_GAP);
}

// La aguja cose la costura que tenga más cerca, en cualquiera de los
// dos ejes — no borra todos los cortes de golpe.
function removeNearestCut(c: LetterCuts, xPct: number, yPct: number): LetterCuts {
  let bestAxis: 'h' | 'v' | null = null;
  let bestIndex = -1;
  let bestDist = Infinity;

  c.h.forEach((p, i) => {
    const d = Math.abs(p - yPct);
    if (d < bestDist) { bestDist = d; bestAxis = 'h'; bestIndex = i; }
  });
  c.v.forEach((p, i) => {
    const d = Math.abs(p - xPct);
    if (d < bestDist) { bestDist = d; bestAxis = 'v'; bestIndex = i; }
  });

  if (bestAxis === null) return c;
  if (bestAxis === 'h') return { h: c.h.filter((_, i) => i !== bestIndex), v: c.v };
  return { h: c.h, v: c.v.filter((_, i) => i !== bestIndex) };
}

// Convierte las líneas de corte en los pedazos que hay que dibujar.
function buildFragments(c: LetterCuts) {
  const hEdges = [0, ...[...c.h].sort((a, b) => a - b), 100];
  const vEdges = [0, ...[...c.v].sort((a, b) => a - b), 100];
  const fragments: { top: number; bottom: number; left: number; right: number }[] = [];

  for (let r = 0; r < hEdges.length - 1; r++) {
    for (let col = 0; col < vEdges.length - 1; col++) {
      fragments.push({
        top: hEdges[r],
        bottom: hEdges[r + 1],
        left: vEdges[col],
        right: vEdges[col + 1],
      });
    }
  }
  return fragments;
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
  const [cuts, setCuts] = useState<LetterCuts[]>(() => letters.map(emptyCuts));
  const [repaired, setRepaired] = useState<Set<number>>(() => new Set());
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const onToolMove = (evt: Event) => {
      const { x, y, category, axis } = (evt as CustomEvent<ToolMoveDetail>).detail;
      if (category !== 'tijeras' && category !== 'aguja') return;

      const repairedNow: number[] = [];
      let cutSomething = false;

      setCuts(prev => {
        let changed = false;
        const next = prev.slice();

        letterRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (x < r.left || x > r.right || y < r.top || y > r.bottom) return;

          const xPct = ((x - r.left) / r.width) * 100;
          const yPct = ((y - r.top) / r.height) * 100;

          if (category === 'tijeras') {
            // El corte va por donde pasó el filo, en el eje en que se
            // movían las tijeras: de lado corta a lo ancho, hacia
            // arriba o abajo corta a lo largo.
            const raw = axis === 'h' ? yPct : xPct;
            const pct = Math.min(Math.max(raw, MIN_CUT_PCT), MAX_CUT_PCT);
            const current = next[i];
            const existing = axis === 'h' ? current.h : current.v;
            if (!canAddCut(existing, pct)) return;

            next[i] = axis === 'h'
              ? { h: [...current.h, pct], v: current.v }
              : { h: current.h, v: [...current.v, pct] };
            cutSomething = true;
            changed = true;
          } else if (hasAnyCut(next[i])) {
            const after = removeNearestCut(next[i], xPct, yPct);
            next[i] = after;
            if (!hasAnyCut(after)) repairedNow.push(i);
            changed = true;
          }
        });

        return changed ? next : prev;
      });

      // El splash mantiene los botones bloqueados hasta el primer
      // corte; este es el aviso de que ya se puede explorar.
      if (cutSomething) {
        window.dispatchEvent(new CustomEvent('splash-first-cut'));
      }

      // Destello dorado breve en la letra que quedó entera otra vez.
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
        const letterCuts = cuts[i];
        const broken = hasAnyCut(letterCuts);
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
            {!broken ? (
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
                {buildFragments(letterCuts).map((f, fi) => {
                  // Cada pedazo se aparta del centro de la letra en la
                  // dirección en la que quedó, así el corte se abre
                  // como una grieta en vez de deslizarse todo hacia un
                  // lado. Los de las esquinas se van más lejos.
                  const cx = (f.left + f.right) / 2 - 50;
                  const cy = (f.top + f.bottom) / 2 - 50;
                  const dx = (cx / 50) * SPREAD_PX;
                  const dy = (cy / 50) * SPREAD_PX;
                  return (
                    <motion.span
                      key={`${f.top}-${f.left}-${fi}`}
                      className="absolute inset-0"
                      style={{
                        clipPath: `inset(${f.top}% ${100 - f.right}% ${100 - f.bottom}% ${f.left}%)`,
                      }}
                      initial={{ x: -dx * 0.25, y: -dy * 0.25, rotate: 0 }}
                      animate={{ x: dx, y: dy, rotate: (cx + cy) * 0.06, opacity: 0.88 }}
                      transition={{ type: 'spring', stiffness: 170, damping: 13 }}
                    >
                      {letter}
                    </motion.span>
                  );
                })}
              </>
            )}
          </span>
        );
      })}
    </motion.h1>
  );
}
