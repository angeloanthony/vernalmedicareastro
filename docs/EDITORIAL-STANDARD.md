# Editorial Standard

This is the human-readable version of the editorial standard that
[`scripts/seo/standards.mjs`](../scripts/seo/standards.mjs) detects and
[`scripts/seo/gate.mjs`](../scripts/seo/gate.mjs) enforces. The code answers
"did this element ship?"; this document answers "why does it exist and what
does a good one look like?"

It is written for every future contributor — human or AI — who adds or edits a
page. If this document and `standards.mjs` ever disagree, the code is what the
gate enforces: fix the disagreement in the same change, in whichever direction
is editorially right.

## How the standard is enforced

Every element below is detected from the **built HTML** (`dist/`), not from
source. If it can't be measured, it isn't in the standard.

- Each page is scored against its cluster's required elements:
  `completeness = present / required`, 0–100.
- `npm run seo:build` produces the snapshot; `docs/seo/EDITORIAL-COMPLETENESS.md`
  reports every page's score and names every missing element.
- `npm run seo:gate` enforces two rules:
  1. **New pages** may not ship below **90%** completeness.
  2. **Existing pages** may never score below their recorded floor in
     `data/editorial-baseline.json`. Floors rise automatically when a page
     improves, so quality ratchets up and cannot silently slide back.
- An intentional drop requires an explicit acceptance step:
  `npm run seo:gate -- --accept`.

The baseline file is machine-written and committed — its git history is the
record of the standard rising. Never edit it by hand.

## What each cluster requires

**Baseline** — required of every content page:
AI Summary · FAQ · Author byline · Sources · CTA · Related articles ·
Breadcrumbs · Schema · Internal links (8+).

Clusters add to the baseline based on what that *kind* of page owes a reader:

| Cluster | Adds to baseline | Why |
|---|---|---|
| `part-d` | Comparison table, Definitions | A drug/plan page that compares nothing has failed at its job |
| `costs-irmaa` | Comparison table, Definitions | Cost pages are tables-and-terms pages by nature |
| `medicare-advantage` | Comparison table | Plan-choice pages must let readers compare options |
| `medigap` | Comparison table | Same — Plan G vs Plan N is the whole question |
| `other-insurance` | Comparison table | ACA / life / indemnity pages compare products |
| `medicare-101` | Definitions | Foundational pages must define the terms they introduce |
| `dual-eligible` | Definitions, Next steps | Complex eligibility needs terms defined and a clear "do this next" |
| `enrollment` | Next steps | Enrollment pages exist to tell the reader what to do and when |
| `local`, `providers`, `tools` | — (baseline only) | |
| `trust` | **Replaces** baseline with: Summary, Byline, Breadcrumbs, Schema, CTA | Trust pages exist for readers and E-E-A-T, not topical authority; the full standard would generate permanent false failures |

---

## The elements

Each entry lists the component that satisfies it and the signal the detector
looks for in the built HTML. Use the component — hand-rolled markup that
happens to match the signal is fragile and defeats the point of having
patterns.

### AI Summary

**Component:** [`<SummaryBlock>`](../src/components/SummaryBlock.astro) — detected by `.summary-block` in the content region.

**Purpose:** Answer the reader's question in the first screenful, in language
an AI Overview or featured snippet can quote verbatim. This is the single
highest-leverage block on the page for extractability.

**Required:** All pages, including trust pages.

