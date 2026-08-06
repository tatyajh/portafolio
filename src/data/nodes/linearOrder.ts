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
// ═══════════════════════════════════════════════════════════════════
export const SEASONS: Record<string, { name: string; total: number }> = {
  esencia: { name: 'Temporada 1: Esencia', total: 3 },
  identidad: { name: 'Temporada 1: Esencia', total: 3 },
  perfil: { name: 'Temporada 1: Esencia', total: 3 },
  herencia: { name: 'Temporada 2: Raíces', total: 2 },
  arte: { name: 'Temporada 2: Raíces', total: 2 },
  sonido: { name: 'Temporada 3: Expresión', total: 3 },
  estructura: { name: 'Temporada 3: Expresión', total: 3 },
  cuerpo: { name: 'Temporada 3: Expresión', total: 3 },
  quiebre: { name: 'Temporada 4: Transformación', total: 2 },
  diseno: { name: 'Temporada 4: Transformación', total: 2 },
  mixto: { name: 'Temporada 5: Conexiones', total: 4 },
  juego: { name: 'Temporada 5: Conexiones', total: 4 },
  proceso: { name: 'Temporada 5: Conexiones', total: 4 },
  fin: { name: 'Temporada 5: Conexiones', total: 4 },
};
