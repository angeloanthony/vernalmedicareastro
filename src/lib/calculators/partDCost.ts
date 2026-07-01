// src/lib/calculators/partDCost.ts — estimate annual Part D drug costs with the
// 2026 out-of-pocket cap. Pure. A simplified estimate: premium for the year plus
// your out-of-pocket drug spending, which the annual cap limits.
import type { MedicareFigures } from '../../types/MedicareFigures';

export interface PartDCostResult {
  annualPremium: number;
  /** Your out-of-pocket drug spend, after the annual cap is applied. */
  cappedDrugOutOfPocket: number;
  /** How much the $2,000 cap saved vs. the uncapped estimate. */
  capSavings: number;
  annualTotal: number;
  cap: number;
}

/** monthlyPremium: your plan's premium. estimatedDrugOutOfPocket: what you'd pay
 *  out of pocket for the year WITHOUT the cap (a rough figure the user enters).
 *  The cap limits covered out-of-pocket drug costs to figures.partD.annualCap. */
export function computePartDCost(
  monthlyPremium: number,
  estimatedDrugOutOfPocket: number,
  figures: MedicareFigures,
): PartDCostResult {
  const premium = Math.max(0, monthlyPremium);
  const rawOOP = Math.max(0, estimatedDrugOutOfPocket);
  const cap = figures.partD.annualCap;

  const cappedDrugOutOfPocket = Math.min(rawOOP, cap);
  const capSavings = rawOOP - cappedDrugOutOfPocket;
  const annualPremium = premium * 12;

  return {
    annualPremium,
    cappedDrugOutOfPocket,
    capSavings,
    annualTotal: annualPremium + cappedDrugOutOfPocket,
    cap,
  };
}
