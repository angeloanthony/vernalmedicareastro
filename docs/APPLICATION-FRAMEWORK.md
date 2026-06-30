# Application Framework

The reusable layer that sits between the data layer and the pages. Built so
every future tool/page is **composition, not duplication**. Nothing here is wired
into a page yet.

## Layering

```
  types/      contracts (interfaces)
     ▲
  data/       single source of truth (content)
     ▲
  lib/        pure helpers          config/   settings
     ▲                                 ▲
  components/ presentational (.astro) ─┘
     ▲
  pages/      routes — compose components + data + lib + config
```

Dependency direction is one-way: `types ← data ← (lib, config) ← components ← pages`.
No cycles: types never import data; data never imports lib/config; components
never define facts.

## `src/lib/` — pure helpers

| Module | Provides |
|---|---|
| `formatters` | `usd`, `percent`, `number` |
| `dates` | `formatDate`, `addMonths`, `ageOn`, `daysBetween` |
| `validation` | `toNumber`, `clamp`, `inRange`, `isPositive` |
| `calculators` | framework: `bracketIndex`, `CalculatorCompute`, `readFields`, `renderResults`, `bindCalculator` |
| `schema` | JSON-LD builders: `faqPageSchema`, `breadcrumbSchema`, `articleSchema` |
| `seo` | `canonical`, `titleWithBrand`, `ogImageUrl` |
| `routing` | `slugify`, `htmlHref`, `isActive` (encodes the `.html` URL policy) |

## `src/config/` — settings

`site` · `seo` · `navigation` · `footer` · `social`. These compose from
`data/business.ts` (no NAP duplication) and hold presentation/SEO settings and
nav/footer link data (mirroring the current `Header`/`Footer` for a future
refactor — those components are untouched for now).

## `src/components/calculator/` — the calculator framework

| Component | Role |
|---|---|
| `CalculatorLayout` | shell (wraps `BaseLayout`); slots: `inputs`, `actions`, `results`, default body; wires generic Print/Share |
| `CalculatorHeader` | H1 + intro + **E-E-A-T reviewer byline** (author from `business.ts`) |
| `CalculatorSection` | titled group of inputs |
| `CalculatorInput` | one control from a `CalculatorField` (emits `data-calc-field`/`-type`) |
| `CalculatorResult` | results region; SSR fallback + `[data-calc-results]` for live updates |
| `CalculatorComparison` | generic comparison table |
| `CalculatorWarning` | caveat/callout (info/warning/danger) |
| `CalculatorDisclaimer` | "estimate only" + TPMO disclaimer (from `business.ts`) |
| `CalculatorPrint` / `CalculatorShare` | actions (behaviour wired generically by `CalculatorLayout`) |
| `CalculatorCTA` | conversion block (phone + quote from `business.ts`) |

### How a calculator is built (illustrative — NOT yet implemented)

A future calculator = a field list + a pure compute function + ~a dozen lines of
markup. All complexity lives in the framework:

```astro
---
// pages/medicare-irmaa-calculator.astro  (ILLUSTRATIVE)
import CalculatorLayout from '../components/calculator/CalculatorLayout.astro';
import CalculatorInput from '../components/calculator/CalculatorInput.astro';
import CalculatorResult from '../components/calculator/CalculatorResult.astro';
import CalculatorPrint from '../components/calculator/CalculatorPrint.astro';
import { canonical } from '../lib/seo';
const fields = [/* CalculatorField[] */];
---
<CalculatorLayout title="…" description="…" canonical={canonical('/medicare-irmaa-calculator.html')}
  heading="2026 IRMAA Calculator" updated="June 2026">
  {fields.map((f) => <CalculatorInput slot="inputs" field={f} />)}
  <CalculatorPrint slot="actions" />
  <CalculatorResult slot="results" />
</CalculatorLayout>
<script>
  import { bindCalculator } from '../lib/calculators';
  import { figuresFor } from '../data/annualMedicareData';
  // compute(fields) → CalculatorResult, using figuresFor().irmaa  (built in Phase 3)
</script>
```

The math (`figuresFor().irmaa` + `bracketIndex`) is the only calculator-specific
code; layout, inputs, results, print, share, disclaimer, CTA, and SEO are shared.

## Status
Framework only — **no calculator, FAQ, or content built; nothing imported by any
page.** Build still emits the same 47 pages; every URL unchanged. The `.astro`
components are not in the build graph until a page imports them. See
[MIGRATION.md](../MIGRATION.md).
