# ADR-0003 — Data layer is the single source of truth; types are the contract

**Status:** Accepted · 2026-06-30

## Context
Vernal hand-codes facts (figures, FAQs, schema) inline across pages, causing
drift risk. Alta proved a data-driven model (typed data → templated pages).

## Decision
All content lives in `src/data/`, typed by `src/types/`. Pages render from data;
they never hardcode a figure, phone number, or drug fact. Dependency direction is
one-way: `types ← data ← (lib, config) ← components ← pages`. `business.ts` owns
NAP; `annualMedicareData.ts` owns year-keyed CMS figures.

## Alternatives rejected
- **Keep inline per-page content.** Rejected: drift, duplication, no compile-time
  safety, no path to data-driven scale (hundreds of drug/location pages).

## Consequences
- One fact, one home; the compiler enforces record shape.
- Pages become thin renderers.
- `cms.ts` renamed to `annualMedicareData.ts` to avoid the CMS ambiguity
  (content-management vs. Centers for Medicare & Medicaid Services).
- See [DATA-ARCHITECTURE.md](../DATA-ARCHITECTURE.md).
