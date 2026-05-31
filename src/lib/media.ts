/**
 * Media paths configuration - Estructura tipo streaming
 *
 * ESTRUCTURA EN /public/media/:
 * /public/media
 *   /video
 *     musica-01.mp4, me-01.mp4, moda-01.mp4, moda-02.mp4, mixto-01.mp4
 *   /images
 *     figurin-1.png, herencia-1.png
 *     musica-01.jpg, musica-02.jpg, musica-03.jpg
 *   /audio
 *     love like you.mp3
 */

export const MEDIA = {
  video: {
    musica: '/media/video/musica-01.mp4',
    me: '/media/video/me-01.mp4',
    me2: '/media/video/me-2.mp4',
    pole: '/media/video/pole-1.mp4',
    pole2: '/media/video/pole-2.mp4',
    moda: '/media/video/moda-01.mp4',
    moda2: '/media/video/moda-02.mp4',
    moda3: '/media/video/moda-03.mp4',
    moda4: '/media/video/moda-04.mp4',
    moda5: '/media/video/moda-05.mp4',
    mixto: '/media/video/mixto-01.mp4',
    mixto2: '/media/video/mixto-02.mp4',
  },
  images: {
    esencia: [
      '/media/images/esencia-1.png',
      '/media/images/esencia-2.png',
      '/media/images/esencia-3.png',
      '/media/images/esencia-4.jpeg',
    ],
    perfil: [
      '/media/images/perfil-1.jpeg',
      '/media/images/perfil-2.jpeg',
      '/media/images/perfil-3.jpeg',
    ],
    anexo: ['/media/images/anexo-1.png'],
    quiebre: ['/media/images/quiebre-1.png'],
    herencia: [
      '/media/images/herencia-1.png',
      '/media/images/herencia-2.jpeg',
      '/media/images/herencia-3.jpeg',
      '/media/images/herencia-4.jpeg',
    ],
    arte: ['/media/images/arte-familia-1.png'],
    musica: [
      '/media/images/musica-01.jpg',
      '/media/images/musica-02.jpg',
      '/media/images/musica-03.jpg',
      '/media/images/musica-04.jpeg',
      '/media/images/musica-05.jpeg',
      '/media/images/musica-06.jpeg',
      '/media/images/musica-07.png',
      '/media/images/musica-08.jpeg',
      '/media/images/musica-09.jpeg',
      '/media/images/musica-10.jpeg',
    ],
    pole: [
      '/media/images/pole-1.jpeg',
      '/media/images/pole-2.jpeg',
      '/media/images/pole-3.jpeg',
      '/media/images/pole-5.jpeg',
      '/media/images/pole-6.jpeg',
      '/media/images/pole-7.jpeg',
      '/media/images/pole-8.jpeg',
      '/media/images/pole-9.jpeg',
      '/media/images/pole-10.jpeg',
      '/media/images/pole-11.jpeg',
      '/media/images/pole-12.jpeg',
    ],
    mixto: ['/media/images/mixto-1.jpeg'],
    diseno: [
      '/media/images/figurin-1.png',
      '/media/images/figurin-2.png',
      '/media/images/figurin-3.png',
      '/media/images/figurin-4.png',
      '/media/images/figurin-5.png',
      '/media/images/figurin-6.jpeg',
    ],
  },
  audio: {
    background: '/media/audio/love like you.mp3',
  },
} as const;

export type MediaPaths = typeof MEDIA;
