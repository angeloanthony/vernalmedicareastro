import { describe, it, expect } from 'vitest';
import { computeEnrollmentTimeline } from '../src/lib/calculators/timeline';

describe('computeEnrollmentTimeline', () => {
  it('turns 65 on the 65th birthday', () => {
    const t = computeEnrollmentTimeline(new Date(1961, 5, 15)); // June 15, 1961
    expect(t.turns65.getFullYear()).toBe(2026);
    expect(t.turns65.getMonth()).toBe(5); // June
  });
  it('IEP spans 3 months before the birth month through 3 months after', () => {
    const t = computeEnrollmentTimeline(new Date(1961, 5, 15)); // June
    expect(t.iepStart.getMonth()).toBe(2); // March
    expect(t.iepStart.getDate()).toBe(1);
    expect(t.iepEnd.getMonth()).toBe(8); // September
    expect(t.iepEnd.getDate()).toBe(30); // last day of Sept
    expect(t.earliestCoverageStart.getMonth()).toBe(5); // June 1
  });
  it('handles a December birthday (wraps the year)', () => {
    const t = computeEnrollmentTimeline(new Date(1961, 11, 10)); // December
    expect(t.iepStart.getMonth()).toBe(8); // September (of the 65th year)
    expect(t.iepEnd.getFullYear()).toBe(t.turns65.getFullYear() + 1); // March next year
    expect(t.iepEnd.getMonth()).toBe(2); // March
  });
});
