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
  // Venux se presenta como dos proyectos (móvil y web) por decisión de
  // Tatiana. La versión web está desplegada y viva en
  // venux-web.vercel.app (verificado: el bundle referencia Expo y
  // Supabase, o sea es este mismo código corriendo en navegador).
  // PENDIENTE: el CÓDIGO de la web todavía no está en su propio repo
  // — github.com/tatyajh/venux-web sigue vacío —, así que el enlace
  // "Código" de la entrada 'venux-web' apunta al repo compartido.
  // Cuando se migre, cambiar solo esa URL.
  {
    id: 'venux',
    title: 'Venux — App móvil',
    desc: 'Una app de citas para celular con el flujo completo: registro, perfil, deslizar, hacer match y ponerse a chatear. Trece pantallas conectadas entre sí, con Supabase por detrás manejando las cuentas y los datos. Lo que más me sirvió fue diseñar para el pulgar: los gestos, la navegación entre pantallas y que se sienta fluido en un teléfono de verdad.',
    stack: 'React Native · Expo · Supabase',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/Venux' }],
  },
  {
    id: 'venux-web',
    title: 'Venux — Versión web',
    desc: 'La misma app de citas, corriendo en el navegador y desplegada para que se pueda entrar sin instalar nada. En vez de rehacer la interfaz desde cero, aproveché que los componentes de React Native pueden renderizarse como HTML, así que las dos versiones comparten pantallas, estado y la misma base de datos en Supabase. Lo interesante fue lo que sí toca resolver aparte: la pantalla contenedora, los colores del arranque y que lo pensado para tocar con el dedo funcione con mouse y teclado.',
    stack: 'React Native Web · Expo · Supabase',
    links: [
      { label: 'Ver en línea', url: 'https://venux-web.vercel.app' },
      { label: 'Código', url: 'https://github.com/tatyajh/Venux' },
    ],
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
