// scripts/seo/config.mjs — the ONLY hand-maintained input to the SEO engine.
//
// Everything else (pages, performance, links, freshness, readiness) is derived
// from the four canonical sources. What lives here is pure business judgment
// that no source can infer: how much a conversion on a given silo is worth, and
// where the priority tier lines fall.
//
// Weights are documented in docs/SEO-SYSTEM.md. Changing a number here changes
// every generated report on the next `npm run seo`.

export const SITE_ORIGIN = 'https://vernalmedicare.com';
export const DEFAULT_LOCALE = 'en';

export const PATHS = {
  registry: 'src/data/pageIndex.ts',
  dist: 'dist',
  pagesDir: 'src/pages',
  dataDir: 'src/data',
  searchConsole: 'data/search-console',
  out: 'docs/seo',
};

// ── Layer 4a: Priority weights (must total 100) ──────────────────────────────
export const PRIORITY_WEIGHTS = {
  impressions: 30,
  position: 25,
  business: 20,
  pillar: 10,
  linkWeakness: 5,
  freshness: 5,
  ctrOpportunity: 5,
};

// ── Layer 4b: Opportunity weights (must total 100) ───────────────────────────
// Opportunity deliberately over-weights signals that mean "Google already
// trusts this URL": impressions and a position within striking distance. A
// page with no impressions is not an opportunity yet — it's a bet.
export const OPPORTUNITY_WEIGHTS = {
  impressions: 40,
  proximity: 30,
  ctrGap: 20,
  headroom: 10,
};

// Pages with zero Search Console impressions cannot score above this. They are
// unproven, not opportunities — they belong in the queue via business value.
export const UNPROVEN_OPPORTUNITY_CAP = 25;

// ── Layer 4c: AI Readiness feature weights (must total 100) ──────────────────
export const AI_WEIGHTS = {
  summary: 20, // <SummaryBlock> — the TL;DR that AI Overviews quote
  faq: 20, // FAQ component (visible markup + FAQPage schema, welded)
  schema: 15, // Article/WebPage + BreadcrumbList + Organization + Person
  tables: 10, // comparison/figure tables are disproportionately extracted
  definitions: 10, // <dl>/<dfn>/glossary terms — entity definitions
  internalLinks: 15, // in-content links out; context for the retriever
  insights: 10, // byline + cited sources + real depth (first-hand signal)
};

// ── Business Impact (1-5) ────────────────────────────────────────────────────
// A page's commercial role, on one strategic scale. This is the judgment call
// no source can infer, and the only number here you should expect to revisit.
//
//   5  Direct revenue     — a policy can be sold off this page
//   4  Indirect revenue   — drives a qualified visitor toward a quote
//   3  Lead nurturing     — tools and decision support that build intent
//   2  Authority          — topical depth that earns trust and rankings
//   1  Supporting         — required, but not a commercial or ranking asset
//
// Scored as impact / 5, so a Supporting page still carries 20% weight rather
// than being zeroed out of the queue entirely.
export const BUSINESS_IMPACT = {
  levels: {
    5: 'Direct revenue',
    4: 'Indirect revenue',
    3: 'Lead nurturing',
    2: 'Authority',
    1: 'Supporting',
  },
  bySilo: {
    'medicare-advantage': 5,
    medigap: 5,
    'other-insurance': 3, // ACA / life / indemnity are cross-sells, not core Medicare revenue (2026-07-29 structural audit)
    'part-d': 4,
    local: 4,
    enrollment: 3,
    'costs-irmaa': 3,
    'dual-eligible': 3,
    tools: 3,
    'medicare-101': 2,
    providers: 2,
    trust: 2,
  },
  byUrl: {
    '/': 5,
    '/medicare-quote-vernal.html': 5,
    '/free-medicare-comparison-vernal.html': 5,
    '/medicare-agent-vernal.html': 5,
    '/medicare-plans-vernal-utah.html': 5,
    '/best-medicare-advantage-vernal.html': 5,
    '/vernal.html': 4,
    '/medicare-enrollment-vernal.html': 4,
    '/best-part-d-plans-vernal.html': 4,
    // Required-but-not-commercial. These exist for readers and E-E-A-T, not for
    // topical authority, so they should never outrank real content in the queue.
    '/editorial-policy.html': 1,
    '/privacy.html': 1,
    '/terms.html': 1,
    '/reviews.html': 2,
    '/medicare-agent-credentials.html': 2,
  },
  fallback: 3,
};

// ── Thresholds ───────────────────────────────────────────────────────────────
export const THRESHOLDS = {
  // Priority tier cut lines (score out of 100).
  tier1: 68,
  tier2: 48,
  // Content freshness.
  staleDays: 180,
  criticalStaleDays: 365,
  // Content depth.
  thinWords: 600,
  // Internal linking.
  weakInboundLinks: 3,
  lowOutboundLinks: 4,
  // AI readiness cut line for "needs work".
  aiReadinessFloor: 70,
  // A link that appears on this share of pages is site furniture, not a
  // deliberate editorial link.
  boilerplateShare: 0.9,
};

// ── Editorial publish gate ───────────────────────────────────────────────────
// EDITORIAL-COMPLETENESS.md reports the standard; `npm run seo:gate` enforces
// it: a NEW page may not ship below `threshold`% completeness, and no existing
// page may drop below its recorded floor in `baselineFile` (see gate.mjs).
export const GATE = {
  threshold: 90,
  baselineFile: 'data/editorial-baseline.json',
};

// Expected organic CTR by average position. Used for the CTR-opportunity
// factor: a page far below its band's expected CTR has a title/snippet problem,
// not a ranking problem — the cheapest fix in SEO.
export const EXPECTED_CTR = [
  [1, 0.28], [2, 0.152], [3, 0.101], [4, 0.072], [5, 0.055],
  [6, 0.044], [7, 0.036], [8, 0.031], [9, 0.027], [10, 0.024],
  [15, 0.016], [20, 0.011], [30, 0.006], [50, 0.003], [Infinity, 0.001],
];

// URLs excluded from scoring entirely (utility pages with no SEO job).
export const EXCLUDED = new Set([
  '/404.html',
  '/medicare-search.html',
]);
