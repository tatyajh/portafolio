import type { Game } from './types';

// Galería de videojuegos del Capítulo 12: para agregar un juego nuevo,
// solo añade otra entrada a esta lista
export const GAMES: Game[] = [
  {
    id: 'quemasparcero',
    title: '¡Qué Más Parcero!',
    year: '2026',
    video: '/media/video/juego-01.mp4',
    desc: 'Un paisa recorre los tejados de una comuna esquivando frijoles saltarines y recolectando empanadas. Salta, usa el súper salto gastando maná, recupera vida con pociones y aguanta: entre más lejos llegues, más rápido va todo. Hecho para el curso de Ubicua.',
    rol: 'Programadora',
    motor: 'Unity 6',
    lenguaje: 'C#',
    genero: 'Runner 2D',
    playUrl: 'https://tarjah.itch.io/quemasparcero',
    codeUrl: 'https://github.com/tatyajh/QueMasParceroBeta',
  },
];
