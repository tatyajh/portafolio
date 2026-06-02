"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioEngine from '@/components/media/AudioEngine';
import { MEDIA } from '@/lib/media';

// ═══════════════════════════════════════════════════════════════════
// DATOS DE NODOS - Estructura no lineal tipo Encarta
// ═══════════════════════════════════════════════════════════════════
interface Node {
  id: string;
  title: string;
  category: 'raiz' | 'herencia' | 'expresion' | 'transformacion' | 'mixto' | 'esencia';
  subtitle?: string;
  text: string;
  content?: string;
  media?: { type: 'video' | 'images'; src: string | string[] };
  videos?: readonly string[];
  gallery?: readonly string[];
  tools?: { digital: string[]; diseno: string[] };
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
    connections: ['esencia', 'herencia', 'arte', 'sonido', 'estructura', 'cuerpo', 'quiebre', 'diseno', 'mixto', 'identidad', 'perfil', 'proceso'],
    theme: 'dark',
  },
  esencia: {
    id: 'esencia',
    title: 'Esencia',
    category: 'esencia',
    subtitle: 'Capítulo 1',
    text: 'Antes de saber que quería diseñar, ya estaba diseñando.',
    content: 'Nunca me conformé con lo que encontraba. Buscaba piezas que no existían en las tiendas — lo vintage, lo oscuro, lo que contaba algo. Cuando no las encontraba, iba donde mi abuela. Ella me ayudaba a hacerlas realidad, o me decía a quién mandarlas a hacer. Sin saberlo, ya estaba creando.',
    gallery: MEDIA.images.esencia,
    connections: ['identidad', 'mapa'],
    theme: 'dark',
  },
  herencia: {
    id: 'herencia',
    title: 'Herencia',
    category: 'herencia',
    subtitle: 'Capítulo 4',
    text: 'Antes de mí, ya había manos que cosían para sostener.',
    content: 'Mi abuela materna sostuvo a su familia con una máquina básica. Mi abuela paterna cosía cobijas para donar. La costura como acto emocional.',
    gallery: MEDIA.images.herencia,
    connections: ['arte', 'esencia', 'mapa', 'sonido'],
    theme: 'dark',
  },
  arte: {
    id: 'arte',
    title: 'Arte Familiar',
    category: 'herencia',
    subtitle: 'Conexión',
    text: 'El arte siempre estuvo cerca… pero nunca pensé que era para mí.',
    gallery: MEDIA.images.arte,
    connections: ['herencia', 'quiebre', 'mapa'],
    theme: 'dark',
  },
  sonido: {
    id: 'sonido',
    title: 'Sonido',
    category: 'expresion',
    subtitle: 'Capítulo 6',
    text: 'Primero aprendí a expresar sin palabras.',
    content: 'He tenido el honor de tocar con la Filarmónica Metropolitana.\n\nEl saxofón me enseñó sobre respiración, ritmo, pausas. Cada nota es un momento, cada silencio una decisión.',
    media: { type: 'video', src: MEDIA.video.musica },
    gallery: MEDIA.images.musica,
    connections: ['estructura', 'mixto', 'mapa'],
    theme: 'dark',
  },
  estructura: {
    id: 'estructura',
    title: 'Estructura',
    category: 'expresion',
    subtitle: 'Capítulo 7',
    text: 'Luego aprendí a pensar en estructuras.',
    content: 'Código, lógica, sistemas. La ingeniería me dio un marco para entender cómo las partes se conectan para formar algo funcional.',
    gallery: MEDIA.images.estructura,
    connections: ['cuerpo', 'diseno', 'mapa'],
    theme: 'dark',
  },
  cuerpo: {
    id: 'cuerpo',
    title: 'Cuerpo',
    category: 'expresion',
    subtitle: 'Capítulo 8',
    text: 'Después entendí el cuerpo desde dentro.',
    content: 'El pole dance me enseñó movimiento, fuerza, control. Sentir el cuerpo como territorio, no como objeto. He competido en pole y gané medalla de plata — una de las cosas que más me ha enseñado sobre disciplina, confianza y presencia.\n\nLo que empezó como deporte se convirtió en otra forma de crear.',
    videos: [MEDIA.video.pole, MEDIA.video.pole2],
    gallery: MEDIA.images.pole,
    connections: ['mixto', 'diseno', 'mapa'],
    theme: 'dark',
  },
  quiebre: {
    id: 'quiebre',
    title: 'Quiebre',
    category: 'transformacion',
    subtitle: 'Capítulo 9',
    text: 'Durante mucho tiempo creí que no era una persona creativa.',
    content: 'Aprendí a encontrar valor en la lógica, la estructura y las respuestas correctas.\n\nY aunque crecí rodeada de arte, costura e historias de creación, nunca pensé que ese mundo también podía pertenecerme.\n\nLa vida terminó cuestionando esa idea.\n\nEl accidente cerebrovascular de mi padre, la experiencia de vivir lejos de casa y la dificultad de comunicarme en otro idioma me obligaron a mirar las cosas desde otro lugar.\n\nFue entonces cuando entendí algo que había pasado por alto durante años:\n\nlas cosas hechas con las manos también son una forma de lenguaje.\n\nY quizá la creatividad nunca estuvo ausente.\n\nQuizá simplemente había aprendido a no verla.',
    gallery: MEDIA.images.quiebre,
    connections: ['diseno', 'arte', 'mapa'],
    theme: 'accent',
  },
  diseno: {
    id: 'diseno',
    title: 'Diseño de Modas',
    category: 'transformacion',
    subtitle: 'Capítulo 10',
    text: 'Ya no solo construía estructuras. Empecé a construir ideas.',
    content: 'Moodboards, procesos creativos, desfiles, experimentación. El diseño de modas como lenguaje — no solo técnica, sino forma de pensar y comunicar.',
    media: { type: 'video', src: MEDIA.video.moda },
    videos: [MEDIA.video.moda, MEDIA.video.moda2, MEDIA.video.moda3, MEDIA.video.moda4, MEDIA.video.moda5],
    gallery: MEDIA.images.diseno,
    connections: ['identidad', 'estructura', 'proceso', 'mapa'],
    theme: 'dark',
  },
  identidad: {
    id: 'identidad',
    title: 'Tatiana Alejandra',
    category: 'esencia',
    subtitle: 'Capítulo 2',
    text: 'Más allá del trabajo y los proyectos.',
    content: 'Aquí no hay proyectos.\n\nNo hay entregas.\n\nNo hay resultados.\n\nSolo recuerdos, lugares, personas y pequeños instantes que también me construyeron.',
    videos: [MEDIA.video.me, MEDIA.video.me2],
    connections: ['perfil', 'fin', 'mapa', 'mixto'],
    theme: 'light',
  },
  perfil: {
    id: 'perfil',
    title: 'Perfil',
    category: 'esencia',
    subtitle: 'Capítulo 3',
    text: 'Ingeniera de sistemas con alma creativa.',
    content: 'Soy ingeniera de sistemas, desarrolladora frontend y estudiante de diseño de modas. Durante años construí soluciones digitales utilizando React, TypeScript y tecnologías web modernas. Con el tiempo descubrí que la necesidad de crear también existía fuera de la pantalla, llevándome a explorar el diseño de modas como una nueva forma de materializar ideas. Hoy mi trabajo se encuentra en la intersección entre estructura y creatividad, tecnología y diseño, lógica e intuición.',
    tools: {
      digital: ['React', 'TypeScript', 'Node.js', 'Git', 'Supabase', 'Jest', 'Playwright', 'ChatGPT', 'Copilot'],
      diseno: ['Canva', 'Illustrator', 'Optitex'],
    },
    gallery: MEDIA.images.perfil,
    connections: ['identidad', 'diseno', 'mapa'],
    theme: 'dark',
  },
  mixto: {
    id: 'mixto',
    title: 'Conexiones',
    category: 'mixto',
    subtitle: 'Capítulo 11',
    text: 'Cuando las disciplinas se encuentran.',
    content: 'Hay momentos en que todo lo que soy converge en un solo instante. El cuerpo, el sonido, el movimiento. Sin separación.',
    videos: [MEDIA.video.mixto, MEDIA.video.mixto2],
    gallery: MEDIA.images.mixto,
    connections: ['sonido', 'cuerpo', 'mapa'],
    theme: 'dark',
  },
  proceso: {
    id: 'proceso',
    title: 'Fuera del proceso',
    category: 'mixto',
    subtitle: 'Capítulo 12',
    text: 'También me detengo. Aprender también es observar.',
    content: 'Lectura constante, anime como influencia visual y narrativa, momentos de pausa con vino o cerveza. Disfruto escuchar jazz, metal y música clásica. No todo es producir — a veces es absorber, reflexionar, vivir.',
    gallery: MEDIA.images.anexo,
    connections: ['diseno', 'identidad', 'mapa'],
    theme: 'dark',
  },
  fin: {
    id: 'fin',
    title: 'Gracias',
    category: 'raiz',
    text: 'Gracias por explorar mi historia.',
    content: 'Cada prenda que creo lleva todas estas capas. Cada decisión viene de un proceso que no empezó en un taller, sino en una vida.\n\nEsto no es un portafolio de llegadas. Es un mapa de lo que me trajo hasta aquí.\n\nGracias por caminar un rato por él.',
    connections: ['mapa', 'inicio'],
    theme: 'dark',
  },
};

