// src/lib/games/memoryMatch.ts — board engine for Vernal Memory Match.
//
// Pure and deterministic: generate(theme, level, seed) always deals the same
// board, so a saved game is {seed, theme, level, matched}. Every icon appears
// exactly twice; matching is by icon id. Unit-tested in tests/memory-match.test.ts.
// Artwork is original line-art (48×48, stroke currentColor) kept here so the
// portal card, the page and the tests all share one source.

import { makeRng } from './wordSearch';

export type Level = 'easy' | 'medium' | 'hard';
export interface LevelSpec { label: string; pairs: number; cols: number; colsNarrow: number; hint: string }
export const LEVELS: Record<Level, LevelSpec> = {
  easy: { label: 'Easy', pairs: 6, cols: 4, colsNarrow: 3, hint: '12 cards · 6 pairs' },
  medium: { label: 'Medium', pairs: 8, cols: 4, colsNarrow: 4, hint: '16 cards · 8 pairs' },
  hard: { label: 'Hard', pairs: 12, cols: 6, colsNarrow: 4, hint: '24 cards · 12 pairs' },
};
export const LEVEL_ORDER: Level[] = ['easy', 'medium', 'hard'];

export interface Icon { id: string; label: string; svg: string }
export interface Theme { key: string; label: string; blurb: string; color: string; icons: Icon[] }

const i = (id: string, label: string, svg: string): Icon => ({ id, label, svg });

