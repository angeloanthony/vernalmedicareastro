import { describe, it, expect } from 'vitest';
import { usd, percent, number } from '../src/lib/formatters';

describe('formatters.usd', () => {
  it('rounds to whole dollars by default', () => {
    expect(usd(202.9)).toBe('$203');
    expect(usd(0)).toBe('$0');
  });
  it('keeps cents when asked', () => {
    expect(usd(202.9, { cents: true })).toBe('$202.90');
    expect(usd(38.99, { cents: true })).toBe('$38.99');
  });
});

describe('formatters.percent', () => {
  it('formats a fraction as a percentage', () => {
    expect(percent(0.1)).toBe('10%');
    expect(percent(0.015, 1)).toBe('1.5%');
  });
});

describe('formatters.number', () => {
  it('groups thousands', () => {
    expect(number(218000)).toBe('218,000');
  });
});
