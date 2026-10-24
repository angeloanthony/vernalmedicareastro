// tests/solitaire.test.ts — the Klondike rules engine's guarantees.
import { describe, it, expect } from 'vitest';
import {
  deal, draw, cardsAt, canDrop, applyMove, legalTargets, foundationFor, isWon, canAutoFinish, autoFinishStep,
  findHint, hasAnyAction, validateState, card, cardName, cardShort, suitOf, rankOf, isRed, locName, SUITS, TABLEAU_PILES,
  type GameState, type Loc,
} from '../src/lib/games/solitaire';

const S = (suit: string, rank: number) => card(suit, rank);
const allCards = (s: GameState) => [...s.stock, ...s.waste, ...s.foundations.flat(), ...s.tableau.flat().map((x) => x.c)];
/** A hand-built state. Every card not placed is put in the stock face down. */
function build(parts: { waste?: number[]; foundations?: number[][]; tableau?: { c: number; up: boolean }[][]; drawMode?: 1 | 3; stock?: number[] }): GameState {
  const used = new Set([...(parts.waste ?? []), ...(parts.foundations ?? []).flat(), ...(parts.tableau ?? []).flat().map((x) => x.c), ...(parts.stock ?? [])]);
  const rest = Array.from({ length: 52 }, (_, i) => i).filter((c) => !used.has(c));
  const tableau = Array.from({ length: TABLEAU_PILES }, (_, i) => parts.tableau?.[i] ?? []);
  const foundations = Array.from({ length: 4 }, (_, i) => parts.foundations?.[i] ?? []);
  return { drawMode: parts.drawMode ?? 1, stock: parts.stock ?? rest, waste: parts.waste ?? [], foundations, tableau };
}

describe('cards', () => {
  it('numbers 0–51 map to suit and rank', () => {
    expect(suitOf(0)).toBe(0); expect(rankOf(0)).toBe(1); expect(rankOf(12)).toBe(13); expect(suitOf(13)).toBe(1); expect(suitOf(51)).toBe(3);
    expect(S('H', 7)).toBe(19); expect(cardName(19)).toBe('Seven of Hearts'); expect(cardShort(19)).toBe('7♥'); expect(cardShort(S('S', 1))).toBe('A♠'); expect(cardShort(S('C', 10))).toBe('10♣');
    expect(isRed(S('H', 2))).toBe(true); expect(isRed(S('D', 2))).toBe(true); expect(isRed(S('S', 2))).toBe(false); expect(isRed(S('C', 2))).toBe(false);
    expect(SUITS.map((s) => s.glyph).join('')).toBe('♠♥♦♣');
  });
});

describe('deal', () => {
  it('lays out 28 tableau cards (1…7, only the top face up) and 24 in the stock, every card once', () => {
    for (const seed of [1, 7, 42, 2026, 4294967295]) {
      const s = deal(seed, 1);
      expect(s.tableau.map((p) => p.length)).toEqual([1, 2, 3, 4, 5, 6, 7]);
      for (const p of s.tableau) p.forEach((x, i) => expect(x.up).toBe(i === p.length - 1));
      expect(s.stock.length).toBe(24); expect(s.waste).toEqual([]); expect(s.foundations).toEqual([[], [], [], []]);
      expect(new Set(allCards(s)).size).toBe(52);
      expect(validateState(s)).toBe(true);
    }
  });
  it('is deterministic per seed, differs between seeds, and records the draw mode', () => {
    expect(deal(5, 3)).toEqual(deal(5, 3));
    expect(deal(5, 1).stock).not.toEqual(deal(6, 1).stock);
    expect(deal(5, 3).drawMode).toBe(3);
    expect(deal(5, 1).stock).toEqual(deal(5, 3).stock); // same deal, different draw rule
  });
});

describe('stock and waste', () => {
  it('draw-one turns one card; draw-three turns three, then fewer at the end', () => {
    let s = deal(11, 1); const top = s.stock[s.stock.length - 1];
    s = draw(s)!; expect(s.waste).toEqual([top]); expect(s.stock.length).toBe(23);
    let t = deal(11, 3);
    t = draw(t)!; expect(t.waste.length).toBe(3); expect(t.stock.length).toBe(21);
    for (let i = 0; i < 7; i++) t = draw(t)!;
    expect(t.stock.length).toBe(0); expect(t.waste.length).toBe(24);
  });
  it('an empty stock turns the waste back over in the original order; nothing to draw → null', () => {
    let s = deal(3, 1); const order = s.stock.slice().reverse(); // drawing order
    for (let i = 0; i < 24; i++) s = draw(s)!;
    expect(s.stock).toEqual([]); expect(s.waste).toEqual(order);
    s = draw(s)!; // recycle
    expect(s.waste).toEqual([]); expect(s.stock.slice().reverse()).toEqual(order);
    const empty = build({ stock: [] , tableau: [Array.from({ length: 52 }, (_, c) => ({ c, up: true }))] });
    expect(draw({ ...empty, stock: [], waste: [] })).toBeNull();
  });
});

