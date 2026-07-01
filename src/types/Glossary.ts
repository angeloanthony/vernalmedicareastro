// ---------------------------------------------------------------------------
// src/types/Glossary.ts — contract for one Medicare glossary term (M29).
//
// A knowledge system, not a word list: terms are categorized, and each points to
// the Vernal page that OWNS the topic (so the glossary reinforces the pillars
// instead of competing with them). The shape supports promoting a high-value
// term to its own authority page later without a redesign.
// ---------------------------------------------------------------------------

export type GlossaryCategory =
  | 'enrollment'
  | 'costs'
  | 'plans'
  | 'assistance'
  | 'coverage';

export const CATEGORY_META: Record<GlossaryCategory, { label: string; blurb: string }> = {
  enrollment: { label: 'Enrollment & Timing', blurb: 'When you can sign up or change plans.' },
  costs: { label: 'Costs & IRMAA', blurb: 'What you pay — premiums, deductibles, surcharges.' },
  plans: { label: 'Plans & Parts', blurb: 'The parts of Medicare and the plans that fill the gaps.' },
  assistance: { label: 'Financial Assistance', blurb: 'Programs that lower your Medicare costs.' },
  coverage: { label: 'Coverage & Drugs', blurb: 'How plans decide what’s covered.' },
};

export interface GlossaryTerm {
  /** Display term, e.g. "IRMAA". */
  term: string;
  /** Anchor/URL slug, e.g. "irmaa". */
  slug: string;
  category: GlossaryCategory;
  /** One-sentence, plain-language answer FIRST (people + AI search). */
  short: string;
  /** The fuller, Medicare-specific explanation. */
  full: string;
  /** The Vernal page that owns this topic (glossary reinforces, never competes). */
  authorityHref?: string;
  authorityLabel?: string;
  /** Optional calculator that applies to the term. */
  calculatorHref?: string;
  /** Related term slugs (for cross-links). */
  related?: string[];
  /** Optional official source. */
  source?: { title: string; url: string };
}
