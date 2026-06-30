# ADR-0007 — Migration strategy & engineering process

**Status:** Accepted · 2026-06-30

## Context
Merging Alta's capabilities into Vernal must not jeopardize live rankings. The work
spans many phases and months.

## Decision
- **Local-first positioning:** stay the Uintah Basin specialist first; expand to
  Utah counties/cities in phases as quality content is ready (no statewide launch
  all at once).
- **Hold overlapping pages for Search Console data:** where Alta and Vernal both
  cover a topic (Mounjaro/Ozempic/Insulin/Wegovy; Supplement-vs-Advantage), keep
  both URLs and decide merge/keep on GSC data — never blind-merge or redirect.
- **Process:** every major feature follows *design → review → implement*. One
  architectural area per commit. Every commit/CI passes `npm run verify`
  (ADR-0008 / [VERIFICATION.md](../VERIFICATION.md)).
- **Phased roadmap:** Foundation → SEO framework → Calculators → Content engine →
  Content migration → Local authority → Performance ([ROADMAP.md](../../ROADMAP.md)).

## Alternatives rejected
- **Big-bang merge / merge-then-optimize.** Rejected: import content just because
  it exists; bury architecture in large diffs; risk rankings.

## Consequences
- Slower but reversible; regressions stay isolated.
- Decisions are recorded here as ADRs; the live status lives in
  [MIGRATION.md](../../MIGRATION.md).