describe('legal moves', () => {
  const s = build({
    waste: [S('D', 5)],
    foundations: [[S('S', 1), S('S', 2)], [], [], []],
    tableau: [
      [{ c: S('H', 13), up: true }],
      [{ c: S('C', 9), up: false }, { c: S('C', 6), up: true }],
      [],
      [{ c: S('D', 8), up: true }, { c: S('S', 7), up: true }, { c: S('H', 6), up: true }],
      [{ c: S('S', 3), up: true }],
      [{ c: S('H', 1), up: true }],
      [{ c: S('C', 13), up: true }, { c: S('D', 12), up: true }],
    ],
  });
  it('foundations: an ace starts any empty pile; then the same suit in order; one card at a time', () => {
    expect(canDrop(s, [S('H', 1)], { kind: 'foundation', pile: 1 })).toBe(true);
    expect(canDrop(s, [S('H', 1)], { kind: 'foundation', pile: 3 })).toBe(true);
    expect(canDrop(s, [S('H', 2)], { kind: 'foundation', pile: 1 })).toBe(false);
    expect(canDrop(s, [S('S', 3)], { kind: 'foundation', pile: 0 })).toBe(true);
    expect(canDrop(s, [S('S', 4)], { kind: 'foundation', pile: 0 })).toBe(false);
    expect(canDrop(s, [S('C', 3)], { kind: 'foundation', pile: 0 })).toBe(false);
    expect(canDrop(s, [S('S', 7), S('H', 6)], { kind: 'foundation', pile: 0 })).toBe(false);
    expect(foundationFor(s, S('S', 3))).toBe(0); expect(foundationFor(s, S('H', 1))).toBe(1); expect(foundationFor(s, S('D', 5))).toBeNull();
  });
  it('tableau: only a King on an empty column; otherwise opposite color, one rank lower', () => {
    expect(canDrop(s, [S('H', 13)], { kind: 'tableau', pile: 2, index: 0 })).toBe(true);
    expect(canDrop(s, [S('D', 5)], { kind: 'tableau', pile: 2, index: 0 })).toBe(false);
    expect(canDrop(s, [S('D', 5)], { kind: 'tableau', pile: 1, index: 2 })).toBe(true);   // red 5 on black 6
    expect(canDrop(s, [S('D', 5)], { kind: 'tableau', pile: 3, index: 3 })).toBe(false);  // red 5 on red 6
    expect(canDrop(s, [S('C', 5)], { kind: 'tableau', pile: 3, index: 3 })).toBe(true);
    expect(canDrop(s, [S('C', 4)], { kind: 'tableau', pile: 1, index: 2 })).toBe(false);  // skips a rank
  });
  it('a red Queen may not go on a red King', () => {
    expect(canDrop(s, [S('D', 12)], { kind: 'tableau', pile: 0, index: 1 })).toBe(false);
    expect(canDrop(s, [S('D', 12)], { kind: 'tableau', pile: 6, index: 2 })).toBe(false); // already there, same color anyway
  });
  it('cardsAt picks up the top card, or a face-up run, never a face-down card or an empty spot', () => {
    expect(cardsAt(s, { kind: 'waste' })).toEqual([S('D', 5)]);
    expect(cardsAt(s, { kind: 'foundation', pile: 0 })).toEqual([S('S', 2)]);
    expect(cardsAt(s, { kind: 'foundation', pile: 2 })).toEqual([]);
    expect(cardsAt(s, { kind: 'tableau', pile: 3, index: 1 })).toEqual([S('S', 7), S('H', 6)]);
    expect(cardsAt(s, { kind: 'tableau', pile: 1, index: 0 })).toEqual([]);
    expect(cardsAt(s, { kind: 'tableau', pile: 2, index: 0 })).toEqual([]);
    expect(cardsAt(s, { kind: 'stock' })).toEqual([]);
  });
  it('legalTargets lists foundations first, then columns, never the source pile', () => {
    expect(legalTargets(s, { kind: 'tableau', pile: 5, index: 0 })).toEqual([{ kind: 'foundation', pile: 1 }, { kind: 'foundation', pile: 2 }, { kind: 'foundation', pile: 3 }]);
    expect(legalTargets(s, { kind: 'waste' })).toEqual([{ kind: 'tableau', pile: 1, index: 2 }]);
    expect(legalTargets(s, { kind: 'tableau', pile: 0, index: 0 })).toEqual([{ kind: 'tableau', pile: 2, index: 0 }]);
    expect(legalTargets(s, { kind: 'tableau', pile: 3, index: 1 })).toEqual([]);
  });
});

