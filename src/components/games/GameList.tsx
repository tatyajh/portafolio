"use client";

import { GAMES } from '@/data/games';
import GameCard from './GameCard';
import { useLanguage } from '@/context/LanguageContext';
import { localizeGame } from '@/data/translations';

export default function GameList() {
  const { locale } = useLanguage();
  return (
    <>
      {GAMES.map(game => localizeGame(game, locale)).map((game, i) => (
        <GameCard key={game.id} game={game} index={i} />
      ))}
    </>
  );
}
