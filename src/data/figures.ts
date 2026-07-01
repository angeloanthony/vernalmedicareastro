// ---------------------------------------------------------------------------
// src/data/figures.ts  —  ergonomic accessor for the CURRENT year's figures
//
// Thin convenience layer over annualMedicareData.ts. Pages/calculators that
// only care about "this year" import FIGURES; anything that needs a specific or
// future year uses figuresFor(year) / FIGURES_BY_YEAR directly. No data lives
// here — this file just selects the current year.
// ---------------------------------------------------------------------------

import { figuresFor, CURRENT_YEAR } from './annualMedicareData';

/** Figures for the year the site currently publishes. */
export const FIGURES = figuresFor(CURRENT_YEAR);

export { CURRENT_YEAR, figuresFor, FIGURES_BY_YEAR } from './annualMedicareData';
export type { MedicareFigures } from '../types/MedicareFigures';
