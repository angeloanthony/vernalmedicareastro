// src/lib/games/solitaire.ts — rules engine for Vernal Solitaire (Klondike).
//
// Pure and deterministic: deal(seed, drawMode) always lays out the same game,
// every rule is a function from a state to a new state (or null when the move
// is illegal), and nothing here touches the DOM, storage or analytics. The
// interface (solitaireUi.ts) keeps a history of states for Undo, so a state is
// plain JSON: cards are numbers 0–51 (suit = c / 13, rank = c % 13 + 1).
// Unit-tested in tests/solitaire.test.ts.

import { makeRng } from './wordSearch';

export type DrawMode = 1 | 3;
export type Suit = 0 | 1 | 2 | 3;

export interface SuitSpec { key: string; name: string; glyph: string; red: boolean }
/** Spades, Hearts, Diamonds, Clubs — index is the suit number. */
export const SUITS: SuitSpec[] = [
  { key: 'S', name: 'Spades', glyph: '♠', red: false },
  { key: 'H', name: 'Hearts', glyph: '♥', red: true },
  { key: 'D', name: 'Diamonds', glyph: '♦', red: true },
  { key: 'C', name: 'Clubs', glyph: '♣', red: false },
];
export const RANK_SHORT = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const RANK_NAME = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King'];

export const suitOf = (c: number): Suit => Math.floor(c / 13) as Suit;
export const rankOf = (c: number): number => (c % 13) + 1; // 1 = Ace … 13 = King
export const isRed = (c: number): boolean => SUITS[suitOf(c)].red;
export const cardName = (c: number): string => `${RANK_NAME[rankOf(c) - 1]} of ${SUITS[suitOf(c)].name}`;
export const cardShort = (c: number): string => `${RANK_SHORT[rankOf(c) - 1]}${SUITS[suitOf(c)].glyph}`;
/** Card number from suit key + rank, for tests and fixtures: card('H', 7). */
export const card = (suit: string, rank: number): number => SUITS.findIndex((s) => s.key === suit) * 13 + (rank - 1);

export interface TableauCard { c: number; up: boolean }

export interface GameState {
  drawMode: DrawMode;
  /** Face-down draw pile; the last element is the top (drawn first). */
  stock: number[];
  /** Face-up discard pile; the last element is the top (the playable card). */
  waste: number[];
  /** Four piles built up from Ace; the last element is the top. Any ace may start any empty pile. */
  foundations: number[][];
  /** Seven columns; index 0 is the bottom card. */
  tableau: TableauCard[][];
}

export type Loc =
  | { kind: 'stock' }
  | { kind: 'waste' }
  | { kind: 'foundation'; pile: number }
  | { kind: 'tableau'; pile: number; index: number };

export interface CardMove { from: Loc; to: Loc }
export type Hint = { type: 'move'; from: Loc; to: Loc; cards: number[]; reason: string } | { type: 'draw'; reason: string } | null;

export const TABLEAU_PILES = 7;