export const THEMES: Theme[] = [
  { key: 'nature', label: 'Nature', blurb: 'Sun, trees, flowers, and weather.', color: '#166534', icons: [
    i('sun', 'Sun', '<circle cx="24" cy="24" r="8"/><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M11.3 36.7l3.5-3.5M33.2 14.8l3.5-3.5"/>'),
    i('moon', 'Moon', '<path d="M30 8a16 16 0 1 0 10 28A13 13 0 0 1 30 8z"/>'),
    i('cloud', 'Cloud', '<path d="M14 36h20a8 8 0 0 0 1-16 10 10 0 0 0-19 3 6.5 6.5 0 0 0-2 13z"/>'),
    i('tree', 'Tree', '<path d="M24 6l12 18h-7l9 12H10l9-12h-7z"/><path d="M24 36v8"/>'),
    i('leaf', 'Leaf', '<path d="M10 38C10 20 22 10 40 10c0 18-10 30-28 30"/><path d="M12 36l16-16"/>'),
    i('flower', 'Flower', '<circle cx="24" cy="24" r="5"/><path d="M24 7a6 6 0 0 1 0 12 6 6 0 0 1 0-12zM24 29a6 6 0 0 1 0 12 6 6 0 0 1 0-12zM7 24a6 6 0 0 1 12 0 6 6 0 0 1-12 0zM29 24a6 6 0 0 1 12 0 6 6 0 0 1-12 0z"/>'),
    i('mountain', 'Mountain', '<path d="M4 40L18 14l8 14 5-8 13 20z"/><path d="M14 22l4-4 4 4"/>'),
    i('raindrop', 'Raindrop', '<path d="M24 6s13 14 13 23a13 13 0 0 1-26 0C11 20 24 6 24 6z"/>'),
    i('snowflake', 'Snowflake', '<path d="M24 6v36M8 15l32 18M8 33l32-18M24 6l-4 4M24 6l4 4M24 42l-4-4M24 42l4-4"/>'),
    i('star', 'Star', '<path d="M24 6l5.5 11.5L42 19l-9 8.8 2.2 12.6L24 34.5l-11.2 5.9L15 27.8 6 19l12.5-1.5z"/>'),
    i('mushroom', 'Mushroom', '<path d="M6 24c0-10 8-18 18-18s18 8 18 18H6z"/><path d="M18 24v14a6 3 0 0 0 12 0V24"/><circle cx="16" cy="15" r="2"/><circle cx="28" cy="12" r="2"/>'),
    i('wave', 'Wave', '<path d="M4 30c5 0 5-6 10-6s5 6 10 6 5-6 10-6 5 6 10 6M4 38c5 0 5-6 10-6s5 6 10 6 5-6 10-6 5 6 10 6"/>'),
  ] },
  { key: 'animals', label: 'Animals', blurb: 'Friendly faces from farm, forest, and sea.', color: '#b45309', icons: [
    i('cat', 'Cat', '<path d="M10 40c0-12 4-18 4-18L10 8l10 6h8l10-6-4 14s4 6 4 18z"/><circle cx="19" cy="26" r="1.5"/><circle cx="29" cy="26" r="1.5"/><path d="M22 32h4l-2 2z"/>'),
    i('dog', 'Dog', '<path d="M12 18c-4 0-6 4-6 8s2 6 4 6M36 18c4 0 6 4 6 8s-2 6-4 6"/><path d="M14 14h20l4 10v10a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V24z"/><circle cx="19" cy="26" r="1.5"/><circle cx="29" cy="26" r="1.5"/><path d="M21 33h6"/>'),
    i('fish', 'Fish', '<path d="M6 24c6-8 14-12 22-12 6 0 10 4 14 12-4 8-8 12-14 12-8 0-16-4-22-12z"/><path d="M42 24l-6-8M42 24l-6 8"/><circle cx="14" cy="22" r="1.5"/>'),
    i('bird', 'Bird', '<path d="M8 30c8 0 14-4 16-12 2 6 8 8 16 8-2 6-8 10-16 10h-6"/><path d="M24 36v6M20 42h8"/><circle cx="26" cy="20" r="1.5"/>'),
    i('butterfly', 'Butterfly', '<path d="M24 14v22"/><path d="M24 20C18 8 6 10 8 20s12 6 16 2M24 20c6-12 18-10 16 0s-12 6-16 2M24 28c-6 12-16 8-14 0s10-4 14-4M24 28c6 12 16 8 14 0s-10-4-14-4"/><path d="M22 14l-3-5M26 14l3-5"/>'),
    i('turtle', 'Turtle', '<ellipse cx="24" cy="26" rx="14" ry="10"/><path d="M10 32l-4 4M38 32l4 4M12 20l-4-4M24 16v10M16 22l8 4 8-4"/><circle cx="42" cy="23" r="4"/>'),
    i('rabbit', 'Rabbit', '<path d="M18 22c-2-10 0-16 2-16s4 6 4 16M30 22c2-10 0-16-2-16s-4 6-4 16"/><circle cx="24" cy="30" r="10"/><circle cx="20" cy="28" r="1.5"/><circle cx="28" cy="28" r="1.5"/><path d="M22 34c1 1 3 1 4 0"/>'),
    i('owl', 'Owl', '<path d="M12 10h24v22a12 12 0 0 1-24 0z"/><circle cx="18" cy="20" r="4"/><circle cx="30" cy="20" r="4"/><circle cx="18" cy="20" r="1.5"/><circle cx="30" cy="20" r="1.5"/><path d="M22 28h4l-2 3z"/><path d="M12 10l4 4M36 10l-4 4"/>'),
    i('bee', 'Bee', '<ellipse cx="26" cy="28" rx="12" ry="9"/><path d="M20 20v16M27 19v18M34 22v12"/><circle cx="12" cy="24" r="5"/><path d="M18 14c4-6 12-6 16 0M38 28h6"/>'),
    i('frog', 'Frog', '<path d="M8 30c0-8 7-12 16-12s16 4 16 12-7 10-16 10S8 38 8 30z"/><circle cx="16" cy="18" r="4"/><circle cx="32" cy="18" r="4"/><circle cx="16" cy="18" r="1.5"/><circle cx="32" cy="18" r="1.5"/><path d="M16 32c4 3 12 3 16 0"/>'),
    i('snail', 'Snail', '<circle cx="28" cy="24" r="11"/><path d="M28 24a5 5 0 1 1 5 5"/><path d="M4 36c0-6 4-8 10-8h4"/><path d="M6 28l-2-8M10 28l2-8"/><path d="M4 36h40"/>'),
    i('whale', 'Whale', '<path d="M6 26c4-8 12-12 24-12 8 0 12 4 12 10 0 4-2 8-8 10H14c-6 0-8-4-8-8z"/><path d="M36 14l6-6M36 14l-2-8"/><path d="M14 34c2 4 6 6 10 6"/><circle cx="14" cy="22" r="1.5"/>'),
  ] },
  { key: 'landmarks', label: 'Landmarks', blurb: 'Towers, bridges, and places to visit.', color: '#1d4ed8', icons: [
    i('lighthouse', 'Lighthouse', '<path d="M18 42l2-26h8l2 26z"/><path d="M16 16h16l-2-6H18z"/><path d="M14 42h20M20 24h8M19 32h10"/><path d="M8 10l6 2M40 10l-6 2"/>'),
    i('bridge', 'Bridge', '<path d="M4 30h40"/><path d="M8 30c6-14 26-14 32 0"/><path d="M12 30v8M18 30v8M24 30v8M30 30v8M36 30v8M4 38h40"/>'),
    i('castle', 'Castle', '<path d="M8 42V18h6v-6h6v6h8v-6h6v6h6v24z"/><path d="M20 42V30h8v12"/><path d="M14 24h4M30 24h4"/>'),
    i('windmill', 'Windmill', '<path d="M18 42l3-20h6l3 20z"/><path d="M24 22l-12-12M24 22l12-12M24 22l-12 12M24 22l12 12"/><circle cx="24" cy="22" r="2"/><path d="M14 42h20"/>'),
    i('pyramid', 'Pyramid', '<path d="M4 38L24 8l20 30z"/><path d="M24 8l-4 30M4 38h40"/>'),
    i('tower', 'Tower', '<path d="M20 42l2-30h4l2 30z"/><path d="M16 12h16M14 42h20"/><path d="M24 12V6M21 6h6"/>'),
    i('barn', 'Barn', '<path d="M8 42V20L24 8l16 12v22z"/><path d="M18 42V28h12v14M18 28l12 14M30 28L18 42"/><path d="M4 42h40"/>'),
    i('cabin', 'Cabin', '<path d="M6 40V22L24 10l18 12v18z"/><path d="M20 40V28h8v12M30 14v-6h4v8"/><path d="M4 40h40M6 24h36M6 32h36"/>'),
    i('tent', 'Tent', '<path d="M4 40L24 10l20 30z"/><path d="M24 10v30M18 40l6-12 6 12"/><path d="M4 40h40"/>'),
    i('arch', 'Arch', '<path d="M8 42V24a16 16 0 0 1 32 0v18"/><path d="M16 42V26a8 8 0 0 1 16 0v16"/><path d="M4 42h40"/>'),
    i('fountain', 'Fountain', '<path d="M24 12v8"/><path d="M24 12c-6 0-8-6-4-8M24 12c6 0 8-6 4-8"/><path d="M12 24h24l-4 8H16z"/><path d="M8 36h32v6H8z"/><path d="M18 20a6 6 0 0 0 12 0"/>'),
    i('belltower', 'Bell tower', '<path d="M16 42V14l8-8 8 8v28z"/><path d="M12 42h24"/><path d="M20 24h8v10h-8z"/><path d="M24 24v-6M21 30h6"/>'),
  ] },
  { key: 'everyday', label: 'Everyday Objects', blurb: 'Things around the house.', color: '#6b21a8', icons: [
    i('teapot', 'Teapot', '<path d="M10 22h24v8a10 10 0 0 1-20 0v-8z"/><path d="M34 24h6c0 6-2 8-6 8M10 26c-4 0-6-2-6-6s2-4 6-4"/><path d="M18 22c0-6 2-8 6-8s6 2 6 8"/><path d="M24 14v-4h-3M24 10h3"/>'),
    i('key', 'Key', '<circle cx="16" cy="24" r="8"/><path d="M24 24h18M36 24v6M42 24v4"/>'),
    i('umbrella', 'Umbrella', '<path d="M6 24c0-10 8-16 18-16s18 6 18 16H6z"/><path d="M24 24v12a4 4 0 0 1-8 0"/><path d="M24 8V4"/>'),
    i('clock', 'Clock', '<circle cx="24" cy="24" r="16"/><path d="M24 12v12l8 5"/>'),
    i('book', 'Book', '<path d="M8 10h12a4 4 0 0 1 4 4v24a4 4 0 0 0-4-4H8z"/><path d="M40 10H28a4 4 0 0 0-4 4v24a4 4 0 0 1 4-4h12z"/>'),
    i('lamp', 'Lamp', '<path d="M14 6h20l6 18H8z"/><path d="M24 24v14M14 42h20M18 38h12"/>'),
    i('scissors', 'Scissors', '<circle cx="14" cy="14" r="5"/><circle cx="14" cy="34" r="5"/><path d="M18 17l22 15M18 31l22-15"/>'),
    i('glasses', 'Glasses', '<circle cx="14" cy="26" r="7"/><circle cx="34" cy="26" r="7"/><path d="M21 26h6M7 24l4-8M41 24l-4-8"/>'),
    i('hat', 'Hat', '<path d="M4 32h40M12 32V16a12 12 0 0 1 24 0v16"/><path d="M12 28h24"/>'),
    i('mug', 'Mug', '<path d="M8 14h24v18a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6z"/><path d="M32 18h4a5 5 0 0 1 0 10h-4"/><path d="M14 8c0 3 2 3 2 6M20 6c0 3 2 3 2 6"/>'),
    i('bell', 'Bell', '<path d="M12 32c4-4 4-8 4-14a8 8 0 0 1 16 0c0 6 0 10 4 14z"/><path d="M20 36a4 4 0 0 0 8 0M24 10V6"/>'),
    i('bicycle', 'Bicycle', '<circle cx="12" cy="32" r="8"/><circle cx="36" cy="32" r="8"/><path d="M12 32l8-14h12l4 14M20 18h-4M24 32l8-14M20 18l4 14"/>'),
  ] },
];
export const DEFAULT_THEME = 'nature';
export const themeByKey = (key: string): Theme => THEMES.find((t) => t.key === key) ?? THEMES[0];
export const iconOf = (theme: Theme, id: string): Icon => theme.icons.find((x) => x.id === id) as Icon;

