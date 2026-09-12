"use client";

import { useLanguage, type Locale } from '@/context/LanguageContext';

export default function LanguageToggle({ theme }: { theme?: string }) {
  const { locale, setLocale } = useLanguage();
  const isLight = theme === 'light' || theme === 'paper';

  return (
    <div
      className={`language-toggle ${isLight ? 'is-light' : ''}`}
      role="group"
      aria-label={locale === 'es' ? 'Idioma del portafolio' : 'Portfolio language'}
    >
      {(['es', 'en'] as Locale[]).map(option => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={locale === option ? 'is-active' : ''}
          aria-pressed={locale === option}
          aria-label={option === 'es' ? 'Ver en español' : 'View in English'}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

