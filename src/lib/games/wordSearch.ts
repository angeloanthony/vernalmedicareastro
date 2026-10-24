// src/lib/games/wordSearch.ts — puzzle engine for Vernal Word Search.
//
// Pure and deterministic: generate(theme, level, seed) always returns the same
// puzzle, so a saved game is just {seed, theme, level, found}. Every placement
// is validated (fits, overlaps only on identical letters, adds at least one new
// cell so no word hides entirely inside another), and the filled grid is
// re-checked so each word occurs exactly once in any of the eight directions.
// Unit-tested in tests/word-search.test.ts. No DOM here.

export type Level = 'easy' | 'medium' | 'hard';
export type Dir = readonly [number, number]; // [dRow, dCol]

const ACROSS: Dir = [0, 1];
const DOWN: Dir = [1, 0];
const DIAG_DOWN: Dir = [1, 1];
const DIAG_UP: Dir = [-1, 1];
export const ALL_DIRS: Dir[] = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]];

export interface LevelSpec {
  label: string;
  size: number;
  words: number;
  maxLen: number;
  dirs: Dir[];
  hint: string;
}

export const LEVELS: Record<Level, LevelSpec> = {
  easy: { label: 'Easy', size: 8, words: 6, maxLen: 6, dirs: [ACROSS, DOWN], hint: '8 × 8 grid · 6 words · across and down' },
  medium: { label: 'Medium', size: 10, words: 8, maxLen: 8, dirs: [ACROSS, DOWN, DIAG_DOWN, DIAG_UP], hint: '10 × 10 grid · 8 words · adds diagonals' },
  hard: { label: 'Hard', size: 12, words: 10, maxLen: 10, dirs: ALL_DIRS, hint: '12 × 12 grid · 10 words · adds backwards' },
};
export const LEVEL_ORDER: Level[] = ['easy', 'medium', 'hard'];

export interface Theme {
  key: string;
  label: string;
  blurb: string;
  words: string[];
  /** Shown last and never the default — an option for people who want it. */
  optional?: boolean;
}

// Word lists: uppercase A–Z only, 4–10 letters, and within a theme no word is a
// substring of another (tests enforce this), so a found word is never ambiguous.
export const THEMES: Theme[] = [
  { key: 'nature', label: 'Nature', blurb: 'Rivers, meadows, and mountain weather.',
    words: ['FOREST', 'RIVER', 'MOUNTAIN', 'MEADOW', 'CANYON', 'DESERT', 'GLACIER', 'VALLEY', 'SUNRISE', 'BREEZE', 'THUNDER', 'RAINBOW', 'ORCHARD', 'PRAIRIE', 'WATERFALL', 'ISLAND', 'PEBBLE', 'LAGOON'] },
  { key: 'animals', label: 'Animals', blurb: 'From the barnyard to the deep sea.',
    words: ['ELEPHANT', 'GIRAFFE', 'DOLPHIN', 'PENGUIN', 'RABBIT', 'TURTLE', 'EAGLE', 'SALMON', 'BEAVER', 'COYOTE', 'MOOSE', 'OTTER', 'PARROT', 'ZEBRA', 'BISON', 'HERON', 'BADGER', 'WALRUS'] },
  { key: 'geography', label: 'Geography', blurb: 'States, cities, and places out West.',
    words: ['UTAH', 'VERNAL', 'CANADA', 'PACIFIC', 'ROCKIES', 'NEVADA', 'OREGON', 'DAKOTA', 'FLORIDA', 'ALASKA', 'HAWAII', 'TEXAS', 'DENVER', 'ARIZONA', 'WYOMING', 'IDAHO', 'MONTANA', 'KANSAS'] },
  { key: 'food', label: 'Food', blurb: 'Kitchen favorites and garden produce.',
    words: ['APPLE', 'BREAD', 'CHEESE', 'PEACH', 'SALAD', 'PASTA', 'BUTTER', 'HONEY', 'PEPPER', 'CARROT', 'TOMATO', 'LEMON', 'WALNUT', 'OATMEAL', 'PANCAKE', 'CHERRY', 'GARLIC', 'NOODLE'] },
  { key: 'everyday', label: 'Everyday Life', blurb: 'Things around the house.',
    words: ['GARDEN', 'KITCHEN', 'WINDOW', 'PILLOW', 'TEAPOT', 'LETTER', 'WALLET', 'MIRROR', 'CANDLE', 'BLANKET', 'SLIPPER', 'RADIO', 'PUZZLE', 'BASKET', 'CLOCK', 'SCARF', 'UMBRELLA', 'BUTTON'] },
  { key: 'medicare', label: 'Medicare Words', blurb: 'Optional: terms you meet when comparing coverage.', optional: true,
    words: ['PREMIUM', 'DEDUCTIBLE', 'COPAY', 'MEDIGAP', 'NETWORK', 'PHARMACY', 'HOSPICE', 'DOCTOR', 'BENEFITS', 'COVERAGE', 'ENROLL', 'FORMULARY', 'PLAN', 'CLAIM', 'VISIT', 'REFILL', 'SPECIALIST', 'WELLNESS'] },
];
export const DEFAULT_THEME = 'nature';
export const themeByKey = (key: string): Theme => THEMES.find((t) => t.key === key) ?? THEMES[0];

