"use client";

import { IMAGE_CAPTIONS } from '@/data/nodes';
import CollageHero from './collage-templates/CollageHero';
import CollageCluster from './collage-templates/CollageCluster';
import CollageSpread from './collage-templates/CollageSpread';
import CollageGrid from './collage-templates/CollageGrid';
import CollageAlbums from './collage-templates/CollageAlbums';
import CollageDuo from './collage-templates/CollageDuo';
import type { CollageItem, CollageMode } from './collage-templates/types';

// Asignación plantilla + "modo" por nodo — no es una grilla genérica:
// cada sección tiene una personalidad editorial distinta (moda=revista,
// personal/historia=diario visual, música=scrapbook documental,
// estructura=técnico+editorial), reutilizando las mismas plantillas.
// diseño es la excepción deliberada: ahí se prefiere un grid estático
// y ordenado en vez del collage arrastrable/superpuesto.
const NODE_TEMPLATE: Record<string, { template: 'hero' | 'cluster' | 'spread' | 'grid'; mode: CollageMode }> = {
  arte: { template: 'hero', mode: 'journal' },
  quiebre: { template: 'hero', mode: 'journal' },
  mixto: { template: 'hero', mode: 'journal' },
  proceso: { template: 'hero', mode: 'journal' },
  sonido: { template: 'spread', mode: 'documentary' },
  diseno: { template: 'grid', mode: 'editorial' },
};

// Cuerpo (pole) tiene tantas fotos que se agrupan en álbumes por tipo
// de figura, confirmado con ella: 1-2-3-5 juntas, 7 sola, 6-9-10-11
// juntas, 8-12 juntas — los números refieren al nombre real del
// archivo (pole-N), no a la posición en la galería.
const CUERPO_ALBUMS = [[1, 2, 3, 5], [7], [6, 9, 10, 11], [8, 12]];

// Estas fotos ya traen su propio fondo (recorte transparente o
// degradado propio) — el marco de papel claro se ve pegado encima en
// vez de enmarcarlas, así que van sueltas, sin marco.
// estructura ya no pasa por acá: su galería se arma directamente en
// page.tsx (la foto de Women Who Code va arriba junto a su leyenda,
// antes del desarrollo, no en el flujo genérico de este componente).
const FRAMELESS: Record<string, string[]> = {
  esencia: ['esencia-1'],
};

export default function GalleryRenderer({ nodeId, gallery }: { nodeId: string; gallery: readonly string[] }) {
  const captions = IMAGE_CAPTIONS[nodeId] || [];
  const frameless = FRAMELESS[nodeId] ?? [];
  const items: CollageItem[] = gallery.map((src, index) => ({
    src,
    alt: captions[index] || `${nodeId} ${index + 1}`,
    caption: captions[index],
    frameless: frameless.some(name => src.includes(name)),
  }));

  if (nodeId === 'esencia') {
    // esencia-1 y esencia-4 ya se muestran arriba, chicas, junto al
    // título y al párrafo (ver page.tsx) — acá solo van las otras dos,
    // juntas, arrastrables sin límite (como el resto del collage).
    const rest = items.filter(it => !it.src.includes('esencia-1') && !it.src.includes('esencia-4'));
    return <CollageDuo items={rest} mode="journal" />;
  }

  if (nodeId === 'cuerpo') {
    // pole-1 y pole-2 son horizontales — el recuadro 3:4 las dejaba
    // "mochas" (recortadas); cada una ocupa su propia fila completa.
    return <CollageAlbums items={items} groups={CUERPO_ALBUMS} mode="documentary" fullRowNumbers={[1, 2]} />;
  }

  // Herencia: siempre dos fotos por fila (dos columnas), pero
  // arrastrables como el resto del collage — a diferencia del grid
  // estático de diseño.
  if (nodeId === 'herencia') {
    return <CollageDuo items={items} mode="journal" />;
  }

  const config = NODE_TEMPLATE[nodeId] ?? { template: 'cluster' as const, mode: 'journal' as const };

  if (config.template === 'hero') {
    const item = items[0];
    if (!item) return null;
    return <CollageHero src={item.src} alt={item.alt} caption={item.caption} mode={config.mode} />;
  }

  if (config.template === 'spread') {
    return <CollageSpread items={items} mode={config.mode} />;
  }

  if (config.template === 'grid') {
    // Las fotos de la muñeca (diseño-1, diseño-2) y la de retazos
    // (diseño-4) NO van acá — se muestran al final del nodo, debajo de
    // los dos últimos videos (ver page.tsx). Este grid solo trae los
    // figurines y diseño-3.
    const gridItems = nodeId === 'diseno'
      ? items.filter(it => !it.src.includes('diseño-1') && !it.src.includes('diseño-2') && !it.src.includes('diseño-4'))
      : items;
    return <CollageGrid items={gridItems} mode={config.mode} />;
  }

  return <CollageCluster items={items} mode={config.mode} />;
}
