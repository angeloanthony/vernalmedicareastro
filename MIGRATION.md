# Vernal Medicare 2.0 — Migration Dashboard

**The master checklist for merging Alta's framework into Vernal's project.**

Strategy (locked): **Vernal is the vehicle, Alta is the engine.** We keep the
Vernal Astro project, layouts, URLs, SEO config, brand, and `business.ts`, and
import Alta's *systems* (data layer, collections, search, calculators, drug DB,
location engine) underneath them — module by module, lowest-risk first. Nothing
that carries Alta's brand, NAP, agent identity, analytics, or geography goes to
production.

## Locked decisions

| Decision | Choice |
|---|---|
| **Platform direction** | Keep the **Vernal** Astro project as the base. Import Alta systems module-by-module. Never replace the project wholesale. |
| **Positioning** | **Local first** (Uintah Basin / Rocco), then expand to Utah counties/cities in phases as quality content is ready. No statewide launch all at once. |
| **Brand** | **One brand: Vernal Medicare**, author **Rocco DeLuca**. Alta brand/NAP/analytics/agent (Bret Swope, Orem, `G-D6LJEQ61V0`, sunfire `5454608`) must **not** reach production. |
| **Overlapping drug pages** (Mounjaro / Ozempic-Wegovy / Insulin / Wegovy) | **Hold for Search Console data.** Do not merge or redirect until impressions/clicks/rankings are known. |
| **Layouts / presentation** | **Keep Vernal's** BaseLayout / Header / Footer / SEO / schema. Import Alta capabilities *under* them, not Alta's MainLayout chrome. |

## Phase plan

| Phase | Focus | Contents |
|---|---|---|
| **1 — Infrastructure** | data layer + **type system** + collections, search, utilities | ← *in progress* |
| **2 — SEO** | schema, breadcrumbs, FAQ engine, author entity, canonicals | |
| **3 — Calculators** | framework first, then IRMAA, Cost, Drug, Timeline, Penalty (Vernal layout, fed by `annualMedicareData.ts`) | |
| **4 — Content** | IRMAA, Drug Assistance, Dual-Eligible, Enrollment (SEP/GEP/IEP) | |
| **5 — Location engine** | counties, cities, hospitals, pharmacies (Uintah Basin first) | |
| **6 — Performance** | cleanup, dedupe, image optimization, build/QA | |

> **Process rule:** one architectural area per commit (data layer → type system →
> FAQ engine → calculator framework → IRMAA → …). Keeps Git history clean,
> reviews small, and SEO risk isolated.

### Architecture
- **Data flow & layering:** see [docs/DATA-ARCHITECTURE.md](docs/DATA-ARCHITECTURE.md).
- **Application framework:** see [docs/APPLICATION-FRAMEWORK.md](docs/APPLICATION-FRAMEWORK.md).
- **Contract layer:** `src/types/` — `Condition`, `Drug`, `MedicareFigures`,
  `Calculator`, `MedicarePlan`, `FAQ`, `Location`, `Provider`. Data modules import
  these; pages will too.
- **Helper layer:** `src/lib/` — `formatters`, `dates`, `validation`, `calculators`
  (framework), `schema`, `seo`, `routing`. **Settings:** `src/config/` — `site`,
  `seo`, `navigation`, `footer`, `social`.
- **Component framework:** `src/components/calculator/` (11 components, built) +
  taxonomy folders (`seo/`, `layout/`, `navigation/`, `cards/`, `content/`, `faq/`,
  `forms/`, `ui/` — scaffolded). Existing root components untouched.
- **Rename:** `cms.ts` → **`annualMedicareData.ts`** (avoids CMS = content-management
  vs. Centers-for-Medicare ambiguity). `figures.ts` remains the current-year accessor.

### Process (adopted)
Two-step cycle per major feature: **design** (architecture/interfaces/file layout,
no production code) → review → **implement** exactly that design. Keeps reviews
small and architecture decisions out of large diffs. Still one architectural area
per commit.

## Feature decision matrix

