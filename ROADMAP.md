# Roadmap

Sequenced so SEO-sensitive work is always isolated and reversible. Status as of
2026-06-30.

## ✅ Phase 1 — Foundation (complete)
Data layer · type system · config · application + calculator framework ·
documentation. No page wired; build unchanged (47 pages).

## ▶ Phase 2 — SEO Framework (next)
Reusable SEO/structured-data layer so every later page inherits it:
`SEOHead`, `Canonical`, `OpenGraph`, and JSON-LD emitters (`BreadcrumbSchema`,
`FAQSchema`, `ArticleSchema`, `MedicalSchema`, `CalculatorSchema`,
`LocalBusinessSchema`) on top of `src/lib/schema`. Design first, then implement.

## Phase 3 — Calculators (on the framework)
IRMAA → Cost → Drug Cost → Penalty → Timeline, each fed by
`annualMedicareData.ts`. Thin pages; shared shell.

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

---
See [MIGRATION.md](MIGRATION.md) for the live feature/decision matrix and
[DECISIONS.md](DECISIONS.md) for why.
