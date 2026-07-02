# Production Multilingual System for Astro — Playbook v2

**Second edition, written from the vernalmedicare.com build (July 2026).**
Supersedes and extends the v1 playbook (parkingway.it reference, 11 languages × 11 pages).
Reference implementation here: **English + Spanish, 16 bilingual pages, 5 release tags
(`i18n-batch-1..3`, `i18n-homepage`), 9 validator catches, zero 404s.**

v1 proved the i18n *architecture*. This build proved something harder: applying it to a
site whose content was never designed for extraction — inline copy, shared TS data
modules, hand-rolled JSON-LD, comparison tables, dynamic CMS figures, carousels with
runtime JS. v2 is the playbook for that: **multilingual as a content-architecture
problem, not just a routing problem.**

---

## 1. The v2 principle set

v1's six principles all held. Three were added or sharpened:

| # | Principle | What it means in practice |
|---|---|---|
| 7 | **Every human-facing string has exactly one authoritative source** | Not "one page = one JSON." The source may be a page JSON, the chrome dictionary, a shared data module, a compliance constant, or a schema field — but it is exactly one place. |
| 8 | **Extraction is lossless — bugs included** | The extraction copies exactly what exists. A migration that silently "fixes" content can never prove it preserved the original. Defects are surfaced by QA, then fixed *at the master* as separate, deliberate commits. (Case study §9.) |
| 9 | **Existence-awareness compounds (the network effect)** | Because every internal link resolves through `localizeHref()` at build time, translating page N automatically upgrades every existing translated page that links to N. Coverage grows superlinearly; nobody edits links. |

---

## 2. The three translation domains

A business site's strings are not one kind of thing. Route each to its own source:

| Domain | Examples | Authoritative source | Translated by |
|---|---|---|---|
| **Page content** | body copy, FAQs, summaries, titles/meta | `src/i18n/content/{locale}/{page}.json` | translation engine (AI + glossary), human-reviewable |
| **Application chrome** | nav, footer, buttons, bylines, breadcrumbs, aria | `t()` dictionary + `localizeLabel()` map (`src/i18n/locales.ts`) | hand-authored once, per locale |
| **Compliance & legal** | CMS TPMO line, multi-plan disclaimer, licensing language | dedicated constants next to the English (`business.ts` → `businessDisclaimers(locale)`) | **never machine-translated** — use the regulator's own published wording (CMS publishes official Spanish) |

Mixing these is the #1 architecture smell: chrome strings in page JSON get re-translated
per page and diverge; compliance text in the AI pipeline is a legal risk.

---

## 3. The five content types (extraction strategies)

| Type | Example | Strategy |
|---|---|---|
| **Static copy** | paragraphs, headings | JSON strings; HTML-bearing copy stored as HTML strings rendered via `set:html` |
| **Structured data** | comparison tables, link grids | arrays of objects (`{label, medigap, advantage}`, `{name, when, who, href}`) — styling stays in the component, translator sees clean cell text |
| **Shared modules** | `TURNING_65_STEPS`, `DECISION_PATHS`, `PAGE_INDEX` labels, news ticker | **do not inline into page JSON.** They are their own future translation source; render English until that source exists. Duplicating them across page JSONs recreates the drift problem the architecture exists to kill. |
| **Dynamic data** | premiums, deductibles, caps, IRMAA thresholds, years, phone/TTY | `{placeholder}` tokens interpolated from the data layer (§4) |
| **External systems** | Sunfire quote tool (English-only) | document the boundary honestly in a code comment; don't pretend the vendor is localized |

---

## 4. Dynamic data — never translate a number

**Rule: prices, dollar amounts, dates, percentages, deductibles, premiums, annual
limits, income thresholds, phone numbers never appear literally in translated JSON.**

```jsonc
// content JSON (both languages)
"summary": "the standard Part B premium is {partBPremium}/month with a {partBDeductible} deductible"
```

```ts
// component — figures stay in the data layer
const vars = { partBPremium: usd(f.partB.premium, {cents:true}), partBDeductible: usd(f.partB.deductible) };
summary: interp(c.page.summary, vars)
```

Payoffs, all verified in production:
- The annual CMS figures update is **one edit to the data module**; both languages
  update in the same build. Translations cannot go stale on a dollar amount.
- The medicare-costs page runs nine figures + the year through this in both locales.
- Validation enforces it: placeholder sets must match between source and translation
  or the build fails.

---

## 5. The translation engine (five operating principles)

`scripts/translate.js` — the only code that ever contacts an AI API.

1. **The build never calls AI.** `astro build` reads committed JSON only. The SDK is
   lazy-imported; `--check` and `--dry-run` need no dependency, key, or network.
   Deterministic, offline, CI-safe — this is a hard rule, not a preference.
