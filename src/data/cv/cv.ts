import type { CVSkillGroup } from './types';

// CV_SKILLS se mantiene: alimenta los chips de "capacidades" en TechIdentity
// (nodo tecnico). El resto del CV (nombre, resumen, experiencia, educación...)
// vive únicamente en la imagen real public/media/cv/cv.png, mostrada tal
// cual en el nodo perfil — no se transcribe a datos.
//
// Los nombres de categoría van en español (el sitio entero va en
// español; la única pieza en inglés es la imagen del CV). Los nombres
// de tecnologías se dejan como se llaman de verdad: nadie busca
// "reaccionar" ni "pruebas de extremo a extremo con Cypress".
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
