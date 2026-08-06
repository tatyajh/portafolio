import type { Project } from './types';

// Proyectos de desarrollo del Capítulo 7 (Estructura): para agregar
// uno nuevo, solo añade otra entrada a esta lista
export const PROJECTS: Project[] = [
  {
    id: 'mivaquita',
    title: 'Mi Vaquita',
    desc: 'Aplicación full-stack para gestionar gastos compartidos entre amigos: frontend en React y API REST en Express con arquitectura de 3 capas.',
    stack: 'React · Express · Node.js',
    links: [
      { label: 'Frontend', url: 'https://github.com/tatyajh/Mi-Vaquita-FE' },
      { label: 'Backend', url: 'https://github.com/tatyajh/Mi-Vaquita-BE' },
    ],
  },
  {
    id: 'venux',
    title: 'Venux',
    desc: 'App de citas móvil: swipe de perfiles, matches y chat en 7 pantallas, construida con React Native y Expo.',
    stack: 'React Native · Expo',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/Venux' }],
  },
  {
    id: 'portafolio',
    title: 'Hilos Invisibles',
    desc: 'Este mismo portafolio: una experiencia narrativa interactiva con nodos, música y collage — mi demo frontend viviente.',
    stack: 'Next.js · TypeScript · Framer Motion',
    links: [{ label: 'Código', url: 'https://github.com/tatyajh/portafolio' }],
  },
];
