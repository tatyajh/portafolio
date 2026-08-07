"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AudioEngine from '@/components/media/AudioEngine';
import { useNodeNavigation } from '@/hooks/useNodeNavigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

import { NODES, CATEGORIES, STAMP_COLORS, LINEAR_ORDER, SEASONS } from '@/data/nodes';
import { PROJECTS } from '@/data/projects';
import { BackgroundLayer } from '@/components/background';
import { GameList } from '@/components/games';
import { ResumeTools, ResumeLinks, ResumeDownloadButton } from '@/components/resume';
import { PersistentNav } from '@/components/navigation';
import { TechIdentity, TechMindset } from '@/components/techRoute';
import { VideoRenderer, GalleryRenderer } from '@/components/chapters';

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
export default function Home() {
  const {
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
  } = useNodeNavigation();

  useKeyboardNavigation({
    goToPrevious,
    goToNext,
    navigateTo,
    goHome,
    isTransitioning,
    enabled: currentNode !== 'inicio',
  });

  const getBgClass = () => {
    if (node.theme === 'accent') return 'bg-black-warm'; // Gris con tinte dorado
    if (node.theme === 'light') return 'bg-ivory-pale'; // Crema muy claro
    if (node.theme === 'paper') return 'paper-bg'; // Papel collage
    return 'bg-black'; // Negro profundo
  };

  const getTextClass = () => {
    if (node.theme === 'light') return 'text-black-warm';
    if (node.theme === 'paper') return 'text-ivory'; // Marfil sobre mesa oscura
    return 'text-ivory'; // Marfil
  };

  return (
    <div className={`relative z-0 min-h-screen w-screen overflow-hidden transition-colors duration-500 ${getBgClass()}`}
      style={{ background: node.theme === 'dark' ? 'radial-gradient(ellipse at center, var(--color-black-warm) 0%, var(--color-black) 100%)' : undefined }}>
      <BackgroundLayer visible={currentNode !== 'inicio'} section={currentNode} />
      <AudioEngine />

      {/* Navegación persistente flotante - oculta durante splash */}
      <PersistentNav
        currentNode={currentNode}
        theme={node.theme}
        category={node.category}
        history={history}
        isFirstInLinear={isFirstInLinear}
        isLastInLinear={isLastInLinear}
        isInLinear={isInLinear}
        nextNodeId={nextNodeId}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onGoToMap={() => navigateTo('mapa')}
        onGoHome={goHome}
        onNavigate={navigateTo}
      />

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
                <p className="font-script text-2xl sm:text-3xl text-gold-mid/90 -rotate-2 mb-1">los hilos de mi historia…</p>
                <h2 className="font-serif text-5xl sm:text-6xl mb-4 text-ivory">Índice</h2>
                <div className="stitch-line w-40 mx-auto mb-4" />
                <p className="text-gold/70">Elige cualquier nodo. No hay orden correcto.</p>
                <button
                  onClick={() => navigateTo('tecnico')}
                  className="mt-3 font-script text-xl text-gold-mid hover:text-gold transition-colors underline decoration-dashed underline-offset-4"
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
                        className="stamp w-24 h-24 px-2 text-[11px] font-semibold tracking-[0.08em] uppercase font-serif bg-paper"
                        style={{ color: stampColor, transform: 'rotate(-3deg)' }}
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
                                  <span className="font-serif text-lg text-ink">{n.title}</span>
                                  {visited && (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stampColor} strokeWidth="3">
                                      <path d="M20 6L9 17l-5-5"/>
                                    </svg>
                                  )}
                                </div>
                                <p className="font-script text-base leading-tight text-ink-light line-clamp-2">{n.text}</p>
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
                <p className="font-script text-xl text-gold-mid/70">
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
                <p className="font-serif text-sm italic text-gold/50 leading-relaxed">
                  Hecho con <span className="text-gold-mid">React</span>, <span className="text-gold-mid">Next.js</span> y <span className="text-gold-mid">TypeScript</span> — donde la ingeniería y la creatividad habitan el mismo espacio.
                </p>
                <div className="stitch-line w-12 mx-auto mt-5" />
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
                  className="font-script text-2xl sm:text-3xl text-gold-mid/90 -rotate-2 mb-1"
                >
                  sin rodeos…
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="font-serif text-5xl sm:text-6xl mb-4 text-ivory"
                >
                  Lo técnico
                </motion.h2>
                <div className="stitch-line w-40 mx-auto mb-4" />
                <p className="text-gold/70">Perfil, código y juego. La historia completa te espera en el mapa.</p>
              </div>

              <TechIdentity />

              <div className="space-y-5 mb-12">
                {[
                  { id: 'perfil', num: '01', title: 'Perfil', desc: 'Ingeniera de sistemas y frontend: React, TypeScript, Node.js. CV completo y enlaces.' },
                  { id: 'estructura', num: '02', title: 'Estructura', desc: 'Código, lógica y sistemas — cómo pienso lo que construyo.' },
                  { id: 'juego', num: '03', title: 'Videojuegos', desc: 'Hechos en Unity y C#, publicados y jugables en el navegador.' },
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
                      <span className="font-serif text-4xl leading-none text-burgundy/80">{item.num}</span>
                      <div>
                        <span className="font-serif text-xl text-ink">{item.title}</span>
                        <p className="font-script text-lg leading-tight text-ink-light">{item.desc}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <ResumeLinks />

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('mapa')}
                  className="px-6 py-3 stitch-border-gold transition-all tracking-wider flex items-center gap-2 text-gold hover:bg-gold/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
                  </svg>
                  <span>Explorar el resto del portafolio</span>
                </motion.button>
              </div>
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
                  className="text-[10px] tracking-[0.4em] uppercase mb-2 text-gold/50"
                >
                  Temporada 5: Conexiones
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs tracking-[0.3em] uppercase mb-4 text-gold-mid"
                >
                  {node.subtitle}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-serif text-4xl sm:text-5xl md:text-6xl mb-5 text-ivory"
                >
                  {node.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.5 }}
                  className="font-script text-3xl text-gold-mid -rotate-1 inline-block"
                >
                  {node.text}
                </motion.p>
              </div>

              {/* Intro del capítulo */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center text-ivory/80 leading-relaxed mb-12 text-base sm:text-lg max-w-xl mx-auto"
              >
                {node.content}
              </motion.p>

              {/* Galería: una tarjeta de papel por juego */}
              <GameList />
            </div>
          )}

          {currentNode !== 'inicio' && currentNode !== 'mapa' && currentNode !== 'juego' && currentNode !== 'tecnico' && (
            <div className="w-full max-w-3xl">
              {/* Línea decorativa */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
                className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-10"
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
                      node.theme === 'light' ? 'text-burgundy/50' : 'text-gold/40'
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
                      node.theme === 'light' ? 'text-black-warm/50' : 'text-gold-mid'
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
                    node.theme === 'light' ? 'text-black-warm' : 'text-ivory'
                  }`}
                >
                  {node.title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.5 }}
                  className={`font-serif text-xl sm:text-2xl italic ${
                    node.theme === 'light' ? 'text-gold-mid/70' : 'text-gold'
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
                    node.theme === 'light' ? 'text-black-warm/70' : 'text-ivory/80'
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
                  <p className="font-script text-2xl text-center text-gold-mid -rotate-1">
                    algunas cosas que he construido…
                  </p>
                  {PROJECTS.map((p, i) => (
                    <div
                      key={p.id}
                      className={`paper-card stitch-border relative p-5 sm:p-6 ${i % 2 === 0 ? 'tilt-l' : 'tilt-r'}`}
                    >
                      <div className="tape -top-3 left-8 -rotate-6" />
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                        <h3 className="font-serif text-2xl text-ink">{p.title}</h3>
                        <span className="text-[10px] uppercase tracking-widest text-brown">{p.stack}</span>
                      </div>
                      <p className="font-script text-lg text-ink-light leading-snug mb-4">{p.desc}</p>
                      <div className="flex flex-wrap gap-3">
                        {p.links.map(l => (
                          <a
                            key={l.label}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 stitch-border text-sm font-serif tracking-wider text-burgundy hover:bg-burgundy/5 transition-all"
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
              {node.tools && <ResumeTools tools={node.tools} />}

              {/* Cómo pienso - solo en perfil (antes vivía en Lo técnico,
                  se veía como si fuera clickeable junto a las tarjetas de
                  navegación reales; aquí no compite con nada navegable) */}
              {node.id === 'perfil' && <TechMindset />}

              {/* Media - Videos con layouts específicos por nodo */}
              {(node.videos ?? (node.media ? [node.media.src as string] : [])).length > 0 && (
                <VideoRenderer nodeId={node.id} videos={node.videos ?? (node.media ? [node.media.src as string] : [])} />
              )}

              {/* Galería de imágenes - Layouts específicos por nodo */}
              {node.gallery && node.gallery.length > 0 && (
                <GalleryRenderer nodeId={node.id} gallery={node.gallery} />
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
                        <div className="overflow-hidden bg-black border border-burgundy/30">
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

              {/* Hoja de vida completa - solo en perfil, la imagen real tal cual */}
              {node.id === 'perfil' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-10"
                >
                  <p className="font-script text-2xl text-center text-gold-mid -rotate-1 mb-4">
                    mi hoja de vida completa
                  </p>
                  <div className="overflow-hidden border border-burgundy/10 mb-6">
                    <Image
                      src="/media/cv/cv.png"
                      alt="Currículum de Tatiana Alejandra Jaramillo Hoyos"
                      width={1024}
                      height={1536}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <ResumeDownloadButton />
                </motion.div>
              )}

              {/* Línea decorativa */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`w-16 h-px mx-auto mb-10 ${
                  node.theme === 'light' ? 'bg-burgundy/20' : 'bg-gradient-to-r from-burgundy/0 via-burgundy/60 to-burgundy/0'
                }`}
              />

              {/* Links externos - solo en perfil */}
              {node.id === 'perfil' && <ResumeLinks />}
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
