"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioEngine from '@/components/media/AudioEngine';
import { MEDIA } from '@/lib/media';

// ═══════════════════════════════════════════════════════════════════
// DATOS DE NODOS - Estructura no lineal tipo Encarta
// ═══════════════════════════════════════════════════════════════════
interface Node {
  id: string;
  title: string;
  category: 'raiz' | 'herencia' | 'expresion' | 'transformacion' | 'mixto';
  subtitle?: string;
  text: string;
  content?: string;
  media?: { type: 'video' | 'images'; src: string | string[] };
  gallery?: readonly string[];
  connections: string[];
  theme?: 'dark' | 'light' | 'accent';
}

const NODES: Record<string, Node> = {
  inicio: {
    id: 'inicio',
    title: 'Hilos Invisibles',
    category: 'raiz',
    text: 'Todo lo que soy viene de una historia que empezó antes que yo.',
    connections: ['mapa'],
    theme: 'dark',
  },
  mapa: {
    id: 'mapa',
    title: 'Explorar',
    category: 'raiz',
    text: 'Elige tu camino. No hay orden correcto.',
    connections: ['esencia', 'herencia', 'sonido', 'estructura', 'cuerpo', 'quiebre', 'mixto'],
    theme: 'dark',
  },
  esencia: {
    id: 'esencia',
    title: 'Esencia',
    category: 'raiz',
    subtitle: 'Lo que define',
    text: 'Antes de saber que quería diseñar, ya estaba diseñando.',
    content: 'Nunca me conformé con lo que encontraba. Buscaba piezas que no existían en las tiendas — lo vintage, lo oscuro, lo que contaba algo. Cuando no las encontraba, iba donde mi abuela. Ella me ayudaba a hacerlas realidad, o me decía a quién mandarlas a hacer. Sin saberlo, ya estaba creando.',
    connections: ['herencia', 'identidad', 'mapa'],
    theme: 'dark',
  },
  herencia: {
    id: 'herencia',
    title: 'Herencia',
    category: 'herencia',
    subtitle: 'Capítulo 1',
    text: 'Antes de mí, ya había manos que cosían para sostener.',
    content: 'Mi abuela materna sostuvo a su familia con una máquina básica. Mi abuela paterna cosía cobijas para donar. La costura como acto emocional.',
    connections: ['arte', 'esencia', 'mapa', 'sonido'],
    theme: 'dark',
  },
  arte: {
    id: 'arte',
    title: 'Arte Familiar',
    category: 'herencia',
    subtitle: 'Conexión',
    text: 'El arte siempre estuvo cerca… pero nunca pensé que era para mí.',
    content: 'Crecí creyendo que no era creativa. Pero el arte ya vivía en mi familia.',
    connections: ['herencia', 'quiebre', 'mapa'],
    theme: 'dark',
  },
  sonido: {
    id: 'sonido',
    title: 'Sonido',
    category: 'expresion',
    subtitle: 'Capítulo 2',
    text: 'Primero aprendí a expresar sin palabras.',
    content: 'El saxofón me enseñó sobre respiración, ritmo, pausas. Cada nota es un momento, cada silencio una decisión.',
    media: { type: 'video', src: MEDIA.video.musica },
    gallery: MEDIA.images.musica,
    connections: ['estructura', 'mixto', 'mapa'],
    theme: 'dark',
  },
  estructura: {
    id: 'estructura',
    title: 'Estructura',
    category: 'expresion',
    subtitle: 'Capítulo 3',
    text: 'Luego aprendí a pensar en estructuras.',
    content: 'Código, lógica, sistemas. La ingeniería me dio un marco para entender cómo las partes se conectan para formar algo funcional.',
    gallery: MEDIA.images.ingenieria,
    connections: ['cuerpo', 'diseno', 'mapa'],
    theme: 'dark',
  },
  cuerpo: {
    id: 'cuerpo',
    title: 'Cuerpo',
    category: 'expresion',
    subtitle: 'Capítulo 4',
    text: 'Después entendí el cuerpo desde dentro.',
    content: 'El pole dance me enseñó movimiento, fuerza, control. Sentir el cuerpo como territorio, no como objeto.',
    gallery: MEDIA.images.pole,
    connections: ['mixto', 'diseno', 'mapa'],
    theme: 'dark',
  },
  quiebre: {
    id: 'quiebre',
    title: 'Quiebre',
    category: 'transformacion',
    subtitle: 'Capítulo 5',
    text: 'Crecí creyendo que no era creativa.',
    content: 'Pero el arte ya vivía en mi familia. Y la costura también. Un desajuste interno que pedía algo diferente.',
    connections: ['diseno', 'arte', 'mapa'],
    theme: 'accent',
  },
  diseno: {
    id: 'diseno',
    title: 'Diseño',
    category: 'transformacion',
    subtitle: 'Capítulo 6',
    text: 'Ya no solo construía estructuras. Empecé a construir ideas.',
    content: 'Moodboards, procesos creativos, desfiles, experimentación. El diseño de modas como lenguaje — no solo técnica, sino forma de pensar y comunicar.',
    gallery: MEDIA.images.diseno,
    connections: ['identidad', 'estructura', 'proceso', 'mapa'],
    theme: 'dark',
  },
  identidad: {
    id: 'identidad',
    title: 'Identidad',
    category: 'transformacion',
    subtitle: 'Capítulo 7',
    text: 'Todo lo anterior vive en lo que hago.',
    content: 'Música, lógica, cuerpo, herencia — cada capa se integra en las prendas finales. Esto no empezó ahora. Esto siempre estuvo ahí.',
    connections: ['fin', 'mapa', 'mixto'],
    theme: 'light',
  },
  mixto: {
    id: 'mixto',
    title: 'Conexiones',
    category: 'mixto',
    subtitle: 'Contenido especial',
    text: 'Cuando las disciplinas se encuentran.',
    content: 'Saxofón + Pole. Dos mundos que parecían separados, unidos en un solo momento.',
    media: { type: 'video', src: MEDIA.video.mixto },
    connections: ['sonido', 'cuerpo', 'mapa'],
    theme: 'dark',
  },
  proceso: {
    id: 'proceso',
    title: 'Fuera del proceso',
    category: 'mixto',
    subtitle: 'Lo que nutre',
    text: 'También me detengo. Aprender también es observar.',
    content: 'Lectura constante, anime como influencia visual y narrativa, momentos de pausa con vino o cerveza. No todo es producir — a veces es absorber, reflexionar, vivir.',
    connections: ['diseno', 'identidad', 'mapa'],
    theme: 'dark',
  },
  fin: {
    id: 'fin',
    title: 'Gracias',
    category: 'raiz',
    text: 'Gracias por explorar mi historia.',
    content: 'Cada prenda que creo lleva todas estas capas. Cada decisión viene de un proceso que no empezó en un taller, sino en una vida.',
    connections: ['mapa', 'inicio'],
    theme: 'dark',
  },
};

