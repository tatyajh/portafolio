/**
 * Media paths configuration - Estructura tipo streaming
 * 
 * ESTRUCTURA EN /public/media/:
 * /public/media
 *   /video
 *     musica-01.mp4, pole-01.mp4, mixto-01.mp4
 *   /images
 *     origen-01.jpg, herencia-01.jpg, arte-01.jpg
 *     musica-01.jpg, musica-02.jpg, musica-03.jpg
 *     pole-01.jpg, ingenieria-01.jpg, diseno-01.jpg
 *   /audio
 *     ambient.mp3, saxo-loop.mp3
 */

export const MEDIA = {
  video: {
    musica: '/media/video/musica-01.mp4',
    mixto: '/media/video/mixto-01.mp4',
  },
  images: {
    origen: ['/media/images/origen-01.jpg'],
    herencia: ['/media/images/herencia-01.jpg'],
    arte: ['/media/images/arte-01.jpg'],
    musica: [
      '/media/images/musica-01.jpg',
      '/media/images/musica-02.jpg',
      '/media/images/musica-03.jpg',
    ],
    ingenieria: ['/media/images/ingenieria-01.jpg'],
    pole: ['/media/images/pole-01.jpg'],
    diseno: ['/media/images/diseno-01.jpg'],
  },
  audio: {
    ambient: '/media/audio/ambient.mp3',
    saxo: '/media/audio/saxo-loop.mp3',
  },
} as const;

export type MediaPaths = typeof MEDIA;
