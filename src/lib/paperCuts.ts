export type CutAxis = 'h' | 'v';
export interface PaperCut { axis: CutAxis; position: number; stitched: boolean }
export type LetterCuts = PaperCut[];
export const hasOpenCut = (cuts: LetterCuts) => cuts.some(cut => !cut.stitched);

export function cutPaper(cuts: LetterCuts, axis: CutAxis, rawPosition: number): LetterCuts {
  const position = Math.max(18, Math.min(82, rawPosition));
  const neighbors = cuts.filter(cut => cut.axis === axis);
  // Keep old scars and avoid tiny, unreadable fragments.
  if (neighbors.length >= 2 || neighbors.some(cut => Math.abs(cut.position - position) < 16)) return cuts;
  return [...cuts, { axis, position, stitched: false }];
}

export function stitchPaper(cuts: LetterCuts, x: number, y: number): LetterCuts {
  let nearest = -1;
  let distance = Infinity;
  cuts.forEach((cut, i) => {
    const d = Math.abs(cut.position - (cut.axis === 'h' ? y : x));
    if (!cut.stitched && d < distance) { nearest = i; distance = d; }
  });
  return nearest < 0 ? cuts : cuts.map((cut, i) => i === nearest ? { ...cut, stitched: true } : cut);
}

// All pieces share the same jagged boundary; repaired edges fit together.
const edge = (start: number, end: number, position: number, horizontal: boolean) => {
  return Array.from({ length: 7 }, (_, i) => {
    const along = start + (end - start) * i / 6;
    const across = position + (position === 0 || position === 100 || i === 0 || i === 6 ? 0 : i % 2 ? 1.4 : -1.4);
    return horizontal ? `${along}% ${across}%` : `${across}% ${along}%`;
  });
};
export function buildFragments(cuts: LetterCuts) {
  const h = [0, ...cuts.filter(c => c.axis === 'h').map(c => c.position).sort((a, b) => a - b), 100];
  const v = [0, ...cuts.filter(c => c.axis === 'v').map(c => c.position).sort((a, b) => a - b), 100];
  return h.slice(0, -1).flatMap((top, row) => v.slice(0, -1).map((left, col) => {
    const bottom = h[row + 1], right = v[col + 1];
    const cx = (left + right) / 2, cy = (top + bottom) / 2;
    let x = 0, y = 0;
    for (const cut of cuts) {
      const direction = (cut.axis === 'h' ? cy : cx) < cut.position ? -1 : 1;
      const gap = cut.stitched ? 0.4 : 3;
      if (cut.axis === 'h') y += direction * gap; else x += direction * gap;
    }
    return {
      key: `${row}-${col}`, x, y,
      rotate: hasOpenCut(cuts) ? (row + col) % 2 ? 1.5 : -1.5 : (row + col) % 2 ? 0.2 : -0.2,
      clipPath: `polygon(${[...edge(left, right, top, true), ...edge(top, bottom, right, false), ...edge(left, right, bottom, true).reverse(), ...edge(top, bottom, left, false).reverse()].join(',')})`,
    };
  }));
}
