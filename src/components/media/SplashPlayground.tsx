"use client";

import { useEffect, useState, type CSSProperties } from 'react';
import CollagePiece from '@/components/background/CollagePiece';
import { useLanguage } from '@/context/LanguageContext';
import type { CollageObject, CollageTool } from '@/lib/collageAssets';

// Dónde descansa cada recorte. En escritorio (x, y) son % de la ilustración,
// sobre los bordes verdes alrededor del papel. En celular la ilustración se
// recorta al centro, así que mx es un desplazamiento en vw desde el centro.
const PLACEMENT: { object: CollageObject; x: number; y: number; mx: number; my: number; r: number }[] = [
  { object: 'tijeras', x: 79, y: 1.5, mx: 24, my: 11, r: -28 },
  { object: 'aguja', x: 36, y: 3, mx: -38, my: 12, r: 8 },
  { object: 'carrete', x: 29, y: 80, mx: -40, my: 62, r: -6 },
  { object: 'gamepad', x: 52, y: 81, mx: -34, my: 86, r: 5 },
  { object: 'saxofon', x: 91.5, y: 26, mx: -7, my: 10, r: 12 },
];

export default function SplashPlayground() {
  const { locale } = useLanguage();
  const [selected, setSelected] = useState<CollageTool | null>(null);
  useEffect(() => {
    const receive = (event: Event) => setSelected((event as CustomEvent<CollageTool | null>).detail);
    window.addEventListener('splash-tool-select', receive);
    return () => window.removeEventListener('splash-tool-select', receive);
  }, []);
  const select = (tool: CollageTool | null) => {
    setSelected(tool);
    window.dispatchEvent(new CustomEvent('splash-tool-select', { detail: tool }));
  };
  return (
    <div className="collage-workbench" aria-label={locale === 'en' ? 'Paper cutouts' : 'Recortes de papel'}>
      {PLACEMENT.map(({ object, x, y, mx, my, r }) => (
        <div key={object} className="collage-spot"
          style={{ '--x': `${x}%`, '--y': `${y}%`, '--mx': `${mx}vw`, '--my': `${my}%`, '--r': `${r}deg` } as CSSProperties}>
          <CollagePiece object={object} interactive selected={selected === object} onSelect={select} />
        </div>
      ))}
      <p className="sr-only" role="status">
        {locale === 'en'
          ? selected === 'aguja' ? 'Needle selected: touch a cut letter to stitch it. Escape puts it down.' : selected === 'tijeras' ? 'Scissors selected: touch a letter to cut it. Escape puts them down.' : ''
          : selected === 'aguja' ? 'Aguja seleccionada: toca una letra cortada para coserla. Esc la suelta.' : selected === 'tijeras' ? 'Tijeras seleccionadas: toca una letra para cortarla. Esc las suelta.' : ''}
      </p>
    </div>
  );
}
