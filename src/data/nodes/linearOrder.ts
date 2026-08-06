// ═══════════════════════════════════════════════════════════════════
// ORDEN LINEAL DE NAVEGACIÓN - 5 Temporadas, 12 nodos
// ═══════════════════════════════════════════════════════════════════
export const LINEAR_ORDER = [
  // Temp 1 - Esencia
  'esencia',    // Cap 1
  'identidad',  // Cap 2 (Tatiana Alejandra)
  'perfil',     // Cap 3
  // Temp 2 - Raíces
  'herencia',   // Cap 4
  'arte',       // Cap 5
  // Temp 3 - Expresión
  'sonido',     // Cap 6
  'estructura', // Cap 7
  'cuerpo',     // Cap 8
  // Temp 4 - Transformación
  'quiebre',    // Cap 9
  'diseno',     // Cap 10
  // Temp 5 - Conexiones
  'mixto',      // Cap 11
  'juego',      // Cap 12
  'proceso',    // Cap 13
  'fin',        // Cierre
] as const;

// ═══════════════════════════════════════════════════════════════════
// TEMPORADAS PARA UI
// `total` se deriva de la lista de nodos de cada temporada, no se
// mantiene a mano — agregar/quitar un nodo de SEASON_DEFS actualiza
// el total automáticamente, sin riesgo de desincronización.
// ═══════════════════════════════════════════════════════════════════
export const SEASON_DEFS = [
  { name: 'Temporada 1: Esencia', nodes: ['esencia', 'identidad', 'perfil'] },
  { name: 'Temporada 2: Raíces', nodes: ['herencia', 'arte'] },
  { name: 'Temporada 3: Expresión', nodes: ['sonido', 'estructura', 'cuerpo'] },
  { name: 'Temporada 4: Transformación', nodes: ['quiebre', 'diseno'] },
  { name: 'Temporada 5: Conexiones', nodes: ['mixto', 'juego', 'proceso', 'fin'] },
] as const;

export const SEASONS: Record<string, { name: string; total: number }> = Object.fromEntries(
  SEASON_DEFS.flatMap(s => s.nodes.map(id => [id, { name: s.name, total: s.nodes.length }]))
);

// ═══════════════════════════════════════════════════════════════════
// RUTA TÉCNICA - orden local para quien navega desde "Lo técnico"
// (tarjetas rápidas del hub). Evita que las flechas siguiente/anterior
// salten a capítulos narrativos no relacionados (ej. de Perfil a
// Herencia) cuando el contexto de navegación es la ruta de reclutador.
// ═══════════════════════════════════════════════════════════════════
export const TECH_ROUTE_ORDER = ['perfil', 'estructura', 'juego'] as const;
