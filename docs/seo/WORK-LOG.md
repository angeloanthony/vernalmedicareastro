# Work Log

Every content change is logged here **before** the edit is made, per the two
project rules in `docs/ROADMAP.md`:

1. **Name the metric** — the expected outcome must be one of the tracked
   metrics (CTR, average position, topical completeness, internal linking,
   AI extractability, conversions).
2. **The Optimization Hypothesis** — exactly one sentence:
   *We expect this change to improve X because Y.*

After Google's recrawl, come back and fill in the **Outcome** from the Delta
report. An unfilled Outcome is an open experiment, not a finished task.

Experiments carry a stable `EXP-NNN` identifier assigned in
`docs/seo/EXPERIMENTS.md` (the Experiment Registry — canonical index and
lifecycle definition). New experiments get their ID there when the baseline
is written; entries below reference it as **Registry:** EXP-NNN.

## Entry format

```markdown
### YYYY-MM-DD — <page or pattern>

- **Pages:** /path/, /other-path/ (or "Part D cluster — all ~40 pages")
- **Metric:** <one of the six tracked metrics>
- **Hypothesis:** We expect this change to improve X because Y.
- **Outcome (after recrawl):** supported / not supported / mixed — evidence
  from DELTA.md
```

Newest entries at the top.

## Pattern Ledger

Per the Scientific Rule in `docs/ROADMAP.md`: **Experimental** (being tried,
no evidence) → **Proven** (supported outcomes on multiple pages across
optimization cycles) → **Standard** (documented in `EDITORIAL-STANDARD.md`,
enforced by the gate). Update a pattern's status only when the evidence
column can cite specific Outcome entries below.

### Attribution rule (canonical; adopted 2026-07-30)

> **Experimental evidence is credited only to editorial patterns that the
> experiment intentionally manipulated.** Every other pattern present on the
> page is environment, not evidence, and its ledger row is untouched by the
> outcome.

This is the ledger's single attribution authority. Where any other governance
document appears to say otherwise, this rule governs and that document is in
error.

What follows from it:

- **"Manipulated" means changed by the experiment's own scope statement** —
  the pattern was added, removed, or materially rewritten as part of the
  pre-registered change. A pattern that merely already existed on the page is
  never credited, however well the page performed.
- **Bundled experiments credit every pattern in the bundle, and only those.**
  A seven-pattern bundle gives each of those seven one *bundled* data point.
  It gives nothing to patterns the bundle did not touch.
- **The manipulated set is fixed at baseline time**, in the experiment's
  Patterns-under-evaluation field (`docs/seo/EXPERIMENTS.md`). It cannot be
  widened after the data is read — that would be retroactive attribution, the
  same failure mode the CTR-promotion rule exists to prevent.
- **Not every manipulated pattern is a ledger row.** Changes like contextual
  depth, FAQ expansion, or a title/meta rewrite are manipulated and judged as
  part of the experiment, but have no ledger row and so accrue no ledger
  evidence.
