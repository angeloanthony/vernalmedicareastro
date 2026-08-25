# Vernal Medicare — Master SEO Inventory

**Status: planning record. No site implementation changed.** Written 2026-08-12
during the Sprint 2B observation window. This document classifies what exists; it
does not authorise any edit. Execution gates are in `SPRINT-2C-PLAN.md`.

Standards reference: *The Complete SEO & Authority Master Guide*, Combined
Edition v2.1 (June 2026), read in full 2026-08-12.

## What this document deliberately does not contain

**No post-treatment Search Console data.** No positions, impressions, clicks or
CTR are used to rank or prioritise anything below. This is a *structural*
classification — intent, type, cluster and duplication risk are all readable from
the route map and `docs/CONTENT-INVENTORY.md`.

The reason is the ordering rule this project already operates under: EXP-001–003
are in flight and judged against pre-registered criteria at their Delta Reviews
(~2026-09-03). A "positions 4–15" opportunity sweep run now would read those
pages' current performance before their review date. That does not corrupt the
data; it corrupts the analyst, because every criterion read afterwards is read by
someone who already knows which way the numbers went.

The classification below does not need that data. The prioritisation step does,
and that step waits. See `SPRINT-2C-PLAN.md` §4 for the gate.

## Legend

| Code | Meaning |
|---|---|
| **A** | Money page — directly generates calls / leads / enrollments |
| **B** | Traffic / authority page — long-tail capture, feeds a money page |
| **C** | Tool / calculator |
| **D** | Local / entity page |
| **E** | Weak, duplicate, or off-entity — needs a consolidate / redirect / remove decision |
| **T** | Trust / E-E-A-T / utility (no ranking role) |

**Freeze column:** `LOCKED` = page is inside an in-flight experiment and must not
be edited before its Delta Review. `hold` = pre-existing hold from
`docs/CONTENT-INVENTORY.md`.

Route count: **101 route files → ~162 rendered pages** (five templates expand:
`medicare-[town]-utah` ×10, `medicare-coverage/[service]` ×11,
`does-medicare-cover-[drug]` ×14, `[drug]-assistance-program` ×14,
`medicare-news/[slug]` ×6).

---

## Cluster 1 — Core / Local pillar

| Route | Type | Decision | Freeze |
|---|---|---|---|
| medicare-plans-vernal-utah | A — **PILLAR** | Keep · upgrade candidate | free |
| index | A | Keep | **LOCKED (EXP-002)** |
| vernal | D/A | Keep | free |
| medicare-vernal-ut | D | **Consolidate review** — overlaps `vernal` + pillar | free |
| medicare-help-vernal | A | Keep | free |
| medicare-agent-vernal | A | Keep | free |
| medicare-quote-vernal | A (conversion) | Keep | free |
| free-medicare-comparison-vernal | A (conversion) | Keep | free |
| medicare-decision-center | B (wayfinding) | Keep | free |
| medicare-help-center | B (wayfinding) | Keep | free |
| medicare-search | C | Keep | free |
| medicare-quiz | C | Keep | free |

## Cluster 2 — Medigap / Supplement

| Route | Type | Decision | Freeze |
|---|---|---|---|
| medigap | A — cluster money page | Keep | **LOCKED (EXP-001)** |
| plan-g-vs-plan-n-vernal | B | Keep | free |
| medicare-plan-g-high-deductible | B | Keep | free |
| medicare-supplement-vs-advantage | B | **Consolidate review** — see next row | free |
| medicare-advantage-vs-medigap-vernal | B | **Consolidate review** — same comparison, two URLs | free |

## Cluster 3 — Medicare Advantage

| Route | Type | Decision | Freeze |
|---|---|---|---|
| medicare-advantage-plans-vernal | A | Keep | free |
| zero-premium-medicare-advantage | A | Keep | free |
| hmo-vs-ppo-medicare-advantage | B | Keep | free |
| medicare-dental-vision-hearing | B | Keep | free |

## Cluster 4 — Part D / Prescription drugs

