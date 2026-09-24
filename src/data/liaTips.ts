// Pistas de Lía en cada lugar del portafolio. Habla como Navi: un
// llamado corto y una pista concreta sobre algo que sí hay en la página.
export const LIA_TIPS: Record<string, { es: string[]; en: string[] }> = {
  mapa: {
    es: ['¡Hey! Elige cualquier capítulo. No hay un orden correcto.', '¡Mira! El carrete, el papel y el control de arriba te llevan directo a su capítulo.'],
    en: ["Hey! Pick any chapter. There's no right order.", 'Look! The spool, the paper and the controller up top take you straight to their chapter.'],
  },
  tecnico: {
    es: ['¡Hey! Esta es la ruta corta: perfil, proyectos y juegos.', '¡Mira! Con las flechas de arriba pasas a lo siguiente.'],
    en: ['Hey! This is the short route: profile, projects and games.', 'Look! The arrows up top take you to the next one.'],
  },
  esencia: {
    es: ['¡Mira! Las fotos se pueden arrastrar. Muévelas.', '¡Oye! Con las flechas de arriba sigues al próximo capítulo.'],
    en: ['Look! You can drag the photos around.', 'Hey! The arrows up top take you to the next chapter.'],
  },
  identidad: {
    es: ['¡Hey! Dale play a los videos.', '¡Mira! Más abajo está lo que hace Tatiana cuando no está trabajando.'],
    en: ['Hey! Press play on the videos.', 'Look! Further down is what Tatiana does when she is not working.'],
  },
  perfil: {
    es: ['¡Hey! Más abajo puedes descargar el CV de Tatiana.', '¡Escucha! Hay un archivo protegido con más habilidades. ¿Te le mides?'],
    en: ["Hey! Further down you can download Tatiana's résumé.", 'Listen! There is a protected file with more skills. Up for it?'],
  },
  herencia: {
    es: ['¡Mira! Las fotos se pueden mover.', '¡Oye! La última imagen es del escultor de la familia.'],
    en: ['Look! You can move the photos.', "Hey! The last image is about the family's sculptor."],
  },
  sonido: {
    es: ['¡Escucha! Dale play al video y la oyes tocar.', '¡Mira! Mientras suena el video, la música de fondo baja sola.'],
    en: ['Listen! Press play on the video to hear her play.', 'Look! While the video plays, the background music turns down by itself.'],
  },
  estructura: {
    es: ['¡Hey! Cada proyecto tiene su enlace para verlo en línea.', '¡Mira! Toca "Ver todas las pantallas" para ver más de cada proyecto.'],
    en: ['Hey! Every project has a link to see it live.', 'Look! Tap "See all screens" to see more of each project.'],
  },
  cuerpo: {
    es: ['¡Mira! Las fotos están agrupadas por figura.', '¡Hey! Dale play a los videos de pole.'],
    en: ['Look! The photos are grouped by move.', 'Hey! Press play on the pole videos.'],
  },
  mixto: {
    es: ['¡Hey! En estos videos el pole y el saxofón van en la misma coreografía.'],
    en: ['Hey! In these videos, pole and sax share the same choreography.'],
  },
  quiebre: {
    es: ['Este es de los capítulos más personales. Léelo con calma.'],
    en: ['This is one of the most personal chapters. Take your time.'],
  },
  diseno: {
    es: ['¡Mira! Aquí están sus desfiles y bocetos.', '¡Hey! Dale play a los videos de las pasarelas.'],
    en: ['Look! Here are her runway shows and sketches.', 'Hey! Press play on the runway videos.'],
  },
  juego: {
    es: ['¡Hey! ¡Escucha! Estos juegos se juegan aquí mismo, sin descargar nada.', '¡Mira! Si te gusta alguno, en itch.io hay más.'],
    en: ['Hey! Listen! These games run right here, no download needed.', 'Look! If you like one, there are more on itch.io.'],
  },
  fin: {
    es: ['¡Hey! Aquí están todas las formas de escribirle a Tatiana.', '¡Oye! Si le escribes, te responde ella, no yo.'],
    en: ['Hey! Here are all the ways to reach Tatiana.', "Hey! If you write to her, she answers, not me."],
  },
};
