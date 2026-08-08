import type { Game } from './types';

// Galería de videojuegos del Capítulo 12.
//
// ORDEN: del más nuevo al más viejo, igual que PROJECTS. Un juego
// nuevo va ARRIBA de la lista.
export const GAMES: Game[] = [
  {
    id: 'whackamole',
    title: 'Whack a Mole',
    year: '2026',
    desc: 'Un topo que baja excavando, escalón por escalón, y entre más profundo llega más difícil se pone. Hecho en equipo durante la Generation GameJam, cuyo tema era justamente "Deeper and Deeper".',
    // Rol y detalle técnico salen de su propio commit en el repo del
    // equipo (SEVFCA/DepperAndDepper) — no hay nada aquí que no esté
    // en ese trabajo verificable.
    rol: 'Programadora — sistema de niveles, power-ups y obstáculos',
    motor: 'Unity',
    lenguaje: 'C#',
    genero: 'Arcade / game jam',
    playUrl: 'https://krostgames.itch.io/whack-a-mole',
    codeUrl: 'https://github.com/SEVFCA/DepperAndDepper',
    architecture: [
      { label: 'Niveles con progresión', detail: 'Un LevelManager regenera el nivel en el sitio y arma la dificultad con patrones distintos: uniforme, alternado y comprimido.' },
      { label: 'Escalones variados', detail: 'Pool de escalones con variantes nuevas (huecos en los extremos) y avanzadas (tierra dura), más el efecto de hundimiento al caer en el hoyo.' },
      { label: 'Power-up de pico', detail: 'Se guarda en el inventario y se activa con la barra espaciadora: acelera temporalmente la velocidad de minado.' },
      { label: 'Vidas y continuación', detail: 'Al perder con vidas disponibles se sigue en el mismo nivel, en vez de devolverse hasta el primero.' },
      { label: 'Pinchos', detail: 'Obstáculo mortal que solo aparece en casillas seguras: nunca sobre un hueco de minería ni debajo del hueco del escalón anterior.' },
      { label: 'Aparición de ítems', detail: 'Aleatoria por nivel en vez de fija, con garantía de que salga una vida si pasan varios niveles sin ninguna.' },
    ],
  },
  {
    id: 'drunkdriver',
    title: 'Drunk Driver',
    year: '2026',
    // Descripción tomada de la propia página del juego en itch.io.
    desc: 'Beber y conducir son cosas que no deberías mezclar jamás. ¿O sí? Un juego de carreras caótico, hecho en equipo durante una game jam.',
    rol: 'Post-producción, efectos, música y menú',
    motor: 'Unity',
    lenguaje: 'C#',
    genero: 'Carreras',
    playUrl: 'https://nairbio.itch.io/drunk-driver',
    codeUrl: 'https://github.com/MarianoMushy/Drunk-Driver',
  },
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