describe('applyMove', () => {
  const base = build({
    waste: [S('C', 2), S('D', 5)],
    foundations: [[S('S', 1), S('S', 2)], [], [], []],
    tableau: [
      [{ c: S('H', 13), up: true }],
      [{ c: S('C', 9), up: false }, { c: S('C', 6), up: true }],
      [],
      [{ c: S('D', 8), up: true }, { c: S('S', 7), up: true }, { c: S('H', 6), up: true }],
      [{ c: S('S', 3), up: true }],
      [{ c: S('H', 10), up: false }, { c: S('H', 1), up: true }],
      [{ c: S('C', 13), up: true }, { c: S('D', 12), up: true }],
    ],
  });
  it('moves the waste card to a column and leaves the card beneath it on the waste', () => {
    const n = applyMove(base, { kind: 'waste' }, { kind: 'tableau', pile: 1, index: 2 })!;
    expect(n.waste).toEqual([S('C', 2)]);
    expect(n.tableau[1].map((x) => x.c)).toEqual([S('C', 9), S('C', 6), S('D', 5)]);
    expect(base.waste.length).toBe(2); // input untouched
    expect(validateState(n)).toBe(true);
  });
  it('moves a run as a unit and flips the card it uncovers', () => {
    const withTarget = applyMove(base, { kind: 'tableau', pile: 0, index: 0 }, { kind: 'tableau', pile: 2, index: 0 })!; // K♥ to empty column 3
    expect(withTarget.tableau[0]).toEqual([]);
    const n = applyMove(base, { kind: 'tableau', pile: 5, index: 1 }, { kind: 'foundation', pile: 1 })!;
    expect(n.foundations[1]).toEqual([S('H', 1)]);
    expect(n.tableau[5]).toEqual([{ c: S('H', 10), up: true }]);
  });
  it('moves a multi-card run onto a matching card', () => {
    const t = build({ tableau: [[{ c: S('C', 9), up: true }], [{ c: S('D', 8), up: true }, { c: S('S', 7), up: true }, { c: S('H', 6), up: true }]] });
    const n = applyMove(t, { kind: 'tableau', pile: 1, index: 0 }, { kind: 'tableau', pile: 0, index: 1 })!;
    expect(n.tableau[0].map((x) => x.c)).toEqual([S('C', 9), S('D', 8), S('S', 7), S('H', 6)]);
    expect(n.tableau[1]).toEqual([]);
  });
  it('allows a foundation card back onto a column', () => {
    const t = build({ foundations: [[S('S', 1), S('S', 2), S('S', 3)]], tableau: [[{ c: S('H', 4), up: true }]] });
    const n = applyMove(t, { kind: 'foundation', pile: 0 }, { kind: 'tableau', pile: 0, index: 1 })!;
    expect(n.foundations[0]).toEqual([S('S', 1), S('S', 2)]); expect(n.tableau[0].map((x) => x.c)).toEqual([S('H', 4), S('S', 3)]);
  });
  it('rejects illegal moves with null and never mutates the input', () => {
    const snapshot = JSON.stringify(base);
    expect(applyMove(base, { kind: 'waste' }, { kind: 'tableau', pile: 3, index: 3 })).toBeNull();     // red on red
    expect(applyMove(base, { kind: 'waste' }, { kind: 'tableau', pile: 2, index: 0 })).toBeNull();     // 5 on empty
    expect(applyMove(base, { kind: 'tableau', pile: 1, index: 0 }, { kind: 'tableau', pile: 2, index: 0 })).toBeNull(); // face-down
    expect(applyMove(base, { kind: 'tableau', pile: 3, index: 1 }, { kind: 'foundation', pile: 2 })).toBeNull(); // run to foundation
    expect(applyMove(base, { kind: 'stock' }, { kind: 'tableau', pile: 2, index: 0 })).toBeNull();
    expect(applyMove(base, { kind: 'waste' }, { kind: 'waste' })).toBeNull();
    expect(applyMove(base, { kind: 'tableau', pile: 4, index: 0 }, { kind: 'stock' })).toBeNull();
    expect(applyMove(base, { kind: 'tableau', pile: 0, index: 0 }, { kind: 'tableau', pile: 0, index: 1 })).toBeNull();
    expect(JSON.stringify(base)).toBe(snapshot);
  });
});

