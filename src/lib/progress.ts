import { SEASON_DEFS, LINEAR_ORDER } from '@/data/nodes';

export interface JourneyProgress {
  seasonName: string;
  chapterInSeason: number;
  totalInSeason: number;
  completedInSeason: number;
  chapterNumber: number;
  totalChapters: number;
}

// Progreso "como viaje" (capítulo actual/completados en la temporada),
// no como porcentaje. Devuelve null para nodos fuera de la secuencia
// lineal (inicio, mapa, tecnico).
export function getJourneyProgress(currentNode: string, history: string[]): JourneyProgress | null {
  const def = SEASON_DEFS.find(s => (s.nodes as readonly string[]).includes(currentNode));
  if (!def) return null;

  const completedInSeason = def.nodes.filter(id => history.includes(id)).length;

  return {
    seasonName: def.name,
    chapterInSeason: def.nodes.indexOf(currentNode as never) + 1,
    totalInSeason: def.nodes.length,
    completedInSeason,
    chapterNumber: LINEAR_ORDER.indexOf(currentNode as never) + 1,
    totalChapters: LINEAR_ORDER.length,
  };
}
