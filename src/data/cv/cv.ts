import type { CVSkillGroup } from './types';

// CV_SKILLS se mantiene: alimenta los chips de "capacidades" en TechIdentity
// (nodo tecnico). El resto del CV (nombre, resumen, experiencia, educación...)
// vive únicamente en la imagen real public/media/cv/cv.png, mostrada tal
// cual en el nodo perfil — no se transcribe a datos.
export const CV_SKILLS: CVSkillGroup[] = [
  { category: 'Game Development', items: ['Unity', 'C#', 'Diseño de Personajes', 'Conceptualización', 'Prototipado Interactivo'] },
  { category: 'Software Development', items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'REST APIs', 'Microfrontend (Single-SPA)'] },
  { category: 'Testing & Quality', items: ['Jest', 'Cypress', 'Playwright', 'New Relic', 'Git'] },
  { category: 'Methodologies & AI', items: ['Spec-Driven Development', 'Desarrollo Asistido por IA', 'Agile', 'Scrum'] },
  { category: 'Security', items: ['Fundamentos de Ciberseguridad'] },
  { category: 'Soft Skills', items: ['Resolución de Problemas', 'Trabajo en Equipo', 'Comunicación', 'Adaptabilidad', 'Aprendizaje Continuo'] },
];

export const CV_PDF_PATH = '/media/cv/tatiana-jaramillo-cv.pdf';
export const CV_PDF_DOWNLOAD_NAME = 'Tatiana-Jaramillo-CV.pdf';
