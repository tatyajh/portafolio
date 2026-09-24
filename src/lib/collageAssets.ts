import scissorsOpen from '@/assets/collage/scissors-open.png';
import scissorsClosed from '@/assets/collage/scissors-closed.png';
import needle from '@/assets/collage/needle.png';
import spool from '@/assets/collage/thread-spool-red.png';
import saxophone from '@/assets/collage/saxophone.png';
import controller from '@/assets/collage/controller.png';
import code from '@/assets/collage/code-note.png';

// TEMPORARY: replace these PNGs with final gouache cutouts; see assets/collage/README.md.
export const collageAssets = {
  tijeras: { image: scissorsOpen, activeImage: scissorsClosed, es: 'Tijeras', en: 'Scissors' },
  aguja: { image: needle, es: 'Aguja', en: 'Needle' },
  carrete: { image: spool, es: 'Carrete de hilo rojo', en: 'Red thread spool' },
  saxofon: { image: saxophone, es: 'Saxofón', en: 'Saxophone' },
  gamepad: { image: controller, es: 'Control de videojuegos', en: 'Game controller' },
  codigo: { image: code, es: 'Papel con código', en: 'Code note' },
};
export type CollageObject = keyof typeof collageAssets;
export type CollageTool = 'tijeras' | 'aguja';
