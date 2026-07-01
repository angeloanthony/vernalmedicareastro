# M42 — Enterprise QA & SEO Audit

A validation milestone (no new content). Deterministic checks were run against the
built `dist/` output and fixed in code; two checks that require a real browser
(Lighthouse scoring, physical-device mobile testing) are static-analyzed here and
flagged as **owner follow-ups** rather than reported as measured passes.

_Audit date: 2026-07-01 · 145 built HTML files (144 pages + 404)._

## Bugs found & fixed

| # | Severity | Finding | Fix |
|---|---|---|---|
| 1 | **High** | **Header nav, logo, and Privacy/Terms footer links were relative** (`medicare-help-center.html`). On the 17 subfolder pages (`medicare-coverage/*` ×11, `medicare-news/*` ×6) they resolved to `/medicare-coverage/…` → **404**. Every news article and service-coverage page had a broken top nav (latent since the news subfolder shipped, M31). **289 broken link instances.** | Header/Footer + `navigation.ts` now use **absolute** (root-relative) hrefs; footer cozelos logo image made absolute. |
| 2 | **Medium** | **`meta.robots` was never rendered.** `PageMeta.robots` existed in the type and was set on `medicare-search` / `privacy` / `terms` (`noindex,follow`), but no layout emitted the tag — so pages meant to be excluded were fully indexable. | Added a `robots` prop to `BaseLayout` (renders `<meta name="robots">`) and passed `meta.robots` through `StandardPageLayout`. |
| 3 | **Low** | Stale `news.html` (a `/news` **redirect stub**, noindex) was listed in `sitemap-pages.xml`. | Removed. |
| 4 | **Low** | `privacy.html` (noindex) was in the sitemap — index/sitemap conflict. Surfaced once fix #2 made the noindex real. | Removed from sitemap. |
| 5 | **Low** | **3 orphan town pages** (Fort Duchesne, Neola, Ouray) had **0 inbound internal links**. | Added a "smaller communities" link row to the local pillar (now links all 13 towns). |

_Result after fixes: **0 broken internal links** (was 289), **0 orphans** except the
intentionally-unlinked `404.html`, sitemap has **0 indexable pages missing** and
**0 noindex/redirect pages wrongly included**._

## Checks that passed clean (no action needed)

- **Duplicate titles: 0.** **Duplicate meta descriptions: 0.**
- **Canonicals:** present on every page, all absolute & self-referential.
- **Structured data:** all JSON-LD parses (0 invalid blocks). Coverage — Article ×120,
  MedicalWebPage ×14, HowTo ×6 (calculators), FAQPage ×131, BreadcrumbList ×141,
  LocalBusiness/InsuranceAgency on the homepage. No duplicate LocalBusiness blocks.
- **robots.txt:** present, allows crawl, references the sitemap index.
- **Sitemap index:** 4 child sitemaps (pages/posts/local/money) all valid.

## Known-acceptable (documented, not "bugs")

- **LocalBusiness schema is homepage-only** (`includeLocalBusiness` defaults false).
  This is by design — the global business schema lives on the homepage; interior
  pages carry Article/FAQ/Breadcrumb. Not a defect.
- **`part-d-help-vernal` and `reviews`** are legacy (pre-framework) pages, so they
  lack Article/BreadcrumbList schema. Candidates for a future migration onto the
  Page Framework; not blocking.
- **Title length:** 102 pages have `<title>` > 65 chars (mostly the
  `… | Vernal Medicare` suffix on data-driven drug/service pages). **Meta
  description length:** 76 pages > 165 chars. Neither is an error — they may
  truncate in SERPs. Recommendation: if desired, trim the drug/service *template*
  title/description format (one edit each fixes 14 + 11 pages). Deferred to avoid
  churning titles on already-live pages without evidence.

## Owner follow-ups (require a real browser — cannot be measured headlessly here)

1. **Lighthouse** on representative pages (home, decision center, help center, a hub,
   a calculator, an article, a location page). Record Performance / Accessibility /
   Best Practices / SEO. Image optimization (WebP is already used; check dimensions
   and lazy-loading below the fold) is the most likely performance lever.
2. **Real-device / responsive mobile testing:** header hamburger, hero CTAs, decision
   cards, calculator layouts, wide tables (drug/coverage/income-limits), footer, 404.
   The static markup is responsive (viewport meta present, CSS grids use
   `auto-fit/minmax`), but tap targets and table overflow want a physical check.

## Internal-link authority (inbound internal links to key hubs, post-fix)

Help Center 323 · Decision Center 282 · Financial Assistance 158 · News 155 ·
Turning 65 139 · Costs 69 · Drug Coverage 68 · Services Coverage 54 · IRMAA 34 ·
Glossary 32 · Working Past 65 22 · Calculators 6 · Income Limits 5.

_Calculators and Income Limits are the thinnest; both are reachable from their
parents and the Decision Center, but are candidates for a few more contextual links
in a later pass._
