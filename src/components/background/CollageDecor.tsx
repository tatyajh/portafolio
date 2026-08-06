"use client";

import { motion } from 'framer-motion';

// Decoración collage de fondo: blobs, puntadas, cinta métrica,
// patrón de costura, botones de costura, retazos de tela y recortes
export default function CollageDecor() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
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

      {/* Cinta métrica (costura) */}
      <svg className="absolute -top-4 -right-14 w-72 h-40 opacity-35" viewBox="0 0 240 80" style={{ transform: 'rotate(18deg)' }}>
        <path d="M0 40 Q60 15 120 38 T240 30" stroke="#D4A574" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M0 40 Q60 15 120 38 T240 30" stroke="#8B0000" strokeWidth="1" fill="none" opacity="0.5" />
        {[...Array(16)].map((_, i) => {
          const x = 8 + i * 15;
          const y = 40 - Math.sin((x / 240) * Math.PI) * 10;
          return <line key={i} x1={x} y1={y - (i % 5 === 0 ? 8 : 5)} x2={x} y2={y + 2} stroke="#2a2018" strokeWidth="1.5" opacity="0.7" />;
        })}
        {[0, 5, 10, 15].map(i => {
          const x = 8 + i * 15;
          const y = 40 - Math.sin((x / 240) * Math.PI) * 10;
          return <text key={i} x={x + 2} y={y + 12} fontSize="8" fill="#2a2018" opacity="0.7">{i * 5}</text>;
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

      {/* Recortes de código */}
      <div className="absolute top-[26%] right-[6%] font-mono text-xl opacity-25 rotate-6" style={{ color: '#D4A574' }}>{'</>'}</div>
      <div className="absolute bottom-[18%] right-[28%] font-mono text-2xl opacity-20 -rotate-12" style={{ color: '#8B0000' }}>{'{ }'}</div>
      <div className="absolute top-[55%] left-[4%] font-mono text-sm opacity-25 rotate-3" style={{ color: '#E8C9A0' }}>while(viva) crear();</div>

      {/* Notas musicales */}
      <div className="absolute top-[12%] left-[30%] text-2xl opacity-25 -rotate-12" style={{ color: '#D4A574' }}>♪</div>
      <div className="absolute bottom-[32%] right-[10%] text-3xl opacity-20 rotate-6" style={{ color: '#E8C9A0' }}>♫</div>

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

      {/* Recortes: costura, música, código, el paisa y sus frijoles */}
      {['✂️', '🪡', '🧶', '🎷', '🎮', '🫘', '🥟', '👗', '🧵', '📷'].map((emoji, i) => (
        <motion.div
          key={`recorte-${i}`}
          animate={{ rotate: [0, 6, 0, -6, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          className="absolute text-2xl"
          style={{
            top: `${6 + (i * 19) % 88}%`,
            left: `${4 + (i * 23) % 92}%`,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}
