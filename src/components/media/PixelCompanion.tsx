"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

const LOCKED_MESSAGES = [
  'Corta el portafolio: arrastra unas tijeras sobre la palabra PORTAFOLIO del centro.',
  'Pasa el filo por cualquiera de las letras grandes de PORTAFOLIO.',
  'Cuando cortes PORTAFOLIO, se desbloquearán las dos rutas.',
];

const UNLOCKED_MESSAGES = [
  '¡Misión cumplida! Ya puedes elegir tu ruta.',
  'Buen corte. El portafolio ya está abierto.',
  'Explora: cada sección es una misión diferente.',
];

const EXPLORING_MESSAGES = [
  'Puedes arrastrarme y dejarme donde quieras mientras exploras.',
  'La sección Videojuegos reúne mis proyectos hechos en Unity y C#.',
  'Si quieres cambiar de capítulo, usa las flechas o vuelve al mapa.',
];

const ENGLISH_MESSAGES = {
  locked: [
    'Cut the portfolio: drag a pair of scissors across the word PORTFOLIO in the center.',
    'Move the blade across any of the large letters in PORTFOLIO.',
    'Once you cut PORTFOLIO, both routes will unlock.',
  ],
  unlocked: [
    'Mission complete! You can now choose your route.',
    'Nice cut. The portfolio is now open.',
    'Explore: every section is a different mission.',
  ],
  exploring: [
    'You can drag me and leave me anywhere while you explore.',
    'The Video Games section brings together my projects made with Unity and C#.',
    'To change chapters, use the arrows or return to the map.',
  ],
};

const POSES = [
  '/media/avatar/pix-guide.png',
  '/media/avatar/pix-thinking.png',
  '/media/avatar/pix-victory.png',
];

interface LiaDragState {
  pointerId: number;
  pointerX: number;
  pointerY: number;
  motionX: number;
  motionY: number;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

interface PixelCompanionProps {
  unlocked: boolean;
  exploring?: boolean;
  fallbackAvailable?: boolean;
  onFallbackCut?: () => void;
}

/** Lía acompaña la entrada y da pequeñas pistas al conversar. */
export default function PixelCompanion({
  unlocked,
  exploring = false,
  fallbackAvailable = false,
  onFallbackCut,
}: PixelCompanionProps) {
  const { locale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [poseIndex, setPoseIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const boundsRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const previousUnlocked = useRef(unlocked);
  const previousExploring = useRef(exploring);
  const wasDraggingRef = useRef(false);
  const dragStateRef = useRef<LiaDragState | null>(null);
  const liaX = useMotionValue(0);
  const liaY = useMotionValue(0);

  useEffect(() => {
    if (!previousUnlocked.current && unlocked) {
      setMessageIndex(0);
      setPoseIndex(2);
      setShowMessage(true);
    }
    previousUnlocked.current = unlocked;
  }, [unlocked]);

  useEffect(() => {
    if (!previousExploring.current && exploring) {
      setMessageIndex(0);
      setPoseIndex(1);
      setShowMessage(false);
    }
    previousExploring.current = exploring;
  }, [exploring]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let frame = 0;
    const followPointer = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = guideRef.current;
        if (!el) return;
        const x = (event.clientX / window.innerWidth - 0.5) * 7;
        const y = (event.clientY / window.innerHeight - 0.5) * 5;
        const tilt = (event.clientX / window.innerWidth - 0.5) * 3;
        el.style.setProperty('--lia-look-x', `${x}px`);
        el.style.setProperty('--lia-look-y', `${y}px`);
        el.style.setProperty('--lia-look-tilt', `${tilt}deg`);
      });
    };

    window.addEventListener('pointermove', followPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', followPointer);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !exploring || isDragging) return;

    const poseTimer = window.setInterval(() => {
      setPoseIndex(index => (index + 1) % POSES.length);
    }, 2600);

    return () => window.clearInterval(poseTimer);
  }, [exploring, isDragging, prefersReducedMotion]);

