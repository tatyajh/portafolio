"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Locale = 'es' | 'en';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    const saved = window.localStorage.getItem('portfolio-language');
    if (saved === 'es' || saved === 'en') setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem('portfolio-language', locale);
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, isEnglish: locale === 'en' }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}

