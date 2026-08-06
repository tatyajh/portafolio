"use client";

import { motion, AnimatePresence } from 'framer-motion';
import AudioEngine from '@/components/media/AudioEngine';
import { useNodeNavigation } from '@/hooks/useNodeNavigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

import { NODES, CATEGORIES, STAMP_COLORS, LINEAR_ORDER, SEASONS } from '@/data/nodes';
import { PROJECTS } from '@/data/projects';
import { BackgroundLayer } from '@/components/background';
import { GameList } from '@/components/games';
import {
  ResumeTools, ResumeLinks, ResumeHeader, ResumeDownloadButton, ResumeSummary,
  ResumeSkills, ResumeExperience, ResumeFocusAreas, ResumeEducation, ResumeExtras,
} from '@/components/resume';
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
      <BackgroundLayer visible={['mapa', 'tecnico', 'juego', 'resume'].includes(currentNode)} />
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

              <TechIdentity />
              <TechMindset />

              <div className="space-y-5 mb-12">
                {[
                  { id: 'perfil', num: '01', title: 'Perfil', desc: 'Ingeniera de sistemas y frontend: React, TypeScript, Node.js. CV, stack y enlaces.' },
                  { id: 'estructura', num: '02', title: 'Estructura', desc: 'Código, lógica y sistemas — cómo pienso lo que construyo.' },
                  { id: 'juego', num: '03', title: 'Videojuegos', desc: 'Hechos en Unity y C#, publicados y jugables en el navegador.' },
                  { id: 'resume', num: '04', title: 'Currículum', desc: 'Experiencia, educación y formación completas — con PDF descargable.' },
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

              <ResumeLinks />

              <div className="flex justify-center">
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
              </div>
            </div>
          )}

          {/* ═══ NODO RESUME - CV completo para reclutadores ═══ */}
          {currentNode === 'resume' && (
            <div className="w-full max-w-3xl">
              <ResumeHeader />
              <ResumeDownloadButton />
              <ResumeSummary />
              <ResumeSkills />
              <ResumeExperience />
              <ResumeFocusAreas />
              <ResumeEducation />
              <ResumeExtras />

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="w-16 h-px bg-[#8B0000]/60 mx-auto mb-10"
              />

              <ResumeLinks />

              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateTo('tecnico')}
                  className="px-6 py-3 stitch-border-gold transition-all tracking-wider flex items-center gap-2 text-[#E8C9A0] hover:bg-[#E8C9A0]/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  <span>Volver a Lo técnico</span>
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
              <GameList />
            </div>
          )}

          {currentNode !== 'inicio' && currentNode !== 'mapa' && currentNode !== 'esencia' && currentNode !== 'juego' && currentNode !== 'tecnico' && currentNode !== 'resume' && (
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
              {node.tools && <ResumeTools tools={node.tools} />}

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
              {node.id === 'perfil' && <ResumeLinks />}
            </div>
          )}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
