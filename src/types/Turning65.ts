// ---------------------------------------------------------------------------
// src/types/Turning65.ts — the "turning 65" journey model (M30).
//
// One data source that can power the timeline, the checklist, and a future
// step-by-step wizard/reminder tool — the same pattern as GlossaryTerm. Each
// step orchestrates EXISTING Vernal products (enrollment pillar, calculators,
// plan pillars) rather than duplicating them.
// ---------------------------------------------------------------------------

export interface Turning65Step {
  /** Stable id / anchor slug. */
  id: string;
  /** When this happens, e.g. "3 months before your 65th birthday month". */
  when: string;
  /** Short imperative title, e.g. "Your enrollment window opens". */
  title: string;
  /** What to do / decide, in plain language. */
  task: string;
  /** The Vernal page that goes deeper on this step. */
  relatedHref?: string;
  relatedLabel?: string;
  /** A calculator that applies to this step, if any. */
  calculatorHref?: string;
  calculatorLabel?: string;
  /** The natural "what's next" nudge for this step. */
  nextStep?: string;
}
