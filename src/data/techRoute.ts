// TECH ROUTE - copy sintetizado para el nodo tecnico.
// Toda cadena aquí es un substring literal o un item literal ya
// existente en src/data/cv/cv.ts. Ver comentarios de fuente en cada
// entrada. No se introduce ninguna afirmación profesional nueva.

export interface TechMindsetPoint {
  label: string;
  quote: string;
}

// Fuente de cada rol:
// - Software Engineer        <- CV_EXPERIENCE (rol en ABATech: 'Software Engineer (Frontend)')
// - Frontend Developer       <- CV_TITLE ('Frontend Developer & Game Developer (Unity)')
//                                y CV_EXPERIENCE (rol freelance: 'Frontend Developer (Freelance)')
// - Game Developer (Unity)   <- substring literal exacto de CV_TITLE (segunda mitad)
// - Resolución de Problemas  <- item literal de CV_SKILLS, categoría Soft Skills
//
// Nota deliberada: "Creative Technologist" (sugerido por la spec original) se OMITE
// porque no existe como término literal en ningún dato del CV. El hecho real detrás
// de esa etiqueta se preserva sin inventar el título, como cita textual más abajo
// bajo "Creatividad aplicada".
export const TECH_IDENTITY_ROLES: string[] = [
  'Software Engineer',
  'Frontend Developer',
  'Game Developer (Unity)',
  'Resolución de Problemas',
];

// Cada quote es un substring EXACTO y contiguo de CV_SUMMARY (src/data/cv/cv.ts).
export const TECH_MINDSET_POINTS: TechMindsetPoint[] = [
  { label: 'Ingeniería y calidad', quote: 'engineering rigor, automated testing and scalable architectures' },
  { label: 'Creatividad aplicada', quote: 'a creative perspective from my fashion design training, applied to character design and UI/UX decisions' },
  { label: 'IA como multiplicador', quote: 'I work with Spec-Driven Development and leverage AI strategically to prototype and validate ideas faster' },
  { label: 'Seguridad por diseño', quote: 'my cybersecurity knowledge reinforces quality and security from the design stage' },
];
