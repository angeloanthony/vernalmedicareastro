// ---------------------------------------------------------------------------
// src/types/News.ts — the Medicare "Intelligence Center" model (M31).
//
// News as structured intelligence, not a blog. Every article answers four
// questions (what changed / who's affected / what to do / learn more) and ties
// into the authority clusters via related links + a calculator. A lifecycle
// field keeps evergreen guidance current while retiring outdated updates.
// One data source powers the index, category views, and per-article pages.
// ---------------------------------------------------------------------------

export type NewsCategory = 'costs' | 'part-d' | 'coverage' | 'assistance' | 'alerts';

export const NEWS_CATEGORY_META: Record<NewsCategory, { label: string; blurb: string }> = {
  costs: { label: 'Costs & Premiums', blurb: 'Premiums, deductibles, and out-of-pocket changes.' },
  'part-d': { label: 'Part D & Drug Pricing', blurb: 'Drug coverage, caps, and pricing rules.' },
  coverage: { label: 'Plans & Coverage', blurb: 'Medicare Advantage, Medigap, and benefit changes.' },
  assistance: { label: 'Financial Assistance', blurb: 'Extra Help, Savings Programs, and eligibility.' },
  alerts: { label: 'Consumer Alerts', blurb: 'Scams and how to protect yourself.' },
};

/** current = live & accurate · historical = past change, kept for reference ·
 *  archived = superseded, hidden from the index. */
export type NewsLifecycle = 'current' | 'historical' | 'archived';

export interface NewsArticle {
  slug: string;
  title: string;
  category: NewsCategory;
  /** ISO date first published. */
  published: string;
  /** ISO date last reviewed/updated (optional). */
  updated?: string;
  lifecycle: NewsLifecycle;
  /** One-line summary / dek. */
  dek: string;
  // The four questions:
  whatChanged: string;
  whoAffected: string;
  whatToDo: string;
  // Ties into the authority clusters:
  learnMoreHref?: string;
  learnMoreLabel?: string;
  calculatorHref?: string;
  calculatorLabel?: string;
  related?: { href: string; label: string }[];
  source?: { title: string; url: string };
}
