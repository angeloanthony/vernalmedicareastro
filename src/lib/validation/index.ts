// src/lib/validation — input coercion + range checks for calculator fields.

/** Parse a user value (may include "$", ",", "%") to a finite number, else null. */
export const toNumber = (v: unknown): number | null => {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const n = parseFloat(String(v ?? '').replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : null;
};

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);

export const inRange = (n: number, min: number, max: number): boolean => n >= min && n <= max;

export const isPositive = (n: number): boolean => Number.isFinite(n) && n > 0;
