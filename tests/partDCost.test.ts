import { describe, it, expect } from 'vitest';
import { computePartDCost } from '../src/lib/calculators/partDCost';
import { figuresFor } from '../src/data/annualMedicareData';

const F = figuresFor(2026); // partD.annualCap = 2000

describe('computePartDCost', () => {
  it('caps out-of-pocket drug costs at the annual cap', () => {
    const r = computePartDCost(40, 3000, F);
    expect(r.annualPremium).toBe(480);
    expect(r.cappedDrugOutOfPocket).toBe(2000);
    expect(r.capSavings).toBe(1000);
    expect(r.annualTotal).toBe(2480);
    expect(r.cap).toBe(2000);
  });
  it('no cap effect when spending is under the cap', () => {
    const r = computePartDCost(0, 500, F);
    expect(r.cappedDrugOutOfPocket).toBe(500);
    expect(r.capSavings).toBe(0);
    expect(r.annualTotal).toBe(500);
  });
  it('clamps negative inputs to zero', () => {
    const r = computePartDCost(-10, -100, F);
    expect(r.annualTotal).toBe(0);
  });
});
