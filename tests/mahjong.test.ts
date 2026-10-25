// tests/mahjong.test.ts — the Mahjong Solitaire engine's guarantees. The
// geometry tests come first and are authoritative: a board can look right
// while mis-identifying free tiles, especially where an upper tile straddles
// two lower ones.
import { describe, it, expect } from 'vitest';
import {
  KINDS, FAMILIES, LAYOUTS, LAYOUT_ORDER, kindOf, matchKinds, tileSvg, overlapsXY, isCovered, sideBlocked, isFree, freeIndices, layoutProblems,
  deal, newGame, presentOf, tilesLeft, isWon, canMatch, applyMatch, undoMatch, availablePairs, isStuck, blockedReason, shuffle, validateState,
  type Pos, type MahjongState,
} from '../src/lib/games/mahjong';

const T = (x: number, y: number, z: number): Pos => ({ x: x * 2, y: y * 2, z }); // whole-tile units → half units
const all = (n: number) => Array.from({ length: n }, () => true);

describe('geometry: half-tile coordinates', () => {
  it('tiles overlap when their 2×2 footprints intersect, including half offsets; touching edges do not overlap', () => {
    expect(overlapsXY(T(0, 0, 0), T(0, 0, 1))).toBe(true);
    expect(overlapsXY(T(0, 0, 0), T(0.5, 0.5, 1))).toBe(true);    // straddling by a half tile
    expect(overlapsXY(T(0, 0, 0), { x: 1, y: 0, z: 1 })).toBe(true); // half-unit shift
    expect(overlapsXY(T(0, 0, 0), T(1, 0, 1))).toBe(false);         // edge-to-edge
    expect(overlapsXY(T(0, 0, 0), T(0, 1, 1))).toBe(false);
    expect(overlapsXY(T(0, 0, 0), T(1, 1, 1))).toBe(false);         // corner-to-corner
  });

  it('a tile is covered by any present tile on a higher layer that rests on any part of it', () => {
    const P = [T(0, 0, 0), T(1, 0, 0), T(0.5, 0, 1)]; // the upper tile straddles both lower tiles
    expect(isCovered(P, all(3), 0)).toBe(true);
    expect(isCovered(P, all(3), 1)).toBe(true);
    expect(isCovered(P, all(3), 2)).toBe(false);
    expect(isCovered(P, [true, true, false], 0)).toBe(false);     // once the upper tile is gone
  });

  it('a lower-layer tile never covers a higher one, and layers two apart still count as covering', () => {
    const P = [T(0, 0, 0), T(0, 0, 1), T(0, 0, 2)];
    expect(isCovered(P, all(3), 1)).toBe(true);
    expect(isCovered(P, all(3), 2)).toBe(false);
    expect(isCovered(P, [true, false, true], 0)).toBe(true);      // a floating tile two layers up still rests on it
  });

  it('a side is blocked only by a same-layer tile touching that side, including a half-row offset', () => {
    const P = [T(1, 1, 0), T(0, 1, 0), T(2, 1.5, 0), T(1, 1, 1), T(3, 1, 0), T(5, 1.5, 0)];
    expect(sideBlocked(P, all(6), 0, -1)).toBe(true);   // tile at x-1 same row
    expect(sideBlocked(P, all(6), 0, 1)).toBe(true);    // tile at x+1 half a row down still touches
    expect(sideBlocked(P, [true, false, true, true, true, true], 0, -1)).toBe(false); // neighbor removed
    expect(sideBlocked(P, all(6), 2, 1)).toBe(true);    // tile 4 (x=3, row 1) touches tile 2 (x=2, row 1.5) with a half-row offset
    expect(sideBlocked(P, all(6), 4, 1)).toBe(false);   // tile 5 is a whole tile further away: not touching
    expect(sideBlocked(P, all(6), 3, -1)).toBe(false);  // the layer-1 tile has no same-layer neighbors
    const Q = [T(1, 1, 0), T(0, 2, 0)];
    expect(sideBlocked(Q, all(2), 0, -1)).toBe(false);  // corner contact only — not a side neighbor
  });

  it('free = present, uncovered, and at least one side open', () => {
    const P = [T(0, 0, 0), T(1, 0, 0), T(2, 0, 0), T(1, 0, 1)];
    expect(isFree(P, all(4), 0)).toBe(true);    // left end: left side open
    expect(isFree(P, all(4), 2)).toBe(true);    // right end
    expect(isFree(P, all(4), 1)).toBe(false);   // middle: both sides blocked AND covered
    expect(isFree(P, [true, true, true, false], 1)).toBe(false); // uncovered but still closed in
    expect(isFree(P, [false, true, true, false], 1)).toBe(true); // left neighbor gone
    expect(isFree(P, all(4), 3)).toBe(true);    // the top tile
    expect(isFree(P, [false, false, false, false], 0)).toBe(false); // absent
    expect(freeIndices(P, all(4))).toEqual([0, 2, 3]);
  });

  it('a tile straddling two lower tiles blocks both until it is removed (the classic mistake)', () => {
    const P = [T(0, 0, 0), T(1, 0, 0), T(2, 0, 0), T(0.5, 0, 1)];
    // lower row: ends are side-free, but tiles 0 and 1 are both under the straddler
    expect(isFree(P, all(4), 0)).toBe(false);
    expect(isFree(P, all(4), 1)).toBe(false);
    expect(isFree(P, all(4), 2)).toBe(true);
    expect(isFree(P, [true, true, true, false], 0)).toBe(true);
    expect(isFree(P, [true, true, true, false], 1)).toBe(false); // still closed in on both sides
  });

  it('in the Turtle the cap, the lone left tile and the far right tile are free; the inner row tiles are not', () => {
    const L = LAYOUTS.turtle; const P = L.positions; const present = all(P.length);
    const idx = (x: number, y: number, z: number) => P.findIndex((p) => p.x === x * 2 && p.y === y * 2 && p.z === z);
    expect(isFree(P, present, idx(6.5, 3.5, 4))).toBe(true);     // cap
    expect(isFree(P, present, idx(0, 3.5, 0))).toBe(true);       // left single
    expect(isFree(P, present, idx(14, 3.5, 0))).toBe(true);      // outermost right
    expect(isFree(P, present, idx(13, 3.5, 0))).toBe(false);     // inner right: closed in by row ends and the outer tile
    expect(isFree(P, present, idx(6, 3, 3))).toBe(false);        // under the cap
    expect(isFree(P, present, idx(1, 0, 0))).toBe(true);         // top row left end
    expect(isFree(P, present, idx(5, 0, 0))).toBe(false);        // top row middle
    expect(isFree(P, present, idx(1, 3, 0))).toBe(false);        // row 3 left end is blocked by the x=0 tile (which straddles rows 3 and 4)
    expect(isFree(P, present, idx(1, 4, 0))).toBe(false);
    // Layer 0: row ends free except rows 3/4 (blocked by the side tiles) → 12, plus the left single and the far-right tile → 14.
    // Layer 1: 6 rows × 2 ends, none covered by layer 2 (x 5–8) → 12. Layer 2: 4 rows × 2 ends, not under layer 3 (x 6–7) → 8.
    // Layer 3: all four under the cap → 0. Cap → 1. Total 35.
    expect(freeIndices(P, present).length).toBe(35);
  });
});

