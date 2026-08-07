export interface BackgroundAssetGroup {
  id: string;
  category: 'aguja' | 'hilo' | 'carrete' | 'tijeras' | 'patron' | 'gamepad' | 'nota' | 'saxofon' | 'codigo';
  frames: string[];
  sections: string[];
}

// Piezas decorativas reales (public/media/background/{categoria}/N.png),
// generadas por scripts/process-background-assets.py a partir de los
// íconos originales en src/assets/. Dentro de cada categoría, los
// archivos numerados son el MISMO objeto en distintas posiciones —
// se usan como frames de una animación tipo flipbook, no como piezas
// separadas. `sections` usa las claves de CATEGORIES
// (src/data/nodes/categories.ts) — 'mapa' se agrega a todas para que
// el índice muestre una mezcla de las 9 categorías.
const CATEGORY_CONFIG: { category: BackgroundAssetGroup['category']; count: number; sections: string[] }[] = [
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

// Los archivos numerados empiezan en 2.png (no hay 1.png en ninguna carpeta origen)
const BACKGROUND_ASSET_GROUPS: BackgroundAssetGroup[] = CATEGORY_CONFIG.map(({ category, count, sections }) => ({
  id: category,
  category,
  frames: Array.from({ length: count }, (_, i) => `/media/background/${category}/${i + 2}.png`),
  sections,
}));

export function getBackgroundAssetGroups(section?: string): BackgroundAssetGroup[] {
  if (!section) return BACKGROUND_ASSET_GROUPS;
  return BACKGROUND_ASSET_GROUPS.filter(group => group.sections.includes(section));
}
