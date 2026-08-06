"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioEngine from '@/components/media/AudioEngine';
import { MEDIA } from '@/lib/media';

import { NODES, CATEGORIES, STAMP_COLORS, LINEAR_ORDER, SEASONS, IMAGE_CAPTIONS } from '@/data/nodes';
import type { Node } from '@/data/nodes';
import { GAMES } from '@/data/games';
import { PROJECTS } from '@/data/projects';
import { BackgroundLayer } from '@/components/background';

// ═══════════════════════════════════════════════════════════════════
// VIDEO RENDERER - Tamaños específicos por nodo
// ═══════════════════════════════════════════════════════════════════
function VideoRenderer({ nodeId, videos }: { nodeId: string; videos: readonly string[] }) {
  // SONIDO: video grande (filarmónica)
  if (nodeId === 'sonido') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10"
      >
        <div className="overflow-hidden bg-[#0a0808] border border-[#8B0000]/30 max-w-[95%] mx-auto">
          <video
            src={videos[0]}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>
      </motion.div>
    );
  }
  
  // DISEÑO: solo videos 1-3 (videos 4-5 se renderizan aparte después de la galería)
  if (nodeId === 'diseno') {
    const firstVideos = videos.slice(0, 3);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10 flex flex-col gap-4"
      >
        {firstVideos.map((src, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="overflow-hidden bg-[#0a0808] border border-[#8B0000]/30 w-full">
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>
        ))}
      </motion.div>
    );
  }
  
  // IDENTIDAD: me-01 grande, me-02 más pequeño
  if (nodeId === 'identidad') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10 flex flex-col gap-4 items-center"
      >
        {/* me-01 grande */}
        {videos[0] && (
          <div className="overflow-hidden bg-[#0a0808] border border-[#8B0000]/30 w-full">
            <video
              src={videos[0]}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        )}
        {/* me-02 tal cual */}
        {videos[1] && (
          <div className="overflow-hidden bg-[#0a0808] border border-[#8B0000]/30 max-w-[100%] sm:max-w-[320px]">
            <video
              src={videos[1]}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full h-auto max-h-[60vh] object-contain"
            />
          </div>
        )}
      </motion.div>
    );
  }

  // Por defecto: layout estándar
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mb-10 flex flex-row flex-wrap justify-center gap-3"
    >
      {videos.map((src, i) => (
        <div key={i} className="overflow-hidden bg-[#0a0808] border border-[#8B0000]/30 max-w-[100%] sm:max-w-[320px]">
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-auto max-h-[60vh] object-contain"
          />
        </div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GALLERY RENDERER - Layouts específicos por nodo
// ═══════════════════════════════════════════════════════════════════
function GalleryRenderer({ nodeId, gallery, theme }: { nodeId: string; gallery: readonly string[]; theme?: string }) {
  const captions = IMAGE_CAPTIONS[nodeId] || [];
  
  // CUERPO: 2 fotos por fila, sin captions
  if (nodeId === 'cuerpo') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-12"
      >
        <div className="grid grid-cols-2 gap-3">
          {gallery.map((src, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              className="overflow-hidden border border-[#8B0000]/10"
            >
              <img 
                src={src} 
                alt={`${nodeId} ${index + 1}`}
                className="w-full h-auto object-contain hover:scale-[1.02] transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // HERENCIA: captions debajo de cada foto
  if (nodeId === 'herencia') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-12"
      >
        <div className="grid grid-cols-1 gap-6">
          {gallery.map((src, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              className="flex flex-col gap-2"
            >
              <div className="overflow-hidden border border-[#8B0000]/10">
                <img 
                  src={src} 
                  alt={captions[index] || `${nodeId} ${index + 1}`}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
              {captions[index] && (
                <p className={`text-sm sm:text-base italic text-center ${
                  theme === 'light' ? 'caption-glow-dark' : 'caption-glow'
                }`}>
                  — {captions[index]} —
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // ESTRUCTURA: caption debajo de estructura-1, resto sin caption
  if (nodeId === 'estructura') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex flex-col gap-4">
          {/* Estructura-1 con caption */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col gap-2"
          >
            <div className="overflow-hidden border border-[#8B0000]/10">
              <img 
                src={gallery[0]} 
                alt="estructura 1"
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
            {captions[0] && (
              <p className={`text-sm sm:text-base italic text-center ${
                theme === 'light' ? 'caption-glow-dark' : 'caption-glow'
              }`}>
                — {captions[0]} —
              </p>
            )}
          </motion.div>

          {/* Resto de imágenes sin caption */}
          {gallery.slice(1).map((src, index) => (
            <motion.div 
              key={index + 1}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              className="overflow-hidden border border-[#8B0000]/10"
            >
              <img 
                src={src} 
                alt={`estructura ${index + 2}`}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
  
  // DISEÑO: layout personalizado
  if (nodeId === 'diseno') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-12 w-full"
      >
        {/* Figurín 1 + Figurín 2 - lado a lado */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          {[0, 1].map((idx, i) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              <div className="overflow-hidden border border-[#8B0000]/10">
                <img src={gallery[idx]} alt={captions[idx] || `figurín ${idx + 1}`} className="w-full h-auto object-contain" loading="lazy" />
              </div>
              {captions[idx] && (
                <p className={`text-sm sm:text-base italic text-center ${theme === 'light' ? 'caption-glow-dark' : 'caption-glow'}`}>
                  — {captions[idx]} —
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Figurín 3 + Diseño 4 (retazos) - lado a lado */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            <div className="overflow-hidden border border-[#8B0000]/10">
              <img src={gallery[2]} alt={captions[2] || 'figurín 3'} className="w-full h-auto object-contain" loading="lazy" />
            </div>
            {captions[2] && (
              <p className={`text-sm sm:text-base italic text-center ${theme === 'light' ? 'caption-glow-dark' : 'caption-glow'}`}>
                — {captions[2]} —
              </p>
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            <div className="overflow-hidden border border-[#8B0000]/10">
              <img src={gallery[9]} alt={captions[9] || 'diseño 4'} className="w-full h-auto object-contain" loading="lazy" />
            </div>
            {captions[9] && (
              <p className={`text-sm sm:text-base italic text-center ${theme === 'light' ? 'caption-glow-dark' : 'caption-glow'}`}>
                — {captions[9]} —
              </p>
            )}
          </motion.div>
        </div>

        {/* Figurín 4 + Figurín 5 - lado a lado */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          {[3, 4].map((idx, i) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
              className="flex flex-col gap-2"
            >
              <div className="overflow-hidden border border-[#8B0000]/10">
                <img src={gallery[idx]} alt={captions[idx] || `figurín ${idx + 1}`} className="w-full h-auto object-contain" loading="lazy" />
              </div>
              {captions[idx] && (
                <p className={`text-sm sm:text-base italic text-center ${theme === 'light' ? 'caption-glow-dark' : 'caption-glow'}`}>
                  — {captions[idx]} —
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Diseño 1 + Diseño 2 - lado a lado con leyenda compartida */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          className="flex flex-col gap-3 mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            {[6, 7].map((idx, i) => (
              <div key={idx} className="overflow-hidden border border-[#8B0000]/10">
                <img src={gallery[idx]} alt={`diseño ${i + 1}`} className="w-full h-auto object-contain" loading="lazy" />
              </div>
            ))}
          </div>
          <p className={`text-sm sm:text-base italic text-center ${theme === 'light' ? 'caption-glow-dark' : 'caption-glow'}`}>
            — A veces también me gusta tejer —
          </p>
        </motion.div>

        {/* Figurín 6 - ancho completo con leyenda */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="flex flex-col gap-2 mb-2"
        >
          <div className="overflow-hidden border border-[#8B0000]/10">
            <img src={gallery[5]} alt={captions[5] || 'figurín 6'} className="w-full h-auto object-contain" loading="lazy" />
          </div>
          {captions[5] && (
            <p className={`text-sm sm:text-base italic text-center ${theme === 'light' ? 'caption-glow-dark' : 'caption-glow'}`}>
              — {captions[5]} —
            </p>
          )}
        </motion.div>

        {/* Diseño 3 - grande, sin leyenda, justo debajo de figurín 6 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.3 }}
          className="mb-6"
        >
          <div className="overflow-hidden border border-[#8B0000]/10">
            <img src={gallery[8]} alt="diseño 3" className="w-full h-auto object-contain" loading="lazy" />
          </div>
        </motion.div>
      </motion.div>
    );
  }
  
  // Por defecto: grid simple sin captions (arte, sonido, mixto, proceso, quiebre, identidad, perfil, esencia)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mb-12"
    >
      <div className="grid grid-cols-1 gap-4">
        {gallery.map((src, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            className="overflow-hidden border border-[#8B0000]/10"
          >
            <img 
              src={src} 
              alt={`${nodeId} ${index + 1}`}
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function Home() {
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

  const getBgClass = () => {
    if (node.theme === 'accent') return 'bg-[#1a1512]'; // Gris con tinte dorado
    if (node.theme === 'light') return 'bg-[#faf5f0]'; // Crema muy claro
    if (node.theme === 'paper') return 'paper-bg'; // Papel collage
    return 'bg-[#0a0808]'; // Negro profundo
  };

  const getTextClass = () => {
    if (node.theme === 'light') return 'text-[#1a1512]';
    if (node.theme === 'paper') return 'text-[#f5f0e6]'; // Marfil sobre mesa oscura
    return 'text-[#f5f0e6]'; // Marfil
  };

  return (
    <div className={`min-h-screen w-screen overflow-hidden transition-colors duration-500 ${getBgClass()}`}
      style={{ background: node.theme === 'dark' ? 'radial-gradient(ellipse at center, #1a1512 0%, #0a0808 100%)' : undefined }}>
      <BackgroundLayer visible={['mapa', 'tecnico', 'juego'].includes(currentNode)} />
      <AudioEngine />

      {/* Header fijo - oculto durante splash */}
      <header className={`fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-between items-center ${currentNode === 'inicio' ? 'hidden' : ''}`}>
        {/* Botón anterior (navegación lineal con nombre de nodo) */}
        {isInLinear && !isFirstInLinear && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={goToPrevious}
            className={`flex items-center gap-2 px-4 py-2 border transition-all ${
              node.theme === 'light' 
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

          {/* ═══ MAPA INTERACTIVO ═══ */}
          {currentNode === 'mapa' && (
            <div className="w-full max-w-5xl relative">
              <div className="text-center mb-12">
                <p className="font-script text-2xl sm:text-3xl text-[#D4A574]/90 -rotate-2 mb-1">los hilos de mi historia…</p>
                <h2 className="font-serif text-5xl sm:text-6xl mb-4 text-[#f5f0e6]">Índice</h2>
                <div className="stitch-line w-40 mx-auto mb-4" />
                <p className="text-[#E8C9A0]/70">Elige cualquier nodo. No hay orden correcto.</p>
                <button
                  onClick={() => navigateTo('tecnico')}
                  className="mt-3 font-script text-xl text-[#D4A574] hover:text-[#E8C9A0] transition-colors underline decoration-dashed underline-offset-4"
                >
                  ¿vienes por lo técnico? atajo por aquí →
                </button>
              </div>

              {/* Grid de categorías */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(CATEGORIES).map(([key, cat]) => {
                  const stampColor = STAMP_COLORS[cat.color] ?? cat.color;
                  return (
                  <div key={key} className="space-y-4">
                    {/* Sello de categoría tipo estampilla */}
                    <div className="flex justify-center">
                      <div
                        className="stamp w-20 h-20 px-2 text-[10px] tracking-[0.15em] uppercase font-serif bg-[#eadfc2]/70"
                        style={{ color: stampColor }}
                      >
                        {cat.label}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {cat.nodes.map((nodeId, cardIdx) => {
                        const n = NODES[nodeId];
                        const visited = history.includes(nodeId);
                        const chapterNum = LINEAR_ORDER.indexOf(nodeId as typeof LINEAR_ORDER[number]) + 1;
                        return (
                          <motion.button
                            key={nodeId}
                            whileHover={{ scale: 1.03, rotate: 0 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigateTo(nodeId)}
                            className={`w-full text-left p-4 paper-card stitch-border transition-all ${cardIdx % 2 === 0 ? 'tilt-l' : 'tilt-r'}`}
                            style={{
                              borderColor: visited ? `${stampColor}90` : undefined,
                              backgroundColor: visited ? '#f3e8cb' : undefined,
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="font-serif text-3xl leading-none" style={{ color: `${stampColor}CC` }}>
                                {nodeId === 'fin' ? '✦' : String(chapterNum).padStart(2, '0')}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-serif text-lg text-[#2a2018]">{n.title}</span>
                                  {visited && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stampColor} strokeWidth="3">
                                      <path d="M20 6L9 17l-5-5"/>
                                    </svg>
                                  )}
                                </div>
                                <p className="font-script text-base leading-tight text-[#6b5540] line-clamp-2">{n.text}</p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Progreso */}
              <div className="mt-12 text-center">
                <p className="font-script text-xl text-[#D4A574]/70">
                  hilvanado: {new Set(history).size - 1} / {Object.keys(NODES).length - 3} nodos
                </p>
              </div>

              {/* Nota ingeniería + creatividad */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-16 text-center max-w-md mx-auto"
              >
                <div className="stitch-line w-12 mx-auto mb-5" />
                <p className="font-serif text-sm italic text-[#E8C9A0]/50 leading-relaxed">
                  Hecho con <span className="text-[#D4A574]">React</span>, <span className="text-[#D4A574]">Next.js</span> y <span className="text-[#D4A574]">TypeScript</span> — donde la ingeniería y la creatividad habitan el mismo espacio.
                </p>
                <div className="stitch-line w-12 mx-auto mt-5" />
              </motion.div>
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

              {/* Imágenes */}
              {node.gallery && node.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mb-10"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {node.gallery.map((src, i) => (
                      <div key={i} className="overflow-hidden border border-[#8B0000]/20">
                        <img
                          src={src}
                          alt={`${node.title} ${i + 1}`}
                          className="w-full h-auto object-contain hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Línea decorativa */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="w-16 h-px bg-[#8B0000]/60 mx-auto mb-10"
              />

              {/* Navegación inferior: Siguiente + Mapa */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <p className={`text-center text-xs uppercase tracking-[0.3em] text-[#8B0000]/40`}>
                  1 / {LINEAR_ORDER.length}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {/* Botón Siguiente */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNext}
                    className="px-8 py-4 border transition-all tracking-wider flex items-center gap-3 bg-[#E8C9A0] text-[#0a0808] border-[#E8C9A0] hover:bg-[#F0D0A0]"
                  >
                    <span>{NODES[LINEAR_ORDER[1]]?.title}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </motion.button>

                  {/* Botón Volver al mapa */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('mapa')}
                    className="px-6 py-3 border transition-all tracking-wider flex items-center gap-2 border-[#E8C9A0]/30 text-[#E8C9A0] hover:border-[#E8C9A0]/60 hover:bg-[#E8C9A0]/5"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                    </svg>
                    <span>Volver al mapa</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ═══ NODO DE CONTENIDO NORMAL ═══ */}
          {/* ═══ NODO TÉCNICO - atajo directo para perfiles técnicos ═══ */}
          {currentNode === 'tecnico' && (
            <div className="w-full max-w-3xl">
              <div className="text-center mb-12">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-script text-2xl sm:text-3xl text-[#D4A574]/90 -rotate-2 mb-1"
                >
                  sin rodeos…
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="font-serif text-5xl sm:text-6xl mb-4 text-[#f5f0e6]"
                >
                  Lo técnico
                </motion.h2>
                <div className="stitch-line w-40 mx-auto mb-4" />
                <p className="text-[#E8C9A0]/70">Perfil, código y juego. La historia completa te espera en el mapa.</p>
              </div>

              <div className="space-y-5 mb-12">
                {[
                  { id: 'perfil', num: '03', title: 'Perfil', desc: 'Ingeniera de sistemas y frontend: React, TypeScript, Node.js. CV, stack y enlaces.' },
                  { id: 'estructura', num: '07', title: 'Estructura', desc: 'Código, lógica y sistemas — cómo pienso lo que construyo.' },
                  { id: 'juego', num: '12', title: 'Videojuegos', desc: 'Hechos en Unity y C#, publicados y jugables en el navegador.' },
                ].map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    whileHover={{ scale: 1.03, rotate: 0 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full text-left p-5 paper-card stitch-border ${i % 2 === 0 ? 'tilt-l' : 'tilt-r'}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-serif text-4xl leading-none text-[#8B0000]/80">{item.num}</span>
                      <div>
                        <span className="font-serif text-xl text-[#2a2018]">{item.title}</span>
                        <p className="font-script text-lg leading-tight text-[#6b5540]">{item.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <a
                  href="https://github.com/tatyajh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-[#E8C9A0] text-[#0a0808] font-serif tracking-wider hover:bg-[#F0D0A0] transition-all flex items-center gap-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('mapa')}
                  className="px-6 py-3 stitch-border-gold transition-all tracking-wider flex items-center gap-2 text-[#E8C9A0] hover:bg-[#E8C9A0]/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                  </svg>
                  <span>Ver toda la historia</span>
                </motion.button>
              </motion.div>
            </div>
          )}

          {/* ═══ NODO JUEGO - tarjeta game dev estilo collage ═══ */}
          {currentNode === 'juego' && (
            <div className="w-full max-w-3xl">
              {/* Cabecera */}
              <div className="text-center mb-12">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10px] tracking-[0.4em] uppercase mb-2 text-[#E8C9A0]/50"
                >
                  Temporada 5: Conexiones
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs tracking-[0.3em] uppercase mb-4 text-[#D4A574]"
                >
                  {node.subtitle}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl mb-5 text-[#f5f0e6]"
                >
                  {node.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.5 }}
                  className="font-script text-3xl text-[#D4A574] -rotate-1 inline-block"
                >
                  {node.text}
                </motion.p>
              </div>

              {/* Intro del capítulo */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center text-[#f5f0e6]/80 leading-relaxed mb-12 text-base sm:text-lg max-w-xl mx-auto"
              >
                {node.content}
              </motion.p>

              {/* Galería: una tarjeta de papel por juego */}
              {GAMES.map((game, gi) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20, rotate: gi % 2 === 0 ? -2 : 2 }}
                  animate={{ opacity: 1, y: 0, rotate: gi % 2 === 0 ? -1 : 1 }}
                  transition={{ delay: 0.6 + gi * 0.2, duration: 0.5 }}
                  className="paper-card stitch-border relative p-6 sm:p-10 mb-12"
                >
                  {/* Cintas washi */}
                  <div className="tape -top-3 left-8 -rotate-6" />
                  <div className="tape -top-3 right-8 rotate-3" />

                  {/* Sello game dev */}
                  <div className="absolute -top-9 -right-3 sm:-right-9 stamp w-24 h-24 px-2 text-[9px] uppercase tracking-[0.15em] font-serif text-[#8B0000] bg-[#d9c49c]">
                    Game · Dev · {game.year}
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-[#2a2018] mb-5">{game.title}</h3>

                  {/* Gameplay en loop */}
                  {game.video && (
                    <div className="mb-8 stitch-border-gold overflow-hidden">
                      <video
                        src={game.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-auto"
                      />
                    </div>
                  )}

                  <p className="text-[#2a2018]/80 leading-relaxed mb-10 text-base sm:text-lg">
                    {game.desc}
                  </p>

                  {/* Ficha técnica */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-center">
                    {[
                      { label: 'Rol', value: game.rol },
                      { label: 'Motor', value: game.motor },
                      { label: 'Lenguaje', value: game.lenguaje },
                      { label: 'Género', value: game.genero },
                    ].map(item => (
                      <div key={item.label} className="stitch-border-gold p-3 bg-[#d9c49c]/50">
                        <p className="text-[10px] uppercase tracking-widest text-[#A0522D] mb-1">{item.label}</p>
                        <p className="font-serif text-[#2a2018]">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Banderín de enlaces */}
                  <p className="font-script text-2xl text-[#8B0000] mb-4 -rotate-1">Enlaces para ver más…</p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={game.playUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-[#8B0000] text-[#f7f1e4] font-serif tracking-wider hover:bg-[#6B0000] transition-all flex items-center gap-3"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      Jugar en itch.io
                    </a>
                    <a
                      href={game.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 stitch-border text-[#2a2018] font-serif tracking-wider hover:bg-[#8B0000]/5 transition-all flex items-center gap-3"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      Ver el código
                    </a>
                  </div>
                </motion.div>
              ))}

              {/* Navegación inferior */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <p className="text-center text-xs uppercase tracking-[0.3em] text-[#E8C9A0]/40">
                  {LINEAR_ORDER.indexOf('juego') + 1} / {LINEAR_ORDER.length}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNext}
                    className="px-8 py-4 border transition-all tracking-wider flex items-center gap-3 bg-[#8B0000] text-[#f7f1e4] border-[#8B0000] hover:bg-[#6B0000]"
                  >
                    <span>{NODES[LINEAR_ORDER[LINEAR_ORDER.indexOf('juego') + 1]]?.title}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('mapa')}
                    className="px-6 py-3 stitch-border-gold transition-all tracking-wider flex items-center gap-2 text-[#E8C9A0] hover:bg-[#E8C9A0]/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                    </svg>
                    <span>Volver al mapa</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {currentNode !== 'inicio' && currentNode !== 'mapa' && currentNode !== 'esencia' && currentNode !== 'juego' && currentNode !== 'tecnico' && (
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
                {/* Indicador de temporada */}
                {SEASONS[node.id] && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-[10px] tracking-[0.4em] uppercase mb-2 ${
                      node.theme === 'light' ? 'text-[#8B0000]/50' : 'text-[#E8C9A0]/40'
                    }`}
                  >
                    {SEASONS[node.id].name}
                  </motion.p>
                )}
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

              {/* Contenido */}
              {node.content && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`text-center leading-relaxed mb-12 text-lg whitespace-pre-line ${
                    node.theme === 'light' ? 'text-[#1a1512]/70' : 'text-[#f5f0e6]/80'
                  }`}
                >
                  {node.content}
                </motion.p>
              )}

              {/* Proyectos de desarrollo - solo en estructura */}
              {node.id === 'estructura' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-12 space-y-6"
                >
                  <p className="font-script text-2xl text-center text-[#D4A574] -rotate-1">
                    algunas cosas que he construido…
                  </p>
                  {PROJECTS.map((p, i) => (
                    <div
                      key={p.id}
                      className={`paper-card stitch-border relative p-5 sm:p-6 ${i % 2 === 0 ? 'tilt-l' : 'tilt-r'}`}
                    >
                      <div className="tape -top-3 left-8 -rotate-6" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                        <h3 className="font-serif text-2xl text-[#2a2018]">{p.title}</h3>
                        <span className="text-[10px] uppercase tracking-widest text-[#A0522D]">{p.stack}</span>
                      </div>
                      <p className="font-script text-lg text-[#6b5540] leading-snug mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-3">
                        {p.links.map(l => (
                          <a
                            key={l.label}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 stitch-border text-sm font-serif tracking-wider text-[#8B0000] hover:bg-[#8B0000]/5 transition-all"
                          >
                            {l.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Chips de herramientas - solo en perfil */}
              {node.tools && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="w-full mb-12 space-y-6"
                >
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#8B0000] mb-3 text-center">Desarrollo</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {node.tools.digital.map(tool => (
                        <span key={tool} className="px-3 py-1 border border-[#E8C9A0]/20 text-[#E8C9A0]/70 text-sm tracking-wide">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase text-[#8B0000] mb-3 text-center">Diseño de Modas</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {node.tools.diseno.map(tool => (
                        <span key={tool} className="px-3 py-1 border border-[#8B0000]/40 text-[#E8C9A0]/70 text-sm tracking-wide">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Media - Videos con layouts específicos por nodo */}
              {(node.videos ?? (node.media ? [node.media.src as string] : [])).length > 0 && (
                <VideoRenderer nodeId={node.id} videos={node.videos ?? (node.media ? [node.media.src as string] : [])} />
              )}

              {/* Galería de imágenes - Layouts específicos por nodo */}
              {node.gallery && node.gallery.length > 0 && (
                <GalleryRenderer nodeId={node.id} gallery={node.gallery} theme={node.theme} />
              )}

              {/* Videos moda 4-5 al final de diseño (después de imágenes) */}
              {node.id === 'diseno' && node.videos && node.videos.length >= 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="mb-10 w-full"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[node.videos[3], node.videos[4]].map((src, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="overflow-hidden bg-[#0a0808] border border-[#8B0000]/30">
                          <video
                            src={src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            className="w-full h-auto max-h-[50vh] object-contain"
                          />
                        </div>
                        <p className="text-sm sm:text-base italic text-center caption-glow">
                          — {i === 0 ? 'Un recorrido por mis desfiles' : 'Portafolio de insumos de costura'} —
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
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

              {/* Links externos - solo en perfil */}
              {node.id === 'perfil' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-4 mb-12"
                >
                  <a
                    href="https://www.linkedin.com/in/tarjah/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 border border-[#8B0000]/40 text-[#E8C9A0] hover:bg-[#8B0000]/10 transition-all tracking-wider text-sm uppercase"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://www.behance.net/tatianajaramil11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 border border-[#8B0000]/40 text-[#E8C9A0] hover:bg-[#8B0000]/10 transition-all tracking-wider text-sm uppercase"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.051-1.965-5.051-5.0 0-2.937 1.93-5 5.012-5 3.093 0 4.86 1.893 5.14 4.9H17.9c-.073-.854-.557-1.9-2.302-1.9-1.699 0-2.573 1.268-2.573 2.999 0 1.742.875 3 2.577 3 1.617 0 2.191-.938 2.387-2h2.737zM9.5 8.5H6v7h3.5c1.493 0 2.5-.828 2.5-2 0-.874-.455-1.547-1.168-1.836C11.355 11.42 11.75 10.73 11.75 10c0-1.133-.869-1.5-2.25-1.5zM8 10h1.25c.517 0 .75.207.75.58 0 .38-.28.58-.85.58H8v-1.16zm1.5 4H8v-1.5h1.5c.585 0 .875.271.875.75s-.29.75-.875.75zM16.5 5.5h-5v1.5h5V5.5z"/>
                    </svg>
                    Behance
                  </a>
                  <a
                    href="https://github.com/tatyajh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 border border-[#8B0000]/40 text-[#E8C9A0] hover:bg-[#8B0000]/10 transition-all tracking-wider text-sm uppercase"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                </motion.div>
              )}

              {/* Navegación inferior: Siguiente + Mapa */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                {/* Indicador de capítulo */}
                {isInLinear && (
                  <p className={`text-center text-xs uppercase tracking-[0.3em] ${
                    node.theme === 'light' ? 'text-[#8B0000]/40' : 'text-[#E8C9A0]/40'
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
                      onClick={goToNext}
                      className={`px-8 py-4 border transition-all tracking-wider flex items-center gap-3 ${
                        node.theme === 'light'
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
                    onClick={() => navigateTo('mapa')}
                    className={`px-6 py-3 border transition-all tracking-wider flex items-center gap-2 ${
                      node.theme === 'light'
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
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
