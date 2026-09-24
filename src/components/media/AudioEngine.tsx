"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PixelCompanion from './PixelCompanion';
import ThreadProgress from './ThreadProgress';
import { useLanguage } from '@/context/LanguageContext';
import { selectCopy } from '@/data/translations';

// Las herramientas y el título se cargan con la portada; funcionan también con movimiento reducido.
const SplashPlayground = dynamic(() => import('./SplashPlayground'), { ssr: false });
const SplashTitle = dynamic(() => import('./SplashTitle'), { ssr: false });

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

// Volumen de fondo más suave — antes 0.3 sonaba muy fuerte sobre el
// resto del sitio. La rebaja al reproducir un video usa la misma
// proporción de antes (un tercio del volumen normal).
const MUSIC_VOLUME = 0.15;
const MUSIC_VOLUME_DUCKED = 0.05;

interface AudioEngineProps {
  // Nodo con el que arrancó esta carga de página (ver
  // PortfolioExperience). Si no es "inicio" significa que se entró por
  // un deep link directo (ej. /tecnico) y el splash de bienvenida no
  // debe reproducirse — solo tiene sentido para quien aterriza en "/".
  initialNode?: string;
}

/**
 * AudioEngine - Motor de audio para el portafolio
 * Maneja la pantalla de inicio, audio de fondo y control de video
 */
export default function AudioEngine({ initialNode = 'inicio' }: AudioEngineProps) {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  // Arranca ya "interactuado" (sin splash) cuando la carga inicial de
  // la página fue un deep link a un nodo distinto de "inicio". Al
  // volver a "inicio" desde dentro de la app, goHome() sigue
  // reactivando el splash vía el evento returnToSplash (ver abajo),
  // así que esto solo afecta la primera carga.
  const [hasInteracted, setHasInteracted] = useState(initialNode !== 'inicio');
  const [hasCutTitle, setHasCutTitle] = useState(false);
  const [hasStitched, setHasStitched] = useState(false);
  // Las rutas se abren cuando se corta y se cose el título.
  const unlocked = hasCutTitle && hasStitched;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(INITIAL_TRACK);
  const audioRef = useRef<HTMLAudioElement>(null);
  const unlockAfterCut = useCallback(() => setHasCutTitle(true), []);
  const unlockAfterStitch = useCallback(() => setHasStitched(true), []);

  // Cambiar a la siguiente canción
  const nextTrack = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % PLAYLIST.length);
  }, []);

  // La música ya no arranca en el splash: solo se prepara la pista,
  // sin reproducirla. Empieza recién cuando se entra a un nodo (ver
  // handleFirstInteraction), para que la pantalla de inicio quede en
  // silencio.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = MUSIC_VOLUME;
      audio.src = PLAYLIST[INITIAL_TRACK];
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

  // La música arranca recién acá, al entrar a un nodo real — no en el
  // splash. Los navegadores solo dejan reproducir audio tras una
  // interacción real, y hacer clic en uno de los botones de entrada
  // cuenta como tal.
  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio || isPlaying) return;
    audio.volume = MUSIC_VOLUME;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const handleFirstInteraction = () => {
    setHasInteracted(true);
    startMusic();
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
        audioRef.current.volume = MUSIC_VOLUME_DUCKED;
      }
    };

    // Función para restaurar volumen
    const restoreVolume = () => {
      if (audioRef.current) {
        audioRef.current.volume = MUSIC_VOLUME;
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

  // El saxofón de la portada enciende la música: tocarlo la alterna y
  // arrastrarlo la arranca. Cuenta como interacción, así que el
  // navegador permite reproducir.
  useEffect(() => {
    const onSax = (event: Event) => {
      const audio = audioRef.current;
      if (!audio) return;
      const action = (event as CustomEvent<'toggle' | 'start'>).detail;
      if (audio.paused) {
        audio.volume = MUSIC_VOLUME;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      } else if (action === 'toggle') {
        audio.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('splash-music', onSax);
    return () => window.removeEventListener('splash-music', onSax);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('splash-music-state', { detail: isPlaying }));
  }, [isPlaying]);

  // Tocar el control de la portada es como darle a Press start, pero
  // solo cuando ya se cortó y se cosió el título.
  useEffect(() => {
    if (!unlocked) return;
    const onPress = () => {
      setHasInteracted(true);
      const audio = audioRef.current;
      if (audio?.paused) {
        audio.volume = MUSIC_VOLUME;
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      window.dispatchEvent(new CustomEvent('navigateTo', { detail: { target: 'explore' } }));
    };
    window.addEventListener('splash-press-start', onPress);
    return () => window.removeEventListener('splash-press-start', onPress);
  }, [unlocked]);

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

      {/* Portada: la ilustración es el mundo; los botones y Lía son la capa de juego. */}
      {!hasInteracted && (
        // El splash solo se cierra con los botones: el resto de la
        // pantalla queda libre para jugar con los recortes. La música
        // arranca al entrar a un nodo real, no aquí.
        <div className="splash-screen fixed inset-0 z-50">
          <div className="splash-stage">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 1 }}
              className="splash-content"
            >
              <p className="splash-name">Tatiana Alejandra Jaramillo Hoyos</p>

              {/* El corte y la costura funcionan con arrastre, toque y teclado. */}
              <SplashTitle key={locale} title={selectCopy(locale, 'Portafolio', 'Portfolio')} onFirstCut={unlockAfterCut} onFirstStitch={unlockAfterStitch} />

              <p className="splash-script font-script">{selectCopy(locale, 'hilos invisibles', 'invisible threads')}</p>
              <p className="splash-roles">
                {locale === 'en'
                  ? <>I code, <b>design</b> and make <b>video games</b>.</>
                  : <>Programo, <b>diseño</b> y hago <b>videojuegos</b>.</>}
              </p>

              {/* Las rutas se abren al cortar y coser el título. */}
              <div className="splash-routes">
                <button
                  type="button"
                  disabled={!unlocked}
                  className="pixel-button"
                  onClick={() => {
                    handleFirstInteraction();
                    window.dispatchEvent(new CustomEvent('navigateTo', { detail: { target: 'explore' } }));
                  }}
                >
                  <span className="pixel-button-arrow" aria-hidden="true">▶</span>
                  {selectCopy(locale, 'Press start', 'Press start')}
                </button>
                <button
                  type="button"
                  disabled={!unlocked}
                  className="pixel-button pixel-button--paper"
                  onClick={() => {
                    handleFirstInteraction();
                    window.dispatchEvent(new CustomEvent('navigateTo', { detail: { target: 'tecnico' } }));
                  }}
                >
                  {'</>'} {selectCopy(locale, 'Modo técnico', 'Tech mode')}
                </button>
              </div>
            </motion.div>

            <SplashPlayground />
          </div>

          <PixelCompanion
            unlocked={unlocked}
            cut={hasCutTitle}
            fallbackAvailable
            onFallbackCut={() => window.dispatchEvent(new CustomEvent('splash-cut-action'))}
            onFallbackStitch={() => window.dispatchEvent(new CustomEvent('splash-stitch-action'))}
          />
        </div>
      )}

      <ThreadProgress />

      {hasInteracted && <PixelCompanion unlocked exploring />}

      {/* Botón de control de audio */}
      {hasInteracted && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAudio}
          className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40 w-12 h-12 rounded-full border border-gold/50 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all hover:border-gold"
          aria-label={isPlaying
            ? selectCopy(locale, 'Pausar música', 'Pause music')
            : selectCopy(locale, 'Reproducir música', 'Play music')}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="2">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      )}
    </>
  );
}
