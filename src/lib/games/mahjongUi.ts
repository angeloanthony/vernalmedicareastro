// src/lib/games/mahjongUi.ts — the Vernal Mahjong Solitaire interface over mahjong.ts.
//
// Tap a free tile, then tap its match; matching free tiles light up. Tapping a
// blocked tile explains why. Keyboard: arrows move between uncovered tiles,
// Enter/Space selects and matches, Escape clears. Free tiles are highlighted by
// default (toggle). Undo, Hint and Shuffle are unlimited and only counted.
// On narrow screens the board is drawn transposed (layout x runs down the
// screen) so tiles stay large; the rules live in layout coordinates, and the
// open sides are always the tile's long sides, so nothing changes for the
// player. Saved under vm-mahjong-v1; play continues when storage is blocked.
// GA4 via window.dataLayer: game_started, game_stage_completed (half cleared),
// game_completed — all with game_name 'mahjong_solitaire'.

import {
  LAYOUTS, LAYOUT_ORDER, DEFAULT_LAYOUT, layoutByKey, kindOf, tileSvg, FAMILIES, isCovered, presentOf, tilesLeft, isWon, applyMatch,
  undoMatch, availablePairs, isStuck, blockedReason, newGame, shuffle, validateState, matchKinds, isFree,
  type MahjongState, type Layout,
} from './mahjong';

const STORE = 'vm-mahjong-v1';
const GAME = 'mahjong_solitaire';
const HINT_MS = 2400;

interface Saved { v: 1; state: MahjongState; matches: number; hints: number; shuffles: number; undos: number; wins: number; highlight: boolean; halfSent: number | null }

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
  sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M6.3 17.7l2.8-2.8M14.9 9.1l2.8-2.8"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
};

/** One tile face as HTML (also used by the page for its sample tiles). Suit tiles lead with the numeral. */
export function faceHtml(kindId: string): string {
  const k = kindOf(kindId);
  const color = FAMILIES[k.family].color;
  const isSuit = k.family === 'dots' || k.family === 'bars' || k.family === 'leaves';
  return `<span class="mj-face mj-face--${k.family}" style="--kc:${color}" aria-hidden="true">` +
    (isSuit ? `<b class="mj-num">${k.mark}</b><span class="mj-ico">${tileSvg(k)}</span>` : `<span class="mj-ico mj-ico--big">${tileSvg(k)}</span>${k.family === 'wind' ? '' : `<b class="mj-word${k.mark.length > 6 ? ' mj-word--long' : ''}">${esc(k.mark)}</b>`}`) +
    `</span>`;
}

