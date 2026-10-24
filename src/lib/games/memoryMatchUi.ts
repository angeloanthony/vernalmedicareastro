// src/lib/games/memoryMatchUi.ts — the Memory Match interface over memoryMatch.ts.
//
// Tap or click a card to turn it; a matching pair stays up; a miss turns back
// after a moment — or as soon as you turn the next card, so nobody waits.
// Keyboard: arrows move, Enter/Space turns. No timer. The board (seed, theme,
// level, matched pairs, moves, hints) is saved on this device; play continues
// when storage is blocked. GA4 via window.dataLayer: game_started once per page
// view, game_completed once per board.

import {
  THEMES, LEVELS, LEVEL_ORDER, DEFAULT_THEME, generate, isMatch, hintPair, isComplete, themeByKey, iconOf, iconSvg, columnsFor,
  type Level, type Board,
} from './memoryMatch';

const STORE = 'vm-memory-match-v1';
const GAME = 'memory_match';
const MISS_MS = 1100;
const HINT_MS = 1400;

interface Saved { seed: number; theme: string; level: Level; matched: string[]; moves: number; hints: number; solved: number }

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
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h4l8 10h4M4 17h4l2.5-3.1M13.5 10.1 16 7h4M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
  back: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="13" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5"/><path d="M24 11l3.5 9.5L24 37l-3.5-16.5z" fill="rgba(255,255,255,.85)"/><circle cx="24" cy="24" r="2.5" fill="#fbbf24"/></svg>',
};

