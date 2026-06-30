# ADR-0004 — Build reusable frameworks before features

**Status:** Accepted · 2026-06-30

## Context
The site will have many calculators (IRMAA, Cost, Drug, Penalty, Timeline) and
many similar pages (drugs, locations). Built independently, each accretes ~400
lines and diverges.

## Decision
Build the **framework first**, then implement features as thin compositions. The
calculator framework (`src/components/calculator/` + `src/lib/calculators`) provides
Layout/Header/Section/Input/Result/Comparison/Warning/Disclaimer/Print/Share/CTA +
pure helpers; a calculator is then a `CalculatorField[]` + a pure compute function.
Same principle applies next to the SEO framework (ADR-0005) and content engine
(ADR-0006).

## Alternatives rejected
- **Build IRMAA first, extract patterns later.** Rejected: accrues duplication and
  tech debt; refactoring N live calculators later is riskier than designing once.

## Consequences
- Each calculator becomes ~80 lines; complexity is shared and tested once.
- Framework is verified (typecheck/build) but unwired until a feature uses it.
- See [APPLICATION-FRAMEWORK.md](../APPLICATION-FRAMEWORK.md).
