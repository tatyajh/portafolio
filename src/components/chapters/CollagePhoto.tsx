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

// Esquina ornamental estilo marco de espejo gótico: arco apuntado,
// cuadrifolio calado y volutas. Se dibuja por fuera del filete para
// que el marco siga siendo delgado y el adorno viva en las esquinas.
function GothicCorner({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 46 46"
      aria-hidden="true"
      className={`pointer-events-none absolute h-6 w-6 text-gold-mid sm:h-8 sm:w-8 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
    >
      {/* arco apuntado exterior */}
      <path d="M45 3 H19 C10 3 3 10 3 19 V45" strokeOpacity="0.85" />
      {/* arco interior, el doble filete curvo */}
      <path d="M45 10 H21 C15 10 10 15 10 21 V45" strokeOpacity="0.45" />
      {/* voluta que une los dos arcos */}
      <path d="M10 21 C10 15 15 10 21 10" strokeOpacity="0.7" />
      {/* cuadrifolio calado en el vértice */}
      <path
        d="M14.5 9.5 a3.2 3.2 0 0 1 0 5 a3.2 3.2 0 0 1 -5 0 a3.2 3.2 0 0 1 0 -5 a3.2 3.2 0 0 1 5 0 Z"
        strokeOpacity="0.8"
      />
      {/* remates tipo lanza sobre los filetes */}
      <path d="M27 3 v-2.5 M3 27 h-2.5" strokeOpacity="0.6" />
      <path d="M34 3 l2 -3 2 3" strokeOpacity="0.5" />
      <path d="M3 34 l-3 2 3 2" strokeOpacity="0.5" />
    </svg>
  );
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
      <div className="paper-card gothic-frame relative p-1 sm:p-1.5">
        {tape && (
          <div className={`tape -top-4 w-24 h-8 ${tape.side === 'left' ? 'left-4 -rotate-6' : 'right-4 rotate-6'}`} />
        )}
        <div className="overflow-hidden rounded-[6px]">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
            draggable={false}
          />
        </div>
        {/* Filigrana en las 4 esquinas: arco apuntado, cuadrifolio y
            volutas — el ornamento que le da el aire de marco de espejo
            gótico sin engrosar el marco en sí. */}
        <GothicCorner className="-top-[7px] -left-[7px]" />
        <GothicCorner className="-top-[7px] -right-[7px] rotate-90" />
        <GothicCorner className="-bottom-[7px] -right-[7px] rotate-180" />
        <GothicCorner className="-bottom-[7px] -left-[7px] -rotate-90" />
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
