"use client";

import { motion } from 'framer-motion';

interface CollagePhotoProps {
  src: string;
  alt: string;
  caption?: string;
  tilt?: 'l' | 'r';
  tape?: { side: 'left' | 'right' };
  delay?: number;
  /** Grados de rotación cuando hay tilt. Default 3 — igual al comportamiento previo. */
  rotateDeg?: number;
  /** 'script' usa tipografía manuscrita (journal/documentary); default mantiene el look original. */
  captionVariant?: 'default' | 'script';
  /** Permite reacomodar la foto arrastrándola, como una foto suelta sobre la mesa. */
  draggable?: boolean;
}

export default function CollagePhoto({ src, alt, caption, tilt, tape, delay = 0.3, rotateDeg = 3, captionVariant = 'default', draggable = false }: CollagePhotoProps) {
  const restRotate = tilt === 'l' ? -rotateDeg : tilt === 'r' ? rotateDeg : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: restRotate }}
      transition={{ delay, duration: 0.4 }}
      // dragMomentum={false} + sin dragConstraints: la foto se queda
      // exactamente donde se suelta, como una foto física reacomodada.
      // whileDrag la endereza y la sube de capa para que se vea entera
      // aunque esté debajo de otra.
      {...(draggable
        ? {
            drag: true as const,
            dragMomentum: false,
            dragElastic: 0.12,
            whileDrag: { rotate: 0, scale: 1.04, zIndex: 50, cursor: 'grabbing' },
          }
        : {})}
      className={`relative ${draggable ? 'cursor-grab touch-none' : ''}`}
    >
      {/* El marco envuelve SOLO la imagen: con el mat delgado, dejar la
          leyenda dentro la apretaba contra el filete. */}
      <div className="paper-card gothic-frame relative p-1.5 sm:p-2">
        {tape && (
          <div className={`tape -top-4 w-24 h-8 ${tape.side === 'left' ? 'left-4 -rotate-6' : 'right-4 rotate-6'}`} />
        )}
        <div className="overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
            draggable={false}
          />
        </div>
      </div>
      {caption && (
        <p
          className={`mt-3 text-center caption-glow-dark ${
            captionVariant === 'script' ? 'font-script text-lg sm:text-xl' : 'text-sm sm:text-base italic'
          }`}
        >
          — {caption} —
        </p>
      )}
    </motion.div>
  );
}
