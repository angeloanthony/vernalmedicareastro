# Sprint 2B Freeze Checklist

**Purpose.** Sprint 2B shipped three experiments (EXP-001 – EXP-003) on
2026-07-30. This document certifies that the governance corpus is internally
consistent and durably recorded, so the next four to eight weeks can consist of
**observing** rather than building. It records what was resolved at the freeze,
what is deliberately left open, and what would reopen the sprint.

Nothing here evaluates an experiment. No baseline was edited. No verdict, metric
or threshold changed.

**Frozen 2026-07-30.** Scope of this pass: governance only.

---

## 1. What the freeze resolved

### 1.1 Pattern Ledger attribution — the release blocker

The corpus contained a genuine contradiction about what bundled evidence
credits. Two readings were live at once:

- *Page-inventory reading* — a supported bundle credits every pattern present
  on the page.
- *Intervention reading* — a supported bundle credits only the patterns it
  changed.

They produce different evidence accounting, and the difference was not
hypothetical: under the page-inventory reading, a supported EXP-001 would have
credited **Standard AI summary** and **Standard CTA pattern**, both of which
`/medigap` already carried before the bundle shipped and neither of which the
hypothesis concerned. Combined with a supported EXP-002, the AI-summary pattern
would have shown **2 of the 3 data points** graduation requires, on the strength
of one real test.

**Adopted rule** (canonical text: Pattern Ledger, `docs/seo/WORK-LOG.md`):

> Experimental evidence is credited only to editorial patterns that the
> experiment intentionally manipulated. Every other pattern present on the page
> is environment, not evidence.

The manipulated set is fixed at baseline time in the registry's *Patterns under
evaluation* field and cannot be widened after the data is read — the same
prohibition on retroactive scope that governs CTR promotion.

This makes the ledger an **experiment ledger** rather than a page-feature
ledger: a row moves only when an experiment set out to move it.

**Resulting evidence accounting for the three in-flight experiments** — the
complete set of ledger rows each may credit at Delta Review:

| Experiment | Ledger rows creditable | Credited nothing |
|---|---|---|
| EXP-001 (bundled) | comparison table, definitions, sources, internal-link pattern — 1 *bundled* point each | AI summary, CTA (present, not manipulated) |
| EXP-002 (isolated) | AI summary — 1 *isolated* point | the other five |
| EXP-003 (isolated, replicated) | comparison table — 1 *isolated* point | the other five |

EXP-001 also manipulated contextual depth, FAQ expansion and a title/meta
rewrite; these are judged inside the bundle but have no ledger row and so accrue
no ledger evidence.

**Contradictory statements removed** (four sites; none altered an experimental
conclusion):

| Document | Was | Now |
|---|---|---|
| `EXPERIMENTS.md` — EXP-002 record | AI summary would reach "2 data points (1 isolated + 1 bundled)" | 1 data point (1 isolated, 0 bundled); correction noted in place |
| `EXPERIMENTS.md` — EXP-001 record | "each of the seven patterns gains one bundled data point" | four ledger rows credited; AI summary and CTA explicitly excluded |
| `observation-plans/medigap-2026-07-30.md` §4–§5 | "all six patterns … moves **their** evidence columns" | four of six; attribution boundary stated in §4 |
| `observation-plans/home-2026-07-30.md` §5 | "would sit at 2 data points (1 isolated + 1 bundled)" | 1 isolated point; criterion #2 met, criterion #1 not |

The corresponding claim in `baselines/home-2026-07-30.md` §7 was **not** edited —
the baseline is immutable. It is corrected by **erratum 4** in that experiment's
observation plan §0, which states the wrong projection, the correct one, and why
the difference matters.

### 1.2 Governance under version control

Before this freeze, *immutable* meant "please don't edit this." Nothing in the
governance corpus was tracked by Git, so a baseline could have been silently
rewritten with no audit trail, no provenance and no way to demonstrate that the
numbers a verdict is judged against are the numbers that were pre-registered.

The corpus is now committed: registry, baselines, observation plans, work log
and Pattern Ledger, roadmap, editorial standard, observation dashboard,
generated SEO reports, engine history snapshots, and the raw Search Console
exports the baselines were computed from.

**Verification.** All three baselines entered version control in commit
`18bb516` (2026-07-30) and `git log` returns exactly one commit for each path —
they have not been modified since. Any future edit to a baseline therefore
appears as a second commit on that path, which is precisely the property
"immutable" previously asserted without evidence. The mechanism is already
demonstrable in this repository's history: the edits made during this freeze
show up as their own commits against the plans and registry, while the baseline
paths stay at one commit each.