describe('hints', () => {
  it('prefers a foundation move', () => {
    const s = build({ waste: [S('D', 5)], tableau: [[{ c: S('H', 1), up: true }], [{ c: S('C', 6), up: true }]] });
    const h = findHint(s);
    expect(h?.type).toBe('move');
    if (h?.type === 'move') { expect(h.to).toEqual({ kind: 'foundation', pile: 0 }); expect(h.cards).toEqual([S('H', 1)]); expect(h.reason).toMatch(/Ace of Hearts/); }
  });
  it('then a whole run that uncovers a face-down card', () => {
    const s = build({ tableau: [[{ c: S('S', 9), up: false }, { c: S('H', 5), up: true }], [{ c: S('C', 6), up: true }], [{ c: S('D', 7), up: false }, { c: S('S', 6), up: true }]] });
    const h = findHint(s);
    expect(h).toMatchObject({ type: 'move', from: { kind: 'tableau', pile: 0, index: 1 }, to: { kind: 'tableau', pile: 1 } });
    expect((h as { reason: string }).reason).toMatch(/uncover/);
  });
  it('never shuffles a bare King run between empty columns; falls back to drawing', () => {
    const s = build({ tableau: [[{ c: S('H', 13), up: true }, { c: S('S', 12), up: true }], []], stock: [S('C', 2)] });
    expect(findHint(s)).toEqual({ type: 'draw', reason: 'Turn over the next card from the stock.' });
  });
  it('suggests the waste card onto a column when nothing better exists', () => {
    const s = build({ waste: [S('D', 5)], tableau: [[{ c: S('C', 6), up: true }]], stock: [S('C', 2)] });
    expect(findHint(s)).toMatchObject({ type: 'move', from: { kind: 'waste' }, to: { kind: 'tableau', pile: 0 } });
  });
  it('suggests a partial run only when it frees a card for the foundation', () => {
    // Column 1 holds 3♠ with 2♥ on it; the Spades foundation is at 2, so moving 2♥ onto 3♣ frees 3♠ to go up.
    const s = build({ foundations: [[S('S', 1), S('S', 2)]], tableau: [[{ c: S('S', 3), up: true }, { c: S('H', 2), up: true }], [{ c: S('C', 3), up: true }]], stock: [S('D', 9)] });
    const h = findHint(s);
    expect(h).toMatchObject({ type: 'move', from: { kind: 'tableau', pile: 0, index: 1 }, to: { kind: 'tableau', pile: 1 } });
    expect((h as { reason: string }).reason).toMatch(/Three of Spades can go up/);
  });
  it('turns the waste over when the stock is empty, and reports null when truly stuck', () => {
    const s = build({ waste: [S('D', 5)], tableau: [[{ c: S('D', 6), up: true }]], stock: [] });
    expect(findHint(s)).toEqual({ type: 'draw', reason: 'Turn the waste pile back over and go through it again.' });
    const stuck = build({ stock: [], tableau: [[{ c: S('H', 2), up: true }], [{ c: S('D', 2), up: true }]] });
    // every other card is nowhere: put them face down in column 3 so the state is complete but nothing moves
    const rest = Array.from({ length: 52 }, (_, i) => i).filter((c) => c !== S('H', 2) && c !== S('D', 2));
    stuck.tableau[2] = rest.map((c) => ({ c, up: false }));
    expect(findHint(stuck)).toBeNull();
    expect(hasAnyAction(stuck)).toBe(false);
    expect(hasAnyAction(s)).toBe(true);
  });
});

