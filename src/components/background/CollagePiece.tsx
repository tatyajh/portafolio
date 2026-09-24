"use client";

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { collageAssets, type CollageObject, type CollageTool } from '@/lib/collageAssets';

// Cada cuánto abren y cierran las tijeras mientras cortan.
const SNIP_MS = 110;

/** Un recorte que se levanta y se queda donde lo sueltan. */
export default function CollagePiece({ object, selected, onSelect, interactive = false, goTo, hint }: {
  object: CollageObject;
  selected?: boolean;
  onSelect?: (tool: CollageTool | null) => void;
  /** En la portada: tijeras y aguja cortan, el control es Press start. */
  interactive?: boolean;
  /** Capítulo al que lleva un clic. */
  goTo?: string;
  hint?: string;
}) {
  const { locale } = useLanguage();
  const asset = collageAssets[object];
  const tool = object === 'tijeras' || object === 'aguja';
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetAtStart = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [closed, setClosed] = useState(false);
  const lastSnip = useRef(0);
  const [playing, setPlaying] = useState(false);
  const gesture = useRef<{ id: number; x: number; y: number; lastX: number; lastY: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const sound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => { sound.current?.pause(); }, []);

  useEffect(() => {
    if (object !== 'saxofon') return;
    const onState = (event: Event) => setPlaying((event as CustomEvent<boolean>).detail);
    window.addEventListener('splash-music-state', onState);
    window.dispatchEvent(new CustomEvent('splash-music-query'));
    return () => window.removeEventListener('splash-music-state', onState);
  }, [object]);

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const dx = event.clientX - g.x;
    const dy = event.clientY - g.y;
    g.moved ||= Math.hypot(dx, dy) > 5;
    if (!g.moved) return;
    setOffset({ x: offsetAtStart.current.x + dx, y: offsetAtStart.current.y + dy });
    if (tool && interactive) {
      // Se revisa todo el trayecto para que un gesto rápido no salte letras.
      const stepX = event.clientX - g.lastX;
      const stepY = event.clientY - g.lastY;
      const axis = Math.abs(stepX) >= Math.abs(stepY) ? 'h' : 'v';
      const steps = Math.max(1, Math.ceil(Math.hypot(stepX, stepY) / 6));
      for (let s = 1; s <= steps; s++) {
        window.dispatchEvent(new CustomEvent('splash-tool-move', { detail: {
          x: g.lastX + (stepX * s) / steps, y: g.lastY + (stepY * s) / steps, category: object, axis,
        } }));
      }
      const r = document.querySelector('[data-splash-title]')?.getBoundingClientRect();
      const overTitle = !!r && event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
      if (object === 'tijeras' && overTitle) {
        // Tijereteo: abren y cierran mientras pasan por las letras.
        const now = performance.now();
        if (now - lastSnip.current >= SNIP_MS) {
          lastSnip.current = now;
          setClosed(c => !c);
        }
        // Suena en bucle mientras las tijeras pasan por las letras.
        if (!sound.current) { sound.current = new Audio('/media/audio/tijeras.mp3'); sound.current.loop = true; sound.current.volume = 0.4; }
        if (sound.current.paused) void sound.current.play().catch(() => {});
      } else {
        setClosed(false);
        sound.current?.pause();
      }
    }
    g.lastX = event.clientX; g.lastY = event.clientY;
  };

  const end = (event: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    suppressClick.current = g.moved;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false); setClosed(false);
    sound.current?.pause();
    // Arrastrar el saxofón arranca la música; tocarlo la alterna (ver onClick).
    if (object === 'saxofon' && g.moved) {
      window.dispatchEvent(new CustomEvent('splash-music', { detail: 'start' }));
    }
  };

  const click = () => {
    if (suppressClick.current) return;
    // El saxofón prende y apaga la música donde esté.
    if (object === 'saxofon') window.dispatchEvent(new CustomEvent('splash-music', { detail: 'toggle' }));
    else if (goTo) window.dispatchEvent(new CustomEvent('navigateTo', { detail: { target: goTo } }));
    else if (!interactive) return;
    else if (tool) onSelect?.(selected ? null : object);
    else if (object === 'gamepad') window.dispatchEvent(new CustomEvent('splash-press-start'));
  };

  // El carrete deja el hilo desenrollado entre donde estaba y donde está.
  const distance = Math.hypot(offset.x, offset.y);
  const sag = Math.min(90, distance * 0.3);
  const thread = object === 'carrete' && interactive && distance > 4;

  return (
    <>
      {thread && (
        <svg className="collage-thread" aria-hidden="true">
          <path d={`M0 0 Q${offset.x / 2} ${offset.y / 2 + sag} ${offset.x} ${offset.y}`} />
        </svg>
      )}
      <button type="button"
        className={`collage-piece collage-piece--${object} ${dragging ? 'is-lifted' : ''} ${playing ? 'is-playing' : ''}`}
        aria-label={hint ? `${asset[locale]}: ${hint}` : asset[locale]}
        aria-pressed={tool && interactive ? !!selected : object === 'saxofon' ? playing : undefined}
        title={hint ?? (locale === 'en' ? 'Drag me' : 'Arrástrame')}
        style={{ translate: `${offset.x}px ${offset.y}px`, '--spin': object === 'carrete' ? `${distance * 1.2}deg` : '0deg' } as CSSProperties}
        onPointerDown={event => {
          if (event.button !== 0) return;
          suppressClick.current = false;
          offsetAtStart.current = offset;
          gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(true);
        }}
        onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
        onKeyDown={event => { if (event.key === 'Escape') { onSelect?.(null); event.stopPropagation(); } }}
        onClick={click}
      >
        <Image src={asset.image} alt="" width={110} height={110} loading="eager" draggable={false}
          className={closed ? 'is-hidden' : undefined} />
        {/* Las dos poses de las tijeras se cargan desde el inicio para que el cambio sea instantáneo */}
        {'activeImage' in asset && (
          <Image src={asset.activeImage} alt="" width={110} height={110} loading="eager" draggable={false}
            className={`collage-piece-alt ${closed ? '' : 'is-hidden'}`} />
        )}
      </button>
    </>
  );
}
