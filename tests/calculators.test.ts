import { describe, it, expect } from 'vitest';
import { bracketIndex } from '../src/lib/calculators';

// IRMAA-style single brackets (2026), as in data/annualMedicareData.ts.
const SINGLE = [109000, 137000, 171000, 205000, 500000];

describe('calculators.bracketIndex', () => {
  it('returns the standard tier (0) below the first bound', () => {
    expect(bracketIndex(50000, SINGLE)).toBe(0);
    expect(bracketIndex(109000, SINGLE)).toBe(0); // inclusive upper bound
  });
  it('maps a mid income to the correct tier', () => {
    expect(bracketIndex(150000, SINGLE)).toBe(2);
    expect(bracketIndex(205000, SINGLE)).toBe(3);
  });
  it('returns the top tier (length) above all bounds', () => {
    expect(bracketIndex(600000, SINGLE)).toBe(5);
  });
});

// NOTE: readFields/renderResults/bindCalculator are DOM helpers, covered by
// integration tests once a calculator page exists (Phase 3). Pure logic only here.
