// src/lib/calculators/irmaa.ts — IRMAA (Income-Related Monthly Adjustment Amount)
// math. Pure: given filing status + MAGI + a year's figures, return the tier and
// the Part B premium / Part D surcharge. Data comes from annualMedicareData.

import type { MedicareFigures } from '../../types/MedicareFigures';
import { bracketIndex } from './index';

export type FilingStatus = 'single' | 'married';

export interface IrmaaResult {
  /** 0 = standard (no IRMAA); 1–5 = IRMAA tiers. */
  tier: number;
  /** Total monthly Part B premium at this tier. */
  partBPremium: number;
  /** Monthly Part D IRMAA surcharge (added to the plan premium). */
  partDSurcharge: number;
  /** IRMAA-only extra per month vs. the standard tier (Part B delta + Part D surcharge). */
  monthlyExtra: number;
  annualExtra: number;
  hasIrmaa: boolean;
}

export function computeIrmaa(
  status: FilingStatus,
  magi: number,
  figures: MedicareFigures,
): IrmaaResult {
  const { single, married, partBByTier, partDByTier } = figures.irmaa;
  const bounds = status === 'married' ? married : single;
  const tier = bracketIndex(magi, bounds);

  const partBPremium = partBByTier[tier];
  const partDSurcharge = partDByTier[tier];
  const standardPartB = partBByTier[0];
  const monthlyExtra = partBPremium - standardPartB + partDSurcharge;

  return {
    tier,
    partBPremium,
    partDSurcharge,
    monthlyExtra,
    annualExtra: monthlyExtra * 12,
    hasIrmaa: tier > 0,
  };
}
