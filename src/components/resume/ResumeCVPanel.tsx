"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CV_VARIANTS, type CVVariant } from '@/data/cv';
import { useLanguage } from '@/context/LanguageContext';
import { selectCopy } from '@/data/translations';

interface SecurityOption {
  label: string;
  correct: boolean;
}

interface SecurityStep {
  eyebrow: string;
  question: string;
  options: SecurityOption[];
}

const SECURITY_STEPS: Record<'es' | 'en', SecurityStep[]> = {
  es: [
    {
      eyebrow: 'Alerta de phishing',
      question: 'Un correo urgente te pide la contraseña para evitar un bloqueo. ¿Qué haces primero?',
      options: [
        { label: 'Responder con la contraseña', correct: false },
        { label: 'Verificar el remitente por otro canal', correct: true },
        { label: 'Abrir el enlace de inmediato', correct: false },
      ],
    },
    {
      eyebrow: 'Defensa de credenciales',
      question: 'Elige la contraseña más resistente para una cuenta nueva.',
      options: [
        { label: 'tatiana123', correct: false },
        { label: 'La misma de todas mis cuentas', correct: false },
        { label: 'Nube!Cobre7-Lince', correct: true },
      ],
    },
    {
      eyebrow: 'Segunda barrera',
      question: 'Si alguien consigue tu contraseña, ¿qué protección todavía puede detenerlo?',
      options: [
        { label: 'Autenticación multifactor (MFA)', correct: true },
        { label: 'Cerrar una pestaña', correct: false },
        { label: 'Cambiar el fondo de pantalla', correct: false },
      ],
    },
  ],
  en: [
    {
      eyebrow: 'Phishing alert',
      question: 'An urgent email asks for your password to prevent a lockout. What do you do first?',
      options: [
        { label: 'Reply with the password', correct: false },
        { label: 'Verify the sender through another channel', correct: true },
        { label: 'Open the link immediately', correct: false },
      ],
    },
    {
      eyebrow: 'Credential defense',
      question: 'Choose the strongest password for a new account.',
      options: [
        { label: 'tatiana123', correct: false },
        { label: 'The same one used everywhere else', correct: false },
        { label: 'Orbit!Cedar7-Raven', correct: true },
      ],
    },
    {
      eyebrow: 'Second barrier',
      question: 'If someone obtains your password, which protection can still stop them?',
      options: [
        { label: 'Multi-factor authentication (MFA)', correct: true },
        { label: 'Closing a browser tab', correct: false },
        { label: 'Changing the wallpaper', correct: false },
      ],
    },
  ],
};

function DownloadCard({ variant, index, locale }: { variant: CVVariant; index: number; locale: 'es' | 'en' }) {
  const spanish = variant.language === 'Español';
  const languageLabel = spanish ? selectCopy(locale, 'Español', 'Spanish') : 'English';
  const recommended = variant.group === 'videojuegos' && ((locale === 'es' && spanish) || (locale === 'en' && !spanish));
  const title = variant.id === 'videojuegos-es'
    ? 'CV de videojuegos'
    : variant.id === 'videojuegos-en'
      ? 'Game development résumé'
      : variant.id === 'completo-es'
        ? 'Trayectoria completa'
        : 'Complete résumé';
  const description = variant.id === 'videojuegos-es'
    ? selectCopy(locale, 'Para estudios, equipos y oportunidades de Unity y C#.', 'Spanish version for Unity and C# roles.')
    : variant.id === 'videojuegos-en'
      ? selectCopy(locale, 'Versión en inglés para oportunidades internacionales.', 'For international Unity, C# and game development roles.')
      : variant.id === 'completo-es'
        ? selectCopy(locale, 'Software, soporte, formación y habilidades creativas.', 'Spanish version covering software, support and creative skills.')
        : selectCopy(locale, 'Versión completa en inglés de toda mi trayectoria.', 'My complete professional background in English.');

  return (
    <motion.a
      href={variant.path}
      download={variant.downloadName}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48 + index * 0.07 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`cv-download-card ${recommended ? 'is-recommended' : ''}`}
    >
      <span className="cv-download-card-topline">
        <span>{variant.group === 'videojuegos'
          ? selectCopy(locale, 'Enfoque videojuegos', 'Game development focus')
          : selectCopy(locale, 'Perfil completo', 'Complete profile')}</span>
        {recommended && <strong>{selectCopy(locale, 'Recomendado', 'Recommended')}</strong>}
      </span>
      <strong className="cv-download-title">{title}</strong>
      <span className="cv-download-meta">
        {languageLabel} · {variant.pages} {variant.pages === 1
          ? selectCopy(locale, 'página', 'page')
          : selectCopy(locale, 'páginas', 'pages')}
      </span>
      <p>{description}</p>
      <span className="cv-download-action">
        {selectCopy(locale, 'Descargar PDF', 'Download PDF')} <span aria-hidden="true">↓</span>
      </span>
    </motion.a>
  );
}

