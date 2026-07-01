# Architecture

Top-level map. Deep dives live in `docs/`.

```
src/
  types/      Contracts (interfaces). Barrel: types/index.ts
  data/       Single source of truth (typed content). business.ts = NAP.
  lib/        Pure helpers (formatters, dates, validation, calculators,
              schema, seo, routing). Barrel: lib/index.ts
  config/     Settings (site, seo, navigation, footer, social). Barrel: config/index.ts
  components/ Presentational (.astro). calculator/ = framework. Existing root
              components untouched; taxonomy folders scaffolded.
  layouts/    BaseLayout (the page shell) — unchanged.
  pages/      Routes (47). Unchanged. URL policy: build.format:'file' → /foo.html
public/       Static assets, hand-built sitemaps (preserved).
docs/         DATA-ARCHITECTURE.md, APPLICATION-FRAMEWORK.md
```

**Dependency rule (one-way):** `types ← data ← (lib, config) ← components ← pages`.
Types never import data; data never imports lib/config; components never define
facts; pages compose.

**Detail:**
- Data flow → [docs/DATA-ARCHITECTURE.md](docs/DATA-ARCHITECTURE.md)
- Application/calculator framework → [docs/APPLICATION-FRAMEWORK.md](docs/APPLICATION-FRAMEWORK.md)
- Decisions → [DECISIONS.md](DECISIONS.md) · Roadmap → [ROADMAP.md](ROADMAP.md)
- Migration status → [MIGRATION.md](MIGRATION.md)

**URL/SEO invariant:** the production build emits **47 pages**; no migration step
changes a URL without an explicit, recorded decision.
