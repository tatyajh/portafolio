import type { Project } from './types';

// Proyectos de desarrollo del Capítulo 7 (Estructura).
//
// ORDEN: del más nuevo al más viejo. Al agregar uno nuevo va ARRIBA
// de la lista, no al final. El año de cada entrada es cuando se
// arrancó el proyecto (fecha de creación del repo en GitHub).
export const PROJECTS: Project[] = [
  {
    id: 'portafolio',
    title: 'Hilos Invisibles',
    desc: 'Este mismo sitio. En vez de una lista de proyectos quise que fuera algo que se recorre: capítulos conectados entre sí, música de fondo, collages que se pueden mover y un fondo con el que se puede jugar. Es donde pruebo cosas — animación, interacción, render en canvas — y por eso siempre está cambiando.',
    stack: 'Next.js · TypeScript · Framer Motion',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/portafolio' }],
  },
  {
    id: 'venux',
    title: 'Venux',
    desc: 'Una app de citas para celular, con el flujo completo: ver perfiles, deslizar, hacer match y ponerse a chatear. Son siete pantallas conectadas entre sí, hechas con React Native y Expo. Me sirvió para meterme en lo que cambia cuando dejas la web y diseñas para el pulgar: navegación entre pantallas, gestos y que se sienta fluido en un teléfono de verdad.',
    stack: 'React Native · Expo',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/Venux' }],
  },
  {
    id: 'mivaquita',
    title: 'Mi Vaquita',
    desc: 'Para cuando salimos en grupo y al final nadie se acuerda de quién puso qué. Uno arma el grupo, va anotando los gastos y la app saca la cuenta: cuánto puso cada quien y quién le debe a quién. Lo hice de punta a punta — la interfaz en React y, por detrás, una API en Express separada en tres capas (rutas, lógica y datos), para que agregar algo nuevo no signifique tocar todo lo demás.',
    stack: 'React · Express · Node.js',
    links: [
      { label: 'Frontend', url: 'https://github.com/tatyajh/Mi-Vaquita-FE' },
      { label: 'Backend', url: 'https://github.com/tatyajh/Mi-Vaquita-BE' },
    ],
  },
  {
    id: 'hotel',
    title: 'Reserva de hoteles',
    desc: 'Una vista de búsqueda y reserva de hoteles: filtrar, ver las tarjetas de cada hotel y entrar al detalle. Lo armé con diseño atómico, que es organizar la interfaz de lo más chiquito a lo más grande — botones, luego tarjetas, luego secciones, luego la página. Suena a formalidad, pero es lo que hace que cambiar un botón no te obligue a revisar media aplicación.',
    stack: 'Next.js · React · CSS Modules',
    links: [
      { label: 'Ver en línea', url: 'https://hotel-react-reto4.vercel.app' },
      { label: 'Código', url: 'https://github.com/tatyajh/hotel-react-reto4' },
    ],
  },
  {
    id: 'posticks',
    title: 'Posticks',
    desc: 'Una app de notas tipo post-it: crear, editar, buscar y borrar. Lo que más me gustó resolver fue la papelera — las notas borradas no se pierden de una, quedan ahí y uno decide si las restaura una por una o vacía todo. Las notas quedan guardadas en el navegador, así que siguen ahí al volver.',
    stack: 'React · Tailwind CSS',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/posticks' }],
  },
];
