"use client";

// Esquina ornamental estilo marco de espejo gótico: arco apuntado,
// cuadrifolio calado y volutas. Se dibuja por fuera del filete para
// que el marco siga siendo delgado y el adorno viva en las esquinas.
// Compartida entre CollagePhoto y CollageGrid — antes vivía duplicada
// dentro de CollagePhoto.tsx.
export default function GothicCorner({ className }: { className: string }) {
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
