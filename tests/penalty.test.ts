import { describe, it, expect } from 'vitest';
import { computePartBPenalty, computePartDPenalty } from '../src/lib/calculators/penalty';
import { figuresFor } from '../src/data/annualMedicareData';

const F = figuresFor(2026); // partB.premium 202.90, partBPerYearPct 0.10; partD.basePremium 38.99, partDPerMonthPct 0.01

describe('computePartBPenalty', () => {
  it('is zero under 12 months late', () => {
    const r = computePartBPenalty(11, F);
    expect(r.fullYearsLate).toBe(0);
    expect(r.penaltyPct).toBe(0);
    expect(r.monthlyPenalty).toBe(0);
  });
  it('adds 10% per full year (floored)', () => {
    const r = computePartBPenalty(30, F); // 2 full years
    expect(r.fullYearsLate).toBe(2);
    expect(r.penaltyPct).toBeCloseTo(0.2, 5);
    expect(r.monthlyPenalty).toBeCloseTo(202.9 * 0.2, 2);
    expect(r.monthlyPremiumWithPenalty).toBeCloseTo(202.9 * 1.2, 2);
    expect(r.annualPenalty).toBeCloseTo(202.9 * 0.2 * 12, 2);
  });
});

describe('computePartDPenalty', () => {
  it('is zero with no uncovered months', () => {
    const r = computePartDPenalty(0, F);
    expect(r.monthsUncovered).toBe(0);
    expect(r.penaltyPct).toBe(0);
    expect(r.monthlyPenalty).toBe(0);
  });
  it('adds 1% of the base premium per full month, rounded to the nearest $0.10', () => {
    const r = computePartDPenalty(12, F);
    expect(r.monthsUncovered).toBe(12);
    expect(r.penaltyPct).toBeCloseTo(0.12, 5);
    expect(r.monthlyPenalty).toBeCloseTo(4.7, 5); // 38.99 * 0.12 = 4.6788 → 4.7
    expect(r.annualPenalty).toBeCloseTo(4.7 * 12, 5);
  });
});
