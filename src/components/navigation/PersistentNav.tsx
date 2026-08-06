"use client";

import { motion } from 'framer-motion';
import { NODES, LINEAR_ORDER } from '@/data/nodes';
import { getJourneyProgress } from '@/lib/progress';

interface PersistentNavProps {
  currentNode: string;
  theme?: string;
  history: string[];
  isFirstInLinear: boolean;
  isLastInLinear: boolean;
  isInLinear: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGoToMap: () => void;
  onGoHome: () => void;
}

export default function PersistentNav({
  currentNode,
  theme,
  history,
  isFirstInLinear,
  isLastInLinear,
  isInLinear,
  onPrevious,
  onNext,
  onGoToMap,
  onGoHome,
}: PersistentNavProps) {
  if (currentNode === 'inicio') return null;

  const progress = getJourneyProgress(currentNode, history);

  const textClass = theme === 'light' ? 'text-[#1a1512]' : 'text-[#E8C9A0]';
  const borderClass = theme === 'light' ? 'border-[#8B0000]/30 hover:bg-[#8B0000]/5' : 'border-[#E8C9A0]/30 hover:bg-[#E8C9A0]/10';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="Navegación del portafolio"
      className="hidden md:flex fixed top-4 right-4 lg:top-6 lg:right-6 z-40 items-center gap-2"
    >
      {progress && (
        <p
          className={`text-[10px] uppercase tracking-[0.2em] mr-2 whitespace-nowrap ${textClass}/60`}
          aria-live="polite"
        >
          {progress.seasonName.replace(/^Temporada \d+: /, '')} — cap. {progress.chapterInSeason} de {progress.totalInSeason}
        </p>
      )}

      {isInLinear && !isFirstInLinear && (
        <button
          onClick={onPrevious}
          aria-label="Capítulo anterior"
          className={`w-9 h-9 flex items-center justify-center border transition-all ${textClass} ${borderClass}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {isInLinear && !isLastInLinear && (
        <button
          onClick={onNext}
          aria-label={`Siguiente: ${NODES[LINEAR_ORDER[LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) + 1]]?.title ?? ''}`}
          className={`w-9 h-9 flex items-center justify-center border transition-all ${textClass} ${borderClass}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {currentNode !== 'mapa' && (
        <button
          onClick={onGoToMap}
          aria-label="Volver al mapa"
          className={`h-9 px-3 flex items-center gap-2 border transition-all text-xs tracking-wider ${textClass} ${borderClass}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          </svg>
          <span className="hidden lg:inline">Mapa</span>
        </button>
      )}

      <button
        onClick={onGoHome}
        aria-label="Volver al inicio"
        className={`w-9 h-9 flex items-center justify-center border transition-all ${textClass} ${borderClass}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
      </button>
    </motion.nav>
  );
}
