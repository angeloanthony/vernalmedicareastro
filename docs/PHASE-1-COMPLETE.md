# Phase 1 — Complete

**Status:** ✅ Complete · **Date:** 2026-07-01 · **Release tag:** `homepage-news-ticker-v1` (latest) on `main`

Phase 1 took VernalMedicare from a legacy, hand-authored HTML site to a
structured Astro platform: a shared Medicare data model, reusable layouts and
components, decision-driven navigation, topical authority hubs, a calculator
framework, a News Center, on-site search, a QA pipeline, launch-readiness
hardening, and a data-driven homepage news ticker.

This document is the historical checkpoint for that work — what was built, why,
and what was intentionally left for Phase 2. From here the strategy shifts from
*building based on plans* to *improving based on evidence* (Search Console +
Analytics).

---

## Project goals

- Retire the legacy framework and rebuild on Astro (static output, fast, crawlable).
- Replace hand-maintained duplicate HTML with a **single shared data model** so
  facts (figures, plans, locations, drugs, news) live in one place and render
  everywhere consistently.
- Establish **topical authority** through content hubs and clean internal linking
  rather than a flat set of marketing pages.
- Serve the **Vernal / Uintah Basin** market with local SEO architecture (city,
  county, provider, and hospital pages).
- Give visitors **decision-driven paths** ("I'm turning 65", "I'm still working",
  etc.) instead of forcing them to navigate by product name.
- Preserve strict URL and metadata fidelity from the legacy site during migration.

---

## Major architectural decisions

- **Astro, static-first.** All pages pre-rendered to HTML; every internal link is
  real and crawlable. No client framework runtime for content.
- **Shared data model in `src/data/`.** 23 typed data modules (news, drugs, plans,
  parts, figures, glossary, locations, counties, towns, providers, reviews, …)
  are the single source of truth. Pages and components read from them; nothing is
  duplicated across templates.
- **Typed content model for News** (`src/types/News.ts`): news treated as
  structured intelligence (what changed / who's affected / what to do / learn
  more) with a `lifecycle` field, not a freeform blog. One data source powers the
  index, category views, per-article pages, and the homepage ticker.
- **Reusable layouts/components.** `BaseLayout` owns metadata, OG/Twitter, GA,
  fonts, header/footer, and schema wiring; `ArticlePage` and shared components
  render the hubs. 28 components total.
- **Decision-driven navigation (M44).** The header is 6 topic-hub dropdowns, not a
  flat bar — new pages are added as children of a hub, not as top-level links.
- **Local SEO architecture.** Dynamic routes generate per-town/city/provider
  pages from location data (`medicare-[town]-utah`, `does-medicare-cover-[drug]`,
  etc.), expanding 94 source pages into 144 built pages.
- **On-site search via Pagefind** — static index built at `astro build` time
  (indexes 145 pages), no server required.
- **Cache-busting for `public/styles.css`.** Astro does not fingerprint files in
  `public/`, so `BaseLayout` appends a `STYLES_VERSION` token to the stylesheet
  URL; bump it whenever `styles.css` changes to avoid stale CSS.

---

## Milestone timeline (by release tag)

The repository carries fine-grained release tags per cluster/milestone. Key
checkpoints:

| Date | Tag | Milestone |
|------|-----|-----------|
| 2026-06-30 | `foundation-complete` | Astro foundation, page framework proven |
| 2026-07-01 | `calculator-platform-v1` | Calculator framework (IRMAA, Part D, penalty, cost, extra-help) |
| 2026-07-01 | `news-center-v1` | Structured News / Intelligence Center |
| 2026-07-01 | `search-v1` | On-site Pagefind search |
| 2026-07-01 | `qa-seo-audit-v1` | Enterprise QA & SEO audit (broken-nav + robots fixes) |
| 2026-07-01 | `launch-readiness-v1` | Launch readiness baseline + priority-page audit |
| 2026-07-01 | `homepage-news-ticker-v1` | Data-driven homepage Medicare Updates ticker |

Additional cluster tags (authority, IRMAA, Medigap, Part D, local, trust,
providers, turning-65, working-past-65, dual-eligible, financial-assistance,
glossary, and more) mark the individual content silos built along the way. Run
`git tag -l` for the full list.

---

## Release tags (current)

Latest: **`homepage-news-ticker-v1`** on `main` (commit `eaa89a8`, pushed to
`origin/main`). Prior platform checkpoints include `launch-readiness-v1`,
`qa-seo-audit-v1`, `search-v1`, `news-center-v1`, `calculator-platform-v1`,
`v3-platform`, `v2-knowledge-platform`, and `v1-authority-foundation`.

---

## Final statistics

| Metric | Value |
|--------|-------|
| Page source files (`src/pages/**/*.astro`) | 94 |
| Dynamic route templates | 5 |
| **Pages built (production)** | **144** |
| Pages indexed by Pagefind (search) | 145 |
| Reusable components | 28 |
| Shared data modules | 23 |
| Content collections | 3 (blog, comparisons, local) |
| Structured news articles | 6 |
| Unit test suites / tests | 12 / **48 passing** |
| `astro check` errors | **0** |
| Production build | ✅ Completes cleanly (~11s) |

*(Verified 2026-07-01: `npm test` → 48/48 passing; `npm run build` → 144 pages,
0 errors; `astro check` → 0 errors.)*

---

## Intentionally deferred

Left out of Phase 1 **on purpose** — not oversights:

- **Non-indexed utility pages.** `medicare-search`, `terms`, and `privacy` carry
  `robots: noindex,follow` by design — they should not compete for search
  impressions. Keep them out of priority indexing requests.
- **Ticker weighting (`priority` + `expires`).** The ticker currently orders by
  `featured` then newest-first. Weighted/time-boxed pinning (e.g. pin an Annual
  Enrollment Period notice until 2026-12-07) is deferred until Search Console
  data shows which updates deserve prominence. The shared data model supports
  adding these fields without touching the component.
- **Seasonal ticker label.** Auto-switching the label to "Open Enrollment"
  during Oct 15–Dec 7 is a straightforward later add given the shared model.
- **Post-launch content expansion.** New News Center articles and additional
  authority-cluster pages are added as data, not new architecture.

---

## Phase 2 priorities — evidence-driven

No new milestone begins until the site has been deployed and collecting data.

**Immediate (deployment week):**
1. Deploy current `main`; run a production acceptance test (homepage, ticker,
   search, calculators, Decision Center, Drug Coverage, Financial Assistance,
   contact form, phone links).
2. Submit `https://vernalmedicare.com/sitemap.xml` to Search Console; request
   indexing for priority pages (Homepage, Medicare Plans, Decision Center, Help
   Center, Drug Coverage, Financial Assistance, Turning 65).
3. Verify GA4 is recording page views, contact-form submissions, phone-click
   events, and calculator interactions.

**Then — let Google work (several weeks):** allow crawl, indexing, internal-link
and authority-cluster evaluation. Resist redesigning.

**After data arrives — let Search Console drive the roadmap:**
- Which pages have the most impressions?
- Which have low CTR (title/meta iteration candidates)?
- Which sit at positions 8–20 (near-win optimization targets)?
- Which get unexpected traffic or surface untargeted queries (new content
  opportunities)?

Those answers — not a predetermined plan — set the Phase 2 backlog.
