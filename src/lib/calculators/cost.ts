// src/lib/calculators/cost.ts — annual Medicare cost estimate by coverage path.
// Pure. Fixed figures from annualMedicareData; premiums/usage are user inputs.
import type { MedicareFigures } from '../../types/MedicareFigures';

export type CoveragePath = 'medigap' | 'advantage';
export type UsageLevel = 'low' | 'typical' | 'high';

export interface CostLine {
  label: string;
  amount: number;
}
export interface CostEstimate {
  path: CoveragePath;
  annualTotal: number;
  breakdown: CostLine[];
}

/** Estimated out-of-pocket for a Medicare Advantage plan by usage level. */
const ADVANTAGE_OOP: Record<UsageLevel, number> = { low: 500, typical: 2500, high: 6000 };

export function computeMedicareCost(
  path: CoveragePath,
  opts: { medigapMonthly?: number; partDMonthly?: number; advantageMonthly?: number; usage?: UsageLevel },
  figures: MedicareFigures,
): CostEstimate {
  const partBAnnual = figures.partB.premium * 12;

  const breakdown: CostLine[] =
    path === 'medigap'
      ? [
          { label: 'Part B premium', amount: partBAnnual },
          { label: 'Medigap (Plan G) premium', amount: (opts.medigapMonthly ?? 150) * 12 },
          { label: 'Part D premium', amount: (opts.partDMonthly ?? figures.partD.basePremium) * 12 },
          { label: 'Part B deductible', amount: figures.partB.deductible },
        ]
      : [
          { label: 'Part B premium', amount: partBAnnual },
          { label: 'Advantage plan premium', amount: (opts.advantageMonthly ?? 0) * 12 },
          { label: 'Estimated out-of-pocket', amount: ADVANTAGE_OOP[opts.usage ?? 'typical'] },
        ];

  return { path, annualTotal: breakdown.reduce((s, b) => s + b.amount, 0), breakdown };
}
