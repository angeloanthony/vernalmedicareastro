# Delta Observation Plan — `does-medicare-cover-[drug]` cohort (EXP-003)

**Status: PLAN, not report.** This file defines *how* EXP-003 will be evaluated
after Google's recrawl. The evaluation itself is recorded by filling in the
baseline's §8 table and the WORK-LOG Outcome — not by editing this plan. Written
2026-07-30, before any post-change data exists. No outcomes are recorded here.

- **Registry:** EXP-003 — `docs/seo/EXPERIMENTS.md`. First experiment whose ID
  was assigned at baseline time; both the baseline and this plan carry it in
  the H1, as the linkage convention now requires.
- **Baseline (immutable):** `docs/seo/baselines/drug-coverage-cohort-2026-07-30.md`
- **Work-log entry:** `docs/seo/WORK-LOG.md` → "2026-07-30 — `does-medicare-cover-[drug]`
  comparison table (Sprint 2B, experiment #3)"
- **Change deployed:** 2026-07-30 — one `<table>` added to
  `src/pages/does-medicare-cover-[drug].astro`, rendered on the 12 treated
  pages, suppressed on the 2 control pages. Nothing else.
- **Environment:** Performance Mode ON, verdict "confirmed, low-confidence CTR"
  (`docs/PERFORMANCE-VALIDATION-2026-07-30.md`).

---

## 0. The three categories of movement, and check-0

Every Delta review classifies each observed change into exactly one category
before interpreting it: **by-construction** (the page changed, or the engine
recalculated — never evidence), **experimental outcome** (§3), or **external
effect** (logged as a confounder).

### Check-0 verification (2026-07-30, post-edit run)

Tests 142/142 ✓ · `astro build` 166 pages ✓ · `npm run seo:gate` passed,
**12 completeness floors raised** — exactly the treated arm ✓

| Prediction (baseline §5) | Result |
|---|---|
| Tables 0 → 1 on 12 treated | ✓ all 12 |
| Tables stay 0 on 2 control | ✓ trelegy, zepbound |
| AI `tables` component 0 → **0.50** (not 1.0) | ✓ `{got:true, score:0.5}` |
| Completeness 82% → **91%** on treated | ✓ all 12 |
| `missingElements` → `["definitions"]` on treated | ✓ all 12; control keeps both |
| Control unchanged (AI 74, completeness 82%) | ✓ both pages |
| Outbound links unchanged | ✓ 12 (13 dupixent) — table carries no links |
| Definitions stay 0 | ✓ all 14 |
| Summary / FAQ / sources / byline / schema / internal-links unchanged | ✓ all 14 |
| `thin` flag stays set on all 14 | ~~✓ max 575 words < 600~~ — **superseded by erratum 5**: this row recorded the three-column build; with the fourth column jardiance reached 602 words and cleared `thin`. See the treated-arm row below. |
| Opportunity unchanged on all 14 | ✓ |
| AI readiness 74 → **79** on treated | ✓ on 9 of 12 — **3 pages are 82, see erratum 1** |
| `thin` flag stays set on all 12 treated | ✓ on 11 — **cleared on jardiance, see erratum 5** |
| Priority falls ~0.33 from freshness reset | **not yet observable — see erratum 3** |

Final treated-arm state: tables 1, completeness 91%, AI readiness **79 on nine
pages and 82 on three** (humira 580 words, farxiga 566, jardiance 602 — all
above the recomputed site median of 566). Control arm unchanged throughout.

### Errata (recorded at check 0; the baseline is immutable and keeps its text)

**1. "All other AI components unchanged" was falsified on three pages.**
`/does-medicare-cover-humira`, `-farxiga` and `-jardiance` scored **82**, not
the predicted 79. The cause is a coupling the baseline did not model: the AI
`insights` component is not independent of word count. It scores three proxies —
`hasByline + hasSources + (words >= medianWords)` (`scripts/seo/score.mjs`).
Those three pages crossed the recomputed site median (566 words), flipping
insights from 0.67 to 1.00 and adding 3.3 AI points on top of the table's 5.
The other nine stayed at 79 because they remained below it.

**The generalizable lesson: no intervention that adds words can pre-register
"all other AI components unchanged."** Any content addition may cross the
insights threshold. Future baselines must predict the insights component
explicitly, per page, against the current median.

**2. The intervention had site-wide side effects on pages it never touched.**
`medianWords` is a *site-relative* statistic recomputed on every run. Adding
79–94 words to 12 pages moved it **552 → 566**, and three untouched pages fell
below the new median, each losing its insights point (−3.3 AI):

| Untouched page | Words | AI now |
|---|---:|---:|
| /medicare-formulary-lookup | 563 | 65 |
| /medicare-enrollment-vernal | 555 | 63 |
| /medicare-enrollment-periods | 552 | 79 |

46 EN pages sit within ±60 words of the median, so a third of the site rests on
a threshold that any cohort-scale edit can shift. This is an engine-model
finding, not an experimental outcome, and it does not touch EXP-003's metrics —
but it means **AI readiness is not a page-local score**. Site-wide AI-readiness
movement between two runs cannot be read as the sum of page-level edits, and
any Delta review attributing an AI change to a page edit must first check
whether `medianWords` moved. `/medicare-formulary-lookup` is a live queue
candidate (opportunity 76); its drop to AI 65 is an artifact of this
experiment, not a regression in the page.

**3. The freshness prediction is untested, not falsified — it is pending
commit.** Baseline §5 predicted Priority would fall ~0.33 on all 14 pages when
the freshness factor reset. At check 0 `ageDays` is still 24, `freshness` is
still 0.0658, and Priority is unchanged on all 14. The reason is a further
refinement of the `sourceFiles` model from EXP-002: the engine derives
`lastModified` from **git commit dates**, not working-tree state
(`git log -1 -- <sourceFile>`). The edit is present in `dist/` but not yet
committed, so the engine still reads the 2026-07-01 commit.

The prediction therefore remains live and must be re-verified on the first
`npm run seo` **after** the change is committed (this environment auto-commits
WIP to main as "k"). Expected then: `ageDays` → 0, freshness 0.0658 → 0,
Priority −0.33 (0–1 point after rounding) on **all 14 pages**, treated and
control alike. If Priority instead *rises*, the staleness-direction model
recorded in EXP-002 erratum 3 is wrong and must be re-opened.

**4. Construct-validity correction to the intervention, made at t=0.** Baseline
§3 pre-registered a three-column table: Drug / Covered by Medicare? / Typical
formulary tier. On first build that specification proved **degenerate on 8 of
the 12 treated pages**: within the diabetes group all three drugs share one
status and one tier string, and within the autoimmune group all five do. Those
tables satisfied the standard's shape rule while comparing nothing — precisely
the failure the standard exists to prevent ("a drug page that does not compare
anything has failed at its job"). The pre-registration therefore did not
instantiate the construct it named.

A fourth column, **Used for**, was added from the existing `treats` field —
distinct on 12 of 12 pages — making every table genuinely comparative. The
correction was made **before any post-change GSC data existed**, so it involves
no outcome-dependent choice; it is a construct-validity fix at t=0, not a
revision in light of results. The intervention remains one pattern, built
exclusively from fields the template already rendered as prose, with no links.
Baseline §3's column list is superseded by this erratum; everything else in §3
stands.

**An engine-model finding falls out of this:** the engine cannot tell the two
versions apart. `hasComparisonTable` is `cols >= 2 && rows >= 3`
(`scripts/seo/sources.mjs`) — pure shape. The degenerate three-column table and
the corrected four-column one both scored completeness 91% and AI 79. **Table
credit is awarded for structure, not for information**, so completeness and AI
readiness cannot distinguish a real comparison from a list of identical rows.
Any future page can satisfy the comparison-table requirement without comparing
anything; only editorial review catches that.

**5. The `thin` flag cleared on one page.** Baseline §5 predicted the `thin`
flag would stay set on all 12 treated pages (predicted max ~583 words against
the 600-word `thinWords` line). With the fourth column, `/does-medicare-cover-jardiance`
reached **602 words** and cleared `thin`. It holds on the other 11. Jardiance
has zero impressions and sits at priority 24, so the change is immaterial to
the experiment; it is recorded because the prediction was specific and wrong.

**6. The baseline's `Date optimized` field is stale by construction.** It reads
*"not yet implemented — this experiment is at lifecycle state 1 (Baseline)"*,
which was true when written and false from 2026-07-30, when the change shipped.
The field is not corrected, because the baseline is immutable. Per the
`Date optimized` convention adopted at the Sprint 2B freeze
(`docs/seo/EXPERIMENTS.md`, Registry conventions #2), the field is frozen at
baseline-write time and is **never** the authoritative implementation date;
that date is the registry record's **Status** field, corroborated by the
WORK-LOG entry and this plan's *Change deployed* line — all three of which say
**2026-07-30**. Baselines from EXP-004 onward omit the field entirely. Recorded
so that no future reader treats the stale value as a claim that this experiment
never shipped.

## 1. Observation schedule

| Check | When | What |
|---|---|---|
| 0 — post-deploy verification | done (2026-07-30) | Above. Five errata recorded (§0). |
| 0b — post-commit freshness check | first `npm run seo` after the edit is committed | Verify erratum 3's prediction: ageDays → 0, Priority −0.33 on all 14. Engine artifact only, never evidence. |
| 1 — recrawl confirmation | ~1 week after deploy (week of 2026-08-06) | GSC URL Inspection on `/does-medicare-cover-dupixent` (highest volume) and one mid-volume treated page: confirm last-crawl is post-2026-07-30 and the table is in the rendered index. If not recrawled, request indexing and push out one week. No metric judgment. |
| 2+ — weekly deltas | weekly after recrawl confirmed | Export fresh GSC pages CSV, run `npm run seo`, log one line per check in §5: date, treated weighted position, treated impressions, control weighted position, window used, and any `drugCoverage.ts` / title-meta activity. |
| Decision point | no earlier than 4 weeks of post-recrawl data | Fill baseline §8, judge against §3, write the WORK-LOG Outcome. |
| Hard stop | 8 weeks post-recrawl | Record **not supported (no movement)** rather than leaving it open. |

**Window methodology.** The baseline is a ~3-month rolling export; a fresh
3-month export taken mid-experiment is mostly pre-change data and dilutes real
movement. The engine keeps running on the rolling export for queue health, but
**the verdict uses a post-change-only custom range** (2026-07-31 → present)
compared against the baseline. A post-change window needs ≥14 days and ≥30
impressions before its average position is readable; the treated arm projects
~281 impressions into a 4-week window, so the 4-week decision point is the
earliest legitimate verdict.

## 2. Metrics compared against baseline

| Metric | Baseline | Role |
|---|---:|---|
| **Treated weighted position** (12 pages) | **12.66** | **Primary** |
| Treated impressions | 913 | Secondary guard — flat or up |
| Control weighted position (2 pages) | 14.52 | Downgrade reference only (§3) |
| Control impressions | 187 | Context |
| Treated clicks / CTR | 1 / 0.11% | Recorded, **not judged** |
| Per-page positions | baseline §1 | Recorded every check — see concentration note |
| Completeness / AI readiness / tables / outbound | 91 / 79 / 1 / 12 | Verify they hold on each run |

**Concentration note.** `/does-medicare-cover-dupixent` carries 288 of the
treated arm's 913 impressions (32%). Per-page positions are recorded at every
check so a result driven entirely by one page is visible rather than hidden
inside the weighted average. `/does-medicare-cover-jardiance` has zero
impressions and is reported separately; it is treated structurally but
contributes nothing to the weighted figure.

## 3. Verdict thresholds

Judged on the treated arm's impression-weighted average position, post-change
window, against 12.66:

- **Supported:** ≤ **10.0** with treated impressions flat or up, and the control
  arm not improving by a comparable amount.
- **Directionally supported:** improves ≥ **1.5** (≤ 11.16) without reaching
  10.0 — or reaches 10.0 while the control arm moves comparably.
- **Not supported:** movement < 1.5 in either direction after 8 weeks.
- **Regressed:** treated weighted position worsens ≥ 1.5, or treated
  impressions fall > 30% while site-wide impressions are flat or up.

**Control-arm rule (baseline §4), restated because it is easy to get wrong.**
The control is 2 pages and 187 impressions — too small to gate a verdict. It is
asymmetric: it is **not** required to move for a supported verdict, but if it
improves by roughly as much as the treated arm, that indicates a cohort-wide
external cause and the treated result is downgraded to *directionally
supported* at best.

CTR and clicks are recorded, not judged. Promotion of CTR to a judged metric
requires an explicit §5 entry made **before** the data is read.

## 4. Confounders — the watch list

Carried from baseline §6. Any that fires materially caps the verdict at
*directionally supported* and is recorded as "supported with confound noted",
which does **not** satisfy the isolated-evidence requirement for graduation.

1. **Title/meta rewrites on this cohort — frozen for the window.** 11 of 14
   pages carry `ctrProblem` and the queue prescribes a `<title>` + meta rewrite,
   including the site's #1 opportunity page. This is the largest risk and the
   accepted cost of the experiment.
2. **`src/data/drugCoverage.ts` content edits — frozen.** Editing `tier`,
   `status`, or any rendered field changes both the prose and the table.
3. **Adding or removing a drug — deferred.** A 15th entry changes condition
   group sizes, table rows, and could move a control page into the treated arm.
4. **Sitewide template changes** (BaseLayout, nav, `styles.css`,
   `ArticlePage.astro`, `StandardPageLayout.astro`) — log any that ship.
5. **Inbound-link drift** from other Sprint 2B work. Per-page inbound counts
   (1–6) are in baseline §1 and re-checked each observation.
6. **Shared-silo external effects** — a health/YMYL algorithm update hits all 14
   together. Partially detectable via the control arm.
7. **Auto-commit tooling.** Before the delta review, run
   `git log -- "src/pages/does-medicare-cover-[drug].astro" src/data/drugCoverage.ts src/components/layout/ArticlePage.astro`
   for the window and reconcile every commit against baseline §3.

## 5. Observation log

One line per check. Never edited retroactively.

| Date | Check | Treated pos | Treated impr | Control pos | Window | Notes |
|---|---|---:|---:|---:|---|---|
| 2026-07-30 | 0 | — | — | — | — | Deploy + verification. 12 floors raised. Errata 1–5 recorded (§0); table corrected to 4 columns at t=0 before any post-change data. |
| 2026-08-26 | — | — | — | — | — | Confounders **#4** and **#5** fired (Prescription Assistance Batch 1, WORK-LOG 2026-08-26): new sitewide nav hub + nav CSS wrap rule on all 14 cohort pages (both arms); +1 in-content inbound link to treated pages farxiga, jardiance, eliquis from their rebuilt assistance pages; control arm (trelegy, zepbound) unchanged. No cohort page, `drugCoverage.ts`, title or meta edited. |
