// ---------------------------------------------------------------------------
// src/data/reviews.ts  —  client reviews  (SCAFFOLD)
//
// Future home for review content currently hardcoded inline in index.astro and
// reviews.astro. Centralizing here lets the visible reviews and the Review /
// AggregateRating JSON-LD generate from one source (and feeds E-E-A-T, Phase 2).
// ---------------------------------------------------------------------------

export interface Review {
  author: string;
  /** 1–5 stars. */
  rating: number;
  text: string;
  /** e.g. 'Facebook', 'Google'. */
  source?: string;
  /** ISO date, if known. */
  date?: string;
}

// TODO (Phase 2): migrate the existing inline reviews here (no page change yet).
export const REVIEWS: Review[] = [];
