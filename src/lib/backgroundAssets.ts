export interface BackgroundAsset {
  id: string;
  category: 'aguja' | 'hilo' | 'carrete' | 'tijeras' | 'patron' | 'gamepad' | 'nota' | 'saxofon' | 'codigo';
  src: string;
  sections: string[];
}

// Manifiesto tipado de assets decorativos individuales para el futuro
// sistema de fondo interactivo. Hoy no hay PNG transparentes finales
// en src/assets/background/, así que el manifiesto está vacío: el
// contrato queda listo para que agregar/quitar/reemplazar un asset
// sea editar este array, sin tocar la lógica de renderizado.
const BACKGROUND_ASSETS: BackgroundAsset[] = [];

export function getBackgroundAssets(section?: string): BackgroundAsset[] {
  if (!section) return BACKGROUND_ASSETS;
  return BACKGROUND_ASSETS.filter(asset => asset.sections.includes(section));
}
