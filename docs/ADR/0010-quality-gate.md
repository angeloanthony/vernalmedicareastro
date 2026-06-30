# ADR-0010 — Quality gate (`npm run verify`)

**Status:** Accepted · 2026-06-30

## Context
A legacy-rich, SEO-critical codebase needs automated protection against
regressions without forcing an upfront cleanup of inherited debt.

## Decision
One gate, run on every commit and in CI: **`npm run verify`** = `astro check`
(error-ratcheted) → Vitest unit tests → production build. Plus `lint`, `typecheck`,
`test`, `build` standalone. Legacy `astro check` debt is held at a **baseline**
(`scripts/quality-baseline.json`); verify fails only if errors **exceed** it, so the
gate is green today, blocks every *new* type error, and ratchets toward 0.

## Alternatives rejected
- **Fix all 59 legacy errors first.** Rejected: blocks progress; bundles risky
  page edits into tooling.
- **No gate / manual checks.** Rejected: regressions slip into an SEO-critical site.

## Consequences
- New code is held to a clean bar; legacy debt is paid down incrementally.
- Future steps slot into `scripts/verify.mjs` (lighthouse, link/schema/sitemap
  checks) and the baseline grows to track more metrics.
- Detail: [VERIFICATION.md](../VERIFICATION.md).
