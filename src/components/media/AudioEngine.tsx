"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

/**
 * AudioEngine simplificado
 * No carga audio hasta que tengas los archivos en /public/media/audio/
 * Por ahora solo muestra la pantalla de inicio
 */
export default function AudioEngine() {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFirstInteraction = () => {
    setHasInteracted(true);
  };

  return (
    <>
      {/* Pantalla de inicio - Estética oro-rosa con borgoña */}
      {!hasInteracted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
          style={{ background: 'radial-gradient(ellipse at center, #1a1512 0%, #0a0808 100%)' }}
          onClick={handleFirstInteraction}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center px-6"
          >
            {/* Línea decorativa superior - oro-rosa */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
              className="w-32 h-px bg-gradient-to-r from-transparent via-[#E8C9A0] to-transparent mx-auto mb-10"
            />

            <motion.p 
              initial={{ opacity: 0, letterSpacing: '0.2em' }} 
              animate={{ opacity: 1, letterSpacing: '0.5em' }} 
              transition={{ delay: 0.4, duration: 1.2 }}
              className="text-[#E8C9A0] text-sm sm:text-base uppercase mb-6 font-light tracking-widest"
            >
              Portafolio
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
              className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 text-[#f5f0e6] leading-none tracking-tight"
            >
              Hilos
              <br />
              <span className="text-[#8B0000]">Invisibles</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.2, duration: 1 }}
              className="font-serif text-xl sm:text-2xl md:text-3xl text-[#E8C9A0]/70 italic mb-16"
            >
              Lo que se hereda
            </motion.p>

            {/* Línea decorativa inferior - borgoña */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 1, ease: "easeOut" }}
              className="w-16 h-px bg-[#8B0000]/60 mx-auto mb-8"
            />
            
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.8 }}
            >
              <motion.p 
                animate={{ opacity: [0.3, 0.6, 0.3] }} 
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
                className="text-[#E8C9A0]/50 text-xs sm:text-sm tracking-[0.2em] uppercase"
              >
                Click para explorar
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </>
  );
}