**Acceptance:** 2–4 sentences near the top of the page, before the first major
section. States the direct answer, not a preview of the article ("Medicare
Part B costs $185/month in 2026 for most people" — not "In this guide we'll
cover Part B costs"). Accurate as of the page's last review date.

**Good example:** "IRMAA is a surcharge added to your Medicare Part B and
Part D premiums if your income from two years ago exceeded $106,000 (single)
or $212,000 (married filing jointly). In 2026, it adds between $74 and $443.90
per month to Part B."

**Common mistakes:** Writing a teaser instead of an answer; burying the
number or verdict in the third sentence; letting the summary drift out of date
while the body gets updated.

### Definitions

**Component:** `<dl>`/`<dfn>` markup or a glossary term (`.gl-term`) — at least one in the content region.

**Purpose:** Define the entities the page is about, in a form both readers and
retrieval systems can extract. Google and AI systems reward pages that
authoritatively define the terms they use.

**Required:** `part-d`, `costs-irmaa`, `medicare-101`, `dual-eligible`.

**Acceptance:** The page's primary term is defined concisely and accurately,
before or at its first substantive use — not three sections in. Definitions
are self-contained: readable without the surrounding paragraph.

**Good example:** A `<dl>` entry: "**Formulary** — the list of prescription
drugs a Part D plan covers, organized into cost tiers. Every plan has its own
formulary, and a drug's tier determines your copay."

**Common mistakes:** Defining a term using the term itself; definitions that
only make sense mid-paragraph; defining five minor terms while leaving the
page's primary topic undefined.

### Comparison table

**Component:** any real `<table>` with **2+ columns and 3+ rows** in the content region.

**Purpose:** Let readers compare options at a glance, and give extractors the
most machine-readable structure on the page. Tables are disproportionately
pulled into AI answers and featured snippets.

**Required:** `part-d`, `costs-irmaa`, `medicare-advantage`, `medigap`, `other-insurance`.

**Acceptance:** At least two columns and three meaningful rows comparing real
alternatives (plans, costs, scenarios, years). A header row that names what is
being compared. No decorative or layout tables — every row must inform a
decision.

**Good example:** Plan G vs Plan N: rows for monthly premium, Part B
deductible, excess charges, copays; a column per plan.

**Common mistakes:** A table used for page layout; a two-row "table" that is
really a styled callout; comparing things no reader actually chooses between;
omitting the header row so extractors can't label the columns.

### FAQ

**Component:** [`<FAQ>`](../src/components/FAQ.astro) — detected by **both** visible markup (`aria-label="Frequently Asked Questions"` with `<details>/<summary>`, or `.cst-faq`) **and** `FAQPage` schema. The component welds them; both must be present.

**Purpose:** Capture the long-tail question phrasings readers actually search,
and mark them up so search engines can surface them directly.

**Required:** All content pages (not trust pages).

**Acceptance:** 3+ questions phrased the way a real person asks them
("Do I have to take Part B at 65 if I'm still working?"), each with a
complete, self-contained answer. Questions cover ground the body doesn't
already answer verbatim. Schema matches the visible Q&A exactly.

**Common mistakes:** Restating H2s as questions; answers that just say "see
above"; visible FAQ without schema or schema without visible FAQ (the detector
fails either half-measure); keyword-stuffed questions nobody would type.

### Sources

**Component:** [`<SourcesList>`](../src/components/content/SourcesList.astro) — detected by a `sources` class in the content region.

**Purpose:** Support factual claims and build trust. Medicare content is
YMYL — Google holds it to the highest E-E-A-T bar, and cited primary sources
are the clearest trust signal we control.

**Required:** All content pages (not trust pages).

**Acceptance:** Authoritative sources (medicare.gov, ssa.gov, CMS, KFF)
relevant to this page's specific claims — the source for a 2026 premium figure
is the 2026 CMS announcement, not the medicare.gov homepage.

**Common mistakes:** The same generic three links pasted on every page;
citing a source the page never actually draws on; linking an outdated year's
document under a current year's figure.

### Author byline

**Component:** [`<AuthorByline>`](../src/components/content/AuthorByline.astro) — detected by a `byline` class in the content region.

**Purpose:** A named, credentialed human stands behind the content. E-E-A-T
for YMYL topics starts with "who wrote this and why should I trust them."

**Required:** All pages, including trust pages.

**Acceptance:** Names the author with their licensing credential, near the top
of the content. Consistent identity across the site.

**Common mistakes:** A byline with no credential; omitting it from pages that
"feel like utility pages" but are still indexed content.

### Next steps

**Component:** [`<NextSteps>`](../src/components/content/NextSteps.astro) — detected by a `next-steps` class in the content region.

**Purpose:** Convert understanding into action. Enrollment and eligibility
pages fail their reader if they explain the rules but leave "so what do I do
now?" unanswered.

**Required:** `enrollment`, `dual-eligible`.