| Route | Type | Decision | Freeze |
|---|---|---|---|
| medicare-drug-coverage | A — cluster hub | Keep | free |
| part-d-plans-vernal | A | Keep | free |
| cheapest-prescription-drug-plans | A | Keep | free |
| part-d-help-vernal | A | Keep | free |
| tier-3-vs-tier-4-medicare-part-d | B | Keep | free |
| prescription-drug-assistance | B hub | Keep | free |
| does-medicare-cover-[drug] ×14 | B | Keep | **LOCKED (EXP-003)** |
| [drug]-assistance-program ×14 | B | Keep | free |
| medicare-formulary-lookup | C | Keep · strengthen | free |
| medicare-drug-cost-calculator | C | **Consolidate review** — see next row | free |
| medicare-part-d-cost-calculator | C | **Consolidate review** — two drug-cost calculators | free |
| insulin-cost-medicare-vernal | B | overlap | hold |
| does-medicare-cover-ozempic-wegovy | B | overlap w/ template cohort | hold |
| does-medicare-cover-mounjaro-utah | B | overlap w/ template cohort | hold |
| does-medicare-cover-dental-vernal | B | superseded by `medicare-dental-vision-hearing`? | hold |

## Cluster 5 — Enrollment / Turning 65

| Route | Type | Decision | Freeze |
|---|---|---|---|
| turning-65 | A hub | Keep | free |
| medicare-enrollment-vernal | A | Keep | free |
| medicare-enrollment-periods | B | Keep | free |
| medicare-special-enrollment-period | B | Keep | free |
| medicare-general-enrollment-period | B | Keep | free |
| medicare-open-enrollment-2026 | B | Keep (year-stamped) | free |
| when-to-enroll-medicare-utah | B | Keep | free |
| missed-medicare-enrollment | B | Keep | free |
| medicare-checklist-2026 | B | Keep (year-stamped) | free |
| working-past-65 | B hub | Keep | free |
| medicare-and-employer-coverage | B | Keep | free |
| delaying-medicare-part-b | B | Keep | free |
| cobra-and-medicare | B | Keep | free |
| medicare-creditable-coverage | B | Keep | free |
| medicare-eligibility-calculator | C | Keep | free |
| medicare-enrollment-timeline | C | **Consolidate review** — see next row | free |
| medicare-enrollment-countdown | C | **Consolidate review** — overlapping tools | free |
| medicare-penalty-calculator | C | **Consolidate review** — see next row | free |
| medicare-part-b-penalty-calculator | C | **Consolidate review** — two penalty calculators | free |

## Cluster 6 — Costs / IRMAA / Assistance

| Route | Type | Decision | Freeze |
|---|---|---|---|
| medicare-costs | A hub | Keep | free |
| medicare-cost-uintah-county | B/D | Keep | free |
| medicare-out-of-pocket-maximum-2026 | B | Keep (year-stamped) | free |
| medicare-cost-estimator | C | Keep | free |
| medicare-irmaa | B hub | Keep | free |
| medicare-irmaa-brackets-2026 | B | Keep (year-stamped) | free |
| medicare-irmaa-appeal-ssa-44 | B | Keep | free |
| medicare-irmaa-life-changing-events | B | Keep | free |
| how-to-reduce-medicare-irmaa | B | Keep | free |
| medicare-irmaa-calculator | C | Keep | free |
| medicare-financial-assistance | B hub | Keep | free |
| medicare-extra-help-utah | B | Keep | free |
| medicare-extra-help-calculator | C | Keep | free |
| medicare-savings-programs-utah | B | Keep | free |
| medicare-income-limits-2026 | B | Keep (year-stamped) | free |
| dual-eligible | B hub | Keep | free |
| d-snp-plans-utah | B | Keep | free |
| medicare-medicaid-utah | B | Keep | free |

## Cluster 7 — Local authority / entity

| Route | Type | Decision | Freeze |
|---|---|---|---|
| medicare-roosevelt-utah | D | Keep | free |
| medicare-duchesne-utah | D | Keep | free |
| medicare-[town]-utah ×10 | D | Keep | free |
| medicare-hospitals-uintah-county | D | Keep | free |
| medicare-ashley-regional-vernal | D | Keep | free |
| medicare-uintah-basin-medical-center | D | Keep | free |
| medicare-vernal-pharmacies | D | Keep | free |

## Cluster 8 — Coverage / services

