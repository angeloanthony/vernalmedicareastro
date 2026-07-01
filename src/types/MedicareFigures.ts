// ---------------------------------------------------------------------------
// src/types/MedicareFigures.ts  —  shared contract for one year's CMS figures
//
// The shape of a single year's published Medicare numbers (premiums,
// deductibles, IRMAA brackets, Part D cap, Extra Help, MSP limits). Canonical
// data lives in data/annualMedicareData.ts, keyed by year.
// ---------------------------------------------------------------------------

export interface MedicareFigures {
  year: number;
  partA: { deductible: number };
  partB: { premium: number; deductible: number };
  partD: { basePremium: number; annualCap: number; insulinCap: number };
  penalties: {
    /** +10% of the Part B premium per full 12 months uncovered. */
    partBPerYearPct: number;
    /** 1% of the Part D base premium per full month uncovered. */
    partDPerMonthPct: number;
  };
  irmaa: {
    /** Upper MAGI bound of each non-standard tier (income from two years prior). */
    single: number[];
    married: number[];
    /** Total monthly Part B premium per tier. Index 0 = standard; 1–5 = IRMAA tiers. */
    partBByTier: number[];
    /** Monthly Part D surcharge per tier. Index 0 = standard; 1–5 = tiers. */
    partDByTier: number[];
  };
  extraHelp: {
    resourcesIndividual: number;
    resourcesCouple: number;
    maxDrugCopay: number;
  };
  medicareSavingsPrograms: {
    qmb: { individual: number; couple: number };
    slmb: { individual: number; couple: number };
    qi: { individual: number; couple: number };
    resources: { individual: number; couple: number };
  };
}
