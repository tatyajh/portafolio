import { MEDIA } from '@/lib/media';
import type { Node } from './types';

// ═══════════════════════════════════════════════════════════════════
// DATOS DE NODOS - Estructura no lineal tipo Encarta
// ═══════════════════════════════════════════════════════════════════
export const NODES: Record<string, Node> = {
  inicio: {
    id: 'inicio',
    title: 'Hilos Invisibles',
    category: 'raiz',
    text: 'Todo lo que soy viene de una historia que empezó antes que yo.',
    connections: ['mapa'],
    theme: 'dark',
  },
  mapa: {
    id: 'mapa',
    title: 'Explorar',
    category: 'raiz',
    text: 'Elige tu camino. No hay orden correcto.',
    connections: ['esencia', 'herencia', 'arte', 'sonido', 'estructura', 'cuerpo', 'quiebre', 'diseno', 'juego', 'mixto', 'identidad', 'perfil', 'proceso'],
    theme: 'paper',
  },
  tecnico: {
    id: 'tecnico',
    title: 'Lo técnico',
    category: 'raiz',
    text: 'La ruta corta: perfil, código y juego.',
    connections: ['perfil', 'estructura', 'juego', 'mapa'],
    theme: 'paper',
  },
  esencia: {
    id: 'esencia',
    title: 'Esencia',
    category: 'esencia',
    subtitle: 'Capítulo 1',
    text: 'Antes de saber que quería diseñar, ya estaba diseñando.',
    content: 'Nunca me conformé con lo que encontraba. Buscaba piezas que no existían en las tiendas — lo vintage, lo oscuro, lo que contaba algo. Cuando no las encontraba, iba donde mi abuela. Ella me ayudaba a hacerlas realidad, o me decía a quién mandarlas a hacer. Sin saberlo, ya estaba creando.',
    gallery: MEDIA.images.esencia,
    connections: ['identidad', 'mapa'],
    theme: 'dark',
  },
  herencia: {
    id: 'herencia',
    title: 'Herencia',
    category: 'herencia',
    subtitle: 'Capítulo 4',
    text: 'Antes de mí, ya había manos que cosían para sostener.',
    content: 'Mi abuela materna sacó adelante a su familia con una máquina de coser básica. Mi abuela paterna hacía cobijas para regalar a quien las necesitara.\n\nNinguna de las dos lo llamaba diseño. Para ellas era resolver, o era querer a alguien. Creo que de ahí me quedó la idea de que hacer cosas con las manos siempre es para alguien.',
    gallery: MEDIA.images.herencia,
    connections: ['arte', 'esencia', 'mapa', 'sonido'],
    theme: 'dark',
  },
  arte: {
    id: 'arte',
    title: 'Arte Familiar',
    category: 'herencia',
    subtitle: 'Conexión',
    text: 'Crecí rodeada de arte, pero nunca pensé que fuera para mí.',
    gallery: MEDIA.images.arte,
    connections: ['herencia', 'quiebre', 'mapa'],
    theme: 'dark',
  },
  sonido: {
    id: 'sonido',
    title: 'Sonido',
    category: 'expresion',
    subtitle: 'Capítulo 6',
    text: 'Antes de saber explicarme, ya tocaba.',
    content: 'He tenido la suerte de tocar con la Filarmónica Metropolitana.\n\nEl saxofón me enseñó a respirar, a llevar el tiempo y sobre todo a callarme cuando toca. En una orquesta uno no puede ir por su lado: tiene que escuchar lo que están haciendo los demás y entrar justo donde le corresponde. Eso me ha servido en todo lo demás que hago.',
    media: { type: 'video', src: MEDIA.video.musica },
    gallery: MEDIA.images.musica,
    connections: ['estructura', 'mixto', 'mapa'],
    theme: 'dark',
  },
  estructura: {
    id: 'estructura',
    title: 'Estructura',
    category: 'expresion',
    // El nombre del capítulo se mantiene poético, pero el subtítulo
    // aclara de qué trata: es el capítulo que más le interesa a un
    // reclutador y el que menos debería hacerlo adivinar.
    subtitle: 'Capítulo 7 · Ingeniería de sistemas',
    text: 'Después decidí construir cosas que funcionaran.',
    content: 'La ingeniería me dio una forma de pensar que uso todo el tiempo: partir algo grande en pedazos manejables y entender cómo encajan entre sí.\n\nEstos son proyectos que hice de principio a fin, cada uno con su código abierto por si le quieren echar un ojo.',
    gallery: MEDIA.images.estructura,
    connections: ['cuerpo', 'diseno', 'mapa'],
    theme: 'dark',
  },
  cuerpo: {
    id: 'cuerpo',
    title: 'Cuerpo',
    category: 'expresion',
    subtitle: 'Capítulo 8',
    text: 'Y en algún momento el cuerpo también se volvió parte.',
    content: 'Empecé pole dance como deporte y terminó siendo otra cosa. Competí y me gané una medalla de plata, pero lo que más me llevo no es eso: es lo que cuesta repetir un movimiento hasta que sale, y lo que se siente cuando por fin sale.\n\nHacer algo con el cuerpo y hacer algo con las manos se parecen más de lo que uno cree.',
    videos: [MEDIA.video.pole, MEDIA.video.pole2],
    gallery: MEDIA.images.pole,
    connections: ['mixto', 'diseno', 'mapa'],
    theme: 'dark',
  },
  quiebre: {
    id: 'quiebre',
    title: 'Quiebre',
    category: 'transformacion',
    subtitle: 'Capítulo 9',
    text: 'Durante mucho tiempo creí que no era una persona creativa.',
    content: 'Aprendí a encontrar valor en la lógica, la estructura y las respuestas correctas.\n\nY aunque crecí rodeada de arte, costura e historias de creación, nunca pensé que ese mundo también podía pertenecerme.\n\nLa vida terminó cuestionando esa idea.\n\nEl accidente cerebrovascular de mi padre, la experiencia de vivir lejos de casa y la dificultad de comunicarme en otro idioma me obligaron a mirar las cosas desde otro lugar.\n\nFue entonces cuando entendí algo que había pasado por alto durante años:\n\nlas cosas hechas con las manos también son una forma de lenguaje.\n\nY quizá la creatividad nunca estuvo ausente.\n\nQuizá simplemente había aprendido a no verla.',
    gallery: MEDIA.images.quiebre,
    connections: ['diseno', 'arte', 'mapa'],
    theme: 'accent',
  },
  diseno: {
    id: 'diseno',
    title: 'Diseño de Modas',
    category: 'transformacion',
    subtitle: 'Capítulo 10',
    text: 'Volví a hacer cosas con las manos, ahora en serio.',
    content: 'Moodboards, bocetos, telas, patrones, desfiles. Estudiar diseño de modas fue darme permiso de hacer algo que llevaba años rondándome.\n\nMe sorprendió cuánto se parece a programar: uno arranca de una idea vaga, la va aterrizando, prueba, se equivoca, descose y vuelve a empezar.',
    videos: [MEDIA.video.moda, MEDIA.video.moda2, MEDIA.video.moda3, MEDIA.video.moda4, MEDIA.video.moda5],
    gallery: MEDIA.images.diseno,
    connections: ['identidad', 'estructura', 'proceso', 'mapa'],
    theme: 'dark',
  },
  identidad: {
    id: 'identidad',
    title: 'Tatiana Alejandra',
    category: 'esencia',
    subtitle: 'Capítulo 2',
    text: 'Más allá del trabajo y los proyectos.',
    content: 'Este capítulo no tiene proyectos ni entregas.\n\nSon recuerdos, lugares y personas: los momentos que no van en un portafolio pero que también explican por qué hago lo que hago.',
    videos: [MEDIA.video.me, MEDIA.video.me2],
    connections: ['perfil', 'fin', 'mapa', 'mixto'],
    theme: 'light',
  },
  perfil: {
    id: 'perfil',
    title: 'Perfil',
    category: 'esencia',
    subtitle: 'Capítulo 3',
    // Segunda ronda de ajuste: los primeros dos párrafos siguen su
    // redacción casi textual — videojuegos pasa a ser hacia dónde se
    // enfoca su carrera, y la moda queda como el complemento que
    // encontró en el camino, no como una carrera aparte.
    text: 'Ingeniera de sistemas, técnica en diseño de modas y desarrolladora de videojuegos.',
    content: 'Estudié ingeniería de sistemas y diseño de modas, y me gusta mucho crear videojuegos. Llevo años construyendo aplicaciones web con React, TypeScript y Node — esa sigue siendo mi base como desarrolladora frontend.\n\nComo me gusta tanto aprender, y siempre me ha gustado crear, en algún momento quise intentar algo con las manos y me fui por el mundo de la moda. Sin saberlo, terminó siendo un complemento para el desarrollo de videojuegos, que es hacia donde se está enfocando mi carrera.\n\nNo lo veo como caminos separados. Termino usando lo mismo en todos: entender bien qué se necesita, probar, corregir y volver a probar hasta que quede.',
    // Fuente de cada herramienta: o está en CV_SKILLS (src/data/cv/cv.ts)
    // o se usa de verdad en alguno de sus repos públicos. Nada inventado.
    //
    // Se quitaron "ChatGPT" y "Copilot": nombrar productos concretos
    // se lee como "sé usar un chat" y envejece rápido. Lo que sí dice
    // algo es CÓMO trabaja con IA, y eso ya está literal en el CV:
    // "Spec-Driven Development" y "Desarrollo Asistido por IA".
    tools: {
      digital: [
        'React', 'React Native', 'Next.js', 'TypeScript', 'JavaScript',
        'Node.js', 'Express', 'REST APIs', 'Supabase', 'PostgreSQL',
        'Microfrontend (Single-SPA)', 'Tailwind CSS', 'Unity', 'C#',
        'Jest', 'Cypress', 'Playwright', 'New Relic', 'Git',
        'Spec-Driven Development', 'Agile', 'Scrum',
      ],
      diseno: ['Canva', 'Illustrator', 'Optitex'],
    },
    connections: ['identidad', 'diseno', 'mapa'],
    theme: 'dark',
  },
  juego: {
    id: 'juego',
    title: 'Videojuegos',
    category: 'mixto',
    subtitle: 'Capítulo 12',
    text: 'Programar algo que además se pueda jugar.',
    content: 'Mundos pequeños hechos en Unity y C#, que se pueden jugar ahí mismo en el navegador, sin descargar nada.\n\nHacer juegos me obliga a pensar en alguien del otro lado: si no entiende qué hacer en los primeros segundos, se va. Eso no se arregla con más código, se arregla probándolo con gente.',
    connections: ['estructura', 'cuerpo', 'diseno', 'mapa'],
    theme: 'paper',
  },
  mixto: {
    id: 'mixto',
    title: 'Conexiones',
    category: 'mixto',
    subtitle: 'Capítulo 11',
    text: 'A veces todo pasa al mismo tiempo.',
    content: 'Hay ratos en que no estoy tocando, ni entrenando, ni diseñando por separado: simplemente estoy haciendo algo y todo eso está ahí junto.\n\nEstos son esos momentos.',
    videos: [MEDIA.video.mixto, MEDIA.video.mixto2],
    gallery: MEDIA.images.mixto,
    connections: ['sonido', 'cuerpo', 'mapa'],
    theme: 'dark',
  },
  proceso: {
    id: 'proceso',
    title: 'Fuera del proceso',
    category: 'mixto',
    subtitle: 'Capítulo 13',
    text: 'Y también hay ratos en que no estoy produciendo nada.',
    content: 'Leo bastante y veo mucho anime, del que me llevo más de lo que admito: encuadres, colores, manera de contar.\n\nEscucho jazz, metal y clásica según el día. Y disfruto sentarme con un vino o una cerveza sin estar haciendo nada productivo.\n\nDe ahí sale buena parte de lo que después termina en lo que hago.',
    gallery: MEDIA.images.anexo,
    connections: ['diseno', 'identidad', 'mapa'],
    theme: 'dark',
  },
  fin: {
    id: 'fin',
    title: 'Gracias',
    category: 'raiz',
    text: 'Gracias por explorar mi historia.',
    content: 'Cada juego, cada aplicación, cada prenda, cada pieza que creo lleva todas estas capas. Cada decisión viene de un proceso que no empezó en un taller, sino en una vida.\n\nEsto no es un portafolio de llegadas. Es un mapa de lo que me trajo hasta aquí.\n\nGracias por caminar un rato por él.',
    connections: ['mapa', 'inicio'],
    theme: 'dark',
  },
};
