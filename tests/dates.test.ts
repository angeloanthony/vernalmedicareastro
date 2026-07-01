import { describe, it, expect } from 'vitest';
import { addMonths, ageOn, daysBetween, formatDate } from '../src/lib/dates';

describe('dates.addMonths', () => {
  it('advances the month without mutating the input', () => {
    const start = new Date(2026, 0, 15); // local, tz-safe
    const out = addMonths(start, 3);
    expect(out.getMonth()).toBe(3); // April
    expect(start.getMonth()).toBe(0); // unchanged
  });
});

describe('dates.ageOn', () => {
  it('computes whole years, respecting the birthday boundary', () => {
    const dob = new Date(1960, 5, 15);
    expect(ageOn(dob, new Date(2026, 5, 15))).toBe(66);
    expect(ageOn(dob, new Date(2026, 5, 14))).toBe(65);
  });
});

describe('dates.daysBetween', () => {
  it('counts whole days', () => {
    expect(daysBetween(new Date(2026, 0, 1), new Date(2026, 0, 11))).toBe(10);
  });
});

describe('dates.formatDate', () => {
  it('renders a human date', () => {
    const out = formatDate(new Date(2026, 0, 15));
    expect(out).toContain('2026');
    expect(out).toContain('January');
  });
});
