// src/i18n/content-pages.ts — data-only registry of EXTRACTED pages.
//
// Convention: content key === URL slug (turning-65 ↔ /turning-65.html), so
// this is a flat list, not a mapping. A page appears here once its copy has
// been extracted to src/i18n/content/en/{key}.json and 3-diff verified.
//
// The dynamic [locale] route's getStaticPaths filters on THIS list — never on
// its component map. getStaticPaths runs in an isolated prerender chunk that
// cannot see .astro component imports (playbook §4.4 gotcha).
export const CONTENT_PAGES = [
  'turning-65',
  'medigap',
  'working-past-65',
  'best-medicare-advantage-vernal',
  'medicare-supplement-vs-advantage',
  'best-part-d-plans-vernal',
  'medicare-enrollment-periods',
  'medicare-costs',
  'medicare-decision-center',
  'medicare-help-center',
  'medicare-quote-vernal',
  'medicare-irmaa',
  'medicare-extra-help-utah',
  'medicare-savings-programs-utah',
  'about',
] as const;

export type ContentKey = (typeof CONTENT_PAGES)[number];
