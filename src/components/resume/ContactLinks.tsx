"use client";

import { getContactEmail, getContactWhatsapp } from '@/data/resume';
import { useLanguage } from '@/context/LanguageContext';
import { selectCopy } from '@/data/translations';

/** Cierre del portafolio: correo y WhatsApp. Los datos se arman al tocar el botón. */
export default function ContactLinks() {
  const { locale } = useLanguage();
  return (
    <div className="contact-card paper-card stitch-border">
      <div className="contact-direct">
        <button type="button" className="pixel-button"
          onClick={() => { window.open(`https://wa.me/${getContactWhatsapp()}`, '_blank', 'noopener,noreferrer'); }}>
          WhatsApp
        </button>
        <button type="button" className="pixel-button pixel-button--paper"
          onClick={() => { window.location.href = `mailto:${getContactEmail()}`; }}>
          {selectCopy(locale, 'Correo', 'Email')}
        </button>
      </div>
    </div>
  );
}
