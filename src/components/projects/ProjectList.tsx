"use client";

import { PROJECTS } from '@/data/projects';
import ProjectCard from './ProjectCard';
import { useLanguage } from '@/context/LanguageContext';
import { localizeProject } from '@/data/translations';
import styles from './projects.module.css';

export default function ProjectList() {
  const { locale } = useLanguage();
  return (
    <ul className={styles.gallery} aria-label={locale === 'es' ? 'Proyectos seleccionados' : 'Selected projects'}>
      {[...PROJECTS]
        .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
        .map(project => localizeProject(project, locale))
        .map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
    </ul>
  );
}