/** Full SVG markup for an icon (line art, currentColor). */
export const iconSvg = (icon: Icon): string =>
  `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.svg}</svg>`;

export interface Board { seed: number; theme: string; level: Level; pairs: number; cards: string[] /* icon id per position */ }

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let k = a.length - 1; k > 0; k--) { const j = Math.floor(rng() * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
  return a;
}

export function generate(themeKey: string, level: Level, seed: number): Board {
  const theme = themeByKey(themeKey);
  const spec = LEVELS[level];
  const rng = makeRng(seed ^ (spec.pairs * 104729) ^ theme.key.length);
  const chosen = shuffle(theme.icons.map((x) => x.id), rng).slice(0, spec.pairs);
  return { seed, theme: theme.key, level, pairs: spec.pairs, cards: shuffle([...chosen, ...chosen], rng) };
}

export const isMatch = (board: Board, a: number, b: number): boolean => a !== b && board.cards[a] === board.cards[b];

/** Positions of the first unmatched pair (board order), for a hint. */
export function hintPair(board: Board, matched: string[]): [number, number] | null {
  for (let a = 0; a < board.cards.length; a++) {
    const id = board.cards[a];
    if (matched.includes(id)) continue;
    const b = board.cards.indexOf(id, a + 1);
    if (b > -1) return [a, b];
  }
  return null;
}

export const isComplete = (board: Board, matched: string[]): boolean => matched.length >= board.pairs;

/** Columns for a given width class; rows follow from the card count. */
export const columnsFor = (level: Level, narrow: boolean): number => (narrow ? LEVELS[level].colsNarrow : LEVELS[level].cols);