describe('layouts', () => {
  it.each(LAYOUT_ORDER)('%s has an even count, no same-layer overlaps, every raised tile supported, declared sizes', (key) => {
    const L = LAYOUTS[key];
    expect(layoutProblems(L)).toEqual([]);
    expect(L.positions.length % 2).toBe(0);
    expect(L.width).toBe(Math.max(...L.positions.map((p) => p.x)) + 2);
    expect(L.height).toBe(Math.max(...L.positions.map((p) => p.y)) + 2);
  });
  it('Garden is 72 tiles on 2 layers and at most 9 tiles wide; Turtle is 144 tiles on 5 layers, 15 wide', () => {
    expect(LAYOUTS.garden.positions.length).toBe(72); expect(LAYOUTS.garden.layers).toBe(2); expect(LAYOUTS.garden.width).toBe(18);
    expect(LAYOUTS.turtle.positions.length).toBe(144); expect(LAYOUTS.turtle.layers).toBe(5); expect(LAYOUTS.turtle.width).toBe(30); expect(LAYOUTS.turtle.height).toBe(16);
  });
  it('layoutProblems reports overlaps and unsupported tiles', () => {
    expect(layoutProblems({ ...LAYOUTS.garden, positions: [T(0, 0, 0), { x: 1, y: 0, z: 0 }] })).toContain('overlap 0/1');
    expect(layoutProblems({ ...LAYOUTS.garden, positions: [T(0, 0, 0), T(5, 5, 1)] })).toContain('unsupported 1');
  });
});