export default function ResumeCVPanel() {
  const { locale } = useLanguage();
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [securityStep, setSecurityStep] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [archiveUnlocked, setArchiveUnlocked] = useState(false);
  const gameResumes = CV_VARIANTS.filter(variant => variant.group === 'videojuegos');
  const completeResumes = CV_VARIANTS.filter(variant => variant.group === 'completo');
  const profileAreas = locale === 'es'
    ? ['Unity + C#', 'React + TypeScript', 'UX y diseño creativo']
    : ['Unity + C#', 'React + TypeScript', 'UX and creative design'];
  const step = SECURITY_STEPS[locale][securityStep];

  const answerChallenge = (correct: boolean) => {
    if (!correct) {
      setFeedback(selectCopy(locale, 'Acceso denegado. Revisa la pista e inténtalo otra vez.', 'Access denied. Check the clue and try again.'));
      return;
    }
    if (securityStep === SECURITY_STEPS[locale].length - 1) {
      setArchiveUnlocked(true);
      setFeedback('');
      return;
    }
    setFeedback(selectCopy(locale, 'Defensa correcta. Siguiente nivel desbloqueado.', 'Correct defense. Next level unlocked.'));
    window.setTimeout(() => {
      setSecurityStep(current => current + 1);
      setFeedback('');
    }, 520);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.55 }}
      className="cv-showcase"
      aria-labelledby="cv-presentation-title"
    >
      <div className="cv-presentation-card">
        <div className="cv-presentation-copy">
          <h3 id="cv-presentation-title">{selectCopy(locale, 'Hola, soy Tatiana.', "Hi, I'm Tatiana.")}</h3>
          <p>{selectCopy(
            locale,
            'Soy ingeniera de sistemas y hago videojuegos en Unity. También estudié diseño de modas y toco saxofón. Todo eso se cuela en lo que programo.',
            "I'm a systems engineer and I make games in Unity. I also studied fashion design and I play the sax. All of that sneaks into what I code.",
          )}</p>
          <div className="cv-profile-areas" aria-label={selectCopy(locale, 'Áreas principales', 'Main areas')}>
            {profileAreas.map(area => <span key={area}>{area}</span>)}
          </div>
        </div>

      </div>

      <div className="cv-downloads">
        <div className="cv-downloads-heading">
          <div>
            <span className="cv-kicker">{selectCopy(locale, 'CV principal', 'Main résumé')}</span>
            <h4>{selectCopy(locale, 'Enfoque videojuegos', 'Game development focus')}</h4>
          </div>
          <p>{selectCopy(locale, 'El idioma del portafolio aparece primero.', 'The portfolio language appears first.')}</p>
        </div>

        <div className="cv-download-grid">
          {[...gameResumes].sort(variant => variant.language === (locale === 'es' ? 'Español' : 'English') ? -1 : 1)
            .map((variant, index) => <DownloadCard key={variant.id} variant={variant} index={index} locale={locale} />)}
        </div>
      </div>

      <div className="cv-secret-archive">
        <div className="cv-secret-heading">
          <span className="cv-terminal-status" aria-hidden="true" />
          <div>
            <span className="cv-kicker">{selectCopy(locale, 'Archivo protegido', 'Protected archive')}</span>
            <h4>{selectCopy(locale, '¿Quieres conocer mis otras habilidades técnicas?', 'Want to discover my other technical skills?')}</h4>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!challengeStarted && !archiveUnlocked && (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="cv-secret-intro">
              <p>{selectCopy(
                locale,
                'Las versiones completas están detrás de un pequeño desafío de ciberseguridad. Supera tres decisiones para abrir el archivo.',
                'The complete résumés are behind a short cybersecurity challenge. Clear three decisions to open the archive.',
              )}</p>
              <button type="button" onClick={() => setChallengeStarted(true)}>
                {selectCopy(locale, 'Iniciar desafío', 'Start challenge')} <span aria-hidden="true">→</span>
              </button>
            </motion.div>
          )}

          {challengeStarted && !archiveUnlocked && (
            <motion.div key={`step-${securityStep}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="cv-security-game">
              <div className="cv-security-progress">
                <span>{selectCopy(locale, 'Nivel', 'Level')} {securityStep + 1}/3</span>
                <span>{step.eyebrow}</span>
              </div>
              <p className="cv-security-question">{step.question}</p>
              <div className="cv-security-options">
                {step.options.map(option => (
                  <button key={option.label} type="button" onClick={() => answerChallenge(option.correct)}>
                    <span aria-hidden="true">&gt;_</span> {option.label}
                  </button>
                ))}
              </div>
              <p className="cv-security-feedback" role="status">{feedback}</p>
            </motion.div>
          )}

          {archiveUnlocked && (
            <motion.div key="unlocked" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="cv-unlocked-archive">
              <p className="cv-access-granted">{selectCopy(locale, 'Acceso concedido · archivo completo', 'Access granted · complete archive')}</p>
              <div className="cv-download-grid">
                {[...completeResumes].sort(variant => variant.language === (locale === 'es' ? 'Español' : 'English') ? -1 : 1)
                  .map((variant, index) => <DownloadCard key={variant.id} variant={variant} index={index} locale={locale} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
