// src/lib/games/mahjong.ts — rules engine for Vernal Mahjong Solitaire, the
// single-player tile-matching puzzle (not the four-player game).
//
// Pure and deterministic. A layout is a list of positions in half-tile units
// (a tile covers [x, x+2) × [y, y+2) on layer z). A game state is the layout
// key, the deal seed, the kind of tile at every position, which positions were
// already gone when the tiles were last shuffled (`base`), and the ordered
// pairs removed since (`moves`, which is also the undo history). Deals and
// shuffles are produced by reverse play, so every board is solvable; `deal`
// returns the solution it built so tests can replay it. Unit-tested in
// tests/mahjong.test.ts — the geometry tests there are authoritative.

import { makeRng } from './wordSearch';

// ── Tiles ──────────────────────────────────────────────────────────────────
export type Family = 'dots' | 'bars' | 'leaves' | 'wind' | 'dragon' | 'flower' | 'season';
export interface FamilySpec { label: string; color: string; blurb: string }
export const FAMILIES: Record<Family, FamilySpec> = {
  dots: { label: 'Dots', color: '#1d4ed8', blurb: 'Numbers 1–9 with a blue dot.' },
  bars: { label: 'Bars', color: '#15803d', blurb: 'Numbers 1–9 with green bars.' },
  leaves: { label: 'Leaves', color: '#b91c1c', blurb: 'Numbers 1–9 with a red leaf.' },
  wind: { label: 'Winds', color: '#0f2744', blurb: 'North, East, South, West.' },
  dragon: { label: 'Dragons', color: '#7c2d12', blurb: 'Sun, Pine, and Moon.' },
  flower: { label: 'Flowers', color: '#be185d', blurb: 'Rose, Tulip, Daisy, Sunflower — any two match.' },
  season: { label: 'Seasons', color: '#0e7490', blurb: 'Spring, Summer, Autumn, Winter — any two match.' },
};

export interface Kind {
  id: string;
  /** Tiles match when their groups are equal: a kind's own id, or 'flower' / 'season'. */
  group: string;
  family: Family;
  label: string;
  /** Large numeral on suit tiles; short text on honor tiles. */
  mark: string;
  /** Number of copies in the full 144-tile set. */
  copies: number;
  /** Original line-art, 48×48, stroke currentColor. */
  svg: string;
}

