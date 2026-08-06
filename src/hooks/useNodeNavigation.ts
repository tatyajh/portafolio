"use client";

import { useState, useCallback, useEffect } from 'react';
import { NODES, LINEAR_ORDER } from '@/data/nodes';

export function useNodeNavigation() {
  const [currentNode, setCurrentNode] = useState<string>('inicio');
  const [history, setHistory] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const node = NODES[currentNode] ?? NODES['esencia'];

  const navigateTo = useCallback((nodeId: string) => {
    if (isTransitioning || !NODES[nodeId]) return;
    // Navegación instantánea desde splash screen
    if (currentNode === 'inicio') {
      setCurrentNode(nodeId);
      setHistory(prev => [...prev, nodeId]);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNode(nodeId);
      setHistory(prev => [...prev, nodeId]);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentNode]);

  // Navegación lineal
  const goToNext = useCallback(() => {
    const currentIndex = LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]);
    if (currentIndex >= 0 && currentIndex < LINEAR_ORDER.length - 1) {
      navigateTo(LINEAR_ORDER[currentIndex + 1]);
    }
  }, [currentNode, navigateTo]);

  const goToPrevious = useCallback(() => {
    const currentIndex = LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]);
    if (currentIndex > 0) {
      navigateTo(LINEAR_ORDER[currentIndex - 1]);
    }
  }, [currentNode, navigateTo]);

  // Volver al inicio: le avisa a AudioEngine que vuelva a mostrar el
  // splash (que de otro modo no tiene forma de reactivarse una vez
  // hasInteracted queda en true) antes de vaciar el contenido.
  const goHome = useCallback(() => {
    if (isTransitioning) return;
    window.dispatchEvent(new CustomEvent('returnToSplash'));
    navigateTo('inicio');
  }, [isTransitioning, navigateTo]);

  const isFirstInLinear = LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) === 0;
  const isLastInLinear = LINEAR_ORDER.indexOf(currentNode as typeof LINEAR_ORDER[number]) === LINEAR_ORDER.length - 1;
  const isInLinear = LINEAR_ORDER.includes(currentNode as typeof LINEAR_ORDER[number]);

  // Escuchar eventos de navegación del AudioEngine
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.target === 'explore') {
        navigateTo('mapa');
      } else if (detail?.target === 'start') {
        navigateTo('esencia');
      } else if (detail?.target === 'tecnico') {
        navigateTo('tecnico');
      }
    };
    window.addEventListener('navigateTo', handleNavigate);
    return () => window.removeEventListener('navigateTo', handleNavigate);
  }, [navigateTo]);

  return {
    currentNode,
    node,
    history,
    isTransitioning,
    navigateTo,
    goHome,
    goToNext,
    goToPrevious,
    isFirstInLinear,
    isLastInLinear,
    isInLinear,
  };
}