| Route | Type | Decision | Freeze |
|---|---|---|---|
| medicare-coverage | B hub | Keep | free |
| medicare-coverage/[service] ×11 | B | Keep | free |
| medicare-part-a-vs-part-b | B | Keep | free |
| medicare-home-health-utah | B | Keep | free |
| medicare-out-of-state-utah | B | Keep | free |

## Reference, trust, and off-entity

| Route | Type | Decision |
|---|---|---|
| medicare-glossary | B | Keep |
| medicare-news + [slug] ×6 | B | Keep |
| faq | B | Keep |
| medicare-calculators | C hub | Keep |
| about · medicare-agent-credentials · editorial-policy · reviews · terms · privacy | T | Keep |
| 404 | T | Keep |
| [locale]/[...path] | — | i18n router |
| **aca** | **E — off-entity** | **Decision needed** — not Medicare |
| **indemnity** | **E — off-entity** | **Decision needed** — not Medicare |
| **life** | **E — off-entity** | **Decision needed** — not Medicare |

---

## Finding 1 — The architecture is largely already built

Of the ~60 supporting pages named as build targets in the Master Guide
programme, the overwhelming majority already exist as live routes:

- **Part D** — complete, including both tools. Nothing to build.
- **Enrollment / Turning 65** — complete, plus four tools. Nothing to build.
- **Costs / IRMAA / Assistance** — complete (five IRMAA routes, three assistance
  routes, dual-eligible sub-cluster). Nothing to build.
- **Local authority** — complete (13 towns, three provider pages, pharmacies,
  county cost page).
- **Medicare Advantage** — near complete.
- **Medigap** — the only cluster with a real gap (Finding 2).

The job is therefore *consolidate and connect what exists*, not *build the
clusters*.

## Finding 2 — The genuine content gaps are ~8 pages, concentrated in Medigap

1. **Medigap when turning 65** — the intersection page. `turning-65` and
   `medigap` both exist; the combined use-case page does not. Master Guide
   Part 7, p.16 names `medicare-supplement-plans-turning-65-utah.html` as a
   **Priority 1** niche/use-case page for this exact site.
2. Medigap guaranteed-issue rights (Utah)
3. Medigap medical underwriting
4. Switching from Medicare Advantage to Medigap
5. Medigap costs in Utah
6. **Medicare and Social Security** — named as Supporting Page 4 in the guide's
   own Vernal Medicare cluster (p.16) and in its intent map (p.10). Confirmed
   absent: no route matches.
7. Medicare Advantage networks
8. Switching Medicare Advantage plans

The programme's intuition that Medigap is the biggest opportunity and the
structural gap analysis converge on the same cluster by different routes.

## Finding 3 — Six consolidation candidates

Each is two routes competing for one intent:

| Pair | Issue |
|---|---|
| `medicare-supplement-vs-advantage` ↔ `medicare-advantage-vs-medigap-vernal` | same comparison, two URLs |
| `medicare-drug-cost-calculator` ↔ `medicare-part-d-cost-calculator` | two drug-cost calculators |
| `medicare-penalty-calculator` ↔ `medicare-part-b-penalty-calculator` | two penalty calculators |
| `medicare-enrollment-timeline` ↔ `medicare-enrollment-countdown` | overlapping enrollment tools |
| `medicare-vernal-ut` ↔ `vernal` ↔ `medicare-plans-vernal-utah` | three local-core routes |
| `aca` · `indemnity` · `life` | off-entity for a site whose entity is *Vernal Medicare* |

**All six require GSC data to resolve** — which page holds the intent is not
answerable from structure. Every one is also a redirect, i.e. an internal-link-
graph change. Gated; see `SPRINT-2C-PLAN.md`.

## Finding 4 — Why the execution steps cannot run yet

Three mechanisms, all measured in this project rather than hypothetical:

1. **Direct overwrite.** Upgrading money and supporting pages hits `/medigap`
   (EXP-001), `/` (EXP-002) and the 14-page `does-medicare-cover-[drug]` cohort
   (EXP-003). Editing them ends those experiments with no verdict.
2. **The site-relative median.** AI readiness is not page-local — `insights`
   scores against a site-wide word-count median recomputed every run. Publishing
   8 new pages moves that median, which moves the AI score of pages nobody
   touched. Measured: the EXP-003 cohort edit moved it 552 → 566 and three
   untouched pages each lost 3.3 AI points. ~46 EN pages sit within ±60 words of
   the median.
