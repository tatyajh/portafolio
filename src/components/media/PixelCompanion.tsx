"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

// Lía habla como Navi: un llamado corto y la pista en una línea.
// Guía los dos pasos que abren la portada: cortar y coser.
const LOCKED_MESSAGES = [
  '¡Hey! ¡Escucha! ¿Ves esas tijeras? Pásalas por encima de PORTAFOLIO.',
  '¡Mira! Primero corta y después cose con la aguja. Así se abren los botones.',
  '¡Oye! Toca el saxofón si quieres música.',
];

const STITCH_MESSAGES = [
  '¡Hey! ¡Primer corte! Ahora toma la aguja y cóselo.',
  '¡Escucha! Pasa la aguja por encima de la letra cortada.',
];

const UNLOCKED_MESSAGES = [
  '¡Listo! Quedó cosido. Ya puedes entrar.',
  '¡Mira! El carrete también se desenrolla.',
  '¡Vamos! Press start cuando quieras.',
];

const EXPLORING_MESSAGES = [
  '¡Hey! Si te estorbo, arrástrame a otro lado.',
  '¡Mira! En Videojuegos puedes jugar aquí mismo, sin descargar nada.',
  '¡Oye! Las flechas de arriba te llevan al siguiente capítulo.',
];

const ENGLISH_MESSAGES = {
  locked: [
    'Hey! Listen! See those scissors? Drag them across PORTFOLIO.',
    'Look! First cut, then stitch it with the needle. That opens the buttons.',
    'Hey! Tap the saxophone if you want music.',
  ],
  stitch: [
    'Hey! First cut! Now grab the needle and stitch it.',
    'Listen! Move the needle over the cut letter.',
  ],
  unlocked: [
    "Done! It's stitched. You can go in now.",
    'Look! The spool unwinds too.',
    "Come on! Press start whenever you're ready.",
  ],
  exploring: [
    "Hey! If I'm in the way, drag me somewhere else.",
    'Look! In Video Games you can play right here, no download needed.',
    'Hey! The arrows up top take you to the next chapter.',
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
  /** En la portada: ya hubo un corte y falta coser. */
  cut?: boolean;
  exploring?: boolean;
  fallbackAvailable?: boolean;
  onFallbackCut?: () => void;
  onFallbackStitch?: () => void;
}

/** Lía acompaña la entrada y da pequeñas pistas al conversar. */
export default function PixelCompanion({
  unlocked,
  cut = false,
  exploring = false,
  fallbackAvailable = false,
  onFallbackCut,
  onFallbackStitch,
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
  const previousCut = useRef(cut);
  const previousExploring = useRef(exploring);
  const wasDraggingRef = useRef(false);
  const dragStateRef = useRef<LiaDragState | null>(null);
  const liaX = useMotionValue(0);
  const liaY = useMotionValue(0);
  // Cuando Lía corre a señalar algo: su mensaje, hacia dónde mira y si va corriendo.
  const [pointMessage, setPointMessage] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!exploring) return;
    let back: number | undefined;
    const onPoint = (event: Event) => {
      const { selector, es, en } = (event as CustomEvent<{ selector: string; es: string; en: string }>).detail;
      const target = document.querySelector(selector);
      const avatar = guideRef.current?.querySelector('.pixel-companion-avatar');
      if (!target || !avatar) return;
      const t = target.getBoundingClientRect();
      const a = avatar.getBoundingClientRect();
      // Se para al lado del objeto y lo señala con la mano levantada.
      const toTheLeft = t.left + t.width / 2 > window.innerWidth * 0.6;
      const destLeft = Math.min(Math.max(toTheLeft ? t.left - a.width * 0.85 : t.right - a.width * 0.15, 8), window.innerWidth - a.width - 8);
      const destTop = Math.min(Math.max(t.top + t.height * 0.25, 90), window.innerHeight - a.height - 8);
      const options = { duration: prefersReducedMotion ? 0 : 1.1, ease: 'easeInOut' as const };
      setShowMessage(false);
      setFlipped(toTheLeft);
      setPoseIndex(0);
      setRunning(true);
      animate(liaX, liaX.get() + destLeft - a.left, options);
      animate(liaY, liaY.get() + destTop - a.top, { ...options, onComplete: () => {
        setRunning(false);
        setPointMessage(locale === 'en' ? en : es);
        setShowMessage(true);
        // Después vuelve a su esquina para no tapar el Índice.
        back = window.setTimeout(() => {
          setPointMessage(null);
          setFlipped(false);
          animate(liaX, 0, options);
          animate(liaY, 0, options);
        }, 9000);
      } });
    };
    window.addEventListener('lia-point', onPoint);
    return () => { window.removeEventListener('lia-point', onPoint); window.clearTimeout(back); };
  }, [exploring, locale, liaX, liaY, prefersReducedMotion]);

  useEffect(() => {
    if (!previousUnlocked.current && unlocked) {
      setMessageIndex(0);
      setPoseIndex(2);
      setShowMessage(true);
    }
    previousUnlocked.current = unlocked;
  }, [unlocked]);

  useEffect(() => {
    if (!previousCut.current && cut) {
      setMessageIndex(0);
      setPoseIndex(2);
      setShowMessage(true);
    }
    previousCut.current = cut;
  }, [cut]);

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
        : cut ? ENGLISH_MESSAGES.stitch : ENGLISH_MESSAGES.locked
    : exploring
      ? EXPLORING_MESSAGES
      : unlocked
        ? UNLOCKED_MESSAGES
        : cut ? STITCH_MESSAGES : LOCKED_MESSAGES;

  const talk = () => {
    setPointMessage(null);
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
        className={`pixel-companion ${unlocked ? 'is-unlocked' : ''} ${exploring ? 'is-exploring' : ''} ${isDragging ? 'is-dragging' : ''} ${running ? 'is-running' : ''} ${flipped ? 'is-flipped' : ''}`}
        data-lia-companion
      >
      <AnimatePresence mode="wait">
        {showMessage && (
          <motion.div
            key={`${unlocked}-${cut}-${messageIndex}-${pointMessage ?? ''}`}
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            className="pixel-companion-message"
            role="status"
          >
            <button
              type="button"
              onClick={() => { setShowMessage(false); setPointMessage(null); }}
              aria-label={locale === 'en' ? 'Close Lía message' : 'Cerrar mensaje de Lía'}
              className="pixel-companion-close"
            >
              ×
            </button>
            <span>LÍA</span>
            <p>{pointMessage ?? messages[messageIndex % messages.length]}</p>
            {fallbackAvailable && !unlocked && (
              <button type="button" onClick={cut ? onFallbackStitch : onFallbackCut} className="pixel-cut-action">
                {cut
                  ? locale === 'en' ? 'You stitch it' : 'Cósela tú'
                  : locale === 'en' ? '✂ You cut it' : '✂ Córtala tú'}
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