// Categorías para el mapa - Paleta oro-rosa con borgoña como acento
const CATEGORIES = {
  esencia: { label: 'Esencia', color: '#8B0000', nodes: ['esencia', 'identidad', 'perfil'] },
  herencia: { label: 'Raíces', color: '#A0522D', nodes: ['herencia', 'arte'] },
  expresion: { label: 'Expresión', color: '#C4874A', nodes: ['sonido', 'estructura', 'cuerpo'] },
  transformacion: { label: 'Transformación', color: '#D4A574', nodes: ['quiebre', 'diseno'] },
  mixto: { label: 'Conexiones', color: '#E8C9A0', nodes: ['mixto', 'proceso', 'fin'] },
};

// ═══════════════════════════════════════════════════════════════════
// ORDEN LINEAL DE NAVEGACIÓN - 5 Temporadas, 12 nodos
// ═══════════════════════════════════════════════════════════════════
const LINEAR_ORDER = [
  // Temp 1 - Esencia
  'esencia',    // Cap 1
  'identidad',  // Cap 2 (Tatiana Alejandra)
  'perfil',     // Cap 3
  // Temp 2 - Raíces
  'herencia',   // Cap 4
  'arte',       // Cap 5
  // Temp 3 - Expresión
  'sonido',     // Cap 6
  'estructura', // Cap 7
  'cuerpo',     // Cap 8
  // Temp 4 - Transformación
  'quiebre',    // Cap 9
  'diseno',     // Cap 10
  // Temp 5 - Conexiones
  'mixto',      // Cap 11
  'proceso',    // Cap 12
  'fin',        // Cierre
] as const;

