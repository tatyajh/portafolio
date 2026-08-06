"use client";

import CollageDecor from './CollageDecor';

// Componente montable simple: hoy solo decide si el collage decorativo
// se muestra o no. Su contrato publico (una prop `visible`) se mantiene
// estable aunque su interior cambie mas adelante (fisica, hilos, objetos
// arrastrables) al implementar el sistema de fondo interactivo.
// TODO: consumir getBackgroundAssets() (src/lib/backgroundAssets.ts)
// cuando existan PNGs transparentes finales en src/assets/background/.
export default function BackgroundLayer({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return <CollageDecor />;
}
