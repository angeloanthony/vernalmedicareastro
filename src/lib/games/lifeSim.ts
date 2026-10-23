// src/lib/games/lifeSim.ts — rules engine for the Medicare Life Simulator.
//
// Pure functions over a plain state object: no DOM, no storage, no randomness,
// so every Medicare rule the game teaches is unit-tested (tests/life-sim.test.ts).
// The page's UI (lifeSimUi.ts) only renders state and calls these functions.
//
// Scenario: Joe, 67, still working with employer group coverage, retires at the
// end of June in Year 1. One turn = one calendar month, January Year 1 through
// June Year 3 (30 turns).
//
// The RULES are real and were checked against Medicare.gov (2026-10-23):
//   - Part B Special Enrollment Period (SEP): while covered by group health
//     coverage from current work, or within 8 months after the job or coverage
//     ends; COBRA doesn't count and doesn't extend it. Coverage generally starts
//     the first month after sign-up.
//   - General Enrollment Period: Jan 1 – Mar 31; coverage starts the month after
//     sign-up; a late penalty may apply. No spring window to join plans after it.
//   - Losing employer coverage (including COBRA ending): 2 full months after the
//     month coverage ends to join a Medicare Advantage or drug plan; coverage
//     generally starts the first of the month after the request.
//   - Open Enrollment: Oct 15 – Dec 7; changes start January 1.
//   - Medicare Advantage needs Part A AND Part B; a drug plan needs A or B.
//   - Medigap Open Enrollment: 6 months from the first month you have Part B and
//     are 65+; afterwards you may not be able to buy one, or it may cost more.
//     Medigap works only with Original Medicare.
//   - Part B penalty: 10% for each full 12 months without it (via the site's
//     penalty calculator). Part D penalty: 1% per month after 63+ days in a row
//     without creditable drug coverage (via the site's penalty calculator).
//     With monthly turns, a 2-month gap (≤ 62 days) has no penalty; 3+ does.
//   - Original Medicare: yearly Part B deductible then usually 20% coinsurance,
//     a Part A deductible per hospital benefit period, no yearly cap. Medicare
//     Advantage plans have a yearly out-of-pocket limit that varies by plan.
//
// The MONEY is illustrative (PRICES / SHARE below) — round example amounts,
// labelled as such in the UI, so nothing goes stale each year. The story facts
// (Joe's retirement date, his COBRA offer covering medical care only, COBRA
// ending in December of Year 2, his employer's creditable-coverage notice) are
// fictional premises, not Medicare rules.

import { computePartBPenalty, computePartDPenalty } from '../calculators/penalty';
import { figuresFor } from '../../data/annualMedicareData';

const FIGURES = figuresFor(2026); // percentages only; dollar amounts are illustrative

export const TOTAL_MONTHS = 30;
export const LAST_WORK_MONTH = 5; // June, Year 1
export const SEP_LAST_MONTH = LAST_WORK_MONTH + 8; // February, Year 2
export const COBRA_LAST_MONTH = 23; // December, Year 2 (story)
export const RX_FROM = 10; // November, Year 1: a new daily prescription

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Illustrative monthly prices (example dollars, not real plan prices). */
export const PRICES = { partB: 200, drugPlan: 40, medigap: 150, medigapLate: 260, ma: 20, cobra: 650 } as const;
/** Illustrative cost sharing. */
export const SHARE = {
  partBDeductible: 250,
  coinsurance: 0.2,
  partADeductible: 1600,
  maShare: 0.15,
  maHospitalCopay: 1500,
  maOopLimit: 5000,
  workCopay: 30,
  cobraCopay: 30,
  rxCost: 300,
  rxCopay: 40,
} as const;

