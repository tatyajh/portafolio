"use client";

import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';
import { selectCopy } from '@/data/translations';
import { SOCIAL_ICONS } from '@/lib/socialIcons';

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { locale } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className={`paper-card stitch-border relative p-5 sm:p-6 ${index % 2 === 0 ? 'tilt-l' : 'tilt-r'}`}
    >
      <div className="tape -top-3 left-8 -rotate-6" />

      {/* Captura de la demo, montada como una foto con su propio
          margen de papel en vez de pegada al borde de la tarjeta. */}
      {project.preview && (
        <div className="mt-3 mb-5 stitch-border-gold bg-paper-deep/40 p-2 sm:p-3">
          {project.preview.url && (
            <p className="mb-2 truncate text-center text-[10px] uppercase tracking-widest text-brown">
              {project.preview.url}
            </p>
          )}
          <div className="h-56 overflow-hidden sm:h-64">
            {/* eslint-disable-next-line @next/next/no-img-element -- capturas propias sin dimensiones catalogadas */}
            <img
              src={project.preview.image}
              alt={project.preview.alt}
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <h3 className="font-serif text-2xl text-ink">{project.title}</h3>
        <span className="text-[10px] uppercase tracking-widest text-brown">{project.stack}</span>
      </div>
      <p className="font-script text-lg text-ink-light leading-snug mb-4">{project.desc}</p>

      {/* Venux no tiene enlaces: son proyectos sin lanzar, no se
          muestra el código. Sin este condicional quedaba un
          contenedor vacío. */}
      {(project.links.length > 0 || project.behanceUrl) && (
        <div className="flex flex-wrap gap-3">
          {project.links.map(l => (
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
          {project.behanceUrl && (
            <a
              href={project.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 stitch-border text-sm font-serif tracking-wider text-burgundy hover:bg-burgundy/5 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d={SOCIAL_ICONS.Behance} />
              </svg>
              {selectCopy(locale, 'Caso en Behance', 'Behance case study')} ↗
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}
