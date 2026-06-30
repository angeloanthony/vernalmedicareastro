# ADR-0001 — Platform: Vernal as base, Alta as engine

**Status:** Accepted · 2026-06-30

## Context
Two Astro Medicare sites: **Vernal** (live domain, rankings, URLs, local NAP/brand,
hand-tuned schema; Uintah Basin) and **Alta** (a more advanced data-driven
framework — collections, data layer, calculators, drug DB, county engine; Wasatch
Front, different brand/agent). Goal: build the best Utah Medicare authority while
preserving Vernal's earned SEO.

## Decision
Build "Vernal Medicare 2.0" **on the existing Vernal Astro project**. Import Alta's
**systems** (data layer, collections, search, calculators, engines) underneath
Vernal's existing **presentation** (BaseLayout, Header, Footer, SEO, `business.ts`).
One brand: **Vernal Medicare / Rocco DeLuca**. Alta's brand, NAP, analytics, and
agent identity do not reach production.

## Alternatives rejected
- **Migrate Vernal into Alta / rebuild on Alta.** Rejected: unacceptable risk to
  live rankings + URLs; wrong brand and geography baked in.
- **Adopt Alta's presentation layer too.** Rejected: Vernal's layouts carry brand
  and ranking signals; Alta's value is its framework, not its chrome.

## Consequences
- Every migrated Alta asset needs a brand/NAP/analytics swap.
- Vernal's URL set and SEO config are preserved throughout (see ADR-0002).
- Alta becomes a parts donor for systems, not a destination.
