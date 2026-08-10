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
// separadas.
//
// `sections` usa IDs de nodo reales (no las categorías amplias de
// CATEGORIES) para que cada nodo muestre solo lo que le corresponde
// temáticamente — ej. sonido solo música, perfil solo programación —
// en vez de una mezcla genérica por temporada. 'mapa' y 'mixto' llevan
// las 9 categorías (el índice y el nodo de "conexiones" son los únicos
// pensados para mostrar todo mezclado).
// Estos conteos son EL RESULTADO de correr
// `python scripts/process-background-assets.py` sobre `src/assets/` —
// no un número fijo. Cuando cambien los archivos de origen (agregar,
// borrar, reemplazar), hay que volver a correr el script Y actualizar
// estos números para que coincidan con lo que realmente quedó en
// public/media/background/. Si no coinciden, o bien sobran archivos
// viejos sin usar, o el sitio pide un frame que ya no existe.
//
// Actualizado tras la ronda de mejora de calidad de imágenes: carrete
// bajó de 9 a 5, gamepad de 12 a 5, codigo de 13 a 12 (se redujeron
// las fuentes). El script ahora también borra los archivos huérfanos
// que quedaban de una corrida anterior — antes solo escribía, nunca
// limpiaba, así que versiones viejas de baja calidad seguían viviendo
// en public/ aunque el origen ya no las tuviera.
const CATEGORY_CONFIG: { category: BackgroundAssetGroup['category']; count: number; sections: string[] }[] = [
  { category: 'aguja', count: 4, sections: ['mapa', 'mixto', 'inicio', 'esencia', 'herencia', 'arte', 'diseno', 'quiebre'] },
  { category: 'hilo', count: 8, sections: ['mapa', 'mixto', 'inicio', 'esencia', 'herencia', 'arte', 'diseno', 'quiebre'] },
  { category: 'carrete', count: 5, sections: ['mapa', 'mixto', 'inicio', 'esencia', 'herencia', 'arte', 'diseno', 'quiebre'] },
  { category: 'tijeras', count: 8, sections: ['mapa', 'mixto', 'inicio', 'esencia', 'herencia', 'arte', 'diseno', 'quiebre'] },
  { category: 'patron', count: 8, sections: ['mapa', 'mixto', 'inicio', 'esencia', 'herencia', 'arte', 'diseno', 'quiebre'] },
  { category: 'codigo', count: 12, sections: ['mapa', 'mixto', 'inicio', 'estructura', 'tecnico', 'perfil'] },
  { category: 'saxofon', count: 5, sections: ['mapa', 'mixto', 'inicio', 'sonido'] },
  { category: 'nota', count: 24, sections: ['mapa', 'mixto', 'inicio', 'sonido'] },
  { category: 'gamepad', count: 5, sections: ['mapa', 'mixto', 'inicio', 'juego'] },
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
