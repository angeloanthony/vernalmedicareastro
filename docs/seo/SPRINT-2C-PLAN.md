# Sprint 2C — Planning Record

**Status: planning only. Nothing here is authorised for implementation.**
Opened 2026-08-12, during the Sprint 2B observation window. No site
implementation was changed to create this document.

Companion: `MASTER-SEO-INVENTORY.md` (the classification this plan draws on).
Standards reference: *The Complete SEO & Authority Master Guide*, Combined
Edition v2.1 (June 2026).

---

## 0. Filing note — why this is not in `SEO-QUEUE.md`

`SPRINT-2B-FREEZE.md` §4.1 directs inadmissible proposals to "the EXP-004 queue
in `SEO-QUEUE.md`". **That instruction cannot be followed as written.**
`SEO-QUEUE.md` carries the header *"GENERATED FILE — DO NOT EDIT BY HAND. Run
`npm run seo` to regenerate"* and is one of ten reports written by
`scripts/seo/run.mjs` (lines 197–206). Anything hand-added to it is destroyed by
the next engine run.

This is a defect in the freeze document, not in the queue. Recorded here rather
than corrected in place, because amending a governance document is itself a
change that should be decided rather than performed silently. **Open item:**
`SPRINT-2B-FREEZE.md` §4.1 should be redirected to this file.

## 1. Why Sprint 2C is not open yet

Three independent reasons, any one of which is sufficient:

1. **The freeze.** EXP-001–003 are Observing. Their pages must not be disturbed
   before their Delta Reviews (earliest ~2026-09-03, hard stop ~2026-10-01).
2. **The Master Guide's own timeline.** Book One, Part 2, p.9: meaningful
   ranking movement takes **30–90 days**. The experiments shipped 2026-07-30; on
   2026-08-12 that is day 13. The guide's Step 4B audit (p.12) would read
   pre-movement data.
3. **Measured non-local side effects.** This site's scoring engine has
   demonstrated that page edits move site-wide values the generic guide cannot
   account for — the word-count median, freshness direction, and table credit.
   See `MASTER-SEO-INVENTORY.md` §5.2.

There is accordingly no remaining argument for running the 4–15 audit early.

## 2. Cluster status

| Cluster | Status |
|---|---|
| Part D / prescription drugs | **Confirmed complete** — hub, four money pages, two tools, 14+14 template cohorts |
| Enrollment / Turning 65 | **Confirmed complete** — hub, all four enrollment periods, four tools, working-past-65 sub-cluster |
| Costs / IRMAA / Assistance | **Confirmed complete** — five IRMAA routes, three assistance routes, dual-eligible sub-cluster |
| Local authority | **Confirmed complete** — 13 towns, three provider pages, pharmacies, county costs |
| Medicare Advantage | **Near complete** — money pages and core comparisons present; networks and plan-switching absent |
| Medigap / Supplement | **Confirmed structural gap** — the one cluster with a real content deficit. This is a *finding*, not an instruction to build; the candidates in §3.2 stay blocked until the §4 gate opens. |

## 3. Queue

### 3.1 Confirmed missing, named by the guide for this site

- **`medicare-and-social-security`** — **Confirmed Master Guide gap — deferred
  until the Sprint 2C execution gate.** Named as Supporting Page 4 in the
  guide's own Vernal Medicare cluster (p.16) and in its intent map (p.10);
  `MASTER-SEO-INVENTORY.md` confirms no corresponding route exists.

  This is a particularly clean work item precisely because it did not come from
  keyword research or from an idea generated during the freeze. The standards
  document names it as part of this site's worked cluster, and the route
  inventory independently confirms its absence. Two sources, neither of which is
  post-treatment performance data. It remains **blocked** regardless.

### 3.2 Medigap candidates (evaluate first when the gate opens)

- **Medigap × turning 65 intersection page** — guide Priority 1 niche/use-case
  page for Vernal Medicare (p.16). Highest-ranked candidate.