export interface Placement { word: string; row: number; col: number; dr: number; dc: number }
export interface Puzzle {
  seed: number;
  theme: string;
  level: Level;
  size: number;
  /** Rows of uppercase letters. */
  grid: string[];
  placements: Placement[];
}

/** mulberry32 — small, fast, deterministic. */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export const cellsOf = (p: Placement): [number, number][] =>
  Array.from({ length: p.word.length }, (_, i) => [p.row + p.dr * i, p.col + p.dc * i] as [number, number]);

/** Count how many times `word` appears in the grid, in all eight directions. */
export function countOccurrences(grid: string[], word: string): number {
  const n = grid.length; let count = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) for (const [dr, dc] of ALL_DIRS) {
    const er = r + dr * (word.length - 1), ec = c + dc * (word.length - 1);
    if (er < 0 || er >= n || ec < 0 || ec >= n) continue;
    let ok = true;
    for (let i = 0; i < word.length && ok; i++) if (grid[r + dr * i][c + dc * i] !== word[i]) ok = false;
    if (ok) count++;
  }
  return count;
}

/** Letters weighted toward common English letters, so filler looks natural. */
const FILL = 'EEEEEEAAAAARRRRIIIIOOOOTTTTNNNNSSSSLLLCCCUUDDPPMMHHGGBBFFYYWKVXZJQ';

export function generate(themeKey: string, level: Level, seed: number): Puzzle {
  const spec = LEVELS[level];
  const theme = themeByKey(themeKey);
  const rng = makeRng(seed ^ (level.length * 7919) ^ theme.key.length);
  const pool = theme.words.filter((w) => w.length <= spec.maxLen && w.length <= spec.size);

  for (let restart = 0; restart < 50; restart++) {
    const words = shuffle(pool, rng).slice(0, spec.words).sort((a, b) => b.length - a.length);
    const cells: (string | null)[][] = Array.from({ length: spec.size }, () => Array(spec.size).fill(null));
    const placements: Placement[] = [];
    let failed = false;

    for (const word of words) {
      let placed = false;
      for (let attempt = 0; attempt < 250 && !placed; attempt++) {
        const [dr, dc] = spec.dirs[Math.floor(rng() * spec.dirs.length)];
        const row = Math.floor(rng() * spec.size), col = Math.floor(rng() * spec.size);
        const er = row + dr * (word.length - 1), ec = col + dc * (word.length - 1);
        if (er < 0 || er >= spec.size || ec < 0 || ec >= spec.size) continue;
        let fits = true, fresh = 0;
        for (let i = 0; i < word.length && fits; i++) {
          const cur = cells[row + dr * i][col + dc * i];
          if (cur === null) fresh++; else if (cur !== word[i]) fits = false;
        }
        if (!fits || fresh === 0) continue; // must add at least one new cell
        for (let i = 0; i < word.length; i++) cells[row + dr * i][col + dc * i] = word[i];
        placements.push({ word, row, col, dr, dc });
        placed = true;
      }
      if (!placed) { failed = true; break; }
    }
    if (failed) continue;

    // Fill blanks, then make sure every word appears exactly once; refill if not.
    for (let fill = 0; fill < 40; fill++) {
      const grid = cells.map((r) => r.map((ch) => ch ?? FILL[Math.floor(rng() * FILL.length)]).join(''));
      if (words.every((w) => countOccurrences(grid, w) === 1)) {
        return { seed, theme: theme.key, level, size: spec.size, grid, placements };
      }
    }
  }
  throw new Error(`Could not generate a ${level} puzzle for theme ${themeKey} (seed ${seed})`);
}

/** The straight line of cells from start to end (8 directions), or null if not straight. */
export function lineCells(start: [number, number], end: [number, number]): [number, number][] | null {
  const dr = end[0] - start[0], dc = end[1] - start[1];
  if (dr === 0 && dc === 0) return [start];
  if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null;
  const len = Math.max(Math.abs(dr), Math.abs(dc));
  const sr = Math.sign(dr), sc = Math.sign(dc);
  return Array.from({ length: len + 1 }, (_, i) => [start[0] + sr * i, start[1] + sc * i] as [number, number]);
}

/** The placement whose cells exactly match a straight selection (either direction), if any. */
export function matchSelection(puzzle: Puzzle, start: [number, number], end: [number, number]): Placement | null {
  const line = lineCells(start, end);
  if (!line || line.length < 2) return null;
  const key = (cs: [number, number][]) => cs.map(([r, c]) => r + ',' + c).sort().join('|');
  const k = key(line);
  return puzzle.placements.find((p) => key(cellsOf(p)) === k) ?? null;
}

/** First unfound word in list order, for a hint — its first-letter cell. */
export function hintFor(puzzle: Puzzle, found: string[]): { word: string; cell: [number, number] } | null {
  const p = puzzle.placements.find((x) => !found.includes(x.word));
  return p ? { word: p.word, cell: [p.row, p.col] } : null;
}

/** Word list in the order the puzzle shows it (alphabetical — not placement order, which would leak positions). */
export const wordList = (puzzle: Puzzle): string[] => puzzle.placements.map((p) => p.word).sort();
