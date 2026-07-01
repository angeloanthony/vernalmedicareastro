import { describe, it, expect } from 'vitest';
import { computeMedicareCost } from '../src/lib/calculators/cost';
import { figuresFor } from '../src/data/annualMedicareData';

const F = figuresFor(2026);

describe('computeMedicareCost', () => {
  it('Medigap path: Part B + Medigap + Part D + Part B deductible', () => {
    const r = computeMedicareCost('medigap', {}, F);
    expect(r.path).toBe('medigap');
    expect(r.breakdown).toHaveLength(4);
    const expected = F.partB.premium * 12 + 150 * 12 + F.partD.basePremium * 12 + F.partB.deductible;
    expect(r.annualTotal).toBeCloseTo(expected, 2);
  });
  it('Advantage path: Part B + plan premium + usage OOP', () => {
    const r = computeMedicareCost('advantage', { advantageMonthly: 0, usage: 'typical' }, F);
    expect(r.breakdown).toHaveLength(3);
    expect(r.annualTotal).toBeCloseTo(F.partB.premium * 12 + 0 + 2500, 2);
  });
  it('usage level changes the estimate', () => {
    const low = computeMedicareCost('advantage', { usage: 'low' }, F).annualTotal;
    const high = computeMedicareCost('advantage', { usage: 'high' }, F).annualTotal;
    expect(high).toBeGreaterThan(low);
  });
  it('custom Medigap premium is respected', () => {
    const r = computeMedicareCost('medigap', { medigapMonthly: 200 }, F);
    const base = computeMedicareCost('medigap', { medigapMonthly: 150 }, F);
    expect(r.annualTotal - base.annualTotal).toBeCloseTo(50 * 12, 2);
  });
});
