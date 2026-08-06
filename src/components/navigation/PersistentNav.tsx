"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NODES, LINEAR_ORDER, CATEGORIES, STAMP_COLORS } from '@/data/nodes';
import { RESUME_LINKS } from '@/data/resume';
import { getJourneyProgress } from '@/lib/progress';

interface PersistentNavProps {
  currentNode: string;
  theme?: string;
  category?: string;
  history: string[];
  isFirstInLinear: boolean;
  isLastInLinear: boolean;
  isInLinear: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onGoToMap: () => void;
  onGoHome: () => void;
  onNavigate: (nodeId: string) => void;
}

const RECRUITER_TARGETS = [
  { id: 'tecnico', label: 'Ruta Técnica', activeOn: ['tecnico', 'perfil', 'estructura'] },
  { id: 'juego', label: 'Game Dev', activeOn: ['juego'] },
];

function RecruiterPanel({
  open,
  currentNode,
  textClass,
  panelBg,
  accentColor,
  githubUrl,
  linkedinUrl,
  onNavigate,
  onClose,
}: {
  open: boolean;
  currentNode: string;
  textClass: string;
  panelBg: string;
  accentColor: string;
  githubUrl?: string;
  linkedinUrl?: string;
  onNavigate: (nodeId: string) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`absolute right-0 top-full mt-2 w-52 border p-2 space-y-1 ${panelBg}`}
          role="menu"
        >
          {RECRUITER_TARGETS.map(t => {
            const active = t.activeOn.includes(currentNode);
            return (
              <button
                key={t.id}
                role="menuitem"
                onClick={() => { onNavigate(t.id); onClose(); }}
                className={`w-full text-left px-3 py-2 text-sm tracking-wide transition-colors ${textClass} hover:bg-current/10`}
                style={active ? { color: accentColor, fontWeight: 600 } : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {t.label}
              </button>
            );
          })}
          {githubUrl && (
            <a
              role="menuitem"
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-3 py-2 text-sm tracking-wide ${textClass} hover:bg-current/10`}
            >
              GitHub ↗
            </a>
          )}
          {linkedinUrl && (
            <a
              role="menuitem"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-3 py-2 text-sm tracking-wide ${textClass} hover:bg-current/10`}
            >
              LinkedIn ↗
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PersistentNav({
  currentNode,
  theme,
  category,
  history,
  isFirstInLinear,
  isLastInLinear,
  isInLinear,
  onPrevious,
  onNext,
  onGoToMap,
  onGoHome,
  onNavigate,
}: PersistentNavProps) {
  const [shortcutOpen, setShortcutOpen] = useState(false);

  if (currentNode === 'inicio') return null;

  const progress = getJourneyProgress(currentNode, history);
  const categoryColor = category ? CATEGORIES[category as keyof typeof CATEGORIES]?.color : undefined;
  const accentColor = categoryColor ? (STAMP_COLORS[categoryColor] ?? categoryColor) : '#E8C9A0';

  const textClass = theme === 'light' ? 'text-[#1a1512]' : 'text-[#E8C9A0]';
  const borderClass = theme === 'light' ? 'border-[#8B0000]/30 hover:bg-[#8B0000]/5' : 'border-[#E8C9A0]/30 hover:bg-[#E8C9A0]/10';
  const panelBg = theme === 'light' ? 'bg-[#faf5f0] border-[#8B0000]/20' : 'bg-[#0a0808] border-[#E8C9A0]/20';

  const iconBtn = `w-9 h-9 flex items-center justify-center border transition-all ${textClass} ${borderClass}`;

  const githubUrl = RESUME_LINKS.find(l => l.label === 'GitHub')?.url;
  const linkedinUrl = RESUME_LINKS.find(l => l.label === 'LinkedIn')?.url;

  const recruiterPanelProps = {
    open: shortcutOpen,
    currentNode,
    textClass,
    panelBg,
    accentColor,
    githubUrl,
    linkedinUrl,
    onNavigate,
    onClose: () => setShortcutOpen(false),
  };

  return (
    <>
      {/* Desktop / tablet: barra flotante superior derecha */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        aria-label="Navegación del portafolio"
        className="hidden md:flex fixed top-4 right-4 lg:top-6 lg:right-6 z-40 items-center gap-2"
      >
        {progress && (
          <p className={`text-[10px] uppercase tracking-[0.2em] mr-2 whitespace-nowrap flex items-center gap-1.5 ${textClass}/60`} aria-live="polite">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} aria-hidden="true" />
            {progress.seasonName.replace(/^Temporada \d+: /, '')} — cap. {progress.chapterInSeason} de {progress.totalInSeason}
          </p>
        )}

        {isInLinear && !isFirstInLinear && (
          <button onClick={onPrevious} aria-label="Capítulo anterior" className={iconBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        )}

        {isInLinear && !isLastInLinear && (
          <button
            onClick={onNext}
            aria-label={`Siguiente: ${NODES[LINEAR_ORDER[LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) + 1]]?.title ?? ''}`}
            className={iconBtn}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}

        {currentNode !== 'mapa' && (
          <button onClick={onGoToMap} aria-label="Volver al mapa" className={`h-9 px-3 flex items-center gap-2 border transition-all text-xs tracking-wider ${textClass} ${borderClass}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" /></svg>
            <span className="hidden lg:inline">Mapa</span>
          </button>
        )}

        <button onClick={onGoHome} aria-label="Volver al inicio" className={iconBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
        </button>

        <div className="relative">
          <button
            onClick={() => setShortcutOpen(v => !v)}
            aria-label="Atajo de reclutador"
            aria-expanded={shortcutOpen}
            className={iconBtn}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </button>
          <RecruiterPanel {...recruiterPanelProps} />
        </div>
      </motion.nav>

      {/* Mobile: barra inferior simplificada */}
      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        aria-label="Navegación del portafolio (móvil)"
        className={`flex md:hidden fixed bottom-0 inset-x-0 z-40 items-center justify-center gap-1 px-3 py-2 border-t backdrop-blur-sm ${
          theme === 'light' ? 'bg-[#faf5f0]/90 border-[#8B0000]/20' : 'bg-[#0a0808]/90 border-[#E8C9A0]/20'
        }`}
      >
        {isInLinear && !isFirstInLinear && (
          <button onClick={onPrevious} aria-label="Capítulo anterior" className={iconBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        )}
        {currentNode !== 'mapa' && (
          <button onClick={onGoToMap} aria-label="Volver al mapa" className={iconBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M2 12h4m12 0h4" /></svg>
          </button>
        )}
        <button onClick={onGoHome} aria-label="Volver al inicio" className={iconBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>
        </button>
        <div className="relative">
          <button onClick={() => setShortcutOpen(v => !v)} aria-label="Atajo de reclutador" aria-expanded={shortcutOpen} className={iconBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </button>
          <div className="absolute right-0 bottom-full mb-2">
            <RecruiterPanel {...recruiterPanelProps} />
          </div>
        </div>
        {isInLinear && !isLastInLinear && (
          <button
            onClick={onNext}
            aria-label={`Siguiente: ${NODES[LINEAR_ORDER[LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) + 1]]?.title ?? ''}`}
            className={iconBtn}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </motion.nav>
    </>
  );
}
