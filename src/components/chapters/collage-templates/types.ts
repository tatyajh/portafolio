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
}