function shuffle(deck: number[], rng: () => number): number[] {
  const a = deck.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Deal a new Klondike game: 1–7 cards per column, top card up, 24 in stock. */
export function deal(seed: number, drawMode: DrawMode = 1): GameState {
  const rng = makeRng((seed ^ 0x5011) >>> 0);
  const deck = shuffle(Array.from({ length: 52 }, (_, i) => i), rng);
  const tableau: TableauCard[][] = [];
  let k = 0;
  for (let p = 0; p < TABLEAU_PILES; p++) {
    const pile: TableauCard[] = [];
    for (let j = 0; j <= p; j++) pile.push({ c: deck[k++], up: j === p });
    tableau.push(pile);
  }
  return { drawMode, stock: deck.slice(k), waste: [], foundations: [[], [], [], []], tableau };
}

const clone = (s: GameState): GameState => ({
  drawMode: s.drawMode,
  stock: s.stock.slice(),
  waste: s.waste.slice(),
  foundations: s.foundations.map((f) => f.slice()),
  tableau: s.tableau.map((p) => p.map((x) => ({ ...x }))),
});

/** Turn over the next card(s) from the stock, or turn the waste back over when the stock is empty. */
export function draw(s: GameState): GameState | null {
  if (s.stock.length === 0 && s.waste.length === 0) return null;
  const n = clone(s);
  if (n.stock.length === 0) { n.stock = n.waste.reverse(); n.waste = []; return n; }
  for (let i = 0; i < n.drawMode && n.stock.length; i++) n.waste.push(n.stock.pop()!);
  return n;
}

/** The cards that would move if the player picked up `from` (top card, or a face-up run). Empty when nothing can be picked up there. */
export function cardsAt(s: GameState, from: Loc): number[] {
  if (from.kind === 'waste') return s.waste.length ? [s.waste[s.waste.length - 1]] : [];
  if (from.kind === 'foundation') { const f = s.foundations[from.pile]; return f && f.length ? [f[f.length - 1]] : []; }
  if (from.kind === 'tableau') {
    const p = s.tableau[from.pile];
    if (!p || from.index < 0 || from.index >= p.length) return [];
    const run = p.slice(from.index);
    return run.every((x) => x.up) ? run.map((x) => x.c) : [];
  }
  return [];
}

/** Can this run of cards (bottom-most first) be placed at `to`? */
export function canDrop(s: GameState, cards: number[], to: Loc): boolean {
  if (!cards.length) return false;
  if (to.kind === 'foundation') {
    if (cards.length !== 1) return false;
    const f = s.foundations[to.pile];
    if (!f) return false;
    const c = cards[0];
    if (f.length === 0) return rankOf(c) === 1;
    const top = f[f.length - 1];
    return suitOf(top) === suitOf(c) && rankOf(c) === rankOf(top) + 1;
  }
  if (to.kind === 'tableau') {
    const p = s.tableau[to.pile];
    if (!p) return false;
    const c = cards[0];
    if (p.length === 0) return rankOf(c) === 13;
    const top = p[p.length - 1];
    return top.up && isRed(top.c) !== isRed(c) && rankOf(c) === rankOf(top.c) - 1;
  }
  return false;
}

const sameLoc = (a: Loc, b: Loc): boolean => a.kind === b.kind && (a.kind !== 'foundation' || a.pile === (b as { pile: number }).pile) && (a.kind !== 'tableau' || a.pile === (b as { pile: number }).pile);

/** Apply a card move. Returns the new state, or null when the move is illegal. Flips a newly exposed tableau card. */
export function applyMove(s: GameState, from: Loc, to: Loc): GameState | null {
  if (from.kind === 'stock' || to.kind === 'stock' || to.kind === 'waste' || sameLoc(from, to)) return null;
  const cards = cardsAt(s, from);
  if (!cards.length || !canDrop(s, cards, to)) return null;
  const n = clone(s);
  if (from.kind === 'waste') n.waste.pop();
  else if (from.kind === 'foundation') n.foundations[from.pile].pop();
  else {
    const p = n.tableau[from.pile];
    p.splice(from.index);
    if (p.length && !p[p.length - 1].up) p[p.length - 1].up = true;
  }
  if (to.kind === 'foundation') n.foundations[to.pile].push(cards[0]);
  else n.tableau[to.pile].push(...cards.map((c) => ({ c, up: true })));
  return n;
}

/** Every place the cards at `from` may legally go, foundations first. */
export function legalTargets(s: GameState, from: Loc): Loc[] {
  const cards = cardsAt(s, from);
  if (!cards.length) return [];
  const out: Loc[] = [];
  if (cards.length === 1) for (let i = 0; i < 4; i++) { const to: Loc = { kind: 'foundation', pile: i }; if (!sameLoc(from, to) && canDrop(s, cards, to)) out.push(to); }
  for (let i = 0; i < TABLEAU_PILES; i++) { const to: Loc = { kind: 'tableau', pile: i, index: s.tableau[i].length }; if (!sameLoc(from, to) && canDrop(s, cards, to)) out.push(to); }
  return out;
}

/** Foundation pile for a single card: the pile already holding its suit, else the first empty pile; null when the card cannot go up. */
export function foundationFor(s: GameState, c: number): number | null {
  for (let i = 0; i < 4; i++) if (canDrop(s, [c], { kind: 'foundation', pile: i })) return i;
  return null;
}

export const isWon = (s: GameState): boolean => s.foundations.every((f) => f.length === 13);

/** Nothing hidden remains: stock and waste are empty and every tableau card is face up — the rest is automatic. */
export const canAutoFinish = (s: GameState): boolean =>
  !isWon(s) && s.stock.length === 0 && s.waste.length === 0 && s.tableau.every((p) => p.every((x) => x.up));

/** The next foundation move while finishing automatically (lowest rank first), or null. */
export function autoFinishStep(s: GameState): CardMove | null {
  if (!canAutoFinish(s)) return null;
  let best: CardMove | null = null; let bestRank = 99;
  for (let i = 0; i < TABLEAU_PILES; i++) {
    const p = s.tableau[i];
    if (!p.length) continue;
    const c = p[p.length - 1].c; const f = foundationFor(s, c);
    if (f !== null && rankOf(c) < bestRank) { bestRank = rankOf(c); best = { from: { kind: 'tableau', pile: i, index: p.length - 1 }, to: { kind: 'foundation', pile: f } }; }
  }
  return best;
}

/** Positions of every pickable top card: waste, then each tableau run start … top. */
function sources(s: GameState): Loc[] {
  const out: Loc[] = [];
  if (s.waste.length) out.push({ kind: 'waste' });
  s.tableau.forEach((p, pile) => { for (let index = 0; index < p.length; index++) if (p[index].up) out.push({ kind: 'tableau', pile, index }); });
  return out;
}

/**
 * A useful move, in order of preference:
 *   1. any top card that can go to a foundation;
 *   2. a whole face-up run onto another column when that uncovers a face-down card
 *      (or empties a column that is not already a bare King run);
 *   3. the waste card onto a column;
 *   4. part of a run when the card it uncovers can then go straight to a foundation;
 *   5. draw from the stock (or turn the waste over);
 *   6. null — no moves are left and nothing remains to draw.
 * Never suggests moving a King-based run between two empty-based columns (a pointless loop).
 */
export function findHint(s: GameState): Hint {
  const srcs = sources(s);
  for (const from of srcs) {
    const cards = cardsAt(s, from);
    if (cards.length !== 1) continue;
    const f = foundationFor(s, cards[0]);
    if (f !== null) return { type: 'move', from, to: { kind: 'foundation', pile: f }, cards, reason: `${cardName(cards[0])} can go up to a foundation.` };
  }
  for (const from of srcs) {
    if (from.kind !== 'tableau') continue;
    const p = s.tableau[from.pile];
    const isRunStart = from.index === 0 || !p[from.index - 1].up;
    if (!isRunStart) continue;
    const cards = cardsAt(s, from);
    const uncovers = from.index > 0;                   // a face-down card lies beneath
    const bareKing = from.index === 0 && rankOf(cards[0]) === 13;
    if (!uncovers && bareKing) continue;
    for (const to of legalTargets(s, from)) if (to.kind === 'tableau') return { type: 'move', from, to, cards, reason: uncovers ? `Move ${cardName(cards[0])} to uncover the card beneath it.` : `Move ${cardName(cards[0])} to free up a column.` };
  }
  if (s.waste.length) {
    const from: Loc = { kind: 'waste' };
    const cards = cardsAt(s, from);
    for (const to of legalTargets(s, from)) if (to.kind === 'tableau') return { type: 'move', from, to, cards, reason: `${cardName(cards[0])} from the waste can go onto a column.` };
  }
  for (const from of srcs) {
    if (from.kind !== 'tableau' || from.index === 0) continue;
    const p = s.tableau[from.pile];
    if (!p[from.index - 1].up) continue;              // whole-run moves were handled above
    const under = p[from.index - 1].c;
    const cards = cardsAt(s, from);
    for (const to of legalTargets(s, from)) {
      if (to.kind !== 'tableau') continue;
      const after = applyMove(s, from, to);
      if (after && foundationFor(after, under) !== null) return { type: 'move', from, to, cards, reason: `Move ${cardName(cards[0])} so ${cardName(under)} can go up.` };
    }
  }
  if (s.stock.length) return { type: 'draw', reason: 'Turn over the next card from the stock.' };
  if (s.waste.length) return { type: 'draw', reason: 'Turn the waste pile back over and go through it again.' };
  return null;
}

/** True when the player can still do something: any legal move, or a draw. */
export const hasAnyAction = (s: GameState): boolean => s.stock.length > 0 || s.waste.length > 0 || sources(s).some((from) => legalTargets(s, from).length > 0);

/** Every card appears exactly once, foundations run A→K by suit, face-up tableau runs alternate color downward. */
export function validateState(s: unknown): s is GameState {
  if (!s || typeof s !== 'object') return false;
  const g = s as GameState;
  if ((g.drawMode !== 1 && g.drawMode !== 3) || !Array.isArray(g.stock) || !Array.isArray(g.waste) || !Array.isArray(g.foundations) || !Array.isArray(g.tableau)) return false;
  if (g.foundations.length !== 4 || g.tableau.length !== TABLEAU_PILES) return false;
  const seen = new Set<number>();
  const ok = (c: unknown): boolean => typeof c === 'number' && Number.isInteger(c) && c >= 0 && c < 52 && !seen.has(c) && !!seen.add(c);
  for (const c of g.stock) if (!ok(c)) return false;
  for (const c of g.waste) if (!ok(c)) return false;
  for (const f of g.foundations) {
    if (!Array.isArray(f)) return false;
    for (let i = 0; i < f.length; i++) { if (!ok(f[i])) return false; if (rankOf(f[i]) !== i + 1 || suitOf(f[i]) !== suitOf(f[0])) return false; }
  }
  for (const p of g.tableau) {
    if (!Array.isArray(p)) return false;
    for (let i = 0; i < p.length; i++) {
      const x = p[i];
      if (!x || typeof x !== 'object' || typeof x.up !== 'boolean' || !ok(x.c)) return false;
      if (i > 0 && p[i - 1].up && !x.up) return false;                      // no face-down card above a face-up one
      if (i > 0 && p[i - 1].up && x.up && !(isRed(p[i - 1].c) !== isRed(x.c) && rankOf(x.c) === rankOf(p[i - 1].c) - 1)) return false;
    }
  }
  return seen.size === 52;
}

/** Human-readable pile name for announcements. */
export function locName(s: GameState, loc: Loc): string {
  if (loc.kind === 'stock') return 'the stock';
  if (loc.kind === 'waste') return 'the waste pile';
  if (loc.kind === 'foundation') { const f = s.foundations[loc.pile]; return f.length ? `the ${SUITS[suitOf(f[0])].name} foundation` : `empty foundation ${loc.pile + 1}`; }
  const p = s.tableau[loc.pile];
  return p.length ? `column ${loc.pile + 1} on ${cardName(p[p.length - 1].c)}` : `empty column ${loc.pile + 1}`;
}
