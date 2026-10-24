// tests/memory-match.test.ts — the Memory Match engine's guarantees.
import { describe, it, expect } from 'vitest';
import { THEMES, LEVELS, LEVEL_ORDER, generate, isMatch, hintPair, isComplete, columnsFor, iconSvg, type Level } from '../src/lib/games/memoryMatch';

describe('themes and icons', () => {
  it('every theme has at least 12 icons with unique ids, labels and artwork', () => {
    for (const t of THEMES) {
      expect(t.icons.length, t.key).toBeGreaterThanOrEqual(12);
      expect(new Set(t.icons.map((x) => x.id)).size).toBe(t.icons.length);
      for (const ic of t.icons) {
        expect(ic.id).toMatch(/^[a-z]+$/);
        expect(ic.label.trim().length).toBeGreaterThan(0);
        expect(ic.svg).toMatch(/<(path|circle|ellipse)/);
        expect(iconSvg(ic)).toMatch(/^<svg .*aria-hidden="true">.*<\/svg>$/);
      }
    }
  });
  it('every level fits every theme, and card counts are even grids', () => {
    for (const lv of LEVEL_ORDER) {
      for (const t of THEMES) expect(t.icons.length).toBeGreaterThanOrEqual(LEVELS[lv].pairs);
      expect((LEVELS[lv].pairs * 2) % LEVELS[lv].cols, lv).toBe(0);
      expect((LEVELS[lv].pairs * 2) % LEVELS[lv].colsNarrow, lv).toBe(0);
    }
  });
});

describe('generate', () => {
  const cases: [string, Level, number][] = [];
  for (const t of THEMES) for (const lv of LEVEL_ORDER) for (const seed of [1, 2, 3, 42, 2026, 4294967295]) cases.push([t.key, lv, seed]);

  it('is deterministic per theme/level/seed and varies by seed', () => {
    expect(generate('animals', 'medium', 9)).toEqual(generate('animals', 'medium', 9));
    expect(generate('animals', 'medium', 9).cards).not.toEqual(generate('animals', 'medium', 10).cards);
  });

  it.each(cases)('%s / %s / seed %i: each icon exactly twice, icons from the theme', (theme, level, seed) => {
    const b = generate(theme, level, seed);
    const spec = LEVELS[level];
    expect(b.cards.length).toBe(spec.pairs * 2);
    const counts = new Map<string, number>();
    for (const id of b.cards) counts.set(id, (counts.get(id) ?? 0) + 1);
    expect(counts.size).toBe(spec.pairs);
    for (const [id, n] of counts) { expect(n, id).toBe(2); expect(THEMES.find((t) => t.key === theme)!.icons.some((x) => x.id === id)).toBe(true); }
  });

  it('is actually shuffled (pairs are not adjacent in most boards)', () => {
    let adjacent = 0, total = 0;
    for (let s = 1; s <= 50; s++) { const b = generate('nature', 'medium', s); for (let k = 0; k + 1 < b.cards.length; k += 2) { total++; if (b.cards[k] === b.cards[k + 1]) adjacent++; } }
    expect(adjacent / total).toBeLessThan(0.3);
  });
});

describe('play', () => {
  const b = generate('everyday', 'easy', 5);
  it('isMatch needs two different positions with the same icon', () => {
    const first = b.cards[0], other = b.cards.indexOf(first, 1);
    expect(isMatch(b, 0, other)).toBe(true);
    expect(isMatch(b, 0, 0)).toBe(false);
    const diff = b.cards.findIndex((id) => id !== first);
    expect(isMatch(b, 0, diff)).toBe(false);
  });
  it('hintPair returns the first unmatched pair, then null when done', () => {
    const h = hintPair(b, [])!;
    expect(b.cards[h[0]]).toBe(b.cards[h[1]]);
    expect(h[0]).toBeLessThan(h[1]);
    const matched = [b.cards[h[0]]];
    const h2 = hintPair(b, matched)!;
    expect(matched.includes(b.cards[h2[0]])).toBe(false);
    expect(hintPair(b, [...new Set(b.cards)])).toBeNull();
  });
  it('isComplete when all pairs are matched', () => {
    expect(isComplete(b, [])).toBe(false);
    expect(isComplete(b, [...new Set(b.cards)])).toBe(true);
  });
  it('columns differ for narrow screens on easy and hard', () => {
    expect(columnsFor('easy', false)).toBe(4); expect(columnsFor('easy', true)).toBe(3);
    expect(columnsFor('hard', false)).toBe(6); expect(columnsFor('hard', true)).toBe(4);
  });
});
