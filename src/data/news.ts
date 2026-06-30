// ---------------------------------------------------------------------------
// src/data/news.ts  —  Medicare news items  (SCAFFOLD)
//
// Lightweight news data for the News section / Annual Medicare Center. (Alta
// uses an Astro content collection for this; if we adopt collections, this file
// becomes the typed fallback / index. Decide during Phase 1 collections work.)
// ---------------------------------------------------------------------------

export interface NewsItem {
  title: string;
  /** ISO date. */
  date: string;
  summary: string;
  category: string;
  /** Optional citation URL (e.g. a CMS/Medicare.gov page). */
  source?: string;
}

// TODO (Phase 4): seed annual-change news; or migrate to a content collection.
export const NEWS: NewsItem[] = [];