describe('tile set', () => {
  it('has 42 faces in 36 matching groups, 144 tiles, unique ids, artwork and labels; Flowers and Seasons are single copies', () => {
    expect(KINDS.length).toBe(42);
    expect(new Set(KINDS.map((k) => k.group)).size).toBe(36);
    expect(KINDS.reduce((n, k) => n + k.copies, 0)).toBe(144);
    expect(new Set(KINDS.map((k) => k.id)).size).toBe(42);
    for (const k of KINDS) { expect(k.label.length).toBeGreaterThan(2); expect(k.mark.length).toBeGreaterThan(0); expect(tileSvg(k)).toMatch(/^<svg .*<\/svg>$/); expect(FAMILIES[k.family]).toBeTruthy(); }
    expect(KINDS.filter((k) => k.copies === 1).map((k) => k.family)).toEqual(['flower', 'flower', 'flower', 'flower', 'season', 'season', 'season', 'season']);
  });
  it('matching: identical kinds match; any Flower matches any Flower; any Season any Season; nothing else', () => {
    expect(matchKinds('d5', 'd5')).toBe(true);
    expect(matchKinds('d5', 'b5')).toBe(false);
    expect(matchKinds('d5', 'd6')).toBe(false);
    expect(matchKinds('frose', 'fdaisy')).toBe(true);
    expect(matchKinds('sspring', 'swinter')).toBe(true);
    expect(matchKinds('frose', 'sspring')).toBe(false);
    expect(matchKinds('wn', 'ws')).toBe(false);
    expect(matchKinds('dsun', 'dsun')).toBe(true);
    expect(() => kindOf('nope')).toThrow();
  });
});

/** Replay a removal order on a fresh board; every step must be a legal match. */
function replay(layout: string, tiles: string[], order: [number, number][]): boolean {
  let s: MahjongState = { layout, seed: 0, tiles, base: LAYOUTS[layout].positions.map(() => false), moves: [] };
  for (const [a, b] of order) { const n = applyMatch(s, a, b); if (!n) return false; s = n; }
  return isWon(s);
}

describe('deal', () => {
  it.each(LAYOUT_ORDER)('%s: deterministic per seed, varies by seed, legal composition, and the generated solution replays to a win (seeds 1–40)', (key) => {
    expect(deal(key, 7)).toEqual(deal(key, 7));
    expect(deal(key, 7).tiles).not.toEqual(deal(key, 8).tiles);
    for (let seed = 1; seed <= 40; seed++) {
      const d = deal(key, seed);
      expect(d.tiles.length).toBe(LAYOUTS[key].positions.length);
      expect(d.solution.length).toBe(d.tiles.length / 2);
      const counts = new Map<string, number>();
      for (const id of d.tiles) counts.set(id, (counts.get(id) ?? 0) + 1);
      for (const [id, n] of counts) { const k = kindOf(id); expect(n, id).toBeLessThanOrEqual(k.copies); if (k.copies === 4) expect(n % 2, id).toBe(0); }
      const flowers = d.tiles.filter((id) => kindOf(id).group === 'flower').length, seasons = d.tiles.filter((id) => kindOf(id).group === 'season').length;
      expect(flowers % 2).toBe(0); expect(seasons % 2).toBe(0);
      expect(replay(key, d.tiles, d.solution), `seed ${seed}`).toBe(true);
      const s = newGame(key, seed);
      expect(validateState(s)).toBe(true);
      expect(availablePairs(s).length, `seed ${seed} opens with a move`).toBeGreaterThan(0);
    }
  });
  it('the full Turtle uses every one of the 144 tiles exactly as the set defines', () => {
    const d = deal('turtle', 3); const counts = new Map<string, number>();
    for (const id of d.tiles) counts.set(id, (counts.get(id) ?? 0) + 1);
    for (const k of KINDS) expect(counts.get(k.id) ?? 0, k.id).toBe(k.copies);
  });
});

