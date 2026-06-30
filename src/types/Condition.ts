// ---------------------------------------------------------------------------
// src/types/Condition.ts  —  shared contract: a clinical condition
//
// Conditions group drugs and prescription-assistance funds (see data/drugs.ts).
// The interface lives here; the canonical CONDITIONS list lives in
// data/conditions.ts, and ConditionKey is derived from that list so the union
// can never drift from the data.
// ---------------------------------------------------------------------------

export interface Condition {
  /** Stable key, e.g. 'diabetes'. Referenced by drugs and assistance programs. */
  key: string;
  /** Human-readable label, e.g. 'Diabetes'. */
  label: string;
}
