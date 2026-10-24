// src/lib/games/solitaireUi.ts — the Vernal Solitaire interface over solitaire.ts.
//
// Tap a card, then tap where it goes (foundations and legal columns light up);
// tap the same card again to send it to its best spot. Dragging works too, with
// a mouse or a finger. Keyboard: arrows move between piles and cards, Enter or
// Space picks up / puts down, Escape cancels. The stock is a button. No timer.
// The whole game (deal seed, draw mode, state, undo history, counters) is saved
// on this device; play continues when storage is blocked. GA4 via
// window.dataLayer: game_started once per page view, game_completed once per deal.

import {
  deal, draw, cardsAt, applyMove, legalTargets, foundationFor, findHint, isWon, canAutoFinish, autoFinishStep, hasAnyAction,
  validateState, cardName, rankOf, suitOf, isRed, locName, RANK_SHORT, SUITS, TABLEAU_PILES,
  type GameState, type Loc, type DrawMode,
} from './solitaire';

const STORE = 'vm-solitaire-v1';
const GAME = 'solitaire';
const HISTORY_MAX = 80;
const HINT_MS = 2400;
const DRAG_START_PX = 8;

interface Snap { state: GameState; moves: number }
interface Saved { v: 1; seed: number; drawMode: DrawMode; state: GameState; history: Snap[]; moves: number; hints: number; undos: number; wins: number; auto: number }

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
function readJson<T>(key: string): T | null { try { const r = window.localStorage.getItem(key); return r ? (JSON.parse(r) as T) : null; } catch { return null; } }
function writeJson(key: string, v: unknown): void { try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage blocked */ } }

const sentOnce: Record<string, true> = {};
function track(name: string, params: Record<string, string | number>, once?: string): void {
  if (once) { if (sentOnce[once]) return; sentOnce[once] = true; }
  try {
    const dl = (window as unknown as { dataLayer?: { push: (...a: unknown[]) => void } }).dataLayer;
    if (!dl || typeof dl.push !== 'function') return;
    // gtag.js only processes an `arguments` object, exactly as gtag() pushes it.
    // eslint-disable-next-line prefer-rest-params
    (function (..._args: unknown[]) { dl.push(arguments); })('event', name, { game_name: GAME, ...params });
  } catch { /* analytics unavailable */ }
}

const ICON = {
  undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h4l8 10h4M4 17h4l2.5-3.1M13.5 10.1 16 7h4M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
  restart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  finish: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>',
  recycle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
};

/** The face of one card as HTML (also used by the page for its sample cards). */
export function cardFaceHtml(c: number): string {
  const r = RANK_SHORT[rankOf(c) - 1]; const g = SUITS[suitOf(c)].glyph; const rank = rankOf(c);
  const center = rank > 10 ? `<span class="sol-card__court" aria-hidden="true"><b>${r}</b>${g}</span>` : `<span class="sol-card__pip" aria-hidden="true">${g}</span>`;
  return `<span class="sol-card__idx" aria-hidden="true">${r}<i>${g}</i></span>${center}<span class="sol-card__idx sol-card__idx--b" aria-hidden="true">${r}<i>${g}</i></span>`;
}

const locKey = (l: Loc): string => l.kind === 'stock' ? 'stock' : l.kind === 'waste' ? 'waste' : l.kind === 'foundation' ? `f:${l.pile}` : `t:${l.pile}:${l.index}`;
function parseLoc(k: string | undefined): Loc | null {
  if (!k) return null;
  if (k === 'stock' || k === 'waste') return { kind: k };
  const p = k.split(':');
  if (p[0] === 'f') return { kind: 'foundation', pile: +p[1] };
  if (p[0] === 't') return { kind: 'tableau', pile: +p[1], index: +p[2] };
  return null;
}
const sameLoc = (a: Loc | null, b: Loc | null): boolean => !!a && !!b && locKey(a) === locKey(b);
/** The pile a location belongs to (a tableau index collapses onto its column). */
const pileKey = (l: Loc): string => l.kind === 'tableau' ? `t${l.pile}` : l.kind === 'foundation' ? `f${l.pile}` : l.kind;

