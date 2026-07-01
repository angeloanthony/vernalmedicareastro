// ---------------------------------------------------------------------------
// src/data/faq/index.ts  —  FAQ content aggregator  (SCAFFOLD)
//
// Category FAQ files will live alongside this index (costs.ts, enrollment.ts,
// medigap.ts, …), each exporting an FAQCategory. Imported from Alta's faq/*.ts
// after a NAP/brand scrub (Phase 1 continued). The welded "visible accordion +
// FAQPage JSON-LD from one array" pattern fixes the existing schema-only gap.
//
// Type: types/FAQ.ts.
// ---------------------------------------------------------------------------

import type { FAQCategory } from '../../types/FAQ';

// TODO (Phase 1 cont.): import + NAP-scrub Alta's 8 FAQ category files.
export const FAQ_CATEGORIES: FAQCategory[] = [];
