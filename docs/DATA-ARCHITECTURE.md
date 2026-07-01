# Data Architecture

How data flows through Vernal Medicare 2.0. Read this before adding a data
module, a type, or a page that consumes data.

## The three layers

```
  ┌─────────────────────────────────────────────────────────────┐
  │  src/types/        CONTRACTS  (interfaces only, no runtime)   │
  │  Condition · Drug · MedicareFigures · Calculator ·           │
  │  MedicarePlan · FAQ · Location · Provider                    │
  └───────────────▲─────────────────────────────────────────────┘
                  │ imported by
  ┌───────────────┴─────────────────────────────────────────────┐
  │  src/data/         SINGLE SOURCE OF TRUTH  (typed content)    │
  │  business.ts (NAP) · annualMedicareData.ts → figures.ts ·    │
  │  conditions.ts · drugs.ts · plans.ts · parts.ts ·           │
  │  providers.ts · locations.ts · counties.ts · cities.ts ·    │
  │  faq/ · reviews.ts · news.ts · glossary.ts · constants.ts   │
  └───────────────▲─────────────────────────────────────────────┘
                  │ imported by  (LATER PHASES — none wired yet)
  ┌───────────────┴─────────────────────────────────────────────┐
  │  src/components/ + src/layouts/ + src/pages/   CONSUMERS      │
  │  render data → HTML.  Pages NEVER hardcode facts that belong  │
  │  in the data layer.                                          │
  └─────────────────────────────────────────────────────────────┘
```

**Dependency rule:** arrows point one direction only — `types ← data ← UI`.
Types never import data; data never imports a page; pages never define facts.

## Why this shape

- **One fact, one home.** A phone number, a 2026 premium, or a drug's conditions
  is defined in exactly one file. Change it once, every page updates.
- **The compiler enforces correctness.** Every record satisfies its interface,
  so a malformed drug or a missing figure fails at build time, not in production.
- **Pages become renderers.** Once a domain is in the data layer, new pages are
  template + data, not copy-paste — the path to hundreds of drug/location pages
  without duplicated code.

## Module responsibilities

| Module | Owns | Type |
|---|---|---|
| `business.ts` | NAP, brand, phone, geo, GA, disclaimer (Vernal identity) | local `Business` |
| `annualMedicareData.ts` | year-keyed CMS figures; `CURRENT_YEAR`; `figuresFor()` | `MedicareFigures` |
| `figures.ts` | accessor → `FIGURES` for the current year (no data) | `MedicareFigures` |
| `conditions.ts` | condition taxonomy; `ConditionKey`; `condLabel()` | `Condition` |
| `drugs.ts` | featured drugs, assistance programs, `programsForDrug()` | `Drug`, `Program` |
| `plans.ts` / `parts.ts` | plan products / Medicare Parts A–D | `MedicarePlan` / `MedicarePart` |
| `providers.ts` | hospitals, pharmacies, clinics | `Provider` |
| `locations.ts` | hub/sub-page URL + breadcrumb helpers | `Place`, `Crumb` |
| `counties.ts` / `cities.ts` | place records (Uintah Basin first) | `Place` |
| `faq/` | FAQ content by category (welds visible + JSON-LD) | `FAQCategory` |
| `reviews.ts` / `news.ts` / `glossary.ts` | reviews, news, glossary terms | local interfaces |
| `constants.ts` | shared non-NAP constants (external URLs, tool keys) | — |

## Conventions

- **Add a drug:** append to `FEATURED_DRUGS` in `drugs.ts` (+ its conditions);
  the page renders from the template — no new component.
- **Roll over the year:** add `FIGURES_2027` in `annualMedicareData.ts` and bump
  `CURRENT_YEAR`. Everything downstream updates.
- **Add a location:** add a `Place` to `counties.ts`/`cities.ts`; the location
  components handle the rest (Phase 5).
- **Never** put NAP/brand anywhere but `business.ts`. Never put a CMS figure
  anywhere but `annualMedicareData.ts`.
- **Imports:** data modules import types via `import type { X } from '../types/X'`.

## Status
The data layer is **defined but not yet wired into any page** — adding these
files changed zero routes and zero URLs (build still emits the same 47 pages).
Consumption happens later, one phase and one commit at a time (see
[MIGRATION.md](../MIGRATION.md)).
