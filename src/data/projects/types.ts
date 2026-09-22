export interface Project {
  id: string;
  title: string;
  desc: string;
  stack: string;
  role: 'design-development' | 'figma-development' | 'webmaster' | 'development';
  links: { label: string; url: string }[];
  // Recursos reales del proyecto. Los montajes editoriales y las referencias
  // compartidas se identifican explícitamente; no simulan capturas nuevas.
  preview: {
    image?: string;
    alt: string;
    url?: string;
    layout?: 'screens' | 'editorial' | 'catalogue' | 'identity' | 'typographic';
    detailImage?: string;
    detailAlt?: string;
    note?: string;
  };
  // Caso de estudio en Behance, cuando existe uno para este proyecto.
  behanceUrl?: string;
  // Año de inicio: confirmado por Tatiana (GYG y Venux) o fecha del
  // repositorio. En GYG corresponde a su trabajo de administración.
  year?: number;
}