export function mount(): void {
  const root = document.getElementById('mm');
  if (!root) return;
  const ctlEl = root.querySelector<HTMLElement>('#mm-controls');
  const statusEl = root.querySelector<HTMLElement>('#mm-status');
  const gridEl = root.querySelector<HTMLElement>('#mm-grid');
  const doneEl = root.querySelector<HTMLElement>('#mm-done');
  const live = root.querySelector<HTMLElement>('#mm-live');
  if (!ctlEl || !statusEl || !gridEl || !doneEl || !live) return;

  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const narrow = () => window.innerWidth < 600;
  const saved = readJson<Saved>(STORE);
  let S: Saved = saved && LEVELS[saved.level] && typeof saved.seed === 'number'
    ? { ...saved, theme: themeByKey(saved.theme).key, matched: saved.matched ?? [], moves: saved.moves ?? 0, hints: saved.hints ?? 0, solved: saved.solved ?? 0 }
    : { seed: newSeed(), theme: DEFAULT_THEME, level: 'easy', matched: [], moves: 0, hints: 0, solved: 0 };
  let board: Board = generate(S.theme, S.level, S.seed);
  let open: number[] = [];          // face-up, not yet resolved (0–2)
  let missTimer: number | null = null;
  let hinted: number[] = [];
  let hintTimer: number | null = null;
  let focus = 0;
  let interacted = false;

  function newSeed(): number { return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0; }
  const persist = () => writeJson(STORE, S);
  const announce = (msg: string) => { live.textContent = ''; window.setTimeout(() => { live.textContent = msg; }, 40); };
  const started = () => { if (!interacted) { interacted = true; track('game_started', { resumed: S.matched.length || S.moves ? 1 : 0, level: S.level, theme: S.theme }, 'started'); } };
  const theme = () => themeByKey(S.theme);
  const labelOf = (idx: number) => iconOf(theme(), board.cards[idx]).label;
  const isUp = (idx: number) => S.matched.includes(board.cards[idx]) || open.includes(idx) || hinted.includes(idx);

  function renderControls(): void {
    ctlEl!.innerHTML =
      `<div class="mm-ctl"><label class="mm-label" for="mm-theme">Theme</label><select id="mm-theme" class="mm-select">${THEMES.map((t) => `<option value="${t.key}"${t.key === S.theme ? ' selected' : ''}>${esc(t.label)}</option>`).join('')}</select></div>` +
      `<fieldset class="mm-ctl mm-levels"><legend class="mm-label">Difficulty</legend>${LEVEL_ORDER.map((lv) => `<button type="button" class="mm-level${lv === S.level ? ' is-on' : ''}" data-level="${lv}" aria-pressed="${lv === S.level}" title="${esc(LEVELS[lv].hint)}">${LEVELS[lv].label}</button>`).join('')}</fieldset>` +
      `<p class="mm-levelhint">${esc(LEVELS[S.level].hint)}</p>` +
      `<div class="mm-ctl mm-ctl--actions"><button type="button" class="mm-btn mm-btn-ghost" data-mm="hint"${isComplete(board, S.matched) ? ' disabled' : ''}>${ICON.bulb} Hint</button><button type="button" class="mm-btn mm-btn-ghost" data-mm="new">${ICON.shuffle} New game</button></div>`;
  }

  function renderStatus(): void {
    // Separators are real text so the line reads naturally to screen readers.
    statusEl!.innerHTML = `<span><strong>${S.matched.length}</strong> of ${board.pairs} pairs</span><span aria-hidden="true"> · </span><span><strong>${S.moves}</strong> move${S.moves === 1 ? '' : 's'}</span><span aria-hidden="true"> · </span><span><strong>${S.hints}</strong> hint${S.hints === 1 ? '' : 's'}</span>`;
  }

  function renderGrid(): void {
    const t = theme();
    const cols = columnsFor(S.level, narrow());
    gridEl!.style.setProperty('--cols', String(cols));
    gridEl!.style.setProperty('--theme', t.color);
    gridEl!.setAttribute('aria-label', `${board.cards.length} cards, ${cols} per row. Arrow keys move; Enter turns a card.`);
    gridEl!.innerHTML = board.cards.map((id, idx) => {
      const matched = S.matched.includes(id);
      const up = isUp(idx);
      const ic = iconOf(t, id);
      const label = matched ? `${ic.label}, matched` : up ? ic.label : `Card ${idx + 1}, face down`;
      return `<button type="button" class="mm-card${up ? ' is-up' : ''}${matched ? ' is-matched' : ''}${hinted.includes(idx) ? ' is-hint' : ''}" data-idx="${idx}" tabindex="${idx === focus ? 0 : -1}" aria-label="${esc(label)}"${matched ? ' aria-disabled="true"' : ''}>` +
        `<span class="mm-card__inner"><span class="mm-face mm-face--back">${ICON.back}</span><span class="mm-face mm-face--front">${iconSvg(ic)}<span class="mm-face__label">${esc(ic.label)}</span></span></span></button>`;
    }).join('');
  }

  function renderDone(): void {
    const done = isComplete(board, S.matched);
    doneEl!.hidden = !done;
    doneEl!.innerHTML = done
      ? `<div class="mm-win"><span class="mm-win__star">${ICON.star}</span><h3 tabindex="-1">All ${board.pairs} pairs matched!</h3><p>${esc(theme().label)} · ${LEVELS[S.level].label} · ${S.moves} moves${S.hints ? ` · ${S.hints} hint${S.hints === 1 ? '' : 's'}` : ' · no hints'} · games finished on this device: ${S.solved}</p>` +
        `<div class="mm-actions"><button type="button" class="mm-btn mm-btn-primary" data-mm="new">${ICON.shuffle} Play again</button>${S.level !== 'hard' ? `<button type="button" class="mm-btn mm-btn-ghost" data-mm="harder">Try ${LEVELS[LEVEL_ORDER[LEVEL_ORDER.indexOf(S.level) + 1]].label}</button>` : ''}</div></div>`
      : '';
  }

  function renderAll(): void { renderControls(); renderStatus(); renderGrid(); renderDone(); }

  const cardAt = (idx: number) => gridEl!.querySelector<HTMLButtonElement>(`.mm-card[data-idx="${idx}"]`);
  function focusCard(idx: number): void { focus = idx; gridEl!.querySelectorAll<HTMLElement>('.mm-card').forEach((e) => { e.tabIndex = -1; }); const el = cardAt(idx); if (el) { el.tabIndex = 0; el.focus({ preventScroll: true }); } }
  function clearTimers(): void { if (missTimer) { window.clearTimeout(missTimer); missTimer = null; } if (hintTimer) { window.clearTimeout(hintTimer); hintTimer = null; } }

  function startBoard(themeKey: string, level: Level, seed = newSeed()): void {
    clearTimers();
    S = { ...S, theme: themeKey, level, seed, matched: [], moves: 0, hints: 0 };
    board = generate(themeKey, level, seed);
    open = []; hinted = []; focus = 0;
    persist(); renderAll();
    announce(`New ${LEVELS[level].label} game: ${themeByKey(themeKey).label}, ${board.cards.length} cards face down.`);
  }

  function resolveMiss(): void {
    if (missTimer) { window.clearTimeout(missTimer); missTimer = null; }
    open = [];
  }

  function flip(idx: number): void {
    if (S.matched.includes(board.cards[idx]) || isComplete(board, S.matched)) return;
    started();
    if (open.length === 2) resolveMiss(); // a miss still showing turns back now
    if (open.includes(idx)) return;
    open.push(idx);
    focus = idx;
    if (open.length < 2) { renderGrid(); focusCard(idx); announce(labelOf(idx)); return; }
    S.moves++;
    const [a, b] = open;
    if (isMatch(board, a, b)) {
      S.matched.push(board.cards[a]);
      open = [];
      hinted = hinted.filter((h) => h !== a && h !== b);
      const complete = isComplete(board, S.matched);
      if (complete) { S.solved++; track('game_completed', { level: S.level, theme: S.theme, moves: S.moves, hints: S.hints, pairs: board.pairs }, 'completed:' + S.seed); }
      persist(); renderAll(); focusCard(idx);
      announce(complete ? `${labelOf(idx)} — a match! All pairs found in ${S.moves} moves.` : `${labelOf(idx)} — a match! ${board.pairs - S.matched.length} pairs to go.`);
      if (complete) { const h = doneEl!.querySelector<HTMLElement>('h3'); if (h) h.focus({ preventScroll: true }); if (!RM) doneEl!.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    } else {
      persist(); renderStatus(); renderGrid(); focusCard(idx);
      announce(`${labelOf(a)} and ${labelOf(b)} — not a match.`);
      missTimer = window.setTimeout(() => { missTimer = null; open = []; renderGrid(); focusCard(focus); }, MISS_MS);
    }
  }

  function hint(): void {
    started();
    const pair = hintPair(board, S.matched);
    if (!pair) return;
    S.hints++;
    hinted = pair;
    persist(); renderControls(); renderStatus(); renderGrid(); focusCard(focus);
    announce(`Hint: ${labelOf(pair[0])} is at cards ${pair[0] + 1} and ${pair[1] + 1}.`);
    if (hintTimer) window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => { hintTimer = null; hinted = []; renderGrid(); focusCard(focus); }, HINT_MS);
  }

  gridEl.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.mm-card');
    if (!el || !gridEl.contains(el)) return;
    flip(+el.dataset.idx!);
  });
  gridEl.addEventListener('keydown', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.mm-card');
    if (!el) return;
    const idx = +el.dataset.idx!;
    const cols = +(gridEl.style.getPropertyValue('--cols') || columnsFor(S.level, narrow()));
    const n = board.cards.length;
    const moves: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols, Home: -idx, End: n - 1 - idx };
    if (e.key in moves) {
      e.preventDefault(); started();
      const next = Math.min(n - 1, Math.max(0, idx + moves[e.key]));
      focusCard(next);
    } else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(idx); }
  });

  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-mm],[data-level]');
    if (!t || !root.contains(t)) return;
    started();
    const lv = t.getAttribute('data-level') as Level | null;
    if (lv) { if (lv !== S.level) startBoard(S.theme, lv); return; }
    const act = t.getAttribute('data-mm');
    if (act === 'hint') hint();
    else if (act === 'new') startBoard(S.theme, S.level);
    else if (act === 'harder') startBoard(S.theme, LEVEL_ORDER[Math.min(2, LEVEL_ORDER.indexOf(S.level) + 1)]);
  });
  root.addEventListener('change', (e) => {
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>('#mm-theme');
    if (sel) { started(); startBoard(sel.value, S.level); }
  });
  let lastNarrow = narrow();
  window.addEventListener('resize', () => { if (narrow() !== lastNarrow) { lastNarrow = narrow(); renderGrid(); } });

  renderAll();
}