describe('play', () => {
  const s0 = newGame('garden', 11);
  it('canMatch needs two different, free, matching tiles; applyMatch records the pair and removes both', () => {
    const [a, b] = availablePairs(s0)[0];
    expect(canMatch(s0, a, b)).toBe(true); expect(canMatch(s0, a, a)).toBe(false); expect(canMatch(s0, a, 999)).toBe(false);
    const s1 = applyMatch(s0, a, b)!;
    expect(s1.moves).toEqual([[a, b]]); expect(tilesLeft(s1)).toBe(70); expect(presentOf(s1)[a]).toBe(false); expect(presentOf(s1)[b]).toBe(false);
    expect(s0.moves).toEqual([]); // input untouched
    expect(applyMatch(s1, a, b)).toBeNull(); // already gone
  });
  it('refuses a covered tile, a closed-in tile, and a non-matching pair, with reasons', () => {
    const P = LAYOUTS.garden.positions; const present = presentOf(s0);
    const covered = P.findIndex((p, i) => isCovered(P, present, i));
    const closed = P.findIndex((p, i) => !isCovered(P, present, i) && sideBlocked(P, present, i, -1) && sideBlocked(P, present, i, 1));
    expect(blockedReason(s0, covered)).toMatch(/covered/);
    expect(blockedReason(s0, closed)).toMatch(/both sides/);
    const free = freeIndices(P, present);
    const other = free.find((i) => !matchKinds(s0.tiles[free[0]], s0.tiles[i]))!;
    expect(canMatch(s0, free[0], other)).toBe(false);
    expect(blockedReason(s0, free[0])).toBeNull();
    const [a, b] = availablePairs(s0)[0]; const s1 = applyMatch(s0, a, b)!;
    expect(blockedReason(s1, a)).toMatch(/already gone/);
  });
  it('undo restores the last pair, repeatedly, and is null at the start', () => {
    let s = s0; const pairs: [number, number][] = [];
    for (let k = 0; k < 5; k++) { const p = availablePairs(s)[0]; pairs.push(p); s = applyMatch(s, p[0], p[1])!; }
    expect(tilesLeft(s)).toBe(62);
    for (let k = 0; k < 5; k++) s = undoMatch(s)!;
    expect(s).toEqual(s0); expect(undoMatch(s)).toBeNull();
  });
  it('a game is won by playing its solution, never stuck along the way', () => {
    const d = deal('turtle', 5);
    let s: MahjongState = { layout: 'turtle', seed: 5, tiles: d.tiles, base: all(144).map(() => false), moves: [] };
    for (const [a, b] of d.solution) { expect(isStuck(s)).toBe(false); s = applyMatch(s, a, b)!; expect(validateState(s)).toBe(true); }
    expect(isWon(s)).toBe(true); expect(isStuck(s)).toBe(false); expect(availablePairs(s)).toEqual([]);
  });
});

describe('stuck and shuffle', () => {
  /** Hand-built stuck board: a row of three on layer 0 with no matching free pair. */
  const stuckState = (): MahjongState => ({ layout: 'garden', seed: 1, tiles: LAYOUTS.garden.positions.map(() => 'd1'), base: LAYOUTS.garden.positions.map(() => true), moves: [] });
  /** Five in a row on layer 0 (x = 1…5, row 1) with one layer-1 tile directly above the middle one. */
  const fixture = (kinds: string[], top: string): { s: MahjongState; row: number[]; over: number } => {
    const P = LAYOUTS.garden.positions;
    const row = [1, 2, 3, 4, 5].map((x) => P.findIndex((p) => p.z === 0 && p.y === 2 && p.x === x * 2));
    const over = P.findIndex((p) => p.z === 1 && p.y === 2 && p.x === 3 * 2);
    const s = stuckState(); for (const i of [...row, over]) s.base[i] = false;
    row.forEach((i, k) => { s.tiles[i] = kinds[k]; }); s.tiles[over] = top;
    return { s, row, over };
  };
  it('detects a board with tiles left but no matching free pair', () => {
    const P = LAYOUTS.garden.positions;
    // ends d1 and d4 are free, the three middle tiles are closed in (and the centre one covered), the top tile d3 is free: no two free tiles match
    const { s: w, row, over } = fixture(['d1', 'd4', 'd3', 'd1', 'd4'], 'd3');
    expect(row.every((i) => i >= 0) && over >= 0).toBe(true);
    expect(overlapsXY(P[over], P[row[2]])).toBe(true);
    expect(validateState(w)).toBe(true);
    expect(freeIndices(P, presentOf(w)).sort((a, b) => a - b)).toEqual([row[0], row[4], over].sort((a, b) => a - b));
    expect(availablePairs(w)).toEqual([]);
    expect(isStuck(w)).toBe(true);
    // same board with a d1 on top: it pairs with the free d1 at the left end → not stuck
    const { s: v } = fixture(['d1', 'd4', 'd3', 'd3', 'd4'], 'd1');
    expect(availablePairs(v)).toEqual([[row[0], over].sort((a, b) => a - b) as [number, number]]);
    expect(isStuck(v)).toBe(false);
    // an empty board is won, not stuck
    expect(isStuck(stuckState())).toBe(false); expect(isWon(stuckState())).toBe(true);
  });
  it('shuffle keeps positions and composition, clears undo history, records the base, and yields a solvable board', () => {
    const s = newGame('turtle', 21);
    let t = s; for (let k = 0; k < 10; k++) { const p = availablePairs(t)[0]; t = applyMatch(t, p[0], p[1])!; }
    const before = presentOf(t); const kinds = t.tiles.filter((_, i) => before[i]).sort();
    const { state: sh, solution } = shuffle(t, 99);
    expect(presentOf(sh)).toEqual(before);
    expect(sh.base).toEqual(before.map((p) => !p));
    expect(sh.moves).toEqual([]);
    expect(sh.tiles.filter((_, i) => before[i]).sort()).toEqual(kinds);
    expect(validateState(sh)).toBe(true);
    expect(shuffle(t, 99).state).toEqual(sh); expect(shuffle(t, 100).state.tiles).not.toEqual(sh.tiles);
    // the generated order wins from the shuffled board
    let u = sh; for (const [a, b] of solution) { const n = applyMatch(u, a, b); expect(n, `step ${a},${b}`).not.toBeNull(); u = n!; }
    expect(isWon(u)).toBe(true); expect(solution.length * 2).toBe(before.filter(Boolean).length);
  });
  it('a shuffled stuck board always has a move and stays finishable', () => {
    const { s: w } = fixture(['d1', 'd4', 'd3', 'd1', 'd4'], 'd3');
    expect(isStuck(w)).toBe(true);
    for (let seed = 1; seed <= 20; seed++) { const { state: sh, solution } = shuffle(w, seed); expect(isStuck(sh)).toBe(false); expect(solvable(sh)).toBe(true); let u = sh; for (const [a, b] of solution) u = applyMatch(u, a, b)!; expect(isWon(u)).toBe(true); }
  });
});

