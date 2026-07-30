# The SEO Operating System

Everything in `docs/seo/` is **generated**. Nothing in it is maintained by hand.

That is the whole design rule. Four canonical sources feed one engine, the engine
writes every report, and the reports are disposable — delete them and
`npm run seo` rebuilds them exactly. There is no spreadsheet to keep in sync and
no inventory to update when a page is added, because the inventory *is*
`pageIndex.ts`.

```
src/data/pageIndex.ts ──┐
data/search-console/*.csv ├──► merge ──► score ──► docs/seo/*.md
dist/**/*.html          ─┤                        docs/seo/seo-snapshot.json
git log                 ─┘
```

## The four sources

| Layer | Source | Canonical for | Never duplicated in |
|---|---|---|---|
| 1 | `src/data/pageIndex.ts` | which pages exist, title, silo, tags, pillar | any Markdown file |
| 2 | `data/search-console/*.csv` | impressions, clicks, CTR, position | any tracker |
| 3 | `dist/**/*.html` | words, schema, FAQ, summary, tables, link graph | any checklist |
| 3 | `git log` | content freshness | any "last reviewed" column |

Layer 3 reads the **built** site rather than the source, which means dynamic
routes are covered automatically: the 40-odd town, drug and coverage pages
generated from `src/data/*.ts` are analysed like any other page, and a new town
appears in the reports the moment it builds.

## Running it

```bash
npm run seo         # score the current dist/ and regenerate every report
npm run seo:build   # astro build first, then the same
npm run seo:gate    # enforce the editorial publish standard (exit 1 on failure)
```

`npm run seo` warns if `dist/` is older than `src/` — the page intelligence
describes the last build, not your working tree.

## What gets generated

| File | Answers |
|---|---|
| `docs/seo/DASHBOARD.md` | how is the site doing, in one screen |
| `docs/seo/SEO-QUEUE.md` | what to work on next, and what to do to each page |
| `docs/seo/OPPORTUNITY.md` | where effort converts fastest |
| `docs/seo/AI-READINESS.md` | which pages AI answers can actually extract |
| `docs/seo/INTERNAL-LINKS.md` | orphans, weak pages, hubs, depth, broken links |
| `docs/seo/REFRESH-QUEUE.md` | what is going stale, weighted by traffic |
| `docs/seo/WEEKLY-TASKS.md` | ten concrete tasks for this week |
| `docs/seo/TOPIC-COVERAGE.md` | which whole **cluster** is weak, not which page |
| `docs/seo/DELTA.md` | what **moved** since the last snapshot |
| `docs/seo/EDITORIAL-COMPLETENESS.md` | does each page contain what our standard requires |
| `docs/seo/seo-snapshot.json` | every field for every page, machine-readable |
| `docs/seo/history/*.json` | one compact snapshot per run day — the delta baseline |

Every report opens with **PERFORMANCE MODE: ON/OFF**, so whether Search Console
data is loaded is never something the reader has to infer.

**Locale rule (design decision, not a bug):** editorial queues are generated for
the primary publishing language (English). Other locales are scored — their rows
appear in `seo-snapshot.json` with full factors, and integrity checks cover them
— but they are excluded from editorial prioritization unless explicitly
requested. A Spanish page can therefore carry the highest raw score on the site
(few inbound links inflate `linkWeakness`) without ever appearing in
`SEO-QUEUE.md`; the snapshot and the queues intentionally disagree in that case.

## Priority — what to work on

A 0-100 score. Weights live in `scripts/seo/config.mjs`:

| Factor | Weight | Derived from |
|---|---:|---|
| Impressions | 30 | Search Console, log-scaled between a 10-impression noise floor and the 95th percentile |
| Position | 25 | Search Console — peaks in positions 4-10, where an edit still moves revenue |
| Business Impact | 20 | `config.mjs` (the one judgment input) |
| Pillar page | 10 | `pageIndex.ts` `taxonomy.pillar` |
| Internal link weakness | 5 | link graph vs the site median |
| Content freshness | 5 | `git log` |
| CTR opportunity | 5 | actual CTR vs expected CTR for that position |

**Before any CSV exists**, the three performance factors are dropped and the
remaining four are rescaled to 100. Without that, 60 points would be dead, no
page could clear the tier-1 line, and the queue would be empty and useless. The
generated reports say plainly when they are running in this mode.

Tiers: **Priority 1** ≥ 68 · **Priority 2** 48-67 · **Priority 3** below.

## Business Impact (1-5)

A page's commercial role, on one strategic scale, set in `config.mjs` per silo
with per-URL overrides. Scored as `impact / 5`.

| Level | Meaning |
|---:|---|
| 5 | **Direct revenue** — a policy can be sold off this page |
| 4 | **Indirect revenue** — drives a qualified visitor toward a quote |
| 3 | **Lead nurturing** — tools and decision support that build intent |
| 2 | **Authority** — topical depth that earns trust and rankings |
| 1 | **Supporting** — required, but not a commercial or ranking asset |