export function mount(): void {
  const root = document.getElementById('sol');
  if (!root) return;
  const ctlEl = root.querySelector<HTMLElement>('#sol-controls');
  const statusEl = root.querySelector<HTMLElement>('#sol-status');
  const msgEl = root.querySelector<HTMLElement>('#sol-msg');
  const boardEl = root.querySelector<HTMLElement>('#sol-board');
  const panelEl = root.querySelector<HTMLElement>('#sol-panel');
  const live = root.querySelector<HTMLElement>('#sol-live');
  if (!ctlEl || !statusEl || !msgEl || !boardEl || !panelEl || !live) return;

  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const newSeed = (): number => (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;

  // ── State ──────────────────────────────────────────────────────────────────
  const saved = readJson<Saved>(STORE);
  let S: Saved = saved && saved.v === 1 && typeof saved.seed === 'number' && (saved.drawMode === 1 || saved.drawMode === 3) && validateState(saved.state)
    ? { ...saved, history: Array.isArray(saved.history) ? saved.history.filter((h) => h && validateState(h.state) && typeof h.moves === 'number').slice(-HISTORY_MAX) : [], moves: saved.moves ?? 0, hints: saved.hints ?? 0, undos: saved.undos ?? 0, wins: saved.wins ?? 0, auto: saved.auto ?? 0 }
    : { v: 1, seed: newSeed(), drawMode: 1, state: deal(0, 1), history: [], moves: 0, hints: 0, undos: 0, wins: 0, auto: 0 };
  if (!saved || !validateState(saved.state)) S.state = deal(S.seed, S.drawMode);

  let sel: Loc | null = null;
  let targets: Loc[] = [];
  let hintFrom: Loc | null = null; let hintTo: Loc | null = null; let hintStock = false; let hintTimer: number | null = null;
  let focusLoc: Loc | null = null;
  let message = '';
  let panel: 'none' | 'confirm-new' | 'confirm-restart' | 'confirm-mode' | 'stuck' | 'won' = 'none';
  let pendingMode: DrawMode = S.drawMode;
  let interacted = false;
  let suppressClick = false;
  let finishing: number | null = null;

  const persist = () => writeJson(STORE, S);
  const announce = (msg: string) => { live.textContent = ''; window.setTimeout(() => { live.textContent = msg; }, 40); };
  const say = (msg: string) => { message = msg; renderStatus(); announce(msg); };
  const started = () => { if (!interacted) { interacted = true; track('game_started', { resumed: S.moves ? 1 : 0, draw_mode: S.drawMode }, 'started'); } };
  const inProgress = () => S.moves > 0 && !isWon(S.state);

  // ── Rendering ──────────────────────────────────────────────────────────────
  function cardLabel(c: number, extra = ''): string { return `${cardName(c)}${extra}`; }
  function faceUpCard(c: number, loc: Loc, style: string, extraClass: string, label: string): string {
    const selected = sel ? cardsAt(S.state, sel).includes(c) : false;
    const hint = hintFrom ? cardsAt(S.state, hintFrom).includes(c) : false;
    return `<button type="button" class="sol-card is-up${isRed(c) ? ' is-red' : ' is-black'}${selected ? ' is-selected' : ''}${hint ? ' is-hint' : ''}${extraClass}" data-loc="${locKey(loc)}" data-card="${c}" style="${style}" tabindex="-1" aria-label="${esc(label)}" aria-pressed="${selected}">${cardFaceHtml(c)}</button>`;
  }
  const faceDownCard = (c: number, style: string) => `<div class="sol-card is-down" data-card="${c}" style="${style}" aria-hidden="true"><span class="sol-card__back"></span></div>`;
  const isTarget = (l: Loc) => targets.some((t) => pileKey(t) === pileKey(l)) || (!!hintTo && pileKey(hintTo) === pileKey(l));

  function renderBoard(): void {
    const hadFocus = boardEl!.contains(document.activeElement); // before innerHTML replaces the focused element
    const s = S.state;
    const stockN = s.stock.length;
    const stockLabel = stockN ? `Stock: ${stockN} card${stockN === 1 ? '' : 's'} face down. Press to turn over the next ${s.drawMode === 3 ? 'three' : 'card'}.` : s.waste.length ? 'Stock is empty. Press to turn the waste pile back over.' : 'Stock and waste are empty.';
    let html = `<div class="sol-row sol-row--top">`;
    // Stock
    html += `<div class="sol-pile sol-pile--stock${hintStock ? ' is-hint' : ''}" data-pile="stock"><button type="button" class="sol-stock${stockN ? '' : ' is-empty'}" data-loc="stock" tabindex="-1" aria-label="${esc(stockLabel)}"${stockN || s.waste.length ? '' : ' disabled'}>` +
      (stockN ? s.stock.slice(-3).map((c, i) => `<span class="sol-card is-down sol-stock__card" data-card="${c}" style="--k:${i}"><span class="sol-card__back"></span></span>`).join('') + `<span class="sol-stock__n" aria-hidden="true">${stockN}</span>` : s.waste.length ? `<span class="sol-stock__recycle">${ICON.recycle}</span>` : '') +
      `</button></div>`;
    // Waste
    const shown = s.waste.slice(-(s.drawMode === 3 ? 3 : 2));
    const topIdx = shown.length - 1;
    html += `<div class="sol-pile sol-pile--waste${s.drawMode === 3 ? ' is-fan' : ''}" data-pile="waste" aria-label="Waste pile">` +
      (shown.length ? shown.map((c, i) => i === topIdx
        ? faceUpCard(c, { kind: 'waste' }, `--k:${i}`, ' sol-waste__card', cardLabel(c, `, top of the waste pile`))
        : `<div class="sol-card is-up is-static${isRed(c) ? ' is-red' : ' is-black'} sol-waste__card" data-card="${c}" style="--k:${i}" aria-hidden="true">${cardFaceHtml(c)}</div>`).join('')
        : `<div class="sol-slot sol-slot--quiet" aria-hidden="true"></div>`) + `</div>`;
    // Foundations
    for (let i = 0; i < 4; i++) {
      const f = s.foundations[i]; const loc: Loc = { kind: 'foundation', pile: i };
      const name = f.length ? `${SUITS[suitOf(f[0])].name} foundation: ${cardName(f[f.length - 1])} on top, ${f.length} of 13` : `Empty foundation ${i + 1}. Aces start here.`;
      html += `<div class="sol-pile sol-pile--foundation${isTarget(loc) ? ' is-target' : ''}" data-pile="f${i}">` +
        (f.length
          ? (f.length > 1 ? `<div class="sol-card is-up is-static${isRed(f[f.length - 2]) ? ' is-red' : ' is-black'}" data-card="${f[f.length - 2]}" aria-hidden="true">${cardFaceHtml(f[f.length - 2])}</div>` : '') + faceUpCard(f[f.length - 1], loc, '', ' sol-found__card', name)
          : `<button type="button" class="sol-slot sol-slot--foundation" data-loc="f:${i}" tabindex="-1" aria-label="${esc(name)}"><span aria-hidden="true">A</span></button>`) + `</div>`;
    }
    html += `</div><div class="sol-row sol-row--tableau">`;
    for (let p = 0; p < TABLEAU_PILES; p++) {
      const pile = s.tableau[p]; const down = pile.filter((x) => !x.up).length; const up = pile.length - down;
      const loc: Loc = { kind: 'tableau', pile: p, index: pile.length };
      const height = `height:calc(var(--card-h) + ${down} * var(--off-down) + ${Math.max(0, up - 1)} * var(--off-up))`;
      html += `<div class="sol-pile sol-pile--tableau${isTarget(loc) ? ' is-target' : ''}" data-pile="t${p}" style="${height}" role="group" aria-label="Column ${p + 1}: ${pile.length ? `${pile.length} card${pile.length === 1 ? '' : 's'}, ${up} face up` : 'empty'}">`;
      if (!pile.length) html += `<button type="button" class="sol-slot sol-slot--tableau" data-loc="t:${p}:0" tabindex="-1" aria-label="Empty column ${p + 1}. A King can start here."><span aria-hidden="true">K</span></button>`;
      let d = 0, u = 0;
      pile.forEach((x, i) => {
        const style = `top:calc(${d} * var(--off-down) + ${u} * var(--off-up))`;
        if (x.up) {
          const below = pile.length - 1 - i;
          html += faceUpCard(x.c, { kind: 'tableau', pile: p, index: i }, style, '', cardLabel(x.c, below ? `, with ${below} card${below === 1 ? '' : 's'} on it, column ${p + 1}` : `, top of column ${p + 1}`));
          u++;
        } else { html += faceDownCard(x.c, style); d++; }
      });
      html += `</div>`;
    }
    html += `</div>`;
    boardEl!.innerHTML = html;
    applyFocus(hadFocus);
  }

  function renderControls(): void {
    const canUndo = S.history.length > 0 && !isWon(S.state) && finishing === null;
    ctlEl!.innerHTML =
      `<fieldset class="sol-ctl sol-modes"><legend class="sol-label">Draw</legend>` +
      ([1, 3] as DrawMode[]).map((m) => `<button type="button" class="sol-mode${m === S.drawMode ? ' is-on' : ''}" data-mode="${m}" aria-pressed="${m === S.drawMode}">${m === 1 ? 'One card' : 'Three cards'}</button>`).join('') + `</fieldset>` +
      `<div class="sol-ctl sol-ctl--actions">` +
      `<button type="button" class="sol-btn sol-btn-ghost" data-sol="undo"${canUndo ? '' : ' disabled'}>${ICON.undo} Undo</button>` +
      `<button type="button" class="sol-btn sol-btn-ghost" data-sol="hint"${isWon(S.state) || finishing !== null ? ' disabled' : ''}>${ICON.bulb} Hint</button>` +
      (canAutoFinish(S.state) && finishing === null ? `<button type="button" class="sol-btn sol-btn-primary" data-sol="finish">${ICON.finish} Finish for me</button>` : '') +
      `<button type="button" class="sol-btn sol-btn-ghost" data-sol="restart">${ICON.restart} Same deal</button>` +
      `<button type="button" class="sol-btn sol-btn-ghost" data-sol="new">${ICON.shuffle} New game</button>` +
      `</div>`;
  }

  function renderStatus(): void {
    const up = S.state.foundations.reduce((n, f) => n + f.length, 0);
    statusEl!.innerHTML = `<span><strong>${S.moves}</strong> move${S.moves === 1 ? '' : 's'}</span><span aria-hidden="true"> · </span><span><strong>${up}</strong> of 52 cards home</span><span aria-hidden="true"> · </span><span><strong>${S.hints}</strong> hint${S.hints === 1 ? '' : 's'}</span>` +
      (S.wins ? `<span aria-hidden="true"> · </span><span>${S.wins} win${S.wins === 1 ? '' : 's'} on this device</span>` : '');
    msgEl!.textContent = message || (S.moves ? '' : 'Tap a card, then tap where it goes. Tap the stock to turn over cards. (Dragging works too.)');
  }

  function renderPanel(): void {
    panelEl!.hidden = panel === 'none';
    if (panel === 'none') { panelEl!.innerHTML = ''; return; }
    if (panel === 'won') {
      panelEl!.innerHTML = `<div class="sol-win"><span class="sol-win__star">${ICON.star}</span><h3 tabindex="-1">You won!</h3><p>${S.drawMode === 1 ? 'Draw one' : 'Draw three'} · ${S.moves} moves${S.hints ? ` · ${S.hints} hint${S.hints === 1 ? '' : 's'}` : ' · no hints'}${S.undos ? ` · ${S.undos} undo${S.undos === 1 ? '' : 's'}` : ''} · wins on this device: ${S.wins}</p>` +
        `<div class="sol-actions"><button type="button" class="sol-btn sol-btn-primary" data-sol="new-now">${ICON.shuffle} Play again</button><button type="button" class="sol-btn sol-btn-ghost" data-sol="restart-now">${ICON.restart} Same deal again</button></div></div>`;
      return;
    }
    if (panel === 'stuck') {
      panelEl!.innerHTML = `<div class="sol-note" role="group" aria-labelledby="sol-note-h"><h3 id="sol-note-h" tabindex="-1">No more moves</h3><p>Nothing can move and there is nothing left to draw. You can undo your last moves, deal the same cards again, or start a new game.</p>` +
        `<div class="sol-actions"><button type="button" class="sol-btn sol-btn-ghost" data-sol="undo"${S.history.length ? '' : ' disabled'}>${ICON.undo} Undo</button><button type="button" class="sol-btn sol-btn-ghost" data-sol="restart-now">${ICON.restart} Same deal</button><button type="button" class="sol-btn sol-btn-primary" data-sol="new-now">${ICON.shuffle} New game</button></div></div>`;
      return;
    }
    const what = panel === 'confirm-restart' ? 'Deal the same cards again?' : panel === 'confirm-mode' ? `Switch to ${pendingMode === 1 ? 'draw one' : 'draw three'}?` : 'Start a new game?';
    const why = panel === 'confirm-mode' ? 'Changing the draw rule starts a new game. Your current game will be lost.' : 'Your current game will be lost.';
    panelEl!.innerHTML = `<div class="sol-note" role="group" aria-labelledby="sol-note-h"><h3 id="sol-note-h" tabindex="-1">${what}</h3><p>${why}</p>` +
      `<div class="sol-actions"><button type="button" class="sol-btn sol-btn-primary" data-sol="${panel === 'confirm-restart' ? 'restart-now' : panel === 'confirm-mode' ? 'mode-now' : 'new-now'}">${panel === 'confirm-restart' ? 'Yes, same deal' : panel === 'confirm-mode' ? 'Yes, switch' : 'Yes, new game'}</button><button type="button" class="sol-btn sol-btn-ghost" data-sol="cancel">Keep playing</button></div></div>`;
  }

  function renderAll(): void { renderControls(); renderStatus(); renderBoard(); renderPanel(); }

  // ── FLIP animation: cards glide from where they were to where they are now ──
  function rectsNow(): Map<number, DOMRect> {
    const m = new Map<number, DOMRect>();
    boardEl!.querySelectorAll<HTMLElement>('[data-card]').forEach((el) => { m.set(+el.dataset.card!, el.getBoundingClientRect()); });
    return m;
  }
  function animateFrom(before: Map<number, DOMRect>, stockRect: DOMRect | null): void {
    if (RM) return;
    boardEl!.querySelectorAll<HTMLElement>('[data-card]').forEach((el) => {
      const c = +el.dataset.card!;
      const now = el.getBoundingClientRect();
      let prev = before.get(c) ?? null;
      if (!prev && stockRect && el.classList.contains('sol-waste__card')) prev = stockRect;
      if (!prev) return;
      const dx = prev.left - now.left, dy = prev.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.style.transition = 'none'; el.style.transform = `translate(${dx}px, ${dy}px)`; el.style.zIndex = '30';
      requestAnimationFrame(() => { el.style.transition = 'transform 0.28s cubic-bezier(.2,.8,.3,1)'; el.style.transform = ''; window.setTimeout(() => { el.style.transition = ''; el.style.zIndex = ''; }, 300); });
    });
  }
  function commit(next: GameState, moveDelta = 1): void {
    const before = rectsNow();
    const stockRect = boardEl!.querySelector('.sol-stock')?.getBoundingClientRect() ?? null;
    S.history.push({ state: S.state, moves: S.moves });
    if (S.history.length > HISTORY_MAX) S.history.shift();
    S.state = next; S.moves += moveDelta;
    sel = null; targets = []; clearHint();
    if (isWon(next)) { S.wins++; panel = 'won'; track('game_completed', { draw_mode: S.drawMode, moves: S.moves, hints: S.hints, undos: S.undos, auto_finished: finishing !== null ? 1 : 0 }, 'completed:' + S.seed); }
    else if (!hasAnyAction(next)) panel = 'stuck';
    else if (panel === 'stuck') panel = 'none';
    persist(); renderAll(); animateFrom(before, stockRect);
    if (isWon(next)) { const h = panelEl!.querySelector<HTMLElement>('h3'); if (h) h.focus({ preventScroll: true }); say(`You won in ${S.moves} moves!`); }
    else if (panel === 'stuck') { const h = panelEl!.querySelector<HTMLElement>('h3'); if (h) h.focus({ preventScroll: true }); }
  }

  // ── Focus (roving tabindex inside the board) ───────────────────────────────
  const elFor = (l: Loc) => boardEl!.querySelector<HTMLElement>(`[data-loc="${locKey(l)}"]`);
  function topOfPile(key: string): Loc | null {
    const s = S.state;
    if (key === 'stock') return { kind: 'stock' };
    if (key === 'waste') return s.waste.length ? { kind: 'waste' } : null;
    if (key[0] === 'f') return { kind: 'foundation', pile: +key.slice(1) };
    const p = +key.slice(1); const pile = s.tableau[p];
    return { kind: 'tableau', pile: p, index: pile.length ? pile.length - 1 : 0 };
  }
  function applyFocus(boardHadFocus: boolean): void {
    let target = focusLoc ? elFor(focusLoc) : null;
    if (!target && focusLoc) { const t = topOfPile(pileKey(focusLoc)); target = t ? elFor(t) : null; if (!target) target = elFor({ kind: 'stock' }); }
    if (!target) target = elFor({ kind: 'stock' });
    boardEl!.querySelectorAll<HTMLElement>('[data-loc]').forEach((e) => { e.tabIndex = -1; });
    if (target) { target.tabIndex = 0; focusLoc = parseLoc(target.dataset.loc); if (boardHadFocus) target.focus({ preventScroll: true }); }
  }
  function moveFocus(l: Loc | null): void { if (!l) return; focusLoc = l; const el = elFor(l); if (el) { boardEl!.querySelectorAll<HTMLElement>('[data-loc]').forEach((e) => { e.tabIndex = -1; }); el.tabIndex = 0; el.focus({ preventScroll: true }); } }
  const TOP_ORDER = ['stock', 'waste', 'f0', 'f1', 'f2', 'f3'];
  const TOP_COL: Record<string, number> = { stock: 0, waste: 1, f0: 3, f1: 4, f2: 5, f3: 6 };
  const COL_TOP = ['stock', 'waste', 'waste', 'f0', 'f1', 'f2', 'f3'];
  function navigate(from: Loc, key: string): Loc | null {
    const s = S.state;
    if (from.kind === 'tableau') {
      const pile = s.tableau[from.pile];
      if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
        const p = key === 'Home' ? 0 : key === 'End' ? TABLEAU_PILES - 1 : Math.min(TABLEAU_PILES - 1, Math.max(0, from.pile + (key === 'ArrowLeft' ? -1 : 1)));
        return topOfPile(`t${p}`);
      }
      if (key === 'ArrowUp') {
        if (from.index > 0 && pile[from.index - 1]?.up) return { kind: 'tableau', pile: from.pile, index: from.index - 1 };
        const t = topOfPile(COL_TOP[from.pile]); return t ?? topOfPile('stock');
      }
      if (key === 'ArrowDown') return from.index + 1 < pile.length ? { kind: 'tableau', pile: from.pile, index: from.index + 1 } : null;
      return null;
    }
    const k = pileKey(from);
    if (key === 'ArrowDown') return topOfPile(`t${TOP_COL[k]}`);
    if (key === 'ArrowUp') return null;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
      let i = TOP_ORDER.indexOf(k);
      if (key === 'Home') i = -1; if (key === 'End') i = TOP_ORDER.length;
      const step = key === 'ArrowLeft' || key === 'End' ? -1 : 1;
      for (let j = i + step; j >= 0 && j < TOP_ORDER.length; j += step) { const t = topOfPile(TOP_ORDER[j]); if (t && elFor(t)) return t; }
    }
    return null;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function clearHint(): void { hintFrom = null; hintTo = null; hintStock = false; if (hintTimer) { window.clearTimeout(hintTimer); hintTimer = null; } }
  function select(l: Loc): void {
    const cards = cardsAt(S.state, l);
    if (!cards.length) return;
    sel = l; targets = legalTargets(S.state, l); clearHint(); focusLoc = l;
    renderBoard();
    const n = cards.length;
    say(n === 1 ? `Picked up ${cardName(cards[0])}. ${targets.length ? `It can go to ${targets.map((t) => locName(S.state, t)).join(' or ')}.` : 'It has nowhere to go right now.'}` : `Picked up ${cardName(cards[0])} and ${n - 1} card${n === 1 ? '' : 's'} on it. ${targets.length ? `They can go to ${targets.map((t) => locName(S.state, t)).join(' or ')}.` : 'They have nowhere to go right now.'}`);
  }
  function deselect(msg?: string): void { sel = null; targets = []; renderBoard(); if (msg) say(msg); else { message = ''; renderStatus(); } }
  function tryMove(from: Loc, to: Loc): boolean {
    const cards = cardsAt(S.state, from);
    const next = applyMove(S.state, from, to);
    if (!next) return false;
    const where = to.kind === 'foundation' ? locName(next, to).replace('empty foundation', 'a foundation') : locName(S.state, to);
    focusLoc = to.kind === 'tableau' ? { kind: 'tableau', pile: to.pile, index: next.tableau[to.pile].length - 1 } : to;
    commit(next);
    if (!isWon(S.state)) say(`Moved ${cardName(cards[0])}${cards.length > 1 ? ` and ${cards.length - 1} more` : ''} to ${where}.`);
    return true;
  }
  function smartMove(from: Loc): boolean {
    const cards = cardsAt(S.state, from);
    if (!cards.length) return false;
    const f = cards.length === 1 ? foundationFor(S.state, cards[0]) : null;
    if (f !== null) return tryMove(from, { kind: 'foundation', pile: f });
    const t = legalTargets(S.state, from).find((x) => x.kind === 'tableau' && (S.state.tableau[x.pile].length > 0 || rankOf(cards[0]) === 13)) ?? null;
    return t ? tryMove(from, t) : false;
  }
  function doDraw(): void {
    const next = draw(S.state);
    if (!next) return;
    focusLoc = { kind: 'stock' };
    commit(next);
    const n = next.waste.length - (S.history[S.history.length - 1]?.state.waste.length ?? 0);
    say(next.waste.length && n > 0 ? `Turned over ${n === 1 ? cardName(next.waste[next.waste.length - 1]) : `${n} cards; ${cardName(next.waste[next.waste.length - 1])} is on top`}.` : 'Turned the waste pile back over.');
  }
  function activate(l: Loc): void {
    started();
    if (finishing !== null) return;
    if (panel !== 'none' && panel !== 'stuck') { panel = 'none'; renderPanel(); }
    if (l.kind === 'stock') { sel = null; targets = []; doDraw(); return; }
    if (sel) {
      if (sameLoc(sel, l)) { if (!smartMove(l)) deselect(`${cardName(cardsAt(S.state, l)[0])} has nowhere to go right now.`); return; }
      const to: Loc = l.kind === 'tableau' ? { kind: 'tableau', pile: l.pile, index: S.state.tableau[l.pile].length } : l;
      if (to.kind !== 'waste' && tryMove(sel, to)) return;
      if (cardsAt(S.state, l).length) { select(l); return; }
      deselect('That card cannot go there.'); return;
    }
    if (cardsAt(S.state, l).length) select(l);
    else if (l.kind === 'tableau' || l.kind === 'foundation') say('Pick up a card first, then choose where it goes.');
  }
  function undo(): void {
    started();
    const snap = S.history.pop();
    if (!snap) return;
    const before = rectsNow();
    S.state = snap.state; S.moves = snap.moves; S.undos++;
    sel = null; targets = []; clearHint(); panel = 'none';
    persist(); renderAll(); animateFrom(before, null);
    say('Undid your last move.');
  }
  function hint(): void {
    started();
    if (isWon(S.state)) return;
    const h = findHint(S.state);
    sel = null; targets = []; clearHint();
    if (!h) { S.hints++; persist(); renderAll(); say('No moves are left. Try Undo, the same deal again, or a new game.'); return; }
    S.hints++;
    if (h.type === 'draw') hintStock = true; else { hintFrom = h.from; hintTo = h.to; }
    persist(); renderControls(); renderStatus(); renderBoard();
    say(`Hint: ${h.reason}`);
    hintTimer = window.setTimeout(() => { hintTimer = null; hintFrom = null; hintTo = null; hintStock = false; renderBoard(); }, HINT_MS);
  }
  function finish(): void {
    started();
    if (finishing !== null || !canAutoFinish(S.state)) return;
    S.auto++;
    const step = () => {
      const m = autoFinishStep(S.state);
      if (!m) { finishing = null; renderControls(); return; }
      finishing = finishing ?? 0;
      const next = applyMove(S.state, m.from, m.to);
      if (!next) { finishing = null; renderControls(); return; }
      commit(next);
      if (isWon(S.state)) { finishing = null; renderControls(); return; }
      finishing = window.setTimeout(step, RM ? 0 : 140);
    };
    finishing = 0; renderControls();
    say('Finishing the game for you.');
    step();
  }
  function startGame(seed: number, mode: DrawMode, note: string): void {
    clearHint(); if (finishing) window.clearTimeout(finishing); finishing = null;
    S = { ...S, seed, drawMode: mode, state: deal(seed, mode), history: [], moves: 0, hints: 0, undos: 0 };
    sel = null; targets = []; panel = 'none'; focusLoc = { kind: 'stock' }; message = '';
    persist(); renderAll(); say(note);
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  boardEl.addEventListener('click', (e) => {
    if (suppressClick) { suppressClick = false; e.preventDefault(); return; }
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-loc]');
    if (!el || !boardEl.contains(el) || (el as HTMLButtonElement).disabled) return;
    const l = parseLoc(el.dataset.loc); if (l) activate(l);
  });
  boardEl.addEventListener('keydown', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-loc]');
    if (!el) return;
    const l = parseLoc(el.dataset.loc); if (!l) return;
    if (e.key === 'Escape') { if (sel) { e.preventDefault(); deselect('Put the card back.'); } return; }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      e.preventDefault(); started();
      const next = navigate(l, e.key);
      if (next) { moveFocus(next); const c = cardsAt(S.state, next); if (next.kind === 'stock') announce(elFor(next)?.getAttribute('aria-label') ?? 'Stock'); else announce(c.length ? elFor(next)?.getAttribute('aria-label') ?? cardName(c[0]) : elFor(next)?.getAttribute('aria-label') ?? ''); }
    }
  });

  // Pointer drag: a face-up card (or run) follows the finger; drop on a pile.
  let drag: { id: number; from: Loc; x0: number; y0: number; ghost: HTMLElement | null; lifted: HTMLElement[]; w: number; h: number } | null = null;
  function endDrag(dropped: boolean): void {
    if (!drag) return;
    const d = drag; drag = null;
    d.lifted.forEach((el) => el.classList.remove('is-lifting'));
    if (d.ghost) {
      if (!dropped && !RM && d.lifted[0]) {
        const r = d.lifted[0].getBoundingClientRect();
        d.ghost.style.transition = 'transform 0.2s ease'; d.ghost.style.transform = `translate(${r.left}px, ${r.top}px)`;
        window.setTimeout(() => d.ghost?.remove(), 200);
      } else d.ghost.remove();
    }
  }
  // Listeners live on the window so a drag that leaves the board still ends cleanly.
  boardEl.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || finishing !== null) return;
    const el = (e.target as HTMLElement).closest<HTMLElement>('.sol-card.is-up[data-loc]');
    if (!el || !boardEl.contains(el)) return;
    const from = parseLoc(el.dataset.loc); if (!from || !cardsAt(S.state, from).length) return;
    drag = { id: e.pointerId, from, x0: e.clientX, y0: e.clientY, ghost: null, lifted: [], w: el.offsetWidth, h: el.offsetHeight };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.ghost) {
      if (Math.hypot(dx, dy) < DRAG_START_PX) return;
      started();
      // Show the pick-up without re-rendering (a re-render would replace the element under the pointer).
      if (!sameLoc(sel, drag.from)) {
        sel = drag.from; targets = legalTargets(S.state, drag.from); clearHint(); focusLoc = drag.from;
        boardEl.querySelectorAll('.is-selected').forEach((x) => { x.classList.remove('is-selected'); x.setAttribute('aria-pressed', 'false'); });
        boardEl.querySelectorAll('.sol-pile.is-target').forEach((x) => x.classList.remove('is-target'));
        targets.forEach((t) => boardEl.querySelector(`.sol-pile[data-pile="${pileKey(t)}"]`)?.classList.add('is-target'));
      }
      const cards = cardsAt(S.state, drag.from);
      const els = cards.map((c) => boardEl.querySelector<HTMLElement>(`[data-card="${c}"]`)).filter((x): x is HTMLElement => !!x);
      const first = els[0]; if (!first) { drag = null; return; }
      const r0 = first.getBoundingClientRect();
      const ghost = document.createElement('div'); ghost.className = 'sol-drag'; ghost.setAttribute('aria-hidden', 'true');
      ghost.style.width = `${r0.width}px`;
      els.forEach((el) => { const r = el.getBoundingClientRect(); const clone = el.cloneNode(true) as HTMLElement; clone.removeAttribute('data-loc'); clone.removeAttribute('data-card'); clone.classList.add('is-selected'); clone.style.top = `${r.top - r0.top}px`; clone.style.left = '0'; clone.style.position = 'absolute'; clone.style.width = `${r.width}px`; clone.style.height = `${r.height}px`; clone.tabIndex = -1; ghost.appendChild(clone); el.classList.add('is-lifting'); });
      ghost.style.height = `${(els[els.length - 1].getBoundingClientRect().bottom - r0.top)}px`;
      document.body.appendChild(ghost);
      drag.ghost = ghost; drag.lifted = els; drag.x0 = e.clientX - r0.left; drag.y0 = e.clientY - r0.top;
    }
    drag.ghost.style.transform = `translate(${e.clientX - drag.x0}px, ${e.clientY - drag.y0}px)`;
    e.preventDefault();
  });
  function pileUnder(x: number, y: number): Loc | null {
    if (!drag?.ghost) return null;
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    let pile = el?.closest<HTMLElement>('.sol-pile') ?? null;
    if (!pile) {
      // the card's own footprint: the pile it overlaps most
      const g = drag.ghost.getBoundingClientRect(); let best: HTMLElement | null = null; let bestA = 0;
      boardEl!.querySelectorAll<HTMLElement>('.sol-pile').forEach((p) => { const r = p.getBoundingClientRect(); const a = Math.max(0, Math.min(g.right, r.right) - Math.max(g.left, r.left)) * Math.max(0, Math.min(g.top + drag!.h, r.bottom) - Math.max(g.top, r.top)); if (a > bestA) { bestA = a; best = p; } });
      pile = best;
    }
    if (!pile) return null;
    const k = pile.dataset.pile!;
    if (k[0] === 'f') return { kind: 'foundation', pile: +k.slice(1) };
    if (k[0] === 't') return { kind: 'tableau', pile: +k.slice(1), index: S.state.tableau[+k.slice(1)].length };
    return null;
  }
  window.addEventListener('pointerup', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.ghost) { drag = null; return; }      // a plain tap: the click handler takes it
    suppressClick = true; window.setTimeout(() => { suppressClick = false; }, 0);
    const to = pileUnder(e.clientX, e.clientY);
    const from = drag.from;
    if (to && !sameLoc(to, from) && tryMove(from, to)) { endDrag(true); return; }
    endDrag(false);
    deselect(to ? 'That card cannot go there.' : undefined);
  });
  window.addEventListener('pointercancel', () => { if (drag?.ghost) { endDrag(false); deselect(); } else drag = null; });

  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-sol],[data-mode]');
    if (!t || !root.contains(t) || (t as HTMLButtonElement).disabled) return;
    started();
    const mode = t.getAttribute('data-mode');
    if (mode) {
      const m = +mode as DrawMode;
      if (m === S.drawMode) return;
      pendingMode = m;
      if (inProgress()) { panel = 'confirm-mode'; renderPanel(); panelEl.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true }); }
      else startGame(newSeed(), m, `New game, draw ${m === 1 ? 'one' : 'three'}.`);
      return;
    }
    const act = t.getAttribute('data-sol');
    if (act === 'undo') undo();
    else if (act === 'hint') hint();
    else if (act === 'finish') finish();
    else if (act === 'new') { if (inProgress()) { panel = 'confirm-new'; renderPanel(); panelEl.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true }); } else startGame(newSeed(), S.drawMode, 'New game dealt.'); }
    else if (act === 'restart') { if (inProgress()) { panel = 'confirm-restart'; renderPanel(); panelEl.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true }); } else startGame(S.seed, S.drawMode, 'Same deal, from the start.'); }
    else if (act === 'new-now') startGame(newSeed(), S.drawMode, 'New game dealt.');
    else if (act === 'restart-now') startGame(S.seed, S.drawMode, 'Same deal, from the start.');
    else if (act === 'mode-now') startGame(newSeed(), pendingMode, `New game, draw ${pendingMode === 1 ? 'one' : 'three'}.`);
    else if (act === 'cancel') { panel = 'none'; renderPanel(); }
  });

  // Card size follows the board width: seven columns always fit, cards never exceed --card-max.
  function sizeCards(): void {
    const w = boardEl!.clientWidth; if (!w) return;
    const gap = parseFloat(getComputedStyle(boardEl!).getPropertyValue('--gap')) || 8;
    const max = parseFloat(getComputedStyle(boardEl!).getPropertyValue('--card-max')) || 110;
    const cw = Math.max(30, Math.min(max, Math.floor((w - gap * 6) / 7)));
    boardEl!.style.setProperty('--card-w', `${cw}px`);
  }
  if (typeof ResizeObserver === 'function') new ResizeObserver(() => sizeCards()).observe(boardEl); else window.addEventListener('resize', sizeCards);
  sizeCards();
  if (isWon(S.state)) panel = 'won'; else if (!hasAnyAction(S.state)) panel = 'stuck';
  focusLoc = { kind: 'stock' };
  persist();
  renderAll();
}