/** Small exhaustive solver for tiny test boards: is there any winning sequence? */
function solvable(s: MahjongState): boolean {
  const seen = new Set<string>();
  const rec = (st: MahjongState): boolean => {
    if (isWon(st)) return true;
    const key = presentOf(st).map((p) => (p ? 1 : 0)).join('');
    if (seen.has(key)) return false; seen.add(key);
    for (const [a, b] of availablePairs(st)) if (rec(applyMatch(st, a, b)!)) return true;
    return false;
  };
  return rec(s);
}

describe('validateState', () => {
  it('accepts fresh and played games; rejects wrong layout, lengths, kinds, odd composition, duplicate honors, and illegal moves', () => {
    const s = newGame('garden', 2); expect(validateState(s)).toBe(true);
    const p = availablePairs(s)[0]; expect(validateState(applyMatch(s, p[0], p[1])!)).toBe(true);
    expect(validateState(null)).toBe(false); expect(validateState({})).toBe(false);
    expect(validateState({ ...s, layout: 'castle' })).toBe(false);
    expect(validateState({ ...s, tiles: s.tiles.slice(1) })).toBe(false);
    expect(validateState({ ...s, tiles: s.tiles.map((t, i) => (i === 0 ? 'zz' : t)) })).toBe(false);
    const odd = { ...s, tiles: s.tiles.slice() }; const i1 = odd.tiles.indexOf('d1'); if (i1 >= 0) odd.tiles[i1] = odd.tiles.find((t) => t !== 'd1' && kindOf(t).copies === 4)!; else odd.tiles[0] = 'd1';
    expect(validateState(odd)).toBe(false);
    const dup = { ...s, tiles: s.tiles.slice() }; const fl = dup.tiles.map((t, i) => (kindOf(t).group === 'flower' ? i : -1)).filter((i) => i >= 0);
    if (fl.length >= 2) { dup.tiles[fl[1]] = dup.tiles[fl[0]]; expect(validateState(dup)).toBe(false); }
    const covered = LAYOUTS.garden.positions.findIndex((_, i) => isCovered(LAYOUTS.garden.positions, presentOf(s), i));
    const partner = s.tiles.findIndex((t, i) => i !== covered && t === s.tiles[covered]);
    expect(validateState({ ...s, moves: [[covered, partner]] })).toBe(false);  // illegal move in the history
    expect(validateState({ ...s, moves: [[p[0], p[1]], [p[0], p[1]]] })).toBe(false); // repeated move
  });
});
