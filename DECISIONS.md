# Architecture Decision Records

Why the project is built the way it is. Append a new record for every major
decision; never rewrite history (supersede instead). Format: ADR-lite.

---

### ADR-001 — Keep Vernal Astro as the base project
**2026-06-30 · Accepted**
Build "Vernal Medicare 2.0" on the existing Vernal Astro project; import Alta's
systems into it module by module.
- **Reason:** Vernal owns the live domain, rankings, URLs, NAP, brand, and
  hand-tuned schema. Preserving them is the highest priority.
- **Rejected:** Migrate Vernal into Alta, or rebuild from Alta. **Why rejected:**
  unacceptable SEO/ranking risk; Alta uses a different brand and geography.

### ADR-002 — Local-first positioning, expand in phases
**2026-06-30 · Accepted**
Stay the Uintah Basin specialist first; add Utah counties/cities later as quality
content is ready.
- **Reason:** Protect the existing local authority; no thin statewide launch.
- **Rejected:** Launch statewide immediately using Alta's Wasatch county pages.

### ADR-003 — One brand: Vernal Medicare (Rocco DeLuca)
**2026-06-30 · Accepted**
Alta's brand, NAP, analytics (`G-D6LJEQ61V0`), agent identity (Bret Swope), and
SunFire portal must not reach production. All migrated assets are rebranded.
- **Reason:** Single, consistent entity for trust + E-E-A-T.

### ADR-004 — Hold overlapping pages for Search Console data
**2026-06-30 · Accepted**
Where Alta and Vernal both cover a topic (Mounjaro/Ozempic/Insulin/Wegovy;
Supplement-vs-Advantage), keep both URLs and decide merge/keep on GSC data.
- **Reason:** Never blind-merge pages that may rank for distinct intents.
- **Rejected:** Merge/redirect on assumption.

### ADR-005 — Keep Vernal's presentation layer; import Alta's systems underneath
**2026-06-30 · Accepted**
Keep `BaseLayout`, `Header`, `Footer`, SEO, and `business.ts`. Import Alta's data
layer, collections, search, calculators, and engines beneath them.
- **Reason:** Vernal's layouts already carry brand + ranking signals; Alta's value
  is its framework, not its chrome.

### ADR-006 — Data layer is the single source of truth; types are the contract
**2026-06-30 · Accepted**
All content lives in `src/data/`, typed by `src/types/`. Pages render from data;
they never hardcode facts. Dependency direction: `types ← data ← (lib,config) ← components ← pages`.
- **Reason:** One fact, one home; compiler-enforced correctness; pages become
  thin renderers. See [docs/DATA-ARCHITECTURE.md](docs/DATA-ARCHITECTURE.md).

### ADR-007 — Rename `cms.ts` → `annualMedicareData.ts`
**2026-06-30 · Accepted**
- **Reason:** "CMS" is ambiguous (content-management system vs. Centers for
  Medicare & Medicaid Services). Year-keyed; `2027` is just another object.

### ADR-008 — Build reusable frameworks before features
**2026-06-30 · Accepted**
Build the calculator framework (and next the SEO framework) before any specific
calculator/page, so features are composition not duplication.
- **Reason:** A framework turns each calculator from ~400 lines into ~80.
- **Rejected:** Build IRMAA first, extract patterns later (accrues tech debt).

### ADR-009 — Process: design→implement, one architectural area per commit
**2026-06-30 · Accepted**
Each major feature: produce design (interfaces/layout) → review → implement.
Each commit covers one architectural area; verify (typecheck + build, 47 pages)
before commit.
- **Reason:** Small reviews; architecture decisions stay out of large diffs; SEO
  risk stays isolated and reversible.
