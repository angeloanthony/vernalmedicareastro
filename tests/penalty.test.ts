import { describe, it, expect } from 'vitest';
import { computePartBPenalty } from '../src/lib/calculators/penalty';
import { figuresFor } from '../src/data/annualMedicareData';

const F = figuresFor(2026); // partB.premium 202.90, partBPerYearPct 0.10

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
