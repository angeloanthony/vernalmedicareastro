// tests/word-search.test.ts — the Word Search engine's guarantees.
import { describe, it, expect } from 'vitest';
import {
  THEMES, LEVELS, LEVEL_ORDER, generate, cellsOf, countOccurrences, lineCells, matchSelection, hintFor, wordList, makeRng,
  type Level,
} from '../src/lib/games/wordSearch';

describe('themes', () => {
  it('every word is 4–10 uppercase letters', () => {
    for (const t of THEMES) for (const w of t.words) expect(w, `${t.key}: ${w}`).toMatch(/^[A-Z]{4,10}$/);
  });
  it('no word is a substring of another in the same theme (no ambiguous finds)', () => {
    for (const t of THEMES) for (const a of t.words) for (const b of t.words) {
      if (a !== b) expect(b.includes(a), `${t.key}: ${a} inside ${b}`).toBe(false);
    }
  });
  it('every theme has enough words for every level', () => {
    for (const t of THEMES) for (const lv of LEVEL_ORDER) {
      const spec = LEVELS[lv];
      expect(t.words.filter((w) => w.length <= spec.maxLen).length, `${t.key}/${lv}`).toBeGreaterThanOrEqual(spec.words);
    }
  });
  it('the Medicare theme is optional and not the default', () => {
    expect(THEMES.find((t) => t.key === 'medicare')?.optional).toBe(true);
    expect(THEMES[0].key).not.toBe('medicare');
  });
});

describe('generate', () => {
  const cases: [string, Level, number][] = [];
  for (const t of THEMES) for (const lv of LEVEL_ORDER) for (const seed of [1, 2, 3, 42, 2026]) cases.push([t.key, lv, seed]);

  it('is deterministic for a given theme, level and seed', () => {
    const a = generate('nature', 'medium', 7), b = generate('nature', 'medium', 7);
    expect(a).toEqual(b);
    expect(generate('nature', 'medium', 8).grid).not.toEqual(a.grid);
  });

  it.each(cases)('%s / %s / seed %i: valid, unique placements and each word exactly once', (theme, level, seed) => {
    const p = generate(theme, level, seed);
    const spec = LEVELS[level];
    expect(p.size).toBe(spec.size);
    expect(p.grid.length).toBe(spec.size);
    for (const row of p.grid) expect(row).toMatch(new RegExp(`^[A-Z]{${spec.size}}$`));
    expect(p.placements.length).toBe(spec.words);
    const words = p.placements.map((x) => x.word);
    expect(new Set(words).size).toBe(words.length);
    for (const pl of p.placements) {
      // direction allowed at this level
      expect(spec.dirs.some(([dr, dc]) => dr === pl.dr && dc === pl.dc), `${pl.word} dir`).toBe(true);
      // letters on the grid match the placement
      for (const [i, [r, c]] of cellsOf(pl).entries()) {
        expect(r).toBeGreaterThanOrEqual(0); expect(r).toBeLessThan(spec.size);
        expect(c).toBeGreaterThanOrEqual(0); expect(c).toBeLessThan(spec.size);
        expect(p.grid[r][c]).toBe(pl.word[i]);
      }
      // the word appears exactly once in the whole grid
      expect(countOccurrences(p.grid, pl.word), pl.word).toBe(1);
    }
    // no two placements share the identical cell set
    const keys = p.placements.map((pl) => cellsOf(pl).map(([r, c]) => r + ',' + c).sort().join('|'));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('easy puzzles only run across or down; hard puzzles use backwards directions sometimes', () => {
    for (let s = 1; s <= 20; s++) for (const pl of generate('animals', 'easy', s).placements) expect((pl.dr === 0 && pl.dc === 1) || (pl.dr === 1 && pl.dc === 0)).toBe(true);
    const back = Array.from({ length: 20 }, (_, s) => generate('animals', 'hard', s + 1)).flatMap((p) => p.placements).some((pl) => pl.dr < 0 || pl.dc < 0);
    expect(back).toBe(true);
  });

  it('word list is alphabetical (does not leak placement order)', () => {
    const w = wordList(generate('food', 'hard', 5));
    expect(w).toEqual(w.slice().sort());
  });
});

describe('selection', () => {
  it('lineCells accepts straight lines in 8 directions and rejects knights’ moves', () => {
    expect(lineCells([0, 0], [0, 3])).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
    expect(lineCells([3, 3], [0, 0])).toEqual([[3, 3], [2, 2], [1, 1], [0, 0]]);
    expect(lineCells([2, 5], [5, 2])).toHaveLength(4);
    expect(lineCells([0, 0], [1, 2])).toBeNull();
  });
  it('matchSelection finds a word in either direction and rejects partial or wrong lines', () => {
    const p = generate('nature', 'hard', 11);
    const pl = p.placements[0];
    const cells = cellsOf(pl);
    const start = cells[0], end = cells[cells.length - 1];
    expect(matchSelection(p, start, end)?.word).toBe(pl.word);
    expect(matchSelection(p, end, start)?.word).toBe(pl.word);
    expect(matchSelection(p, start, cells[cells.length - 2])).toBeNull();
    expect(matchSelection(p, start, start)).toBeNull();
  });
  it('hintFor points at the first letter of the first unfound word, then null when all found', () => {
    const p = generate('food', 'easy', 3);
    const h = hintFor(p, []);
    expect(h?.word).toBe(p.placements[0].word);
    expect(h?.cell).toEqual([p.placements[0].row, p.placements[0].col]);
    expect(hintFor(p, p.placements.map((x) => x.word))).toBeNull();
  });
  it('rng is deterministic and in [0,1)', () => {
    const a = makeRng(99), b = makeRng(99);
    for (let i = 0; i < 100; i++) { const x = a(); expect(x).toBe(b()); expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThan(1); }
  });
});

describe('generator robustness', () => {
  it('never fails for 300 consecutive seeds per theme and level (incl. large random seeds)', () => {
    let count = 0;
    for (const t of THEMES) for (const lv of LEVEL_ORDER) {
      for (let seed = 1; seed <= 300; seed++) { const p = generate(t.key, lv, seed); expect(p.placements.length).toBe(LEVELS[lv].words); count++; }
      for (const seed of [4294967295, 2147483647, 1697040000000 % 4294967296, 0]) { const p = generate(t.key, lv, seed); expect(p.placements.length).toBe(LEVELS[lv].words); count++; }
    }
    expect(count).toBe(THEMES.length * LEVEL_ORDER.length * 304);
  });
});