const ICON = {
  dot: '<circle cx="24" cy="24" r="12"/><circle cx="24" cy="24" r="4" fill="currentColor"/>',
  bar: '<rect x="8" y="12" width="32" height="7" rx="3.5"/><rect x="8" y="29" width="32" height="7" rx="3.5"/>',
  leaf: '<path d="M10 38C10 20 22 10 40 10c0 18-10 30-28 30"/><path d="M12 36l16-16"/>',
  wind: (l: string) => `<circle cx="24" cy="24" r="18"/><path d="M24 6v4M24 38v4M6 24h4M38 24h4"/><text x="24" y="31" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="20" fill="currentColor" stroke="none">${l}</text>`,
  sun: '<circle cx="24" cy="24" r="9"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.9 9.9l4.2 4.2M33.9 33.9l4.2 4.2M9.9 38.1l4.2-4.2M33.9 14.1l4.2-4.2"/>',
  pine: '<path d="M24 5l11 15h-6l9 12h-8l8 10H10l8-10h-8l9-12h-6z"/><path d="M24 42v2"/>',
  moon: '<path d="M30 6a18 18 0 1 0 12 30A15 15 0 0 1 30 6z"/>',
  rose: '<path d="M24 26a8 8 0 1 1 8-8 5 5 0 1 1-8 2 2.5 2.5 0 1 1 3 1"/><path d="M24 26v16M24 34c-4 0-7-3-8-6 4 0 7 2 8 6zM24 38c4 0 7-3 8-6-4 0-7 2-8 6z"/>',
  tulip: '<path d="M14 12v12a10 10 0 0 0 20 0V12l-5 5-5-6-5 6z"/><path d="M24 34v10M24 40c-4-1-7-3-8-6 4 0 7 2 8 6z"/>',
  daisy: '<circle cx="24" cy="24" r="5"/><path d="M24 6v10M24 32v10M6 24h10M32 24h10M11.3 11.3l7 7M29.7 29.7l7 7M11.3 36.7l7-7M29.7 18.3l7-7"/>',
  sunflower: '<circle cx="24" cy="24" r="7"/><path d="M24 4l4 9-4 4-4-4zM24 44l4-9-4-4-4 4zM4 24l9 4 4-4-4-4zM44 24l-9 4-4-4 4-4zM10 10l9 3 0 6-6 0zM38 38l-9-3 0-6 6 0zM10 38l3-9 6 0 0 6zM38 10l-3 9-6 0 0-6z"/>',
  spring: '<path d="M24 44V22"/><path d="M24 30c-8 0-12-6-12-14 8 0 12 6 12 14zM24 24c8 0 12-6 12-14-8 0-12 6-12 14z"/>',
  summer: '<circle cx="24" cy="18" r="8"/><path d="M24 4v4M10 18H6M42 18h-4M13 7l3 3M35 7l-3 3"/><path d="M4 36c5 0 5-5 10-5s5 5 10 5 5-5 10-5 5 5 10 5"/>',
  autumn: '<path d="M24 6c-10 8-16 18-10 30 6-2 10-8 10-16 0 8 4 14 10 16 6-12 0-22-10-30z"/><path d="M24 44V20"/>',
  winter: '<path d="M24 6v36M8 15l32 18M8 33l32-18M24 6l-4 4M24 6l4 4M24 42l-4-4M24 42l4-4M8 15l5-1M8 15l1 5M40 33l-5 1M40 33l-1-5M8 33l5 1M8 33l1-5M40 15l-5-1M40 15l-1 5"/>',
};
const NUM_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function suit(family: 'dots' | 'bars' | 'leaves', icon: string): Kind[] {
  return NUM_WORDS.map((w, i) => ({ id: `${family[0]}${i + 1}`, group: `${family[0]}${i + 1}`, family, label: `${w} of ${FAMILIES[family].label}`, mark: String(i + 1), copies: 4, svg: icon }));
}

