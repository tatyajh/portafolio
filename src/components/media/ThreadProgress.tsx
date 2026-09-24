"use client";
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getThreadSnapshot, getServerThreads, subscribeThreads, THREAD_EVENT, THREAD_LABELS, type ThreadAchievement } from '@/lib/threadProgress';

export default function ThreadProgress() {
  const { locale } = useLanguage();
  const snapshot = useSyncExternalStore(subscribeThreads, getThreadSnapshot, getServerThreads);
  const count = snapshot.split(',').filter(Boolean).length;
  const total = Object.keys(THREAD_LABELS).length;
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
      <span>{locale === 'en' ? 'THREADS' : 'HILOS'} {count}/{total}</span>
      <span className="thread-progress-stitches" aria-hidden="true">{Array.from({ length: total }, (_, i) => <i key={i} className={i < count ? 'on' : undefined} />)}</span>
      <div role="status" aria-live="polite" aria-atomic="true">
        {achievement && <div className="thread-achievement"><span>{locale === 'en' ? 'ACHIEVEMENT UNLOCKED' : 'LOGRO DESBLOQUEADO'}</span><strong>{THREAD_LABELS[achievement][locale]}</strong></div>}
      </div>
    </aside>
  );
}
