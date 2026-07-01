# Roadmap

Sequenced so SEO-sensitive work is always isolated and reversible. Status as of
2026-06-30.

## ✅ Phase 1 — Foundation (complete)
Data layer · type system · config · application + calculator framework ·
documentation. No page wired; build unchanged (47 pages).

## ▶ Phase 2 — Page Framework (next) — ADR-0008
The unified page-rendering framework (SEO folded in): `StandardPageLayout` +
page types, one `PageContext`, automatic schema, weighted related, E-E-A-T.
Near-term milestones:
- **M3 — Implement** the framework in interface-first order (types → authors →
  pageIndex → related → schema → StandardPageLayout → page types).
- **M4 — Migrate ONE static article** (`medicare-part-a-vs-part-b`) end-to-end as
  the first proof (no interactivity). Verify URL/HTML/schema/breadcrumbs/related.

## Phase 3 — Calculators (on the framework)
- **M5 — IRMAA** (first interactive feature; first calculator on the framework).
- Then Cost → Drug Cost → Penalty → Timeline, fed by `annualMedicareData.ts`.

## Phase 4 — Content Framework
FAQ engine (welded visible + schema) · drug database (data-driven pages) · blog
collections · on-site search.

## Phase 5 — Content Migration (Alta → Vernal)
IRMAA cluster · Drug Assistance · Enrollment (SEP/GEP/IEP) · Dual-Eligible.
Rebrand on import; hold GSC-flagged overlaps.

## Phase 6 — Local Authority
Counties · cities · hospitals · pharmacies (Uintah Basin first), on the location
engine. Also: relocate root components into the new taxonomy folders.

## Phase 7 — Performance
Cleanup · CSS audit · image optimization · Astro tuning · final QA.

## Milestone tags (rollback / bisect points)
```
foundation-complete ✓ → page-framework-proven → irmaa-v1 → drug-framework
                        → alta-phase-1 → alta-phase-2
```
Tag after each milestone passes `npm run verify`; `page-framework-proven` is set once
the first static article (M4) renders correctly with URLs unchanged.

---
See [MIGRATION.md](MIGRATION.md) for the live feature/decision matrix and
[DECISIONS.md](DECISIONS.md) for why.
