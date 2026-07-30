# Roadmap

Phase 1 — **Infrastructure** — is complete and **frozen** (2026-07-29). The
engine, the reports, the gate and the editorial standard exist. No further
infrastructure code until at least one full optimization cycle has run
end-to-end — the only thing that reopens infrastructure work is real Search
Console performance data contradicting the scoring model.

We are now in Phase 2 — **Authority Development**.

## Phase 2 — Authority Development

### Sprint 2A — Part D Template Upgrade

Build the six standard patterns once, apply them consistently across the Part D
cluster:

1. Standard definition pattern
2. Standard comparison table
3. Standard AI summary
4. Standard source section
5. Standard internal-link pattern
6. Standard CTA pattern

**Success criteria.** Sprint 2A is not successful because 40 pages were
edited. It is successful if, after Google's recrawl:

1. Editorial Completeness increases substantially (goal: 68% → 85%).
2. The Part D cluster shows measurable gains in rankings, impressions, or CTR
   against its pre-sprint baseline.
3. The Optimization Hypotheses in `docs/seo/WORK-LOG.md` are supported often
   enough to justify confidence in the patterns.
4. The reusable patterns demonstrably reduce the manual editing needed for
   future pages.

If those outcomes don't materialize, we revisit the patterns — we do not
assume they are correct.

### Sprint 2B — Highest Opportunity Pages

Driven entirely by Search Console. No guessing — the queue
(`docs/seo/SEO-QUEUE.md` / `OPPORTUNITY.md`) determines the work.

### Sprint 2C — Cluster Completion

Finish the highest-opportunity cluster before beginning another. Half-finished
clusters are half-finished authority.

## Phase 3 — Authority Expansion

Only after existing content reaches the editorial standard. New content is
created to fill genuine topical gaps identified by Search Console and
`TOPIC-COVERAGE.md` — never speculatively.

## Project rule: every content change names its metric

Every content change must declare its expected outcome in the project work log
(`docs/seo/WORK-LOG.md`) — or in the commit message where practical — and that
outcome must be one of the project's tracked metrics:

- Increase CTR
- Improve average position
- Increase topical completeness
- Strengthen internal linking
- Improve AI extractability
- Increase conversions

If a change can't be tied to one of these outcomes, it probably isn't a
priority.

## Project rule: the Optimization Hypothesis

Before any page is edited, write exactly one sentence in the work log:

> **We expect this change to improve X because Y.**

Examples:

- We expect adding a standardized comparison table to improve rankings because
  it answers the primary comparison intent and makes the content easier to
  extract.
- We expect adding authoritative sources to improve trust signals because more
  than half of our top-opportunity pages currently lack citations.
- We expect improving the AI Summary to increase CTR because users and AI
  systems receive the answer immediately.

After Google's recrawl, the Delta report says whether the hypothesis was
supported. Over time this builds evidence about which optimization patterns
actually move rankings and which merely look good. This rule exists to keep us
from chasing vanity metrics.

## Project rule: the Scientific Rule

**No optimization pattern becomes a standard until it has succeeded on
multiple pages.**

Every pattern lives in one of three categories:

| Category | Meaning | Evidence required |
|---|---|---|
| **Experimental** | An idea being tried | None — it's a hypothesis |
| **Proven** | Worked repeatedly | Supported outcomes across multiple pages and optimization cycles in `WORK-LOG.md` / `DELTA.md` |
| **Standard** | Mandatory for future content | Documented in `EDITORIAL-STANDARD.md` and enforced by the gate |

Graduation is one-directional and evidence-gated: a pattern is applied, Google
recrawls, and Delta / Search Console (rankings, impressions, CTR, leads) say
whether the hypothesis held. Only consistent success across several pages
promotes Experimental → Proven, and only a deliberate edit to the editorial
standard (see "Changing the standard" in `EDITORIAL-STANDARD.md`) promotes
Proven → Standard.

Not every good idea deserves to become a permanent editorial requirement.
This rule is what prevents cargo-cult SEO: the existing elements of the
standard were grandfathered in as the baseline; everything added from now on
earns its place with data. The **Pattern Ledger** in `docs/seo/WORK-LOG.md`
records each pattern's current category.

## The gate before Sprint 2A begins

Once the Search Console CSV is imported and Performance Mode turns ON, the
first review is not "what should we optimize?" — it is **"why did the engine
choose these pages?"** The first review answers four questions:

1. **Did the engine choose the pages we would have chosen?** If yes, the
   scoring model is validated. If not, adjust the weights before touching
   content.
2. **What is the dominant pattern among the top 20?** (e.g. 12 missing
   comparison tables, 10 missing definitions, 9 missing sources.) Those
   become Sprint 2A priorities.
3. **Are there false positives?** (e.g. high impressions but intentionally low
   business impact.) These refine the model.
4. **Does business judgment agree?** The engine informs prioritization; it
   does not replace editorial judgment. A strategically important page can be
   deliberately elevated — but document why.

Only then does Sprint 2A begin. Agreeing with the queue validates the entire
operating system, not just the priorities.

## The first full cycle

1. Import the Search Console Pages export (`data/search-console/*.csv`).
2. Generate the first performance-driven queue (`npm run seo`).
3. Complete the Part D Template Upgrade (Sprint 2A).
4. Re-run the engine.
5. Wait for Google's recrawl.
6. Review `DELTA.md`, rankings, CTR, impressions and leads.
7. Decide whether the scoring model needs adjustment based on observed
   outcomes — this is the only circumstance that reopens infrastructure work.

The repeating loop:

```
Search Console → Opportunity Queue → Hypothesis → Editorial Pattern
    → Deploy → Google Recrawl → Delta → Did the hypothesis hold?
```

## The scorecard

From the Search Console import onward, every sprint should produce measurable
changes in: rankings, impressions, CTR, editorial completeness, AI readiness,
and qualified Medicare leads. Those are the project's scorecard.