// ═══════════════════════════════════════════════════════════════════
// TEMPORADAS PARA UI
// ═══════════════════════════════════════════════════════════════════
const SEASONS: Record<string, { name: string; total: number }> = {
  esencia: { name: 'Temporada 1: Esencia', total: 3 },
  identidad: { name: 'Temporada 1: Esencia', total: 3 },
  perfil: { name: 'Temporada 1: Esencia', total: 3 },
  herencia: { name: 'Temporada 2: Raíces', total: 2 },
  arte: { name: 'Temporada 2: Raíces', total: 2 },
  sonido: { name: 'Temporada 3: Expresión', total: 3 },
  estructura: { name: 'Temporada 3: Expresión', total: 3 },
  cuerpo: { name: 'Temporada 3: Expresión', total: 3 },
  quiebre: { name: 'Temporada 4: Transformación', total: 2 },
  diseno: { name: 'Temporada 4: Transformación', total: 2 },
  mixto: { name: 'Temporada 5: Conexiones', total: 3 },
  proceso: { name: 'Temporada 5: Conexiones', total: 3 },
  fin: { name: 'Temporada 5: Conexiones', total: 3 },
};

// ═══════════════════════════════════════════════════════════════════
// CAPTIONS PARA IMÁGENES - Solo donde se requieren
// ═══════════════════════════════════════════════════════════════════
const IMAGE_CAPTIONS: Record<string, string[]> = {
  // Solo el vestido, debajo
  estructura: ['El vestido de grado me lo hizo mi abuela. Yo quería estilo años 50.'],
  // Herencia: debajo de cada foto
  herencia: [
    'Mi abuela materna y su máquina de coser',
    'Las manos que sostuvieron a la familia',
    'Costura como herencia viva',
    'De generación en generación'
  ],
  // Diseño: figurines, amigurumi, diseños
  diseno: [
    'Diseños propuestos para el primer semestre',        // Figurín 1 (index 0)
    'Actividad de universo casual, transformar una pieza', // Figurín 2 (index 1)
    'Diseños propuestos para universo urbano',           // Figurín 3 (index 2)
    'Diseños propuestos para universo interior',         // Figurín 4 (index 3)
    'Actividades elaboradas durante el nivel 3 para fichas técnicas y conceptualizaciones', // Figurín 5 (index 4)
    'Vestido de baño realizado en la clase de confección en el nivel 3', // Figurín 6 (index 5)
    '',                                                  // Diseño 1 (index 6)
    '',                                                  // Diseño 2 (index 7)
    '',                                                  // Diseño 3 (index 8) - sin leyenda
    'Retazos de ropa de mi familia que quería transformar' // Diseño 4 (index 9)
  ],
  // Sin captions: arte, sonido, cuerpo, mixto, proceso, quiebre, identidad, perfil, esencia
};

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
  
  // ESTRUCTURA: solo caption del vestido, debajo
  if (nodeId === 'estructura') {
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
        {captions[0] && (
          <p className={`text-sm sm:text-base italic text-center mt-4 ${
            theme === 'light' ? 'caption-glow-dark' : 'caption-glow'
          }`}>
            — {captions[0]} —
          </p>
        )}
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
      }
    };
    window.addEventListener('navigateTo', handleNavigate);
    return () => window.removeEventListener('navigateTo', handleNavigate);
  }, [navigateTo]);

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
              {/* Patrón ULTRA denso tipo tela estampada - fondo decorativo */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                {/* Hilos horizontales densos */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`hilo-h-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.02, 0.07, 0.02] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                    className="absolute w-full h-[1px]"
                    style={{ 
                      top: `${2 + i * 5}%`,
                      background: `linear-gradient(90deg, transparent, ${i % 4 === 0 ? '#E8C9A0' : i % 4 === 1 ? '#8B0000' : i % 4 === 2 ? '#C4874A' : '#D4A574'}50, transparent)`,
                    }}
                  />
                ))}
                {/* Hilos verticales densos */}
                {[...Array(18)].map((_, i) => (
                  <motion.div
                    key={`hilo-v-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.02, 0.06, 0.02] }}
                    transition={{ duration: 4 + i * 0.35, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                    className="absolute h-full w-[1px]"
                    style={{ 
                      left: `${1 + i * 5.5}%`,
                      background: `linear-gradient(180deg, transparent, ${i % 4 === 0 ? '#D4A574' : i % 4 === 1 ? '#E8C9A0' : i % 4 === 2 ? '#8B0000' : '#C4874A'}40, transparent)`,
                    }}
                  />
                ))}
                
                {/* Líneas diagonales */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={`diag-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.01, 0.04, 0.01] }}
                    transition={{ duration: 5 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                    className="absolute w-[150%] h-[1px]"
                    style={{ 
                      top: `${10 + i * 8}%`,
                      left: '-25%',
                      background: `linear-gradient(90deg, transparent, ${['#E8C9A0', '#8B0000', '#C4874A'][i % 3]}30, transparent)`,
                      transform: 'rotate(25deg)',
                    }}
                  />
                ))}
                
                {/* TIJERAS - muchas más */}
                {[...Array(18)].map((_, i) => (
                  <motion.div
                    key={`tijeras-${i}`}
                    animate={{ 
                      rotate: [0, 20 - i * 3, 0, -20 + i * 3, 0], 
                      y: [0, -10 + i * 1.5, 0],
                      opacity: [0.05, 0.15, 0.05]
                    }}
                    transition={{ 
                      duration: 4 + i * 0.4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.6
                    }}
                    className="absolute text-lg"
                    style={{
                      top: `${1 + (i * 7) % 96}%`,
                      left: `${0.5 + (i * 11) % 98}%`,
                      color: i % 4 === 0 ? '#E8C9A0' : i % 4 === 1 ? '#8B0000' : i % 4 === 2 ? '#C4874A' : '#D4A574',
                    }}
                  >
                    ✂️
                  </motion.div>
                ))}
                
                {/* MÁQUINAS DE COSER */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`maquina-${i}`}
                    animate={{ 
                      opacity: [0.04, 0.12, 0.04],
                      scale: [1, 1.15, 1],
                      rotate: [0, 10, 0, -10, 0]
                    }}
                    transition={{ 
                      duration: 5 + i * 0.7, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.9
                    }}
                    className="absolute text-xl"
                    style={{
                      top: `${5 + (i * 8) % 90}%`,
                      right: `${2 + (i * 10) % 93}%`,
                      color: ['#D4A574', '#8B0000', '#E8C9A0', '#C4874A', '#A0522D', '#E8C9A0'][i % 6],
                    }}
                  >
                    🪡
                  </motion.div>
                ))}
                
                {/* SAXOFONES */}
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`saxo-${i}`}
                    animate={{ 
                      rotate: [0, 8 - i, 0, -8 + i, 0], 
                      scale: [1, 1.12, 1],
                      opacity: [0.04, 0.12, 0.04]
                    }}
                    transition={{ 
                      duration: 6 + i * 0.9, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 1.1
                    }}
                    className="absolute text-xl"
                    style={{
                      top: `${3 + (i * 9) % 92}%`,
                      left: `${4 + (i * 13) % 90}%`,
                      color: ['#C4874A', '#D4A574', '#E8C9A0', '#8B0000', '#A0522D', '#E8C9A0'][i % 6],
                    }}
                  >
                    🎷
                  </motion.div>
                ))}
                
                {/* BAILARINAS */}
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={`bailarina-${i}`}
                    animate={{ 
                      rotate: [0, 25, 0, -25, 0], 
                      y: [0, -20, 0],
                      opacity: [0.05, 0.12, 0.05]
                    }}
                    transition={{ 
                      duration: 3 + i * 0.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.7
                    }}
                    className="absolute text-lg"
                    style={{
                      top: `${6 + (i * 10) % 85}%`,
                      left: `${7 + (i * 15) % 85}%`,
                      color: ['#E8C9A0', '#8B0000', '#C4874A', '#D4A574', '#A0522D'][i % 5],
                    }}
                  >
                    💃
                  </motion.div>
                ))}
                
                {/* TEJIDOS / LANA */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`lana-${i}`}
                    animate={{ 
                      opacity: [0.05, 0.1, 0.05],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 4 + i * 0.6, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.8
                    }}
                    className="absolute text-lg"
                    style={{
                      top: `${10 + (i * 12) % 80}%`,
                      right: `${8 + (i * 14) % 85}%`,
                      color: ['#E8C9A0', '#C4874A', '#D4A574', '#8B0000'][i % 4],
                    }}
                  >
                    🧶
                  </motion.div>
                ))}
                
                {/* MÁS PATRONES PARA LLENAR ESPACIOS */}
                
                {/* Puntos brillantes adicionales */}
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={`brillo-${i}`}
                    animate={{ 
                      opacity: [0.1, 0.4, 0.1],
                      scale: [0.8, 1.3, 0.8]
                    }}
                    transition={{ 
                      duration: 2 + (i % 5) * 0.4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.12
                    }}
                    className="absolute w-[2px] h-[2px] rounded-full"
                    style={{
                      top: `${(i * 2.1) % 100}%`,
                      left: `${(i * 3.7 + 1) % 100}%`,
                      backgroundColor: ['#E8C9A0', '#8B0000', '#C4874A', '#D4A574', '#A0522D', '#E8C9A0'][i % 6],
                      boxShadow: '0 0 4px currentColor',
                    }}
                  />
                ))}
                
                {/* Líneas cruzadas adicionales */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`cruz-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.01, 0.03, 0.01] }}
                    transition={{ duration: 6 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                    className="absolute w-[150%] h-[1px]"
                    style={{ 
                      top: `${15 + i * 6}%`,
                      left: '-25%',
                      background: `linear-gradient(90deg, transparent, ${['#E8C9A0', '#8B0000', '#C4874A'][i % 3]}20, transparent)`,
                      transform: `rotate(${-20 + (i % 5) * 10}deg)`,
                    }}
                  />
                ))}
                
                {/* BAILARINAS */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`bailarina-${i}`}
                    animate={{ 
                      rotate: [0, 20, 0, -20, 0], 
                      y: [0, -15, 0],
                      opacity: [0.06, 0.12, 0.06]
                    }}
                    transition={{ 
                      duration: 4 + i * 0.6, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.9
                    }}
                    className="absolute text-xl"
                    style={{
                      top: `${10 + (i * 15) % 80}%`,
                      left: `${8 + (i * 21) % 84}%`,
                      color: ['#E8C9A0', '#8B0000', '#C4874A', '#D4A574', '#A0522D', '#E8C9A0'][i],
                    }}
                  >
                    💃
                  </motion.div>
                ))}
                
                {/* BINARIO - MUCHOS MÁS NÚMEROS */}
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`bin-${i}`}
                    animate={{ 
                      opacity: [0.04, 0.1, 0.04],
                      y: [0, -15 - (i % 7) * 3, 0],
                      x: [0, (i % 5 - 2) * 3, 0]
                    }}
                    transition={{ 
                      duration: 2.5 + (i % 5) * 0.5, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                    className="absolute font-mono text-xs"
                    style={{
                      top: `${1 + (i * 3.3) % 98}%`,
                      left: `${0.5 + (i * 7.3) % 99}%`,
                      color: ['#E8C9A0', '#8B0000', '#C4874A', '#D4A574', '#A0522D'][i % 5],
                      fontSize: '10px',
                    }}
                  >
                    {['10', '01', '101', '010', '110', '001', '111', '000'][i % 8]}
                  </motion.div>
                ))}
                
                {/* Puntos de costura densos */}
                {[...Array(35)].map((_, i) => (
                  <motion.div
                    key={`punto-${i}`}
                    animate={{ 
                      scale: [1, 1.8, 1],
                      opacity: [0.08, 0.15, 0.08]
                    }}
                    transition={{ 
                      duration: 1.5 + (i % 4) * 0.3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.15
                    }}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      top: `${(i * 2.9) % 100}%`,
                      left: `${(i * 4.1 + 2) % 100}%`,
                      backgroundColor: ['#E8C9A0', '#8B0000', '#C4874A', '#D4A574', '#A0522D'][i % 5],
                    }}
                  />
                ))}
                
                {/* Círculos sutiles de fondo */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`circulo-${i}`}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.03, 0.06, 0.03]
                    }}
                    transition={{ 
                      duration: 10 + i * 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 1.5
                    }}
                    className="absolute rounded-full border"
                    style={{
                      top: `${5 + (i * 12) % 80}%`,
                      left: `${3 + (i * 14) % 85}%`,
                      width: `${30 + (i * 10)}px`,
                      height: `${30 + (i * 10)}px`,
                      borderColor: ['#E8C9A020', '#8B000020', '#C4874A20'][i % 3],
                    }}
                  />
                ))}
                
                {/* MÁS ELEMENTOS PARA LLENAR ESPACIOS */}
                
                {/* Más binario */}
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={`extra-bin-${i}`}
                    animate={{ 
                      opacity: [0.03, 0.08, 0.03],
                      y: [0, -8, 0],
                    }}
                    transition={{ 
                      duration: 2 + (i % 3), 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.15
                    }}
                    className="absolute font-mono text-[10px]"
                    style={{
                      top: `${(i * 4.1) % 100}%`,
                      left: `${(i * 5.3) % 100}%`,
                      color: ['#E8C9A0', '#8B0000', '#C4874A', '#D4A574'][i % 4],
                    }}
                  >
                    {['10', '01', '101', '010', '110'][i % 5]}
                  </motion.div>
                ))}
                
                {/* Puntos extra */}
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={`extra-punto-${i}`}
                    animate={{ 
                      scale: [1, 2, 1],
                      opacity: [0.06, 0.15, 0.06]
                    }}
                    transition={{ 
                      duration: 1.5 + (i % 3) * 0.3, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.1
                    }}
                    className="absolute w-[3px] h-[3px] rounded-full"
                    style={{
                      top: `${(i * 2.5) % 100}%`,
                      left: `${(i * 3.1 + 2) % 100}%`,
                      backgroundColor: ['#E8C9A0', '#8B0000', '#C4874A', '#D4A574'][i % 4],
                    }}
                  />
                ))}
                
                {/* Hilos curvos simulados con múltiples divs */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`curva-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.02, 0.05, 0.02] }}
                    transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                    className="absolute w-[200%] h-[2px]"
                    style={{ 
                      top: `${20 + i * 12}%`,
                      left: '-50%',
                      background: `linear-gradient(90deg, transparent 0%, ${['#E8C9A0', '#8B0000'][i % 2]}15 30%, ${['#E8C9A0', '#8B0000'][i % 2]}25 50%, ${['#E8C9A0', '#8B0000'][i % 2]}15 70%, transparent 100%)`,
                      transform: `rotate(${-15 + i * 5}deg) translateY(${i * 3}px)`,
                    }}
                  />
                ))}
              </div>

              <div className="text-center mb-12">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#E8C9A0] to-transparent mx-auto mb-8" />
                <h2 className="font-serif text-4xl sm:text-5xl mb-4 text-[#f5f0e6]">Explora</h2>
                <p className="text-[#D4A574]/80">Elige cualquier nodo. No hay orden correcto.</p>
              </div>

              {/* Grid de categorías */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <div key={key} className="space-y-3">
                    <h3 className="text-base tracking-widest uppercase font-serif" style={{ color: cat.color }}>
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
                            className="w-full text-left p-4 border transition-all"
                            style={{
                              borderColor: visited ? `${cat.color}60` : `${cat.color}30`,
                              backgroundColor: visited ? `${cat.color}15` : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = `${cat.color}80`;
                              e.currentTarget.style.backgroundColor = `${cat.color}10`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = visited ? `${cat.color}60` : `${cat.color}30`;
                              e.currentTarget.style.backgroundColor = visited ? `${cat.color}15` : 'transparent';
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif text-lg" style={{ color: cat.color }}>{n.title}</span>
                              {visited && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2">
                                  <path d="M20 6L9 17l-5-5"/>
                                </svg>
                              )}
                            </div>
                            <p className="text-sm mt-1 line-clamp-1" style={{ color: `${cat.color}99` }}>{n.text}</p>
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

              {/* Nota ingeniería + creatividad */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-16 text-center max-w-md mx-auto"
              >
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#8B0000]/40 to-transparent mx-auto mb-5" />
                <p className="font-serif text-sm italic text-[#E8C9A0]/35 leading-relaxed">
                  Hecho con <span className="text-[#E8C9A0]/60">React</span>, <span className="text-[#E8C9A0]/60">Next.js</span> y <span className="text-[#E8C9A0]/60">TypeScript</span> — donde la ingeniería y la creatividad habitan el mismo espacio.
                </p>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#8B0000]/40 to-transparent mx-auto mt-5" />
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