3. **The internal-link graph.** Bidirectional cluster linking and six
   consolidation redirects both rewrite the link environment of pages under
   observation. EXP-001's manipulated set explicitly includes the internal-link
   pattern.

Off-site is not exempt: Google Business Profile activity moves local rankings,
and the home page under EXP-002 is local-intent. GBP work mid-window would add
an unlogged confounder.

## Finding 5 — Master Guide verification

Every claim previously taken on summary was checked against the source:

| Claim | Verified at |
|---|---|
| `medicare-supplement-plans-turning-65-utah.html` is a Priority 1 niche/use-case page for Vernal Medicare | Book One, Part 7, p.16 |
| GSC position 4–15 audit is the fastest growth path, run **before** building new | Part 4, Step 4B, p.12 |
| Vernal Medicare is the worked topic-cluster example, pillar = `medicare-plans-vernal-utah.html` | Part 6, pp.15–16 |
| Money pages first, then traffic pages ("The Golden Rule") | Part 3, p.11 |
| Cluster = pillar + 3–8 supporting + bidirectional links | Part 6, p.14 |
| Three-layer AI stack (summary block / structured data / schema+GBP) | Part 13, p.26 |
| Firsthand-experience templates use Vernal Medicare as the example | Part 8, pp.19–20 |
| Every-new-page checklist | Part 7, p.17 and Master Launch Checklist, p.38 |

Two scope corrections:

- **Book Two is a worked example for AdventureToursVernal.com**, not a Vernal
  Medicare plan. Its File/URL Action Plan is a *pattern to imitate*, not a
  literal 162-page task list to execute here.
- **The guide is written for small sites.** Its cluster examples run 5–6
  supporting pages; the Vernal Medicare example names five. This site has ~162
  pages and a governance framework. The guide supplies *standards*; it is not a
  sequencing plan at this scale.

### 5.1 The guide's own timeline defers the 4–15 audit

Book One, Part 2, p.9, *Realistic Timelines*: ranking movement takes **30–90
days**. EXP-001–003 shipped 2026-07-30; on 2026-08-12 that is **day 13**.
Running the Step 4B audit now would read the treated pages before the guide's
own stated movement window opens.

The guide and the freeze reach the same conclusion by different routes. No
appeal to the freeze is required to defer Step 4B.

### 5.2 Three places the guide is overridden by local measurement

The guide is generic advice; this project has instrument measurements. Where
they disagree the measurement governs — in each case because the guide's action
has a second effect on *this project's scoring engine* that the guide cannot
know about.

| Guide says | This project measured |
|---|---|
| Monthly routine: "Update the `dateModified` in your schema" (Part 21, p.34) | `freshness = clamp01(ageDays/365)` × weight 5 — a **staleness** factor. Resetting `lastModified` *lowers* Priority ~0.33. EXP-002's baseline predicted the opposite; that is erratum 3. |
| 800–1,500 words per page; under 400 is thin (pp.8, 17) | Word count is not page-local here: `insights` scores against a **site-relative median**. The EXP-003 edit moved it 552→566 and cost three untouched pages 3.3 AI points each. |
| Add comparison / pricing tables (Part 8, p.18) | `hasComparisonTable = cols>=2 && rows>=3` — credit is for **shape, not information**. A table of identical rows scores like a real comparison. Only editorial review catches it. |

None of this makes the guide wrong about search. Each means a guide instruction
applied here has a measured side effect on the project's own instrument.

### 5.3 Checks run against the guide's standards

- **`medicare-and-social-security` — confirmed missing.** See Finding 2 #6.
- **Town pages — passed, no action.** Part 7 Priority 3 (p.16) warns city pages
  must carry unique local content, "not just the same template with the city
  name swapped." `medicare-[town]-utah` renders from `src/data/towns.ts`, which
  carries per-town county, hospital, distance-from-office, nearby towns, ZIPs, a
  bespoke intro and two bespoke FAQs each. Data-driven, not name-swapped.
- **`/medigap` URL vs. keyword — real conformance gap.** Guide p.17 requires the
  URL to include the full keyword phrase; p.10 names the money page
  `medicare-supplement-utah.html`. This site's is `/medigap`. **But the page is
  EXP-001 and a URL change is also a redirect** — gated to Sprint 2C.