export type CareKind = 'A' | 'B';
export interface CareEvent { t: number; kind: CareKind; cost: number; label: string }
/** Joe's health-care bills over the story (example list prices). */
export const CARE: CareEvent[] = [
  { t: 2, kind: 'B', cost: 300, label: 'Yearly checkup' },
  { t: 8, kind: 'B', cost: 600, label: 'Specialist visits for his knee' },
  { t: 13, kind: 'B', cost: 8000, label: 'Outpatient knee surgery' },
  { t: 21, kind: 'A', cost: 15000, label: 'Hospital stay (pneumonia)' },
  { t: 27, kind: 'B', cost: 1200, label: 'Physical therapy' },
];

export type Tone = 'good' | 'warn' | 'bad' | 'info';
export interface LogEntry { t: number; kind: 'event' | 'decision' | 'bill'; text: string; tone: Tone }

export interface SimState {
  t: number;
  finished: boolean;
  employed: boolean;
  cobra: 'none' | 'offered' | 'active' | 'declined' | 'dropped' | 'ended';
  /** Last month of each lost employer-based coverage (job, then COBRA). */
  coverageEnded: number[];
  partB: 'none' | 'pending' | 'active';
  partBStart: number | null;
  partBVia: 'work' | 'sep' | 'gep' | null;
  drug: 'employer' | 'none' | 'plan' | 'ma';
  extra: 'none' | 'medigap' | 'ma';
  pending: { kind: 'drug' | 'ma' | 'medigap'; start: number; late?: boolean }[];
  medigapLate: boolean;
  spent: number;
  uncovered: number;
  bDedUsed: Record<number, number>;
  maOop: Record<number, number>;
  /** Months without Part B since his work coverage ended (the penalty clock). */
  bLateMonths: number;
  bPenaltyPct: number;
  /** Current run of months without creditable drug coverage. */
  drugGap: number;
  dPenaltyMonths: number;
  /** Months with no coverage for doctor and outpatient care. */
  gapMonths: number;
  log: LogEntry[];
}

export const yearOf = (t: number) => Math.floor(t / 12) + 1;
export const monthOf = (t: number) => t % 12;
export const monthLabel = (t: number) => `${MONTH_NAMES[monthOf(t)]}, Year ${yearOf(t)}`;
const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

export function createState(): SimState {
  const s: SimState = {
    t: 0, finished: false, employed: true, cobra: 'none', coverageEnded: [],
    partB: 'none', partBStart: null, partBVia: null,
    drug: 'employer', extra: 'none', pending: [], medigapLate: false,
    spent: 0, uncovered: 0, bDedUsed: {}, maOop: {},
    bLateMonths: 0, bPenaltyPct: 0, drugGap: 0, dPenaltyMonths: 0, gapMonths: 0, log: [],
  };
  enterMonth(s);
  return s;
}

const clone = (s: SimState): SimState => JSON.parse(JSON.stringify(s));
const note = (s: SimState, kind: LogEntry['kind'], text: string, tone: Tone = 'info') => { s.log.push({ t: s.t, kind, text, tone }); };

// ── Enrollment windows ─────────────────────────────────────────────────────

export interface Windows {
  /** How Joe could sign up for Part B this month, if at all. */
  partB: 'work' | 'sep' | 'gep' | null;
  /** 2 full months after losing employer coverage (incl. COBRA): join MA or a drug plan. */
  planSep: boolean;
  /** Open Enrollment (Oct 15 – Dec 7). */
  oe: boolean;
  /** Medigap Open Enrollment (6 months from the first month with Part B, 65+). */
  medigapOep: boolean;
}

export function windowsAt(s: SimState): Windows {
  const m = monthOf(s.t);
  let partB: Windows['partB'] = null;
  if (s.partB === 'none') {
    if (s.employed) partB = 'work';
    else if (s.t > LAST_WORK_MONTH && s.t <= SEP_LAST_MONTH) partB = 'sep';
    else if (m <= 2) partB = 'gep';
  }
  const planSep = s.coverageEnded.some((e) => s.t - e === 1 || s.t - e === 2);
  const medigapOep = s.partB === 'active' && s.partBStart !== null && s.t >= s.partBStart && s.t <= s.partBStart + 5;
  return { partB, planSep, oe: m >= 9, medigapOep };
}

