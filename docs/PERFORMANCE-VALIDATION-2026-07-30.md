# Performance Queue Validation Report — 2026-07-30

The first run of the Opportunity Queue with real Search Console data. Purpose:
decide whether the performance-aware queue has earned the same trust as the
structural queue before Sprint 2B editorial work begins.

**Inputs** — `data/search-console/pages-2026-07-29.csv` (Performance → Pages,
last 3 months ≈ 2026-04-30 → 2026-07-29, exported 2026-07-29): 200 URL rows,
50 clicks / ~7.7K impressions site-wide. Baselines compared:
`docs/seo/history/2026-07-29.json` (structural) vs
`docs/seo/history/2026-07-30.json` (performance-aware). English pages only —
the population the work queue ranks. Every number below is reproducible from
those two snapshots plus the CSV.

---

## 0. Precondition: a URL-join defect was found and fixed before validation

The first performance run was **invalid** and was discarded. 115 of 200
Search Console URLs matched no built page, because Google indexes this site's
**extensionless** URLs (`/aca`) while the registry, internal links and
canonical tags all use `.html` (`/aca.html`). Cloudflare Pages serves both
forms; `normalizeUrl()` treated them as different pages, so most of the site's
real search history was orphaned and pages with genuine impressions still
scored as unproven.

**Fix** — `normalizeUrl()` in `scripts/seo/parse.mjs` now folds extensionless
paths into the `.html` key (root `/` and real file extensions untouched). Six
new unit tests pin the behaviour; the full suite passes (142 tests). After the
fix, exactly **1** of 200 GSC URLs is unmatched: `/privacy.html` (noindex by
design, 4 stray impressions) — explainable, harmless.

**Governance classification** — this is a data-layer correctness fix, not a
scoring change. No weight, threshold or business assumption was touched. It is
logged in `docs/seo/WORK-LOG.md`.

Two side-findings from the same defect, for the non-editorial backlog:

- Google indexes **both** URL forms for some pages (e.g. both
  `/medicare-irmaa-life-changing-events` and `…​.html` appear in the export)
  despite canonical tags pointing at `.html`. A host-level 301 from the
  non-canonical form in `public/_redirects` would consolidate signals.
- The export merge handles the duplicates correctly (clicks/impressions sum,
  position impression-weighted), so scores are already computed on the
  combined truth.

---

## 1. Queue-level shape change

| | Structural (07-29) | Performance-aware (07-30) |
|---|---|---|
| Active factors | business 50 · pillar 25 · linkWeakness 12.5 · freshness 12.5 | impressions 30 · position 25 · business 20 · pillar 10 · ctrOpportunity 5 · linkWeakness 5 · freshness 5 |
| Priority 1 (≥68) | 3 pages | 11 pages |
| Priority 2 | 37 | 52 |
| Distinct score levels | ~5 (lattice: 76/66/56/52/51…) | near-continuous |

The lattice is gone. The structural queue was a classification system; with
impressions and position live, scores now separate on real entropy — exactly
the evolution predicted when the model was frozen.

## 2. Top 10: entries and exits

