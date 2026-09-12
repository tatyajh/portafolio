import type { CVSkillGroup, CVVariant } from './types';

// CV_SKILLS se mantiene: alimenta los chips de "capacidades" en TechIdentity
// (nodo tecnico). Las cuatro hojas de vida viven como PDF descargables;
// la presentación visible se construye como interfaz editorial dentro
// del portafolio y no intenta reproducir el formato ATS.
export const CV_SKILLS: CVSkillGroup[] = [
  { category: 'Desarrollo de Videojuegos', items: ['Unity', 'C#', 'Diseño de Personajes', 'Conceptualización', 'Prototipado Interactivo'] },
  { category: 'Desarrollo de Software', items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'REST APIs', 'Microfrontend (Single-SPA)'] },
  { category: 'Pruebas y Calidad', items: ['Jest', 'Cypress', 'Playwright', 'New Relic', 'Git'] },
  { category: 'Metodologías e IA', items: ['Spec-Driven Development', 'Desarrollo Asistido por IA', 'Agile', 'Scrum'] },
  { category: 'Seguridad', items: ['Fundamentos de Ciberseguridad'] },
  { category: 'Habilidades Blandas', items: ['Resolución de Problemas', 'Trabajo en Equipo', 'Comunicación', 'Adaptabilidad', 'Aprendizaje Continuo'] },
];

export const CV_PDF_PATH = '/media/cv/tatiana-jaramillo-cv.pdf';
export const CV_PDF_DOWNLOAD_NAME = 'Tatiana-Jaramillo-CV.pdf';

export const CV_VARIANTS: CVVariant[] = [
  {
    id: 'videojuegos-es',
    title: 'CV de videojuegos',
    language: 'Español',
    pages: 1,
    path: '/media/cv/tatiana-jaramillo-videojuegos-es.pdf',
    downloadName: 'Tatiana-Jaramillo-CV-Videojuegos-ES.pdf',
    description: 'Para estudios, equipos y oportunidades de Unity y C#.',
    recommended: true,
    group: 'videojuegos',
  },
  {
    id: 'videojuegos-en',
    title: 'Game development résumé',
    language: 'English',
    pages: 1,
    path: '/media/cv/tatiana-jaramillo-videojuegos-en.pdf',
    downloadName: 'Tatiana-Jaramillo-Game-Development-Resume-EN.pdf',
    description: 'For international Unity, C# and game development roles.',
    group: 'videojuegos',
  },
  {
    id: 'completo-es',
    title: 'Trayectoria completa',
    language: 'Español',
    pages: 3,
    path: '/media/cv/tatiana-jaramillo-trayectoria-completa-es.pdf',
    downloadName: 'Tatiana-Jaramillo-CV-Completo-ES.pdf',
    description: 'Para roles de software o perfiles multidisciplinarios.',
    group: 'completo',
  },
  {
    id: 'completo-en',
    title: 'Complete résumé',
    language: 'English',
    pages: 3,
    path: '/media/cv/tatiana-jaramillo-trayectoria-completa-en.pdf',
    downloadName: 'Tatiana-Jaramillo-Complete-Resume-EN.pdf',
    description: 'For software engineering and multidisciplinary roles.',
    group: 'completo',
  },
];
