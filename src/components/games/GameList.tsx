"use client";

import { GAMES } from '@/data/games';
import GameCard from './GameCard';

export default function GameList() {
  return (
    <>
      {GAMES.map((game, i) => (
        <GameCard key={game.id} game={game} index={i} />
      ))}
    </>
  );
}
