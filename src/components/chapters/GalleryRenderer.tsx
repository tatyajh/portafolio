"use client";

import { motion } from 'framer-motion';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { IMAGE_CAPTIONS } from '@/data/nodes';
import CollagePhoto from './CollagePhoto';

// Columnas por breakpoint compartidas por las galerías de flujo libre
// (todas menos "diseno", que tiene su propia composición fija)
const MASONRY_BREAKPOINTS = { 350: 1, 750: 2, 1100: 3 };

// GALLERY RENDERER - Layouts específicos por nodo
export default function GalleryRenderer({ nodeId, gallery }: { nodeId: string; gallery: readonly string[] }) {
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
        <ResponsiveMasonry columnsCountBreakPoints={MASONRY_BREAKPOINTS}>
          <Masonry gutter="0.75rem">
            {gallery.map((src, index) => (
              <CollagePhoto
                key={index}
                src={src}
                alt={`${nodeId} ${index + 1}`}
                tilt={index % 2 === 0 ? 'l' : 'r'}
                tape={index % 3 === 0 ? { side: index % 2 === 0 ? 'left' : 'right' } : undefined}
                delay={0.3 + index * 0.1}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
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
        <ResponsiveMasonry columnsCountBreakPoints={MASONRY_BREAKPOINTS}>
          <Masonry gutter="1rem">
            {gallery.map((src, index) => (
              <CollagePhoto
                key={index}
                src={src}
                alt={captions[index] || `${nodeId} ${index + 1}`}
                caption={captions[index]}
                tilt={index % 2 === 0 ? 'l' : 'r'}
                tape={index % 3 === 0 ? { side: index % 2 === 0 ? 'left' : 'right' } : undefined}
                delay={0.3 + index * 0.1}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
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
        <ResponsiveMasonry columnsCountBreakPoints={MASONRY_BREAKPOINTS}>
          <Masonry gutter="1rem">
            {/* Estructura-1 con caption */}
            <CollagePhoto
              src={gallery[0]}
              alt="estructura 1"
              caption={captions[0]}
              tilt="l"
              tape={{ side: 'left' }}
              delay={0.3}
            />

            {/* Resto de imágenes sin caption */}
            {gallery.slice(1).map((src, index) => (
              <CollagePhoto
                key={index + 1}
                src={src}
                alt={`estructura ${index + 2}`}
                tilt={(index + 1) % 2 === 0 ? 'l' : 'r'}
                tape={(index + 1) % 3 === 0 ? { side: (index + 1) % 2 === 0 ? 'left' : 'right' } : undefined}
                delay={0.4 + index * 0.1}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
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
            <CollagePhoto
              key={idx}
              src={gallery[idx]}
              alt={captions[idx] || `figurín ${idx + 1}`}
              caption={captions[idx]}
              tilt={i === 0 ? 'l' : 'r'}
              tape={i === 0 ? { side: 'left' } : undefined}
              delay={0.2 + i * 0.1}
            />
          ))}
        </div>

        {/* Figurín 3 + Diseño 4 (retazos) - lado a lado */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <CollagePhoto
            src={gallery[2]}
            alt={captions[2] || 'figurín 3'}
            caption={captions[2]}
            tilt="l"
            delay={0.4}
          />
          <CollagePhoto
            src={gallery[9]}
            alt={captions[9] || 'diseño 4'}
            caption={captions[9]}
            tilt="r"
            tape={{ side: 'right' }}
            delay={0.5}
          />
        </div>

        {/* Figurín 4 + Figurín 5 - lado a lado */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          {[3, 4].map((idx, i) => (
            <CollagePhoto
              key={idx}
              src={gallery[idx]}
              alt={captions[idx] || `figurín ${idx + 1}`}
              caption={captions[idx]}
              tilt={i === 0 ? 'l' : 'r'}
              delay={0.6 + i * 0.1}
            />
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
              <CollagePhoto
                key={idx}
                src={gallery[idx]}
                alt={`diseño ${i + 1}`}
                tilt={i === 0 ? 'l' : 'r'}
                delay={0}
              />
            ))}
          </div>
          <p className="text-sm sm:text-base italic text-center caption-glow-dark">
            — A veces también me gusta tejer —
          </p>
        </motion.div>

        {/* Figurín 6 - ancho completo con leyenda */}
        <CollagePhoto
          src={gallery[5]}
          alt={captions[5] || 'figurín 6'}
          caption={captions[5]}
          tape={{ side: 'left' }}
          delay={0.9}
        />

        {/* Diseño 3 - grande, sin leyenda, justo debajo de figurín 6 */}
        <div className="mt-6">
          <CollagePhoto src={gallery[8]} alt="diseño 3" delay={1.0} />
        </div>
      </motion.div>
    );
  }

  // Por defecto: collage de 2 columnas (1 en mobile) sin captions
  // (arte, sonido, mixto, proceso, quiebre, identidad, perfil, esencia)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="mb-12"
    >
      <ResponsiveMasonry columnsCountBreakPoints={MASONRY_BREAKPOINTS}>
        <Masonry gutter="1rem">
          {gallery.map((src, index) => (
            <CollagePhoto
              key={index}
              src={src}
              alt={`${nodeId} ${index + 1}`}
              tilt={index % 2 === 0 ? 'l' : 'r'}
              tape={index % 3 === 0 ? { side: index % 2 === 0 ? 'left' : 'right' } : undefined}
              delay={0.3 + index * 0.1}
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </motion.div>
  );
}