**9 of 10 pages turned over.** Only `/medigap` held (structural #3 →
performance #2).

| # | Performance-aware top 10 | Score | Structural was | Clicks | Impr | Pos |
|---:|---|---:|---|---:|---:|---:|
| 1 | `/` (homepage) | 77 | 51 (r16) | 23 | 1,040 | 7.2 |
| 2 | `/medigap` | 77 | 76 (r3) | 0 | 70 | 13.7 |
| 3 | `/does-medicare-cover-dupixent` | 76 | 43 (r57) | 1 | 288 | 9.5 |
| 4 | `/medicare-help-vernal` | 74 | 50 (r34) | 2 | 126 | 6.5 |
| 5 | `/does-medicare-cover-trelegy` | 72 | 50 (r26) | 1 | 154 | 13.4 |
| 6 | `/does-medicare-cover-enbrel` | 71 | 44 (r51) | 0 | 95 | 9.9 |
| 7 | `/skyrizi-assistance-program` | 71 | 50 (r37) | 0 | 111 | 14.3 |
| 8 | `/enbrel-assistance-program` | 70 | 50 (r28) | 3 | 164 | 13.8 |
| 9 | `/does-medicare-cover-rinvoq` | 69 | 44 (r54) | 0 | 115 | 12.0 |
| 10 | `/medicare-vernal-ut` | 69 | 48 (r40) | 0 | 67 | 6.7 |

**Left the top 10:** `/medicare-advantage-plans-vernal` (76→63, r1→r19),
`/medicare-plans-vernal-utah` (76→63, r2→r21), `/prescription-drug-assistance`
(66→33, r4→r99), `/dual-eligible`, `/medicare-costs`,
`/medicare-enrollment-periods`, `/medicare-financial-assistance`,
`/medicare-irmaa`, `/turning-65`.

## 3. Every move > 10 points or > 10 ranks, explained

122 pages moved past the threshold. All 122 decompose into four mechanism
classes (full per-page table in the appendix):

**Class B — demand at striking distance (51 pages, risers).** Real impressions
at position 4–20. They gain up to 30 impression points (log-scaled against
p95 = 180) plus 21–25 position points. The entire new top 10 is this class.
Factor decomposition of the #3 riser `/does-medicare-cover-dupixent`
(43 → 76, r57 → r3): impressions 30.0 + position 25.0 + business 16.0 +
ctrOpportunity 4.3 + freshness 0.3 = 75.6 ≈ 76. Every top-10 page decomposes
the same way from its own metrics.

**Class C — demand, far position (25 pages, moderate risers).** High
impressions but position > 20, so they gain impression points while position
contributes partially: `/life` (40→66; 444 impr, pos 29.2),
`/medicare-formulary-lookup` (42→63; 309 impr, pos 31.6),
`/medicare-cost-estimator` (31→62; 178 impr, pos 26.5),
`/medicare-news/glp-1-drugs-medicare` (23→49; 178 impr, pos 51.3).

**Class A — no demand evidence (26 pages, the big fallers).** Zero impressions
after 3 months. Structurally they were carried by business/pillar weights
rescaled to 100; with data present those factors shrink to 40 of 100 points
and the 60 performance points contribute nothing. `/prescription-drug-assistance`
(66→33, r4→r99), `/medicare-financial-assistance` (56→29, r8→r106),
`/medicare-fort-duchesne-utah` and `/medicare-neola-utah` (52→27),
`/free-medicare-comparison-vernal`, `/hmo-vs-ppo-medicare-advantage`,
`/plan-g-vs-plan-n-vernal`, `/zero-premium-medicare-advantage` (51→27), etc.

**Class A′ — thin data, structural points diluted (20 pages, mild fallers).**
1–41 impressions: enough to escape "unproven", not enough to earn meaningful
performance points, while their structural points shrank with the reweighting.
`/dual-eligible` (56→39; 10 impr), `/medicare-costs` (56→47; 41 impr,
pos 52.9), `/turning-65` (56→49; 10 impr).

No move required an explanation outside these four mechanisms. **Every score
remains reproducible from stated factors.**

## 4. Convergence and divergence

**Converged (structure and performance agree):**

- `/medigap` — the structural queue's independent-audit pick is also the
  performance queue's #2: pillar + Impact-5 + 70 impressions at position 13.7
  on a 249-word page. Strongest single validation of the sprint plan.
- **External cross-check:** Google's own Search Console recommendations
  flagged `does-medicare-cover-dupixent` (impressions up sharply) and
  `medicare-formulary-lookup` (impressions down). The queue, computed
  independently from the CSV, placed them at r3 and r20. Two independent
  systems agree on where the movement is.

**Diverged (the structural queue's systematic blind spots):**

1. **The drug-coverage silo was underweighted.** `does-medicare-cover-*` and
   `*-assistance-program` pages sat mid-pack structurally (r26–r57, business
   impact 4, non-pillar) but hold 6 of the top 10 on real demand — national
   drug queries at striking distance. The structural queue could not have seen
   this: it had no demand signal. This is the designed failure mode, not a
   scoring error.
2. **Business-led local bets target tiny query volumes.** `/medicare-advantage-plans-vernal`
   and `/medicare-plans-vernal-utah` rank *well* (pos 4.8 / 5.5) — but on
   13 impressions each in 3 months. Local "vernal medicare" queries are
   real but rare. The pages aren't failing; the market is small. They stay
   Priority 2 (63 pts) rather than P1.
3. **Two pillars have zero impressions** (`/prescription-drug-assistance`,
   `/medicare-financial-assistance`), alongside the small-town pages. With 147
   URLs not indexed per Search Console, these are indexing/linking problems,
   not content problems — a separate, non-editorial work track.
4. `/life` (r14) is genuine demand on an off-mission cross-sell page — its
   Business Impact was deliberately lowered to 3 in the 07-29 audit, which is
   why 444 impressions still doesn't put it in the top 10. The weight is doing
   its job; noted so nobody "fixes" it.

## 5. Is the data volume sufficient?

Site totals for the window: **47 clicks / 7,425 impressions across 146 EN
pages** (50 clicks site-wide incl. ES). Per-factor confidence:

| Factor | Weight | Confidence | Basis |
|---|---:|---|---|
| Impressions | 30 | **High** for 57 pages ≥30 impr; directional for 28 pages at 10–29; noise below 10 (the engine's own floor) | Impression counts are Google-measured, not sampled |
| Position | 25 | **High** where impressions ≥30; **low** on thin pages — a pos 4.8 on 13 impressions is a handful of queries, not a rank | Impression-weighted average |
| CTR gap | 5 | **Low everywhere.** 1 page (homepage) has ≥10 clicks. A page with 100 impressions at pos ~10 *expects* ~2 clicks; observing 0 is within ordinary noise (P≈13%), so "CTR 0% vs expected" cannot yet distinguish a bad title from bad luck | 47 clicks total |

Implications, given CTR carries only 5 of 100 priority points: the **ranking**
is impressions+position driven and trustworthy, but many queue prescriptions
("title/meta rewrite — CTR below expected") are CTR-derived and should be
treated as **low-confidence suggestions** during Sprint 2B. Prefer actions
justified by position + impressions (content depth, internal links, striking
distance pushes) until a later export shows per-page click counts ≥10.

## 6. Verdict

**Model confirmed with low-confidence performance data.**

- The reordering is complete, large (9/10 top-10 turnover), and **fully
  explained** by the four mechanism classes above — every move traces to
  stated factors and raw Search Console numbers. No weight produced an
  ordering that evidence contradicts.
- No Phase 1 reopen trigger is met. The structural queue's misses are the
  *designed* consequence of having had no demand data, not a flaw in the
  weights that replaced it.
- **Weights remain frozen.** Continue collecting data. Re-audit the CTR-gap
  factor when ~10 pages have ≥10 clicks each (next export after meaningful
  click growth); until then CTR-derived prescriptions are advisory.
- The performance-aware queue is approved as the authoritative Sprint 2B work
  queue, with the CTR caveat above.

**Non-editorial follow-ups surfaced by this validation** (backlog, not 2B):
① indexing investigation for the 28 zero-impression EN pages incl. 2 pillars;
② 301-consolidate extensionless URL variants in `public/_redirects`;
③ decide whether `/life`-silo demand deserves any investment (currently
   correctly down-weighted).

---

## Appendix — all 122 moves > 10 points or > 10 ranks

Classes: **A** no demand evidence (0 impressions) · **A′** thin data,
structural points diluted · **B** demand at striking distance ·
**C** demand, far position.

| Page | Δpts | Δrank | Was → Now | Clicks | Impr | Pos | Class |
|---|---:|---:|---|---:|---:|---:|---|
| /faq.html | +36 | +90 | 21 r130 → 57 r40 | 0 | 60 | 4.1 | B — demand at striking distance |
| /medicare-irmaa-life-changing-events.html | +33 | +75 | 33 r90 → 66 r15 | 1 | 110 | 9.8 | B — demand at striking distance |
| /does-medicare-cover-dupixent.html | +33 | +54 | 43 r57 → 76 r3 | 1 | 288 | 9.5 | B — demand at striking distance |
| /medicare-out-of-state-utah.html | +32 | +94 | 21 r142 → 53 r48 | 0 | 61 | 11.3 | B — demand at striking distance |
| /medicare-cost-estimator.html | +31 | +74 | 31 r98 → 62 r24 | 0 | 178 | 26.5 | C — demand, far position |
| /medicare-savings-programs-utah.html | +29 | +79 | 31 r112 → 60 r33 | 0 | 54 | 8.4 | B — demand at striking distance |
| /medicare-coverage/ambulance.html | +28 | +80 | 30 r116 → 58 r36 | 0 | 180 | 35.5 | C — demand, far position |
| /does-medicare-cover-enbrel.html | +27 | +45 | 44 r51 → 71 r6 | 0 | 95 | 9.9 | B — demand at striking distance |
| /life.html | +26 | +70 | 40 r84 → 66 r14 | 0 | 444 | 29.2 | C — demand, far position |
| /medicare-news/glp-1-drugs-medicare.html | +26 | +69 | 23 r128 → 49 r59 | 0 | 178 | 51.3 | C — demand, far position |
| /medicare-medicaid-utah.html | +26 | +62 | 36 r87 → 62 r25 | 3 | 122 | 18.8 | B — demand at striking distance |
| / | +26 | +15 | 51 r16 → 77 r1 | 23 | 1040 | 7.2 | B — demand at striking distance |
| /does-medicare-cover-rinvoq.html | +25 | +45 | 44 r54 → 69 r9 | 0 | 115 | 12.0 | B — demand at striking distance |
| /aca.html | +24 | +55 | 36 r85 → 60 r30 | 2 | 412 | 25.6 | C — demand, far position |
| /does-medicare-cover-skyrizi.html | +24 | +44 | 44 r55 → 68 r11 | 0 | 102 | 10.3 | B — demand at striking distance |
| /medicare-help-vernal.html | +24 | +30 | 50 r34 → 74 r4 | 2 | 126 | 6.5 | B — demand at striking distance |
| /vernal.html | +23 | +63 | 41 r81 → 64 r18 | 1 | 66 | 4.2 | B — demand at striking distance |
| /medicare-news/medicare-advantage-changes-2026.html | +22 | +65 | 21 r140 → 43 r75 | 0 | 106 | 66.6 | C — demand, far position |
| /editorial-policy.html | +22 | +56 | 13 r146 → 35 r90 | 0 | 4 | 3.8 | B — demand at striking distance |
| /does-medicare-cover-trelegy.html | +22 | +21 | 50 r26 → 72 r5 | 1 | 154 | 13.4 | B — demand at striking distance |
| /medicare-formulary-lookup.html | +21 | +45 | 42 r65 → 63 r20 | 0 | 309 | 31.6 | C — demand, far position |
| /skyrizi-assistance-program.html | +21 | +30 | 50 r37 → 71 r7 | 0 | 111 | 14.3 | B — demand at striking distance |
| /medicare-vernal-ut.html | +21 | +30 | 48 r40 → 69 r10 | 0 | 67 | 6.7 | B — demand at striking distance |
| /medicare-open-enrollment-2026.html | +20 | +57 | 31 r109 → 51 r52 | 0 | 33 | 12.8 | B — demand at striking distance |
| /medicare-out-of-pocket-maximum-2026.html | +20 | +57 | 31 r110 → 51 r53 | 0 | 59 | 26.1 | C — demand, far position |
| /mounjaro-assistance-program.html | +20 | +50 | 41 r78 → 61 r28 | 0 | 63 | 10.0 | B — demand at striking distance |
| /does-medicare-cover-xarelto.html | +20 | +32 | 46 r45 → 66 r13 | 0 | 76 | 17.4 | B — demand at striking distance |
| /does-medicare-cover-eliquis.html | +20 | +29 | 46 r41 → 66 r12 | 0 | 83 | 17.0 | B — demand at striking distance |
| /enbrel-assistance-program.html | +20 | +20 | 50 r28 → 70 r8 | 3 | 164 | 13.8 | B — demand at striking distance |
| /medicare-glossary.html | +19 | +56 | 21 r137 → 40 r81 | 0 | 81 | 63.5 | C — demand, far position |
| /trulicity-assistance-program.html | +19 | +37 | 42 r66 → 61 r29 | 1 | 83 | 10.5 | B — demand at striking distance |
| /medicare-uintah-basin-medical-center.html | +17 | +58 | 21 r144 → 38 r86 | 0 | 6 | 8.8 | B — demand at striking distance |
| /medicare-news.html | +17 | +53 | 21 r138 → 38 r85 | 0 | 10 | 8.4 | B — demand at striking distance |
| /d-snp-plans-utah.html | +17 | +32 | 31 r93 → 48 r61 | 0 | 26 | 12.5 | B — demand at striking distance |
| /does-medicare-cover-ozempic-wegovy.html | +17 | +29 | 42 r63 → 59 r34 | 0 | 83 | 27.9 | C — demand, far position |
| /medicare-coverage/hospice.html | +16 | +49 | 30 r117 → 46 r68 | 0 | 102 | 75.6 | C — demand, far position |
| /medicare-vernal-pharmacies.html | +16 | +46 | 23 r129 → 39 r83 | 0 | 3 | 3.7 | B — demand at striking distance |
| /xarelto-assistance-program.html | +16 | +40 | 41 r82 → 57 r42 | 0 | 41 | 19.2 | B — demand at striking distance |
| /eliquis-assistance-program.html | +16 | +30 | 41 r69 → 57 r39 | 1 | 67 | 19.8 | B — demand at striking distance |
| /medicare-drug-coverage.html | +15 | +26 | 41 r70 → 56 r44 | 0 | 222 | 41.5 | C — demand, far position |
| /entresto-assistance-program.html | +15 | +13 | 50 r29 → 65 r16 | 0 | 64 | 10.8 | B — demand at striking distance |
| /does-medicare-cover-repatha.html | +14 | +12 | 46 r43 → 60 r31 | 0 | 31 | 9.2 | B — demand at striking distance |
| /medicare-home-health-utah.html | +13 | +42 | 28 r121 → 41 r79 | 0 | 7 | 6.3 | B — demand at striking distance |
| /part-d-plans-vernal.html | +13 | +22 | 41 r67 → 54 r45 | 0 | 22 | 7.9 | B — demand at striking distance |
| /does-medicare-cover-humira.html | +13 | +14 | 44 r52 → 57 r38 | 0 | 36 | 14.5 | B — demand at striking distance |
| /repatha-assistance-program.html | +13 | +13 | 50 r35 → 63 r22 | 1 | 83 | 15.5 | B — demand at striking distance |
| /medicare-quote-vernal.html | +13 | +5 | 51 r22 → 64 r17 | 0 | 37 | 6.0 | B — demand at striking distance |
| /medicare-help-center.html | +12 | +12 | 46 r49 → 58 r37 | 0 | 38 | 14.8 | B — demand at striking distance |
| /dupixent-assistance-program.html | +12 | +4 | 50 r27 → 62 r23 | 2 | 142 | 25.3 | C — demand, far position |
| /medicare-news/part-d-2000-cap.html | +11 | +40 | 21 r141 → 32 r101 | 0 | 39 | 76.0 | C — demand, far position |
| /tier-3-vs-tier-4-medicare-part-d.html | +11 | +30 | 41 r80 → 52 r50 | 0 | 25 | 17.6 | B — demand at striking distance |
| /medicare-enrollment-timeline.html | +11 | +25 | 31 r101 → 42 r76 | 0 | 8 | 8.4 | B — demand at striking distance |
| /medicare-extra-help-calculator.html | +11 | +25 | 31 r102 → 42 r77 | 0 | 3 | 5.0 | B — demand at striking distance |
| /medicare-drug-cost-calculator.html | +11 | +7 | 46 r48 → 57 r41 | 0 | 160 | 44.8 | C — demand, far position |
| /jardiance-assistance-program.html | +11 | +5 | 50 r32 → 61 r27 | 0 | 31 | 9.4 | B — demand at striking distance |
| /farxiga-assistance-program.html | +11 | +4 | 50 r30 → 61 r26 | 1 | 124 | 27.6 | C — demand, far position |
| /medicare-penalty-calculator.html | +10 | +14 | 32 r92 → 42 r78 | 0 | 61 | 55.5 | C — demand, far position |
| /medicare-cost-uintah-county.html | +9 | +19 | 31 r99 → 40 r80 | 0 | 12 | 12.8 | B — demand at striking distance |
| /medicare-part-d-cost-calculator.html | +9 | +18 | 41 r75 → 50 r57 | 1 | 33 | 11.0 | B — demand at striking distance |
| /insulin-cost-medicare-vernal.html | +9 | +13 | 42 r64 → 51 r51 | 0 | 15 | 6.5 | B — demand at striking distance |
| /medicare-eligibility-calculator.html | +8 | +13 | 36 r86 → 44 r73 | 0 | 25 | 28.2 | C — demand, far position |
| /medicare-news/extra-help-expanded.html | +7 | +30 | 28 r122 → 35 r92 | 0 | 38 | 66.4 | C — demand, far position |
| /does-medicare-cover-zepbound.html | +7 | -23 | 52 r12 → 59 r35 | 0 | 33 | 19.5 | B — demand at striking distance |
| /medicare-coverage/preventive-services.html | +5 | +20 | 21 r135 → 26 r115 | 0 | 12 | 36.8 | C — demand, far position |
| /reviews.html | +4 | +27 | 21 r145 → 25 r118 | 0 | 13 | 2.8 | B — demand at striking distance |
| /medicare-irmaa.html | +4 | -23 | 56 r9 → 60 r32 | 0 | 77 | 35.1 | C — demand, far position |
| /medicare-news/medicare-scam-calls.html | +2 | +20 | 28 r123 → 30 r103 | 0 | 25 | 41.3 | C — demand, far position |
| /medicare-coverage.html | +2 | -17 | 46 r46 → 48 r63 | 0 | 3 | 7.3 | B — demand at striking distance |
| /does-medicare-cover-trulicity.html | +2 | -18 | 46 r44 → 48 r62 | 0 | 27 | 26.3 | C — demand, far position |
| /medicare-advantage-vs-medigap-vernal.html | +2 | -27 | 51 r19 → 53 r46 | 0 | 13 | 3.8 | B — demand at striking distance |
| /medicare-agent-vernal.html | +2 | -27 | 51 r20 → 53 r47 | 1 | 21 | 4.5 | B — demand at striking distance |
| /rinvoq-assistance-program.html | +1 | -19 | 50 r36 → 51 r55 | 0 | 30 | 23.8 | C — demand, far position |
| /does-medicare-cover-farxiga.html | +1 | -19 | 48 r39 → 49 r58 | 0 | 3 | 8.3 | B — demand at striking distance |
| /medicare-myton-utah.html | +0 | -15 | 43 r59 → 43 r74 | 0 | 4 | 17.0 | B — demand at striking distance |
| /humira-assistance-program.html | +0 | -25 | 50 r31 → 50 r56 | 0 | 5 | 6.6 | B — demand at striking distance |
| /medicare-supplement-vs-advantage.html | +0 | -31 | 51 r23 → 51 r54 | 0 | 43 | 31.4 | C — demand, far position |
| /medicare-decision-center.html | -1 | -24 | 46 r47 → 45 r71 | 0 | 8 | 16.5 | A′ — thin data, structural points diluted |
| /delaying-medicare-part-b.html | -2 | -11 | 31 r94 → 29 r105 | 0 | 2 | 35.0 | A′ — thin data, structural points diluted |
| /medicare-enrollment-vernal.html | -4 | -36 | 50 r33 → 46 r69 | 0 | 8 | 10.4 | A′ — thin data, structural points diluted |
| /medicare-enrollment-periods.html | -4 | -42 | 56 r7 → 52 r49 | 0 | 1 | 6.0 | A′ — thin data, structural points diluted |
| /medicare-agent-credentials.html | -6 | -12 | 21 r131 → 15 r143 | 0 | 0 | — | A — no demand evidence |
| /medicare-ashley-regional-vernal.html | -6 | -12 | 21 r132 → 15 r144 | 0 | 0 | — | A — no demand evidence |
| /medicare-tabiona-utah.html | -6 | -29 | 43 r60 → 37 r89 | 0 | 3 | 26.0 | A′ — thin data, structural points diluted |
| /indemnity.html | -7 | -13 | 40 r83 → 33 r96 | 0 | 14 | 1.4 | A′ — thin data, structural points diluted |
| /turning-65.html | -7 | -50 | 56 r10 → 49 r60 | 0 | 10 | 15.3 | A′ — thin data, structural points diluted |
| /medicare-quiz.html | -8 | -22 | 41 r76 → 33 r98 | 0 | 7 | 37.9 | A′ — thin data, structural points diluted |
| /medicare-duchesne-utah.html | -8 | -26 | 41 r71 → 33 r97 | 0 | 2 | 33.0 | A′ — thin data, structural points diluted |
| /medicare-part-b-penalty-calculator.html | -9 | -15 | 31 r111 → 22 r126 | 0 | 10 | 72.2 | A′ — thin data, structural points diluted |
| /medicare-irmaa-calculator.html | -9 | -17 | 31 r108 → 22 r125 | 0 | 7 | 57.7 | A′ — thin data, structural points diluted |
| /medicare-coverage/acupuncture.html | -9 | -17 | 26 r124 → 17 r141 | 0 | 0 | — | A — no demand evidence |
| /medicare-coverage/chiropractic.html | -9 | -17 | 26 r125 → 17 r142 | 0 | 0 | — | A — no demand evidence |
| /medicare-costs.html | -9 | -59 | 56 r6 → 47 r65 | 0 | 41 | 52.9 | A′ — thin data, structural points diluted |
| /medicare-altamont-utah.html | -10 | -37 | 44 r56 → 34 r93 | 0 | 2 | 33.5 | A′ — thin data, structural points diluted |
| /working-past-65.html | -11 | -61 | 56 r11 → 45 r72 | 0 | 36 | 62.1 | A′ — thin data, structural points diluted |
| /when-to-enroll-medicare-utah.html | -12 | -23 | 31 r115 → 19 r138 | 0 | 0 | — | A — no demand evidence |
| /medicare-special-enrollment-period.html | -12 | -24 | 31 r113 → 19 r137 | 0 | 0 | — | A — no demand evidence |
| /medicare-general-enrollment-period.html | -12 | -31 | 31 r104 → 19 r135 | 0 | 0 | — | A — no demand evidence |
| /medicare-income-limits-2026.html | -12 | -31 | 31 r105 → 19 r136 | 0 | 0 | — | A — no demand evidence |
| /how-to-reduce-medicare-irmaa.html | -12 | -38 | 31 r95 → 19 r133 | 0 | 0 | — | A — no demand evidence |
| /medicare-and-employer-coverage.html | -12 | -38 | 31 r96 → 19 r134 | 0 | 0 | — | A — no demand evidence |
| /medicare-advantage-plans-vernal.html | -13 | -18 | 76 r1 → 63 r19 | 0 | 13 | 4.8 | A′ — thin data, structural points diluted |
| /medicare-plans-vernal-utah.html | -13 | -19 | 76 r2 → 63 r21 | 0 | 13 | 5.5 | A′ — thin data, structural points diluted |
| /medicare-plan-g-high-deductible.html | -14 | -67 | 51 r21 → 37 r88 | 0 | 9 | 30.7 | A′ — thin data, structural points diluted |
| /cobra-and-medicare.html | -15 | -43 | 35 r88 → 20 r131 | 0 | 0 | — | A — no demand evidence |
| /medicare-checklist-2026.html | -15 | -43 | 35 r89 → 20 r132 | 0 | 0 | — | A — no demand evidence |
| /about.html | -15 | -57 | 48 r38 → 33 r95 | 0 | 10 | 1.6 | A′ — thin data, structural points diluted |
| /medicare-ouray-utah.html | -15 | -72 | 52 r15 → 37 r87 | 0 | 1 | 33.0 | A′ — thin data, structural points diluted |
| /dual-eligible.html | -17 | -77 | 56 r5 → 39 r82 | 0 | 10 | 38.1 | A′ — thin data, structural points diluted |
| /medicare-jensen-utah.html | -18 | -49 | 41 r72 → 23 r121 | 0 | 0 | — | A — no demand evidence |
| /medicare-maeser-utah.html | -18 | -49 | 41 r73 → 23 r122 | 0 | 0 | — | A — no demand evidence |
| /medicare-naples-utah.html | -18 | -49 | 41 r74 → 23 r123 | 0 | 0 | — | A — no demand evidence |
| /medicare-ballard-utah.html | -20 | -62 | 43 r58 → 23 r120 | 0 | 0 | — | A — no demand evidence |
| /does-medicare-cover-jardiance.html | -20 | -66 | 44 r53 → 24 r119 | 0 | 0 | — | A — no demand evidence |
| /medicare-hospitals-uintah-county.html | -21 | -67 | 46 r50 → 25 r117 | 0 | 0 | — | A — no demand evidence |
| /plan-g-vs-plan-n-vernal.html | -24 | -89 | 51 r24 → 27 r113 | 0 | 0 | — | A — no demand evidence |
| /zero-premium-medicare-advantage.html | -24 | -89 | 51 r25 → 27 r114 | 0 | 0 | — | A — no demand evidence |
| /free-medicare-comparison-vernal.html | -24 | -92 | 51 r17 → 27 r109 | 0 | 0 | — | A — no demand evidence |
| /hmo-vs-ppo-medicare-advantage.html | -24 | -92 | 51 r18 → 27 r110 | 0 | 0 | — | A — no demand evidence |
| /medicare-fort-duchesne-utah.html | -25 | -98 | 52 r13 → 27 r111 | 0 | 0 | — | A — no demand evidence |
| /medicare-neola-utah.html | -25 | -98 | 52 r14 → 27 r112 | 0 | 0 | — | A — no demand evidence |
| /medicare-financial-assistance.html | -27 | -98 | 56 r8 → 29 r106 | 0 | 0 | — | A — no demand evidence |
| /prescription-drug-assistance.html | -33 | -95 | 66 r4 → 33 r99 | 0 | 0 | — | A — no demand evidence |
