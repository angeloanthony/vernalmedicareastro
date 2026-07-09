// src/lib/calculators/penalty.ts — Part B and Part D late-enrollment penalties. Pure.
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

export interface PartDPenaltyResult {
  monthsUncovered: number;
  penaltyPct: number; // e.g. 0.12 for 12 months
  basePremium: number;
  monthlyPenalty: number;
  annualPenalty: number;
}

/** Part D penalty = 1% of the national base premium for each FULL month you
 *  went without Part D or other creditable drug coverage. Permanent, and
 *  recalculated each year as the base premium changes. */
export function computePartDPenalty(monthsUncovered: number, figures: MedicareFigures): PartDPenaltyResult {
  const months = Math.max(0, Math.floor(monthsUncovered));
  const penaltyPct = months * figures.penalties.partDPerMonthPct;
  const basePremium = figures.partD.basePremium;
  const monthlyPenalty = Math.round(basePremium * penaltyPct * 10) / 10; // rounds to the nearest $0.10, per CMS convention
  return {
    monthsUncovered: months,
    penaltyPct,
    basePremium,
    monthlyPenalty,
    annualPenalty: monthlyPenalty * 12,
  };
}
