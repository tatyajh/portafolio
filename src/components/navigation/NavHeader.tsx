"use client";

import { motion } from 'framer-motion';
import { NODES, LINEAR_ORDER } from '@/data/nodes';

export default function NavHeader({
  currentNode,
  theme,
  isInLinear,
  isFirstInLinear,
  onPrevious,
}: {
  currentNode: string;
  theme?: string;
  isInLinear: boolean;
  isFirstInLinear: boolean;
  onPrevious: () => void;
}) {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center ${currentNode === 'inicio' ? 'hidden' : ''}`}>
      {/* Botón anterior (navegación lineal con nombre de nodo) */}
      {isInLinear && !isFirstInLinear && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onPrevious}
          className={`flex items-center gap-2 px-4 py-2 border transition-all ${
            theme === 'light'
              ? 'border-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574]/10'
              : 'border-[#E8C9A0]/40 text-[#E8C9A0] hover:bg-[#E8C9A0]/10'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          <span className="text-sm tracking-wider">
            {NODES[LINEAR_ORDER[LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) - 1]]?.title}
          </span>
        </motion.button>
      )}
      {(!isInLinear || isFirstInLinear) && <div />}

    </header>
  );
}
