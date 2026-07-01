# ADR-0009 — Migration Rules (the project constitution)

**Status:** Accepted · 2026-06-30

## Context
This is a long, multi-phase migration of a site whose primary asset is **earned
SEO**. Without standing rules, well-meaning changes can quietly cost rankings.
These rules are binding for every contributor (human or AI) and every phase.

## Rules

1. **Never change an indexed URL without evidence.** A URL change requires Search
   Console data + an explicit ADR. Default is preservation (ADR-0002). Build keeps
   emitting the same route set (currently 47).
2. **Preserve canonicals.** Canonical URLs are self-referencing and absolute
   `.html`. Never point a canonical at a non-existent or alternate URL.
3. **Check Search Console before merging competing pages.** Pages that overlap in
   intent (e.g. Mounjaro/Ozempic/Insulin/Wegovy; Supplement-vs-Advantage) are
   **held**, not merged/redirected, until impressions/clicks/rankings justify it
   (ADR-0007).
4. **One feature per branch.** Features live on independent branches
   (`feat/<name>`); design-only artifacts stay local until implementation begins.
5. **`npm run verify` must pass before merge.** astro check (ratcheted) → unit
   tests → build. CI enforces it. The astro-check baseline only ratchets **down**
   (ADR/VERIFICATION).
6. **One architectural concern per commit.** Keep architecture out of large feature
   diffs; keep reviews small and regressions isolated.
7. **Existing pages migrate incrementally.** Onto the Page Framework (ADR-0008) one
   small, verifiable commit at a time — never a big-bang rewrite.
8. **Facts live in the data layer; brand lives in `business.ts`.** No page hardcodes
   a figure, NAP, or schema fact (ADR-0003). One brand: Vernal / Rocco (ADR-0001/0003).
9. **Design → review → implement** for every major feature. The design (interfaces,
   file layout) is approved before production code.
10. **Prove the framework on a real page before the next feature.** Every
    implementation PR must migrate **one production page** onto a new framework
    (verified end-to-end) before a second feature is built on it. No stacking
    framework → calculator → FAQ → schema → … without a single proven page in between.

## Consequences
- Slower but reversible; rankings are protected by process, not vigilance.
- A change that can't satisfy these rules needs its own superseding ADR first.
- Live status: [MIGRATION.md](../../MIGRATION.md). Verification: [VERIFICATION.md](../VERIFICATION.md).
