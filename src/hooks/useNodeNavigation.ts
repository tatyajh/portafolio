"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { NODES, LINEAR_ORDER, TECH_ROUTE_ORDER } from '@/data/nodes';

// Nodos que tienen una ruta real en el App Router (el resto de los 17
// nodos sigue viviendo solo en el estado de React, sin URL propia).
// El sync de URL es un efecto añadido sobre la navegación existente:
// usamos window.history.pushState/replaceState en vez de
// router.push/replace de next/navigation a propósito — así solo se
// actualiza la barra de direcciones, sin disparar una navegación real
// de Next (que desmontaría este árbol de componentes, cortando las
// animaciones y el historial en memoria de useNodeNavigation).
const NODE_TO_ROUTE: Record<string, string> = {
  inicio: '/',
  mapa: '/mapa',
  tecnico: '/tecnico',
  estructura: '/estructura',
  perfil: '/perfil',
  juego: '/juego',
};

const ROUTE_TO_NODE: Record<string, string> = Object.fromEntries(
  Object.entries(NODE_TO_ROUTE).map(([node, route]) => [route, node])
);

export function useNodeNavigation(initialNode: string = 'inicio') {
  const [currentNode, setCurrentNode] = useState<string>(initialNode);
  const [history, setHistory] = useState<string[]>(initialNode !== 'inicio' ? [initialNode] : []);
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
  const activeOrder: readonly string[] = useMemo(
    () => (isTechRouteContext ? ['tecnico', ...TECH_ROUTE_ORDER] : LINEAR_ORDER),
    [isTechRouteContext]
  );

  // Actualiza solo la barra de direcciones (ver comentario de
  // NODE_TO_ROUTE arriba) para los nodos que tienen ruta real. Los
  // demás nodos no tocan la URL, igual que antes.
  const syncUrl = useCallback((nodeId: string) => {
    if (typeof window === 'undefined') return;
    const route = NODE_TO_ROUTE[nodeId];
    if (!route || window.location.pathname === route) return;
    window.history.pushState({ node: nodeId }, '', route);
  }, []);

  const navigateTo = useCallback((nodeId: string) => {
    if (isTransitioning || !NODES[nodeId]) return;
    // Navegación instantánea desde splash screen
    if (currentNode === 'inicio') {
      setCurrentNode(nodeId);
      setHistory(prev => [...prev, nodeId]);
      syncUrl(nodeId);
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNode(nodeId);
      setHistory(prev => [...prev, nodeId]);
      setIsTransitioning(false);
      syncUrl(nodeId);
    }, 300);
  }, [isTransitioning, currentNode, syncUrl]);

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

  // Atrás/adelante del navegador: como la URL se actualiza a mano con
  // pushState (ver syncUrl), Next.js no re-renderiza nada por su
  // cuenta al volver — hay que leer la ruta destino y reflejarla en el
  // estado nosotros mismos. Solo actuamos si el pathname corresponde a
  // uno de los nodos con ruta propia; si no, lo dejamos como está.
  useEffect(() => {
    const handlePopState = () => {
      const nodeId = ROUTE_TO_NODE[window.location.pathname];
      if (!nodeId || !NODES[nodeId]) return;
      setIsTransitioning(false);
      setCurrentNode(nodeId);
      setHistory(prev => (prev[prev.length - 1] === nodeId ? prev : [...prev, nodeId]));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Escuchar eventos de navegación del AudioEngine
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.target === 'explore') {
        navigateTo('mapa');
      } else if (typeof detail?.target === 'string') {
        navigateTo(detail.target);
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
