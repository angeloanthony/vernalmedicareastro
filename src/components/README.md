# Component Architecture

Reusable presentational components, grouped by responsibility. Pages compose
these + read from `src/data` (via `src/types`) using helpers in `src/lib` and
settings in `src/config`. See [../../docs/APPLICATION-FRAMEWORK.md](../../docs/APPLICATION-FRAMEWORK.md).

```
src/components/
  calculator/   Calculator framework (built) — Layout/Header/Section/Input/
                Result/Comparison/Warning/Disclaimer/Print/Share/CTA
  seo/          Meta, JSON-LD, canonical, breadcrumb emitters        (scaffold)
  layout/       Page shells, sections, grids                         (scaffold)
  navigation/   Header, footer, breadcrumb nav, in-page nav          (scaffold)
  cards/        Topic/article/tool/drug/location cards               (scaffold)
  content/      Prose blocks, callouts, summary box, related band    (scaffold)
  faq/          Welded FAQ accordion + FAQPage schema                (scaffold)
  forms/        Inputs, fieldsets, contact/quote forms               (scaffold)
  ui/           Buttons, badges, tabs, accordions, primitives        (scaffold)
```

**Migration note:** Vernal's existing components (`Header.astro`, `Footer.astro`,
`FAQ.astro`, `Breadcrumbs.astro`, `LocalBusinessSchema.astro`, `SummaryBlock.astro`)
remain at the components root and are **untouched** — moving them into the folders
above is a Phase 6 cleanup so we never disturb working imports in `BaseLayout`.
Empty folders hold a `.gitkeep` until first populated.