export function mount(): void {
  const root = document.getElementById('mj');
  if (!root) return;
  const ctlEl = root.querySelector<HTMLElement>('#mj-controls');
  const statusEl = root.querySelector<HTMLElement>('#mj-status');
  const msgEl = root.querySelector<HTMLElement>('#mj-msg');
  const frameEl = root.querySelector<HTMLElement>('#mj-frame');
  const boardEl = root.querySelector<HTMLElement>('#mj-board');
  const panelEl = root.querySelector<HTMLElement>('#mj-panel');
  const live = root.querySelector<HTMLElement>('#mj-live');
  if (!ctlEl || !statusEl || !msgEl || !frameEl || !boardEl || !panelEl || !live) return;

  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const newSeed = (): number => (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;

  // ── State ──────────────────────────────────────────────────────────────────
  const saved = readJson<Saved>(STORE);
  let S: Saved = saved && saved.v === 1 && validateState(saved.state)
    ? { v: 1, state: saved.state, matches: saved.matches ?? saved.state.moves.length, hints: saved.hints ?? 0, shuffles: saved.shuffles ?? 0, undos: saved.undos ?? 0, wins: saved.wins ?? 0, highlight: saved.highlight !== false, halfSent: typeof saved.halfSent === 'number' ? saved.halfSent : null }
    : { v: 1, state: newGame(DEFAULT_LAYOUT, newSeed()), matches: 0, hints: 0, shuffles: 0, undos: 0, wins: 0, highlight: true, halfSent: null };

  let sel: number | null = null;
  let hintPair: [number, number] | null = null; let hintIdx = 0; let hintTimer: number | null = null;
  let focusIdx: number | null = null;
  let message = '';
  let panel: 'none' | 'confirm-new' | 'confirm-same' | 'confirm-layout' | 'stuck' | 'won' = 'none';
  let pendingLayout = S.state.layout;
  let interacted = false;
  let transposed = false;

  const layout = (): Layout => layoutByKey(S.state.layout);
  const persist = () => writeJson(STORE, S);
  const announce = (msg: string) => { live.textContent = ''; window.setTimeout(() => { live.textContent = msg; }, 40); };
  const say = (msg: string) => { message = msg; renderStatus(); announce(msg); };
  const started = () => { if (!interacted) { interacted = true; track('game_started', { resumed: S.matches ? 1 : 0, layout: S.state.layout }, 'started'); } };
  const inProgress = () => S.matches > 0 && !isWon(S.state);
  const nameOf = (i: number) => kindOf(S.state.tiles[i]).label;

  // ── Geometry → pixels ──────────────────────────────────────────────────────
  // u = the tile's short side in px. Normal: tile is u × 1.3u, layout x runs across. Transposed: 1.3u × u, layout x runs down.
  let u = 48;
  const LIFT = 0.08;         // per-layer offset, in units of u
  const ASPECT = () => (transposed ? 1.18 : 1.3); // long side ÷ short side; a little squarer when transposed so eight rows fit a phone
  const tileW = () => (transposed ? ASPECT() * u : u);
  const tileH = () => (transposed ? u : ASPECT() * u);
  function px(i: number): { left: number; top: number } {
    const p = layout().positions[i]; const lift = p.z * LIFT * u;
    return transposed
      ? { left: (p.y / 2) * tileW() - lift, top: (p.x / 2) * tileH() - lift }
      : { left: (p.x / 2) * tileW() - lift, top: (p.y / 2) * tileH() - lift };
  }
  function sizeBoard(): void {
    const l = layout();
    const cs = getComputedStyle(frameEl!);
    const w = frameEl!.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); // the frame's content box
    if (!(w > 0)) return;
    transposed = window.innerWidth < 600;
    const maxU = 72, minU = 30;
    const acrossUnits = transposed ? (l.height / 2) * ASPECT() : l.width / 2; // in units of u
    const extra = (l.layers - 1) * LIFT;
    u = Math.max(minU, Math.min(maxU, Math.floor((w - 1) / (acrossUnits + extra))));
    const bw = Math.ceil((transposed ? (l.height / 2) * tileW() : (l.width / 2) * tileW()) + extra * u);
    const bh = Math.ceil((transposed ? (l.width / 2) * tileH() : (l.height / 2) * tileH()) + extra * u);
    boardEl!.style.setProperty('--tw', `${tileW()}px`); boardEl!.style.setProperty('--th', `${tileH()}px`); boardEl!.style.setProperty('--u', `${u}px`);
    boardEl!.style.width = `${bw}px`; boardEl!.style.height = `${bh}px`;
    boardEl!.style.paddingLeft = boardEl!.style.paddingTop = `${extra * u}px`;
    boardEl!.classList.toggle('is-transposed', transposed);
  }

  // ── Rendering ──────────────────────────────────────────────────────────────
  function renderBoard(): void {
    const hadFocus = boardEl!.contains(document.activeElement);
    const l = layout(); const P = l.positions; const present = presentOf(S.state);
    const selKind = sel !== null ? S.state.tiles[sel] : null;
    const order = P.map((_, i) => i).filter((i) => present[i]).sort((a, b) => P[a].z - P[b].z || P[a].y - P[b].y || P[a].x - P[b].x);
    let html = '';
    for (const i of order) {
      const p = P[i]; const { left, top } = px(i);
      const free = isFree(P, present, i); const covered = isCovered(P, present, i);
      const match = selKind !== null && sel !== i && free && matchKinds(selKind, S.state.tiles[i]);
      const cls = `mj-tile${free ? ' is-free' : ' is-blocked'}${covered ? ' is-covered' : ''}${sel === i ? ' is-selected' : ''}${match ? ' is-match' : ''}${hintPair && (hintPair[0] === i || hintPair[1] === i) ? ' is-hint' : ''}`;
      const label = `${nameOf(i)}, ${free ? 'free' : covered ? 'covered' : 'closed in'}${sel === i ? ', picked up' : match ? ', a match' : ''}`;
      html += `<button type="button" class="${cls}" data-i="${i}" style="left:${left}px;top:${top}px;z-index:${p.z * 100 + Math.round(p.y) + 1}" tabindex="-1" aria-label="${esc(label)}" aria-pressed="${sel === i}">${faceHtml(S.state.tiles[i])}</button>`;
    }
    boardEl!.innerHTML = html;
    boardEl!.classList.toggle('is-cleared', order.length === 0);
    boardEl!.setAttribute('aria-label', `${l.label} board, ${tilesLeft(S.state)} tiles left. Arrow keys move between tiles; Enter picks up or matches.`);
    applyFocus(hadFocus);
  }

  function renderControls(): void {
    const won = isWon(S.state);
    ctlEl!.innerHTML =
      `<fieldset class="mj-ctl mj-layouts"><legend class="mj-label">Layout</legend>` +
      LAYOUT_ORDER.map((k) => `<button type="button" class="mj-layout${k === S.state.layout ? ' is-on' : ''}" data-layout="${k}" aria-pressed="${k === S.state.layout}" title="${esc(LAYOUTS[k].hint)}">${LAYOUTS[k].label}</button>`).join('') +
      `</fieldset><p class="mj-layouthint">${esc(layout().hint)} · ${esc(layout().blurb)}</p>` +
      `<div class="mj-ctl mj-ctl--actions">` +
      `<button type="button" class="mj-btn mj-btn-ghost mj-toggle${S.highlight ? ' is-on' : ''}" data-mj="highlight" aria-pressed="${S.highlight}">${ICON.eye} Show free tiles</button>` +
      `<button type="button" class="mj-btn mj-btn-ghost" data-mj="undo"${S.state.moves.length && !won ? '' : ' disabled'}>${ICON.undo} Undo</button>` +
      `<button type="button" class="mj-btn mj-btn-ghost" data-mj="hint"${won ? ' disabled' : ''}>${ICON.bulb} Hint</button>` +
      `<button type="button" class="mj-btn mj-btn-ghost" data-mj="shuffle"${won ? ' disabled' : ''}>${ICON.sparkle} Shuffle</button>` +
      `<button type="button" class="mj-btn mj-btn-ghost" data-mj="same">${ICON.restart} Same layout</button>` +
      `<button type="button" class="mj-btn mj-btn-ghost" data-mj="new">${ICON.shuffle} New game</button>` +
      `</div>`;
    root!.classList.toggle('mj-nohl', !S.highlight);
  }

  function renderStatus(): void {
    const left = tilesLeft(S.state); const pairs = isWon(S.state) ? 0 : availablePairs(S.state).length;
    statusEl!.innerHTML = `<span><strong>${left}</strong> tile${left === 1 ? '' : 's'} left</span><span aria-hidden="true"> · </span><span><strong>${pairs}</strong> pair${pairs === 1 ? '' : 's'} available</span><span aria-hidden="true"> · </span><span><strong>${S.matches}</strong> move${S.matches === 1 ? '' : 's'}</span><span aria-hidden="true"> · </span><span><strong>${S.hints}</strong> hint${S.hints === 1 ? '' : 's'}</span><span aria-hidden="true"> · </span><span><strong>${S.shuffles}</strong> shuffle${S.shuffles === 1 ? '' : 's'}</span>` +
      (S.wins ? `<span aria-hidden="true"> · </span><span>${S.wins} win${S.wins === 1 ? '' : 's'} on this device</span>` : '');
    msgEl!.textContent = message || (S.matches ? '' : 'Tap a free tile, then tap its match. Free tiles are bright; tiles that are covered or closed in are dimmed.');
  }

  function renderPanel(): void {
    panelEl!.hidden = panel === 'none';
    if (panel === 'none') { panelEl!.innerHTML = ''; return; }
    if (panel === 'won') {
      const next = S.state.layout === 'garden' ? `<button type="button" class="mj-btn mj-btn-ghost" data-mj="layout-now" data-next="turtle">Try the Turtle</button>` : '';
      panelEl!.innerHTML = `<div class="mj-win"><span class="mj-win__star">${ICON.star}</span><h3 tabindex="-1">Board cleared!</h3><p>${esc(layout().label)} · ${S.matches} moves${S.hints ? ` · ${S.hints} hint${S.hints === 1 ? '' : 's'}` : ' · no hints'}${S.shuffles ? ` · ${S.shuffles} shuffle${S.shuffles === 1 ? '' : 's'}` : ' · no shuffles'}${S.undos ? ` · ${S.undos} undo${S.undos === 1 ? '' : 's'}` : ''} · wins on this device: ${S.wins}</p>` +
        `<div class="mj-actions"><button type="button" class="mj-btn mj-btn-primary" data-mj="new-now">${ICON.shuffle} Play again</button><button type="button" class="mj-btn mj-btn-ghost" data-mj="same-now">${ICON.restart} Same layout again</button>${next}</div></div>`;
      return;
    }
    if (panel === 'stuck') {
      panelEl!.innerHTML = `<div class="mj-note" role="group" aria-labelledby="mj-note-h"><h3 id="mj-note-h" tabindex="-1">No more matches</h3><p>No two free tiles match. Shuffle the remaining tiles (always finishable), undo, replay this layout, or start a new game.</p>` +
        `<div class="mj-actions"><button type="button" class="mj-btn mj-btn-primary" data-mj="shuffle">${ICON.sparkle} Shuffle</button><button type="button" class="mj-btn mj-btn-ghost" data-mj="undo"${S.state.moves.length ? '' : ' disabled'}>${ICON.undo} Undo</button><button type="button" class="mj-btn mj-btn-ghost" data-mj="same-now">${ICON.restart} Same layout</button><button type="button" class="mj-btn mj-btn-ghost" data-mj="new-now">${ICON.shuffle} New game</button></div></div>`;
      return;
    }
    const what = panel === 'confirm-same' ? 'Replay this layout from the start?' : panel === 'confirm-layout' ? `Switch to the ${LAYOUTS[pendingLayout].label} layout?` : 'Start a new game?';
    panelEl!.innerHTML = `<div class="mj-note" role="group" aria-labelledby="mj-note-h"><h3 id="mj-note-h" tabindex="-1">${esc(what)}</h3><p>Your current board will be lost.</p>` +
      `<div class="mj-actions"><button type="button" class="mj-btn mj-btn-primary" data-mj="${panel === 'confirm-same' ? 'same-now' : panel === 'confirm-layout' ? 'layout-now' : 'new-now'}" data-next="${esc(pendingLayout)}">${panel === 'confirm-same' ? 'Yes, replay' : panel === 'confirm-layout' ? 'Yes, switch' : 'Yes, new game'}</button><button type="button" class="mj-btn mj-btn-ghost" data-mj="cancel">Keep playing</button></div></div>`;
  }

  function renderAll(): void { renderControls(); renderStatus(); sizeBoard(); renderBoard(); renderPanel(); }

  // ── Focus (roving tabindex among present tiles) ────────────────────────────
  const elFor = (i: number) => boardEl!.querySelector<HTMLElement>(`.mj-tile[data-i="${i}"]`);
  function applyFocus(hadFocus: boolean): void {
    const present = presentOf(S.state); const P = layout().positions;
    let target = focusIdx !== null && present[focusIdx] ? elFor(focusIdx) : null;
    if (!target) {
      // nearest uncovered tile to where focus was, else the first free one
      const from = focusIdx !== null ? px(focusIdx) : { left: 0, top: 0 };
      let best: number | null = null; let bestD = Infinity;
      for (let i = 0; i < P.length; i++) { if (!present[i] || isCovered(P, present, i)) continue; const q = px(i); const d = Math.hypot(q.left - from.left, q.top - from.top); if (d < bestD) { bestD = d; best = i; } }
      target = best !== null ? elFor(best) : null;
    }
    boardEl!.querySelectorAll<HTMLElement>('.mj-tile').forEach((e) => { e.tabIndex = -1; });
    if (target) { target.tabIndex = 0; focusIdx = +target.dataset.i!; if (hadFocus) target.focus({ preventScroll: true }); } else focusIdx = null;
  }
  function moveFocus(i: number): void { focusIdx = i; boardEl!.querySelectorAll<HTMLElement>('.mj-tile').forEach((e) => { e.tabIndex = -1; }); const el = elFor(i); if (el) { el.tabIndex = 0; el.focus({ preventScroll: true }); announce(el.getAttribute('aria-label') ?? nameOf(i)); } }
  /** Nearest uncovered tile in a screen direction (what the player sees, so it also works transposed). */
  function neighbor(from: number, key: string): number | null {
    const P = layout().positions; const present = presentOf(S.state);
    const a = px(from); const ax = a.left + tileW() / 2, ay = a.top + tileH() / 2;
    let best: number | null = null; let bestCost = Infinity;
    for (let i = 0; i < P.length; i++) {
      if (i === from || !present[i] || isCovered(P, present, i)) continue;
      const b = px(i); const dx = b.left + tileW() / 2 - ax, dy = b.top + tileH() / 2 - ay;
      const vertical = key === 'ArrowUp' || key === 'ArrowDown';
      const sign = key === 'ArrowLeft' || key === 'ArrowUp' ? -1 : 1;
      const primary = sign * (vertical ? dy : dx), lateral = Math.abs(vertical ? dx : dy);
      if (primary < 2) continue;
      const cost = primary + 2.5 * lateral;
      if (cost < bestCost) { bestCost = cost; best = i; }
    }
    return best;
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function clearHint(): void { hintPair = null; if (hintTimer) { window.clearTimeout(hintTimer); hintTimer = null; } }
  function afterChange(): void {
    sel = null; clearHint(); hintIdx = 0;
    if (isWon(S.state)) { S.wins++; panel = 'won'; track('game_completed', { layout: S.state.layout, moves: S.matches, hints: S.hints, shuffles: S.shuffles, undos: S.undos }, 'completed:' + S.state.seed); }
    else if (isStuck(S.state)) panel = 'stuck';
    else if (panel === 'stuck') panel = 'none';
    const total = layout().positions.length;
    if (!isWon(S.state) && S.halfSent !== S.state.seed && tilesLeft(S.state) <= total / 2) { S.halfSent = S.state.seed; track('game_stage_completed', { layout: S.state.layout, stage_id: 'half', stage_name: 'Half the tiles cleared', moves: S.matches }, 'half:' + S.state.seed); }
    persist(); renderAll();
    if (panel === 'won' || panel === 'stuck') { const h = panelEl!.querySelector<HTMLElement>('h3'); if (h) h.focus({ preventScroll: true }); }
  }
  function pick(i: number): void {
    started();
    if (panel !== 'none' && panel !== 'stuck') { panel = 'none'; renderPanel(); }
    const reason = blockedReason(S.state, i);
    if (reason) { const el = elFor(i); if (el && !RM) { el.classList.remove('is-shake'); void el.offsetWidth; el.classList.add('is-shake'); } say(`${nameOf(i)}: ${reason.replace('That tile is ', '')}`); return; }
    if (sel === null) { sel = i; focusIdx = i; clearHint(); renderBoard(); const n = availablePairs(S.state).filter(([a, b]) => a === i || b === i).length; say(`Picked up ${nameOf(i)}. ${n ? `${n} match${n === 1 ? '' : 'es'} available — it lights up.` : 'No free match right now; pick another tile.'}`); return; }
    if (sel === i) { sel = null; renderBoard(); say('Put the tile back.'); return; }
    const next = applyMatch(S.state, sel, i);
    if (next) {
      const name = nameOf(i); const other = nameOf(sel);
      S.state = next; S.matches++;
      focusIdx = i; afterChange();
      if (isWon(S.state)) say(`Matched ${other} with ${name}. Board cleared in ${S.matches} moves!`);
      else if (panel === 'stuck') say(`Matched ${other} with ${name}. No more matches — shuffle, undo, or start again.`);
      else say(`Matched ${other} with ${name}. ${tilesLeft(S.state)} tiles left.`);
      return;
    }
    // a free, non-matching tile: move the selection there
    const was = nameOf(sel); sel = i; focusIdx = i; renderBoard();
    say(`${nameOf(i)} does not match ${was}. Picked up ${nameOf(i)} instead.`);
  }
  function undo(): void {
    started();
    const prev = undoMatch(S.state); if (!prev) return;
    const [a] = S.state.moves[S.state.moves.length - 1];
    S.state = prev; S.matches = Math.max(0, S.matches - 1); S.undos++; focusIdx = a;
    panel = 'none'; afterChange(); say('Undid your last match.');
  }
  function hint(): void {
    started();
    if (isWon(S.state)) return;
    const pairs = availablePairs(S.state);
    sel = null; clearHint();
    S.hints++;
    if (!pairs.length) { persist(); renderAll(); say('No matches are left. Shuffle the remaining tiles or undo.'); return; }
    hintPair = pairs[hintIdx % pairs.length]; hintIdx++;
    focusIdx = hintPair[0];
    persist(); renderControls(); renderStatus(); renderBoard();
    say(`Hint: ${nameOf(hintPair[0])} matches ${nameOf(hintPair[1])}. ${pairs.length} pair${pairs.length === 1 ? '' : 's'} available.`);
    hintTimer = window.setTimeout(() => { hintTimer = null; hintPair = null; renderBoard(); }, HINT_MS);
  }
  function doShuffle(): void {
    started();
    if (isWon(S.state)) return;
    S.state = shuffle(S.state, newSeed()).state; S.shuffles++;
    panel = 'none'; afterChange();
    say(`Shuffled the ${tilesLeft(S.state)} remaining tiles. ${availablePairs(S.state).length} pairs available.`);
  }
  function startGame(layoutKey: string, seed: number, note: string): void {
    clearHint();
    S = { ...S, state: newGame(layoutKey, seed), matches: 0, hints: 0, shuffles: 0, undos: 0, halfSent: null };
    sel = null; panel = 'none'; focusIdx = null; message = ''; hintIdx = 0;
    persist(); renderAll(); say(note);
  }

  // ── Events ─────────────────────────────────────────────────────────────────
  boardEl.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.mj-tile');
    if (!el || !boardEl.contains(el)) return;
    pick(+el.dataset.i!);
  });
  boardEl.addEventListener('keydown', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('.mj-tile');
    if (!el) return;
    const i = +el.dataset.i!;
    if (e.key === 'Escape') { if (sel !== null) { e.preventDefault(); sel = null; renderBoard(); say('Put the tile back.'); } return; }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault(); started();
      const n = neighbor(i, e.key); if (n !== null) moveFocus(n);
    }
  });
  root.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-mj],[data-layout]');
    if (!t || !root.contains(t) || (t as HTMLButtonElement).disabled) return;
    started();
    const lk = t.getAttribute('data-layout');
    if (lk) {
      if (lk === S.state.layout) return;
      pendingLayout = lk;
      if (inProgress()) { panel = 'confirm-layout'; renderPanel(); panelEl.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true }); }
      else startGame(lk, newSeed(), `New ${LAYOUTS[lk].label} board: ${LAYOUTS[lk].positions.length} tiles.`);
      return;
    }
    const act = t.getAttribute('data-mj');
    if (act === 'highlight') { S.highlight = !S.highlight; persist(); renderControls(); say(S.highlight ? 'Free tiles are highlighted.' : 'Highlighting off. All tiles look the same until you pick one up.'); }
    else if (act === 'undo') undo();
    else if (act === 'hint') hint();
    else if (act === 'shuffle') doShuffle();
    else if (act === 'new') { if (inProgress()) { panel = 'confirm-new'; renderPanel(); panelEl.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true }); } else startGame(S.state.layout, newSeed(), 'New board dealt.'); }
    else if (act === 'same') { if (inProgress()) { panel = 'confirm-same'; renderPanel(); panelEl.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true }); } else startGame(S.state.layout, S.state.seed, 'Same layout, from the start.'); }
    else if (act === 'new-now') startGame(S.state.layout, newSeed(), 'New board dealt.');
    else if (act === 'same-now') startGame(S.state.layout, S.state.seed, 'Same layout, from the start.');
    else if (act === 'layout-now') { const k = t.getAttribute('data-next') || pendingLayout; startGame(k, newSeed(), `New ${LAYOUTS[k].label} board: ${LAYOUTS[k].positions.length} tiles.`); }
    else if (act === 'cancel') { panel = 'none'; renderPanel(); }
  });

  let lastW = 0;
  const onResize = () => { const w = frameEl!.clientWidth; if (w !== lastW) { lastW = w; sizeBoard(); renderBoard(); } };
  if (typeof ResizeObserver === 'function') new ResizeObserver(onResize).observe(frameEl); else window.addEventListener('resize', onResize);

  if (isWon(S.state)) panel = 'won'; else if (isStuck(S.state)) panel = 'stuck';
  persist();
  renderAll();
  lastW = frameEl.clientWidth;
}
