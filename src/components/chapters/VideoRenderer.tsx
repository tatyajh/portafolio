"use client";

import { motion } from 'framer-motion';
import GothicCorner from './GothicCorner';

// Los videos van mudos en loop por defecto (autoplay con sonido lo
// bloquea el navegador) — el marco de papel es el mismo lenguaje
// visual que las fotos. Si la persona le sube el volumen con los
// controles nativos del video, la música de fondo se agacha para que
// se oiga; al bajarlo o pausar, la música vuelve a su volumen normal.
function duckBackgroundMusic() {
  (window as unknown as { lowerBackgroundVolume?: () => void }).lowerBackgroundVolume?.();
}
function restoreBackgroundMusic() {
  (window as unknown as { restoreBackgroundVolume?: () => void }).restoreBackgroundVolume?.();
}

export function FramedVideo({ src, maxHeight = '60vh' }: { src: string; maxHeight?: string }) {
  return (
    <div className="paper-card gothic-frame relative p-1 sm:p-1.5">
      <div className="overflow-hidden rounded-[6px] bg-black">
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          controls
          onVolumeChange={e => (e.currentTarget.muted ? restoreBackgroundMusic() : duckBackgroundMusic())}
          onPause={restoreBackgroundMusic}
          onEnded={restoreBackgroundMusic}
          className="w-full h-auto object-contain"
          style={{ maxHeight }}
        />
      </div>
      <GothicCorner className="-top-[7px] -left-[7px]" />
      <GothicCorner className="-top-[7px] -right-[7px] rotate-90" />
      <GothicCorner className="-bottom-[7px] -right-[7px] rotate-180" />
      <GothicCorner className="-bottom-[7px] -left-[7px] -rotate-90" />
    </div>
  );
}

// VIDEO RENDERER - Tamaños específicos por nodo
export default function VideoRenderer({ nodeId, videos }: { nodeId: string; videos: readonly string[] }) {
  // SONIDO: video grande (filarmónica)
  if (nodeId === 'sonido') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10 max-w-[95%] mx-auto"
      >
        <FramedVideo src={videos[0]} maxHeight="80vh" />
      </motion.div>
    );
  }

  // DISEÑO: solo videos 1-3 (videos 4-5 se renderizan aparte después de la galería)
  if (nodeId === 'diseno') {
    const firstVideos = videos.slice(0, 3);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10 flex flex-col gap-4"
      >
        {firstVideos.map((src, i) => (
          <FramedVideo key={i} src={src} maxHeight="70vh" />
        ))}
      </motion.div>
    );
  }

  // IDENTIDAD: me-01 grande, me-02 más pequeño
  if (nodeId === 'identidad') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10 flex flex-col gap-4 items-center"
      >
        {videos[0] && <FramedVideo src={videos[0]} maxHeight="80vh" />}
        {videos[1] && (
          <div className="w-full sm:max-w-[320px]">
            <FramedVideo src={videos[1]} maxHeight="60vh" />
          </div>
        )}
      </motion.div>
    );
  }

  // Por defecto: layout estándar
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mb-10 flex flex-row flex-wrap justify-center gap-3"
    >
      {videos.map((src, i) => (
        <div key={i} className="w-full sm:max-w-[320px]">
          <FramedVideo src={src} maxHeight="60vh" />
        </div>
      ))}
    </motion.div>
  );
}
