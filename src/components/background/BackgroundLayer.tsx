"use client";

import CollageDecor from './CollageDecor';

// Componente montable simple: decide si el collage decorativo se
// muestra, y le pasa qué sección/categoría de íconos reales
// (getBackgroundAssets en src/lib/backgroundAssets.ts) le corresponde
// al nodo actual.
export default function BackgroundLayer({ visible, section }: { visible: boolean; section: string }) {
  if (!visible) return null;
  return <CollageDecor section={section} />;
}
