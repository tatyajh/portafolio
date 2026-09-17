import type { Project } from './types';

// Proyectos de desarrollo del Capítulo 7 (Estructura).
//
// ORDEN: del más nuevo al más viejo. Al agregar uno nuevo va ARRIBA
// de la lista, no al final. El año de cada entrada es cuando se
// arrancó el proyecto (fecha de creación del repo en GitHub).
export const PROJECTS: Project[] = [
  {
    id: 'verse',
    title: 'Versé Intimates',
    desc: 'La tienda de mi marca de ropa íntima. La experiencia empieza como una caja cerrada que se abre y conecta catálogo, detalle de producto, carrito y pedido. Construí el sistema visual de dos mundos —noche y seda—, un catálogo centralizado y la integración segura con Wompi para calcular y firmar los pagos desde el servidor.',
    stack: 'Next.js · React · TypeScript · Wompi',
    links: [
      { label: 'Ver en línea', url: 'https://verse-intimates.vercel.app' },
      { label: 'Código', url: 'https://github.com/tatyajh/verse' },
    ],
    preview: { image: '/media/projects/verse.png', alt: 'Portada de Versé Intimates', url: 'verse-intimates.vercel.app' },
    year: 2026,
  },
  // Tírame un Poemita: retirado del portafolio por ahora a pedido de
  // Tatiana (el frontend no está listo para mostrarse todavía).
  {
    id: 'portafolio',
    title: 'Hilos Invisibles',
    desc: 'Este mismo sitio. En vez de una lista de proyectos quise que fuera algo que se recorre: capítulos conectados entre sí, música de fondo, collages que se pueden mover y un fondo con el que se puede jugar. Es donde pruebo cosas — animación, interacción, render en canvas — y por eso siempre está cambiando.',
    stack: 'Next.js · TypeScript · Framer Motion',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/portafolio' }],
    year: 2026,
  },
  // Venux son dos proyectos distintos: la app móvil (React Native +
  // Expo) y la web, que NO usa Expo — es su propia interfaz, aunque
  // comparte la base de datos y las cuentas en Supabase.
  //
  // SIN enlaces a propósito: Venux todavía no se lanza. Ni el código
  // (github.com/tatyajh/Venux es público hoy, pero mostrarlo invita a
  // mirar el código de un producto sin publicar) ni la demo en vivo
  // (venux-web.vercel.app existe y funciona, pero no está lista para
  // enseñarse todavía). Cuando se lance, se agregan los links.
  {
    id: 'venux',
    title: 'Venux — App móvil',
    desc: 'Una app de citas para celular con el flujo completo: registro, perfil, deslizar, hacer match y ponerse a chatear. Trece pantallas conectadas entre sí, todo en JavaScript, con una base de datos PostgreSQL en Supabase guardando usuarios, matches y mensajes, y manejando el inicio de sesión. Lo que más me sirvió fue diseñar para el pulgar: los gestos, la navegación entre pantallas y que se sienta fluido en un teléfono de verdad.',
    stack: 'React Native · Expo · JavaScript · Supabase (PostgreSQL)',
    links: [],
  },
  // La captura sí se muestra (es solo el login, nada del producto sin
  // lanzar), pero sigue sin link — ver el comentario de arriba.
  {
    id: 'venux-web',
    title: 'Venux — Versión web',
    desc: 'La misma app de citas, hecha para el navegador y desplegada para que se pueda entrar y usarla sin instalar nada. Comparte la base de datos y las cuentas con la versión móvil, así que un usuario es el mismo en los dos lados, pero la interfaz está pensada para pantalla grande, mouse y teclado en vez de para el pulgar.',
    stack: 'React · Vite · JavaScript · Supabase (PostgreSQL)',
    links: [],
    preview: { image: '/media/projects/venux.png', alt: 'Pantalla de inicio de sesión de Venux', url: 'venux-web.vercel.app' },
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
    year: 2024,
  },
  {
    id: 'hotel',
    title: 'Reserva de hoteles',
    desc: 'Una vista de búsqueda y reserva de hoteles: filtrar, ver las tarjetas de cada hotel y entrar al detalle. Lo armé con diseño atómico, que es organizar la interfaz de lo más chiquito a lo más grande — botones, luego tarjetas, luego secciones, luego la página. Suena a formalidad, pero es lo que hace que cambiar un botón no te obligue a revisar media aplicación.',
    stack: 'Next.js · React · CSS Modules',
    links: [
      { label: 'Ver en línea', url: 'https://tatyajh.github.io/hotel-react-reto4/' },
      { label: 'Código', url: 'https://github.com/tatyajh/hotel-react-reto4' },
    ],
    preview: { image: '/media/projects/hotel.png', alt: 'Portada de la app de reserva de hoteles', url: 'tatyajh.github.io/hotel-react-reto4' },
    year: 2023,
  },
  {
    id: 'posticks',
    title: 'Posticks',
    desc: 'Una app de notas tipo post-it: crear, editar, buscar y borrar. Lo que más me gustó resolver fue la papelera — las notas borradas no se pierden de una, quedan ahí y uno decide si las restaura una por una o vacía todo. Las notas quedan guardadas en el navegador, así que siguen ahí al volver.',
    stack: 'React · Tailwind CSS',
    links: [
      { label: 'Ver en línea', url: 'https://tatyajh.github.io/posticks/' },
      { label: 'Código', url: 'https://github.com/tatyajh/posticks' },
    ],
    preview: { image: '/media/projects/posticks.png', alt: 'Portada de Posticks', url: 'tatyajh.github.io/posticks' },
    year: 2022,
  },
];