Level 1 still carries 20% weight rather than zero, so a Supporting page can
surface when something is genuinely broken on it — it just never outranks real
content. This is also how utility pages (editorial policy, privacy, terms) are
kept out of the top of the queue without distorting the link graph.

## Topic Coverage — which cluster is weak

`AI-READINESS.md` answers *which page* is weak. `TOPIC-COVERAGE.md` answers
*which topic* is weak, which is the level content work is actually planned at —
you rewrite a cluster, not a page.

Each dimension is the **mean** feature score across the silo, so a cluster where
every page lacks tables reads near 0% instead of hiding behind one strong page.
`Authority` is the one dimension not drawn from AI readiness: mean inbound
editorial links per page relative to the site median, capped at 100%.

The report ends with a **weakest-dimension-per-cluster** table naming the
highest-priority pages dragging each cluster down — that list is the work order.

## Editorial Completeness — does the page meet OUR standard

The three quality reports answer different questions and are not redundant:

| Report | Question | Basis |
|---|---|---|
| AI Readiness | can a machine extract this page? | fixed, universal feature weights |
| Topic Coverage | which cluster is weak? | means across a silo |
| **Editorial Completeness** | does this page contain what a page of its kind owes a reader? | a per-cluster editorial spec |

A page can score well on AI Readiness and still be incomplete: a Part D page
that compares nothing has failed at its job regardless of how extractable it is.
That is an editorial claim, so it lives in one reviewable file —
`scripts/seo/standards.mjs`, the **second and last** hand-maintained input.

Every element in the standard is detected from built HTML. Nothing aspirational
is allowed in: if it cannot be measured, it does not belong in the standard.
The human-readable spec — why each element exists, acceptance criteria, good
examples, common mistakes — is [EDITORIAL-STANDARD.md](EDITORIAL-STANDARD.md);
keep it and `standards.mjs` in sync when either changes.
`Comparison table` deliberately means 2+ columns and 3+ rows — a single-column
list styled as a table is not what an editor means and not what an AI extracts.

The report leads with **Build these components first**: across the top 20 pages
by opportunity (or by priority when Performance Mode is OFF), how often each
required element is missing. That ranking is the template work-order — build the
component once and every page below it is fixed at the same time. **Systemic
gaps** then lists element × cluster combinations missing from ≥75% of a cluster,
which are template problems by definition, never page problems.

### The publish gate

`EDITORIAL-COMPLETENESS.md` reports the standard; `npm run seo:gate` **enforces**
it. Two rules, checked against the last `seo-snapshot.json`:

1. **New content ships at ≥ 90% completeness or not at all.** A page with no
   recorded floor is new by definition, and a failing new page is never added
   to the baseline — it fails again next run rather than being quietly
   grandfathered.
2. **No page ever scores below its recorded floor.** Floors rise automatically
   whenever a page improves, so quality ratchets up and cannot silently slide
   back. An intentional drop is accepted explicitly with
   `npm run seo:gate -- --accept`.

The first run grandfathers every existing page at its current score: the
historical debt stays visible in the report, but only *new* debt fails the
command. Floors live in `data/editorial-baseline.json` — machine-written,
committed to git, so its history is the record of the standard rising. The
threshold lives in `config.mjs` (`GATE`), and the gate is a consumer of the
snapshot, not a second scorer: the numbers it enforces are exactly the numbers
the reports show. `tests/editorial-gate.test.ts` guards both rules.

## Delta — did the work actually land

Current position tells you where you stand; only movement tells you whether the
last round of edits worked.

Each run writes a compact snapshot to `docs/seo/history/YYYY-MM-DD.json` and
diffs against the most recent **earlier** file, so re-running on the same day
never diffs against itself. `DELTA.md` reports position gains and losses,
impression and click movement, pages newly earning impressions, pages that
dropped out of Search Console entirely, and AI-readiness movement.

Position deltas are sign-corrected: a page going from position 17 to 11 reads
`▲ +6`, because a falling number is an improvement.

Commit the history files. A year of weekly snapshots is a few hundred KB and it
is the only record of whether the strategy is working.

## Opportunity — where effort converts fastest

Priority asks *what matters*. Opportunity asks *what moves this month*. They are
deliberately different numbers, and the gap between them is the useful signal.

| Factor | Weight |
|---|---:|
| Impressions | 40 |
| Striking-distance proximity (peaks at positions 5-15) | 30 |
| CTR gap vs expected for the position | 20 |
| Click headroom | 10 |

Opportunity favours pages Google already indexes, already ranks and already
trusts, because those are the fastest wins. Worked example:

- Position 9 · 8,000 impressions · 0.8% CTR → **opportunity 83**. It already
  ranks; the CTR says the title is losing the click. A rewrite pays this week.
- Position 61 · 34 impressions → **opportunity 34**. Nothing to build on.
- Position 2.1 · CTR above expected → **opportunity 37**. Already winning; effort
  is better spent elsewhere.