- **Confounded outcomes** are recorded as "supported with confound noted" and
  do **not** satisfy the isolated-evidence requirement (graduation criterion
  #2).

This makes the ledger an *experiment* ledger rather than a page-feature
ledger: a row moves only when an experiment set out to move it.

### Status

| Pattern | Status | Evidence |
|---|---|---|
| Standard definition pattern | Experimental | — |
| Standard comparison table | Experimental | — |
| Standard AI summary | Experimental | — |
| Standard source section | Experimental | — |
| Standard internal-link pattern | Experimental | — |
| Standard CTA pattern | Experimental | — |

### Manipulated-pattern map for the experiments in flight

Fixed at baseline time; this is the complete set of rows each experiment may
credit at Delta Review. Nothing here is an outcome — the Evidence column above
stays `—` until a verdict is written.

| Pattern | EXP-001 (bundled) | EXP-002 (isolated) | EXP-003 (isolated, replicated) |
|---|---|---|---|
| Standard definition pattern | manipulated | — | — |
| Standard comparison table | manipulated | — | manipulated |
| Standard AI summary | **present, not manipulated** | manipulated | — |
| Standard source section | manipulated | — | — |
| Standard internal-link pattern | manipulated | — | — |
| Standard CTA pattern | **present, not manipulated** | — | — |

EXP-001 also manipulated contextual depth, FAQ expansion, and a title/meta
rewrite — judged as part of the bundle, but not ledger rows.

The two **present, not manipulated** cells are the reason this rule exists.
`/medigap` already carried a `<SummaryBlock>` and a CTA before EXP-001
(baseline §3, "Present"); the hypothesis concerned neither. Crediting them from a
supported EXP-001 would manufacture evidence for patterns no experiment has
yet tested — and would let the AI-summary pattern reach 2 data points on the
strength of one real test.

---

<!-- Entries begin below. The performance-mode queue-validation gate described
     in ROADMAP.md ("The gate before Sprint 2A begins") ran on 2026-07-30 —
     see docs/PERFORMANCE-VALIDATION-2026-07-30.md. Sprint 2B content
     experiments (EXP-001 – EXP-003) are logged below and registered in
     docs/seo/EXPERIMENTS.md. -->

### 2026-07-30 — `does-medicare-cover-[drug]` comparison table (Sprint 2B, experiment #3 — first cohort-based isolated test)

- **Registry:** EXP-003 (`docs/seo/EXPERIMENTS.md`)
- **Pages:** 14 pages from `src/pages/does-medicare-cover-[drug].astro`.
  **Treated (12):** dupixent, rinvoq, skyrizi, enbrel, eliquis, xarelto,
  entresto, humira, repatha, trulicity, farxiga, jardiance. **Control (2):**
  trelegy, zepbound — condition-group singletons that render no table. No
  Spanish variants exist.
- **Baseline:** docs/seo/baselines/drug-coverage-cohort-2026-07-30.md
  (immutable; treated arm 913 impressions, 1 click, weighted position 12.66;
  control arm 187 impressions, weighted position 14.52; all 14 pages uniform at
  completeness 82%, AI readiness 74, tables 0)
- **Change:** add exactly one `<table>` per treated page, comparing the page's
  drug against the other drugs treating the same condition. Three columns
  (Drug / Covered by Medicare? / Typical formulary tier), 3–5 data rows. Every
  cell is an existing `drugCoverage.ts` field the template already renders as
  prose; the only new logic is a presentation mapping of the existing
  `CoverageStatus` union to a label. No links in the table, no new headings
  (the table is titled by its own `<caption>`), no other change.
- **Metric:** impression-weighted average position across the 12 treated pages
  (primary; post-change-only window vs 12.66). Treated impressions (secondary
  guard — flat or up). Control-arm position recorded as a downgrade reference
  only. CTR and clicks recorded, **not judged** — 2 clicks on 1,100
  impressions against a standing "confirmed, low-confidence CTR" verdict.
- **Hypothesis:** We expect this change to improve average position because the
  twelve treated pages already rank at an impression-weighted 12.7 in the
  striking-distance band while missing the one element the editorial standard
  says a Part D page cannot omit — a page whose entire job is answering "is
  this drug covered, and how does it compare" currently compares nothing — so
  adding the standard comparison table supplies the cohort's single structural
  deficit.
- **Attribution note:** exactly **one pattern (Standard comparison table)
  replicated across 12 structurally identical pages**, with 2 untreated
  siblings as a within-template control. A supported outcome is the ledger's
  first *isolated* evidence for this pattern, and the strongest single result
  it can hold. The control arm can downgrade a verdict but never gate one
  (baseline §4). Because content is held constant and only structure changes,
  a supported outcome attributes to presentation, not to added information.
- **Expected engine effect:** the edited file **is** in every page's
  `sourceFiles`, so freshness recomputes on all 14 pages, treated and control
  alike. `freshness = clamp01(ageDays/365)` is a *staleness* factor, so the
  reset **lowers** Priority by ~0.33 (0–1 point after rounding). It does not
  raise it. This is an engine artifact, never evidence — and it is a positive
  control for the `sourceFiles` finding recorded in EXP-002.
- **Check-0 verification (2026-07-30, post-edit run):** tests 142 ✓, build 166
  pages ✓, editorial gate ✓ raising **exactly 12 floors** (the treated arm).
  Treated: tables 1 ✓, AI `tables` component 0.5 ✓, completeness 91 ✓,
  `missingElements` → `["definitions"]` ✓, outbound unchanged ✓, definitions 0 ✓,
  summary/FAQ/sources/byline/schema/internal-links unchanged ✓. Control: tables
  0, AI 74, completeness 82 — unchanged ✓. Opportunity unchanged on all 14 ✓.
  Five errata (observation plan §0): (1) AI readiness is 79 on nine treated
  pages but **82 on three** — the `insights` component includes
  `words >= medianWords`, so "all other AI components unchanged" cannot be
  pre-registered for any word-adding intervention; (2) that median moved
  **552 → 566**, costing three **untouched** pages their insights point
  (`/medicare-formulary-lookup` → AI 65, `/medicare-enrollment-vernal` → 63,
  `/medicare-enrollment-periods` → 79) — AI readiness is not a page-local
  score; (3) the freshness reset is **pending commit**, not falsified — the
  engine reads git commit dates, not the working tree, so `ageDays` is still 24
  and Priority unchanged; re-verify at check 0b after the auto-commit lands;
  (4) the pre-registered 3-column table was **degenerate on 8 of 12 pages**
  (diabetes and autoimmune groups share one status and one tier), so a fourth
  column (`Used for`, from the existing `treats` field, distinct on 12/12) was
  added at t=0 before any post-change data existed — and the engine scored both
  versions identically, because `hasComparisonTable` is pure shape
  (`cols>=2 && rows>=3`), so **table credit is awarded for structure, not
  information**; (5) `thin` cleared on jardiance (602 words), holding on the
  other 11.
- **Evaluation protocol:** docs/seo/observation-plans/drug-coverage-cohort-2026-07-30.md
- **Outcome (after recrawl):** _open_

### 2026-07-30 — / homepage AI summary (Sprint 2B, experiment #2 — first isolated pattern test)

- **Registry:** EXP-002 (`docs/seo/EXPERIMENTS.md`)
- **Pages:** / (and /es.html via shared HomePage component; judged on / only,
  /es.html recorded as orientation)
- **Baseline:** docs/seo/baselines/home-2026-07-30.md (immutable; impressions
  1,040, clicks 23, position 7.15, CTR 2.21%, completeness 22%, AI readiness 47,
  1,137 words, 17 outbound links)
- **Change:** insert exactly one `<SummaryBlock>` immediately below the H1,
  with EN and ES copy in the i18n content files. Nothing else — no title/meta,
  no links, no tables, no definitions, no byline, no sources, no restructuring.
- **Metric:** average position (primary; post-change-only window vs 7.15).
  Impressions (secondary guard — flat or up). CTR and clicks recorded, **not
  judged** — environment verdict is "confirmed, low-confidence CTR"; promotion
  of CTR to a judged metric requires an explicit observation-log entry, never
  retroactive.
- **Hypothesis:** We expect this change to improve average position because the
  homepage already ranks at 7.2 in the striking-distance band on the site's
  highest impression volume, and its dominant structural deficit is
  extractability (AI readiness 47, `needsSummary`) — adding the standard AI
  summary block under the H1 gives Google and AI surfaces a clean, quotable
  statement of what the page is about, which is the single element the queue
  prescribes.
- **Attribution note:** exactly **one pattern (Standard AI summary) on one
  page** — the Pattern Ledger's first *isolated* data point if supported
  (graduation criterion #2). By-construction movements pre-registered in the
  baseline (§§3–4, 8): completeness 22% → 33%, AI readiness 47 → 67,
  `needsSummary`/`aiGap` cleared, word count ~1,190, all other AI component
  scores unchanged. **Expected engine effect:** on the first post-edit run,
  Priority is expected to increase by ~4–5 points due solely to the freshness
  factor resetting. This is not evidence supporting the hypothesis and must not
  be interpreted as experimental success.
- **Check-0 verification (2026-07-30, post-edit run):** completeness 33 ✓,
  AI readiness 67 ✓, words 1,189 ✓, outbound 17 ✓, inbound 10 ✓,
  `needsSummary` cleared ✓, all other AI components unchanged ✓, Opportunity
  76 unchanged ✓. Two baseline pre-registrations were wrong (errata in the
  observation plan §0): `aiGap` **stays set** — the floor is 70, not "below
  67"; and the freshness reset **does not fire** — the engine attributes
  freshness to git commits of `src/pages/index.astro` only, so component/i18n
  edits are invisible to it and Priority stays 77. Neither affects the
  experimental metrics; both are engine-model findings, parked for
  post-experiment queue work.
- **Evaluation protocol:** docs/seo/observation-plans/home-2026-07-30.md
  (post-change-only GSC window; supported = position ≤ 5.0 with impressions
  flat/up; directional = ≥1.0 improvement; judged no earlier than 4 weeks
  post-recrawl, hard stop at 8 weeks).
- **Outcome (after recrawl):** _open_

### 2026-07-30 — /medigap pillar expansion (Sprint 2B, optimization #1)

- **Registry:** EXP-001 (`docs/seo/EXPERIMENTS.md`)
- **Pages:** /medigap.html (and /es/medigap.html via shared component)
- **Baseline:** docs/seo/baselines/medigap-2026-07-29.md (immutable; impressions
  70, clicks 0, position 13.73, completeness 70%, AI readiness 67, 249 words)
- **Change:** expand the pillar from 249 words to cluster depth — standard
  comparison table (Plan G vs Plan N vs HD-G, figures from annualMedicareData),
  definitions `<dl>`, `<SourcesList>`, 8+ in-content links, prose targeting the
  "utah medigap plans" head terms; `<title>` + meta description rewritten.
- **Metric:** average position (primary); impressions (secondary). CTR recorded
  but not judged — at 70 impressions a CTR delta is not attributable.
- **Hypothesis:** We expect this change to improve average position because the
  pillar already ranks at 13.7 in the striking-distance band while being 3.5×
  thinner than its cluster siblings, so adding the standard comparison table,
  definitions, sources, and 8+ internal links supplies the depth that is the
  page's only structural deficit.
- **Attribution note:** this change exercised seven patterns at once
  (comparison table, definitions, sources, internal-link expansion, contextual
  depth, FAQ expansion, title/meta rewrite). A supported outcome validates the
  **bundle on this page archetype**, not any individual pattern — each ledger
  pattern gains one *bundled* data point only. Later Sprint 2B pages should
  isolate patterns where the queue prescription allows.
- **Evaluation protocol:** docs/seo/observation-plans/medigap-2026-07-30.md
  (observation schedule, post-change-only GSC window methodology, thresholds:
  supported = position ≤10.0; directional = ≥2.0 improvement; judged no earlier
  than 4 weeks post-recrawl, hard stop at 8 weeks).
- **Outcome (after recrawl):** _open_

### 2026-07-30 — First Search Console import + URL-join fix (data layer, not model)

- **Pages:** none — `normalizeUrl()` in `scripts/seo/parse.mjs` + 6 new tests
- **Change:** imported first GSC export (`pages-2026-07-29.csv`, 3-month window,
  200 rows). First run orphaned 115/200 GSC URLs: Google indexes extensionless
  URLs (`/aca`) while registry/canonicals use `.html`. `normalizeUrl()` now
  folds extensionless paths into the `.html` key. After fix: 1/200 unmatched
  (`/privacy.html`, noindex). No weight/threshold/business assumption touched.
- **Hypothesis:** folding both URL forms into one key attributes each page's
  full search history to it, making the performance-aware queue trustworthy.
- **Metric:** unmatched GSC URLs 115 → 1; pages with performance data 0 → 118/146 EN.
- **Audit verdict:** Performance Mode ON. Queue validated in
  `docs/PERFORMANCE-VALIDATION-2026-07-30.md` — **model confirmed with
  low-confidence performance data**; weights remain frozen; CTR-derived
  prescriptions advisory until ~10 pages have ≥10 clicks.
- **Outcome (after recrawl):** n/a — no content changed

### 2026-07-29 — Structural queue audit (model change, not content)

- **Pages:** none — one Business Impact weight in `scripts/seo/config.mjs`
- **Change:** `other-insurance` silo Business Impact 5 → 3. ACA / life /
  indemnity are strategic cross-sells, not core Medicare revenue; at 5 they
  outranked core Medicare pillars (/medicare-costs, /turning-65) on business
  weight alone.
- **Metric:** none (pre-performance-data; a business-assumption correction, not
  an outcome-tuned adjustment — does not violate the Phase 1 freeze)
- **Audit verdict:** the engine passed its first structural audit — every top-10
  ranking was explainable, and independent editorial judgment converged on the
  same first target (/medigap, a 249-word Impact-5 pillar). This was the only
  assumption the audit contested. Weights are now re-frozen until Performance
  Mode is ON.
- **Outcome (after recrawl):** n/a — no content changed
