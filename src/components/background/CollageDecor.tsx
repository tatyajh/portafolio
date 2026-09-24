"use client";

import CollagePiece from './CollagePiece';

export default function CollageDecor({ section }: { section: string }) {
  if (section !== 'mapa') return null;
  return (
    <div className="collage-index-objects" aria-label="Collage">
      <CollagePiece object="carrete" />
      <CollagePiece object="codigo" />
      <CollagePiece object="gamepad" />
    </div>
  );
}
