"use client";

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { MEDIA } from '@/lib/media';

/**
 * AudioEngine - Motor de audio para el portafolio
 * Maneja la pantalla de inicio, audio de fondo y control de video
 */
export default function AudioEngine() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFirstInteraction = () => {
    setHasInteracted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Exponer funciones para controlar el audio desde otros componentes
  useEffect(() => {
    // Función para bajar volumen cuando se reproduce un video
    const lowerVolume = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.1;
      }
    };

    // Función para restaurar volumen
    const restoreVolume = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
      }
    };

    // Hacer funciones disponibles globalmente
    (window as unknown as { lowerBackgroundVolume?: () => void; restoreBackgroundVolume?: () => void }).lowerBackgroundVolume = lowerVolume;
    (window as unknown as { lowerBackgroundVolume?: () => void; restoreBackgroundVolume?: () => void }).restoreBackgroundVolume = restoreVolume;

    return () => {
      delete (window as unknown as { lowerBackgroundVolume?: () => void; restoreBackgroundVolume?: () => void }).lowerBackgroundVolume;
      delete (window as unknown as { lowerBackgroundVolume?: () => void; restoreBackgroundVolume?: () => void }).restoreBackgroundVolume;
    };
  }, []);

  return (
    <>
      {/* Audio de fondo */}
      <audio
        ref={audioRef}
        src={MEDIA.audio.background}
        loop
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Pantalla de inicio - Estética oro-rosa con borgoña */}
      {!hasInteracted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          style={{ background: 'radial-gradient(ellipse at center, #1a1512 0%, #0a0808 100%)' }}
          onClick={handleFirstInteraction}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            {/* Línea decorativa superior - oro-rosa */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
              className="w-32 h-px bg-gradient-to-r from-transparent via-[#E8C9A0] to-transparent mx-auto mb-10"
            />

            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.2em' }}
              animate={{ opacity: 1, letterSpacing: '0.5em' }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="text-[#E8C9A0] text-sm sm:text-base uppercase mb-6 font-light tracking-widest"
            >
              Portafolio
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
              className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 text-[#f5f0e6] leading-none tracking-tight"
            >
              Hilos
              <br />
              <span className="text-[#8B0000]">Invisibles</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="font-serif text-xl sm:text-2xl md:text-3xl text-[#E8C9A0]/70 italic mb-16"
            >
              Lo que se hereda
            </motion.p>

            {/* Línea decorativa inferior - borgoña */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 1, ease: "easeOut" }}
              className="w-16 h-px bg-[#8B0000]/60 mx-auto mb-8"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <motion.p
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-[#E8C9A0]/50 text-xs sm:text-sm tracking-[0.2em] uppercase"
              >
                Click para explorar
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* Botón de control de audio */}
      {hasInteracted && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full border border-[#E8C9A0]/50 bg-[#0a0808]/80 backdrop-blur-sm flex items-center justify-center transition-all hover:border-[#E8C9A0]"
          aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8C9A0" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8C9A0" strokeWidth="2">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      )}
    </>
  );
}
