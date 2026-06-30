# Decisions

Architecture decisions now live as numbered records in **[docs/ADR/](docs/ADR/)**
(one file each, ADR format: Status / Context / Decision / Alternatives /
Consequences). This page is the index.

| ADR | Title | Status |
|---|---|---|
| [0001](docs/ADR/0001-platform.md) | Platform: Vernal as base, Alta as engine | Accepted |
| [0002](docs/ADR/0002-url-policy.md) | URL policy: preserve every `.html` URL | Accepted |
| [0003](docs/ADR/0003-data-layer.md) | Data layer = single source of truth; types = contract | Accepted |
| [0004](docs/ADR/0004-calculator-framework.md) | Build reusable frameworks before features | Accepted |
| [0005](docs/ADR/0005-seo-framework.md) | SEO framework (head + structured data) | Proposed |
| [0006](docs/ADR/0006-content-engine.md) | Content engine (collections, FAQ, drug DB, search) | Proposed |
| [0007](docs/ADR/0007-migration-strategy.md) | Migration strategy & engineering process | Accepted |
| 0008 | Quality gate (`npm run verify`) — see [docs/VERIFICATION.md](docs/VERIFICATION.md) | Accepted |

## How to add a decision
Create `docs/ADR/NNNN-short-title.md` with Status / Context / Decision /
Alternatives / Consequences. Never rewrite an accepted record — supersede it with
a new one and mark the old one `Superseded by ADR-XXXX`. Add a row here.
