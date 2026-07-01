# Alta Migration Master Plan (M28)

**Status:** planning only — **no code, no redirects, no content changes.** This
classifies every AltaMedicare asset against the Vernal authority architecture
([AUTHORITY-ARCHITECTURE.md](AUTHORITY-ARCHITECTURE.md)) and sequences the work.

**The governing question — asked once per Alta asset:** *does this make
vernalmedicare.com a stronger authority for OUR geography (Uintah Basin) and
brand?* Not "can we import it?" If it strengthens an existing or planned Vernal
cluster → adapt it in (rebranded). If not → leave it.

**Non-negotiables (ADR-0007 / positioning):** never import Alta's brand, NAP,
agent identity (Bret Swope / Orem), analytics, or Wasatch-Front geography. Author
→ Rocco. Figures → Vernal's `annualMedicareData`. URLs → Vernal's scheme.

**Source inventory (`vernalmedicaremerge`, Astro):** ~155 built pages = 46 route
files + ~67 blog/news content entries + a Utah-county cluster + a glossary +
Pagefind search + a tools hub.

---

## Deliverable 1 — URL inventory & classification

Statuses: **Keep** (import ~as-is, rebrand) · **Rewrite** (topic valuable, redo
for Vernal) · **Merge** (fold into an existing Vernal page) · **Redirect** (Vernal
already has a stronger page) · **Archive/Hold** (preserve, don't expose yet) ·
**Ignore** (no value here).

| Alta asset | Count | Status | Rationale |
|---|---:|---|---|
| `index`, `about`, `contact` (Alta brand) | 3 | **Ignore** | Vernal has its own home/about/contact + brand. |
| Topic pillars: `medicare-basics`, `medicare-advantage`, `medicare-supplement`, `prescription-drug-plans`, `dual-eligible` | 5 | **Redirect** | Vernal already has pillars for each. Mine for any missing sub-points, don't republish. |
| `turning-65` | 1 | **Rewrite → CREATE** | **Fills a real Vernal gap** (no Turning-65 hub today). High value. |
| `medicare-glossary` | 1 | **Keep → import** | **Reference gap (score 0).** Brand-neutral; big internal-link multiplier. |
| Pagefind `search` | 1 | **Keep → import** | Tool gap; on-site search lifts UX + crawl. |
| `tools` hub | 1 | **Merge** | Fold into the Vernal Help Center + calculators; don't duplicate the hub. |
| `dental-vision-hearing` | 1 | **Rewrite** | Coverage gap Vernal lacks; localize. |
| `drug-savings` | 1 | **Merge** | Into Vernal `prescription-drug-assistance`. |
| **Utah county cluster** (`utah/*` — Salt Lake, Davis, Weber, Utah, Washington × {hub, MA, Supplement, Part D}) | ~24 | **Archive/Hold** | **Statewide Wasatch-Front — violates local-first (locked).** Revisit only after the Basin is deep AND E-E-A-T supports a statewide claim. |
| Blog — **net-new drug coverage** (`does-medicare-cover-{dupixent,eliquis,enbrel,entresto,farxiga,humira,jardiance,repatha,rinvoq,skyrizi,trelegy,trulicity,xarelto,zepbound}`) | 14 | **Rewrite → import** | **Coverage-cluster gap.** Complements (≠ duplicates) Vernal's drug-*assistance* pages; different intent ("does Medicare cover X" vs "help paying for X"). |
| Blog — **GSC-overlap drug coverage** (`insulin, mounjaro, ozempic, wegovy`) | 4 | **Hold** | Overlap Vernal's GSC-held drug pages. Decide merge-vs-hold from Search Console data first. |
| Blog — educational overlapping Vernal pillars (`irmaa-brackets`, `d-snp-plans`, `qmb-vs-slmb-vs-qi`, `medicare-savings-programs`, `extra-help-explained`, `annual/initial/general-enrollment`, `late-enrollment-penalties`, `medicare-advantage-vs-medigap`, `how-much-does-medicare-cost`, `medicaid-income-limits`, `medicare-and-medicaid`, dual-eligible set…) | ~20 | **Merge / Redirect** | Vernal already owns these topics. **Do NOT republish (cannibalization).** Harvest any missing sub-angle into the existing Vernal page. |
| Blog — depth Vernal lacks (`can-i-delay-part-b`, `medicare-and-employer-coverage-after-65`, `medicare-timeline-explained`, `medicare-checklist-turning-65`) | ~4 | **Rewrite** | Genuine additions — feed the Turning-65 / enrollment clusters. |
| Blog — timely/updates (`inflation-reduction-act`, `medicare-changes-for-2027`, `new-part-d-rules`) | 3 | **Rewrite → News** | Belong in the News center, refreshed for Vernal. |
| **News** (`part-d-2000-cap`, `insulin-35-cap`, `medicare-advantage-changes-2026`, `medicare-glp-1-bridge-2026`, `medicare-scam-calls-alert`, `extra-help-missed-savings`) | 6 | **Keep → import** | **News gap (score 20).** Import the news framework + these, author → Rocco. |
| Data/infra (`drug-assistance-data`, `medicare-figures`, `llms.txt`, `sitemap`, `[drug]-assistance-program`) | 5 | **Ignore** | Vernal has its own (`drugs.ts`, `annualMedicareData`, sitemaps, drug template). Compare drug lists to extend `drugs.ts` only. |

**Net:** of ~155 Alta pages, roughly **~25 import/create**, **~24 hold (statewide)**,
**~24 merge/redirect (already covered)**, rest ignore. This is curation, not a port.

---

## Deliverable 2 — Authority mapping (Alta asset → Vernal silo)

| Vernal silo | Gets from Alta |
|---|---|
| `medicare-101` / Help Center | **Turning-65 hub** (new); depth articles (delay Part B, employer coverage, timeline) |
| `part-d` / coverage | **14 net-new drug-coverage articles** (new "does Medicare cover X" cluster) |
| `reference` (new) | **Glossary** |
| `news` (new/rebuilt) | **News framework + 6 articles** + the 3 timely blog updates |
| `tools` | **On-site search** (Pagefind); tools hub folds into Help Center |
| coverage | **dental-vision-hearing** |
| `part-d` (data) | extend `drugs.ts` with any Alta drugs not already featured |
| *(hold)* statewide | Utah county cluster — not mapped until local-first is satisfied |

Every "import/create" asset has a Vernal home before it moves. Anything without a
home is Ignore/Hold.

---

## Deliverable 3 — Gap analysis

**Immediate wins** (content we wish we already had):
- **Glossary** (reference, score 0 → fills it).
- **Turning-65 hub** (blueprint gap; huge intent).
- **News center + 6 articles** (timely, score 20).
- **14 net-new drug-coverage articles** (coverage cluster).
- **On-site search** (Pagefind).

**Medium priority:**
- dental-vision-hearing; timely update articles (IRA / 2027 / new Part D rules);
  enrollment-depth articles (delay Part B, employer coverage after 65).

**Low priority / defer:**
- Overlapping educational blog (merge/skip — Vernal already ranks these).
- Utah county / statewide cluster (hold — local-first).
- GSC-overlap drug pages (hold — Search Console first).

---

## Deliverable 4 — Redirect matrix (design only)

Two cases. **We are copying Alta content into vernalmedicare.com; we are not
importing altamedicare.com's URLs.** So:

1. **On vernalmedicare.com:** imported content gets Vernal-scheme URLs (e.g.
   `/medicare-glossary.html`, `/turning-65.html`, `/does-medicare-cover-<drug>.html`,
   `/medicare-news/...`). No internal redirects needed.
2. **If altamedicare.com is retired/consolidated later:** 301 each Alta URL to its
   Vernal home. Design (implement only if/when Alta is sunset):

| Old Alta URL | → Vernal target |
|---|---|
| `/medicare-glossary` | `/medicare-glossary.html` (imported) |
| `/turning-65` | `/turning-65.html` (imported) |
| `/blog/does-medicare-cover-<drug>` | `/does-medicare-cover-<drug>.html` (imported) or the Vernal drug-assistance page |
| `/medicare-news/<slug>` | `/medicare-news/<slug>.html` (imported) |
| `/medicare-basics`, `/medicare-advantage`, `/medicare-supplement`, `/prescription-drug-plans`, `/dual-eligible` | Vernal pillar for that topic |
| `/utah/<county>/…` | Vernal Help Center (until statewide exists) |
| `/blog/<overlapping-topic>` | the Vernal pillar that owns the topic |

---

## Deliverable 5 — Migration waves

Small, verifiable waves — one branch/PR/tag each, same discipline as Phase I.

- **Wave 1 (M29) — highest value, low overlap:** Glossary · Turning-65 hub ·
  News framework + 6 articles. (Each a clean gap-fill; minimal cannibalization risk.)
- **Wave 2 (M30) — coverage cluster:** the 14 net-new drug-coverage articles as a
  data-driven cluster, interlinked with Part D + drug-assistance. On-site search.
- **Wave 3 (M31) — depth & timely:** dental-vision-hearing; enrollment-depth
  articles (delay Part B, employer coverage); timely updates → News.
- **Wave 4 (later) — cleanup & defer:** merge/redirect overlapping educational;
  resolve GSC-hold drug pages from Search Console; **statewide county cluster only
  if/when local-first is satisfied and E-E-A-T supports it.**

---

## Deliverable 6 — Risk report

| Risk | Pages | Mitigation |
|---|---|---|
| **Cannibalization** — Alta educational duplicates Vernal pillars (IRMAA, enrollment, dual-eligible, costs) | ~20 | **Do not republish.** Merge missing angles into the existing Vernal page; 301 if Alta is sunset. |
| **Duplicate intent** — GSC-held drugs (insulin/mounjaro/ozempic/wegovy) exist on both | 4 + Vernal's held | Decide from **Search Console** data before creating/importing; never run two live pages for one intent. |
| **Coverage vs assistance confusion** — "does Medicare cover X" vs "help paying for X" | 14 + Vernal's 14 assistance | Keep intents separate; **interlink**, don't merge. Distinct titles/canonicals. |
| **Local-first dilution** — statewide county pages weaken the Basin moat + claim expertise we can't back | ~24 | **Hold.** Statewide only after Basin depth + E-E-A-T for those areas. |
| **Ranking/backlink loss** — any Alta page with existing GSC impressions/links | unknown | Pull **Search Console** before Wave 1; 301 ranked Alta URLs to the Vernal equivalent; don't orphan link equity. |
| **Brand/geo/analytics leak** | all | Scrub on import: no Alta brand/NAP/Bret/Orem/Wasatch/analytics; author → Rocco; figures → `annualMedicareData`. |
| **Data currency** — Alta figures may be stale | figures/blog | Re-source every number through Vernal's data layer on import. |

---

## Deliverable 7 — Migration Score

Score each import/create asset so the highest-impact work is always chosen first.
**SEO value** (1–10, topical authority + intent value) · **Difficulty** (1–10,
build + data-sourcing effort) · **Priority** = value-to-effort, ⭐ = do sooner.

| Product / asset | SEO value | Difficulty | Priority | Milestone |
|---|:---:|:---:|:---:|---|
| **Glossary** (framework, term-scalable) | 10 | 3 | ⭐⭐⭐⭐⭐ | M29 |
| **Turning-65 Center** | 10 | 4 | ⭐⭐⭐⭐⭐ | M30 |
| **News Center** (framework + 6) | 8 | 4 | ⭐⭐⭐⭐ | M31 |
| **Drug-coverage cluster** (14 net-new) | 9 | 5 | ⭐⭐⭐⭐ | M32 |
| **On-site search** (Pagefind) | 7 | 2 | ⭐⭐⭐ | M33 |
| Dental / Vision / Hearing | 7 | 3 | ⭐⭐⭐ | Wave 3 |
| Turning-65 depth (delay Part B, employer coverage) | 6 | 3 | ⭐⭐⭐ | with M30 |
| Timely updates → News (IRA, 2027, new Part D rules) | 6 | 3 | ⭐⭐⭐ | with M31 |
| GSC-overlap drugs (insulin/mounjaro/ozempic/wegovy) | 8 | 6 | ⏸ hold | post-GSC |
| Statewide county cluster | 6 | 8 | ⏸ hold | local-first first |

Ordering the ⭐⭐⭐⭐⭐ items first (Glossary, Turning-65) maximizes value-per-effort
and lifts the whole site (glossary links everywhere; turning-65 is a top funnel).

## What M28 does NOT do

No pages moved, no redirects implemented, no code. The next step (**M29 = Wave 1**)
takes the top of this plan — Glossary, Turning-65, News — and builds it into
Vernal on the framework, rebranded, one PR at a time, exactly as Phase I ran.
Before Wave 1, pull **Search Console** so the ranking/duplicate-intent risks above
are decided on data, not guesses.
