"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Image from 'next/image';
import AudioEngine from '@/components/media/AudioEngine';
import { useNodeNavigation } from '@/hooks/useNodeNavigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

import { NODES, CATEGORIES, STAMP_COLORS, LINEAR_ORDER, SEASONS, IMAGE_CAPTIONS } from '@/data/nodes';
import { BackgroundLayer } from '@/components/background';
import { GameList } from '@/components/games';
import { ProjectList } from '@/components/projects';
import { ResumeTools, ResumeLinks, ResumeCVPanel } from '@/components/resume';
import { LanguageToggle, PersistentNav } from '@/components/navigation';
import { TechIdentity, TechMindset } from '@/components/techRoute';
import { VideoRenderer, GalleryRenderer, FramedVideo, CollageDuo, CollageGrid } from '@/components/chapters';
import { useLanguage } from '@/context/LanguageContext';
import { getCategoryLabel, getImageCaptions, getSeasonName, localizeNode, selectCopy } from '@/data/translations';

// La leyenda original de la foto del vestido (estructura-1) — la
// misma que ya vivía en IMAGE_CAPTIONS, ahora con "Dato curioso"
// encima en vez de sola.
// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════
interface PortfolioExperienceProps {
  // Nodo con el que arranca esta instancia — lo determina la ruta real
  // (/, /mapa, /tecnico, /estructura, /perfil, /juego) que renderizó
  // este componente. El resto de la navegación sigue siendo 100%
  // client-state, esto solo fija el punto de entrada.
  initialNode?: string;
}

