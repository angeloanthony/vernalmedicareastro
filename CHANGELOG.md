# Changelog

Notable changes to Vernal Medicare 2.0. Format: [Keep a Changelog](https://keepachangelog.com/).
This project documents an in-progress migration; entries are grouped by milestone.

## [Unreleased]

### Added — M6: Dual-Eligible content silo (2026-06-30)
- 5-page cluster: `/dual-eligible.html` (hub) + Extra Help, Medicare Savings
  Programs (QMB/SLMB/QI consolidated), D-SNP, Medicare+Medicaid/Utah. First
  Alta→Vernal content migration; data-driven from `annualMedicareData`; auto
  (`relatedFor`) + intentional in-content interlinking; rebranded (no Alta
  leakage). 48 → 53 pages, no existing URL changed. Tag `dual-eligible-v1`.

### Added — M5: IRMAA calculator (2026-06-30)
- Net-new `/medicare-irmaa-calculator.html`. `CalculatorPage` (composes
  `StandardPageLayout`, `HowTo` schema) + `lib/calculators/irmaa` (unit-tested);
  interactive estimate from `annualMedicareData`. Retired Phase-1
  `CalculatorLayout`. Tag `irmaa-v1`.

### Added — M3–M4: Page Framework + first migration (2026-06-30)
- `types/Page` (PageContext) · `data/authors` · `data/pageIndex` · `lib/schema`
  (`assembleSchema`, `@id`-linked entities) · `lib/related` (weighted) ·
  `StandardPageLayout` + content blocks + `ArticlePage`/`CalculatorPage`.
  Migrated `medicare-part-a-vs-part-b` as the proving page (URL preserved,
  schema enhanced). Tag `page-framework-proven`. ADRs 0008–0010.

### Added — Developer Quality Gate (2026-06-30)
- `npm run verify`: astro check (error-ratchet baseline) → Vitest → production build.
- Scripts: `typecheck`, `lint` (ESLint over the TS layer), `test`, `test:watch`, `verify`.
- Unit tests for `src/lib` (formatters, dates, validation, calculators) — 16 tests.
- CI workflow (`.github/workflows/ci.yml`) runs lint + verify on push/PR.
- `docs/VERIFICATION.md`; `docs/ADR/` (numbered records 0001–0007); `DECISIONS.md`
  becomes the ADR index. Git tag `foundation-complete` marks the Phase-1 rollback point.
- devDeps: `@astrojs/check`, `typescript`, `vitest`, `eslint`, `typescript-eslint`, `@eslint/js`.

### Added — Phase 1: Foundation (2026-06-30)
- **Data layer** (`src/data/`): `annualMedicareData.ts` (year-keyed CMS figures)
  + `figures.ts` accessor, `conditions.ts`, `drugs.ts` (14 featured drugs + 25
  assistance programs), and typed scaffolds (`parts`, `plans`, `providers`,
  `locations`, `counties`, `cities`, `faq/`, `reviews`, `news`, `glossary`,
  `constants`). Ported brand-neutral from AltaMedicare.
- **Type system** (`src/types/`): `Condition`, `Drug`, `MedicareFigures`,
  `Calculator`, `MedicarePlan`, `FAQ`, `Location`, `Provider` + barrel.
- **Application framework**: `src/lib/` (formatters, dates, validation,
  calculators, schema, seo, routing) and `src/config/` (site, seo, navigation,
  footer, social), each with a barrel.
- **Calculator framework**: `src/components/calculator/` — 11 components
  (Layout/Header/Section/Input/Result/Comparison/Warning/Disclaimer/Print/Share/CTA)
  + barrel. Component taxonomy folders scaffolded.
- **Docs**: MIGRATION.md (dashboard), DATA-ARCHITECTURE.md, APPLICATION-FRAMEWORK.md,
  ROADMAP.md, ARCHITECTURE.md, DECISIONS.md, CONTRIBUTING.md.

### Changed
- Renamed `cms.ts` → `annualMedicareData.ts` (ADR-007).

### Unchanged (by design)
- All 47 routes, every URL, `business.ts`, and existing pages/layouts. The
  foundation is additive and not yet wired into any page.