- Medigap guaranteed-issue rights (Utah)
- Medigap medical underwriting
- Switching from Medicare Advantage to Medigap
- Medigap costs in Utah

### 3.3 Medicare Advantage candidates

- Medicare Advantage networks
- Switching Medicare Advantage plans

### 3.4 GSC-dependent — cannot be decided from structure

The six consolidation candidates. Which route holds the intent is answerable
only from performance data; each resolution is also a redirect, i.e. an
internal-link-graph change.

| Pair | Issue |
|---|---|
| `medicare-supplement-vs-advantage` ↔ `medicare-advantage-vs-medigap-vernal` | same comparison, two URLs |
| `medicare-drug-cost-calculator` ↔ `medicare-part-d-cost-calculator` | two drug-cost calculators |
| `medicare-penalty-calculator` ↔ `medicare-part-b-penalty-calculator` | two penalty calculators |
| `medicare-enrollment-timeline` ↔ `medicare-enrollment-countdown` | overlapping enrollment tools |
| `medicare-vernal-ut` ↔ `vernal` ↔ `medicare-plans-vernal-utah` | three local-core routes |
| `aca` · `indemnity` · `life` | off-entity for a site whose entity is *Vernal Medicare* |

### 3.5 Conformance item

- **`/medigap` vs. the guide's `medicare-supplement-utah.html` convention.**
  Guide p.17 requires the URL to carry the full keyword phrase. Doubly gated:
  the page is EXP-001, and the fix is a redirect.

### 3.6 Blocked

**Implementation of everything in §3.1–3.5 is blocked** until the relevant gate
in §4 opens. Recording an item here is not authorisation to build it.

## 4. Sequence and gates

| When | Action | Gate |
|---|---|---|
| **Now** | Recrawl check for all three experiments — four fields only (observation date, last-crawl date, observed latency, recrawled y/n). No metric judgment. | Open; overdue since week of 2026-08-06 |
| **Now** | This plan and `MASTER-SEO-INVENTORY.md` recorded | Open — planning only |
| **Now → ~2026-08-29** | Leave the treated cohorts alone. Allow ranking movement to occur. | — |
| **~2026-09-03** | Delta Reviews against pre-registered criteria | Requires recrawl confirmed; slips one week per week not recrawled |
| **~2026-09-03** | Master Guide Step 4B position 4–15 audit | Requires Delta Reviews complete |
| **~2026-09-03** | Evaluate the six consolidation candidates against real performance data | Requires the 4–15 audit |
| **After the above** | Promote items from §3 and execute the first evidence-backed Sprint 2C changes | Requires a named criterion per item |

Reading order at the September gate: **re-read each experiment's pre-registered
criterion before opening its data.** The freeze protects against pre-outcome
tampering; only reading order protects against post-outcome rationalisation.

## 5. How the Master Guide is used here

The guide's standards become the **acceptance criteria for each change when that
change becomes admissible** — not a generator of new work.

Concretely: when an item from §3 is promoted, it is built to the guide's
every-new-page checklist (p.17 / p.38) and the Content Depth Framework's six
blocks (p.18), and judged against the money-page/traffic-page classification
(p.11). What the guide does *not* do is add items to §3 that the site's own
evidence has not identified as gaps.

Three guide instructions are explicitly **overridden** by local measurement and
must not be applied mechanically — `dateModified` refreshes, word-count targets,
and table-count credit. See `MASTER-SEO-INVENTORY.md` §5.2.

## 6. Not in scope for Sprint 2C planning

- Google Business Profile / local citation work. It moves local rankings and the
  EXP-002 home page is local-intent; it would add an unlogged confounder
  mid-window. Revisit after the Delta Reviews.
- Any new experiment (EXP-004 or later). Permitted after the freeze lifts, but
  it starts the baseline-commit-first sequence in `EXPERIMENTS.md` and does not
  alter anything in flight.
