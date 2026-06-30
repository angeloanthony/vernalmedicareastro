// ---------------------------------------------------------------------------
// src/types/MedicarePlan.ts  —  shared contracts for plans and Medicare parts
//
// FORWARD-LOOKING. `MedicarePart` = the structure of Medicare (A/B/C/D);
// canonical data in data/parts.ts. `MedicarePlan` = a specific plan-type
// reference (Plan G, Plan N, HD Plan G, MA, Part D); canonical data in
// data/plans.ts. No data seeded yet.
// ---------------------------------------------------------------------------

export type PartLetter = 'A' | 'B' | 'C' | 'D';

export interface MedicarePart {
  letter: PartLetter;
  name: string;
  /** One-line summary of what this part covers. */
  covers: string;
}

export type PlanType =
  | 'original'
  | 'medigap'
  | 'advantage'
  | 'part-d'
  | 'dsnp';

export interface MedicarePlan {
  slug: string;
  name: string;
  type: PlanType;
  /** Short summary of who the plan fits. */
  summary: string;
}
