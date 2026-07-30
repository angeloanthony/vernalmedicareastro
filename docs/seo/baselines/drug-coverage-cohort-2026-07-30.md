# Cohort Baseline Report — `does-medicare-cover-[drug]` (EXP-003)

**Status: IMMUTABLE BASELINE.** This file records the state of the 14-page
drug-coverage cohort *before* its Sprint 2B optimization. Do not edit after
implementation begins; corrections are recorded as errata in this experiment's
observation plan, never here.

**Experiment role: second isolated pattern test, first replicated one.**
EXP-001 changed a seven-pattern bundle on one page. EXP-002 changed one pattern
on one page. EXP-003 changes **one pattern on twelve pages that are structurally
identical**, with two untreated siblings held back as a control arm. If
supported, it is the Pattern Ledger's first *replicated* isolated evidence —
the strongest single piece of evidence the ledger can hold.

- **Pages:** 14 pages rendered from `src/pages/does-medicare-cover-[drug].astro`
  (data: `src/data/drugCoverage.ts`, `src/data/business.ts`; layout:
  `src/components/layout/ArticlePage.astro`)
- **Baseline date:** 2026-07-30
- **Data sources:** `data/search-console/pages-2026-07-29.csv` (GSC export,
  ~3-month window), `docs/seo/seo-snapshot.json` (engine run 2026-07-30
  13:16 UTC), editorial reports of the same run
- **Silo / archetype:** part-d · templated informational cluster (depth 3, not
  pillars, no Spanish variants)
- **Date optimized:** _not yet implemented — this experiment is at lifecycle
  state 1 (Baseline)_

---

## 0. Candidate screening — why this is a cohort and not a page

EXP-003 was specified as "the highest-priority page from the Opportunity Queue
that can isolate one previously bundled editorial pattern." **No single page
satisfies all three preconditions.** The screening is recorded here because the
negative result is itself a finding about the site's structure.

### Precondition 2 fails structurally for the top of the queue

55 of 162 pages are template-rendered, so they cannot be edited individually at
all:

| Template | Pages |
|---|---:|
| `does-medicare-cover-[drug].astro` | 14 |
| `[drug]-assistance-program.astro` | 14 |
| `medicare-coverage/[service].astro` | 11 |
| `medicare-[town]-utah.astro` | 10 |
| `medicare-news/[slug].astro` | 6 |

