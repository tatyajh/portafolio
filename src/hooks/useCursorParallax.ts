"use client";

import { useEffect } from 'react';
import { useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function useCursorParallax() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 50, damping: 20 });
  const y = useSpring(rawY, { stiffness: 50, damping: 20 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return; // evita gestos táctiles/scroll

    const handleMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [prefersReducedMotion, rawX, rawY]);

  return { x, y };
}
