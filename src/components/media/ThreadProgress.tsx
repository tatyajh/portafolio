"use client";
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { THREAD_EVENT, THREAD_LABELS, type ThreadAchievement } from '@/lib/threadProgress';

export default function ThreadProgress() {
  const { locale } = useLanguage();
  const [achievement, setAchievement] = useState<ThreadAchievement | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const announce = (event: Event) => {
      setAchievement((event as CustomEvent<ThreadAchievement>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setAchievement(null), 4500);
    };
    window.addEventListener(THREAD_EVENT, announce);
    return () => { window.removeEventListener(THREAD_EVENT, announce); clearTimeout(timer); };
  }, []);
  return (
    <aside className="thread-progress" aria-label={locale === 'en' ? 'Collected threads' : 'Hilos encontrados'}>
      <div role="status" aria-live="polite" aria-atomic="true">
        {achievement && <div className="thread-achievement"><span>{locale === 'en' ? 'ACHIEVEMENT UNLOCKED' : 'LOGRO DESBLOQUEADO'}</span><strong>{THREAD_LABELS[achievement][locale]}</strong></div>}
      </div>
    </aside>
  );
}
