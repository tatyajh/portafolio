"use client";

import { motion } from 'framer-motion';
import type { Game } from '@/data/games';

export default function GameCard({ game, index }: { game: Game; index: number }) {
  return (
    <motion.div
      key={game.id}
      initial={{ opacity: 0, y: 20, rotate: index % 2 === 0 ? -2 : 2 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
      transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
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

      {/* Por dentro - arquitectura técnica, sourced del README real del proyecto */}
      {game.architecture && game.architecture.length > 0 && (
        <div className="mb-10">
          <p className="font-script text-2xl text-[#8B0000] mb-4 -rotate-1">Por dentro…</p>
          <div className="stitch-border-gold p-5 bg-[#d9c49c]/30 divide-y divide-[#A0522D]/25">
            {game.architecture.map(item => (
              <div key={item.label} className="py-3 first:pt-0 last:pb-0 grid sm:grid-cols-[9rem_1fr] gap-1 sm:gap-4">
                <p className="text-[11px] uppercase tracking-widest text-[#A0522D] font-serif">{item.label}</p>
                <p className="text-[#2a2018]/85 text-sm sm:text-base leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
  );
}
