export interface CVSkillGroup {
  category: string;
  items: string[];
}

export interface CVVariant {
  id: string;
  title: string;
  language: 'Español' | 'English';
  pages: number;
  path: string;
  downloadName: string;
  description: string;
  recommended?: boolean;
  group: 'videojuegos' | 'completo';
}