describe('finishing', () => {
  it('isWon when all four foundations hold thirteen cards', () => {
    const won = build({ foundations: [0, 1, 2, 3].map((su) => Array.from({ length: 13 }, (_, r) => su * 13 + r)), stock: [] });
    expect(isWon(won)).toBe(true); expect(canAutoFinish(won)).toBe(false); expect(validateState(won)).toBe(true);
    expect(isWon(deal(1))).toBe(false);
  });
  it('auto-finish is offered only when nothing is hidden, and finishes the game lowest rank first', () => {
    // Four alternating-color K→A runs, all face up, nothing in the stock.
    const runs: { c: number; up: boolean }[][] = [[], [], [], []];
    for (let r = 13; r >= 1; r--) { runs[0].push({ c: S(r % 2 ? 'S' : 'H', r), up: true }); runs[1].push({ c: S(r % 2 ? 'H' : 'S', r), up: true }); runs[2].push({ c: S(r % 2 ? 'D' : 'C', r), up: true }); runs[3].push({ c: S(r % 2 ? 'C' : 'D', r), up: true }); }
    const mk = () => build({ tableau: runs.map((r) => r.map((x) => ({ ...x }))), stock: [] });
    let s = mk();
    expect(validateState(s)).toBe(true);
    expect(canAutoFinish(s)).toBe(true);
    const oneInStock = mk(); oneInStock.stock = [oneInStock.tableau[0].pop()!.c];
    expect(canAutoFinish(oneInStock)).toBe(false);
    const hidden = build({ tableau: runs.map((r, i) => r.map((x, j) => ({ ...x, up: !(i === 0 && j === 0) }))), stock: [] });
    expect(canAutoFinish(hidden)).toBe(false);
    let steps = 0; let lastRank = 0;
    for (let m = autoFinishStep(s); m; m = autoFinishStep(s)) {
      const moving = cardsAt(s, m.from)[0];
      expect(rankOf(moving)).toBeGreaterThanOrEqual(lastRank); lastRank = rankOf(moving);
      s = applyMove(s, m.from, m.to)!; steps++;
      expect(validateState(s)).toBe(true);
    }
    expect(steps).toBe(52); expect(isWon(s)).toBe(true);
  });
});

describe('validateState', () => {
  it('accepts fresh deals and rejects duplicates, missing cards, bad foundations and bad runs', () => {
    expect(validateState(deal(9))).toBe(true);
    const dup = deal(9); dup.stock[0] = dup.stock[1]; expect(validateState(dup)).toBe(false);
    const missing = deal(9); missing.stock.pop(); expect(validateState(missing)).toBe(false);
    const badF = build({ foundations: [[S('S', 1), S('H', 2)]] }); expect(validateState(badF)).toBe(false);
    const badRun = build({ tableau: [[{ c: S('S', 9), up: true }, { c: S('C', 8), up: true }]] }); expect(validateState(badRun)).toBe(false);
    const downOnUp = build({ tableau: [[{ c: S('S', 9), up: true }, { c: S('H', 8), up: false }]] }); expect(validateState(downOnUp)).toBe(false);
    expect(validateState(null)).toBe(false); expect(validateState({})).toBe(false); expect(validateState({ ...deal(1), drawMode: 2 })).toBe(false);
  });
});

describe('playing many games by hint keeps every state legal', () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('seed %i', (seed) => {
    for (const mode of [1, 3] as const) {
      let s = deal(seed, mode); let guard = 0; let draws = 0;
      for (let h = findHint(s); h && guard < 2000; h = findHint(s), guard++) {
        if (h.type === 'draw') { s = draw(s)!; if (++draws > 400) break; }
        else { const n = applyMove(s, h.from, h.to); expect(n, `hint produced an illegal move at seed ${seed}`).not.toBeNull(); s = n!; }
        expect(validateState(s)).toBe(true);
      }
      expect(guard).toBeLessThan(2000);
    }
  });
});

describe('locName', () => {
  it('describes piles for announcements', () => {
    const s = build({ foundations: [[S('S', 1)]], tableau: [[], [{ c: S('H', 9), up: true }]] });
    expect(locName(s, { kind: 'stock' })).toBe('the stock'); expect(locName(s, { kind: 'waste' })).toBe('the waste pile');
    expect(locName(s, { kind: 'foundation', pile: 0 })).toBe('the Spades foundation'); expect(locName(s, { kind: 'foundation', pile: 1 })).toBe('empty foundation 2');
    expect(locName(s, { kind: 'tableau', pile: 0, index: 0 } as Loc)).toBe('empty column 1'); expect(locName(s, { kind: 'tableau', pile: 1, index: 1 })).toBe('column 2 on Nine of Hearts');
  });
});
