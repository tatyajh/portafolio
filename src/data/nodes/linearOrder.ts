// ═══════════════════════════════════════════════════════════════════
// ORDEN LINEAL DE NAVEGACIÓN - 5 Temporadas, 11 capítulos
// ═══════════════════════════════════════════════════════════════════
export const LINEAR_ORDER = [
  // Temp 1 - Esencia
  'esencia',    // Cap 1
  'identidad',  // Cap 2 (Tatiana Alejandra)
  'perfil',     // Cap 3
  // Temp 2 - Raíces
  'herencia',   // Cap 4
  // Temp 3 - Expresión
  'sonido',     // Cap 5
  'estructura', // Cap 6
  'cuerpo',     // Cap 7
  'mixto',      // Cap 8 (Conexiones: pole y saxofón juntos)
  // Temp 4 - Transformación
  'quiebre',    // Cap 9
  'diseno',     // Cap 10
  // Temp 5 - Lo que sigue
  'juego',      // Cap 11
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
  { name: 'Temporada 2: Raíces', nodes: ['herencia'] },
  { name: 'Temporada 3: Expresión', nodes: ['sonido', 'estructura', 'cuerpo', 'mixto'] },
  { name: 'Temporada 4: Transformación', nodes: ['quiebre', 'diseno'] },
  { name: 'Temporada 5: Lo que sigue', nodes: ['juego', 'fin'] },
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
