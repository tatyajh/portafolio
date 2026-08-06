// Categorías para el mapa - Paleta oro-rosa con borgoña como acento
export const CATEGORIES = {
  esencia: { label: 'Esencia', color: '#8B0000', nodes: ['esencia', 'identidad', 'perfil'] },
  herencia: { label: 'Raíces', color: '#A0522D', nodes: ['herencia', 'arte'] },
  expresion: { label: 'Expresión', color: '#C4874A', nodes: ['sonido', 'estructura', 'cuerpo'] },
  transformacion: { label: 'Transformación', color: '#D4A574', nodes: ['quiebre', 'diseno'] },
  mixto: { label: 'Conexiones', color: '#E8C9A0', nodes: ['mixto', 'juego', 'proceso', 'fin'] },
};

// Versión oscurecida de los colores de categoría para que se lean
// sobre el papel crema del mapa collage
export const STAMP_COLORS: Record<string, string> = {
  '#8B0000': '#8B0000',
  '#A0522D': '#A0522D',
  '#C4874A': '#A66325',
  '#D4A574': '#B07A3A',
  '#E8C9A0': '#A8814F',
};
