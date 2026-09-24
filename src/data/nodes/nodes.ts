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
    connections: ['esencia', 'herencia', 'sonido', 'estructura', 'cuerpo', 'quiebre', 'diseno', 'juego', 'mixto', 'identidad', 'perfil'],
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
    text: 'Siempre quise ropa que no vendían en ningún lado.',
    content: 'Nunca me conformé con lo que había en las tiendas. Yo quería lo vintage, lo oscuro, lo que contara algo. Y casi nunca estaba.\n\nEntonces iba donde mi abuela. Ella me ayudaba a hacerlo, o me decía a quién mandarlo a hacer.\n\nEn ese momento no le decía diseño. Era querer ponerme algo que me gustara.',
    gallery: MEDIA.images.esencia,
    connections: ['identidad', 'mapa'],
    theme: 'dark',
  },
  herencia: {
    id: 'herencia',
    title: 'Herencia',
    category: 'herencia',
    subtitle: 'Capítulo 4',
    text: 'Mis abuelas cosían. Un primo de mi bisabuelo hacía monumentos.',
    content: 'Mi abuela materna sacó adelante a su familia con una máquina de coser básica. Mi abuela paterna hacía cobijas para regalar a quien las necesitara.\n\nNinguna de las dos lo llamaba diseño. Para ellas era resolver, o era querer a alguien. Creo que de ahí me quedó la idea de que hacer cosas con las manos siempre es para alguien.\n\nY no eran las únicas. En mi familia hay muchos artistas. El más conocido es Rodrigo Arenas Betancourt, primo de mi bisabuelo materno. Escultor, de los más representativos de Colombia, de los que hacían monumentos. Vivió entre 1919 y 1995.\n\nEn la casa también estaba mi papá. Él me enseñó a jugar ajedrez, y escribe poesía. Lógica y arte en la misma persona, aunque en ese momento yo no lo veía así.\n\nYo crecí oyendo esos nombres como quien oye la historia de otra gente. El arte era cosa de ellos. No mío.',
    gallery: MEDIA.images.herencia,
    backdrop: MEDIA.images.arte[0],
    connections: ['esencia', 'sonido', 'mapa'],
    theme: 'dark',
  },
  sonido: {
    id: 'sonido',
    title: 'Sonido',
    category: 'expresion',
    subtitle: 'Capítulo 5',
    text: 'La música me enseñó que el arte también tiene estructura.',
    content: 'Toco saxofón y he tenido la oportunidad de tocar con la Filarmónica Metropolitana.\n\nUna partitura se parece bastante a un programa: tiene estructura, repeticiones, tiempos exactos y reglas que hay que respetar. Pero si solo sigues las reglas, suena plano. Lo que la hace funcionar es la intención que uno le pone.\n\nEso mismo aplico en lo que hago. En diseño, el ritmo decide si algo se siente bien o no. En la lógica, la estructura es lo que sostiene todo. Y en un videojuego, la música y el tiempo de cada acción son buena parte de lo que uno siente al jugar.\n\nLa orquesta, además, me enseñó a escuchar: a entrar justo cuando me toca y no ir por mi lado. Así también se trabaja en equipo.',
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
    subtitle: 'Capítulo 6 · Ingeniería de sistemas',
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
    subtitle: 'Capítulo 7',
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
    subtitle: 'Capítulo 8',
    text: 'Durante mucho tiempo creí que no era una persona creativa.',
    content: 'En el colegio, en la hoja de vida que los profesores llenaban de cada estudiante, siempre ponían lo mismo sobre mí: poco interés en arte y en educación física. Y yo me lo creí. Pensé que simplemente no era buena para eso.\n\nHoy lo veo distinto. Allá todo era muy cuadriculado. Arte era hacer planas con colores, y educación física era repetir lo que dijera el profesor. No quedaba mucho espacio para descubrir nada.\n\nDespués la vida cambió de golpe. A mi papá le dio un accidente cerebrovascular. Yo vivía lejos de casa, hablando un idioma que todavía me costaba. Hay días en que uno no encuentra las palabras, ni en español ni en el otro idioma.\n\nAhí volví a hacer cosas con las manos, sin nadie calificándome. Y resulta que el arte sí era para mí. Hasta me enamoré de un deporte, el pole, que es puro arte.',
    gallery: MEDIA.images.quiebre,
    connections: ['diseno', 'herencia', 'mapa'],
    theme: 'accent',
  },
  diseno: {
    id: 'diseno',
    title: 'Diseño de Modas',
    category: 'transformacion',
    subtitle: 'Capítulo 9',
    text: 'Volví a hacer cosas con las manos, ahora en serio.',
    content: 'Moodboards, bocetos, telas, patrones, desfiles. Estudiar diseño de modas fue darme permiso de hacer algo que llevaba años rondándome.\n\nMe sorprendió cuánto se parece a programar: uno arranca de una idea vaga, la va aterrizando, prueba, se equivoca, descose y vuelve a empezar.',
    videos: [MEDIA.video.moda, MEDIA.video.moda2, MEDIA.video.moda3, MEDIA.video.moda4, MEDIA.video.moda5],
    gallery: MEDIA.images.diseno,
    connections: ['identidad', 'estructura', 'mapa'],
    theme: 'dark',
  },
  identidad: {
    id: 'identidad',
    title: 'Tatiana Alejandra',
    category: 'esencia',
    subtitle: 'Capítulo 2',
    text: 'Más allá del trabajo y los proyectos.',
    content: 'Este capítulo no tiene proyectos ni entregas.\n\nSon recuerdos, lugares y personas: los momentos que no van en un portafolio pero que también explican por qué hago lo que hago.\n\nY los ratos en que no estoy produciendo nada. Leo bastante y veo mucho anime, del que me llevo más de lo que admito: encuadres, colores, manera de contar. Escucho jazz, metal o clásica, según el día, casi siempre con un café al lado, porque tomo muchísimo. Y me encanta sentarme con un vino o una cerveza sin hacer nada productivo.\n\nDe ahí sale buena parte de lo que después termina en lo que hago.',
    videos: [MEDIA.video.me, MEDIA.video.me2],
    backdrop: MEDIA.images.anexo[0],
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
    subtitle: 'Capítulo 11',
    text: 'Programar algo que además se pueda jugar.',
    content: 'Mundos pequeños hechos en Unity y C#, que se pueden jugar ahí mismo en el navegador, sin descargar nada.\n\nHacer juegos me obliga a pensar en alguien del otro lado: si no entiende qué hacer en los primeros segundos, se va. Eso no se arregla con más código, se arregla probándolo con gente.',
    connections: ['estructura', 'cuerpo', 'diseno', 'mapa'],
    theme: 'paper',
  },
  mixto: {
    id: 'mixto',
    title: 'Bocadillo con queso',
    category: 'mixto',
    subtitle: 'Capítulo 10',
    text: 'No se parecen, pero juntos saben mejor.',
    content: 'Casi todo lo que hago sale de juntar cosas que, en teoría, no tienen nada que ver: la ingeniería con la moda, el código con el dibujo.\n\nDonde más se nota es en el escenario. He montado performances en las que parte de la coreografía ocurre en el pole y, en medio de la pieza, me bajo, tomo el saxofón y sigo contando la historia con la música. El movimiento y el sonido no van por separado: uno lleva al otro.\n\nEs lo mismo que busco cuando hago videojuegos, que es lo que viene en el siguiente capítulo: que la programación y el arte funcionen como una sola cosa.',
    videos: [MEDIA.video.mixto, MEDIA.video.mixto2],
    gallery: MEDIA.images.mixto,
    connections: ['sonido', 'cuerpo', 'mapa'],
    theme: 'dark',
  },
  fin: {
    id: 'fin',
    title: 'Gracias',
    category: 'raiz',
    text: 'Qué bueno que llegaste hasta aquí.',
    content: 'Si quieres hablar de un proyecto o de un juego, escríbeme por donde te quede más fácil.',
    connections: ['mapa', 'inicio'],
    theme: 'dark',
  },
};