2. **Segment-level SHA-256 caching.** Cache key = `hash(model|locale|sourceText)`.
   One edited sentence re-translates one segment. The cache file is **committed**.
3. **Committed translations are authoritative over the cache.** Every run seeds the
   cache from the committed target files, overwriting stale entries. A human-reviewed
   correction in a translation file survives every regeneration until its *source*
   changes.
4. **Validate before publishing.** Placeholder parity, HTML tag-sequence parity,
   glossary enforcement (verbatim terms present; pinned translations present, plus a
   deterministic post-pass), structural mirror (key paths + array lengths), extra-key
   detection. Hard failures block the write.
5. **Dry-run planning.** `--dry-run` reports pending segments and estimated cost with
   zero API calls, so the spend is known before a cent is spent.

**Non-translatable string classes** (learned the hard way — each was a real bug):
URLs (`https://…`), asset paths (`pictures/joke63.webp`), bare page slugs
(`working-past-65.html` as an href field), keys prefixed `__`.

---

## 6. The glossary is enforcement, not documentation

String value = keep verbatim (brand/program term). Object value = pinned per-locale
translation, sourced from the regulator's own vocabulary (es.medicare.gov), never
invented.

Field results: **9 catches in 9 validation runs**, every one a real terminology drift a
human reviewer would miss at scale — "las Partes A y B" (dropped pinned "Parte A"),
"Ayuda Adicional" missing its load-bearing "(Extra Help)" parenthetical (the English
program name a beneficiary must recognize on SSA paperwork), a plural
"Períodos de Inscripción Especiales" that no longer contained the pinned singular.
Expect the natural-Spanish contraction of pinned compound terms to be your most common
failure mode.

---

## 7. Verification — the glyph bar, formalized

Byte-for-byte identity is unachievable and the wrong goal: converting a literal to an
expression changes whitespace; `.map()` drops HTML comments; scoped-style hashes shift.

**The bar: tag structure identical (scope-hashes stripped) + visible text identical
(whitespace-insensitive, entities decoded) + zero entity leaks.**

Expected-and-harmless deltas to whitelist in the harness:
- `<!-- comments -->` dropped by `.map()` conversions (invisible)
- whitespace normalization around new expressions
- the language switcher appearing on a page whose sibling was just translated —
  strip its text (`🌐English·Español`) before comparing against pre-translation snapshots
- intended i18n head additions: hreflang links, `og:locale`

**What the tag diff cannot catch:** `set:html` fragments receive no
`data-astro-cid-*` scope attribute (the diff strips those by design). Rule: **copy
rendered via `set:html` must never rely on page-scoped CSS** — review-time rule, not a
harness gate.

---

## 8. Metadata localization QA (per page, both locales)

- `<html lang>` correct
- self-referencing `<link rel="canonical">`
- hreflang triplet: self + sibling + `x-default` → master (bidirectional)
- `og:locale` (`en_US` / `es_US`)
- JSON-LD: localized headline/description/FAQ/breadcrumb **plus explicit
  `inLanguage`** — schema localizes automatically when it builds from the localized
  page context; the *language declaration* is the piece that must be added.
- Honesty check: `contactPoint.availableLanguage` describes the *phone line*, not the
  website. Don't claim Spanish support you don't staff.

---

## 9. Editing existing content (production maintenance)

**Rule: never edit a translated file first. Edit the English master; the pipeline does
the rest.**

- Source edit that *changes meaning* → segment hash changes → engine re-translates that
  one segment (`--dry-run` shows the cost first).
- Source edit whose approved translation is still valid → **seeding re-binds the
  committed translation to the new source hash: zero pending, zero cost.** Case study:
  the EN homepage NAP was missing its phone number — a pre-existing bug the extraction
  preserved losslessly and the ES translation surfaced. Fixing the master produced
  `Pending: 0` because the committed Spanish already said the right thing. This is
  professional-TM behavior and it fell out of the seeding design for free.
- A wrong *translation* (validator-passing but unnatural) → fix the committed target
  file; seeding makes the correction authoritative. If it's a terminology issue, pin
  the term in the glossary instead so it can never drift again.

**Annual CMS update (every January):** update `annualMedicareData.ts` → build →
`--check` → QA → deploy. Both languages update from the one edit (§4). Then review
year-bearing *slugs* (e.g. `-2026.html`) as a separate editorial decision.

---

## 10. Production SOP

