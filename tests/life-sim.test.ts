// tests/life-sim.test.ts — the Medicare rules behind the Life Simulator.
// Each test pins one rule the game teaches to a concrete scenario for Joe.
import { describe, it, expect } from 'vitest';
import {
  createState, act, endMonth, fastForward, windowsAt, actions, report,
  TOTAL_MONTHS, PRICES, SHARE, type ActionId, type SimState,
} from '../src/lib/games/lifeSim';

/** Play the whole story, taking `plan[t]` actions in month t. */
function play(plan: Record<number, ActionId[]> = {}, until = TOTAL_MONTHS): SimState {
  let s = createState();
  while (!s.finished && s.t < until) {
    for (const id of plan[s.t] || []) s = act(s, id);
    s = endMonth(s).state;
  }
  return s;
}
/** Advance to the start of month t, taking `plan` actions on the way. */
const at = (t: number, plan: Record<number, ActionId[]> = {}) => play(plan, t);
const enabled = (s: SimState, id: ActionId) => actions(s).find((a) => a.id === id)?.enabled === true;

describe('enrollment windows', () => {
  it('Part B: work coverage, then an 8-month SEP, then only the General Enrollment Period', () => {
    expect(windowsAt(at(0)).partB).toBe('work');
    expect(windowsAt(at(5)).partB).toBe('work');
    expect(windowsAt(at(6)).partB).toBe('sep'); // July, Year 1
    expect(windowsAt(at(13)).partB).toBe('sep'); // February, Year 2 — 8th month
    expect(windowsAt(at(14)).partB).toBe('gep'); // March, Year 2 — GEP still open
    expect(windowsAt(at(15)).partB).toBeNull(); // April, Year 2
    expect(windowsAt(at(24)).partB).toBe('gep'); // January, Year 3
  });
  it('plan window: 2 full months after losing employer coverage', () => {
    expect(windowsAt(at(6)).planSep).toBe(true);
    expect(windowsAt(at(7)).planSep).toBe(true);
    expect(windowsAt(at(8)).planSep).toBe(false);
  });
  it('COBRA ending opens a plan window but not a Part B SEP', () => {
    const s = at(24, { 6: ['acceptCobra'] });
    expect(s.cobra).toBe('ended');
    expect(windowsAt(s).planSep).toBe(true); // January, Year 3
    expect(windowsAt(s).partB).toBe('gep'); // only because it's January
    expect(windowsAt(at(26, { 6: ['acceptCobra'] })).planSep).toBe(false);
  });
  it('Open Enrollment covers October through early December', () => {
    expect([9, 10, 11].map((t) => windowsAt(at(t)).oe)).toEqual([true, true, true]);
    expect(windowsAt(at(12)).oe).toBe(false);
  });
});

describe('Part B late penalty', () => {
  it('protected path: sign up in the last month of work → no gap, no penalty', () => {
    const s = play({ 5: ['signupB'], 6: ['declineCobra', 'joinDrug'], 7: ['buyMedigap'] });
    const r = report(s);
    expect(r.partBPenaltyPct).toBe(0);
    expect(r.gapMonths).toBe(0);
    expect(r.partDPenaltyPct).toBe(0);
    expect(r.protectedPath).toBe(true);
  });
  it('signing up in the last SEP month (8 months late) has no penalty', () => {
    const s = play({ 6: ['declineCobra'], 13: ['signupB'] });
    expect(s.partBVia).toBe('sep');
    expect(s.bPenaltyPct).toBe(0);
    expect(s.gapMonths).toBe(8); // July–February with no Part B and no COBRA
  });
  it('the COBRA trap: keep COBRA, miss the SEP, sign up in GEP Year 3 → 10% penalty', () => {
    const s = play({ 6: ['acceptCobra'], 24: ['signupB'] });
    expect(s.partBVia).toBe('gep');
    expect(s.bLateMonths).toBe(19); // July Year 1 – January Year 3
    expect(s.bPenaltyPct).toBeCloseTo(0.1, 5);
    expect(s.gapMonths).toBe(1); // only January Year 3: COBRA covered the rest
  });
  it('GEP under 12 months late: no penalty, but months without coverage', () => {
    const s = play({ 6: ['declineCobra'], 14: ['signupB'] });
    expect(s.partBVia).toBe('gep');
    expect(s.bPenaltyPct).toBe(0);
    expect(s.gapMonths).toBe(9);
  });
  it('the penalty is added to the Part B premium', () => {
    const s = at(26, { 6: ['acceptCobra'], 24: ['signupB'] });
    const prem = endMonth(s).summary.premiums.find((p) => /Part B/.test(p.label));
    expect(prem?.amount).toBe(Math.round(PRICES.partB * 1.1));
  });
  it('Part B sign-up is refused when no window is open', () => {
    const s = at(15, { 6: ['declineCobra'] });
    expect(enabled(s, 'signupB')).toBe(false);
    expect(act(s, 'signupB')).toBe(s);
  });
});

