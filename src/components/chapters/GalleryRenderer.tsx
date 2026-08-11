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

// Estas fotos ya traen su propio fondo (recorte transparente o
// degradado propio) — el marco de papel claro se ve pegado encima en
// vez de enmarcarlas, así que van sueltas, sin marco.
const FRAMELESS: Record<string, string[]> = {
  esencia: ['esencia-1', 'esencia-4'],
  estructura: ['estructura-3'],
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
    // esencia-1 más grande; esencia-4 más chica y arriba (junto a
    // esencia-1, no al final del grupo) — offsetOverride en 'mt-0'
    // cancela el desfase hacia abajo que le tocaría por su slot.
    const bySrc = new Map(items.map(it => [it.src, it]));
    const e1 = bySrc.get(gallery.find(s => s.includes('esencia-1')) ?? '');
    const e4 = bySrc.get(gallery.find(s => s.includes('esencia-4')) ?? '');
    const rest = items.filter(it => it !== e1 && it !== e4);
    const ordered = [
      e1 && { ...e1, widthOverride: 'w-[64%] sm:w-[52%]' },
      e4 && { ...e4, widthOverride: 'w-[34%] sm:w-[24%]', offsetOverride: 'mt-0' },
      ...rest,
    ].filter((it): it is CollageItem => Boolean(it));
    return <CollageCluster items={ordered} mode="journal" />;
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
    // Las dos fotos de la muñeca (diseño-1, diseño-2) van una al lado
    // de la otra en vez de cada una a ancho completo — el resto del
    // grid sigue igual.
    const gridItems = nodeId === 'diseno'
      ? items.map(it => (it.src.includes('diseño-1') || it.src.includes('diseño-2') ? { ...it, paired: true } : it))
      : items;
    return <CollageGrid items={gridItems} mode={config.mode} />;
  }

  return <CollageCluster items={items} mode={config.mode} />;
}