### Per page (the factory)
```
snapshot built HTML → extract EN JSON → shared component → thin wrapper
→ register (content-pages.ts + COMPONENTS map) → build → 3-diff verify
→ translate (engine, or seed hand-authored es) → --check → build
→ ES QA (links/hreflang/schema) → commit
```

### Per batch (~5 pages) — release checklist
- Build ✅ EN+ES · typecheck ✅ · tests ✅
- `translate --check` ✅ (glossary/placeholders/tags/structure)
- 3-diff every extracted EN page ✅
- Navigation: switcher on every pair; zero relative page links on any `/es/` page;
  fallback links absolutized ✅
- SEO: canonical/hreflang/x-default/og:locale ✅
- Schema: localized + `inLanguage` ✅
- Release: commit → **annotated tag** (`i18n-batch-N`, QA record in the annotation)
  → push with tags → update roadmap notes
- Tags are the rollback points. "Spanish broke" six months from now starts at the last
  known-good tag, not at a commit dig.

### What only a human/browser can verify
Carousel clicks, autoplay timing, console errors, responsive layout, and — most
important for a YMYL site — **a native speaker reading several pages for naturalness.**
Machine translation validated by machine rules is necessary, not sufficient.

---

## 11. Gotchas (v2 additions to the v1 table)

| Gotcha | Detail |
|---|---|
| `set:html` gets no scope hash | Extracted copy can't use page-scoped CSS selectors (§7). |
| Astro collapses expression-adjacent whitespace | `{t(...)} <a>` renders `Por<a>`; `{a} {b}` fuses. Use explicit `{' '}`. Bites every literal→expression chrome conversion. |
| Literal→expression ends byte-identity forever | Move to the glyph bar the moment a component's text becomes an expression. |
| Asset paths / page slugs are flattened segments | The engine will happily send `pictures/x.webp` or `foo.html` to translation unless the non-translatable classes exclude them. |
| The homepage is special everywhere | Route param `path: undefined` (→ `/es.html` under `format:'file'`), sitemap needs the same special case, slug is `'index'`. Grep for every place slugs become URLs. |
| `as const` registries reject widened values | `hreflang: 'x-default'` vs the locale union — annotate the array type explicitly (v1's broadened-union gotcha, new costume). |
| Locale-aware chrome needs no prop threading | Every shared component derives `lang` from `Astro.url` (`getLangFromUrl`). No `<Footer lang=...>` plumbing anywhere. |
| Data labels vs dictionary keys | Nav/config labels and author job titles translate via a **label map keyed by the English string** (`localizeLabel`) — the data module stays the single English source; no key-refactor of config files. |

---

## 12. Replication checklist (new site: ForebearFind, Wernex, client work)

1. **Inventory reality** — URL policy (`format:'file'`? trailing slash?), where copy
   lives (inline? data modules?), sitemap situation, compliance text, external tools.
2. Locale registry + URL helpers, matched to the site's real URL policy.
3. `content.ts` — loader, master fallback, existence helpers, `localizeHref`,
   `hreflangAlternates`, deep href localization.
4. Glossary pinned to the **domain regulator/authority vocabulary** (for Medicare: CMS;
   for other domains find the equivalent — the customer's own official terminology).
5. **Extraction spike on one page + 3-diff harness.** Do not scale before this passes.
6. Chrome localization (three domains, §2) — verify EN glyph-identical.
7. Translation engine (§5) with the non-translatable classes and seeding from day one.
8. Factory pages in batches of ~5 with the SOP (§10), tagging each.
9. Generated locale sitemap from the i18n registry; register in the index.
10. Homepage/complex pages last, as dedicated milestones.
11. Shared modules as their own translation sources (Phase B).
12. Search Console + analytics; let real demand data drive additional languages.

---

## 13. Reference implementation state (2026-07-01)

- 16 bilingual pages: `/es.html` + 15 `/es/*.html`; every money page + homepage
- `sitemap-es.xml` generated from the registry (16 URLs, hreflang alternates)
- Chrome fully bilingual; compliance in CMS-published Spanish
- Known residuals (Phase B): `TURNING_65_STEPS`, `DECISION_PATHS`, `PAGE_INDEX`
  related-labels, news ticker, calculator pages; Sunfire quote tool is English-only
- Engine: `npm run translate -- --check | --all --dry-run | --locale es`
- Tags: `i18n-batch-1`, `i18n-batch-2`, `i18n-batch-3`, `i18n-homepage`

**If you read nothing else:** edit one language as data, with every string owned by
exactly one source. Generate the rest with a committed, cached, validated, opt-in AI
step whose committed output outranks its own cache. Gate every route, tag, link, and
sitemap entry on whether the translation exists. Prove the master renders
glyph-identically after every refactor — and let the QA surface the bugs that were
already there.
