"use client";

import { motion } from 'framer-motion';
import { IMAGE_CAPTIONS } from '@/data/nodes';

// GALLERY RENDERER - Layouts específicos por nodo
export default function GalleryRenderer({ nodeId, gallery, theme }: { nodeId: string; gallery: readonly string[]; theme?: string }) {
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
