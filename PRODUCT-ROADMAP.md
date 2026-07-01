# Vernal Medicare — Product Roadmap

**What the platform *does*, not how many pages it has.** Each entry is a product
with a purpose, an audience, and a definition of "done" — so progress is measured
in capabilities delivered. Migration mechanics live in
[MIGRATION.md](MIGRATION.md); the authority strategy in
[docs/AUTHORITY-ARCHITECTURE.md](docs/AUTHORITY-ARCHITECTURE.md); the Alta plan in
[docs/ALTA-MIGRATION-PLAN.md](docs/ALTA-MIGRATION-PLAN.md).

Legend: ✅ live · 🚧 in progress · 📋 planned · ⏸ on hold

| Product | Status |
|---|---|
| Page Framework (ArticlePage/CalculatorPage/DrugPage + data layer) | ✅ |
| Medicare Help Center (master hub) | ✅ |
| Content silos (Enrollment · Costs · IRMAA · Medigap · Advantage · Part D · Dual-Eligible) | ✅ |
| Local Authority (13 Uintah Basin town pages + provider cluster) | ✅ |
| Decision Tools / Calculators (Cost · IRMAA · Penalty · Timeline) | ✅ |
| Drug Assistance Center (14 drug pages, data-driven) | ✅ |
| E-E-A-T / Trust layer (credentials · editorial policy · site-wide byline) | ✅ |
| **Glossary** | 🚧 M29 |
| **Turning-65 Center** | 📋 M30 |
| **News Center** | 📋 M31 |
| **Drug-Coverage Center** ("does Medicare cover X") | 📋 M32 |
| **On-site Search** | 📋 M33 |
| Statewide (Wasatch-Front counties) | ⏸ local-first first |

---

## Live products

### Medicare Help Center ✅
- **Purpose:** one front door that branches to every topic; the site's topical spine.
- **Audience:** anyone starting a Medicare question ("where do I begin?").
- **Success:** every silo pillar reachable in one click; in the primary nav on every page.
- **Future:** add Glossary, Turning-65, News branches as they ship.

### Local Authority (Uintah Basin) ✅
- **Purpose:** own every local Medicare search in the Basin — the moat national sites can't copy.
- **Audience:** residents of Vernal, Roosevelt, Duchesne, and 10 more Basin towns.
- **Success:** each town interlinks plans, providers, enrollment, reviews, FAQ, quote, and official resources.
- **Future:** per-town provider depth; statewide only after E-E-A-T supports it.

### E-E-A-T / Trust layer ✅
- **Purpose:** prove expertise and trust on a YMYL Medicare site.
- **Audience:** every visitor + search engines evaluating credibility.
- **Success:** credentials + editorial policy live; every article byline links "how we keep this accurate."
- **Future:** add Rocco's verifiable specifics (license #, NPN, carriers) → Person schema.

### Decision Tools / Calculators ✅
- **Purpose:** turn abstract rules into a number for the user's situation.
- **Audience:** people comparing costs or checking penalties/timing.
- **Success:** 4 calculators, pure-compute unit-tested, fed by the single-source data layer.
- **Future:** plan-finder / formulary lookup (evaluate from Alta).

### Drug Assistance Center ✅
- **Purpose:** help people afford specific medications.
- **Audience:** beneficiaries struggling with drug costs.
- **Success:** 14 data-driven drug pages + assistance-program database.
- **Future:** extend `drugs.ts`; pair with the coming Drug-Coverage Center (different intent).

---

## In progress / planned

### Glossary 🚧 (M29)
- **Purpose:** define every Medicare term once; become an internal-link + long-tail multiplier.
- **Audience:** confused readers on any page; long-tail "what is IRMAA / MOOP / creditable coverage" searches.
- **Success:** a term data model + index, with the highest-value terms scalable to their own authority pages (definition → related pillar → calculator → FAQ).
- **Future:** auto-link glossary terms in article body copy.

### Turning-65 Center 📋 (M30)
- **Purpose:** the definitive "I'm turning 65" funnel — the highest-intent Medicare journey.
- **Audience:** people aging in (and their families).
- **Success:** hub → timeline · checklist · employer-coverage · delay-Part-B · enrollment windows · plan choices, all interlinked to a quote.
- **Future:** birthday-based timeline tool (reuse the enrollment-timeline calculator).

### News Center 📋 (M31)
- **Purpose:** timely Medicare updates that complement the evergreen guides.
- **Audience:** returning visitors, "2026/2027 changes" searchers.
- **Success:** a news framework (categories, RSS) + curated, Vernal-authored articles; figures from the data layer.
- **Future:** local Basin news; seasonal AEP coverage.

### Drug-Coverage Center 📋 (M32)
- **Purpose:** answer "does Medicare cover [drug]?" — distinct from "help paying for it."
- **Audience:** people prescribed a specific drug checking coverage.
- **Success:** 14 net-new coverage pages, interlinked with Part D + assistance; GSC-overlap drugs held pending data.
- **Future:** resolve the 4 held drugs from Search Console.

### On-site Search 📋 (M33)
- **Purpose:** let users find anything fast; improve crawl + UX.
- **Audience:** all visitors.
- **Success:** Pagefind (or equivalent) search over all pages, no external dependency.

### Statewide ⏸ (hold)
- **Purpose:** expand beyond the Basin to Utah counties.
- **Hold reason:** local-first is locked; statewide dilutes the moat and outruns E-E-A-T. Revisit only when the Basin is fully owned and expertise can be credibly claimed elsewhere.
