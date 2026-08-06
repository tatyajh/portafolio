"use client";

import { motion } from 'framer-motion';
import { NODES, LINEAR_ORDER } from '@/data/nodes';

export default function NavFooter({
  currentNode,
  theme,
  isInLinear,
  isLastInLinear,
  onNext,
  onGoToMap,
}: {
  currentNode: string;
  theme?: string;
  isInLinear: boolean;
  isLastInLinear: boolean;
  onNext: () => void;
  onGoToMap: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      {/* Indicador de capítulo */}
      {isInLinear && (
        <p className={`text-center text-xs uppercase tracking-[0.3em] ${
          theme === 'light' ? 'text-[#8B0000]/40' : 'text-[#E8C9A0]/40'
        }`}>
          {LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) + 1} / {LINEAR_ORDER.length}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {/* Botón Siguiente */}
        {isInLinear && !isLastInLinear && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            className={`px-8 py-4 border transition-all tracking-wider flex items-center gap-3 ${
              theme === 'light'
                ? 'bg-[#8B0000] text-[#faf5f0] border-[#8B0000] hover:bg-[#6B0000]'
                : 'bg-[#E8C9A0] text-[#0a0808] border-[#E8C9A0] hover:bg-[#F0D0A0]'
            }`}
          >
            <span>{NODES[LINEAR_ORDER[LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) + 1]]?.title}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </motion.button>
        )}

        {/* Botón Volver al mapa */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onGoToMap}
          className={`px-6 py-3 border transition-all tracking-wider flex items-center gap-2 ${
            theme === 'light'
              ? 'border-[#8B0000]/30 text-[#8B0000] hover:border-[#8B0000]/60 hover:bg-[#8B0000]/5'
              : 'border-[#E8C9A0]/30 text-[#E8C9A0] hover:border-[#E8C9A0]/60 hover:bg-[#E8C9A0]/5'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
          </svg>
          <span>Volver al mapa</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
