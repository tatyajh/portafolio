import type { Project } from './types';

// Proyectos de desarrollo del Capítulo 7 (Estructura): para agregar
// uno nuevo, solo añade otra entrada a esta lista
export const PROJECTS: Project[] = [
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
    id: 'venux',
    title: 'Venux',
    desc: 'Una app de citas para celular, con el flujo completo: ver perfiles, deslizar, hacer match y ponerse a chatear. Son siete pantallas conectadas entre sí, hechas con React Native y Expo. Me sirvió para meterme en lo que cambia cuando dejas la web y diseñas para el pulgar: navegación entre pantallas, gestos y que se sienta fluido en un teléfono de verdad.',
    stack: 'React Native · Expo',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/Venux' }],
  },
  {
    id: 'portafolio',
    title: 'Hilos Invisibles',
    desc: 'Este mismo sitio. En vez de una lista de proyectos quise que fuera algo que se recorre: capítulos conectados entre sí, música de fondo, collages que se pueden mover y un fondo con el que se puede jugar. Es donde pruebo cosas — animación, interacción, render en canvas — y por eso siempre está cambiando.',
    stack: 'Next.js · TypeScript · Framer Motion',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/portafolio' }],
  },
];
