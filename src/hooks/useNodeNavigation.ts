"use client";

import { useState, useCallback, useEffect } from 'react';
import { NODES, LINEAR_ORDER, TECH_ROUTE_ORDER } from '@/data/nodes';

export function useNodeNavigation() {
  const [currentNode, setCurrentNode] = useState<string>('inicio');
  const [history, setHistory] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const node = NODES[currentNode] ?? NODES['esencia'];

  // Si el nodo actual pertenece a la ruta técnica Y se llegó a él desde
  // esa misma ruta (el nodo previo en el historial es "tecnico" u otro
  // paso de la ruta), siguiente/anterior avanzan dentro de esa ruta
  // corta en vez de saltar al orden narrativo completo — evita que
  // desde Perfil "siguiente" aterrice en un capítulo emocional sin
  // relación (ej. Herencia) cuando el visitante venía por lo técnico.
  // El propio hub "tecnico" también cuenta como parte de la ruta (es su
  // punto de entrada): así "siguiente" desde ahí lleva directo a Perfil,
  // en vez de no mostrar ninguna flecha.
  const previousNode = history.length >= 2 ? history[history.length - 2] : undefined;
  const isOnTechHub = currentNode === 'tecnico';
  const isTechRouteContext = isOnTechHub || (
    (TECH_ROUTE_ORDER as readonly string[]).includes(currentNode) &&
    (previousNode === 'tecnico' || (TECH_ROUTE_ORDER as readonly string[]).includes(previousNode ?? ''))
  );
  const activeOrder: readonly string[] = isTechRouteContext ? ['tecnico', ...TECH_ROUTE_ORDER] : LINEAR_ORDER;

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

  // Navegación lineal (narrativa o ruta técnica, según el contexto)
  const goToNext = useCallback(() => {
    const currentIndex = activeOrder.indexOf(currentNode);
    if (currentIndex >= 0 && currentIndex < activeOrder.length - 1) {
      navigateTo(activeOrder[currentIndex + 1]);
    }
  }, [currentNode, navigateTo, activeOrder]);

  const goToPrevious = useCallback(() => {
    const currentIndex = activeOrder.indexOf(currentNode);
    if (currentIndex > 0) {
      navigateTo(activeOrder[currentIndex - 1]);
    }
  }, [currentNode, navigateTo, activeOrder]);

  // Volver al inicio: le avisa a AudioEngine que vuelva a mostrar el
  // splash (que de otro modo no tiene forma de reactivarse una vez
  // hasInteracted queda en true) antes de vaciar el contenido.
  const goHome = useCallback(() => {
    if (isTransitioning) return;
    window.dispatchEvent(new CustomEvent('returnToSplash'));
    navigateTo('inicio');
  }, [isTransitioning, navigateTo]);

  const activeIndex = activeOrder.indexOf(currentNode);
  const isFirstInLinear = activeIndex === 0;
  const isLastInLinear = activeIndex === activeOrder.length - 1;
  const isInLinear = activeIndex >= 0;
  const nextNodeId = isInLinear && !isLastInLinear ? activeOrder[activeIndex + 1] : undefined;

  // Escuchar eventos de navegación del AudioEngine
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.target === 'explore') {
        navigateTo('mapa');
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
    nextNodeId,
  };
}