/** First month a plan joined this month would start. */
function planStart(s: SimState, w: Windows): number {
  return w.planSep ? s.t + 1 : s.t - monthOf(s.t) + 12; // SEP: next month; Open Enrollment: January 1
}

// ── Actions ────────────────────────────────────────────────────────────────

export type ActionId = 'signupB' | 'acceptCobra' | 'declineCobra' | 'dropCobra' | 'joinDrug' | 'joinMA' | 'buyMedigap';
export interface ActionInfo { id: ActionId; label: string; desc: string; enabled: boolean; reason?: string }

const hasPending = (s: SimState, kind: 'drug' | 'ma' | 'medigap') => s.pending.some((p) => p.kind === kind);

export function actions(s: SimState): ActionInfo[] {
  if (s.finished) return [];
  const w = windowsAt(s);
  const list: ActionInfo[] = [];
  const planWindowReason = 'Plans can only be joined in a window: the 2 full months after losing employer coverage (including COBRA), or Open Enrollment (October 15 – December 7).';

  if (s.partB === 'none') {
    list.push({
      id: 'signupB', label: 'Sign up for Part B',
      desc: w.partB === 'work' ? 'He can — but his work plan already covers him, so he’d start paying the Part B premium early.'
        : w.partB === 'sep' ? 'His Special Enrollment Period is open. Coverage generally starts next month.'
        : 'General Enrollment Period (January 1 – March 31). Coverage starts the month after he signs up.',
      enabled: w.partB !== null,
      reason: 'Part B sign-up is closed this month. His Special Enrollment Period ended 8 months after his job ended; the next chance is the General Enrollment Period, January 1 – March 31.',
    });
  }
  if (s.cobra === 'offered') {
    list.push({ id: 'acceptCobra', label: 'Accept COBRA', desc: `Keep his old plan’s medical coverage for about ${money(PRICES.cobra)} a month (example).`, enabled: true });
    list.push({ id: 'declineCobra', label: 'Decline COBRA', desc: 'Don’t continue the old employer plan.', enabled: true });
  }
  if (s.cobra === 'active') {
    list.push({ id: 'dropCobra', label: 'Drop COBRA', desc: 'End COBRA coverage at the end of this month.', enabled: true });
  }
  if (s.drug !== 'plan' && s.drug !== 'ma' && !hasPending(s, 'drug') && !hasPending(s, 'ma')) {
    const blocked = s.employed ? 'He already has creditable drug coverage from work.'
      : s.extra === 'ma' ? 'His Medicare Advantage plan includes drug coverage.'
      : !(w.planSep || w.oe) ? planWindowReason : undefined;
    list.push({
      id: 'joinDrug', label: 'Join a Medicare drug plan (Part D)',
      desc: w.planSep ? 'His window after losing employer coverage is open. Coverage starts next month.' : 'Open Enrollment: coverage starts January 1.',
      enabled: !blocked, reason: blocked,
    });
  }
  if (s.extra === 'none' && !hasPending(s, 'ma') && !hasPending(s, 'medigap')) {
    const blocked = s.partB === 'none' ? 'Medicare Advantage requires both Part A and Part B — Joe doesn’t have Part B yet.'
      : !(w.planSep || w.oe) ? planWindowReason : undefined;
    list.push({
      id: 'joinMA', label: 'Join a Medicare Advantage plan (with drug coverage)',
      desc: `An all-in-one private plan with a yearly out-of-pocket limit (example: ${money(SHARE.maOopLimit)}). ${w.planSep ? 'Starts next month.' : 'Starts January 1.'}`,
      enabled: !blocked, reason: blocked,
    });
    const mgBlocked = s.partB !== 'active' ? 'Medigap works with Original Medicare — Joe needs Part B in effect first.' : undefined;
    list.push({
      id: 'buyMedigap', label: 'Buy a Medigap policy',
      desc: w.medigapOep ? `His Medigap Open Enrollment Period is open: insurers can’t deny him for pre-existing conditions. About ${money(PRICES.medigap)} a month (example).`
        : 'Outside his Medigap Open Enrollment Period, he may not be able to buy a policy, or it may cost more.',
      enabled: !mgBlocked, reason: mgBlocked,
    });
  }
  return list;
}

