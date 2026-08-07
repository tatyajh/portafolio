"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useTransform } from 'framer-motion';
import { useCursorParallax } from '@/hooks/useCursorParallax';
import { getBackgroundAssetGroups, type BackgroundAssetGroup } from '@/lib/backgroundAssets';

const INSTANCE_COUNT = 12;
const FRAME_INTERVAL_MS = 220;
const GRID_COLS = 4;
const GRID_ROWS = 3;
const TRAIL_SPAWN_MS = 70;
const TRAIL_LIFETIME_S = 0.6;

// Reparte instancias entre categorías (round-robin, con vuelta) en vez
// de cortar la lista en orden — así "mapa" (9 categorías) las muestra
// todas en vez de solo las primeras, y una sección con pocas
// categorías (ej. "mixto", solo gamepad) repite esa categoría hasta
// completar INSTANCE_COUNT en vez de mostrar una sola pieza.
function sampleInstances(groups: BackgroundAssetGroup[], count: number): BackgroundAssetGroup[] {
  if (groups.length === 0) return [];
  return Array.from({ length: count }, (_, i) => groups[i % groups.length]);
}

// Posición en grilla (GRID_COLS x GRID_ROWS) con variación determinista
// por índice — reparte los íconos de forma pareja por la pantalla en
// vez del hash modular anterior, que dejaba zonas muy juntas y otras
// vacías.
function gridPosition(i: number) {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS) % GRID_ROWS;
  const jitterX = ((i * 37) % 14) - 7;
  const jitterY = ((i * 53) % 14) - 7;
  return {
    left: (col + 0.5) * (100 / GRID_COLS) + jitterX,
    top: (row + 0.5) * (100 / GRID_ROWS) + jitterY,
  };
}

interface TrailGhost {
  id: number;
  x: number;
  y: number;
  hue: number;
}

// Ícono arrastrable que deja un rastro de copias distorsionadas
// (hue-rotate + blur + escala creciente) siguiendo el cursor mientras
// se arrastra — un efecto tipo "smear" psicodélico, no solo mover el
// objeto de un punto a otro.
function DraggableIcon({ frames, startOffset, style, entranceDelay }: {
  frames: string[];
  startOffset: number;
  style: { top: string; left: string };
  entranceDelay: number;
}) {
  const [ghosts, setGhosts] = useState<TrailGhost[]>([]);
  const lastSpawnRef = useRef(0);
  const nextIdRef = useRef(0);
  const [currentFrame, setCurrentFrame] = useState(frames[startOffset % frames.length]);

  const handleDrag = () => {
    const now = performance.now();
    if (now - lastSpawnRef.current < TRAIL_SPAWN_MS) return;
    lastSpawnRef.current = now;
    const id = nextIdRef.current++;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGhosts(prev => [
      ...prev,
      { id, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, hue: (id * 61) % 360 },
    ]);
  };

  const removeGhost = (id: number) => setGhosts(prev => prev.filter(g => g.id !== id));

  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {ghosts.map(ghost => (
        <motion.img
          key={ghost.id}
          src={currentFrame}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.8 }}
          transition={{ duration: TRAIL_LIFETIME_S, ease: 'easeOut' }}
          onAnimationComplete={() => removeGhost(ghost.id)}
          className="fixed w-10 h-10 sm:w-14 sm:h-14 object-contain pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            top: ghost.y,
            left: ghost.x,
            filter: `hue-rotate(${ghost.hue}deg) blur(3px) saturate(2.4)`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
      <motion.div
        ref={wrapperRef}
        drag
        dragMomentum={false}
        dragElastic={0.15}
        onDrag={handleDrag}
        whileDrag={{ scale: 1.2, zIndex: 20 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.32, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: entranceDelay }}
        className="absolute w-10 h-10 sm:w-14 sm:h-14 pointer-events-auto cursor-grab active:cursor-grabbing"
        style={style}
      >
        <FlipbookIconWithTracker frames={frames} startOffset={startOffset} onFrameChange={setCurrentFrame} />
      </motion.div>
    </>
  );
}

// Cicla por los frames de la categoría (el mismo objeto en distintas
// posiciones/rotaciones dentro de la carpeta) como flipbook/gif, y
// además informa al padre cuál es el frame actual para que el rastro
// de arrastre use la misma pose que se ve en ese momento.
function FlipbookIconWithTracker({ frames, startOffset, onFrameChange }: {
  frames: string[];
  startOffset: number;
  onFrameChange: (src: string) => void;
}) {
  const [frameIndex, setFrameIndex] = useState(startOffset % frames.length);

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(id);
  }, [frames.length]);

  useEffect(() => {
    onFrameChange(frames[frameIndex]);
  }, [frameIndex, frames, onFrameChange]);

  return (
    <Image
      src={frames[frameIndex]}
      alt=""
      fill
      sizes="56px"
      className="object-contain"
      draggable={false}
    />
  );
}

// Decoración de fondo: solo los íconos reales por categoría (sin
// formas/blobs/SVG decorativas viejas) más hilos procedurales sutiles
// — organizados en 2 capas de profundidad que reaccionan al cursor.
export default function CollageDecor({ section }: { section: string }) {
  const { x, y } = useCursorParallax();
  const icons = sampleInstances(getBackgroundAssetGroups(section), INSTANCE_COUNT);

  const threadX = useTransform(x, [-1, 1], [-16, 16]);
  const threadY = useTransform(y, [-1, 1], [-16, 16]);
  const iconsX = useTransform(x, [-1, 1], [-28, 28]);
  const iconsY = useTransform(y, [-1, 1], [-28, 28]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Hilos procedurales: constelación de líneas que aparecen y se desvanecen */}
      <motion.div className="absolute inset-0" style={{ x: threadX, y: threadY }}>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={`hilo-proc-${i}`}
              x1={`${10 + (i * 13) % 75}%`} y1={`${8 + (i * 17) % 85}%`}
              x2={`${20 + (i * 19) % 65}%`} y2={`${18 + (i * 23) % 65}%`}
              stroke={i % 2 === 0 ? 'var(--color-gold)' : 'var(--color-burgundy)'}
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.35, 0] }}
              transition={{ duration: 9 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Íconos reales de la categoría del nodo actual, repartidos en grilla */}
      <motion.div className="absolute inset-0" style={{ x: iconsX, y: iconsY }}>
        {icons.map((group, i) => {
          const pos = gridPosition(i);
          return (
            <DraggableIcon
              key={`${group.id}-${i}`}
              frames={group.frames}
              startOffset={i * 3}
              entranceDelay={i * 0.5}
              style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
