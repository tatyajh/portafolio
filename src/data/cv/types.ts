export interface CVContact {
  phone: string;
  email: string;
  location: string;
}

export interface CVSkillGroup {
  category: string;
  items: string[];
}

export interface CVExperience {
  role: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
}

export interface CVFocusArea {
  label: string;
  period: string;
  desc: string;
}

export interface CVEducation {
  degree: string;
  institution: string;
  location: string;
  date: string;
}

export interface CVTraining {
  label: string;
  provider: string;
  year: string;
}

export interface CVLanguage {
  language: string;
  level: string;
}
