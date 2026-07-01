// src/lib/related — weighted "Related pages" engine (ADR-0008).
// Scores candidates from the page index by taxonomy overlap and returns the top
// matches. Pure; reads data/pageIndex. Pages declare taxonomy → framework picks.

import type { RelatedPage, Taxonomy } from '../../types/Page';
import type { PageIndexEntry } from '../../data/pageIndex';

// Weights (ADR-0008): same silo dominates, tag overlap refines, pillars nudge up.
const SAME_SILO = 60;
const PER_TAG = 12;
const PILLAR = 10;

/** Top `limit` related pages for a page's taxonomy, excluding its own href. */
export function relatedFor(
  taxonomy: Taxonomy,
  index: PageIndexEntry[],
  excludeHref?: string,
  limit = 4,
): RelatedPage[] {
  const tags = new Set(taxonomy.tags ?? []);
  return index
    .filter((e) => e.href !== excludeHref)
    .map((e): RelatedPage => {
      const sharedTags = (e.taxonomy.tags ?? []).filter((t) => tags.has(t)).length;
      const score =
        (e.taxonomy.silo === taxonomy.silo ? SAME_SILO : 0) +
        PER_TAG * sharedTags +
        (e.taxonomy.pillar ? PILLAR : 0);
      return { href: e.href, label: e.title, silo: e.taxonomy.silo, score };
    })
    .filter((r) => (r.score ?? 0) > 0)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}
