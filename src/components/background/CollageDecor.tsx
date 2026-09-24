"use client";

import { useEffect } from 'react';
import CollagePiece from './CollagePiece';
import { useLanguage } from '@/context/LanguageContext';

const HINT_KEY = 'lia-sax-hint';

/** Recortes del Índice: cada uno lleva a su capítulo. La música va en el saxofón de la esquina. */
export default function CollageDecor({ section }: { section: string }) {
  const { locale } = useLanguage();
  const en = locale === 'en';

  // La primera vez que se entra al Índice, Lía corre hasta el saxofón de la esquina y lo señala.
  useEffect(() => {
    if (section !== 'mapa') return;
    try { if (window.sessionStorage.getItem(HINT_KEY)) return; } catch { /* sin storage igual se muestra */ }
    const timer = window.setTimeout(() => {
      try { window.sessionStorage.setItem(HINT_KEY, '1'); } catch { /* opcional */ }
      window.dispatchEvent(new CustomEvent('lia-point', { detail: {
        selector: '.music-sax .collage-piece',
        es: '¡Hey! ¡Mira! Este saxofón prende y apaga la música. Los otros recortes te llevan a su capítulo.',
        en: 'Hey! Look! This sax turns the music on and off. The other cutouts take you to their chapter.',
      } }));
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [section]);

  if (section !== 'mapa') return null;
  return (
    <div className="collage-index-objects" aria-label={en ? 'Cutouts' : 'Recortes'}>
      <CollagePiece object="carrete" goTo="diseno" hint={en ? 'Go to Fashion Design' : 'Ir a Diseño de Modas'} />
      <CollagePiece object="codigo" goTo="estructura" hint={en ? 'Go to Structure' : 'Ir a Estructura'} />
      <CollagePiece object="gamepad" goTo="juego" hint={en ? 'Go to Video Games' : 'Ir a Videojuegos'} />
    </div>
  );
}