| Feature / System | Vernal | Alta | Decision | Phase | Status |
|---|---|---|---|---|---|
| Business NAP (`business.ts`) | ✅ | ❌ (Alta NAP) | **Keep Vernal** | — | Done |
| Layouts / Header / Footer | ✅ | ✅ (Bret brand) | **Keep Vernal** | — | Done |
| Annual figures (`cms.ts`/`figures.ts`) | ❌ | ✅ (`figures.ts`) | **Import Alta → Vernal `cms.ts`** | 1 | **Done** |
| Drug DB (`drugs.ts` + `conditions.ts`) | ❌ | ✅ (`drugAssistance.ts`) | **Import Alta** | 1 | **Done** |
| FAQ engine (`faq.ts` + types) | Partial (component only, unused) | ✅ (`faq/*.ts`) | **Import Alta, scrub NAP** | 1 | Pending |
| Content collections (blog/news) | ❌ | ✅ | **Import Alta config + content (rebrand author)** | 1 | Pending |
| On-site search (Pagefind) | ❌ | ✅ | **Import Alta** | 1 | Pending |
| Dynamic sitemap / llms / rss | ❌ (manual, drifting) | ✅ | **Import Alta** | 1/2 | Pending |
| Location engine (`locations.ts` + components) | ❌ | ✅ (Wasatch data) | **Import framework, reseed Uintah Basin** | 5 | Pending |
| Application framework (`src/lib`, `src/config`, calculator components) | ❌ | partial | **Built (Vernal-native)** | 1/3 | **Done** |
| Calculators (11) | ❌ | ✅ (`public/*.html`) | **Rebuild on framework, feed from `annualMedicareData.ts`** | 3 | Pending |
| Glossary | ❌ | ✅ | **Import** | 3 | Pending |
| Drug-assistance finder + `[drug]` template | ❌ | ✅ | **Import (rebrand CTAs)** | 4 | Pending |
| Breadcrumbs | Partial (component, unused) | Partial | **Improve + wire up** | 2 | Pending |
| Author entity / E-E-A-T | ❌ | Partial (Bret) | **Build for Rocco** | 2 | Pending |
| Privacy/Terms bug | 🔴 broken | — | **Fix (Vernal-side)** | 2 | Pending |
| Reviews canonical bug | 🔴 broken | — | **Fix (Vernal-side)** | 2 | Pending |

## Data layer — file-by-file

Target shape (`src/data/`): `business.ts` (Vernal, kept) · `cms.ts` · `figures.ts` ·
`conditions.ts` · `drugs.ts` · `faq.ts` · `locations.ts` · `counties.ts` ·
`cities.ts` · `providers.ts` · `plans.ts` · `medicare.ts`.

Each module is typed by a contract in `src/types/`. ✅ = present & typecheck-clean.
**Empty scaffolds are intentional** — the structure is fixed now so future work
slots in without reorganizing.

| File | Source | Status | Notes |
|---|---|---|---|
| `business.ts` | Vernal | ✅ Done | Single source of truth for NAP/brand — untouched |
| `annualMedicareData.ts` | Alta `figures.ts` | ✅ **Imported** | Year-keyed CMS figures; `2027` is just another object (renamed from `cms.ts`) |
| `figures.ts` | derived | ✅ **Imported** | Accessor → current-year `FIGURES` |
| `conditions.ts` | Alta `drugAssistance.ts` | ✅ **Imported** | Condition taxonomy; uses `types/Condition` |
| `drugs.ts` | Alta `drugAssistance.ts` | ✅ **Imported** | Programs + featured drugs + matcher; uses `types/Drug` |
| `parts.ts` | new | ✅ Scaffold | Medicare Parts A–D (empty; Phase 4) |
| `plans.ts` | new | ✅ Scaffold | Plan-type reference (empty; Phase 4) |
| `providers.ts` | new | ✅ Scaffold | Ashley, UBMC, Smith's, Walgreens (empty; Phase 5) |
| `locations.ts` | Alta `places.ts` | ✅ Scaffold | Framework helpers ported; `PLACES` empty (Phase 5) |
| `counties.ts` | new | ✅ Scaffold | Uintah, Duchesne (empty; Phase 5) |
| `cities.ts` | new | ✅ Scaffold | Vernal, Roosevelt, Naples, Maeser… (empty; Phase 5) |
| `faq/index.ts` | Alta `faq/*.ts` | ✅ Scaffold | Aggregator (empty; import + NAP-scrub Phase 1 cont.) |
| `reviews.ts` | new | ✅ Scaffold | Future home for inline reviews (Phase 2) |
| `news.ts` | new | ✅ Scaffold | News items / Annual Center (Phase 4) |
| `glossary.ts` | Alta glossary | ✅ Scaffold | 100+ terms (Phase 3) |
| `constants.ts` | Alta `consts.ts` | ✅ Scaffold | Shared non-NAP constants (NAP stays in `business.ts`) |

### Type system (`src/types/`)
`Condition` · `Drug` · `MedicareFigures` · `Calculator` · `MedicarePlan` · `FAQ` ·
`Location` · `Provider` — all present; data modules import them.

### Safety note
The data + type layers are **not referenced by any page**. They are additive
only: the production build still emits the same **47 pages** and every URL is
unchanged. Wiring into pages happens in later phases, one area per commit, each
verified against the live site.