/** Apply one decision during the current month. Returns a new state. */
export function act(prev: SimState, id: ActionId): SimState {
  const s = clone(prev);
  const info = actions(s).find((a) => a.id === id);
  if (!info || !info.enabled) return prev;
  const w = windowsAt(s);
  switch (id) {
    case 'signupB': {
      s.partB = 'pending'; s.partBStart = s.t + 1; s.partBVia = w.partB;
      if (w.partB === 'work') note(s, 'decision', 'Signed up for Part B while still working. It starts next month — and so does the Part B premium, even though his work plan still covers him. The Special Enrollment Period would have let him wait.', 'info');
      else if (w.partB === 'sep') note(s, 'decision', 'Signed up for Part B in his Special Enrollment Period. No late penalty, and coverage starts next month.', 'good');
      else note(s, 'decision', 'Signed up for Part B in the General Enrollment Period. Coverage starts next month. Because he missed his Special Enrollment Period, a late penalty may be added to his Part B premium.', 'warn');
      break;
    }
    case 'acceptCobra':
      s.cobra = 'active';
      note(s, 'decision', 'Accepted COBRA. It keeps his old plan’s medical coverage — but COBRA isn’t group coverage from current work, and getting COBRA doesn’t change when his Part B Special Enrollment Period ends.', 'warn');
      break;
    case 'declineCobra':
      s.cobra = 'declined';
      note(s, 'decision', 'Declined COBRA.', 'info');
      break;
    case 'dropCobra':
      s.cobra = 'dropped'; s.coverageEnded.push(s.t);
      note(s, 'decision', 'Dropped COBRA at the end of this month. Losing it opens a 2-month window to join a Medicare Advantage or drug plan.', 'info');
      break;
    case 'joinDrug': {
      const start = planStart(s, w);
      s.pending.push({ kind: 'drug', start });
      note(s, 'decision', `Joined a Medicare drug plan. Coverage starts ${monthLabel(start)}.`, 'good');
      break;
    }
    case 'joinMA': {
      const start = planStart(s, w);
      s.pending.push({ kind: 'ma', start });
      note(s, 'decision', `Joined a Medicare Advantage plan with drug coverage. Coverage starts ${monthLabel(start)}.`, 'good');
      break;
    }
    case 'buyMedigap': {
      const late = !w.medigapOep;
      s.pending.push({ kind: 'medigap', start: s.t + 1, late });
      note(s, 'decision', late
        ? 'Applied for Medigap after his Medigap Open Enrollment Period. Insurers may turn him down or charge more — in this story, he’s accepted at a higher price.'
        : 'Bought a Medigap policy during his Medigap Open Enrollment Period — no health questions could stop him.', late ? 'warn' : 'good');
      break;
    }
  }
  return s;
}

// ── Time ───────────────────────────────────────────────────────────────────

const creditableDrug = (s: SimState) => (s.drug === 'employer' && s.employed) || s.drug === 'plan' || s.drug === 'ma';

