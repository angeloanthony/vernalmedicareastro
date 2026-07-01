// src/lib/formatters — display formatting (currency, percent, number).
// Pure, dependency-free; used by calculators and any page rendering figures.

/** US dollars. `cents:false` (default) rounds to whole dollars. */
export const usd = (n: number, opts: { cents?: boolean } = {}): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  }).format(n);

/** Percentage from a fraction, e.g. percent(0.1) → "10%". */
export const percent = (fraction: number, digits = 0): string =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(fraction);

/** Grouped integer, e.g. number(218000) → "218,000". */
export const number = (n: number): string => new Intl.NumberFormat('en-US').format(n);
