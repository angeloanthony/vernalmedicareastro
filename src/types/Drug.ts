// ---------------------------------------------------------------------------
// src/types/Drug.ts  —  shared contracts for the drug + assistance domain
//
// `Drug` is a featured medication (gets its own landing page). `Program` is a
// prescription-assistance program that helps pay for drugs. Canonical data for
// both lives in data/drugs.ts.
// ---------------------------------------------------------------------------

/** A featured medication that gets (or will get) its own landing page. */
export interface Drug {
  /** URL slug → /<slug>-assistance-program.html */
  slug: string;
  /** Brand name as it appears in Program.drugs (e.g. 'Eliquis'). */
  drug: string;
  /** Generic name (e.g. 'apixaban'). */
  generic: string;
  /** Short human label of what it treats. */
  conditionLabel: string;
  /** Condition['key'] values — drives foundation matching. */
  conditions: string[];
  /** Companion "Does Medicare cover X" guide slug (authored later). */
  blogSlug: string;
}

export type ProgramType = 'government' | 'foundation' | 'manufacturer' | 'database';

/** Manually-maintained fund availability for nonprofit foundations. */
export type FundStatus = 'open' | 'verify' | 'closed';

/** A prescription-assistance program: government subsidy, nonprofit copay fund,
 *  manufacturer patient-assistance program, or a search/discount database. */
export interface Program {
  id: string;
  type: ProgramType;
  name: string;
  tagline: string;
  /** "any" or a list of Condition['key'] values. */
  conditions: string[];
  helps: string;
  /** Optional short "Typical assistance" line; otherwise derived by type in the UI. */
  typical?: string;
  eligibility: string;
  url: string;
  urlLabel: string;
  phone?: string;
  /** Brand names a manufacturer program may cover. */
  drugs?: string[];
  /** Foundations only: manually-maintained fund availability. */
  status?: FundStatus;
}
