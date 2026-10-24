// src/lib/games/wordSearchUi.ts — the Word Search interface over wordSearch.ts.
//
// Three ways to select a word, all leading to the same engine call:
//   • drag (mouse or finger) from the first letter to the last;
//   • tap the first letter, then tap the last (no dragging needed);
//   • keyboard: arrows move, Enter/Space marks the start, then the end;
//     Escape cancels.
// No timer. Progress (seed, theme, level, found words, hints) is saved on this
// device only; the game works when storage is blocked. GA4 events go onto
// window.dataLayer (BaseLayout's gtag() isn't global): game_started once per
// page view, game_completed once per finished puzzle.

import {
  THEMES, LEVELS, LEVEL_ORDER, DEFAULT_THEME, generate, cellsOf, lineCells, matchSelection, hintFor, wordList, themeByKey,
  type Level, type Puzzle,
} from './wordSearch';

const STORE = 'vm-word-search-v1';
const GAME = 'word_search';

interface Saved { seed: number; theme: string; level: Level; found: string[]; hints: number; solved: number }

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
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h4l8 10h4M4 17h4l2.5-3.1M13.5 10.1 16 7h4M18 4l3 3-3 3M18 14l3 3-3 3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
};

export function mount(): void {
  const root = document.getElementById('ws');
  if (!root) return;
  const ctlEl = root.querySelector<HTMLElement>('#ws-controls');
  const boardEl = root.querySelector<HTMLElement>('#ws-board');
  const listEl = root.querySelector<HTMLElement>('#ws-words');
  const doneEl = root.querySelector<HTMLElement>('#ws-done');
  const live = root.querySelector<HTMLElement>('#ws-live');
  if (!ctlEl || !boardEl || !listEl || !doneEl || !live) return;

  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const saved = readJson<Saved>(STORE);
  let S: Saved = saved && LEVELS[saved.level] && typeof saved.seed === 'number'
    ? { ...saved, theme: themeByKey(saved.theme).key, found: saved.found ?? [], hints: saved.hints ?? 0, solved: saved.solved ?? 0 }
    : { seed: newSeed(), theme: DEFAULT_THEME, level: 'easy', found: [], hints: 0, solved: 0 };
  let puzzle: Puzzle = generate(S.theme, S.level, S.seed);
  let hintCell: [number, number] | null = null;
  let anchor: [number, number] | null = null; // keyboard / tap-tap start
  let drag: { start: [number, number]; last: [number, number]; moved: boolean } | null = null;
  let focus: [number, number] = [0, 0];
  let interacted = false;

  function newSeed(): number { return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0; }
  const persist = () => writeJson(STORE, S);
  const announce = (msg: string) => { live.textContent = ''; window.setTimeout(() => { live.textContent = msg; }, 40); };
  const started = () => { if (!interacted) { interacted = true; track('game_started', { resumed: S.found.length ? 1 : 0, level: S.level, theme: S.theme }, 'started'); } };
  const wordsLeft = () => puzzle.placements.length - S.found.length;
  const colorOf = (word: string) => wordList(puzzle).indexOf(word) % 8;

  // ── Controls ──
  function renderControls(): void {
    ctlEl!.innerHTML =
      `<div class="ws-ctl"><label class="ws-label" for="ws-theme">Theme</label><select id="ws-theme" class="ws-select">${THEMES.map((t) => `<option value="${t.key}"${t.key === S.theme ? ' selected' : ''}>${esc(t.label)}${t.optional ? ' (optional)' : ''}</option>`).join('')}</select></div>` +
      `<fieldset class="ws-ctl ws-levels"><legend class="ws-label">Difficulty</legend>${LEVEL_ORDER.map((lv) => `<button type="button" class="ws-level${lv === S.level ? ' is-on' : ''}" data-level="${lv}" aria-pressed="${lv === S.level}" title="${esc(LEVELS[lv].hint)}">${LEVELS[lv].label}</button>`).join('')}</fieldset>` +
      `<p class="ws-levelhint" id="ws-levelhint">${esc(LEVELS[S.level].hint)}</p>` +
      `<div class="ws-ctl ws-ctl--actions"><button type="button" class="ws-btn ws-btn-ghost" data-ws="hint"${wordsLeft() ? '' : ' disabled'}>${ICON.bulb} Hint</button><button type="button" class="ws-btn ws-btn-ghost" data-ws="new">${ICON.shuffle} New puzzle</button></div>`;
  }

  // ── Board ──
  function renderBoard(): void {
    const n = puzzle.size;
    const foundCells = new Map<string, number>();
    for (const p of puzzle.placements) if (S.found.includes(p.word)) for (const [r, c] of cellsOf(p)) foundCells.set(r + ',' + c, colorOf(p.word));
    const sel = new Set<string>();
    const a = drag ? drag.start : anchor;
    const b = drag ? drag.last : (anchor ? focus : null);
    if (a && b) { const line = lineCells(a, b); if (line) for (const [r, c] of line) sel.add(r + ',' + c); }
    let html = `<div class="ws-grid ws-grid--${S.level}" role="grid" aria-label="Word search grid, ${n} by ${n}. Arrow keys move; Enter marks the start and end of a word." style="--n:${n}">`;
    for (let r = 0; r < n; r++) {
      html += '<div role="row">';
      for (let c = 0; c < n; c++) {
        const k = r + ',' + c;
        const col = foundCells.get(k);
        const isHint = hintCell && hintCell[0] === r && hintCell[1] === c;
        const isFocus = focus[0] === r && focus[1] === c;
        const isAnchor = anchor && anchor[0] === r && anchor[1] === c;
        html += `<button type="button" role="gridcell" class="ws-cell${col !== undefined ? ' is-found ws-c' + col : ''}${sel.has(k) ? ' is-sel' : ''}${isHint ? ' is-hint' : ''}${isAnchor ? ' is-anchor' : ''}" data-r="${r}" data-c="${c}" tabindex="${isFocus ? 0 : -1}" aria-label="${puzzle.grid[r][c]}, row ${r + 1}, column ${c + 1}${col !== undefined ? ', part of a found word' : ''}${isHint ? ', hint: a word starts here' : ''}">${puzzle.grid[r][c]}</button>`;
      }
      html += '</div>';
    }
    boardEl!.innerHTML = html + '</div>';
  }

  // ── Word list + completion ──
  function renderList(): void {
    const words = wordList(puzzle);
    listEl!.innerHTML = `<p class="ws-progress"><strong>${S.found.length}</strong> of ${words.length} found${S.hints ? ` · ${S.hints} hint${S.hints === 1 ? '' : 's'} used` : ''}</p>` +
      `<ul class="ws-list" aria-label="Words to find">${words.map((w) => `<li class="${S.found.includes(w) ? 'is-found ws-c' + colorOf(w) : ''}">${S.found.includes(w) ? ICON.check : ''}<span>${w}</span>${S.found.includes(w) ? '<span class="ws-sr"> (found)</span>' : ''}</li>`).join('')}</ul>`;
    const done = wordsLeft() === 0;
    doneEl!.hidden = !done;
    doneEl!.innerHTML = done ? `<div class="ws-win"><span class="ws-win__star">${ICON.star}</span><h3 tabindex="-1">You found all ${words.length} words!</h3><p>${themeByKey(S.theme).label} · ${LEVELS[S.level].label}${S.hints ? ` · ${S.hints} hint${S.hints === 1 ? '' : 's'}` : ' · no hints'} · puzzles solved on this device: ${S.solved}</p><div class="ws-actions"><button type="button" class="ws-btn ws-btn-primary" data-ws="new">${ICON.shuffle} Another puzzle</button>${S.level !== 'hard' ? `<button type="button" class="ws-btn ws-btn-ghost" data-ws="harder">Try ${LEVELS[LEVEL_ORDER[LEVEL_ORDER.indexOf(S.level) + 1]].label}</button>` : ''}</div></div>` : '';
  }

  function renderAll(): void { renderControls(); renderBoard(); renderList(); }

  // ── Game actions ──
  function startPuzzle(theme: string, level: Level, seed = newSeed()): void {
    S = { ...S, theme, level, seed, found: [], hints: 0 };
    puzzle = generate(theme, level, seed);
    hintCell = null; anchor = null; drag = null; focus = [0, 0];
    persist(); renderAll();
    announce(`New ${LEVELS[level].label} puzzle: ${themeByKey(theme).label}. ${puzzle.placements.length} words to find.`);
  }

  function tryWord(a: [number, number], b: [number, number]): void {
    started();
    const hit = matchSelection(puzzle, a, b);
    anchor = null; drag = null;
    if (hit && !S.found.includes(hit.word)) {
      S.found.push(hit.word);
      if (hintCell && hintCell[0] === hit.row && hintCell[1] === hit.col) hintCell = null;
      focus = [hit.row, hit.col];
      const left = wordsLeft();
      if (left === 0) {
        S.solved++;
        track('game_completed', { level: S.level, theme: S.theme, hints: S.hints, words: puzzle.placements.length }, 'completed:' + S.seed);
      }
      persist(); renderAll();
      announce(left === 0 ? `${hit.word}! You found all the words.` : `Found ${hit.word}. ${left} to go.`);
      if (left === 0) { const h = doneEl!.querySelector<HTMLElement>('h3'); if (h) h.focus({ preventScroll: true }); if (!RM) doneEl!.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      else focusCell(focus);
    } else {
      renderAll();
      announce(hit ? `${hit.word} is already found.` : 'That is not one of the words. Try again.');
      flash();
      focusCell(focus);
    }
  }

  function flash(): void {
    boardEl!.classList.remove('is-miss'); void boardEl!.offsetWidth; boardEl!.classList.add('is-miss');
    window.setTimeout(() => boardEl!.classList.remove('is-miss'), 500);
  }

  function hint(): void {
    started();
    const h = hintFor(puzzle, S.found);
    if (!h) return;
    hintCell = h.cell; S.hints++; focus = h.cell; anchor = null;
    persist(); renderAll(); focusCell(focus);
    announce(`Hint: a word starts at the highlighted letter ${puzzle.grid[h.cell[0]][h.cell[1]]}, row ${h.cell[0] + 1}, column ${h.cell[1] + 1}.`);
  }

  const cellAt = (r: number, c: number) => boardEl!.querySelector<HTMLButtonElement>(`.ws-cell[data-r="${r}"][data-c="${c}"]`);
  function focusCell(rc: [number, number]): void { focus = rc; const el = cellAt(rc[0], rc[1]); if (el) { boardEl!.querySelectorAll<HTMLElement>('.ws-cell').forEach((e) => { e.tabIndex = -1; }); el.tabIndex = 0; el.focus({ preventScroll: true }); } }
  const rcOf = (el: Element | null): [number, number] | null => { const b = el?.closest<HTMLElement>('.ws-cell'); return b ? [+b.dataset.r!, +b.dataset.c!] : null; };

  // ── Pointer: drag, or tap–tap ──
  boardEl.addEventListener('pointerdown', (e) => {
    const rc = rcOf(e.target as Element); if (!rc) return;
    e.preventDefault();
    try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch { /* ignore */ }
    drag = { start: rc, last: rc, moved: false };
    renderBoard();
  });
  boardEl.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const rc = rcOf(document.elementFromPoint(e.clientX, e.clientY)); if (!rc) return;
    if (rc[0] !== drag.last[0] || rc[1] !== drag.last[1]) { drag.last = rc; drag.moved = true; renderBoard(); }
  });
  const endDrag = (e: PointerEvent) => {
    if (!drag) return;
    const rc = rcOf(document.elementFromPoint(e.clientX, e.clientY)) ?? drag.last;
    const d = drag; drag = null;
    if (d.moved && (rc[0] !== d.start[0] || rc[1] !== d.start[1])) { tryWord(d.start, rc); return; }
    // A tap (no movement): second tap completes a tap–tap selection, first tap sets the anchor.
    if (anchor && (anchor[0] !== d.start[0] || anchor[1] !== d.start[1])) { tryWord(anchor, d.start); return; }
    anchor = anchor && anchor[0] === d.start[0] && anchor[1] === d.start[1] ? null : d.start;
    focus = d.start; started(); renderBoard(); focusCell(focus);
    announce(anchor ? `Start marked at ${puzzle.grid[d.start[0]][d.start[1]]}. Now choose the last letter.` : 'Selection cleared.');
  };
  boardEl.addEventListener('pointerup', endDrag);
  boardEl.addEventListener('pointercancel', () => { drag = null; renderBoard(); });

  // ── Keyboard ──
  boardEl.addEventListener('keydown', (e) => {
    const rc = rcOf(e.target as Element); if (!rc) return;
    const n = puzzle.size; let [r, c] = rc;
    const moves: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1], Home: [0, -n], End: [0, n] };
    if (moves[e.key]) {
      e.preventDefault(); started();
      r = Math.min(n - 1, Math.max(0, r + moves[e.key][0])); c = Math.min(n - 1, Math.max(0, c + moves[e.key][1]));
      focus = [r, c]; if (anchor) renderBoard(); focusCell(focus);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!anchor) { anchor = rc; focus = rc; started(); renderBoard(); focusCell(rc); announce(`Start marked at ${puzzle.grid[r][c]}. Move to the last letter and press Enter.`); }
      else if (anchor[0] === rc[0] && anchor[1] === rc[1]) { anchor = null; renderBoard(); focusCell(rc); announce('Selection cleared.'); }
      else tryWord(anchor, rc);
    } else if (e.key === 'Escape' && anchor) {
      e.preventDefault(); anchor = null; renderBoard(); focusCell(rc); announce('Selection cleared.');
    }
  });

  // ── Controls ──
  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-ws],[data-level]');
    if (!t || !root.contains(t)) return;
    started();
    const lv = t.getAttribute('data-level') as Level | null;
    if (lv) { if (lv !== S.level) startPuzzle(S.theme, lv); return; }
    const act = t.getAttribute('data-ws');
    if (act === 'hint') hint();
    else if (act === 'new') startPuzzle(S.theme, S.level);
    else if (act === 'harder') startPuzzle(S.theme, LEVEL_ORDER[Math.min(2, LEVEL_ORDER.indexOf(S.level) + 1)]);
  });
  root.addEventListener('change', (e) => {
    const sel = (e.target as HTMLElement).closest<HTMLSelectElement>('#ws-theme');
    if (sel) { started(); startPuzzle(sel.value, S.level); }
  });

  renderAll();
}
