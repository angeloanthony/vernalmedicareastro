# ADR-0005 — SEO framework (reusable head + structured data)

**Status:** Proposed · 2026-06-30

## Context
Every future page (calculator, drug, location, article) needs consistent SEO:
canonical, OG/Twitter, and JSON-LD. Vernal currently hand-writes these per page
(and has gaps/bugs: FAQ schema without visible markup, a broken reviews canonical,
the privacy/terms mismatch). `src/lib/schema` already provides pure JSON-LD builders.

## Decision (proposed — design before implementation)
Build `src/components/seo/` on top of `src/lib/schema` and `src/config`:
`SEOHead`, `Canonical`, `OpenGraph`, and JSON-LD emitters (`BreadcrumbSchema`,
`FAQSchema`, `ArticleSchema`, `MedicalSchema`, `CalculatorSchema`,
`LocalBusinessSchema`). Pages/components opt in; structured data is generated from
data so visible content and schema stay welded.

## Alternatives considered
- **Keep per-page hand-written SEO.** Rejected: drift, duplication, recurring bugs.

## Consequences
- Later pages get correct SEO by default.
- Phase 2 work; to be designed (interfaces/composition) and reviewed before code.
- Lets us fix the known legacy SEO bugs centrally rather than page by page.
