"use client";

import Image from 'next/image';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { collageAssets, type CollageObject, type CollageTool } from '@/lib/collageAssets';

/** Un recorte que se levanta y se queda donde lo sueltan. */
export default function CollagePiece({ object, selected, onSelect, interactive = false }: {
  object: CollageObject;
  selected?: boolean;
  onSelect?: (tool: CollageTool | null) => void;
  interactive?: boolean;
}) {
  const { locale } = useLanguage();
  const asset = collageAssets[object];
  const tool = object === 'tijeras' || object === 'aguja';
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetAtStart = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [snipping, setSnipping] = useState(false);
  const gesture = useRef<{ id: number; x: number; y: number; lastX: number; lastY: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const sound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => () => { sound.current?.pause(); }, []);

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
      setSnipping(object === 'tijeras' && overTitle);
      if (object === 'tijeras' && overTitle) {
        if (!sound.current) { sound.current = new Audio('/media/audio/tijeras.mp3'); sound.current.volume = 0.15; }
        void sound.current.play().catch(() => {});
      } else sound.current?.pause();
    }
    g.lastX = event.clientX; g.lastY = event.clientY;
  };
  const end = (event: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    suppressClick.current = g.moved;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false); setSnipping(false);
    sound.current?.pause();
  };
  return (
    <button type="button" className={`collage-piece collage-piece--${object} ${dragging ? 'is-lifted' : ''}`}
      aria-label={asset[locale]}
      aria-pressed={tool && interactive ? !!selected : undefined}
      title={locale === 'en' ? 'Drag me' : 'Arrástrame'}
      style={{ translate: `${offset.x}px ${offset.y}px` }}
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
      onClick={() => { if (!suppressClick.current && tool && interactive) onSelect?.(selected ? null : object); }}
    >
      <Image src={snipping && 'activeImage' in asset ? asset.activeImage : asset.image} alt="" width={110} height={110} loading="eager" draggable={false} />
      {tool && interactive && <span className="collage-piece-label">{asset[locale]}</span>}
    </button>
  );
}
