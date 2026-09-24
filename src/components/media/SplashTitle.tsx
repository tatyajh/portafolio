"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { buildFragments, cutPaper, stitchPaper, hasOpenCut, type CutAxis, type LetterCuts } from '@/lib/paperCuts';
import { awardThread } from '@/lib/threadProgress';
import type { CollageTool } from '@/lib/collageAssets';

interface ToolMoveDetail { x: number; y: number; category: CollageTool; axis: CutAxis }
interface SplashTitleProps { onFirstCut?: () => void; onFirstStitch?: () => void; title?: string }

export default function SplashTitle({ onFirstCut, onFirstStitch, title = 'Portafolio' }: SplashTitleProps) {
  const { locale } = useLanguage();
  const reducedMotion = useReducedMotion();
  const letters = Array.from(title);
  const [cuts, setCuts] = useState<LetterCuts[]>(() => letters.map(() => []));
  const cutsRef = useRef(cuts);
  const [selected, setSelected] = useState<CollageTool | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const letterRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const firstCutReported = useRef(false);
  const firstStitchReported = useRef(false);
  const applyTool = useCallback((i: number, category: CollageTool, axis: CutAxis, x: number, y: number) => {
    const before = cutsRef.current[i];
    const after = category === 'tijeras' ? cutPaper(before, axis, axis === 'h' ? y : x) : stitchPaper(before, x, y);
    if (before === after) return;
    const next = cutsRef.current.slice(); next[i] = after;
    cutsRef.current = next; setCuts(next);
    setAnnouncement(locale === 'en'
      ? category === 'tijeras' ? 'Cut. The needle can stitch it back.' : 'Stitched.'
      : category === 'tijeras' ? 'Cortada. Con la aguja la puedes coser.' : 'Cosida.');
  }, [locale]);

  useEffect(() => {
    const move = (event: Event) => {
      const { x, y, category, axis } = (event as CustomEvent<ToolMoveDetail>).detail;
      if (category !== 'tijeras' && category !== 'aguja') return;
      letterRefs.current.forEach((el, i) => {
        const r = el?.getBoundingClientRect();
        if (!r || !r.width || x < r.left || x > r.right || y < r.top || y > r.bottom) return;
        applyTool(i, category, axis, 100 * (x - r.left) / r.width, 100 * (y - r.top) / r.height);
      });
    };
    const select = (event: Event) => setSelected((event as CustomEvent<CollageTool | null>).detail);
    const fallback = () => applyTool(0, 'tijeras', 'h', 50, 50);
    // Coser sin arrastrar: cose la primera letra que tenga un corte abierto.
    const stitchFallback = () => {
      const i = cutsRef.current.findIndex(hasOpenCut);
      if (i >= 0) applyTool(i, 'aguja', 'h', 50, 50);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') window.dispatchEvent(new CustomEvent('splash-tool-select', { detail: null }));
    };
    window.addEventListener('splash-tool-move', move);
    window.addEventListener('splash-tool-select', select);
    window.addEventListener('splash-cut-action', fallback);
    window.addEventListener('splash-stitch-action', stitchFallback);
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('splash-tool-move', move);
      window.removeEventListener('splash-tool-select', select);
      window.removeEventListener('splash-cut-action', fallback);
      window.removeEventListener('splash-stitch-action', stitchFallback);
      window.removeEventListener('keydown', escape);
    };
  }, [applyTool]);

  useEffect(() => {
    if (!firstCutReported.current && cuts.some(c => c.length > 0)) {
      firstCutReported.current = true;
      onFirstCut?.(); awardThread('first-cut');
    }
    if (!firstStitchReported.current && cuts.some(c => c.some(seam => seam.stitched))) {
      firstStitchReported.current = true;
      onFirstStitch?.(); awardThread('first-repair');
    }
  }, [cuts, onFirstCut, onFirstStitch]);

  return (
    <>
      <h1 aria-label={title} data-splash-title className="splash-paper-title font-serif">
        {letters.map((letter, i) => (
          <button type="button" key={i} ref={el => { letterRefs.current[i] = el; }}
            className="paper-letter" data-cut={hasOpenCut(cuts[i]) || undefined} data-stitched={cuts[i].some(c => c.stitched) || undefined}
            aria-label={`${locale === 'en' ? selected === 'aguja' ? 'Stitch' : 'Cut' : selected === 'aguja' ? 'Coser' : 'Cortar'} ${letter}, ${i + 1}`}
            aria-disabled={!selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => { if (selected) applyTool(i, selected, 'h', 50, 50); }}>
            <span className="paper-letter-size" aria-hidden="true">{letter}</span>
            {buildFragments(cuts[i]).map(fragment => (
              <motion.span key={fragment.key} className="paper-fragment-shadow" aria-hidden="true"
                initial={false} animate={{ x: fragment.x, y: fragment.y, rotate: fragment.rotate }}
                transition={{ duration: reducedMotion ? 0 : 0.24, ease: 'easeOut' }}>
                <span className="paper-fragment" style={{ clipPath: fragment.clipPath }}>{letter}</span>
              </motion.span>
            ))}
            <svg className="paper-stitches" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {cuts[i].filter(c => c.stitched).map(cut => (
                <g key={`${cut.axis}-${cut.position}`} className="paper-seam">
                  <path className="paper-scar" d={cut.axis === 'h' ? `M0 ${cut.position}h100` : `M${cut.position} 0v100`} />
                  {[18, 39, 61, 82].map((p, j) => <path key={p}
                    d={cut.axis === 'h'
                      ? `M${p - 3} ${cut.position - 5}l${6 + j % 2} 10`
                      : `M${cut.position - 5} ${p - 3}l10 ${6 + j % 2}`} />)}
                </g>
              ))}
            </svg>
          </button>
        ))}
      </h1>
      <span className="sr-only" role="status">{announcement}</span>
    </>
  );
}
