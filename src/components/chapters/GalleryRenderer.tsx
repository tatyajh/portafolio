"use client";

import { IMAGE_CAPTIONS } from '@/data/nodes';
import CollageHero from './collage-templates/CollageHero';
import CollageCluster from './collage-templates/CollageCluster';
import CollageSpread from './collage-templates/CollageSpread';
import type { CollageItem, CollageMode } from './collage-templates/types';

// Asignación plantilla + "modo" por nodo — no es una grilla genérica:
// cada sección tiene una personalidad editorial distinta (moda=revista,
// personal/historia=diario visual, música=scrapbook documental,
// estructura=técnico+editorial), reutilizando las mismas 3 plantillas.
const NODE_TEMPLATE: Record<string, { template: 'hero' | 'cluster' | 'spread'; mode: CollageMode }> = {
  esencia: { template: 'cluster', mode: 'journal' },
  herencia: { template: 'cluster', mode: 'journal' },
  estructura: { template: 'cluster', mode: 'journal' },
  arte: { template: 'hero', mode: 'journal' },
  quiebre: { template: 'hero', mode: 'journal' },
  mixto: { template: 'hero', mode: 'journal' },
  proceso: { template: 'hero', mode: 'journal' },
  sonido: { template: 'spread', mode: 'documentary' },
  cuerpo: { template: 'spread', mode: 'documentary' },
  diseno: { template: 'spread', mode: 'editorial' },
};

export default function GalleryRenderer({ nodeId, gallery }: { nodeId: string; gallery: readonly string[] }) {
  const captions = IMAGE_CAPTIONS[nodeId] || [];
  const items: CollageItem[] = gallery.map((src, index) => ({
    src,
    alt: captions[index] || `${nodeId} ${index + 1}`,
    caption: captions[index],
  }));

  const config = NODE_TEMPLATE[nodeId] ?? { template: 'cluster' as const, mode: 'journal' as const };

  if (config.template === 'hero') {
    const item = items[0];
    if (!item) return null;
    return <CollageHero src={item.src} alt={item.alt} caption={item.caption} mode={config.mode} />;
  }

  if (config.template === 'spread') {
    return <CollageSpread items={items} mode={config.mode} />;
  }

  return <CollageCluster items={items} mode={config.mode} />;
}
