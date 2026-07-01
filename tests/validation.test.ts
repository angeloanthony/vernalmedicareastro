import { describe, it, expect } from 'vitest';
import { toNumber, clamp, inRange, isPositive } from '../src/lib/validation';

describe('validation.toNumber', () => {
  it('parses messy currency/percent strings', () => {
    expect(toNumber('$1,234')).toBe(1234);
    expect(toNumber('10%')).toBe(10);
    expect(toNumber(5)).toBe(5);
  });
  it('returns null for non-numbers', () => {
    expect(toNumber('abc')).toBeNull();
    expect(toNumber('')).toBeNull();
  });
});

describe('validation helpers', () => {
  it('clamps to a range', () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-1, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
  });
  it('checks range membership', () => {
    expect(inRange(5, 0, 10)).toBe(true);
    expect(inRange(11, 0, 10)).toBe(false);
  });
  it('detects positive numbers', () => {
    expect(isPositive(2)).toBe(true);
    expect(isPositive(-1)).toBe(false);
    expect(isPositive(0)).toBe(false);
  });
});
