# Changelog

Notable changes to Vernal Medicare 2.0. Format: [Keep a Changelog](https://keepachangelog.com/).
This project documents an in-progress migration; entries are grouped by milestone.

## [Unreleased]

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
