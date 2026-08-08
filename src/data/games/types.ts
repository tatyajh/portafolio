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
  /** Game jam en la que se hizo, con enlace a la jam en itch.io. */
  jam?: { nombre: string; url: string };
  architecture?: { label: string; detail: string }[];
}