**Constitutional rule adopted, effective EXP-004** (recorded in
`EXPERIMENTS.md`, Registry conventions #3):

> An experiment does not exist until its baseline is committed.

Order of operations: baseline written → **baseline committed** → ID assigned in
the registry → registry row committed → implementation begins. Immutability is
then enforced by commit history rather than by convention: any later edit to a
baseline appears as a diff against the commit that preceded implementation.

**Not applied retroactively — and this is a real limitation.** The EXP-001 –
EXP-003 baselines entered version control *after* their implementations shipped.
Their pre-commit integrity rests on convention alone, and Git can prove only
that they have not changed since 2026-07-30. Their Delta Reviews are still
sound — check-0 verification independently confirmed the by-construction figures
against the pre-registrations, and the errata record every prediction that
proved wrong — but the provenance guarantee available from EXP-004 onward is not
available for these three. Stating that plainly is the point of the rule.

### 1.3 Conventions settled

Two clerical inconsistencies were resolved by adopting an explicit convention
rather than by editing immutable files (`EXPERIMENTS.md`, Registry conventions):

**`Date optimized`.** The field was blank-ish on one baseline, dated on two, and
stale on the third (`drug-coverage-cohort` still reads *not yet implemented*
though it shipped 2026-07-30). Convention: the field is **frozen at
baseline-write time and is never the authoritative implementation date**. That
date is the registry record's **Status** field, corroborated by the WORK-LOG
entry and the plan's *Change deployed* line. Baselines from EXP-004 onward
**omit the field entirely** — a baseline describes the world before the change,
and an implementation date is not part of that world. The stale value is
recorded as erratum 6 in the EXP-003 observation plan.

**Registry linkage.** Baselines and plans now carry their `EXP-NNN` in the H1,
as EXP-003's pair already did. EXP-001 and EXP-002 were assigned retroactively;
their baselines carry no ID in-file and will not gain one, so the binding is
recorded in the registry's *Baseline* field and in a **Registry:** line added to
each observation plan header. Both plan headers state the retroactive assignment
explicitly. This gap closes at EXP-004.

### 1.4 Housekeeping

`WORK-LOG.md` declares newest-entries-first; the two non-experiment entries at
the foot were inverted (2026-07-29 above 2026-07-30). Reordered. No content
changed — both are `n/a — no content changed` entries.

---

## 2. Freeze checklist

**Scientific blockers**

- [x] Pattern Ledger attribution rule adopted, stated once canonically, and
      referenced (not restated differently) from the registry, roadmap,
      editorial standard and observation dashboard
- [x] Every contradictory attribution statement removed or superseded
- [x] The one contradiction inside an immutable file corrected by documented
      erratum, not by editing the baseline
- [x] Per-experiment creditable-ledger-row sets fixed and recorded before any
      post-change data is read
- [x] No baseline edited
- [x] No verdict, metric, threshold or confounder list changed
- [x] No experiment evaluated
- [x] EXP-004 not begun

**Engineering governance**

- [x] Governance corpus under version control
- [x] Baseline immutability enforceable by commit history from EXP-004 onward
- [x] Retroactive gap for EXP-001 – EXP-003 stated rather than papered over

**Conventions**

- [x] `Date optimized` convention adopted and applied uniformly
- [x] Registry linkage bidirectional for EXP-003; binding recorded for
      EXP-001 – EXP-002
- [x] WORK-LOG ordering corrected

**Verdict: no scientific blockers remain. Sprint 2B is frozen for observation.**

---

## 3. Deliberately left open

Not blockers. Recorded so they are not rediscovered as surprises.

1. **Check 0b (EXP-003) is runnable but not yet run.** Its blocker cleared
   during this freeze: the engine reads git commit dates rather than the working
   tree, and the template edit was committed 2026-07-30 as `18bb516`, so the
   pre-registered freshness reset is now testable. Expected on the next
   `npm run seo`: `ageDays` → 0, Priority −0.33 on all 14 pages. If Priority
   instead *rises*, the staleness-direction model (EXP-002 erratum 3) is wrong
   and must be re-opened. Engine artifact, never evidence. Not run here because
   this pass was scoped to governance only.
2. **Three engine-model findings are parked**, all recorded as errata and none
   affecting an experimental metric: freshness attribution ignores component and
   i18n dependencies; AI readiness is not page-local (the `insights` component
   compares against a site-relative word-count median, so one page's edit can
   move untouched pages' scores); and comparison-table credit is awarded for
   shape, not information (`cols >= 2 && rows >= 3`), so the gate cannot tell a
   real comparison from a list of identical rows. Queue work for after
   observation closes.
3. **CTR remains recorded, not judged** in all three experiments, per the
   standing "confirmed, low-confidence CTR" environment verdict. Promotion
   requires an explicit observation-log entry made *before* the data is read.
4. **The `src/` implementations are tracked by the repository's normal commit
   flow, not by this freeze.** They are committed (`18bb516`), which is what
   made check 0b runnable, but the baseline-commit-first discipline in §1.2
   governs governance artifacts only. Reconciling `git log` over each
   experiment's source files against its scope statement remains a required
   step before every Delta Review, per each plan's confounder section.

---

## 4. What would reopen the sprint

Freezing is not a promise that nothing can change — it is a promise that
changes are visible and justified.

- A **new experiment** (EXP-004 or later). Permitted, but it starts the
  baseline-commit-first sequence and does not alter anything in flight.
- **Editing a baseline.** Not permitted. Corrections are errata in the relevant
  observation plan.
- **Widening an experiment's manipulated-pattern set.** Not permitted after
  baseline time — this is retroactive attribution.
- **Promoting CTR to a judged metric.** Permitted only by an explicit
  observation-log entry made before the data is read.
- **Changing a threshold, metric or confounder list on an in-flight
  experiment.** Not permitted; it would make the verdict unjudgeable against
  its own pre-registration.
- **An engine or scoring-model change.** Permitted — it is not an experiment
  and receives no ID — but it must be logged in `WORK-LOG.md` and assessed
  against every in-flight experiment's by-construction metrics, because those
  are how check-0 verification is read.

---

## 5. Next milestone

**Week of 2026-08-06** — recrawl confirmation for all three experiments
(GSC URL Inspection; no metric judgment). Earliest legitimate Delta Review
**~2026-09-03**; hard stop **~2026-10-01**. Both dates slip one week for every
week a page is not recrawled.

Until then the work is observation: weekly checks logged in each plan's
observation log, and nothing else.

*Operational view: `docs/seo/OBSERVATION-DASHBOARD.md`. Canonical lifecycle and
attribution rules: `docs/seo/EXPERIMENTS.md` and the Pattern Ledger in
`docs/seo/WORK-LOG.md`.*
