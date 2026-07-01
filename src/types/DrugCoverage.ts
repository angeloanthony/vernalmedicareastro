// ---------------------------------------------------------------------------
// src/types/DrugCoverage.ts — the "does Medicare cover X" knowledge graph (M32).
//
// Every drug is a node with the SAME standardized structure, organized by the
// condition it treats. Distinct intent from the drug-ASSISTANCE pages ("help
// paying for X") — these answer "does Medicare cover X, and how" — so they
// interlink, they don't duplicate. `related` cross-links the comparisons people
// naturally make (Jardiance ↔ Farxiga, Humira ↔ Enbrel).
// ---------------------------------------------------------------------------

export type DrugCondition = 'diabetes' | 'heart' | 'autoimmune' | 'respiratory' | 'weight';

export const DRUG_CONDITION_META: Record<DrugCondition, { label: string; blurb: string }> = {
  diabetes: { label: 'Diabetes', blurb: 'GLP-1 and SGLT2 medications for type 2 diabetes.' },
  heart: { label: 'Heart & Blood', blurb: 'Blood thinners, heart failure, and cholesterol drugs.' },
  autoimmune: { label: 'Autoimmune & Skin', blurb: 'Biologics for arthritis, psoriasis, Crohn’s, and eczema.' },
  respiratory: { label: 'Respiratory', blurb: 'Inhalers and biologics for COPD and asthma.' },
  weight: { label: 'Weight & Metabolic', blurb: 'Weight-management medications and Medicare’s limits.' },
};

/** covered = covered for its approved use · conditional = only for certain
 *  diagnoses/criteria · limited = generally not covered (e.g. weight loss only). */
export type CoverageStatus = 'covered' | 'conditional' | 'limited';

export interface DrugCoverageEntry {
  brand: string;
  slug: string;
  generic: string;
  condition: DrugCondition;
  /** What it treats, one phrase. */
  treats: string;
  status: CoverageStatus;
  /** Plain-language answer to "does Medicare cover it?" */
  coveredSummary: string;
  /** The circumstances under which it's covered. */
  coveredWhen: string;
  /** Which part of Medicare covers it (usually Part D). */
  whichPart: string;
  /** Prior-authorization / step-therapy note. */
  priorAuth: string;
  /** What to do if it isn't covered or costs too much. */
  ifNotCovered: string;
  /** Assistance-page slug if one exists (→ <slug>-assistance-program.html), else the pillar. */
  assistanceSlug?: string;
  /** Related drug slugs (comparisons people make). */
  related?: string[];
  source: { title: string; url: string };
}
