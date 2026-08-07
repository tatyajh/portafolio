"use client";

import { useState, useEffect } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useCursorParallax } from '@/hooks/useCursorParallax';
import { getBackgroundAssetGroups, type BackgroundAssetGroup } from '@/lib/backgroundAssets';

const INSTANCE_COUNT = 12;
const FRAME_INTERVAL_MS = 220;

// Reparte instancias entre categorías (round-robin, con vuelta) en vez
// de cortar la lista en orden — así "mapa" (9 categorías) las muestra
// todas en vez de solo las primeras, y una sección con pocas
// categorías (ej. "mixto", solo gamepad) repite esa categoría hasta
// completar INSTANCE_COUNT en vez de mostrar una sola pieza.
function sampleInstances(groups: BackgroundAssetGroup[], count: number): BackgroundAssetGroup[] {
  if (groups.length === 0) return [];
  return Array.from({ length: count }, (_, i) => groups[i % groups.length]);
}

// Un ícono que cicla por sus propios frames (el mismo objeto en
// distintas posiciones dentro de la carpeta) para verse animado, tipo
// flipbook/gif, en vez de una imagen estática.
function FlipbookIcon({ frames, startOffset }: { frames: string[]; startOffset: number }) {
  const [frameIndex, setFrameIndex] = useState(startOffset % frames.length);

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(id);
  }, [frames.length]);

  return <img src={frames[frameIndex]} alt="" className="w-full h-auto" draggable={false} />;
}

