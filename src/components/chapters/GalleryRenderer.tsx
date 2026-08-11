"use client";

import { IMAGE_CAPTIONS } from '@/data/nodes';
import CollageHero from './collage-templates/CollageHero';
import CollageCluster from './collage-templates/CollageCluster';
import CollageSpread from './collage-templates/CollageSpread';
import CollageGrid from './collage-templates/CollageGrid';
import CollageAlbums from './collage-templates/CollageAlbums';
import type { CollageItem, CollageMode } from './collage-templates/types';

// Asignación plantilla + "modo" por nodo — no es una grilla genérica:
// cada sección tiene una personalidad editorial distinta (moda=revista,
// personal/historia=diario visual, música=scrapbook documental,
// estructura=técnico+editorial), reutilizando las mismas plantillas.
// diseño es la excepción deliberada: ahí se prefiere un grid estático
// y ordenado en vez del collage arrastrable/superpuesto.
const NODE_TEMPLATE: Record<string, { template: 'hero' | 'cluster' | 'spread' | 'grid'; mode: CollageMode }> = {
  esencia: { template: 'cluster', mode: 'journal' },
  herencia: { template: 'cluster', mode: 'journal' },
  estructura: { template: 'cluster', mode: 'journal' },
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

export default function GalleryRenderer({ nodeId, gallery }: { nodeId: string; gallery: readonly string[] }) {
  const captions = IMAGE_CAPTIONS[nodeId] || [];
  const items: CollageItem[] = gallery.map((src, index) => ({
    src,
    alt: captions[index] || `${nodeId} ${index + 1}`,
    caption: captions[index],
  }));

  if (nodeId === 'cuerpo') {
    return <CollageAlbums items={items} groups={CUERPO_ALBUMS} mode="documentary" />;
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
    return <CollageGrid items={items} mode={config.mode} />;
  }

  return <CollageCluster items={items} mode={config.mode} />;
}