  const messages = locale === 'en'
    ? exploring
      ? ENGLISH_MESSAGES.exploring
      : unlocked
        ? ENGLISH_MESSAGES.unlocked
        : ENGLISH_MESSAGES.locked
    : exploring
      ? EXPLORING_MESSAGES
      : unlocked
        ? UNLOCKED_MESSAGES
        : LOCKED_MESSAGES;

  const talk = () => {
    if (!showMessage) {
      setShowMessage(true);
      return;
    }
    setMessageIndex(index => (index + 1) % messages.length);
    setPoseIndex(index => exploring
      ? (index === 0 ? 1 : 0)
      : unlocked
        ? (index === 2 ? 1 : 2)
        : (index === 0 ? 1 : 0));
    setShowMessage(true);
  };

  const beginDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const companion = guideRef.current;
    if (!companion) return;

    // La portada escucha el puntero globalmente para mover tijeras y
    // agujas. Detener el evento aquí le da prioridad a Lía cuando la
    // persona la toma directamente, evitando que ambos sistemas
    // intenten controlar el mismo gesto.
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    const rect = companion.getBoundingClientRect();
    dragStateRef.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      motionX: liaX.get(),
      motionY: liaY.get(),
      bounds: {
        minX: -rect.left,
        maxX: window.innerWidth - rect.right,
        minY: -rect.top,
        maxY: window.innerHeight - rect.bottom,
      },
    };
    wasDraggingRef.current = false;
    setIsDragging(true);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    const dx = event.clientX - dragState.pointerX;
    const dy = event.clientY - dragState.pointerY;
    if (Math.hypot(dx, dy) > 4) wasDraggingRef.current = true;

    liaX.set(dragState.motionX + Math.min(Math.max(dx, dragState.bounds.minX), dragState.bounds.maxX));
    liaY.set(dragState.motionY + Math.min(Math.max(dy, dragState.bounds.minY), dragState.bounds.maxY));
  };

  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
    window.setTimeout(() => { wasDraggingRef.current = false; }, 100);
  };

  return (
    <div ref={boundsRef} className="lia-companion-layer">
      <motion.div
        ref={guideRef}
        style={{ x: liaX, y: liaY }}
        className={`pixel-companion ${unlocked ? 'is-unlocked' : ''} ${exploring ? 'is-exploring' : ''} ${isDragging ? 'is-dragging' : ''}`}
        data-lia-companion
      >
      <AnimatePresence mode="wait">
        {showMessage && (
          <motion.div
            key={`${unlocked}-${messageIndex}`}
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            className="pixel-companion-message"
            role="status"
          >
            <button
              type="button"
              onClick={() => setShowMessage(false)}
              aria-label={locale === 'en' ? 'Close Lía message' : 'Cerrar mensaje de Lía'}
              className="pixel-companion-close"
            >
              ×
            </button>
            <span>LÍA</span>
            <p>{messages[messageIndex]}</p>
            {fallbackAvailable && !unlocked && (
              <button type="button" onClick={onFallbackCut} className="pixel-cut-action">
                {locale === 'en' ? '✂ Cut the thread' : '✂ Cortar el hilo'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={() => {
          if (!wasDraggingRef.current) talk();
        }}
        whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        className="pixel-companion-avatar"
        aria-label={locale === 'en' ? 'Talk to Lía or drag her across the screen' : 'Hablar con Lía o arrastrarla por la pantalla'}
      >
        <span className="pixel-pose-stage" aria-hidden="true">
          {POSES.map((pose, index) => (
            <motion.span
              key={pose}
              initial={false}
              animate={{
                opacity: index === poseIndex ? 1 : 0,
                scale: index === poseIndex ? 1 : 0.9,
                y: index === poseIndex ? 0 : 8,
              }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.28 }}
              className="pixel-pose"
            >
              <Image
                src={pose}
                alt=""
                width={172}
                height={206}
                loading="eager"
                draggable={false}
                className="pixel-companion-art"
              />
            </motion.span>
          ))}
        </span>
      </motion.button>
      </motion.div>
    </div>
  );
}
