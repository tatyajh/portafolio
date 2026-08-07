// "Personalidad" compartida por las tres plantillas de collage —
// afina rotación/tipografía/textura, no reestructura el layout.
export type CollageMode = 'editorial' | 'journal' | 'documentary' | 'technical';

export interface CollageItem {
  src: string;
  alt: string;
  caption?: string;
}
