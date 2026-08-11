// "Personalidad" compartida por las tres plantillas de collage —
// afina rotación/tipografía/textura, no reestructura el layout.
export type CollageMode = 'editorial' | 'journal' | 'documentary' | 'technical';

export interface CollageItem {
  src: string;
  alt: string;
  caption?: string;
  /** La foto ya trae su propio fondo (recorte transparente o degradado
      propio) — se muestra suelta, sin el marco de papel. */
  frameless?: boolean;
  /** Clase de ancho Tailwind que reemplaza el ancho por defecto del
      slot en CollageCluster (ej. 'w-[64%] sm:w-[52%]'). */
  widthOverride?: string;
  /** Clase de margen superior que reemplaza el offset por defecto del
      slot en CollageCluster (ej. 'mt-0' para que quede arriba). */
  offsetOverride?: string;
  /** En CollageGrid: dos fotos consecutivas marcadas `paired` se
      muestran una al lado de la otra en vez de cada una a ancho
      completo. */
  paired?: boolean;
}