This includes **five of the top six Opportunity pages** — `/does-medicare-cover-dupixent`
(opportunity 97, the site's #1), `-rinvoq` (94), `/skyrizi-assistance-program`
(93), `-skyrizi` (92), `-enbrel` (91). Editing one edits fourteen. Single-page
isolation is not available where the opportunity is highest.

### Precondition 1 fails for every standalone page, in one of two ways

Standalone pages split cleanly into two groups, and neither clears the bar. The
observation methodology requires a post-change-only window of ≥14 days and ≥30
impressions before average position is readable; a 4-week window captures
roughly `impressions × 28/91` of the 3-month baseline volume.

| Page | Pos | 3-mo impr | ~4-wk impr | Why it fails |
|---|---:|---:|---:|---|
| /medicare-help-vernal | 6.5 | 126 | **39** | in-band, but volume barely clears the floor |
| /medicare-medicaid-utah | 18.8 | 122 | **38** | in-band, volume barely clears the floor |
| /medicare-irmaa-life-changing-events | 9.8 | 110 | **34** | in-band, volume barely clears the floor |
| /medicare-formulary-lookup | 31.6 | 309 | 95 | volume fine, **position outside the band** |
| /aca | 25.6 | 412 | 127 | volume fine, position outside the band |
| /life | 29.2 | 444 | 137 | volume fine, position outside the band |

The pages with the right *position* have marginal *volume*; the pages with the
right volume sit at position 25–45, outside the 5–20 band where the project's
own proximity model predicts on-page patterns convert. A null result on the
second group could not distinguish "the pattern does not work" from "the page
was too deep for any single pattern to matter" — an experiment that cannot
fail informatively is not worth running.

### The cohort clears both

Treating the template as the unit resolves the conflict rather than weakening
the design: the intervention is still **exactly one pattern**, applied
identically, but it lands on 12 structurally identical pages that carry
**913 combined impressions (~281 in a 4-week window) at an impression-weighted
position of 12.66** — the only configuration on the site with both adequate
volume and striking-distance proximity. This is consistent with the registry's
granularity rule: *one ID = one hypothesis judged as a unit*, regardless of how
many pages or files it touches.

**Accepted cost, recorded now:** 11 of these 14 pages carry `ctrProblem` and the
queue's prescribed next action for them is a `<title>` + meta rewrite. Running
EXP-003 defers that work on the site's highest-opportunity pages for roughly
nine weeks (§6 risk 1). The deferral is judged acceptable because the title/meta
prescription is a **CTR-mechanism** action, and CTR is not judgeable in this
environment — the entire 14-page cohort has 2 clicks on 1,100 impressions,
against a standing verdict of "confirmed, low-confidence CTR". Deferring an
un-evaluable action to run an evaluable one costs no evidence.

## 1. The cohort — per-page baseline

Sorted by impressions. **T** = treated arm, **C** = control arm (§4).

| Arm | Page | Impr | Clicks | Pos | CTR | Words | Out | In | Pri | Opp |
|:--:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| T | /does-medicare-cover-dupixent | 288 | 1 | 9.5 | 0.3% | 449 | 13 | 6 | 76 | 97 |
| **C** | /does-medicare-cover-trelegy | 154 | 1 | 13.4 | 0.6% | 461 | 12 | 2 | 72 | 89 |
| T | /does-medicare-cover-rinvoq | 115 | 0 | 12.0 | 0.0% | 468 | 12 | 5 | 69 | 94 |
| T | /does-medicare-cover-skyrizi | 102 | 0 | 10.3 | 0.0% | 446 | 12 | 5 | 68 | 92 |
| T | /does-medicare-cover-enbrel | 95 | 0 | 9.9 | 0.0% | 454 | 12 | 5 | 71 | 91 |
| T | /does-medicare-cover-eliquis | 83 | 0 | 17.0 | 0.0% | 465 | 12 | 4 | 66 | 83 |
| T | /does-medicare-cover-xarelto | 76 | 0 | 17.4 | 0.0% | 442 | 12 | 4 | 66 | 82 |
| T | /does-medicare-cover-entresto | 57 | 0 | 21.0 | 0.0% | 447 | 12 | 4 | 56 | 69 |
| T | /does-medicare-cover-humira | 36 | 0 | 14.5 | 0.0% | 486 | 12 | 5 | 57 | 77 |
| **C** | /does-medicare-cover-zepbound | 33 | 0 | 19.5 | 0.0% | 522 | 12 | 1 | 59 | 70 |
| T | /does-medicare-cover-repatha | 31 | 0 | 9.2 | 0.0% | 472 | 12 | 4 | 60 | 75 |
| T | /does-medicare-cover-trulicity | 27 | 0 | 26.3 | 0.0% | 480 | 12 | 4 | 48 | 58 |
| T | /does-medicare-cover-farxiga | 3 | 0 | 8.3 | 0.0% | 487 | 12 | 3 | 49 | 60 |
| T | /does-medicare-cover-jardiance | 0 | 0 | — | — | 523 | 12 | 5 | 24 | 20 |

### Arm summary

| | Pages | With data | Impressions | ~4-wk | Clicks | **Weighted position** | CTR |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Treated** | 12 | 11 | 913 | ~281 | 1 | **12.66** | 0.11% |
| **Control** | 2 | 2 | 187 | ~58 | 1 | **14.52** | 0.53% |
| Cohort | 14 | 13 | 1,100 | ~338 | 2 | 12.98 | 0.18% |

9 of the 11 treated pages with data sit in the 5–20 striking-distance band;
both control pages do. `/does-medicare-cover-jardiance` has zero impressions —
it is treated structurally but contributes nothing to the weighted position and
is reported separately at every check.

## 2. Structural state — uniform across all 14

Every page in the cohort scores **identically** on structure, which is what
makes the cohort a legitimate replicate design:

| Measure | Value (all 14) |
|---|---|
| Editorial completeness | **82%** |
| AI readiness | **74/100** |
| `missingElements` | `["comparisonTable", "definitions"]` |
| Tables | **0** |
| Definitions | 0 |
| AI summary / FAQ / sources / byline | present on all 14 |
| Outbound in-content links | 12 (13 on dupixent) |
| Words | 442–523 (all below the 600 `thinWords` line) |
| `lastModified` | 2026-07-06 (ageDays 24) |
| Flags | `thin`, `aiGap` on all; `strikingDistance` on 11; `ctrProblem` on 11 |

AI component scores, identical on all 14:

| Component | Score | Weight | Points |
|---|---:|---:|---:|
| Summary | 1.00 | 20 | 20.0 |
| FAQ | 1.00 | 20 | 20.0 |
| Schema | 0.80 | 15 | 12.0 |
| **Tables** | **0.00** | 10 | **0.0** |
| Definitions | 0.00 | 10 | 0.0 |
| Internal links | 1.00 | 15 | 15.0 |
| Insights | 0.67 | 10 | 6.7 |
| **Total** | | | **73.7 → 74** |

## 3. Planned change — confirmation of scope

**The only planned change is the addition of exactly one `<table>` per treated
page**, rendered by `src/pages/does-medicare-cover-[drug].astro`, comparing the
page's drug against the other drugs that treat the same condition.

Columns (3): **Drug** (`brand` + `generic`) · **Covered by Medicare?**
(`status`) · **Typical formulary tier** (`tier`).
Rows: every drug in the page's `condition` group, including the page's own drug.

Group sizes, from `src/data/drugCoverage.ts`:

| Condition | Drugs | Table rows | Arm |
|---|---|---:|---|
| diabetes | Jardiance, Farxiga, Trulicity | 3 | treated |
| heart | Eliquis, Xarelto, Entresto, Repatha | 4 | treated |
| autoimmune | Humira, Enbrel, Rinvoq, Skyrizi, Dupixent | 5 | treated |
| respiratory | Trelegy Ellipta | 1 | **control** |
| weight | Zepbound | 1 | **control** |

**Every cell is an existing field that the template already renders as prose.**
No new per-drug data is authored; the only new logic is a presentation mapping
of the existing `CoverageStatus` union (`covered` → "Yes", `conditional` →
"Yes, with conditions", `limited` → "Rarely") to a table label. The intervention
therefore holds *content* constant and changes only *structure* — the cleanest
available isolation of the comparison-table pattern.

**The table contains no links.** Peer drugs are already linked from the existing
"Related medications" section, so outbound link counts must not move. Anything
that changes them is a second pattern and voids attribution.

Not in scope, deliberately: no `<title>`/meta rewrite, no definitions block, no
depth expansion, no new links, no schema change, no FAQ change, no edits to
`drugCoverage.ts` content, no new drugs.

## 4. Control arm

Trelegy Ellipta and Zepbound are the only drugs alone in their condition group,
so a peer table would have one row and fail the standard's 3-row minimum. Rather
than fabricate cross-condition peers, they render **no table** and serve as a
within-template control: same silo, same layout, same crawl cadence, same
template commit, same engine run — differing only in the intervention.

The control arm is **187 impressions across 2 pages** and is therefore *not*
strong enough to gate the verdict. Its role is asymmetric and defined now:

- It is **not** required to move for a supported verdict.
- If the control arm improves by roughly as much as the treated arm, that is
  evidence of a cohort-wide external cause and the treated result is downgraded
  to *directionally supported* at best.

## 5. By-construction predictions — pre-registered

Verified at check 0 on the first `npm run seo` after deploy. None of these is
evidence for or against the hypothesis.

**On the 12 treated pages:**

| Measure | Before | Predicted after |
|---|---:|---:|
| Tables | 0 | 1 |
| AI `tables` component score | 0.00 | **0.50** (`clamp01(1/2)`, not 1.0) |
| AI readiness | 74 | **79** (+5, not +10) |
| Editorial completeness | 82% | **91%** (10 of 11 elements) |
| `missingElements` | `[comparisonTable, definitions]` | `[definitions]` |
| Word count | 442–523 | +50–70; max ~583, so **`thin` stays set on all 12** |
| Outbound links | 12 (13 dupixent) | **unchanged** |
| Definitions, summary, FAQ, sources, byline, schema, internal-links, insights | — | **all unchanged** |

**On the 2 control pages:** every structural measure unchanged — AI 74,
completeness 82%, tables 0.

**Expected engine effect — freshness, and a positive control.** Unlike EXP-002,
the edited file (`src/pages/does-medicare-cover-[drug].astro`) **is** in every
page's `sourceFiles`, so the freshness factor will recompute on all 14 pages,
treated and control alike. The direction is *downward*: `freshness =
clamp01(ageDays / 365)` is a **staleness** factor — older pages score higher
because they need refreshing. At ageDays 24 the factor is 0.0658 (0.33 of 5
points); resetting to 0 removes those 0.33 points, so **Priority falls by ~0.33
(0–1 point after rounding). It does not rise.**

This doubles as a positive control for the engine-model finding recorded in
EXP-002: freshness did not move there because the edited files were outside
`sourceFiles`; it must move here because the edited file is inside it. If it
moves here and did not move there, the `sourceFiles` model is confirmed from
both directions. Because the reset hits treated and control pages identically,
it cannot explain any treated-vs-control difference.

Opportunity is derived from GSC data alone and must be **unchanged** on all 14
at check 0.

## 6. Risk assessment — what would invalidate attribution

1. **Queue collision on title/meta (largest risk).** 11 of 14 pages carry
   `ctrProblem` with a prescribed `<title>` + meta rewrite, including the site's
   #1 opportunity page. Any such rewrite during the window changes the snippet
   and confounds position and CTR together. Response: **title and meta on this
   cohort are frozen for the observation window**; if business need forces a
   rewrite, log it and downgrade the verdict.
2. **`drugCoverage.ts` edits.** Editing `tier`, `status`, `coveredSummary` or
   any other field changes both the prose and the new table invisibly, on
   multiple pages at once. Freeze content edits to this file for the window;
   log any that ship.
3. **Adding or removing a drug.** A 15th entry changes condition-group sizes,
   table rows, the `related` graph, and could move a control page into the
   treated arm. Defer new drugs until the experiment closes.
4. **Template blast radius.** One file edit changes 14 live pages. Tests, build
   and `npm run seo:gate` must pass before deploy; a rendering error ships to
   the whole cohort at once.
5. **Shared-silo external effects.** A Google health/YMYL update hits all 14
   together. Partially detectable via the control arm (§4), not eliminated.
6. **Sitewide template changes.** BaseLayout, nav, `styles.css`, and
   `ArticlePage.astro` are inherited; any change to them during the window is a
   confound. Log it.
7. **Inbound-link drift.** Other Sprint 2B work that links into these pages
   changes their authority mid-window. Inbound counts (1–6) are recorded per
   page in §1 and re-checked at every observation.
8. **Auto-commit tooling.** This environment auto-commits WIP to main. Before
   the delta review, check `git log -- src/pages/does-medicare-cover-[drug].astro
   src/data/drugCoverage.ts src/components/layout/ArticlePage.astro` for the
   window and reconcile every commit against §3.

**Attribution rule:** if risk 1, 2, 3, 6 or 7 materially fires, the verdict is
capped at *directionally supported* and the Pattern Ledger records "supported
with confound noted," which does **not** satisfy the isolated-evidence
requirement for graduation.

## 7. Optimization Hypothesis

> **We expect this change to improve average position because the twelve
> treated pages already rank at an impression-weighted 12.7 in the
> striking-distance band while missing the one element the editorial standard
> says a Part D page cannot omit — a page whose entire job is answering "is
> this drug covered, and how does it compare" currently compares nothing — so
> adding the standard comparison table supplies the cohort's single
> structural deficit.**

Primary metric: **impression-weighted average position across the 12 treated
pages** (baseline 12.66), on a post-change-only GSC window. Secondary guard:
treated-arm impressions (baseline 913 over 3 months). Reference: control-arm
weighted position (baseline 14.52), used only to downgrade per §4.

**CTR and clicks: recorded, not judged.** The cohort has 2 clicks on 1,100
impressions; per `docs/PERFORMANCE-VALIDATION-2026-07-30.md` the environment
verdict remains "confirmed, low-confidence CTR". Promotion of CTR to a judged
metric requires an explicit observation-log entry made before the data is read,
never retroactively.

Pattern exercised: **Standard comparison table** (Pattern Ledger row 2), which
currently holds one *bundled* data point from EXP-001. A supported outcome here
is its first isolated evidence, replicated across 12 pages — and the comparison
table is required by 5 of the 9 cluster standards (`part-d`, `costs-irmaa`,
`medicare-advantage`, `medigap`, `other-insurance`), so its status governs more
future editorial work than any other unproven pattern.

Copy this hypothesis into `docs/seo/WORK-LOG.md` as a new entry **when the edit
begins** — not before.

## 8. Success baseline table (for the Delta review)

| Metric | Baseline (2026-07-30) | After recrawl | Δ |
|---|---:|---:|---:|
| **Treated weighted position** | **12.66** | | |
| Treated impressions | 913 | | |
| Treated clicks | 1 | | |
| Treated CTR | 0.11% | | |
| Control weighted position | 14.52 | | |
| Control impressions | 187 | | |
| Cohort weighted position | 12.98 | | |
| Cohort impressions | 1,100 | | |
| Editorial completeness (treated) | 82% | | |
| AI readiness (treated) | 74 | | |
| Tables (treated) | 0 | | |
| Outbound links (treated) | 12 / 13 | | |

Proposed verdict thresholds, to be finalized in this experiment's observation
plan at implementation:

- **Supported:** treated weighted position ≤ **10.0** on a post-change-only
  window with treated impressions flat or up, and the control arm not moving by
  a comparable amount (§4).
- **Directionally supported:** treated weighted position improves ≥ **1.5**
  (≤ 11.16) without reaching 10.0, or reaches 10.0 while the control arm moves
  comparably.
- **Not supported:** movement < 1.5 in either direction after 8 weeks.
- **Regressed:** treated weighted position worsens ≥ 1.5, or treated
  impressions fall > 30% while site-wide impressions are flat or up.

Per-page positions are recorded at every check alongside the weighted figure, so
a result driven entirely by `/does-medicare-cover-dupixent` (32% of treated
impressions) is visible rather than hidden inside the average.
