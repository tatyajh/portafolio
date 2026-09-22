"use client";

import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';
import { selectCopy } from '@/data/translations';
import { SOCIAL_ICONS } from '@/lib/socialIcons';
import ProjectCover from './ProjectCover';
import styles from './projects.module.css';

const ROLES = {
  'design-development': ['Diseño de interfaz + desarrollo', 'Interface design + development'],
  'figma-development': ['Desarrollo a partir de Figma', 'Development from supplied Figma'],
  webmaster: ['Webmaster', 'Webmaster'],
  development: ['Desarrollo', 'Development'],
} as const;

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { locale } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [roleEs, roleEn] = ROLES[project.role];
  const role = selectCopy(locale, roleEs, roleEn);
  const website = project.links.find(link => new URL(link.url).hostname !== 'github.com');
  const codeLinks = project.showCode === false ? [] : project.links.filter(link => new URL(link.url).hostname === 'github.com');

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className={styles.card}
    >
      <article aria-labelledby={`project-${project.id}`}>
        <div className={styles.visual}>
          <ProjectCover project={project} />
          {project.year && (
            <div className={`stamp font-serif ${styles.yearBadge}`} aria-label={`${selectCopy(locale, 'Año', 'Year')}: ${project.year}`}>
              <span aria-hidden="true">{project.role === 'webmaster' ? 'Webmaster' : project.id === 'venux' ? 'App · Dev' : 'Web · Dev'}</span>
              <strong>{project.year}</strong>
            </div>
          )}
          <div className={styles.imageActions}>
            {website && (
              <a href={website.url} target="_blank" rel="noopener noreferrer"
                className={styles.roundLink}
                aria-label={`${website.label}: ${project.title} (${selectCopy(locale, 'abre otra pestaña', 'opens a new tab')})`}
                title={website.label}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <ellipse cx="12" cy="12" rx="4" ry="9" />
                  <path d="M3 12h18M5 6.5h14M5 17.5h14" />
                </svg>
              </a>
            )}
            {project.behanceUrl && (
              <a href={project.behanceUrl} target="_blank" rel="noopener noreferrer"
                className={styles.roundLink} aria-label={`Behance: ${project.title}`} title="Behance">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={SOCIAL_ICONS.Behance} />
                </svg>
              </a>
            )}
          </div>
        </div>
        <div className={styles.caption}>
          <p className={styles.role}>{role}</p>
          <h3 id={`project-${project.id}`} className={`font-serif ${styles.title}`}>{project.title}</h3>
          <div className={styles.meta}>
            <span>{project.stack}</span>
          </div>
          <details className={styles.details}>
            <summary>{selectCopy(locale, 'Mi aporte al proyecto', 'My contribution')} <span aria-hidden="true">+</span></summary>
            <p>{project.desc}</p>
            {project.preview.note && <p className={styles.visualNote}>{project.preview.note}</p>}
            {codeLinks.length > 0 && (
              <div className={styles.codeLinks}>
                {codeLinks.map(link => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>
                ))}
              </div>
            )}
          </details>
        </div>
      </article>
    </motion.li>
  );
}
