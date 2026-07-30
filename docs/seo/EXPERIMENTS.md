# Experiment Registry

**Canonical index of all editorial experiments.** Every experiment gets a
stable identifier (`EXP-NNN`) here at the moment its baseline is written, and
every other document — Work Log entries, baselines, observation plans, Delta
reviews, Pattern Ledger evidence citations — refers to the experiment by that
ID. The registry is the durable index; the evidence itself lives in the linked
documents, never here.

**What belongs in this registry:** experiments — content changes made under a
pre-registered hypothesis with a baseline and an observation plan. Engine,
data-layer, and scoring-model changes (e.g. the 2026-07-29 structural queue
audit, the 2026-07-30 `normalizeUrl()` fix) are logged in
`docs/seo/WORK-LOG.md` but are **not** experiments and receive no ID.

## ID rules

- IDs are sequential (`EXP-001`, `EXP-002`, …), assigned in baseline order,
  and **never reused or renumbered** — a withdrawn experiment keeps its ID
  with status *Closed — Withdrawn*.
- An ID is assigned when the baseline document is written, before
  implementation. Retroactive assignment happened once, on 2026-07-30, for the
  two experiments that predate this registry.
- One ID = one hypothesis judged as a unit. If a change bundles several
  patterns, that is still one experiment (type: Bundled); the bundling is
  recorded in the experiment's attribution note.

## Lifecycle

Every experiment progresses through the same states, in order:

| State | Entered when | Exit criteria |
|---|---|---|
| **1. Baseline** | Baseline document written and marked immutable; hypothesis and primary metric pre-registered | Change deployed |
| **2. Implemented** | Change deployed; check-0 (post-deploy verification) run — by-construction metrics verified against the baseline's pre-registrations, errata recorded in the observation plan if any prediction was wrong | Check-0 verified |
| **3. Observing** | Check-0 complete; weekly checks logged per the observation plan | Decision point reached (≥4 weeks post-recrawl data) or hard stop (8 weeks) |
| **4. Delta Review** | Baseline §8 table filled from a post-change-only GSC window; hypothesis judged against the plan's pre-registered thresholds | Verdict written to the WORK-LOG Outcome |
| **5. Closed** | Verdict recorded with one of: **Supported**, **Directionally Supported**, **Not Supported**, **Inconclusive**, **Regressed** — plus Pattern Ledger evidence updated per the attribution note | Terminal |

Rules that hold across all states:

- The baseline is immutable from the moment implementation begins; corrections
  are recorded as errata in the observation plan, never by editing the
  baseline.
- The verdict is judged only against thresholds pre-registered in the
  observation plan. Metrics recorded-but-not-judged (e.g. CTR under the
  low-confidence environment) can be promoted to judged only by an explicit
  observation-log entry made *before* the data is read, never retroactively.