/** Start-of-month changes: story events, coverage that begins, windows that open or close. */
function enterMonth(s: SimState): void {
  const t = s.t;
  if (t === 0) note(s, 'event', 'Meet Joe: 67, still working, covered by his employer’s group health plan (with drug coverage his employer says is creditable). He has premium-free Part A, but not Part B.', 'info');
  if (t === 2) note(s, 'event', 'Joe tells his boss he’ll retire at the end of June. His work coverage ends June 30.', 'info');
  if (t === LAST_WORK_MONTH + 1) {
    s.employed = false;
    if (s.drug === 'employer') s.drug = 'none';
    s.coverageEnded.push(LAST_WORK_MONTH);
    s.cobra = 'offered';
    note(s, 'event', 'Joe has retired. His work coverage ended June 30. A COBRA offer arrives (in this story it covers medical care only, for about $650 a month).', 'info');
    note(s, 'event', 'Clocks started: his Part B Special Enrollment Period runs through February, Year 2 (8 months). His window to join a Medicare Advantage or drug plan runs through August (2 full months).', 'warn');
  }
  if (t === 8 && s.cobra === 'offered') { s.cobra = 'declined'; note(s, 'event', 'The COBRA offer letter’s deadline passed.', 'info'); }
  if (t === RX_FROM) note(s, 'event', 'Joe’s doctor starts him on a daily prescription (example list price: $300 a month).', 'info');
  if (monthOf(t) === 9) note(s, 'event', 'Open Enrollment is here (October 15 – December 7): join or switch Medicare Advantage or drug plans for January 1.', 'info');
  if (t === SEP_LAST_MONTH && s.partB === 'none') note(s, 'event', 'Last month of Joe’s Part B Special Enrollment Period.', 'warn');
  if (t === SEP_LAST_MONTH + 1 && s.partB === 'none') note(s, 'event', 'Joe’s Part B Special Enrollment Period has ended. Without it, he’ll have to wait for a General Enrollment Period (January 1 – March 31) — and may owe a late penalty.', 'bad');
  if (s.cobra === 'active' && t === COBRA_LAST_MONTH + 1) {
    s.cobra = 'ended'; s.coverageEnded.push(COBRA_LAST_MONTH);
    note(s, 'event', 'Joe’s COBRA coverage ended December 31 (in this story). Losing it opens a 2-month window to join a Medicare Advantage or drug plan — but not a Part B Special Enrollment Period.', 'warn');
  }

  // Coverage that starts this month.
  if (s.partB === 'pending' && s.partBStart === t) {
    s.partB = 'active';
    s.bPenaltyPct = s.partBVia === 'gep' ? computePartBPenalty(s.bLateMonths, FIGURES).penaltyPct : 0;
    note(s, 'event', s.bPenaltyPct > 0
      ? `Part B is active. He went ${s.bLateMonths} months without it after his work coverage ended, so a ${Math.round(s.bPenaltyPct * 100)}% late penalty is added to his Part B premium — usually for as long as he has Part B.`
      : s.partBVia === 'gep' && s.bLateMonths > 0
        ? `Part B is active. He went ${s.bLateMonths} months without it — under a full 12 months, so no late penalty, but those months had no Part B coverage.`
        : 'Part B is active.', s.bPenaltyPct > 0 ? 'bad' : 'good');
  }
  for (const p of s.pending.filter((x) => x.start === t)) {
    if (p.kind === 'drug' || p.kind === 'ma') {
      if (s.drugGap >= 3) {
        s.dPenaltyMonths += s.drugGap;
        const pct = Math.round(computePartDPenalty(s.dPenaltyMonths, FIGURES).penaltyPct * 100);
        note(s, 'event', `Drug coverage starts. He went ${s.drugGap} months in a row without creditable drug coverage (63 days or more), so a ${pct}% late penalty is added to his drug premium — for as long as he has Medicare drug coverage.`, 'bad');
      } else note(s, 'event', s.drugGap > 0 ? `Drug coverage starts. His ${s.drugGap}-month gap was under 63 days in a row — no late penalty.` : 'Drug coverage starts.', 'good');
      s.drugGap = 0;
      s.drug = p.kind === 'ma' ? 'ma' : 'plan';
      if (p.kind === 'ma') { s.extra = 'ma'; note(s, 'event', 'His Medicare Advantage plan is active (it includes his drug coverage).', 'good'); }
    }
    if (p.kind === 'medigap') { s.extra = 'medigap'; s.medigapLate = !!p.late; note(s, 'event', 'His Medigap policy is active.', 'good'); }
  }
  s.pending = s.pending.filter((x) => x.start !== t);
}

export interface Bill { label: string; cost: number; paid: number; how: string; tone: Tone }
export interface MonthSummary { t: number; premiums: { label: string; amount: number }[]; bills: Bill[]; total: number }