export default function PortfolioExperience({ initialNode = 'inicio' }: PortfolioExperienceProps) {
  const { locale } = useLanguage();
  const {
    currentNode,
    node: baseNode,
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
  } = useNodeNavigation(initialNode);
  const node = localizeNode(baseNode, locale);
  const imageCaptions = getImageCaptions(node.id, IMAGE_CAPTIONS[node.id] ?? [], locale);
  const structureDressCaption = getImageCaptions('estructura', IMAGE_CAPTIONS.estructura ?? [], locale)[0];

  useKeyboardNavigation({
    goToPrevious,
    goToNext,
    navigateTo,
    goHome,
    isTransitioning,
    enabled: currentNode !== 'inicio',
  });

  // Cada nodo abre arriba del todo — sin esto, entrar a un nodo desde
  // el mapa (o navegar entre nodos) conservaba el scroll del nodo
  // anterior y podía arrancar a mitad de página.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentNode]);

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
      <AudioEngine initialNode={initialNode} />
      <LanguageToggle theme={node.theme} />

      {currentNode !== 'inicio' && (
        <motion.div
          key={`achievement-${currentNode}`}
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: [0, 1, 1, 0], y: [-14, 0, 0, -4], scale: [0.96, 1, 1, 1] }}
          transition={{ duration: 3.2, times: [0, 0.12, 0.76, 1], ease: 'easeOut' }}
          className="achievement-toast"
          aria-live="polite"
        >
          <span>{selectCopy(locale, 'Logro desbloqueado', 'Achievement unlocked')}</span>
          <strong>{node.title}</strong>
        </motion.div>
      )}

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
          // Antes forzaba min-h-screen + justify-center: en nodos con
          // poco contenido (ej. esencia, sin PROJECTS/tools/videos)
          // eso dejaba un tramo enorme de scroll vacío al final. El
          // fondo ya cubre toda la pantalla desde el wrapper raíz, así
          // que aquí basta con el alto real del contenido.
          className={`flex flex-col items-center px-6 py-20 sm:py-28 ${getTextClass()}`}
        >

          {/* ═══ MAPA INTERACTIVO ═══ */}
          {currentNode === 'mapa' && (
            <div className="w-full max-w-5xl relative">
              <div className="text-center mb-8">
                <p className="font-script text-2xl sm:text-3xl text-gold-mid/90 -rotate-2 mb-1">{selectCopy(locale, 'los hilos de mi historia…', 'the threads of my story…')}</p>
                <h2 className="font-serif text-5xl sm:text-6xl mb-4 text-ivory">{selectCopy(locale, 'Índice', 'Map')}</h2>
                <div className="stitch-line w-40 mx-auto mb-4" />
                <p className="text-gold/70">{selectCopy(locale, 'Elige cualquier nodo. No hay orden correcto.', 'Choose any node. There is no right order.')}</p>
                <button
                  onClick={() => navigateTo('tecnico')}
                  className="mt-3 font-script text-xl text-gold-mid hover:text-gold transition-colors underline decoration-dashed underline-offset-4"
                >
                  {selectCopy(locale, '¿vienes por lo técnico? atajo por aquí →', 'here for the technical work? take this shortcut →')}
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
                        {getCategoryLabel(key, cat.label, locale)}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {cat.nodes.map((nodeId, cardIdx) => {
                        const n = localizeNode(NODES[nodeId], locale);
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
                              {nodeId !== 'fin' && (
                                <span className="font-serif text-3xl leading-none" style={{ color: `${stampColor}CC` }}>
                                  {String(chapterNum).padStart(2, '0')}
                                </span>
                              )}
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
                  {selectCopy(locale, 'aventura explorada', 'adventure explored')}: {new Set(history.filter(id => (LINEAR_ORDER as readonly string[]).includes(id))).size} / {LINEAR_ORDER.length} {selectCopy(locale, 'misiones', 'missions')}
                </p>
              </div>

            </div>
          )}

          {/* ═══ NODO DE CONTENIDO NORMAL ═══ */}
          {/* ═══ NODO TÉCNICO - atajo directo para perfiles técnicos ═══ */}
          {currentNode === 'tecnico' && (
            <div className="w-full max-w-3xl">
              <div className="text-center mb-8">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-script text-2xl sm:text-3xl text-gold-mid/90 -rotate-2 mb-1"
                >
                  {selectCopy(locale, 'sin rodeos…', 'straight to the point…')}
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="font-serif text-5xl sm:text-6xl mb-4 text-ivory"
                >
                  {selectCopy(locale, 'Lo técnico', 'The technical route')}
                </motion.h2>
                <div className="stitch-line w-40 mx-auto mb-4" />
                <p className="text-gold/70">{selectCopy(locale, 'Perfil, código y juego. La historia completa te espera en el mapa.', 'Profile, code and games. The complete story is waiting on the map.')}</p>
              </div>

              <TechIdentity />

              <div className="space-y-5 mb-8">
                {[
                  { id: 'perfil', num: '01', title: selectCopy(locale, 'Perfil', 'Profile'), desc: selectCopy(locale, 'Más información sobre mí, mi CV y mis enlaces.', 'More about me, my résumés and my links.') },
                  { id: 'estructura', num: '02', title: selectCopy(locale, 'Desarrollo', 'Development'), desc: selectCopy(locale, 'Aplicaciones web y móviles que hice de punta a punta, con su código.', 'Web and mobile applications I built end to end, with their source code.') },
                  // 'destacado': la ruta técnica existe sobre todo para
                  // mostrar los videojuegos, así que esta tarjeta se
                  // diferencia de las otras dos en vez de perderse en la fila.
                  { id: 'juego', num: '03', title: selectCopy(locale, 'Videojuegos', 'Video Games'), desc: selectCopy(locale, 'Hechos en Unity y C#, publicados y jugables en el navegador.', 'Made with Unity and C#, published and playable in the browser.'), destacado: true },
                ].map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    whileHover={{ scale: 1.03, rotate: 0 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigateTo(item.id)}
                    className={`relative w-full text-left paper-card ${i % 2 === 0 ? 'tilt-l' : 'tilt-r'} ${
                      item.destacado
                        ? 'p-6 border-2 border-burgundy shadow-[0_0_0_4px_rgba(139,0,0,0.12)]'
                        : 'p-5 stitch-border'
                    }`}
                  >
                    {item.destacado && (
                      <span className="absolute -top-3 right-5 bg-burgundy text-[#f7f1e4] text-[10px] uppercase tracking-[0.18em] px-3 py-1 font-serif">
                        {selectCopy(locale, 'Lo que más disfruto', 'What I enjoy most')}
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <span className={`font-serif leading-none ${item.destacado ? 'text-5xl text-burgundy' : 'text-4xl text-burgundy/80'}`}>
                        {item.num}
                      </span>
                      <div>
                        <span className={`font-serif text-ink ${item.destacado ? 'text-2xl' : 'text-xl'}`}>{item.title}</span>
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
                  <span>{selectCopy(locale, 'Explorar el resto del portafolio', 'Explore the rest of the portfolio')}</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* ═══ NODO JUEGO - tarjeta game dev estilo collage ═══ */}
          {currentNode === 'juego' && (
            <div className="w-full max-w-3xl">
              {/* Cabecera */}
              <div className="text-center mb-8">
                <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold-mid/70">{selectCopy(locale, 'Nueva misión desbloqueada', 'New mission unlocked')}</p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[10px] tracking-[0.4em] uppercase mb-2 text-gold/50"
                >
                  {selectCopy(locale, 'Temporada 5: Conexiones', 'Season 5: Connections')}
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
                className="text-center text-ivory/80 leading-relaxed mb-8 text-base sm:text-lg max-w-xl mx-auto"
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
                className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"
              />
              {/* Header del nodo — en esencia, esencia-1 va chica a la
                  izquierda del título, en espejo con esencia-4 que
                  queda a la derecha del párrafo de abajo. */}
              {node.id === 'esencia' && node.gallery ? (
                <div className="mb-5 grid grid-cols-1 items-center gap-5 sm:grid-cols-[30%_1fr] sm:gap-8">
                  <img
                    src={node.gallery.find(s => s.includes('esencia-1'))}
                    alt="Esencia"
                    className="order-2 mx-auto h-auto w-[46%] max-w-[190px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:order-1 sm:w-full sm:max-w-none"
                  />
                  <div className="order-1 text-center sm:order-2 sm:text-left">
                    {SEASONS[node.id] && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-2 text-[10px] uppercase tracking-[0.4em] text-gold/40"
                      >
                        {getSeasonName(node.id, SEASONS[node.id].name, locale)}
                      </motion.p>
                    )}
                    {node.subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4 text-xs uppercase tracking-[0.3em] text-gold-mid"
                      >
                        {node.subtitle}
                      </motion.p>
                    )}
                    <motion.h2
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="mb-6 font-serif text-4xl text-ivory sm:text-5xl md:text-6xl"
                    >
                      {node.title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      transition={{ delay: 0.5 }}
                      className="font-serif text-xl italic text-gold sm:text-2xl"
                    >
                      {node.text}
                    </motion.p>
                  </div>
                </div>
              ) : (
              <div className="text-center mb-8">
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
                    {getSeasonName(node.id, SEASONS[node.id].name, locale)}
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
              )}

              {/* Contenido — en esencia y estructura va en dos columnas
                  con una foto sin leyenda al lado (derecha en esencia,
                  izquierda en estructura — espejo una de otra). El
                  resto de sus fotos sigue abajo, sin esta. */}
              {node.content && node.id === 'esencia' && node.gallery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-5 grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_18%] sm:gap-10"
                >
                  <p className={`text-center leading-relaxed text-lg whitespace-pre-line sm:text-left ${
                    node.theme === 'light' ? 'text-black-warm/70' : 'text-ivory/80'
                  }`}>
                    {node.content}
                  </p>
                  <img
                    src={node.gallery.find(s => s.includes('esencia-4'))}
                    alt="Esencia"
                    className="mx-auto h-auto w-[24%] max-w-[100px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:w-full sm:max-w-none"
                  />
                </motion.div>
              )}

              {node.content && node.id === 'estructura' && node.gallery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-8 grid grid-cols-1 items-center gap-5 sm:grid-cols-[34%_1fr] sm:gap-10"
                >
                  <img
                    src={node.gallery.find(s => s.includes('estructura-3'))}
                    alt={selectCopy(locale, 'Tatiana programando con la camiseta de Women Who Code Medellín', 'Tatiana coding in a Women Who Code Medellín shirt')}
                    className="mx-auto h-auto w-[46%] max-w-[200px] object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)] sm:w-full sm:max-w-none"
                  />
                  <p className={`text-center leading-relaxed text-lg whitespace-pre-line sm:text-left ${
                    node.theme === 'light' ? 'text-black-warm/70' : 'text-ivory/80'
                  }`}>
                    {node.content}
                  </p>
                </motion.div>
              )}

              {node.content && node.id !== 'esencia' && node.id !== 'estructura' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`text-center leading-relaxed mb-8 text-lg whitespace-pre-line ${
                    node.theme === 'light' ? 'text-black-warm/70' : 'text-ivory/80'
                  }`}
                >
                  {node.content}
                </motion.p>
              )}

              {/* Estructura: debajo del bloque de arriba van las otras
                  dos fotos — la del vestido lleva su leyenda original
                  con "Dato curioso" encima, la del cuarto de trabajo no
                  lleva leyenda. Luego viene "el desarrollo". */}
              {node.id === 'estructura' && node.gallery && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mb-10"
                >
                  <CollageDuo
                    items={node.gallery
                      .filter(s => s.includes('estructura-1') || s.includes('estructura-2'))
                      .map(src => ({
                        src,
                        alt: selectCopy(locale, 'Estructura', 'Structure'),
                        caption: src.includes('estructura-1') ? structureDressCaption : undefined,
                        captionLabel: src.includes('estructura-1') ? selectCopy(locale, 'Dato curioso', 'A small detail') : undefined,
                      }))}
                    mode="journal"
                  />
                </motion.div>
              )}

              {/* Proyectos de desarrollo - solo en estructura */}
              {node.id === 'estructura' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8 space-y-6"
                >
                  <div className="text-center">
                    <p className="font-script text-2xl text-gold-mid -rotate-1">
                      {selectCopy(locale, 'algunas cosas que he construido…', 'a few things I have built…')}
                    </p>
                    <a
                      href="https://www.behance.net/tatianajaramil11"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 font-script text-base text-gold-mid/60 hover:text-gold-mid underline decoration-dashed underline-offset-4"
                    >
                      {selectCopy(locale, 'mi lado de diseño vive en Behance ↗', 'my design side lives on Behance ↗')}
                    </a>
                  </div>
                  <ProjectList />
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

              {/* Galería de imágenes - Layouts específicos por nodo.
                  estructura ya renderizó su galería arriba, junto al
                  texto y antes del desarrollo. */}
              {node.gallery && node.gallery.length > 0 && node.id !== 'estructura' && (
                <GalleryRenderer nodeId={node.id} gallery={node.gallery} />
              )}

              {/* Videos moda 4-5 al final de diseño (después de imágenes) */}
              {node.id === 'diseno' && node.videos && node.videos.length >= 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="mb-8 w-full"
                >
                  <div className="grid grid-cols-2 gap-3">
                    {[node.videos[3], node.videos[4]].map((src, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <FramedVideo src={src} maxHeight="50vh" />
                        <p className="text-sm sm:text-base italic text-center caption-glow">
                          — {i === 0
                            ? selectCopy(locale, 'Un recorrido por mis desfiles', 'A journey through my runway shows')
                            : selectCopy(locale, 'Portafolio de insumos de costura', 'Sewing materials portfolio')} —
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Diseño: las fotos de la muñeca y la de retazos van al
                  final, debajo de los últimos dos videos, no mezcladas
                  con los figurines de arriba. */}
              {node.id === 'diseno' && node.gallery && (
                <CollageGrid
                  items={node.gallery
                    .filter(s => s.includes('diseño-1') || s.includes('diseño-2') || s.includes('diseño-4'))
                    .map(src => ({
                      src,
                      alt: selectCopy(locale, 'Diseño', 'Design'),
                      caption: imageCaptions[node.gallery!.indexOf(src)],
                      paired: src.includes('diseño-1') || src.includes('diseño-2'),
                    }))}
                  mode="editorial"
                />
              )}

              {/* Presentación editorial y selector de CV por enfoque e idioma. */}
              {node.id === 'perfil' && (
                <ResumeCVPanel />
              )}

              {/* Línea decorativa */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`w-16 h-px mx-auto mb-8 ${
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
