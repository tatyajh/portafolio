// TECH ROUTE - copy para el nodo tecnico.
//
// El sitio va TODO en español; lo único que queda en inglés es la
// imagen del CV (public/media/cv/cv.png), que se muestra tal cual.
// Por eso los roles y las frases de abajo son la TRADUCCIÓN de lo que
// dice el CV, no un substring literal como antes. Cada entrada
// conserva el comentario con su origen: no se agrega ninguna
// afirmación profesional que no esté en el CV real.

export interface TechMindsetPoint {
  label: string;
  quote: string;
}

// SOLO cargos reales. Antes esta lista incluía "Resolución de
// Problemas", que es una habilidad blanda, no un rol — quedaba
// desubicada entre los otros tres y además se repetía con la sección
// de habilidades. Ahora vive donde le corresponde.
//
// Origen de cada rol (traducido del CV en inglés):
// - Ingeniera de Software              <- CV_EXPERIENCE (rol en ABATech: 'Software Engineer (Frontend)')
// - Desarrolladora Frontend            <- CV_TITLE ('Frontend Developer & Game Developer (Unity)')
//                                         y CV_EXPERIENCE (rol freelance: 'Frontend Developer (Freelance)')
// - Desarrolladora de Videojuegos      <- segunda mitad de CV_TITLE ('Game Developer (Unity)')
//
// Nota deliberada: "Creative Technologist" (sugerido por la spec original) se OMITE
// porque no existe como término en ningún dato del CV. El hecho real detrás de esa
// etiqueta se preserva sin inventar el título, en la frase de "Creatividad aplicada".
export const TECH_IDENTITY_ROLES: string[] = [
  'Ingeniera de Software',
  'Desarrolladora Frontend',
  'Desarrolladora de Videojuegos (Unity)',
];

// Traducción fiel de fragmentos de CV_SUMMARY (el CV original está en
// inglés). Se respeta el sentido; no se agrega nada que el CV no diga.
//
// Las etiquetas describen CÓMO trabaja, no cargos. Antes decían
// "Ingeniería y calidad" y "Seguridad por diseño": la primera se leía
// como si fuera ingeniera de calidad (no lo es) y la segunda sonaba a
// folleto corporativo.
export const TECH_MINDSET_POINTS: TechMindsetPoint[] = [
  { label: 'Que no se rompa', quote: 'Antes de dar algo por terminado lo pruebo, con pruebas automáticas en Jest, Cypress o Playwright.' },
  { label: 'Lo que traje del diseño', quote: 'La moda me enseñó a pensar en quién lo va a usar. Lo aplico al diseñar personajes e interfaces.' },
  { label: 'La IA como herramienta', quote: 'La uso para prototipar y probar ideas rápido, pero primero escribo bien qué quiero construir.' },
  { label: 'Seguridad desde el principio', quote: 'Sé de ciberseguridad, así que pienso en los riesgos desde el diseño y no al final.' },
];
