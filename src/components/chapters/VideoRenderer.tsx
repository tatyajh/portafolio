"use client";

import { motion } from 'framer-motion';

// VIDEO RENDERER - Tamaños específicos por nodo
export default function VideoRenderer({ nodeId, videos }: { nodeId: string; videos: readonly string[] }) {
  // SONIDO: video grande (filarmónica)
  if (nodeId === 'sonido') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10"
      >
        <div className="overflow-hidden bg-black border border-burgundy/30 max-w-[95%] mx-auto">
          <video
            src={videos[0]}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
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
          <div key={i} className="flex flex-col gap-2">
            <div className="overflow-hidden bg-black border border-burgundy/30 w-full">
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
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
        {/* me-01 grande */}
        {videos[0] && (
          <div className="overflow-hidden bg-black border border-burgundy/30 w-full">
            <video
              src={videos[0]}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        )}
        {/* me-02 tal cual */}
        {videos[1] && (
          <div className="overflow-hidden bg-black border border-burgundy/30 max-w-[100%] sm:max-w-[320px]">
            <video
              src={videos[1]}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-auto max-h-[60vh] object-contain"
            />
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
        <div key={i} className="overflow-hidden bg-black border border-burgundy/30 max-w-[100%] sm:max-w-[320px]">
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-auto max-h-[60vh] object-contain"
          />
        </div>
      ))}
    </motion.div>
  );
}
