# Vernal Medicare — SEO Launch Readiness (M43)

The pre-launch baseline. Two kinds of entries below:

- ✅ **Verified in-repo** — measured against the built `dist/` output on the audit date.
- ⏳ **Owner action (live site)** — requires the deployed site, a browser, Search
  Console, or real analytics; cannot be verified from the repo. Instructions included.

_Baseline date: 2026-07-01 · commit on `feat/launch-readiness` · 144 pages (+404)._

---

## Baseline snapshot (Phase 5 — Launch Report)

| Metric | Status |
|---|---|
| Total pages | **144** content pages + a custom 404 (145 built HTML) |
| Build | ✅ `astro build` clean, 144 pages |
| Astro check | ✅ **0 errors** (ratchet baseline 0) |
| Tests | ✅ **48 passing** (`vitest`) |
| Broken internal links | ✅ **0** (was 289 pre-M42) |
| Orphan pages | ✅ **0** (except the intentionally-unlinked 404) |
| Max click-depth from homepage | ✅ **3** (every page ≤3 clicks) |
| `<h1>` per page | ✅ exactly one (except the `news.html` redirect stub) |
| Image alt-text | ✅ **0 images missing alt** |
| Heading hierarchy | ✅ **0 level-skips** (clean h1→h2→h3) |
| Duplicate titles / descriptions | ✅ **0 / 0** |
| Canonicals | ✅ present, absolute, self-referential on every page |
| JSON-LD | ✅ 0 invalid blocks; correct types per page-class |
| Sitemap | ✅ index + 4 children; 0 indexable pages missing; 0 noindex/redirect wrongly included |
| robots.txt | ✅ present, allows crawl, references sitemap |
| GA + Search Console verification tags | ✅ present in built `<head>` |
| Lighthouse | ⏳ owner action (needs browser) |
| Real-device mobile | ⏳ owner action (needs device) |

---

## Priority pages — verified in-repo

All 20 priority pages have: exactly one H1, FAQ schema, page-class schema
(Article / MedicalWebPage / HowTo / LocalBusiness), a CTA (phone or enroll), and
inbound internal links. Title/description lengths noted where long (advisory only).

| Page | Schema | CTA | Inbound links |
|---|---|---|---|
| index (LocalBusiness+InsuranceAgency+MedicalBusiness) | ✅ | ✅ | — (root) |
| medicare-plans-vernal-utah (pillar) | ✅ | ✅ | 49 |
| medicare-decision-center | ✅ | ✅ | 299 |
| medicare-help-center | ✅ | ✅ | 340 |
| turning-65 | ✅ | ✅ | 156 |
| working-past-65 | ✅ | ✅ | 22 |
| medicare-drug-coverage | ✅ | ✅ | 68 |
| medicare-coverage (services) | ✅ | ✅ | 54 |
| medicare-financial-assistance | ✅ | ✅ | 158 |
| medicare-irmaa | ✅ | ✅ | 34 |
| medigap | ✅ | ✅ | 185 |
| best-medicare-advantage-vernal | ✅ | ✅ | 34 |
| medicare-costs | ✅ | ✅ | 69 |
| medicare-supplement-vs-advantage | ✅ | ✅ | 44 |
| medicare-savings-programs-utah | ✅ | ✅ | 42 |
| best-part-d-plans-vernal | ✅ | ✅ | 75 |
| medicare-calculators | ✅ | ✅ | **6** (thin — see known issues) |
| medicare-glossary | ✅ | ✅ | 30 |
| medicare-news | ✅ | ✅ | 172 |
| medicare-vernal-ut (office/local) | ✅ | ✅ | **2** (thin — see known issues) |

---

## Owner action checklists (live site — cannot be done from the repo)

### Phase 1 — Search Console
- [ ] Verify the property (the `google-site-verification` meta is already in `<head>` — confirm the token matches the GSC property).
- [ ] Submit the sitemap index: `https://vernalmedicare.com/sitemap.xml`.
- [ ] Confirm the 4 child sitemaps are read (pages / posts / local / money).
- [ ] Check **Coverage / Pages** report for excluded/error URLs after first crawl.
- [ ] **URL Inspection** on the homepage + top pillars; **Request indexing** for the priority list above.
- [ ] Confirm `medicare-search`, `privacy`, `terms`, `news.html` are treated as **noindex/redirect** (they are excluded from the sitemap by design).

### Phase 2 — Analytics & tracking
- [ ] Confirm Google Analytics receives real-time hits (the `gtag` config is in `<head>`; verify the property ID is live).
- [ ] Confirm Search Console ↔ Analytics link.
- [ ] Verify **call tracking**: the `tel:` links use the real business line; decide whether to add a tracked number.
- [ ] Verify **conversion events** — quote-request clicks, the SunFire "Compare & Enroll" outbound, and phone taps — fire as events.

### Phase 3 — Full crawl (Screaming Frog or equivalent)
The in-repo static crawl already confirms 0 broken links, 0 alt gaps, clean
headings, depth ≤3, and no duplicate titles/descriptions. On the **live** site, additionally verify:
- [ ] Status codes (200s; the `/news` → `medicare-news.html` redirect returns 301/302 as configured).
- [ ] No redirect chains or loops.
- [ ] HTTPS everywhere; no mixed content.
- [ ] Canonicals resolve to live 200 URLs.

### Phase 4 — Browser QA (from M42 follow-ups)
- [ ] **Lighthouse** on: home, decision center, help center, a hub, a calculator, an article, a location page. Record Performance / Accessibility / Best Practices / SEO; fix anything below target. Image dimensions + below-fold lazy-loading are the likeliest levers.
- [ ] **Real-device mobile**: header hamburger, hero CTAs, decision cards, calculator forms, wide tables (drug/coverage/income-limits), footer, 404.

---

## Known issues / deferred (non-blocking)

1. **Thin internal linking** on `medicare-calculators` (6 inbound) and
   `medicare-vernal-ut` (2 inbound). Both are reachable, but the office/local page
   is conversion-important — worth a few more contextual links in a later pass.
2. **Long titles/descriptions** on some data-driven pages (drug/service templates
   carry the `| Vernal Medicare` suffix). Not errors; may truncate in SERPs.
   One template edit each would shorten 14 + 11 pages if desired.
3. **Legacy pages** `part-d-help-vernal` and `reviews` predate the Page Framework
   (no Article/Breadcrumb schema). Candidates for a future migration.
4. **Lighthouse & real-device testing** remain the only unmeasured items — they
   need a browser and are listed as owner actions above.

---

## Recommended posture after launch (continuous improvement)

Large migrations are essentially done. Shift to maintenance + evidence-driven growth:
- **Annual (each January):** bump `CURRENT_YEAR` in `annualMedicareData.ts`; roll
  year-stamped slugs; refresh the News Center (see `docs/CONTENT-INVENTORY.md`).
- **Quarterly:** re-verify CMS figures against medicare.gov.
- **Evidence-driven:** use Search Console impressions/clicks to decide the next
  content — including whether to un-hold the GSC-held drug pages (Mounjaro,
  Ozempic, Wegovy, insulin) and where to add calculators or local pages.
