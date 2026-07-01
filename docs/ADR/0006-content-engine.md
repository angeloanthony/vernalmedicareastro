# ADR-0006 — Content engine (collections, FAQ, drug DB, search)

**Status:** Proposed · 2026-06-30

## Context
Alta uses Astro content collections (typed Markdown + Zod), a welded FAQ engine, a
data-driven drug page template, and Pagefind search. Vernal has none of these and
hand-codes content. The data layer (ADR-0003) is the foundation these sit on.

## Decision (proposed — design before implementation)
Adopt, Vernal-branded:
- **Content collections** for blog/news (typed frontmatter).
- **FAQ engine**: visible accordion + FAQPage JSON-LD from one `FAQCategory` array
  (fixes the schema-without-markup gap).
- **Drug database**: one template rendering `data/drugs.ts` → many pages.
- **On-site search** (Pagefind).

## Alternatives considered
- **Continue hand-coding content.** Rejected: doesn't scale; no typing; perpetuates
  the FAQ schema bug.

## Consequences
- Phases 3–4; designed and reviewed before code.
- Requires NAP-scrubbing any content ported from Alta.
