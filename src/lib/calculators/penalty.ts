// src/lib/calculators/penalty.ts — Part B late-enrollment penalty. Pure.
import type { MedicareFigures } from '../../types/MedicareFigures';

export interface PartBPenaltyResult {
  fullYearsLate: number;
  penaltyPct: number; // e.g. 0.20 for 2 years
  standardPremium: number;
  monthlyPenalty: number;
  monthlyPremiumWithPenalty: number;
  annualPenalty: number;
}

/** Part B penalty = 10% of the standard premium for each FULL 12 months you
 *  could have had Part B but didn't. Permanent. */
export function computePartBPenalty(monthsLate: number, figures: MedicareFigures): PartBPenaltyResult {
  const fullYearsLate = Math.max(0, Math.floor(monthsLate / 12));
  const penaltyPct = fullYearsLate * figures.penalties.partBPerYearPct;
  const standardPremium = figures.partB.premium;
  const monthlyPenalty = standardPremium * penaltyPct;
  return {
    fullYearsLate,
    penaltyPct,
    standardPremium,
    monthlyPenalty,
    monthlyPremiumWithPenalty: standardPremium + monthlyPenalty,
    annualPenalty: monthlyPenalty * 12,
  };
}