function careBill(s: SimState, e: { label: string; kind: CareKind; cost: number }): Bill {
  const y = yearOf(s.t);
  const oopLeft = Math.max(0, SHARE.maOopLimit - (s.maOop[y] || 0));
  const ma = (paid: number): Bill => {
    const p = Math.min(paid, oopLeft);
    s.maOop[y] = (s.maOop[y] || 0) + p;
    return { label: e.label, cost: e.cost, paid: p, tone: 'good', how: p < paid ? 'His Medicare Advantage plan’s yearly out-of-pocket limit kicked in — the plan paid the rest.' : 'His Medicare Advantage plan paid the rest after his share.' };
  };
  if (s.employed) return { label: e.label, cost: e.cost, paid: SHARE.workCopay, tone: 'good', how: 'His work plan paid the rest.' };
  if (e.kind === 'A') {
    if (s.extra === 'ma') return ma(SHARE.maHospitalCopay);
    if (s.extra === 'medigap') return { label: e.label, cost: e.cost, paid: 0, tone: 'good', how: 'Part A covered the stay, and Medigap paid the Part A deductible.' };
    return { label: e.label, cost: e.cost, paid: SHARE.partADeductible, tone: 'info', how: 'Part A covered the stay after the Part A deductible.' };
  }
  if (s.partB === 'active') {
    if (s.extra === 'ma') return ma(Math.round(e.cost * SHARE.maShare));
    const used = s.bDedUsed[y] || 0;
    const ded = Math.min(e.cost, Math.max(0, SHARE.partBDeductible - used));
    s.bDedUsed[y] = used + ded;
    const coins = Math.round((e.cost - ded) * SHARE.coinsurance);
    if (s.extra === 'medigap') return { label: e.label, cost: e.cost, paid: ded, tone: 'good', how: ded ? 'Part B paid after the yearly deductible; Medigap paid his 20% coinsurance.' : 'Part B paid 80%; Medigap paid his 20% coinsurance.' };
    return { label: e.label, cost: e.cost, paid: ded + coins, tone: 'warn', how: 'Part B paid after the yearly deductible; Joe paid 20% coinsurance — Original Medicare has no yearly limit.' };
  }
  if (s.cobra === 'active') return { label: e.label, cost: e.cost, paid: SHARE.cobraCopay, tone: 'info', how: 'COBRA paid the rest (in this story).' };
  s.uncovered += e.cost;
  return { label: e.label, cost: e.cost, paid: e.cost, tone: 'bad', how: 'No Part B and no other coverage for this care — Joe paid the whole bill.' };
}

/** Close out the current month (premiums, bills, penalty clocks) and move to the next. */
export function endMonth(prev: SimState): { state: SimState; summary: MonthSummary } {
  const s = clone(prev);
  const premiums: { label: string; amount: number }[] = [];
  if (s.partB === 'active') premiums.push({ label: s.bPenaltyPct ? `Part B premium + ${Math.round(s.bPenaltyPct * 100)}% penalty` : 'Part B premium', amount: Math.round(PRICES.partB * (1 + s.bPenaltyPct)) });
  const dPct = computePartDPenalty(s.dPenaltyMonths, FIGURES).penaltyPct;
  if (s.drug === 'plan') premiums.push({ label: dPct ? `Drug plan premium + ${Math.round(dPct * 100)}% penalty` : 'Drug plan premium', amount: Math.round(PRICES.drugPlan * (1 + dPct)) });
  if (s.extra === 'ma') premiums.push({ label: dPct ? `Medicare Advantage premium + drug penalty` : 'Medicare Advantage premium', amount: Math.round(PRICES.ma + PRICES.drugPlan * dPct) });
  if (s.extra === 'medigap') premiums.push({ label: s.medigapLate ? 'Medigap premium (late, higher price)' : 'Medigap premium', amount: s.medigapLate ? PRICES.medigapLate : PRICES.medigap });
  if (s.cobra === 'active') premiums.push({ label: 'COBRA premium', amount: PRICES.cobra });

  const bills: Bill[] = CARE.filter((e) => e.t === s.t).map((e) => careBill(s, e));
  if (s.t >= RX_FROM) {
    const covered = creditableDrug(s);
    if (!covered) s.uncovered += SHARE.rxCost;
    bills.push({ label: 'Monthly prescription', cost: SHARE.rxCost, paid: covered ? SHARE.rxCopay : SHARE.rxCost, tone: covered ? 'good' : 'bad', how: covered ? 'Drug coverage paid most of it.' : 'No drug coverage — Joe paid full price.' });
  }
  const total = premiums.reduce((a, p) => a + p.amount, 0) + bills.reduce((a, b) => a + b.paid, 0);
  s.spent += total;
  for (const b of bills) if (b.tone === 'bad') note(s, 'bill', `${b.label}: Joe paid ${money(b.paid)} — ${b.how}`, 'bad');

  // Penalty clocks and gap counters for this month.
  if (!s.employed && s.partB !== 'active') s.bLateMonths++;
  if (!s.employed && s.partB !== 'active' && s.cobra !== 'active') s.gapMonths++;
  if (!creditableDrug(s)) s.drugGap++;

  const summary: MonthSummary = { t: s.t, premiums, bills, total };
  s.t++;
  if (s.t >= TOTAL_MONTHS) { s.finished = true; s.t = TOTAL_MONTHS - 1; }
  else enterMonth(s);
  return { state: s, summary };
}

