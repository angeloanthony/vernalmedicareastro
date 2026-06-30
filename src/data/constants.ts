// ---------------------------------------------------------------------------
// src/data/constants.ts  —  shared non-NAP constants  (SCAFFOLD)
//
// Brand/NAP/contact live in business.ts (the single source of truth) — do NOT
// duplicate them here. This file is for shared, non-identity constants used
// across tools and pages (external reference URLs, the calculator/tool registry
// keys, etc.). Seeded as features are built.
// ---------------------------------------------------------------------------

/** External reference destinations used across the site. */
export const EXTERNAL = {
  medicareGov: 'https://www.medicare.gov',
  ssaExtraHelp: 'https://www.ssa.gov/medicare/part-d-extra-help',
  medicarePhone: '1-800-633-4227', // 1-800-MEDICARE
} as const;

// TODO (Phase 3): calculator/tool registry keys (mirrors Alta's consts TOOLS),
// referenced by blog `relatedTools` and the Tools hub.