// Categorías para el mapa - Paleta oro-rosa con borgoña como acento
const CATEGORIES = {
  esencia: { label: 'Esencia', color: '#8B0000', nodes: ['esencia'] }, // Borgoña
  herencia: { label: 'Raíces', color: '#D4A574', nodes: ['herencia', 'arte'] }, // Oro medio
  expresion: { label: 'Expresión', color: '#E8C9A0', nodes: ['sonido', 'estructura', 'cuerpo'] }, // Oro-rosa suave
  transformacion: { label: 'Transformación', color: '#F0D0A0', nodes: ['quiebre', 'diseno', 'identidad'] }, // Oro-rosa claro
  mixto: { label: 'Conexiones', color: '#8B0000', nodes: ['mixto', 'proceso'] }, // Borgoña
};

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function Home() {
  const [currentNode, setCurrentNode] = useState<string>('inicio');
  const [history, setHistory] = useState<string[]>(['inicio']);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const node = NODES[currentNode];

  const navigateTo = useCallback((nodeId: string) => {
    if (isTransitioning || !NODES[nodeId]) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNode(nodeId);
      setHistory(prev => [...prev, nodeId]);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setCurrentNode(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  }, [history]);

  const getBgClass = () => {
    if (node.theme === 'accent') return 'bg-[#1a1512]'; // Gris con tinte dorado
    if (node.theme === 'light') return 'bg-[#faf5f0]'; // Crema muy claro
    return 'bg-[#0a0808]'; // Negro profundo
  };

  const getTextClass = () => {
    if (node.theme === 'light') return 'text-[#1a1512]';
    return 'text-[#f5f0e6]'; // Marfil
  };

  return (
    <div className={`min-h-screen w-screen overflow-hidden transition-colors duration-500 ${getBgClass()}`}
      style={{ background: node.theme === 'dark' ? 'radial-gradient(ellipse at center, #1a1512 0%, #0a0808 100%)' : undefined }}>
      <AudioEngine />

      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center">
        {/* Botón volver */}
        {history.length > 1 && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={goBack}
            className={`flex items-center gap-2 px-4 py-2 border transition-all ${
              node.theme === 'light' 
                ? 'border-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574]/10' 
                : 'border-[#E8C9A0]/40 text-[#E8C9A0] hover:bg-[#E8C9A0]/10'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <span className="text-sm tracking-wider">Volver</span>
          </motion.button>
        )}
        {history.length <= 1 && <div />}

        {/* Botón mapa */}
        {currentNode !== 'mapa' && currentNode !== 'inicio' && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigateTo('mapa')}
            className={`flex items-center gap-2 px-4 py-2 border transition-all ${
              node.theme === 'light' 
                ? 'border-[#D4A574]/30 text-[#D4A574] hover:bg-[#D4A574]/10' 
                : 'border-[#E8C9A0]/40 text-[#E8C9A0] hover:bg-[#E8C9A0]/10'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
            </svg>
            <span className="text-sm tracking-wider">Explorar</span>
          </motion.button>
        )}
      </header>

      {/* Contenido principal */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentNode}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.5 }}
          className={`min-h-screen flex flex-col items-center justify-center px-6 py-24 ${getTextClass()}`}
        >
          {/* ═══ INICIO ═══ */}
          {currentNode === 'inicio' && (
            <div className="text-center max-w-3xl">
              {/* Línea decorativa - oro-rosa */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                className="w-32 h-px bg-gradient-to-r from-transparent via-[#E8C9A0] to-transparent mx-auto mb-10"
              />
              <motion.h1 
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-serif text-5xl sm:text-7xl md:text-8xl mb-6 text-[#f5f0e6]"
              >
                {node.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="font-serif text-xl sm:text-2xl text-[#D4A574]/90 italic mb-16"
              >
                {node.text}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => navigateTo('herencia')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#E8C9A0] text-[#0a0808] font-medium hover:bg-[#F0D0A0] transition-all hover:scale-105 tracking-wider"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Seguir la historia
                </button>
                <button
                  onClick={() => navigateTo('mapa')}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#D4A574]/50 text-[#E8C9A0] font-medium hover:bg-[#D4A574]/10 transition-all hover:scale-105 tracking-wider"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                  </svg>
                  Explorar libremente
                </button>
              </motion.div>
            </div>
          )}

          {/* ═══ MAPA INTERACTIVO ═══ */}
          {currentNode === 'mapa' && (
            <div className="w-full max-w-5xl">
              <div className="text-center mb-12">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#E8C9A0] to-transparent mx-auto mb-8" />
                <h2 className="font-serif text-4xl sm:text-5xl mb-4 text-[#f5f0e6]">Explora</h2>
                <p className="text-[#D4A574]/80">Elige cualquier nodo. No hay orden correcto.</p>
              </div>

              {/* Grid de categorías */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <div key={key} className="space-y-3">
                    <h3 className="text-sm tracking-wider uppercase opacity-50" style={{ color: cat.color }}>
                      {cat.label}
                    </h3>
                    <div className="space-y-2">
                      {cat.nodes.map(nodeId => {
                        const n = NODES[nodeId];
                        const visited = history.includes(nodeId);
                        return (
                          <motion.button
                            key={nodeId}
                            whileHover={{ scale: 1.02, x: 8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigateTo(nodeId)}
                            className={`w-full text-left p-4 border transition-all ${
                              visited 
                                ? 'border-[#E8C9A0]/40 bg-[#E8C9A0]/5' 
                                : 'border-[#f5f0e6]/10 hover:border-[#D4A574]/30 hover:bg-[#D4A574]/5'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-lg text-[#f5f0e6]">{n.title}</span>
                              {visited && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8C9A0" strokeWidth="2">
                                  <path d="M20 6L9 17l-5-5"/>
                                </svg>
                              )}
                            </div>
                            <p className="text-sm text-[#f5f0e6]/50 mt-1 line-clamp-1">{n.text}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progreso */}
              <div className="mt-12 text-center">
                <p className="text-sm opacity-40">
                  Explorado: {new Set(history).size - 1} / {Object.keys(NODES).length - 2} nodos
                </p>
              </div>
            </div>
          )}

          {/* ═══ NODO ESENCIA ═══ */}
          {currentNode === 'esencia' && (
            <div className="w-full max-w-3xl">
              {/* Línea decorativa superior */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                className="w-24 h-px bg-gradient-to-r from-transparent via-[#8B0000] to-transparent mx-auto mb-10"
              />

              {/* Título */}
              <div className="text-center mb-10">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#8B0000] text-xs tracking-[0.4em] uppercase mb-4"
                >
                  {node.subtitle}
                </motion.p>
                <motion.h2 
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-serif text-5xl sm:text-6xl md:text-7xl text-[#f5f0e6] mb-6"
                >
                  {node.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.5 }}
                  className="font-serif text-xl sm:text-2xl italic text-[#8B0000]"
                >
                  {node.text}
                </motion.p>
              </div>

              {/* Historia */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mb-12"
              >
                <p className="text-[#f5f0e6]/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                  {node.content}
                </p>
              </motion.div>

              {/* Línea decorativa */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-16 h-px bg-[#8B0000]/60 mx-auto mb-10"
              />

              {/* Conexiones */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-center text-sm uppercase tracking-wider mb-6 text-[#8B0000]/60">
                  ¿A dónde ir?
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {node.connections.map(connId => {
                    const conn = NODES[connId];
                    if (!conn) return null;
                    const isMap = connId === 'mapa';
                    return (
                      <motion.button
                        key={connId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo(connId)}
                        className={`px-6 py-3 border transition-all tracking-wider ${
                          isMap
                            ? 'border-[#8B0000]/30 text-[#8B0000] hover:border-[#8B0000]/60'
                            : 'border-[#E8C9A0]/40 text-[#f5f0e6] hover:bg-[#E8C9A0]/10'
                        }`}
                      >
                        {isMap ? '← Volver al mapa' : conn.title}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* ═══ NODO DE CONTENIDO NORMAL ═══ */}
          {currentNode !== 'inicio' && currentNode !== 'mapa' && currentNode !== 'esencia' && (
            <div className="w-full max-w-3xl">
              {/* Línea decorativa */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                className="w-24 h-px bg-gradient-to-r from-transparent via-[#E8C9A0] to-transparent mx-auto mb-10"
              />
              {/* Header del nodo */}
              <div className="text-center mb-10">
                {node.subtitle && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-xs tracking-[0.3em] uppercase mb-4 ${
                      node.theme === 'light' ? 'text-[#1a1512]/50' : 'text-[#D4A574]'
                    }`}
                  >
                    {node.subtitle}
                  </motion.p>
                )}
                <motion.h2 
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className={`font-serif text-4xl sm:text-5xl md:text-6xl mb-6 ${
                    node.theme === 'light' ? 'text-[#1a1512]' : 'text-[#f5f0e6]'
                  }`}
                >
                  {node.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.5 }}
                  className={`font-serif text-xl sm:text-2xl italic ${
                    node.theme === 'light' ? 'text-[#D4A574]/70' : 'text-[#E8C9A0]'
                  }`}
                >
                  {node.text}
                </motion.p>
              </div>

              {/* Media */}
              {node.media && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mb-10"
                >
                  {node.media.type === 'video' && (
                    <div className="aspect-video overflow-hidden bg-[#0a0808] border border-[#8B0000]/30">
                      <video
                        src={node.media.src as string}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Galería de imágenes */}
              {node.gallery && node.gallery.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-10"
                >
                  <div className={`grid grid-cols-${node.gallery.length === 1 ? '1' : node.gallery.length === 2 ? '2' : '3'} gap-4`}>
                    {node.gallery.map((src, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                        className="aspect-square overflow-hidden border border-[#8B0000]/20"
                      >
                        <img 
                          src={src} 
                          alt={`${node.title} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contenido */}
              {node.content && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`text-center leading-relaxed mb-12 text-lg ${
                    node.theme === 'light' ? 'text-[#1a1512]/70' : 'text-[#f5f0e6]/80'
                  }`}
                >
                  {node.content}
                </motion.p>
              )}

              {/* Línea decorativa */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`w-16 h-px mx-auto mb-10 ${
                  node.theme === 'light' ? 'bg-[#8B0000]/20' : 'bg-gradient-to-r from-[#8B0000]/0 via-[#8B0000]/60 to-[#8B0000]/0'
                }`}
              />

              {/* Conexiones */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <p className={`text-center text-sm uppercase tracking-wider mb-6 ${
                  node.theme === 'light' ? 'text-[#D4A574]/40' : 'text-[#D4A574]/60'
                }`}>
                  ¿A dónde ir?
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {node.connections.map(connId => {
                    const conn = NODES[connId];
                    if (!conn) return null;
                    const isMap = connId === 'mapa';
                    return (
                      <motion.button
                        key={connId}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigateTo(connId)}
                        className={`px-6 py-3 border transition-all tracking-wider ${
                          isMap
                            ? node.theme === 'light'
                              ? 'border-[#8B0000]/30 text-[#8B0000]/60 hover:border-[#8B0000]/50'
                              : 'border-[#8B0000]/30 text-[#8B0000]/60 hover:border-[#8B0000]/50'
                            : node.theme === 'light'
                              ? 'border-[#8B0000]/40 text-[#8B0000] hover:bg-[#8B0000]/10'
                              : 'border-[#E8C9A0]/50 text-[#f5f0e6] hover:bg-[#E8C9A0]/20'
                        }`}
                      >
                        {isMap ? '← Volver al mapa' : conn.title}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
