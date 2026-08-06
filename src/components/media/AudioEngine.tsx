"use client";

import { motion } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';

// Múltiples canciones para loop
// Para agregar más canciones, colócalas en /public/audio/ y añádelas aquí
const PLAYLIST = [
  '/media/audio/love like you.mp3',
  '/media/audio/red swan.mp3',
  '/media/audio/porco.mp3',
  '/media/audio/maritza.mp3',
];

// Inicio aleatorio
const INITIAL_TRACK = Math.floor(Math.random() * PLAYLIST.length);

/**
 * AudioEngine - Motor de audio para el portafolio
 * Maneja la pantalla de inicio, audio de fondo y control de video
 */
export default function AudioEngine() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(INITIAL_TRACK);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Cambiar a la siguiente canción
  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  // Intentar autoplay al montar (pantalla de inicio)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3;
      audio.src = PLAYLIST[INITIAL_TRACK];
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setAutoplayBlocked(true);
      });
    }
  }, []);

  // Manejar fin de canción
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => {
        nextTrack();
      };
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [nextTrack]);

  // Reproducir cuando cambia la canción (skip initial mount handled by autoplay effect)
  const hasStartedRef = useRef(false);
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      return;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.src = PLAYLIST[currentTrack];
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [currentTrack]);

  const handleFirstInteraction = () => {
    setHasInteracted(true);
    // Si autoplay fue bloqueado, iniciar música ahora
    if (autoplayBlocked && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.src = PLAYLIST[currentTrack];
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setAutoplayBlocked(false);
      }).catch(() => {});
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

  // Volver a mostrar el splash cuando la navegación pide "Home"
  // (hasInteracted no tiene otra forma de resetearse una vez es true).
  // El audio de fondo sigue sonando igual, solo vuelve el overlay.
  useEffect(() => {
    const handleReturnToSplash = () => setHasInteracted(false);
    window.addEventListener('returnToSplash', handleReturnToSplash);
    return () => window.removeEventListener('returnToSplash', handleReturnToSplash);
  }, []);

  return (
    <>
      {/* Audio de fondo - sin loop para permitir playlist */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* Pantalla de inicio - Estética oro-rosa con borgoña y formas */}
      {!hasInteracted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden"
          style={{ background: 'radial-gradient(ellipse at center, #1a1512 0%, #0a0808 100%)' }}
          onClick={handleFirstInteraction}
        >
          {/* Fondo tipo constelación/aurora boreal con hilos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Aurora boreal - colores verdes, azules, rosas */}
            {/* Capa verde tipo aurora */}
            <motion.div
              animate={{ 
                x: ['-30%', '110%'],
                opacity: [0.15, 0.35, 0.15],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[15%] -left-[40%] w-[90vw] h-[50vh]"
              style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(57,255,20,0.25), rgba(0,255,65,0.3), rgba(0,217,255,0.2), transparent)',
                filter: 'blur(50px)',
                transform: 'rotate(-8deg)'
              }}
            />
            {/* Capa azul */}
            <motion.div
              animate={{ 
                x: ['110%', '-30%'],
                opacity: [0.12, 0.3, 0.12],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              className="absolute top-[40%] -left-[20%] w-[85vw] h-[45vh]"
              style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(0,153,255,0.25), rgba(0,217,255,0.3), rgba(57,255,20,0.2), transparent)',
                filter: 'blur(45px)',
                transform: 'rotate(5deg)'
              }}
            />
            {/* Capa rosa/magenta */}
            <motion.div
              animate={{ 
                x: ['-20%', '120%'],
                opacity: [0.1, 0.25, 0.1],
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 6 }}
              className="absolute top-[60%] -left-[50%] w-[95vw] h-[40vh]"
              style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(255,20,147,0.2), rgba(255,105,180,0.25), rgba(0,217,255,0.15), transparent)',
                filter: 'blur(55px)',
                transform: 'rotate(-3deg)'
              }}
            />
            {/* Capa verde inferior */}
            <motion.div
              animate={{ 
                y: ['120%', '-10%'],
                opacity: [0.08, 0.2, 0.08],
              }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 8 }}
              className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[55vh]"
              style={{ 
                background: 'radial-gradient(ellipse, rgba(0,255,65,0.2), rgba(57,255,20,0.15), transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
            {/* Capa azul/rosa mezclada */}
            <motion.div
              animate={{ 
                y: ['-20%', '100%'],
                opacity: [0.1, 0.22, 0.1],
              }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 12 }}
              className="absolute -top-[15%] right-[10%] w-[50vw] h-[50vh]"
              style={{ 
                background: 'radial-gradient(ellipse, rgba(0,217,255,0.2), rgba(255,105,180,0.15), transparent 70%)',
                filter: 'blur(45px)',
              }}
            />

            {/* Hilos sutiles cruzando */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`hilo-${i}`}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ 
                  opacity: [0.05, 0.12, 0.05],
                }}
                transition={{ 
                  duration: 4 + i * 0.8, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.4
                }}
                className="absolute h-[1px]"
                style={{ 
                  top: `${8 + i * 8}%`,
                  left: 0,
                  width: '100%',
                  background: `linear-gradient(90deg, transparent, ${['#E8C9A0', '#8B0000', '#C4874A', '#D4A574'][i % 4]}40, transparent)`,
                  transform: `rotate(${-2 + (i % 3)}deg)`,
                }}
              />
            ))}

            {/* Constelación de puntos luminosos */}
            {[...Array(40)].map((_, i) => {
              const x = 10 + (i * 37) % 80;
              const y = 5 + (i * 23) % 90;
              return (
                <motion.div
                  key={`estrella-${i}`}
                  animate={{ 
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{ 
                    duration: 2 + (i % 4), 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.15
                  }}
                  className="absolute rounded-full"
                  style={{ 
                    width: i % 3 === 0 ? '3px' : '2px',
                    height: i % 3 === 0 ? '3px' : '2px',
                    left: `${x}%`,
                    top: `${y}%`,
                    background: ['#E8C9A0', '#f5f0e6', '#C4874A'][i % 3],
                    boxShadow: `0 0 ${i % 5 === 0 ? '8px' : '4px'} ${['#E8C9A0', '#C4874A', '#f5f0e6'][i % 3]}40`,
                  }}
                />
              );
            })}

            {/* Hilos que conectan algunos puntos (constelación) */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
              {[...Array(8)].map((_, i) => (
                <motion.line
                  key={`conexion-${i}`}
                  x1={`${15 + (i * 11) % 70}%`}
                  y1={`${10 + (i * 13) % 80}%`}
                  x2={`${25 + (i * 17) % 60}%`}
                  y2={`${20 + (i * 19) % 60}%`}
                  stroke="#E8C9A0"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 0], opacity: [0, 0.3, 0] }}
                  transition={{ 
                    duration: 8 + i * 2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 1.5
                  }}
                />
              ))}
            </svg>

            {/* Círculos difusos de fondo */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] left-[10%] w-[50vh] h-[50vh] rounded-full"
              style={{ 
                background: 'radial-gradient(circle, #8B0000 0%, transparent 70%)',
                filter: 'blur(80px)'
              }}
            />
            <motion.div
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
              className="absolute bottom-[15%] right-[15%] w-[40vh] h-[40vh] rounded-full"
              style={{ 
                background: 'radial-gradient(circle, #E8C9A0 0%, transparent 70%)',
                filter: 'blur(70px)'
              }}
            />
          </div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-[#8B0000] text-xs sm:text-sm uppercase tracking-[0.4em] mb-4 font-light"
            >
              Tatiana Alejandra Jaramillo
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 text-[#f5f0e6] leading-none tracking-tight uppercase"
            >
              Portafolio
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-script text-2xl sm:text-3xl text-[#D4A574]/90 -rotate-1 mb-6"
            >
              hilos invisibles
            </motion.p>

            {/* Línea decorativa inferior - borgoña */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
              className="w-16 h-px bg-[#8B0000]/60 mx-auto mb-8"
            />

            {/* Botones de navegación */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setHasInteracted(true);
                  // Atajo directo a las secciones técnicas
                  window.dispatchEvent(new CustomEvent('navigateTo', { detail: { target: 'tecnico' } }));
                }}
                className="px-8 py-4 border border-[#8B0000]/60 text-[#D4A574] text-sm sm:text-base uppercase tracking-wider font-medium transition-all hover:bg-[#8B0000]/15 hover:border-[#8B0000] min-w-[200px]"
              >
                {'</>'} Directo a lo técnico
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setHasInteracted(true);
                  // Emitir evento personalizado para explorar
                  window.dispatchEvent(new CustomEvent('navigateTo', { detail: { target: 'explore' } }));
                }}
                className="px-8 py-4 border border-[#E8C9A0]/50 text-[#E8C9A0] text-sm sm:text-base uppercase tracking-wider font-medium transition-all hover:bg-[#E8C9A0]/10 hover:border-[#E8C9A0] min-w-[200px]"
              >
                ✥ Conoce más sobre mí
              </motion.button>
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
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-12 h-12 rounded-full border border-[#E8C9A0]/50 bg-[#0a0808]/80 backdrop-blur-sm flex items-center justify-center transition-all hover:border-[#E8C9A0]"
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
