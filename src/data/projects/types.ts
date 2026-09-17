export interface Project {
  id: string;
  title: string;
  desc: string;
  stack: string;
  links: { label: string; url: string }[];
  // Captura del sitio en vivo, mostrada en un marco tipo navegador.
  // `url` es solo el texto que aparece en la barra de direcciones del
  // marco (no crea un link si el proyecto no tiene uno en `links`).
  // Opcional: solo los proyectos con demo pública tienen una.
  preview?: { image: string; alt: string; url?: string };
  // Caso de estudio en Behance, cuando existe uno para este proyecto.
  behanceUrl?: string;
}
