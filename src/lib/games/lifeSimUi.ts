// src/lib/games/lifeSimUi.ts — the Medicare Life Simulator's interface.
// Renders the engine's state (lifeSim.ts) into #ls and turns clicks into engine
// calls. All Medicare rules live in the engine; nothing here decides coverage.
//
// Conventions shared with the other games: no timers; every control is a real
// button; focus moves to the new month only after the player has interacted;
// a polite live region announces results; progress is saved on this device
// only; GA4 events go onto window.dataLayer (BaseLayout's gtag() isn't global).

import {
  createState, act, endMonth, fastForward, windowsAt, actions, report,
  monthLabel, monthOf, yearOf, MONTH_NAMES, TOTAL_MONTHS, PRICES,
  type SimState, type MonthSummary, type ActionId, type Report,
} from './lifeSim';

const STORE = 'vm-medicare-life-sim-v1';
const RUNS = 'vm-medicare-life-sim-runs-v1';
const GAME = 'medicare_life_simulator';

type Cell = 'work' | 'covered' | 'cobra' | 'gap';
interface Saved { sim: SimState; cells: Cell[]; drugCells: boolean[]; last: MonthSummary[] }
interface RunRecord { at: string; bPct: number; dPct: number; gap: number; uncovered: number; spent: number; coverage: string; protectedPath: boolean }

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const pct = (n: number) => Math.round(n * 100) + '%';
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

function readJson<T>(key: string): T | null {
  try { const raw = window.localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
}
function writeJson(key: string, v: unknown): void {
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage blocked — play still works */ }
}

// ── Analytics (product measurement; no personal data) ──
const sentOnce: Record<string, true> = {};
function track(name: string, params: Record<string, string | number>, once?: string): void {
  if (once) { if (sentOnce[once]) return; sentOnce[once] = true; }
  try {
    const dl = (window as unknown as { dataLayer?: { push: (...a: unknown[]) => void } }).dataLayer;
    if (!dl || typeof dl.push !== 'function') return;
    // gtag.js only processes an `arguments` object (an array is ignored), exactly as gtag() pushes it.
    // eslint-disable-next-line prefer-rest-params
    (function (..._args: unknown[]) { dl.push(arguments); })('event', name, { game_name: GAME, scenario_id: 'joe', ...params });
  } catch { /* analytics unavailable — keep playing */ }
}

const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>',
  cross: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.6" y="8.4" width="18.8" height="7.2" rx="3.6" transform="rotate(-45 12 12)"/><path d="M8.7 8.7l6.6 6.6"/></svg>',
};

const JOE_SVG = '<svg viewBox="-30 -95 60 100" aria-hidden="true"><ellipse cx="0" cy="0" rx="17" ry="5" fill="rgba(0,0,0,.15)"/><rect x="-9" y="-27" width="8" height="26" rx="3" fill="#1e293b"/><rect x="1" y="-27" width="8" height="26" rx="3" fill="#1e293b"/><path d="M-15 -25Q-15 -53 0 -55Q15 -53 15 -25Z" fill="#0f766e"/><circle cx="0" cy="-65" r="12" fill="#f1c27d"/><path d="M-13 -68Q-12 -81 0 -81Q12 -81 13 -68Z" fill="#1d4ed8"/><rect x="3" y="-71" width="16" height="4" rx="2" fill="#1d4ed8"/><circle cx="-4.5" cy="-65" r="3.4" fill="#fff" fill-opacity=".35" stroke="#0b2c45" stroke-width="1.4"/><circle cx="4.5" cy="-65" r="3.4" fill="#fff" fill-opacity=".35" stroke="#0b2c45" stroke-width="1.4"/><path d="M-1.1 -65h2.2" stroke="#0b2c45" stroke-width="1.4"/><path d="M-3.5 -58Q0 -55.5 3.5 -58" fill="none" stroke="#7c2d12" stroke-width="1.6" stroke-linecap="round"/></svg>';

