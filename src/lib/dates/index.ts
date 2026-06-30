// src/lib/dates — date helpers for enrollment math and display.
// Pure functions; callers pass in dates (no implicit "now") so output is stable.

export const formatDate = (
  d: Date | string,
  opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string =>
  new Intl.DateTimeFormat('en-US', opts).format(typeof d === 'string' ? new Date(d) : d);

/** A new Date `months` after `d` (does not mutate `d`). */
export const addMonths = (d: Date, months: number): Date => {
  const x = new Date(d.getTime());
  x.setMonth(x.getMonth() + months);
  return x;
};

/** Whole years between `dob` and `on`. */
export const ageOn = (dob: Date, on: Date): number => {
  let age = on.getFullYear() - dob.getFullYear();
  const m = on.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && on.getDate() < dob.getDate())) age--;
  return age;
};

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export const daysBetween = (from: Date, to: Date): number =>
  Math.round((to.getTime() - from.getTime()) / 86_400_000);
