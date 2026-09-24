"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { LIA_TIPS, LIA_VIDEO_TIP } from '@/data/liaTips';
import { playFairyChime } from '@/lib/fairyChime';

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

// Zonas que Lía no debe tapar cuando corre a señalar algo.
// Cada zona tiene un peso: el título y los botones nunca se deben tapar;
// el nombre y las frases pequeñas, mejor no, pero pesan menos.
const AVOID: [string, number][] = [
  ['[data-splash-title]', 10], ['.splash-routes', 10], ['main h2', 10],
  ['.splash-name', 2], ['.splash-script', 2], ['.splash-roles', 2],
];
const BUBBLE = { width: 250, height: 130 };

type Box = { left: number; top: number; right: number; bottom: number };
const overlap = (p: Box, q: Box) =>
  Math.max(0, Math.min(p.right, q.right) - Math.max(p.left, q.left)) *
  Math.max(0, Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top));

function pickSpot(t: DOMRect, a: DOMRect) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const bw = Math.min(BUBBLE.width, vw * 0.68);
  const avoid = AVOID.flatMap(([sel, weight]) => Array.from(document.querySelectorAll(sel)).map(el => ({ r: el.getBoundingClientRect(), weight })));
  const minTop = BUBBLE.height + 24, maxTop = vh - a.height - 8;
  const clamp = (x: number, y: number) => ({
    left: Math.min(Math.max(x, 8), vw - a.width - 8),
    top: Math.min(Math.max(y, minTop), maxTop),
  });
  // Primero junto al objeto; si ahí tapa algo, prueba por los bordes.
  const candidates = [
    clamp(t.right + 4, t.top + t.height * 0.2),
    clamp(t.left - a.width - 4, t.top + t.height * 0.2),
    clamp(t.left + t.width / 2 - a.width / 2, t.bottom + 8),
    clamp(t.right + 4, t.bottom),
    clamp(t.left - a.width - 4, t.bottom),
  ];
  for (let y = minTop; y <= maxTop; y += 40) {
    candidates.push(clamp(8, y), clamp(vw - a.width - 8, y));
  }
  let best = { ...candidates[0], opensRight: true }, bestScore = Infinity;
  for (const c of candidates) {
    // El globo se abre hacia donde quepa.
    const opensRight = c.left + bw <= vw - 8 || c.left + a.width - bw < 8;
    const bubbleLeft = opensRight ? c.left : c.left + a.width - bw;
    const body = { left: c.left, top: c.top, right: c.left + a.width, bottom: c.top + a.height };
    const bubble = { left: bubbleLeft, top: c.top - BUBBLE.height - 16, right: bubbleLeft + bw, bottom: c.top };
    const covered = avoid.reduce((sum, { r, weight }) => sum + (overlap(body, r) + overlap(bubble, r)) * weight, 0);
    const distance = Math.hypot(c.left + a.width / 2 - (t.left + t.width / 2), c.top - t.top);
    const score = covered + distance;
    if (score < bestScore) { bestScore = score; best = { ...c, opensRight }; }
  }
  return best;
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
  // Capítulo donde está la persona: define qué pistas da Lía.
  const [nodeId, setNodeId] = useState<string | null>(null);
  const pointingRef = useRef(false);
  useEffect(() => {
    if (!exploring) return;
    let hide: number | undefined;
    const onNode = (id: string) => {
      setNodeId(id);
      // Un mensaje de otro lugar no debe quedarse pegado al cambiar de capítulo.
      setPointMessage(null);
      setMessageIndex(0);
      setPoseIndex(1);
      setShowMessage(true);
      // La pista aparece al llegar y se va sola para no tapar el contenido.
      window.clearTimeout(hide);
      hide = window.setTimeout(() => { if (!pointingRef.current) setShowMessage(false); }, LIA_TIPS[id]?.video ? 12000 : 7000);
    };
    const initial = document.documentElement.dataset.node;
    if (initial) onNode(initial);
    const listener = (event: Event) => onNode((event as CustomEvent<string>).detail);
    window.addEventListener('lia-node', listener);
    return () => { window.removeEventListener('lia-node', listener); window.clearTimeout(hide); };
  }, [exploring]);

  const liaX = useMotionValue(0);
  const liaY = useMotionValue(0);
  // Cuando Lía corre a señalar algo: su mensaje, hacia dónde mira y si va corriendo.
  const [pointMessage, setPointMessage] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  // Si Lía se para en la mitad izquierda, su globo se abre hacia la derecha para no cortarse.
  const [bubbleStart, setBubbleStart] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let back: number | undefined;
    const onPoint = (event: Event) => {
      // Sin texto propio, Lía muestra el mensaje que ya tenía (ej. en la portada).
      const { selector, es, en } = (event as CustomEvent<{ selector: string; es?: string; en?: string }>).detail;
      const target = document.querySelector(selector);
      const avatar = guideRef.current?.querySelector('.pixel-companion-avatar');
      if (!target || !avatar) return;
      const t = target.getBoundingClientRect();
      const a = avatar.getBoundingClientRect();
      // Busca dónde pararse junto al objeto sin tapar lo importante
      // (título, nombre, botones), contando también su globo.
      const { left: destLeft, top: destTop, opensRight } = pickSpot(t, a);
      const toTheLeft = t.left + t.width / 2 > destLeft + a.width / 2;
      const options = { duration: prefersReducedMotion ? 0 : 1.1, ease: 'easeInOut' as const };
      pointingRef.current = true;
      setShowMessage(false);
      setFlipped(toTheLeft);
      setBubbleStart(opensRight);
      setPoseIndex(0);
      setRunning(true);
      animate(liaX, liaX.get() + destLeft - a.left, options);
      animate(liaY, liaY.get() + destTop - a.top, { ...options, onComplete: () => {
        setRunning(false);
        setPointMessage((locale === 'en' ? en : es) ?? null);
        setShowMessage(true);
        // Después vuelve a su esquina para no tapar el Índice.
        // De regreso también va sin globo, para que no se vea cortado en el camino.
        back = window.setTimeout(() => {
          pointingRef.current = false;
          setShowMessage(false);
          setPointMessage(null);
          setFlipped(false);
          setBubbleStart(false);
          setRunning(true);
          animate(liaX, 0, options);
          animate(liaY, 0, { ...options, onComplete: () => setRunning(false) });
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

  const lang = locale === 'en' ? 'en' : 'es';
  const nodeTips = nodeId ? LIA_TIPS[nodeId] : undefined;
  const tips = nodeTips?.[lang];
  const hasVideo = exploring && !!nodeTips?.video;
  const messages = exploring && tips
    ? [...(hasVideo ? [LIA_VIDEO_TIP[lang].text] : []), ...tips, locale === 'en' ? ENGLISH_MESSAGES.exploring[0] : EXPLORING_MESSAGES[0]]
    : locale === 'en'
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

  // Tilín de hada cada vez que Lía muestra un mensaje nuevo.
  const messageText = pointMessage ?? messages[messageIndex % messages.length];
  useEffect(() => {
    if (showMessage) playFairyChime();
  }, [showMessage, messageText]);

  // Pausa la música de fondo, lleva al primer video y le activa el sonido.
  const playChapterVideo = () => {
    window.dispatchEvent(new CustomEvent('splash-music', { detail: 'pause' }));
    const video = document.querySelector<HTMLVideoElement>('main video');
    if (!video) return;
    video.scrollIntoView({ behavior: 'smooth', block: 'center' });
    video.muted = false;
    void video.play().catch(() => {});
    setShowMessage(false);
  };

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
        className={`pixel-companion ${unlocked ? 'is-unlocked' : ''} ${exploring ? 'is-exploring' : ''} ${isDragging ? 'is-dragging' : ''} ${running ? 'is-running' : ''} ${flipped ? 'is-flipped' : ''} ${bubbleStart ? 'is-bubble-start' : ''}`}
        data-lia-companion
      >
      <AnimatePresence mode="wait">
        {showMessage && (
          <motion.div
            key={`${unlocked}-${cut}-${nodeId}-${messageIndex}-${pointMessage ?? ''}`}
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
            <p>{messageText}</p>
            {hasVideo && messageIndex % messages.length === 0 && !pointMessage && (
              <button type="button" onClick={playChapterVideo} className="pixel-cut-action">
                {LIA_VIDEO_TIP[lang].button}
              </button>
            )}
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