- A materially fired confounder (per the baseline's risk section) caps the
  verdict at Directionally Supported.
- Status changes in this registry are one-directional; the registry row and
  the experiment record update together.
- **Pattern Ledger attribution.** Evidence is credited only to editorial
  patterns the experiment **intentionally manipulated** — the set fixed in
  this registry's *Patterns under evaluation* field at baseline time. Patterns
  merely present on the page are environment, not evidence. The canonical
  statement of this rule, with its consequences, lives in the Pattern Ledger
  in `docs/seo/WORK-LOG.md`; that statement governs wherever any document
  appears to disagree. The manipulated set cannot be widened after the data is
  read.

## Registry conventions

Adopted 2026-07-30 at the Sprint 2B freeze, to remove three inconsistencies
found in the governance audit. All three apply from **EXP-004 onward**; the
in-flight experiments are reconciled where reconciliation does not require
editing an immutable file.

**1. Registry linkage is bidirectional.** A baseline and an observation plan
each carry their `EXP-NNN` in the H1, as
`baselines/drug-coverage-cohort-2026-07-30.md` does. EXP-001 and EXP-002
predate the registry and were assigned retroactively, so their baselines carry
no ID in-file and — being immutable — will not gain one; their binding is
recorded here (the *Baseline* field of each record) and in each observation
plan's header. This is the one permitted gap, and it closes at EXP-004.

**2. `Date optimized` is not the implementation date.** The field is frozen at
baseline-write time and records only what was known then; on a baseline
written before implementation it therefore reads *not yet implemented* forever,
because correcting it would mean editing an immutable file. The authoritative
implementation date is the **Status** field of the registry record, corroborated
by the WORK-LOG entry and the observation plan's *Change deployed* line.
Baselines from EXP-004 onward **omit the field entirely** — a baseline
describes the world before the change, and an implementation date is not part
of that world.

**3. An experiment does not exist until its baseline is committed.** The order
is: baseline written → baseline committed to Git → ID assigned here → the
registry row committed → implementation begins. Immutability is then enforced
by commit history rather than by convention: any later edit to a baseline is
visible as a diff against the commit that preceded implementation. This rule is
**not applied retroactively** — the EXP-001 – EXP-003 baselines entered version
control together on 2026-07-30, after implementation, and their pre-commit
integrity rests on convention alone. That limitation is recorded in
`docs/seo/SPRINT-2B-FREEZE.md` and is the reason the rule exists.

## Index

| ID | Title | Page(s) | Type | Primary metric | Status |
|---|---|---|---|---|---|
| [EXP-001](#exp-001--medigap-bundle) | Medigap Bundle | /medigap.html | Bundled | Average position | Observing |
| [EXP-002](#exp-002--homepage-summaryblock) | Homepage SummaryBlock | / | Isolated | Average position | Observing |
| [EXP-003](#exp-003--drug-coverage-comparison-table) | Drug-Coverage Comparison Table | 14 × `does-medicare-cover-*` | Isolated (replicated) | Treated-arm weighted position | Observing |

---

## EXP-001 — Medigap Bundle

| Field | Value |
|---|---|
| **Identifier** | EXP-001 |
| **Title** | Medigap pillar expansion (Sprint 2B, optimization #1) |
| **Page(s)** | `/medigap.html` (judged); `/es/medigap.html` via shared component (orientation only) |
| **Type** | **Bundled** — seven patterns in one change |
| **Patterns under evaluation** | Standard comparison table, standard definition pattern, standard source section, standard internal-link pattern (6 → 12 outbound), contextual depth (249 → 1,128 words), FAQ expansion, title/meta rewrite |
| **Primary hypothesis** | We expect this change to improve average position because the pillar already ranks at 13.7 in the striking-distance band while being 3.5× thinner than its cluster siblings, so adding the standard comparison table, definitions, sources, and 8+ internal links supplies the depth that is the page's only structural deficit. |
| **Primary metric** | Average position (baseline 13.73). Supported = ≤10.0; directional = ≥2.0 improvement. Secondary: impressions (baseline 70). CTR/clicks recorded, not judged. |
| **Status** | **Observing** — deployed 2026-07-30, check-0 verified (completeness 100%, AI 92, 1,128 words, 12 outbound); recrawl confirmation due week of 2026-08-06; decision point ≥4 weeks post-recrawl, hard stop 8 weeks |
| **Baseline** | `docs/seo/baselines/medigap-2026-07-29.md` (immutable) |
| **Observation plan** | `docs/seo/observation-plans/medigap-2026-07-30.md` |
| **Delta report** | *Pending* — recorded by filling baseline §8 and the WORK-LOG Outcome at Delta Review |
| **Work-log entry** | `docs/seo/WORK-LOG.md` → "2026-07-30 — /medigap pillar expansion (Sprint 2B, optimization #1)" |
| **Pattern Ledger implications** | A supported outcome validates the **bundle on this page archetype** (thin pillar, striking distance, strong inbound authority) — each of the seven manipulated patterns gains one *bundled* data point, and nothing else does. Four of the seven are ledger rows (comparison table, definitions, sources, internal-link pattern); contextual depth, FAQ expansion, and the title/meta rewrite are judged inside the bundle but have no ledger row. Per the attribution rule, the **AI summary and CTA patterns receive nothing from this experiment** — both were already present on `/medigap` (baseline §3) and neither was manipulated. No pattern can graduate on this experiment alone; bundled evidence complements isolated evidence (see EXP-002). |

## EXP-002 — Homepage SummaryBlock

| Field | Value |
|---|---|
| **Identifier** | EXP-002 |
| **Title** | Homepage AI summary (Sprint 2B, experiment #2 — first isolated pattern test) |
| **Page(s)** | `/` (judged); `/es.html` via shared HomePage component (orientation only) |
| **Type** | **Isolated** — exactly one pattern on one page |
| **Patterns under evaluation** | Standard AI summary (`<SummaryBlock>`) — nothing else: no title/meta, links, tables, definitions, byline, sources, or restructuring |
| **Primary hypothesis** | We expect this change to improve average position because the homepage already ranks at 7.2 in the striking-distance band on the site's highest impression volume, and its dominant structural deficit is extractability (AI readiness 47, `needsSummary`) — adding the standard AI summary block under the H1 gives Google and AI surfaces a clean, quotable statement of what the page is about, which is the single element the queue prescribes. |
| **Primary metric** | Average position (baseline 7.15, post-change-only window). Supported = ≤5.0 with impressions flat/up; directional = ≥1.0 improvement; regressed = worsens ≥1.0 or impressions fall >30% against flat site-wide. Secondary guard: impressions (baseline 1,040). CTR/clicks recorded, not judged (environment "confirmed, low-confidence CTR"). |
| **Status** | **Observing** — deployed 2026-07-30, check-0 verified (completeness 33%, AI 67, 1,189 words, all non-summary components unchanged); two baseline errata recorded in plan §0 (`aiGap` floor is 70, not <67, so the flag stays set; freshness does not reset — engine tracks route-file commits only); recrawl confirmation due week of 2026-08-06; decision point ≥4 weeks post-recrawl, hard stop 8 weeks |
| **Baseline** | `docs/seo/baselines/home-2026-07-30.md` (immutable) |
| **Observation plan** | `docs/seo/observation-plans/home-2026-07-30.md` |
| **Delta report** | *Pending* — recorded by filling baseline §8 and the WORK-LOG Outcome at Delta Review |
| **Work-log entry** | `docs/seo/WORK-LOG.md` → "2026-07-30 — / homepage AI summary (Sprint 2B, experiment #2)" |
| **Pattern Ledger implications** | A supported outcome is the ledger's **first isolated data point** (graduation criterion #2), and the AI-summary pattern's **only** evidence: it would stand at 1 data point (1 isolated, 0 bundled). EXP-001 contributes nothing to this pattern — `/medigap` already carried a `<SummaryBlock>` and the bundle did not manipulate it (attribution rule, Pattern Ledger). **Corrects an earlier statement** in this record and in baseline §7, both of which projected 2 data points (1 isolated + 1 bundled); erratum 4 in the observation plan §0. A confounded outcome (baseline §6, types 2–5) caps at "supported with confound noted," which does **not** satisfy the isolated-evidence requirement. |

## EXP-003 — Drug-Coverage Comparison Table

| Field | Value |
|---|---|
| **Identifier** | EXP-003 |
| **Title** | Standard comparison table on the `does-medicare-cover-[drug]` cohort (Sprint 2B, experiment #3 — first replicated isolated test) |
| **Page(s)** | 14 pages rendered from `src/pages/does-medicare-cover-[drug].astro`. **Treated arm (12):** dupixent, rinvoq, skyrizi, enbrel, eliquis, xarelto, entresto, humira, repatha, trulicity, farxiga, jardiance. **Control arm (2):** trelegy, zepbound — condition-group singletons that render no table. No Spanish variants exist. |
| **Type** | **Isolated (replicated)** — one pattern, 12 structurally identical pages, 2 untreated siblings as control |
| **Patterns under evaluation** | Standard comparison table — nothing else: no title/meta, definitions, depth, links, schema, or FAQ changes |
| **Primary hypothesis** | We expect this change to improve average position because the twelve treated pages already rank at an impression-weighted 12.7 in the striking-distance band while missing the one element the editorial standard says a Part D page cannot omit — a page whose entire job is answering "is this drug covered, and how does it compare" currently compares nothing — so adding the standard comparison table supplies the cohort's single structural deficit. |
| **Primary metric** | Impression-weighted average position across the 12 treated pages (baseline 12.66), post-change-only window. Supported = ≤10.0 with impressions flat/up and the control arm not moving comparably; directional = ≥1.5 improvement; regressed = worsens ≥1.5 or treated impressions fall >30% against flat site-wide. Secondary guard: treated impressions (913). Reference: control weighted position (14.52). CTR/clicks recorded, not judged — 2 clicks on 1,100 impressions. |
| **Status** | **Observing** — deployed 2026-07-30, check-0 verified (12 treated pages at tables 1 / completeness 91 / AI 79 on nine and 82 on three; control unchanged at 74 / 82; outbound, definitions, summary, FAQ, sources, byline, schema all unchanged; gate raised exactly 12 floors). Five errata in plan §0: the AI `insights` component is coupled to word count via a site-relative median; that median shifted 552 → 566 and cost three untouched pages 3.3 AI points each; the freshness prediction is pending commit because the engine reads git history, not the working tree; the pre-registered 3-column table was degenerate on 8 of 12 pages and gained a fourth column at t=0; and `thin` cleared on jardiance. Recrawl confirmation due week of 2026-08-06; decision point ≥4 weeks post-recrawl, hard stop 8 weeks |
| **Baseline** | `docs/seo/baselines/drug-coverage-cohort-2026-07-30.md` (immutable) |
| **Observation plan** | `docs/seo/observation-plans/drug-coverage-cohort-2026-07-30.md` |
| **Delta report** | *Pending* |
| **Work-log entry** | `docs/seo/WORK-LOG.md` → "2026-07-30 — `does-medicare-cover-[drug]` comparison table (Sprint 2B, experiment #3)" |
| **Pattern Ledger implications** | The Standard comparison table currently holds one *bundled* data point (EXP-001). A supported outcome here is its first **isolated** evidence, replicated across 12 pages — the strongest single result the ledger can hold, and enough on its own to put the pattern at 1 isolated + 1 bundled. The pattern is required by 5 of 9 cluster standards (`part-d`, `costs-irmaa`, `medicare-advantage`, `medigap`, `other-insurance`), so its status governs more future editorial work than any other unproven pattern. |

**Why a cohort and not a page** (full screening in baseline §0): no single page
satisfied all three preconditions. 55 of 162 pages are template-rendered —
including five of the top six Opportunity pages — so single-page isolation is
unavailable where opportunity is highest. Among standalone pages, those in the
5–20 position band project only 34–39 impressions into a 4-week window, while
those with volume (95–137) sit at position 25–45, outside the band where the
proximity model predicts on-page patterns convert. The cohort is the only
configuration with both. This follows the registry's granularity rule — one ID
is one hypothesis, however many pages it touches — and strengthens rather than
weakens the design.

---

*Registry created 2026-07-30 (Sprint 2B). EXP-001 and EXP-002 were registered
retroactively; all future experiments receive their ID at baseline time.*
