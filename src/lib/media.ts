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
    moda: '/media/video/moda-01.mp4',
    moda2: '/media/video/moda-02.mp4',
    moda3: '/media/video/moda-03.mp4',
    moda4: '/media/video/moda-04.mp4',
    moda5: '/media/video/moda-05.mp4',
    mixto: '/media/video/mixto-01.mp4',
  },
  images: {
    esencia: [
      '/media/images/esencia-1.png',
      '/media/images/esencia-2.png',
      '/media/images/esencia-3.png',
    ],
    quiebre: ['/media/images/quiebre-1.png'],
    herencia: ['/media/images/herencia-1.png'],
    arte: ['/media/images/arte-familia-1.png'],
    musica: [
      '/media/images/musica-01.jpg',
      '/media/images/musica-02.jpg',
      '/media/images/musica-03.jpg',
    ],
    diseno: [
      '/media/images/figurin-1.png',
      '/media/images/figurin-2.jpeg',
      '/media/images/figurin-3.jpeg',
      '/media/images/figurin-4.jpeg',
      '/media/images/figurin-5.png',
      '/media/images/ropero-1.jpeg',
      '/media/images/ropero-2.jpeg',
      '/media/images/ropero-3.jpeg',
      '/media/images/ropero-4.jpeg',
    ],
  },
  audio: {
    background: '/media/audio/love like you.mp3',
  },
} as const;

export type MediaPaths = typeof MEDIA;
