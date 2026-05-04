"use client";

import { motion } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';

export default function ProgressBar() {
  const { scrollProgress, currentChapter, chapters } = useUIStore();

  // Click para navegar a capítulo
  const scrollToChapter = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#1a1a1a]">
      {/* Overall scroll progress */}
      <motion.div
        className="h-full bg-gradient-to-r from-[#e8cfc4]/80 to-[#e8cfc4] origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      
      {/* Chapter markers - clickable */}
      <div className="absolute inset-0 flex">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === currentChapter;
          const isPast = chapters.findIndex(c => c.id === currentChapter) > index;
          const position = (index / (chapters.length - 1)) * 100;
          
          return (
            <button
              key={chapter.id}
              onClick={() => scrollToChapter(chapter.id)}
              className="absolute h-6 -top-2 -translate-x-1/2 group cursor-pointer"
              style={{ left: `${position}%` }}
              aria-label={`Ir a ${chapter.title}`}
            >
              <motion.div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive
                    ? 'bg-[#e8cfc4]'
                    : isPast
                      ? 'bg-[#e8cfc4]/50'
                      : 'bg-[#e8cfc4]/20 group-hover:bg-[#e8cfc4]/40'
                }`}
                animate={{ scale: isActive ? 1.5 : 1 }}
                transition={{ duration: 0.2 }}
              />
              
              {/* Tooltip en hover */}
              <div className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-wide transition-opacity duration-200 ${
                isActive ? 'opacity-100 text-[#e8cfc4]' : 'opacity-0 group-hover:opacity-100 text-[#f5f5f5]/60'
              }`}>
                {chapter.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
