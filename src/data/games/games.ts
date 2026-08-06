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
    // architecture: cada item reformula mínimamente (label + reordenado) una
    // viñeta literal de "Características técnicas" del README real del
    // proyecto (D:\Generation\Unity\QueMasParceroBeta\README.md). No se
    // añade ninguna afirmación técnica que no esté en ese README.
    architecture: [
      { label: 'Nivel procedural', detail: 'Bloques prefabricados que se instancian y destruyen dinámicamente a medida que el jugador avanza.' },
      { label: 'Máquina de estados', detail: 'Menú, en juego y game over, controlados por un GameManager singleton.' },
      { label: 'Física 2D', detail: 'Rigidbody2D, raycast para detección de suelo y capas de colisión.' },
      { label: 'Vida y maná', detail: 'Barras de UI para vida y maná; el súper salto tiene costo de maná.' },
      { label: 'Persistencia', detail: 'El puntaje máximo se guarda con PlayerPrefs.' },
      { label: 'Cámara', detail: 'Seguimiento suavizado del jugador con SmoothDamp.' },
    ],
  },
];
