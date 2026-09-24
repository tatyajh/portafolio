"use client";

import { getContactEmail, RESUME_LINKS } from '@/data/resume';
import { CV_VARIANTS } from '@/data/cv/cv';
import { SOCIAL_ICONS } from '@/lib/socialIcons';
import { useLanguage } from '@/context/LanguageContext';
import { selectCopy } from '@/data/translations';

/** Cierre del portafolio: formas directas de escribirle y su CV. */
export default function ContactLinks() {
  const { locale } = useLanguage();
  const gameResumes = CV_VARIANTS.filter(v => v.group === 'videojuegos');
  const cv = gameResumes.find(v => v.language === (locale === 'es' ? 'Español' : 'English')) ?? gameResumes[0];

  return (
    <div className="contact-card paper-card stitch-border">
      <div className="contact-direct">
        <button
          type="button"
          className="pixel-button"
          onClick={() => { window.location.href = `mailto:${getContactEmail()}`; }}
        >
          {selectCopy(locale, 'Escríbeme un correo', 'Send me an email')}
        </button>
        {cv && (
          <a className="pixel-button pixel-button--paper" href={cv.path} download={cv.downloadName}>
            {selectCopy(locale, 'Descargar mi CV', 'Download my résumé')}
          </a>
        )}
      </div>

      <p className="contact-also font-script">{selectCopy(locale, 'o búscame en', 'or find me on')}</p>
      <div className="contact-social">
        {RESUME_LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={SOCIAL_ICONS[link.label]} />
            </svg>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