describe('Part D late penalty (63 days in a row)', () => {
  it('a 2-month gap (July–August ≤ 62 days) has no penalty', () => {
    const s = play({ 6: ['declineCobra'], 7: ['joinDrug'] });
    expect(report(s).partDPenaltyPct).toBe(0);
  });
  it('waiting for Open Enrollment → 6 uncovered months → 6% penalty', () => {
    const s = play({ 6: ['declineCobra'], 9: ['joinDrug'] });
    expect(s.dPenaltyMonths).toBe(6);
    expect(report(s).partDPenaltyPct).toBeCloseTo(0.06, 5);
  });
  it('an ongoing gap shows a pending penalty at the end', () => {
    const r = report(play({ 6: ['declineCobra'] }));
    expect(r.partDPendingPct).toBeGreaterThan(0.2);
    expect(r.protectedPath).toBe(false);
  });
  it('can’t join a drug plan while work coverage is creditable, or outside a window', () => {
    expect(enabled(at(3), 'joinDrug')).toBe(false);
    expect(enabled(at(8, { 6: ['declineCobra'] }), 'joinDrug')).toBe(false);
    expect(enabled(at(9, { 6: ['declineCobra'] }), 'joinDrug')).toBe(true);
  });
});

describe('Medicare Advantage and Medigap', () => {
  it('Medicare Advantage requires Part B', () => {
    const s = at(6);
    expect(enabled(s, 'joinMA')).toBe(false);
    expect(enabled(act(s, 'signupB'), 'joinMA')).toBe(true);
  });
  it('joining Medicare Advantage brings drug coverage', () => {
    const s = at(8, { 6: ['declineCobra', 'signupB', 'joinMA'] });
    expect(s.extra).toBe('ma');
    expect(s.drug).toBe('ma');
  });
  it('Medigap during its Open Enrollment Period is standard price; after it, higher', () => {
    const inside = at(9, { 5: ['signupB'], 6: ['declineCobra'], 7: ['buyMedigap'] });
    expect(inside.extra).toBe('medigap');
    expect(inside.medigapLate).toBe(false);
    const late = at(14, { 5: ['signupB'], 6: ['declineCobra'], 12: ['buyMedigap'] }); // Part B from July → window July–December
    expect(late.medigapLate).toBe(true);
  });
  it('Medigap and Medicare Advantage don’t mix', () => {
    const s = at(9, { 5: ['signupB'], 6: ['declineCobra'], 7: ['buyMedigap'] });
    expect(actions(s).some((a) => a.id === 'joinMA')).toBe(false);
  });
});

describe('costs', () => {
  it('no Part B and no COBRA: Joe pays the whole outpatient bill', () => {
    const s = at(13, { 6: ['declineCobra'] });
    const bill = endMonth(s).summary.bills.find((b) => /knee surgery/.test(b.label));
    expect(bill?.paid).toBe(8000);
  });
  it('Original Medicare: Part B deductible then 20%, no cap', () => {
    const s = at(13, { 5: ['signupB'], 6: ['declineCobra', 'joinDrug'] });
    const bill = endMonth(s).summary.bills.find((b) => /knee surgery/.test(b.label));
    expect(bill?.paid).toBe(SHARE.partBDeductible + Math.round((8000 - SHARE.partBDeductible) * SHARE.coinsurance));
  });
  it('Medigap pays the 20% coinsurance', () => {
    const s = at(13, { 5: ['signupB'], 6: ['declineCobra', 'joinDrug'], 7: ['buyMedigap'] });
    const bill = endMonth(s).summary.bills.find((b) => /knee surgery/.test(b.label));
    expect(bill?.paid).toBe(SHARE.partBDeductible);
  });
  it('Medicare Advantage stops at its yearly out-of-pocket limit', () => {
    const s = at(13, { 5: ['signupB'], 6: ['declineCobra', 'joinMA'] });
    s.maOop[2] = SHARE.maOopLimit - 100; // nearly at the limit this year
    const bill = endMonth(s).summary.bills.find((b) => /knee surgery/.test(b.label));
    expect(bill?.paid).toBe(100);
  });
  it('Part A covers a hospital stay even without Part B', () => {
    const s = at(21, { 6: ['declineCobra'] });
    const bill = endMonth(s).summary.bills.find((b) => /Hospital/.test(b.label));
    expect(bill?.paid).toBe(SHARE.partADeductible);
  });
});

describe('engine', () => {
  it('act() never mutates the previous state', () => {
    const s = at(6);
    const snap = JSON.stringify(s);
    act(s, 'signupB');
    expect(JSON.stringify(s)).toBe(snap);
  });
  it('the story ends after 30 months', () => {
    const s = play();
    expect(s.finished).toBe(true);
  });
  it('fast-forward stops at the next event', () => {
    const r = fastForward(createState());
    expect(r.state.t).toBe(2); // March: Joe announces his retirement
  });
  it('fast-forward stops when a window opens', () => {
    const r = fastForward(at(10, { 6: ['declineCobra'] })); // November → December (OE still) → January: GEP opens
    expect(r.state.t).toBeGreaterThan(10);
    expect(r.summaries.length).toBeGreaterThan(0);
  });
});
