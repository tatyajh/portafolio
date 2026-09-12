export interface Game {
  id: string;
  title: string;
  year: string;
  desc: string;
  rol: string;
  motor: string;
  lenguaje: string;
  genero: string;
  playUrl: string;
  codeUrl: string;
  video?: string;
  /** Portada del juego. Se muestra cuando todavía no hay video de gameplay. */
  image?: string;
  /** Ajuste visual de la portada: las marcas transparentes funcionan mejor contenidas. */
  imageFit?: 'cover' | 'contain';
  /** Game jam en la que se hizo, con enlace a la jam en itch.io. */
  jam?: { nombre: string; url: string };
  /** Contexto del proyecto cuando no corresponde llamarlo game jam. */
  context?: { label: string; nombre: string; url: string };
  /** Distintivo editorial breve, por ejemplo para el proyecto más reciente. */
  statusLabel?: string;
  architecture?: { label: string; detail: string }[];
}