export const KINDS: Kind[] = [
  ...suit('dots', ICON.dot),
  ...suit('bars', ICON.bar),
  ...suit('leaves', ICON.leaf),
  { id: 'wn', group: 'wn', family: 'wind', label: 'North Wind', mark: 'N', copies: 4, svg: ICON.wind('N') },
  { id: 'we', group: 'we', family: 'wind', label: 'East Wind', mark: 'E', copies: 4, svg: ICON.wind('E') },
  { id: 'ws', group: 'ws', family: 'wind', label: 'South Wind', mark: 'S', copies: 4, svg: ICON.wind('S') },
  { id: 'ww', group: 'ww', family: 'wind', label: 'West Wind', mark: 'W', copies: 4, svg: ICON.wind('W') },
  { id: 'dsun', group: 'dsun', family: 'dragon', label: 'Sun Dragon', mark: 'Sun', copies: 4, svg: ICON.sun },
  { id: 'dpine', group: 'dpine', family: 'dragon', label: 'Pine Dragon', mark: 'Pine', copies: 4, svg: ICON.pine },
  { id: 'dmoon', group: 'dmoon', family: 'dragon', label: 'Moon Dragon', mark: 'Moon', copies: 4, svg: ICON.moon },
  { id: 'frose', group: 'flower', family: 'flower', label: 'Rose (Flower)', mark: 'Rose', copies: 1, svg: ICON.rose },
  { id: 'ftulip', group: 'flower', family: 'flower', label: 'Tulip (Flower)', mark: 'Tulip', copies: 1, svg: ICON.tulip },
  { id: 'fdaisy', group: 'flower', family: 'flower', label: 'Daisy (Flower)', mark: 'Daisy', copies: 1, svg: ICON.daisy },
  { id: 'fsunflower', group: 'flower', family: 'flower', label: 'Sunflower (Flower)', mark: 'Sunflower', copies: 1, svg: ICON.sunflower },
  { id: 'sspring', group: 'season', family: 'season', label: 'Spring (Season)', mark: 'Spring', copies: 1, svg: ICON.spring },
  { id: 'ssummer', group: 'season', family: 'season', label: 'Summer (Season)', mark: 'Summer', copies: 1, svg: ICON.summer },
  { id: 'sautumn', group: 'season', family: 'season', label: 'Autumn (Season)', mark: 'Autumn', copies: 1, svg: ICON.autumn },
  { id: 'swinter', group: 'season', family: 'season', label: 'Winter (Season)', mark: 'Winter', copies: 1, svg: ICON.winter },
];
const KIND_BY_ID = new Map(KINDS.map((k) => [k.id, k]));
export const kindOf = (id: string): Kind => { const k = KIND_BY_ID.get(id); if (!k) throw new Error(`unknown tile kind ${id}`); return k; };
export const isKindId = (id: unknown): id is string => typeof id === 'string' && KIND_BY_ID.has(id);
/** Flowers match any Flower, Seasons any Season; everything else must be the identical kind. */
export const matchKinds = (a: string, b: string): boolean => kindOf(a).group === kindOf(b).group;
export const tileSvg = (k: Kind): string => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${k.svg}</svg>`;

/** All matching pairs in the full set: 2 pairs per regular kind, 2 Flower pairs, 2 Season pairs — 72 pairs. Pairing inside Flowers/Seasons follows the rng. */
function allPairs(rng: () => number): [string, string][] {
  const pairs: [string, string][] = [];
  for (const k of KINDS) if (k.copies === 4) pairs.push([k.id, k.id], [k.id, k.id]);
  for (const g of ['flower', 'season']) {
    const ids = shuffleArr(KINDS.filter((k) => k.group === g).map((k) => k.id), rng);
    pairs.push([ids[0], ids[1]], [ids[2], ids[3]]);
  }
  return pairs;
}
function shuffleArr<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ── Layouts ────────────────────────────────────────────────────────────────
export interface Pos { x: number; y: number; z: number }
export interface Layout { key: string; label: string; blurb: string; hint: string; positions: Pos[]; /** half-units */ width: number; height: number; layers: number }

/** Rows in whole-tile units → half-unit positions. Each row: [z, y, xStart, xEnd] inclusive. */
function rows(spec: [number, number, number, number][]): Pos[] {
  const out: Pos[] = [];
  for (const [z, y, x0, x1] of spec) for (let x = x0; x <= x1; x++) out.push({ x: x * 2, y: y * 2, z });
  return out;
}
const tile = (x: number, y: number, z: number): Pos => ({ x: x * 2, y: y * 2, z });

function layout(key: string, label: string, blurb: string, hint: string, positions: Pos[]): Layout {
  const width = Math.max(...positions.map((p) => p.x)) + 2, height = Math.max(...positions.map((p) => p.y)) + 2, layers = Math.max(...positions.map((p) => p.z)) + 1;
  return { key, label, blurb, hint, positions, width, height, layers };
}

export const LAYOUTS: Record<string, Layout> = {
  garden: layout('garden', 'Garden', 'A gentle start: two layers, nine tiles wide.', '72 tiles · 2 layers',
    [
      ...rows([[0, 0, 1, 7], [0, 1, 0, 8], [0, 2, 0, 8], [0, 3, 0, 8], [0, 4, 0, 8], [0, 5, 1, 7]]),
      ...rows([[1, 1, 2, 6], [1, 2, 2, 6], [1, 3, 2, 6], [1, 4, 2, 6]]),
      tile(1, 2.5, 1), tile(7, 2.5, 1),
    ]),
  turtle: layout('turtle', 'Turtle', 'The traditional pyramid: five layers, 144 tiles.', '144 tiles · 5 layers',
    [
      ...rows([[0, 0, 1, 12], [0, 1, 3, 10], [0, 2, 2, 11], [0, 3, 1, 12], [0, 4, 1, 12], [0, 5, 2, 11], [0, 6, 3, 10], [0, 7, 1, 12]]),
      tile(0, 3.5, 0), tile(13, 3.5, 0), tile(14, 3.5, 0),
      ...rows([[1, 1, 4, 9], [1, 2, 4, 9], [1, 3, 4, 9], [1, 4, 4, 9], [1, 5, 4, 9], [1, 6, 4, 9]]),
      ...rows([[2, 2, 5, 8], [2, 3, 5, 8], [2, 4, 5, 8], [2, 5, 5, 8]]),
      ...rows([[3, 3, 6, 7], [3, 4, 6, 7]]),
      tile(6.5, 3.5, 4),
    ]),
};
export const LAYOUT_ORDER = ['garden', 'turtle'];
export const DEFAULT_LAYOUT = 'garden';
export const layoutByKey = (key: string): Layout => LAYOUTS[key] ?? LAYOUTS[DEFAULT_LAYOUT];

// ── Geometry ───────────────────────────────────────────────────────────────
/** Two positions share floor area (regardless of layer). */
export const overlapsXY = (a: Pos, b: Pos): boolean => Math.abs(a.x - b.x) < 2 && Math.abs(a.y - b.y) < 2;
/** Something present on a higher layer rests on any part of tile i. */
export function isCovered(positions: Pos[], present: boolean[], i: number): boolean {
  const p = positions[i];
  for (let j = 0; j < positions.length; j++) if (j !== i && present[j] && positions[j].z > p.z && overlapsXY(p, positions[j])) return true;
  return false;
}
/** A present tile on the same layer touches the left (-1) or right (+1) side of tile i. */
export function sideBlocked(positions: Pos[], present: boolean[], i: number, side: -1 | 1): boolean {
  const p = positions[i];
  for (let j = 0; j < positions.length; j++) {
    if (j === i || !present[j]) continue;
    const q = positions[j];
    if (q.z === p.z && q.x === p.x + 2 * side && Math.abs(q.y - p.y) < 2) return true;
  }
  return false;
}
/** Free: present, nothing on top, and at least one long side open. */
export function isFree(positions: Pos[], present: boolean[], i: number): boolean {
  return present[i] && !isCovered(positions, present, i) && !(sideBlocked(positions, present, i, -1) && sideBlocked(positions, present, i, 1));
}
export const freeIndices = (positions: Pos[], present: boolean[]): number[] => positions.map((_, i) => i).filter((i) => isFree(positions, present, i));

/** Layout sanity used by tests and by validateState: no same-layer overlap, every raised tile rests on something below. */
export function layoutProblems(l: Layout): string[] {
  const out: string[] = [];
  const P = l.positions;
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) if (P[i].z === P[j].z && overlapsXY(P[i], P[j])) out.push(`overlap ${i}/${j}`);
  for (let i = 0; i < P.length; i++) if (P[i].z > 0 && !P.some((q, j) => j !== i && q.z === P[i].z - 1 && overlapsXY(P[i], q))) out.push(`unsupported ${i}`);
  for (const p of P) if (!Number.isInteger(p.x) || !Number.isInteger(p.y) || !Number.isInteger(p.z) || p.x < 0 || p.y < 0 || p.z < 0) out.push(`bad position ${JSON.stringify(p)}`);
  if (P.length % 2) out.push('odd tile count');
  return out;
}

// ── Dealing by reverse play ────────────────────────────────────────────────
/**
 * Assign pairs to `slots` (position indices) so that removing them in the returned
 * order is always legal: at each step two positions that are free among the
 * not-yet-assigned ones receive a matching pair. Returns null when the process
 * strands a single free position (the caller retries with the next rng draw).
 */
function reversePlay(positions: Pos[], slots: number[], pairs: [string, string][], rng: () => number): { tiles: Map<number, string>; order: [number, number][] } | null {
  const remaining = positions.map(() => false);
  for (const s of slots) remaining[s] = true;
  const tiles = new Map<number, string>(); const order: [number, number][] = [];
  let left = slots.length;
  while (left > 0) {
    const free = freeIndices(positions, remaining);
    if (free.length < 2) return null;
    const a = free[Math.floor(rng() * free.length)];
    let b = free[Math.floor(rng() * (free.length - 1))]; if (b === a) b = free[free.length - 1];
    const pair = pairs[order.length];
    tiles.set(a, pair[0]); tiles.set(b, pair[1]);
    remaining[a] = false; remaining[b] = false;
    order.push([a, b]); left -= 2;
  }
  return { tiles, order };
}

export interface Deal { tiles: string[]; solution: [number, number][] }
/** A solvable deal for a layout: every tile kind per position plus one winning removal order. Deterministic per seed. */
export function deal(layoutKey: string, seed: number): Deal {
  const l = layoutByKey(layoutKey);
  const rng = makeRng((seed ^ 0x3a11) >>> 0);
  const pairs = shuffleArr(allPairs(rng), rng).slice(0, l.positions.length / 2);
  const slots = l.positions.map((_, i) => i);
  for (let attempt = 0; attempt < 500; attempt++) {
    const r = reversePlay(l.positions, slots, shuffleArr(pairs, rng), rng);
    if (r) return { tiles: slots.map((i) => r.tiles.get(i)!), solution: r.order };
  }
  throw new Error(`could not deal ${layoutKey} with seed ${seed}`);
}

// ── Game state ─────────────────────────────────────────────────────────────
export interface MahjongState {
  layout: string;
  seed: number;
  /** Kind id at every position (removed positions keep their last kind). */
  tiles: string[];
  /** Positions already gone when the tiles were last dealt or shuffled. */
  base: boolean[];
  /** Pairs removed since then, in order — also the undo history. */
  moves: [number, number][];
}

export function newGame(layoutKey: string, seed: number): MahjongState {
  const l = layoutByKey(layoutKey);
  return { layout: l.key, seed, tiles: deal(l.key, seed).tiles, base: l.positions.map(() => false), moves: [] };
}
export function presentOf(s: MahjongState): boolean[] {
  const p = s.base.map((b) => !b);
  for (const [a, b] of s.moves) { p[a] = false; p[b] = false; }
  return p;
}
export const tilesLeft = (s: MahjongState): number => presentOf(s).filter(Boolean).length;
export const isWon = (s: MahjongState): boolean => tilesLeft(s) === 0;

export function canMatch(s: MahjongState, i: number, j: number): boolean {
  if (i === j) return false;
  const P = layoutByKey(s.layout).positions; const present = presentOf(s);
  if (i < 0 || j < 0 || i >= P.length || j >= P.length) return false;
  return isFree(P, present, i) && isFree(P, present, j) && matchKinds(s.tiles[i], s.tiles[j]);
}
export function applyMatch(s: MahjongState, i: number, j: number): MahjongState | null {
  return canMatch(s, i, j) ? { ...s, moves: [...s.moves, [i, j]] } : null;
}
export function undoMatch(s: MahjongState): MahjongState | null {
  return s.moves.length ? { ...s, moves: s.moves.slice(0, -1) } : null;
}
/** Every pair that could be removed right now (each unordered pair once). */
export function availablePairs(s: MahjongState): [number, number][] {
  const P = layoutByKey(s.layout).positions; const free = freeIndices(P, presentOf(s));
  const out: [number, number][] = [];
  for (let a = 0; a < free.length; a++) for (let b = a + 1; b < free.length; b++) if (matchKinds(s.tiles[free[a]], s.tiles[free[b]])) out.push([free[a], free[b]]);
  return out;
}
export const isStuck = (s: MahjongState): boolean => !isWon(s) && availablePairs(s).length === 0;
/** Why a tile cannot be picked up, or null when it is free. */
export function blockedReason(s: MahjongState, i: number): string | null {
  const P = layoutByKey(s.layout).positions; const present = presentOf(s);
  if (!present[i]) return 'That tile is already gone.';
  if (isCovered(P, present, i)) return 'That tile is covered by another tile.';
  if (sideBlocked(P, present, i, -1) && sideBlocked(P, present, i, 1)) return 'That tile is closed in on both sides.';
  return null;
}

/** Re-deal the remaining tiles over their own positions, keeping the composition and guaranteeing a finish (the winning order is returned for tests). Undo history restarts. */
export function shuffle(s: MahjongState, seed: number): { state: MahjongState; solution: [number, number][] } {
  const l = layoutByKey(s.layout); const present = presentOf(s);
  const slots = present.map((p, i) => (p ? i : -1)).filter((i) => i >= 0);
  const rng = makeRng((seed ^ 0x5b0f) >>> 0);
  // Pair up what is left: regular kinds pair with themselves, Flowers with Flowers, Seasons with Seasons.
  const byGroup = new Map<string, string[]>();
  for (const i of slots) { const g = kindOf(s.tiles[i]).group; byGroup.set(g, [...(byGroup.get(g) ?? []), s.tiles[i]]); }
  const pairs: [string, string][] = [];
  for (const ids of byGroup.values()) { const sh = shuffleArr(ids, rng); for (let k = 0; k + 1 < sh.length; k += 2) pairs.push([sh[k], sh[k + 1]]); }
  for (let attempt = 0; attempt < 500; attempt++) {
    const r = reversePlay(l.positions, slots, shuffleArr(pairs, rng), rng);
    if (r) { const tiles = s.tiles.slice(); for (const [i, id] of r.tiles) tiles[i] = id; return { state: { ...s, tiles, base: present.map((p) => !p), moves: [] }, solution: r.order }; }
  }
  throw new Error('could not shuffle');
}

/** Structural and logical validity: real layout, legal composition, every recorded move was legal when made. */
export function validateState(x: unknown): x is MahjongState {
  if (!x || typeof x !== 'object') return false;
  const s = x as MahjongState;
  if (typeof s.layout !== 'string' || !LAYOUTS[s.layout] || typeof s.seed !== 'number') return false;
  const P = LAYOUTS[s.layout].positions;
  if (!Array.isArray(s.tiles) || s.tiles.length !== P.length || !s.tiles.every(isKindId)) return false;
  if (!Array.isArray(s.base) || s.base.length !== P.length || !s.base.every((b) => typeof b === 'boolean')) return false;
  if (!Array.isArray(s.moves)) return false;
  // Composition over the positions still present at the base: even per group, within copies, honors unique.
  const live = s.base.map((b) => !b);
  const count = new Map<string, number>(); const seenUnique = new Set<string>();
  for (let i = 0; i < P.length; i++) {
    if (!live[i]) continue;
    const k = kindOf(s.tiles[i]);
    count.set(k.group, (count.get(k.group) ?? 0) + 1);
    if (k.copies === 1) { if (seenUnique.has(k.id)) return false; seenUnique.add(k.id); }
  }
  for (const [g, n] of count) { if (n % 2) return false; if (n > 4) return false; if (g !== 'flower' && g !== 'season' && n > kindOf(g).copies) return false; }
  // Replay the moves.
  const replay: MahjongState = { ...s, moves: [] };
  for (const m of s.moves) {
    if (!Array.isArray(m) || m.length !== 2 || !Number.isInteger(m[0]) || !Number.isInteger(m[1])) return false;
    if (!canMatch(replay, m[0], m[1])) return false;
    replay.moves = [...replay.moves, [m[0], m[1]]];
  }
  return true;
}
