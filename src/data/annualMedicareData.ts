// ---------------------------------------------------------------------------
// src/data/annualMedicareData.ts  —  SINGLE SOURCE OF TRUTH for annual figures
//
// The "Annual Medicare Center" engine. Every figure CMS (the Centers for
// Medicare & Medicaid Services) publishes each year — premiums, deductibles,
// IRMAA brackets, the Part D cap, Extra Help, Medicare Savings Program limits —
// lives here, keyed by year. For a new year, add a `2027` object and bump
// CURRENT_YEAR; calculators, schema, and any "2026 figures" copy update at once.
//
// (Renamed from the earlier cms.ts to avoid the CMS = "content management
// system" vs. "Centers for Medicare & Medicaid Services" ambiguity.)
//
// Provenance: values ported verbatim from the AltaMedicare data layer
// (quarterly-audited there). VERIFY QUARTERLY against medicare.gov / CMS fact
// sheets and edit ONLY this file.
//
// NOTE: $16,590 / $33,100 are the Extra Help RESOURCE (asset) limits, not income.
// ---------------------------------------------------------------------------

import type { MedicareFigures } from '../types/MedicareFigures';

const FIGURES_2026: MedicareFigures = {
  year: 2026,

  partA: { deductible: 1736 },

  partB: { premium: 202.9, deductible: 283 },

  partD: { basePremium: 38.99, annualCap: 2000, insulinCap: 35 },

  penalties: {
    partBPerYearPct: 0.1,
    partDPerMonthPct: 0.01,
  },

  irmaa: {
    single: [109000, 137000, 171000, 205000, 500000],
    married: [218000, 274000, 342000, 410000, 750000],
    partBByTier: [202.9, 284.1, 405.8, 527.5, 649.2, 689.9],
    partDByTier: [0, 14.5, 37.5, 60.4, 83.3, 91.0],
  },

  extraHelp: {
    resourcesIndividual: 16590,
    resourcesCouple: 33100,
    maxDrugCopay: 12.65,
  },

  medicareSavingsPrograms: {
    qmb: { individual: 1350, couple: 1824 },
    slmb: { individual: 1616, couple: 2184 },
    qi: { individual: 1816, couple: 2455 },
    resources: { individual: 9950, couple: 14910 },
  },
};

/** Every published year, keyed by year. Add `2027: FIGURES_2027` to roll over. */
export const FIGURES_BY_YEAR: Record<number, MedicareFigures> = {
  2026: FIGURES_2026,
};

/** The year the site currently publishes. Bump this each January. */
export const CURRENT_YEAR = 2026;

/** Figures for a given year (defaults to the current year). */
export const figuresFor = (year: number = CURRENT_YEAR): MedicareFigures =>
  FIGURES_BY_YEAR[year] ?? FIGURES_BY_YEAR[CURRENT_YEAR];