// Decoración collage de fondo: blobs, puntadas, cinta métrica,
// patrón de costura, botones de costura, retazos de tela, hilos
// procedurales e íconos reales por categoría — organizados en 3 capas
// de profundidad que reaccionan sutilmente a la posición del cursor.
export default function CollageDecor({ section }: { section: string }) {
  const { x, y } = useCursorParallax();
  const icons = sampleInstances(getBackgroundAssetGroups(section), INSTANCE_COUNT);

  const farX = useTransform(x, [-1, 1], [-8, 8]);
  const farY = useTransform(y, [-1, 1], [-8, 8]);
  const midX = useTransform(x, [-1, 1], [-16, 16]);
  const midY = useTransform(y, [-1, 1], [-16, 16]);
  const nearX = useTransform(x, [-1, 1], [-28, 28]);
  const nearY = useTransform(y, [-1, 1], [-28, 28]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Capa lejana: blobs orgánicos + puntadas de fondo */}
      <motion.div className="absolute inset-0" style={{ x: farX, y: farY }}>
        {/* Blobs orgánicos recortados */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-[0.12]" style={{ background: '#8B0000' }} />
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-[45%] opacity-[0.14]" style={{ background: '#A0522D' }} />
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-[40%] opacity-[0.10]" style={{ background: '#2F6B5E' }} />
        <div className="absolute top-16 right-1/4 w-40 h-40 rounded-full opacity-[0.09]" style={{ background: '#C4874A' }} />
        <div className="absolute bottom-1/4 -left-16 w-56 h-56 rounded-[48%] opacity-[0.08]" style={{ background: '#2F6B5E' }} />

        {/* Hilos de puntada cruzando el papel */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`puntada-${i}`}
            className="absolute w-[140%]"
            style={{
              top: `${8 + i * 17}%`,
              left: '-20%',
              borderTop: `2px dashed rgba(139, 0, 0, ${0.12 + (i % 2) * 0.06})`,
              transform: `rotate(${-6 + i * 3}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Capa media: cinta métrica, patrón, botones, retazos, hilos procedurales */}
      <motion.div className="absolute inset-0" style={{ x: midX, y: midY }}>
        {/* Cinta métrica (costura) */}
        <svg className="absolute -top-4 -right-14 w-72 h-40 opacity-35" viewBox="0 0 240 80" style={{ transform: 'rotate(18deg)' }}>
          <path d="M0 40 Q60 15 120 38 T240 30" stroke="#D4A574" strokeWidth="18" fill="none" strokeLinecap="round" />
          <path d="M0 40 Q60 15 120 38 T240 30" stroke="#8B0000" strokeWidth="1" fill="none" opacity="0.5" />
          {[...Array(16)].map((_, i) => {
            const tx = 8 + i * 15;
            const ty = 40 - Math.sin((tx / 240) * Math.PI) * 10;
            return <line key={i} x1={tx} y1={ty - (i % 5 === 0 ? 8 : 5)} x2={tx} y2={ty + 2} stroke="#2a2018" strokeWidth="1.5" opacity="0.7" />;
          })}
          {[0, 5, 10, 15].map(i => {
            const tx = 8 + i * 15;
            const ty = 40 - Math.sin((tx / 240) * Math.PI) * 10;
            return <text key={i} x={tx + 2} y={ty + 12} fontSize="8" fill="#2a2018" opacity="0.7">{i * 5}</text>;
          })}
        </svg>

        {/* Patrón de costura (pieza de molde con puntadas) */}
        <svg className="absolute bottom-6 -left-10 w-52 h-52 opacity-30" viewBox="0 0 100 100" style={{ transform: 'rotate(-12deg)' }}>
          <path d="M25 10 Q50 2 75 10 L82 55 Q70 62 68 90 L32 90 Q30 62 18 55 Z"
                fill="rgba(212, 165, 116, 0.25)" stroke="#D4A574" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d="M40 30 L45 55 M60 30 L55 55" stroke="#8B0000" strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
          <circle cx="50" cy="20" r="1.5" fill="#8B0000" />
          <text x="38" y="75" fontSize="7" fill="#D4A574" fontStyle="italic">delantero</text>
          <line x1="30" y1="14" x2="26" y2="8" stroke="#D4A574" strokeWidth="1.5" />
          <line x1="70" y1="14" x2="74" y2="8" stroke="#D4A574" strokeWidth="1.5" />
        </svg>

        {/* Botones de costura */}
        {[
          { top: '18%', left: '8%', color: '#8B0000', size: 34, rot: 12 },
          { top: '68%', left: '88%', color: '#2F6B5E', size: 28, rot: -8 },
          { top: '86%', left: '14%', color: '#A0522D', size: 24, rot: 20 },
        ].map((b, i) => (
          <svg
            key={`boton-${i}`}
            className="absolute opacity-30"
            style={{ top: b.top, left: b.left, width: b.size, height: b.size, transform: `rotate(${b.rot}deg)` }}
            viewBox="0 0 40 40"
          >
            <circle cx="20" cy="20" r="18" fill="none" stroke={b.color} strokeWidth="3" />
            <circle cx="20" cy="20" r="13" fill="none" stroke={b.color} strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="15" cy="15" r="2.2" fill={b.color} />
            <circle cx="25" cy="15" r="2.2" fill={b.color} />
            <circle cx="15" cy="25" r="2.2" fill={b.color} />
            <circle cx="25" cy="25" r="2.2" fill={b.color} />
          </svg>
        ))}

        {/* Retazos de tela */}
        {[
          { top: '38%', left: '3%', w: 70, h: 50, color: '139, 0, 0', rot: -8 },
          { top: '10%', left: '72%', w: 60, h: 44, color: '47, 107, 94', rot: 14 },
          { top: '78%', left: '70%', w: 64, h: 46, color: '160, 82, 45', rot: -12 },
        ].map((r, i) => (
          <div
            key={`retazo-${i}`}
            className="absolute"
            style={{
              top: r.top,
              left: r.left,
              width: r.w,
              height: r.h,
              transform: `rotate(${r.rot}deg)`,
              border: `2px dashed rgba(${r.color}, 0.4)`,
              background: `repeating-linear-gradient(45deg, rgba(${r.color}, 0.14) 0 6px, rgba(${r.color}, 0.05) 6px 12px)`,
            }}
          />
        ))}

        {/* Hilos procedurales: constelación de líneas que aparecen y se desvanecen */}
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
          {[...Array(6)].map((_, i) => (
            <motion.line
              key={`hilo-proc-${i}`}
              x1={`${10 + (i * 13) % 75}%`} y1={`${8 + (i * 17) % 85}%`}
              x2={`${20 + (i * 19) % 65}%`} y2={`${18 + (i * 23) % 65}%`}
              stroke={i % 2 === 0 ? '#E8C9A0' : '#8B0000'}
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 0], opacity: [0, 0.35, 0] }}
              transition={{ duration: 9 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Capa cercana: íconos reales de la categoría del nodo actual */}
      <motion.div className="absolute inset-0" style={{ x: nearX, y: nearY }}>
        {/* Recortes: íconos reales de la categoría del nodo actual */}
        {icons.map((group, i) => (
          <motion.div
            key={`${group.id}-${i}`}
            drag
            dragMomentum={false}
            dragElastic={0.15}
            whileDrag={{ scale: 1.2, zIndex: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.32, 0.2] }}
            transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            className="absolute w-10 sm:w-14 pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{
              top: `${6 + (i * 19) % 88}%`,
              left: `${4 + (i * 23) % 92}%`,
            }}
          >
            <FlipbookIcon frames={group.frames} startOffset={i * 3} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