**Acceptance:** A short, ordered list of concrete actions specific to this
page's scenario — with deadlines and documents where they apply. Not generic
("contact us to learn more") but situational ("If your Initial Enrollment
Period ends within 3 months, gather your employer coverage letter first").

**Common mistakes:** Steps that are really just a CTA in list form; generic
steps copy-pasted across pages; steps that don't follow from the page's actual
content.

### Related articles

**Component:** [`<RelatedPages>`](../src/components/content/RelatedPages.astro) — detected by a `related` class in the content region.

**Purpose:** Keep readers in the topic cluster and distribute link equity to
sibling pages. This is how a cluster ranks as a body of work rather than as
isolated pages.

**Required:** All content pages (not trust pages).

**Acceptance:** 3–6 genuinely related pages, mostly within the same cluster,
each with a descriptive title. The selection reflects what a reader of *this*
page would plausibly need next.

**Common mistakes:** The same list on every page in the cluster; linking by
recency instead of relevance; pointing at hub pages only and never at
siblings.

### CTA

**Component:** [`<PageCTA>`](../src/components/content/PageCTA.astro) — detected by a `page-cta` class in the content region.

**Purpose:** Every page has a business job. The CTA is where topical authority
becomes a qualified Medicare lead.

**Required:** All pages, including trust pages.

**Acceptance:** One clear primary action matched to the page's intent stage —
a quote request on commercial pages, a consultation or comparison on
educational pages. Present without being interruptive.

**Common mistakes:** No CTA because a page "is just educational" (that's what
`Business Impact 2` pages are for — they still get a CTA); three competing
CTAs; a hard-sell CTA on a page serving early-stage research intent.

### Breadcrumbs

**Component:** [`<Breadcrumbs>`](../src/components/Breadcrumbs.astro) — detected by a `breadcrumbs` class (raw region; breadcrumbs don't count as editorial links).

**Purpose:** Communicate site hierarchy to readers and to Google — breadcrumb
trails appear in search results and anchor the page inside its cluster.

**Required:** All pages, including trust pages.

**Acceptance:** Reflects the page's real position in the cluster hierarchy
(Home › Part D › This page) and matches the `BreadcrumbList` schema.

**Common mistakes:** A flat Home › Page trail on a page that belongs to a
cluster; visible trail and schema disagreeing.

### Schema

**Requirement:** `BreadcrumbList` + `Organization` + (`Article` or `WebPage`), from the page's JSON-LD.

**Purpose:** Machine-readable identity: what this page is, who published it,
where it sits. This is the substrate every rich result and AI citation builds
on.

**Required:** All pages, including trust pages.

**Acceptance:** All three types present and internally consistent — the
`Article` headline matches the H1, the `BreadcrumbList` matches the visible
trail, `Organization` is the site publisher. FAQ pages additionally carry
`FAQPage` (welded into the FAQ element above).

**Common mistakes:** Schema describing content that isn't on the page;
duplicate conflicting blocks from layout and page both emitting the same type.

### Internal links

**Requirement:** **8+ in-content links** to other pages on the site. Header/footer/breadcrumb links don't count, and neither does any link that appears on ≥90% of pages (that's site furniture, not an editorial choice).

**Purpose:** Editorial links are how authority flows through the cluster and
how crawlers and retrievers understand what's related to what. A page that
links out to nothing is a dead end for both readers and rankings.

**Required:** All content pages (not trust pages).

**Acceptance:** 8+ contextual links woven into the prose where the reader
would naturally want them, with descriptive anchor text ("Part D late
enrollment penalty", not "click here"). Mostly within-cluster, plus the
relevant hub.

**Common mistakes:** Dumping eight links in a paragraph at the bottom to pass
the number; anchor text that doesn't describe the target; linking the same
target five times (each unique target counts once toward the graph).

---

## Changing the standard

The standard should change rarely and deliberately.

**Prerequisite — the Scientific Rule** (`docs/ROADMAP.md`): nothing enters
this document as a requirement until it is **Proven** — supported outcomes on
multiple pages across optimization cycles, recorded in the Pattern Ledger in
`docs/seo/WORK-LOG.md`. An idea that has worked once is Experimental, not a
standard. Not every good idea deserves to become a permanent editorial
requirement.

Once a pattern is Proven and the decision is made to make it mandatory:

1. Edit `ELEMENTS` / `STANDARDS` in `scripts/seo/standards.mjs` and update this
   document in the same commit.
2. Run `npm run seo:build` and `npm run seo:gate` — tightening the standard
   lowers scores, and the gate will show exactly which pages the change fails.
3. Raising the bar is a project, not a config edit: expect to fix the failing
   pages (or explicitly `--accept` the new floors) as part of the same effort.
