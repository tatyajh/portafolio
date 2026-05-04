"use client";

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';

export default function ChapterNav() {
  const { currentChapter, chapters } = useUIStore();

  const scrollToChapter = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filtrar solo capítulos narrativos (no home)
  const narrativeChapters = chapters.filter(c => c.id !== 'home');

  return (
    <nav 
      className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2"
      aria-label="Navegación de capítulos"
    >
      {narrativeChapters.map((chapter, index) => {
        const isActive = chapter.id === currentChapter;
        const currentIndex = narrativeChapters.findIndex(c => c.id === currentChapter);
        const isPast = currentIndex > index;
        
        return (
          <button
            key={chapter.id}
            onClick={() => scrollToChapter(chapter.id)}
            className="group flex items-center gap-3 py-1"
            aria-label={`Ir a ${chapter.title}`}
            aria-current={isActive ? 'step' : undefined}
          >
            {/* Número del capítulo */}
            <motion.div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                isActive 
                  ? 'bg-[#e8cfc4] text-[#0b0b0b]' 
                  : isPast
                    ? 'bg-[#e8cfc4]/30 text-[#e8cfc4]'
                    : 'bg-transparent border border-[#e8cfc4]/20 text-[#e8cfc4]/40 group-hover:border-[#e8cfc4]/50 group-hover:text-[#e8cfc4]/70'
              }`}
              animate={{ scale: isActive ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {index + 1}
            </motion.div>
            
            {/* Título (visible en hover o activo) */}
            <span
              className={`text-xs tracking-wide whitespace-nowrap transition-all duration-300 ${
                isActive 
                  ? 'opacity-100 text-[#e8cfc4] translate-x-0' 
                  : 'opacity-0 group-hover:opacity-100 text-[#f5f5f5]/60 -translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {chapter.title.replace(/^\d+\.\s*/, '')}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
