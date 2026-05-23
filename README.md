# Vernal Medicare — Astro 6 Migration

This is the Vernal Medicare website migrated from flat HTML to **Astro 6**,
following the migration guide and infrastructure runbook. The guiding rule was
**migration, not redesign**: every page's URL, metadata, JSON-LD schema, and
body content is preserved. What changed is only the machinery underneath —
shared header/footer/nav/schema now come from one layout instead of being
copy-pasted into 47 files.

## What's here

```
src/
  layouts/BaseLayout.astro     One shell: <head> metadata, OG/Twitter, GA,
                               fonts, header, footer, schema injection, shared
                               scripts (nav toggle, year, 3CX chat).
  components/
    Header.astro               Top-bar + main-header + nav (NAP from business.ts)
    Footer.astro               Standard footer (NAP + disclaimer from business.ts)
    FAQ.astro                  FAQ list + matching FAQPage JSON-LD, welded together
    LocalBusinessSchema.astro  LocalBusiness JSON-LD (for NEW pages; converted
                               pages keep their original block verbatim)
    Breadcrumbs.astro          Visual trail + BreadcrumbList JSON-LD
    SummaryBlock.astro         AI-pullable TL;DR box
  data/business.ts             SINGLE SOURCE OF TRUTH: NAP, phone, hours, geo,
                               verification tokens, GA ID, quote URL, disclaimer
  pages/                       47 pages, file-based routes -> /foo.html URLs
public/
  styles.css, aca.css          Your original CSS, verbatim
  robots.txt, llms.txt         Verbatim
  sitemap*.xml                 Your 5 hand-built sitemaps, preserved verbatim
  _redirects                   Cloudflare safety net (empty — no URL changes)
  pictures/                    >>> DROP YOUR IMAGE FOLDER CONTENTS HERE <<<
astro.config.mjs               URL policy: .html preserved (build format 'file')
```

## URL policy (important)

Pages are emitted as `foo.html` (not `foo/index.html`), so every existing URL
is preserved exactly. `astro.config.mjs` sets `build.format: 'file'` and
`trailingSlash: 'never'`. **No redirects are needed.** If you ever want clean
`/foo/` URLs, that's a separate, deliberate decision: change those two settings
and add a 301 for every page.

## Before you deploy

1. **Add images.** Copy your original `pictures/` folder contents into
   `public/pictures/`. All pages reference `pictures/...` unchanged.
2. `npm install`
3. `npm run build` — outputs to `dist/`. Should report "47 page(s) built."
4. `npm run preview` — view locally before pushing.

## Launch runbook (from the Infrastructure Runbook, Appendix A)

1. **Branch.** Work on a branch (e.g. `astro-migration`), never directly on
   `main`, so the live site is never at risk.
2. **Cloudflare Pages.** Point Pages at the repo. Build command `astro build`,
   output directory `dist`. Push the branch → Cloudflare builds a **preview
   URL** for that branch.
3. **Verify on the preview**, page by page, against the live site: URLs,
   titles, canonicals, schema, and that images/CSS load.
4. **Validate schema** at validator.schema.org and **redirects** (none expected)
   with an HTTP status checker.
5. **Merge to `main`** only when the preview is verified. That merge is the
   launch.
6. **Re-submit the sitemap** in Search Console (your existing
   `sitemap.xml` is preserved at the root).
7. **Watch GSC daily for 30 days**: indexing, crawl errors, rankings, Core Web
   Vitals. Fix issues as they appear.

## Notes on intentional, approved changes

The migration is faithful to body content. Three small, deliberate
consistency changes were approved during the migration:

- **Uniform footer** on all pages (consistent NAP + the "Medicare Help"
  internal-link nav that a few pages were missing).
- **`vernal.html` and `privacy.html`** now use the full standard header/footer
  (they originally had stripped-down chrome).
- **Analytics preserved exactly**: pages that dual-tracked
  (G-NW6ENB89NF + G-FTDW9B2G6Q) still fire both; the three standalone landing
  pages keep their separate G-FTDW9B2G6Q property; `vernal.html` and
  `privacy.html` keep zero GA, as in the originals.

LocalBusiness schema was **not** added to pages that didn't already have it —
the migration changes nothing there. If you later want sitewide LocalBusiness,
set `includeLocalBusiness` to default `true` in `BaseLayout.astro` (one line).

## Sitemaps

Your 5 hand-built split sitemaps are preserved verbatim in `public/`. The
`@astrojs/sitemap` generator is intentionally **not** enabled, so nothing
changes for Search Console on launch. Switching to the generator is a clean
Phase 2 decision.

## Converting more pages later / next phases

- **Phase 2:** centralize/standardize (e.g. move repeated inline blocks into
  components, switch to Astro's sitemap generator).
- **Phase 3:** content collections for blog/local/comparison pages (typed
  Markdown with Zod schemas that fail the build if a required field is missing).
- **Phase 4+:** islands — plan-comparison calculator, AI chat, Pagefind search.

Add these one at a time, each as an isolated island, so the fast static
foundation is never compromised.
