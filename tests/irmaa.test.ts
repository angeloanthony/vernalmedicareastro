import { describe, it, expect } from 'vitest';
import { computeIrmaa } from '../src/lib/calculators/irmaa';
import { figuresFor } from '../src/data/annualMedicareData';

const F = figuresFor(2026);
// single bounds: [109000, 137000, 171000, 205000, 500000]
// married bounds: [218000, 274000, 342000, 410000, 750000]

describe('computeIrmaa', () => {
  it('standard tier below the first bound (no IRMAA)', () => {
    const r = computeIrmaa('single', 90000, F);
    expect(r.tier).toBe(0);
    expect(r.hasIrmaa).toBe(false);
    expect(r.partBPremium).toBe(F.irmaa.partBByTier[0]);
    expect(r.partDSurcharge).toBe(0);
    expect(r.monthlyExtra).toBe(0);
  });

  it('single mid income maps to the correct tier', () => {
    const r = computeIrmaa('single', 150000, F); // 137000 < 150000 <= 171000 → tier 2
    expect(r.tier).toBe(2);
    expect(r.partBPremium).toBe(F.irmaa.partBByTier[2]);
    expect(r.partDSurcharge).toBe(F.irmaa.partDByTier[2]);
    expect(r.hasIrmaa).toBe(true);
  });

  it('married uses the higher married thresholds', () => {
    expect(computeIrmaa('married', 150000, F).tier).toBe(0); // 150000 <= 218000
    expect(computeIrmaa('married', 300000, F).tier).toBe(2); // 274000 < 300000 <= 342000
  });

  it('top tier above all bounds', () => {
    const r = computeIrmaa('single', 600000, F);
    expect(r.tier).toBe(5);
    expect(r.partBPremium).toBe(F.irmaa.partBByTier[5]);
  });

  it('monthlyExtra = (partB − standard) + partD surcharge; annual = ×12', () => {
    const r = computeIrmaa('single', 150000, F);
    expect(r.monthlyExtra).toBeCloseTo(
      F.irmaa.partBByTier[2] - F.irmaa.partBByTier[0] + F.irmaa.partDByTier[2],
      2,
    );
    expect(r.annualExtra).toBeCloseTo(r.monthlyExtra * 12, 2);
  });
});