const LESSONS = [
  'With group health coverage from current work, you can sign up for Part B while covered or within 8 months after the job or coverage ends — whichever comes first.',
  'COBRA isn’t group coverage from current work, and it doesn’t extend that 8-month window.',
  'After losing employer coverage (including COBRA), you have 2 full months to join a Medicare Advantage or drug plan.',
  'Going 63 days or more in a row without creditable drug coverage can mean a Part D penalty of 1% for each month.',
  'Medigap’s 6-month Open Enrollment Period starts the first month you have Part B and are 65 or older; after it, you may not be able to buy a policy, or it may cost more.',
  'Original Medicare has no yearly out-of-pocket limit. Medicare Advantage plans do, and the limit varies by plan.',
];

export function mount(): void {
  const root = document.getElementById('ls');
  if (!root) return;
  const topEl = root.querySelector<HTMLElement>('#ls-top');
  const lineEl = root.querySelector<HTMLElement>('#ls-line');
  const panelEl = root.querySelector<HTMLElement>('#ls-panel');
  const live = root.querySelector<HTMLElement>('#ls-live');
  if (!topEl || !lineEl || !panelEl || !live) return;

  const saved = readJson<Saved>(STORE);
  let sim: SimState = saved && saved.sim && typeof saved.sim.t === 'number' ? saved.sim : createState();
  let cells: Cell[] = saved?.cells ?? [];
  let drugCells: boolean[] = saved?.drugCells ?? [];
  let last: MonthSummary[] = saved?.last ?? [];
  let interacted = false;
  let busy = false;

  const persist = () => writeJson(STORE, { sim, cells, drugCells, last } satisfies Saved);
  const announce = (msg: string) => { live.textContent = ''; window.setTimeout(() => { live.textContent = msg; }, 40); };

  const cellFor = (s: SimState): Cell => s.employed ? 'work' : s.partB === 'active' ? 'covered' : s.cobra === 'active' ? 'cobra' : 'gap';
  const drugOk = (s: SimState) => (s.drug === 'employer' && s.employed) || s.drug === 'plan' || s.drug === 'ma';

  // ── Top: Joe's card + meters ──
  function renderTop(): void {
    const r = report(sim);
    const chip = (label: string, state: 'on' | 'off' | 'soon', detail: string) =>
      `<li class="ls-chip is-${state}"><span class="ls-chip-ic" aria-hidden="true">${state === 'on' ? ICON.check : state === 'soon' ? ICON.clock : ICON.cross}</span><span><strong>${label}</strong><em>${detail}</em></span></li>`;
    const pend = (k: string) => sim.pending.find((p) => p.kind === k);
    const drugPend = pend('drug') || pend('ma');
    const extraPend = pend('ma') || pend('medigap');
    topEl!.innerHTML =
      `<div class="ls-joe">${JOE_SVG}<div><p class="ls-k">Your client (fictional)</p><p class="ls-joe-name">Joe, 67</p><p class="ls-joe-sub">${sim.employed ? 'Still working' : 'Retired'} · ${esc(monthLabel(sim.t))}</p></div></div>` +
      `<ul class="ls-chips" aria-label="Joe’s coverage">` +
      chip('Work plan', sim.employed ? 'on' : 'off', sim.employed ? 'Group coverage from his job' : 'Ended June 30, Year 1') +
      (sim.cobra === 'active' || sim.cobra === 'offered' ? chip('COBRA', sim.cobra === 'active' ? 'on' : 'soon', sim.cobra === 'active' ? 'Medical only (story)' : 'Offer waiting') : '') +
      chip('Part A', 'on', 'Hospital insurance') +
      chip('Part B', sim.partB === 'active' ? 'on' : sim.partB === 'pending' ? 'soon' : 'off', sim.partB === 'active' ? 'Medical insurance' : sim.partB === 'pending' ? `Starts ${MONTH_NAMES[monthOf(sim.partBStart ?? 0)]}` : 'Not enrolled') +
      chip('Drug coverage', drugOk(sim) ? 'on' : drugPend ? 'soon' : 'off', sim.drug === 'employer' && sim.employed ? 'From work (creditable)' : sim.drug === 'plan' ? 'Medicare drug plan' : sim.drug === 'ma' ? 'In his Medicare Advantage plan' : drugPend ? `Starts ${MONTH_NAMES[monthOf(drugPend.start)]}` : 'None') +
      chip('Extra coverage', sim.extra !== 'none' ? 'on' : extraPend ? 'soon' : 'off', sim.extra === 'ma' ? 'Medicare Advantage' : sim.extra === 'medigap' ? (sim.medigapLate ? 'Medigap (higher price)' : 'Medigap') : extraPend ? `Starts ${MONTH_NAMES[monthOf(extraPend.start)]}` : 'None') +
      `</ul>` +
      `<ul class="ls-meters" aria-label="Consequences so far">` +
      `<li><span class="ls-k">Spent so far</span><strong id="ls-spent">${money(r.spent)}</strong><em>example dollars</em></li>` +
      `<li class="${r.partBPenaltyPct ? 'is-bad' : ''}"><span class="ls-k">Part B penalty</span><strong id="ls-bpen">${pct(r.partBPenaltyPct)}</strong><em>${sim.partB === 'none' && !sim.employed ? sim.bLateMonths + ' months without Part B' : 'added to premium'}</em></li>` +
      `<li class="${r.partDPenaltyPct || r.partDPendingPct ? 'is-bad' : ''}"><span class="ls-k">Part D penalty</span><strong id="ls-dpen">${pct(r.partDPenaltyPct)}</strong><em>${r.partDPendingPct ? 'building: +' + pct(r.partDPendingPct) : sim.drugGap ? sim.drugGap + '-month gap' : 'added to premium'}</em></li>` +
      `<li class="${r.gapMonths ? 'is-bad' : ''}"><span class="ls-k">Coverage gaps</span><strong id="ls-gaps">${r.gapMonths}</strong><em>months without doctor coverage</em></li>` +
      `</ul>`;
  }

  // ── Timeline ──
  function renderLine(): void {
    const items: string[] = [];
    for (let t = 0; t < TOTAL_MONTHS; t++) {
      const past = t < cells.length;
      const cur = t === sim.t && !sim.finished;
      const c = past ? cells[t] : '';
      const label = `${MONTH_NAMES[monthOf(t)]} Year ${yearOf(t)}${past ? ': ' + ({ work: 'work coverage', covered: 'Part B coverage', cobra: 'COBRA only', gap: 'no doctor coverage' } as Record<string, string>)[c] + (drugCells[t] ? '' : ', no drug coverage') : cur ? ': this month' : ''}`;
      items.push(`<li class="ls-cell${past ? ' is-' + c : ''}${cur ? ' is-now' : ''}${monthOf(t) === 0 ? ' is-jan' : ''}" title="${esc(label)}"><span class="ls-cell-m">${MONTH_NAMES[monthOf(t)].slice(0, 3)}</span>${past && !drugCells[t] ? '<span class="ls-cell-rx" aria-hidden="true"></span>' : ''}<span class="ls-sr">${esc(label)}</span></li>`);
    }
    lineEl!.innerHTML = `<ol class="ls-cells">${items.join('')}</ol>` +
      `<ul class="ls-legend" aria-hidden="true"><li class="is-work">Work plan</li><li class="is-covered">Part B</li><li class="is-cobra">COBRA only</li><li class="is-gap">No doctor coverage</li><li class="is-rx">No drug coverage</li></ul>`;
    const now = lineEl!.querySelector<HTMLElement>('.is-now');
    const ol = lineEl!.querySelector<HTMLElement>('.ls-cells');
    if (now && ol) ol.scrollLeft = Math.max(0, now.offsetLeft - ol.clientWidth / 2);
  }

  // ── Month panel ──
  function windowChips(): string {
    const w = windowsAt(sim);
    const chips: string[] = [];
    if (w.partB === 'sep') chips.push('Part B Special Enrollment Period');
    if (w.partB === 'gep') chips.push('General Enrollment Period (Part B)');
    if (w.planSep) chips.push('2-month window to join a plan');
    if (w.oe) chips.push('Open Enrollment (Oct 15 – Dec 7)');
    if (w.medigapOep) chips.push('Medigap Open Enrollment');
    return chips.length ? `<ul class="ls-windows" aria-label="Windows open this month">${chips.map((c) => `<li>${ICON.clock}${esc(c)}</li>`).join('')}</ul>` : '<p class="ls-muted">No enrollment windows are open this month.</p>';
  }

  // Premiums itemized by label so a late penalty is visible where it bites —
  // on the premium line — not only in the meter. Same label across months is
  // summed (a skipped stretch shows one line per premium kind).
  function premiumsHtml(prem: { label: string; amount: number }[]): string {
    const byLabel = new Map<string, number>();
    for (const p of prem) byLabel.set(p.label, (byLabel.get(p.label) ?? 0) + p.amount);
    const total = prem.reduce((a, p) => a + p.amount, 0);
    return `<p class="ls-sum-line">Premiums: ${money(total)}</p><ul class="ls-prem">${[...byLabel].map(([l, a]) => `<li class="${/penalty|late/.test(l) ? 'is-bad' : ''}"><span>${esc(l)}</span><strong>${money(a)}</strong></li>`).join('')}</ul>`;
  }

  function summaryHtml(list: MonthSummary[]): string {
    if (!list.length) return '';
    const total = list.reduce((a, m) => a + m.total, 0);
    const bills = list.flatMap((m) => m.bills.filter((b) => b.label !== 'Monthly prescription').map((b) => ({ ...b, t: m.t })));
    const rx = list.flatMap((m) => m.bills.filter((b) => b.label === 'Monthly prescription'));
    const prem = list.flatMap((m) => m.premiums);
    const head = list.length === 1 ? `Last month (${esc(monthLabel(list[0].t))})` : `${esc(monthLabel(list[0].t))} – ${esc(monthLabel(list[list.length - 1].t))}`;
    return `<div class="ls-sum"><p class="ls-sum-h"><span>${head}</span><strong>Joe paid ${money(total)}</strong></p>` +
      (bills.length ? `<ul class="ls-bills">${bills.map((b) => `<li class="is-${b.tone}"><strong>${esc(b.label)}</strong> — bill ${money(b.cost)}, Joe paid <strong>${money(b.paid)}</strong>. ${esc(b.how)}</li>`).join('')}</ul>` : '') +
      (rx.length ? `<p class="ls-sum-line">${ICON.pill}Prescriptions: ${money(rx.reduce((a, b) => a + b.paid, 0))}${rx.some((b) => b.tone === 'bad') ? ' — some months at full price (no drug coverage)' : ''}</p>` : '') +
      (prem.length ? premiumsHtml(prem) : '') + `</div>`;
  }

  function renderPanel(): void {
    if (sim.finished) { renderReport(); return; }
    const events = sim.log.filter((l) => l.t === sim.t && l.kind !== 'bill');
    const all = actions(sim);
    const open = all.filter((a) => a.enabled);
    const closed = all.filter((a) => !a.enabled);
    panelEl!.innerHTML =
      summaryHtml(last) +
      `<div class="ls-month"><p class="ls-k">Month ${sim.t + 1} of ${TOTAL_MONTHS}</p><h2 class="ls-month-h" tabindex="-1" data-focus>${esc(monthLabel(sim.t))}</h2>` +
      (events.length ? `<ul class="ls-events">${events.map((e) => `<li class="is-${e.tone} is-${e.kind}">${e.kind === 'decision' ? '<span class="ls-tag">Your decision</span>' : ''}${esc(e.text)}</li>`).join('')}</ul>` : '<p class="ls-muted">A quiet month.</p>') +
      `<h3 class="ls-sub">Open now</h3>${windowChips()}` +
      `<h3 class="ls-sub">Your choices this month</h3>` +
      (open.length ? `<div class="ls-acts">${open.map((a) => `<button type="button" class="ls-act" data-act="${a.id}"><strong>${esc(a.label)}</strong><span>${esc(a.desc)}</span></button>`).join('')}</div>` : '<p class="ls-muted">Nothing to decide this month.</p>') +
      (closed.length ? `<details class="ls-why"><summary>Why can’t Joe do something else right now? (${closed.length})</summary><ul>${closed.map((a) => `<li>${ICON.lock}<span><strong>${esc(a.label)}:</strong> ${esc(a.reason ?? '')}</span></li>`).join('')}</ul></details>` : '') +
      `<div class="ls-nav"><button type="button" class="ls-btn ls-btn-primary" data-nav="end">End ${MONTH_NAMES[monthOf(sim.t)]} <span aria-hidden="true">▶</span></button>` +
      `<button type="button" class="ls-btn ls-btn-ghost" data-nav="skip">Skip to the next event <span aria-hidden="true">⏩</span></button></div>` +
      `<p class="ls-note">All dollar amounts are illustrative examples, not real plan prices. Joe and his story are fictional.</p></div>`;
    if (interacted) panelEl!.querySelector<HTMLElement>('[data-focus]')?.focus({ preventScroll: true });
  }

  function renderReport(): void {
    const r: Report = report(sim);
    const runs = readJson<RunRecord[]>(RUNS) ?? [];
    const prev = runs.length > 1 ? runs[runs.length - 2] : null;
    const row = (label: string, now: string, before?: string, bad?: boolean) => `<tr class="${bad ? 'is-bad' : ''}"><th scope="row">${label}</th><td>${now}</td>${prev ? `<td>${before ?? ''}</td>` : ''}</tr>`;
    const verdict = r.protectedPath
      ? 'Joe is fully protected: no late penalties, no months without doctor coverage, and drug coverage in place.'
      : [
        r.partBPenaltyPct ? `A ${pct(r.partBPenaltyPct)} Part B penalty — usually for as long as he has Part B.` : '',
        r.partBStatus !== 'active' ? 'Joe ended the story without Part B.' : '',
        r.partDPenaltyPct ? `A ${pct(r.partDPenaltyPct)} Part D penalty — for as long as he has Medicare drug coverage.` : '',
        r.partDPendingPct ? `He still has no drug coverage — a penalty of about ${pct(r.partDPendingPct)} more is building.` : '',
        r.gapMonths ? `${r.gapMonths} month${r.gapMonths === 1 ? '' : 's'} without coverage for doctor and outpatient care.` : '',
      ].filter(Boolean).join(' ');
    panelEl!.innerHTML = summaryHtml(last) +
      `<div class="ls-report"><p class="ls-k">June, Year 3 · story complete</p><h2 class="ls-month-h" tabindex="-1" data-focus>Joe’s report card</h2>` +
      `<p class="ls-verdict ${r.protectedPath ? 'is-good' : 'is-warn'}">${esc(verdict)}</p>` +
      `<table class="ls-table"><thead><tr><th scope="col">Outcome</th><th scope="col">This run</th>${prev ? '<th scope="col">Previous run</th>' : ''}</tr></thead><tbody>` +
      row('Coverage at the end', esc(r.coverage), prev ? esc(prev.coverage) : '') +
      row('Part B late penalty', pct(r.partBPenaltyPct), prev ? pct(prev.bPct) : '', r.partBPenaltyPct > 0) +
      row('Part D late penalty', pct(r.partDPenaltyPct) + (r.partDPendingPct ? ` (+${pct(r.partDPendingPct)} building)` : ''), prev ? pct(prev.dPct) : '', r.partDPenaltyPct + r.partDPendingPct > 0) +
      row('Months without doctor coverage', String(r.gapMonths), prev ? String(prev.gap) : '', r.gapMonths > 0) +
      row('Bills with no coverage', money(r.uncovered), prev ? money(prev.uncovered) : '', r.uncovered > 0) +
      row('Total Joe paid (example $)', money(r.spent), prev ? money(prev.spent) : '') +
      `</tbody></table>` +
      `<h3 class="ls-sub">Your decisions</h3><ol class="ls-decisions">${r.decisions.length ? r.decisions.map((d) => `<li class="is-${d.tone}"><span>${esc(monthLabel(d.t))}</span>${esc(d.text)}</li>`).join('') : '<li>You didn’t make any enrollment decisions for Joe.</li>'}</ol>` +
      `<h3 class="ls-sub">What Medicare.gov says</h3><ul class="ls-lessons">${LESSONS.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` +
      `<div class="ls-nav"><button type="button" class="ls-btn ls-btn-primary" data-nav="again">Play again with different choices</button></div>` +
      `<p class="ls-note">Penalty percentages follow Medicare’s rules; dollar amounts are illustrative. For your own situation, check Medicare.gov or talk with a licensed agent.</p></div>`;
    if (interacted) panelEl!.querySelector<HTMLElement>('[data-focus]')?.focus({ preventScroll: true });
  }

  function renderAll(): void { renderTop(); renderLine(); renderPanel(); }

  // ── Turn handling ──
  function recordMonth(before: SimState): void {
    cells[before.t] = cellFor(before);
    drugCells[before.t] = drugOk(before);
  }

  function finishIfDone(): void {
    if (!sim.finished) return;
    const r = report(sim);
    const runs = readJson<RunRecord[]>(RUNS) ?? [];
    runs.push({ at: new Date().toISOString().slice(0, 10), bPct: r.partBPenaltyPct, dPct: r.partDPenaltyPct, gap: r.gapMonths, uncovered: r.uncovered, spent: r.spent, coverage: r.coverage, protectedPath: r.protectedPath });
    writeJson(RUNS, runs.slice(-5));
    track('game_stage_completed', { stage_id: 'year3', stage_name: 'Year 3', stage_number: 3 }, 'stage:year3');
    track('game_completed', { b_penalty_pct: Math.round(r.partBPenaltyPct * 100), d_penalty_pct: Math.round(r.partDPenaltyPct * 100), gap_months: r.gapMonths, protected: r.protectedPath ? 1 : 0 }, 'completed');
  }

  function yearEvents(from: number, to: number): void {
    for (let t = from; t <= to; t++) {
      if (monthOf(t) === 11) track('game_stage_completed', { stage_id: 'year' + yearOf(t), stage_name: 'Year ' + yearOf(t), stage_number: yearOf(t) }, 'stage:year' + yearOf(t));
    }
  }

  function endOne(): void {
    const before = sim;
    const r = endMonth(sim);
    recordMonth(before);
    sim = r.state; last = [r.summary];
    yearEvents(before.t, r.summary.t);
    finishIfDone(); persist(); renderAll();
    announce(sim.finished ? 'The story is complete. Joe’s report card is ready.' : `${monthLabel(sim.t)}. Last month Joe paid ${money(r.summary.total)}.`);
  }

  function skip(): void {
    const out = fastForward(sim);
    out.befores.forEach(recordMonth); // each skipped month's coverage, for the timeline
    yearEvents(sim.t, out.summaries[out.summaries.length - 1]?.t ?? sim.t);
    sim = out.state; last = out.summaries;
    finishIfDone(); persist(); renderAll();
    const paid = out.summaries.reduce((a, m) => a + m.total, 0);
    announce(sim.finished ? 'The story is complete. Joe’s report card is ready.' : `Skipped to ${monthLabel(sim.t)}. Joe paid ${money(paid)} over ${out.summaries.length} month${out.summaries.length === 1 ? '' : 's'}.`);
  }

  function restart(): void {
    sim = createState(); cells = []; drugCells = []; last = [];
    persist(); renderAll();
    announce('New story started: January, Year 1.');
  }

  root.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-act],[data-nav]');
    if (!el || !root.contains(el) || busy) return;
    busy = true;
    try {
      interacted = true;
      track('game_started', { resumed: sim.t > 0 ? 1 : 0 }, 'started');
      const id = el.getAttribute('data-act') as ActionId | null;
      const nav = el.getAttribute('data-nav');
      if (id) {
        const next = act(sim, id);
        if (next !== sim) { sim = next; persist(); renderAll(); const d = sim.log[sim.log.length - 1]; announce(d ? d.text : 'Done.'); }
      } else if (nav === 'end') endOne();
      else if (nav === 'skip') skip();
      else if (nav === 'again') restart();
    } finally { busy = false; }
  });

  // Keep the prices visible in one place for readers who want them.
  const priceEl = document.getElementById('ls-prices');
  if (priceEl) priceEl.textContent = `Example amounts used in the game: Part B premium ${money(PRICES.partB)}/month, drug plan ${money(PRICES.drugPlan)}/month, Medigap ${money(PRICES.medigap)}/month, Medicare Advantage ${money(PRICES.ma)}/month, COBRA ${money(PRICES.cobra)}/month.`;

  renderAll();
}
