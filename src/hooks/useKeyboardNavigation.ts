"use client";

import { useEffect } from 'react';

interface UseKeyboardNavigationOptions {
  goToPrevious: () => void;
  goToNext: () => void;
  navigateTo: (nodeId: string) => void;
  goHome: () => void;
  isTransitioning: boolean;
  enabled?: boolean;
}

// Flecha izq/der = capítulo anterior/siguiente, Esc = volver al mapa,
// Home = volver al inicio. Se desactiva si el foco está en un campo
// editable, y mientras isTransitioning ya en curso o el splash sigue
// activo (enabled=false), para no disparar navegación invisible.
export function useKeyboardNavigation({
  goToPrevious,
  goToNext,
  navigateTo,
  goHome,
  isTransitioning,
  enabled = true,
}: UseKeyboardNavigationOptions) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (isTransitioning || e.metaKey || e.ctrlKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (target?.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          navigateTo('mapa');
          break;
        case 'Home':
          goHome();
          break;
        default:
          return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isTransitioning, goToPrevious, goToNext, navigateTo, goHome]);
}
