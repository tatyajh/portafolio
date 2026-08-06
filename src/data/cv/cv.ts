import type {
  CVContact, CVSkillGroup, CVExperience, CVFocusArea,
  CVEducation, CVTraining, CVLanguage,
} from './types';

export const CV_NAME = 'Tatiana Alejandra Jaramillo Hoyos';
export const CV_TITLE = 'Frontend Developer & Game Developer (Unity)';

export const CV_CONTACT: CVContact = {
  phone: '313 246 5474',
  email: 'talejandra.jaramillo@gmail.com',
  location: 'Medellín, Colombia',
};

export const CV_SUMMARY =
  'Systems Engineer focused on game development with Unity and C#, with a solid background of over three years building products using React, TypeScript and JavaScript. My strength lies in combining engineering rigor, automated testing and scalable architectures with a creative perspective from my fashion design training, applied to character design and UI/UX decisions. I work with Spec-Driven Development and leverage AI strategically to prototype and validate ideas faster, while my cybersecurity knowledge reinforces quality and security from the design stage. I bring creativity, technical depth and fast adaptability to teams building interactive experiences.';

export const CV_SKILLS: CVSkillGroup[] = [
  { category: 'Game Development', items: ['Unity', 'C#', 'Diseño de Personajes', 'Conceptualización', 'Prototipado Interactivo'] },
  { category: 'Software Development', items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'REST APIs', 'Microfrontend (Single-SPA)'] },
  { category: 'Testing & Quality', items: ['Jest', 'Cypress', 'Playwright', 'New Relic', 'Git'] },
  { category: 'Methodologies & AI', items: ['Spec-Driven Development', 'Desarrollo Asistido por IA', 'Agile', 'Scrum'] },
  { category: 'Security', items: ['Fundamentos de Ciberseguridad'] },
  { category: 'Soft Skills', items: ['Resolución de Problemas', 'Trabajo en Equipo', 'Comunicación', 'Adaptabilidad', 'Aprendizaje Continuo'] },
];

export const CV_LANGUAGES: CVLanguage[] = [
  { language: 'Español', level: 'Nativo' },
  { language: 'Inglés', level: 'B2' },
];

export const CV_EXPERIENCE: CVExperience[] = [
  {
    role: 'Full Stack Developer (Freelance)',
    company: 'GYG Empaquetaduras',
    location: 'Remote',
    period: 'May 2025 – Present',
    bullets: [
      'Developed and optimized the company website, improving online presence and user experience.',
      "Integrated end-to-end payment gateways, configuring frontend, backend and external services to enable the client's first digital sales channel.",
      'Resolved production issues, increasing system stability and reliability.',
    ],
  },
  {
    role: 'Software Engineer (Frontend)',
    company: 'ABATech',
    location: 'Medellín, Colombia',
    period: 'May 2023 – July 2025',
    bullets: [
      'Designed and implemented scalable applications with React, TypeScript and microfrontend architecture (Single-SPA).',
      'Led the adoption of automated testing (Jest, Cypress, Playwright) from scratch, strengthening coverage and team confidence to release.',
      'Managed application state with TanStack Query and Redux, and refactored legacy code to reduce technical debt.',
      'Implemented monitoring with New Relic and supported API integrations with Node.js.',
    ],
  },
  {
    role: 'Frontend Developer (Freelance)',
    company: 'Independent Clients',
    location: 'Remote',
    period: 'Jan 2020 – Mar 2021',
    bullets: [
      'Developed interactive and responsive interfaces with React and JavaScript, integrating REST APIs and delivering projects on time and within scope.',
    ],
  },
  {
    role: 'IT Support Analyst',
    company: 'Registraduría Nacional, Tuya S.A. & Universidad de Antioquia',
    location: 'Colombia',
    period: 'Jan 2014 – Apr 2022',
    bullets: [
      'Provided technical support under ITIL principles and automated internal processes with macros and Linux scripts, reducing manual work.',
    ],
  },
];

export const CV_FOCUS_AREAS: CVFocusArea[] = [
  { label: 'Mobile Development', period: '2024–Present', desc: 'Mobile applications using React Native, exploring mobile-first solutions.' },
  { label: 'Backend & Services', period: '2024–Present', desc: 'Lightweight backends and services using Supabase.' },
  { label: 'Spec-Driven Development', period: '2024–Present', desc: 'Adoption of Spec Kit to plan, structure and validate projects with clear specifications before implementation.' },
  { label: 'AI Prototyping', period: '2023–Present', desc: 'Proof of concepts and rapid idea validation assisted by AI.' },
];

export const CV_EDUCATION: CVEducation[] = [
  {
    degree: 'Technician in Fashion Design',
    institution: 'CESDE',
    location: 'Medellín, Colombia',
    date: 'June 2026',
  },
  {
    degree: 'Systems Engineering',
    institution: 'Universidad de Antioquia',
    location: 'Medellín, Colombia',
    date: 'June 2021',
  },
];

export const CV_TRAINING: CVTraining[] = [
  { label: 'Bootcamp Desarrolladora Junior en Unity', provider: 'Generation Colombia', year: '2026' },
  { label: 'Certificación en Fundamentos de Ciberseguridad', provider: 'Betek', year: '2026' },
  { label: 'Bootcamp de Desarrollo de Software', provider: 'Women Who Code y Gorilla Logic', year: '2024' },
  { label: 'Certificación en Desarrollo Web', provider: 'Misión TIC', year: '2022' },
  { label: 'Curso de Machine Learning y Análisis de Datos con Python', provider: 'Universidad de Antioquia', year: '2022' },
  { label: 'Bootcamp de Desarrollo de Videojuegos', provider: 'Universidad de Antioquia y Ubicua', year: '2021' },
];

export const CV_TAGLINE = 'I WRITE CLEAN CODE · I DESIGN EXPERIENCES · I BUILD GAMES · I BRING IDEAS TO LIFE';

export const CV_PDF_PATH = '/media/cv/tatiana-jaramillo-cv.pdf';
export const CV_PDF_DOWNLOAD_NAME = 'Tatiana-Jaramillo-CV.pdf';
