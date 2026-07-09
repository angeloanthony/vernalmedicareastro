// ---------------------------------------------------------------------------
// src/data/federalPovertyLevel.ts — HHS Federal Poverty Guidelines (48
// contiguous states + DC). Separate from annualMedicareData.ts because this is
// an HHS table, not a CMS Medicare figure — but it changes yearly the same way,
// so VERIFY ANNUALLY against aspe.hhs.gov/poverty-guidelines.
//
// Used only for the rough manufacturer-PAP / foundation-grant eligibility tiers
// on the drug-assistance hub (those programs are typically priced as a % of
// FPL). Medicare Savings Programs / Extra Help use their own published dollar
// limits (see medicareSavingsPrograms in annualMedicareData.ts) and should NOT
// be estimated from this table — use computeAssistanceEligibility instead.
// ---------------------------------------------------------------------------

/** 2026 federal poverty guidelines, household size 1–8 (48 states + DC). */
const FPL_2026_BASE = [15650, 21150, 26650, 32150, 37650, 43150, 48650, 54150];
/** Added per additional person beyond 8. */
const FPL_2026_ADDL_PERSON = 5500;

/** Annual federal poverty level income for a household of the given size. */
export function fplForHousehold(size: number, year = 2026): number {
  const table = year === 2026 ? FPL_2026_BASE : FPL_2026_BASE;
  const n = Math.max(1, Math.round(size));
  if (n <= table.length) return table[n - 1];
  return table[table.length - 1] + FPL_2026_ADDL_PERSON * (n - table.length);
}

/** Annual income as a percentage of the federal poverty level for that household size. */
export function pctOfFpl(annualIncome: number, householdSize: number, year = 2026): number {
  const fpl = fplForHousehold(householdSize, year);
  return fpl > 0 ? (Math.max(0, annualIncome) / fpl) * 100 : 0;
}
