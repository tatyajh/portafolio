"use client";

import { PROJECTS } from '@/data/projects';
import ProjectCard from './ProjectCard';
import { useLanguage } from '@/context/LanguageContext';
import { localizeProject } from '@/data/translations';

export default function ProjectList() {
  const { locale } = useLanguage();
  return (
    <>
      {PROJECTS.map(project => localizeProject(project, locale)).map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </>
  );
}