A page with **zero impressions is capped at 25**. It is a bet, not an
opportunity — and usually an indexing or internal-linking problem rather than a
content one, which is why `OPPORTUNITY.md` lists those separately with their
inbound-link counts.

## AI Readiness — how extractable a page is

Scored from the built HTML, so it reflects what a crawler actually receives.

| Feature | Weight | Detected by |
|---|---:|---|
| AI Summary | 20 | `<SummaryBlock>` → `.summary-block` |
| FAQ | 20 | FAQ component markup **and** `FAQPage` schema |
| Schema | 15 | share of Article/WebPage, BreadcrumbList, Organization, Person |
| Tables | 10 | `<table>` in content |
| Definitions | 10 | `<dl>`, `<dfn>`, glossary terms |
| Internal links | 15 | in-content outbound links, full marks at 8 |
| Original insights | 10 | **proxy** — byline + cited sources + length at or above the site median |

`Original insights` has no machine-readable marker. It scores three observable
proxies and is labelled as a hint in the report, not a verdict. Everything else
is measured directly.

## The internal link graph

Only **editorial** links count. Excluded, in order:

1. The `<header>` and `<footer>` regions.
2. Breadcrumb navigation — on every page, always pointing at the same hubs.
3. Byline, disclaimer and sources components — emitted by a template, not chosen
   by an editor.
4. Any target still appearing in the content of ≥90% of pages. Listed in
   `seo-snapshot.json` under `integrity`, so the exclusion is auditable.

Counting nav links would make every page look well-supported and hide the real
orphans. The Related block **is** counted: it is generated from `pageIndex.ts`
taxonomy, which is precisely the editorial signal this system measures.

Site links are relative (`medicare-irmaa.html`, not `/medicare-irmaa.html`), so
hrefs are resolved against each page's own URL before the graph is built.

## Freshness

`git log` is read once, and every file's newest commit is recorded. Static routes
map to their `.astro` file. Generated routes map to the `[param]` template **plus
the `src/data` module that feeds it** — so adding a town or a drug correctly
refreshes every page that data produces.

## The registry invariant

> **If a page exists, it exists in `pageIndex.ts`.**

This is the assumption the entire engine rests on. A page missing from the
registry is invisible to the Related engine, to every report and to the queue —
and it fails silently, which is the worst kind of bug. `tests/page-registry.test.ts`
enforces it against source (no build required) and fails with the exact list of
unregistered pages. Non-content routes (404, search, privacy, terms) are exempt
by an explicit list, each with a reason, so an exemption is a reviewed decision
rather than a shortcut.

## Integrity checks

Run on every pass and reported in `INTERNAL-LINKS.md` and `seo-snapshot.json`:

- Built but **not in** `pageIndex.ts` — invisible to the Related engine.
- In `pageIndex.ts` but **not built** — a dead registry entry.
- **Broken in-content links** — links to pages that do not exist.
- **Search Console URLs with no page** — possible 404s or removed pages still
  earning impressions.

## The two files you may edit

`scripts/seo/config.mjs` — Business Impact, weights and thresholds: what a page
is *worth*.

`scripts/seo/standards.mjs` — the editorial standard: what a page of a given
kind must *contain*.

Both encode judgment no source can infer. Change a number in either and every
report reflects it on the next run.

Everything else is derived. If a report says something wrong, fix the source or
the weights — never the Markdown, because the next run overwrites it.

## Code map

| File | Role |
|---|---|
| `scripts/seo/run.mjs` | orchestrator and CLI |
| `scripts/seo/config.mjs` | weights, business value, thresholds |
| `scripts/seo/sources.mjs` | layers 1-3: registry, CSVs, HTML, git |
| `scripts/seo/parse.mjs` | pure helpers: URL normalization, CSV |
| `scripts/seo/score.mjs` | layer 4: priority, opportunity, AI readiness |
| `scripts/seo/reports.mjs` | Markdown generation |
| `scripts/seo/trends.mjs` | Topic Coverage + Delta reports |
| `scripts/seo/editorial.mjs` | Editorial Completeness report |
| `scripts/seo/gate.mjs` | the publish gate: new pages ≥ 90%, no page below its floor |
| `scripts/seo/standards.mjs` | the editorial standard (hand-maintained) |
| `scripts/seo/md.mjs` | shared Markdown helpers + report header |
| `scripts/seo/ts-loader.mjs` | lets Node import the site's `.ts` data files |
| `tests/seo.test.ts` | contract tests for parsing and scoring |
| `tests/i18n-links.test.ts` | guard: localized pages emit no locale-relative links |
| `tests/page-registry.test.ts` | guard: **the registry invariant** (see below) |
| `tests/editorial-standards.test.ts` | contract tests for the editorial standard |
| `tests/editorial-gate.test.ts` | contract tests for the publish gate |

## Related docs

`docs/CONTENT-INVENTORY.md` is a **maintenance** map — which page belongs to
which product and when it was last reviewed for factual accuracy. It answers a
different question and is maintained by hand on purpose. This system does not
replace it and does not read it.
