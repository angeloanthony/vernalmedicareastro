// src/lib/calculators/timeline.ts — Medicare enrollment timeline (IEP). Pure.
import { addMonths } from '../dates';

export interface EnrollmentTimeline {
  turns65: Date;
  /** IEP: 3 months before the birth month, through 3 months after (7 months). */
  iepStart: Date;
  iepEnd: Date;
  /** Enroll in the 3 months before your birth month → coverage starts this day. */
  earliestCoverageStart: Date;
}

export function computeEnrollmentTimeline(birthDate: Date): EnrollmentTimeline {
  const turns65 = new Date(birthDate.getFullYear() + 65, birthDate.getMonth(), birthDate.getDate());
  const birthMonthFirst = new Date(turns65.getFullYear(), turns65.getMonth(), 1);
  const iepStart = addMonths(birthMonthFirst, -3);
  const thirdMonthAfter = addMonths(birthMonthFirst, 3);
  // Last day of the 3rd month after the birth month:
  const iepEnd = new Date(thirdMonthAfter.getFullYear(), thirdMonthAfter.getMonth() + 1, 0);
  return { turns65, iepStart, iepEnd, earliestCoverageStart: birthMonthFirst };
}