const windowKey = (s: SimState) => { const w = windowsAt(s); return [w.partB, w.planSep, w.oe, w.medigapOep].join(); };

/**
 * Skip quiet months: end months until one brings something new — a story event,
 * a bill, or an enrollment window opening or closing — or the story ends.
 */
export function fastForward(prev: SimState): { state: SimState; summaries: MonthSummary[]; befores: SimState[] } {
  let s = prev;
  const summaries: MonthSummary[] = [];
  const befores: SimState[] = [];
  do {
    const before = windowKey(s);
    befores.push(s);
    const r = endMonth(s);
    s = r.state; summaries.push(r.summary);
    if (s.finished) break;
    const news = s.log.some((l) => l.t === s.t && l.kind === 'event') || CARE.some((e) => e.t === s.t) || windowKey(s) !== before;
    if (news) break;
  } while (summaries.length < TOTAL_MONTHS);
  return { state: s, summaries, befores };
}

// ── Report card ─────────────────────────────────────────────────────────────

export interface Report {
  partBPenaltyPct: number;
  partDPenaltyPct: number;
  /** Penalty that would be added if he joined a drug plan now (ongoing 63+ day gap). */
  partDPendingPct: number;
  partBStatus: SimState['partB'];
  bLateMonths: number;
  gapMonths: number;
  spent: number;
  uncovered: number;
  coverage: string;
  protectedPath: boolean;
  decisions: LogEntry[];
}

export function report(s: SimState): Report {
  const dLocked = computePartDPenalty(s.dPenaltyMonths, FIGURES).penaltyPct;
  const pending = s.drugGap >= 3 ? computePartDPenalty(s.dPenaltyMonths + s.drugGap, FIGURES).penaltyPct - dLocked : 0;
  const coverage = s.partB !== 'active' ? 'Part A only' : s.extra === 'ma' ? 'Medicare Advantage (with drug coverage)'
    : `Original Medicare${s.extra === 'medigap' ? ' + Medigap' : ''}${s.drug === 'plan' ? ' + drug plan' : ' (no drug plan)'}`;
  return {
    partBPenaltyPct: s.bPenaltyPct, partDPenaltyPct: dLocked, partDPendingPct: pending,
    partBStatus: s.partB, bLateMonths: s.bLateMonths, gapMonths: s.gapMonths,
    spent: s.spent, uncovered: s.uncovered, coverage,
    protectedPath: s.bPenaltyPct === 0 && dLocked === 0 && pending === 0 && s.gapMonths === 0 && s.partB === 'active' && creditableDrug(s),
    decisions: s.log.filter((l) => l.kind === 'decision'),
  };
}
