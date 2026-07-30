// scripts/seo/standards.mjs — the EDITORIAL STANDARD. Hand-maintained.
//
// This is the second (and last) file in the system that encodes judgment rather
// than measurement. `config.mjs` says what a page is worth; this says what a
// page of that kind must CONTAIN.
//
// The distinction from AI Readiness matters:
//   AI Readiness  — is this page machine-extractable? Fixed, universal weights.
//   Completeness  — does this page meet OUR standard for its cluster? Pass/fail
//                   against an editorial spec that differs per cluster.
//
// A Part D page without a comparison table is incomplete even if its AI
// readiness is high, because a drug page that does not compare anything has
// failed at its job. That is an editorial claim, not a measurement — so it
// lives here, in one reviewable list.
//
// Every element below is detected from the BUILT HTML. Nothing is aspirational:
// if it cannot be measured, it does not belong in the standard.

/**
 * The catalog. Each element names the component that satisfies it and the
 * signal that proves it shipped.
 */
export const ELEMENTS = {
  summary: {
    label: 'AI Summary',
    component: '<SummaryBlock>',
    detect: (p) => p.hasSummary,
  },
  definitions: {
    label: 'Definitions',
    component: '<dl> / <dfn> / glossary term',
    detect: (p) => p.definitions > 0,
  },
  comparisonTable: {
    label: 'Comparison table',
    component: '<table> — 2+ columns, 3+ rows',
    detect: (p) => p.hasComparisonTable,
  },
  faq: {
    label: 'FAQ',
    component: '<FAQ> (markup + FAQPage schema)',
    detect: (p) => p.hasFaqMarkup && p.hasFaqSchema,
  },
  related: {
    label: 'Related articles',
    component: '<RelatedPages>',
    detect: (p) => p.hasRelated,
  },
  cta: {
    label: 'CTA',
    component: '<PageCTA>',
    detect: (p) => p.hasCta,
  },
  sources: {
    label: 'Sources',
    component: '<SourcesList>',
    detect: (p) => p.hasSources,
  },
  byline: {
    label: 'Author byline',
    component: '<AuthorByline>',
    detect: (p) => p.hasByline,
  },
  nextSteps: {
    label: 'Next steps',
    component: '<NextSteps>',
    detect: (p) => p.hasNextSteps,
  },
  breadcrumbs: {
    label: 'Breadcrumbs',
    component: '<Breadcrumbs>',
    detect: (p) => p.hasBreadcrumbs,
  },
  schema: {
    label: 'Schema',
    component: 'Article + BreadcrumbList + Organization + Person',
    detect: (p) => {
      const t = new Set(p.schemaTypes ?? []);
      return ['BreadcrumbList', 'Organization'].every((x) => t.has(x)) &&
        (t.has('Article') || t.has('WebPage'));
    },
  },
  internalLinks: {
    label: 'Internal links',
    component: '8+ in-content links out',
    detect: (p) => p.outboundCount >= 8,
  },
};

/** Required of every content page, regardless of cluster. */
const BASELINE = ['summary', 'faq', 'byline', 'sources', 'cta', 'related', 'breadcrumbs', 'schema', 'internalLinks'];

/**
 * Per-cluster standard. Extends BASELINE unless `replace` is set.
 *
 * The additions are the editorial claim — what this KIND of page owes a reader:
 *   part-d / drug pages      must compare options and define terms
 *   costs / plan comparisons must compare options
 *   101 / glossary-adjacent  must define terms
 *   enrollment               must tell the reader what to do next
 *   trust                    is not topical content and is held to less
 */
export const STANDARDS = {
  'part-d': { add: ['comparisonTable', 'definitions'] },
  'costs-irmaa': { add: ['comparisonTable', 'definitions'] },
  'medicare-advantage': { add: ['comparisonTable'] },
  medigap: { add: ['comparisonTable'] },
  'medicare-101': { add: ['definitions'] },
  'dual-eligible': { add: ['definitions', 'nextSteps'] },
  enrollment: { add: ['nextSteps'] },
  'other-insurance': { add: ['comparisonTable'] },
  local: { add: [] },
  providers: { add: [] },
  tools: { add: [] },
  // Trust pages exist for readers and E-E-A-T, not topical authority. Holding
  // them to the full content standard would generate permanent false failures.
  trust: { replace: ['summary', 'byline', 'breadcrumbs', 'schema', 'cta'] },
};

/** The element keys required of a page in `silo`. */
export function requiredFor(silo) {
  const spec = STANDARDS[silo];
  if (!spec) return BASELINE;
  if (spec.replace) return spec.replace;
  return [...BASELINE, ...(spec.add ?? [])];
}

/**
 * Score one page against its cluster's standard.
 * @returns { required, present, missing, completeness } — completeness 0-100.
 */
export function completenessFor(page) {
  const required = requiredFor(page.silo);
  const present = required.filter((key) => ELEMENTS[key].detect(page));
  const missing = required.filter((key) => !ELEMENTS[key].detect(page));
  return {
    required,
    present,
    missing,
    completeness: Math.round((present.length / Math.max(1, required.length)) * 100),
  };
}
