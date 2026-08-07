export interface BackgroundAsset {
  id: string;
  category: 'aguja' | 'hilo' | 'carrete' | 'tijeras' | 'patron' | 'gamepad' | 'nota' | 'saxofon' | 'codigo';
  src: string;
  sections: string[];
}

// Piezas decorativas reales (public/media/background/{categoria}/N.png),
// generadas por scripts/process-background-assets.py a partir de los
// íconos originales en src/assets/. `sections` usa las claves de
// CATEGORIES (src/data/nodes/categories.ts) — 'mapa' se agrega a todas
// para que el índice muestre una mezcla de las 9 categorías.
const CATEGORY_CONFIG: { category: BackgroundAsset['category']; count: number; sections: string[] }[] = [
  { category: 'aguja', count: 4, sections: ['esencia', 'herencia', 'transformacion', 'mapa'] },
  { category: 'hilo', count: 8, sections: ['esencia', 'herencia', 'transformacion', 'mapa'] },
  { category: 'carrete', count: 9, sections: ['esencia', 'herencia', 'transformacion', 'mapa'] },
  { category: 'tijeras', count: 8, sections: ['esencia', 'herencia', 'transformacion', 'mapa'] },
  { category: 'patron', count: 8, sections: ['esencia', 'herencia', 'transformacion', 'mapa'] },
  { category: 'codigo', count: 13, sections: ['expresion', 'mapa'] },
  { category: 'saxofon', count: 5, sections: ['expresion', 'mapa'] },
  { category: 'nota', count: 24, sections: ['expresion', 'mapa'] },
  { category: 'gamepad', count: 12, sections: ['mixto', 'mapa'] },
];

const BACKGROUND_ASSETS: BackgroundAsset[] = CATEGORY_CONFIG.flatMap(({ category, count, sections }) =>
  // Los archivos numerados empiezan en 2.png (no hay 1.png en ninguna carpeta origen)
  Array.from({ length: count }, (_, i) => {
    const n = i + 2;
    return {
      id: `${category}-${n}`,
      category,
      src: `/media/background/${category}/${n}.png`,
      sections,
    };
  })
);

export function getBackgroundAssets(section?: string): BackgroundAsset[] {
  if (!section) return BACKGROUND_ASSETS;
  return BACKGROUND_ASSETS.filter(asset => asset.sections.includes(section));
}
