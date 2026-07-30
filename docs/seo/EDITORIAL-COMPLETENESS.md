<!-- GENERATED FILE — DO NOT EDIT BY HAND. Run `npm run seo` to regenerate. -->

# Editorial Completeness

> **PERFORMANCE MODE: ON** — impressions, position and CTR are live; all 7 priority factors active.

Does each page contain what a page of its kind owes a reader? Measured against the editorial standard in `scripts/seo/standards.mjs` — a per-cluster spec, not a universal feature score. A page can be highly AI-readable and still incomplete.

> Generated **2026-07-30 18:41 UTC** · 162 pages scored · performance window: `pages-2026-07-29.csv` (exported 2026-07-30)
> Derived from `src/data/pageIndex.ts` · `data/search-console/*.csv` · `dist/` · `git log`. Never edited by hand.

**Site completeness: 69%**

## Build these components first

Across the top 20 pages by opportunity, this is how often each required element is missing. The elements at the top of this list are **template work**: build the component once and every page below it is fixed at the same time. Do these before touching individual pages.

| Missing element | Pages | of top 20 | Component to build |
| --- | ---: | ---: | --- |
| **Definitions** | 14 | 70% | `<dl> / <dfn> / glossary term` |
| **Internal links** | 9 | 45% | `8+ in-content links out` |
| **Sources** | 8 | 40% | `<SourcesList>` |
| **Comparison table** | 7 | 35% | `<table> — 2+ columns, 3+ rows` |
| **CTA** | 4 | 20% | `<PageCTA>` |
| **Schema** | 4 | 20% | `Article + BreadcrumbList + Organization + Person` |
| **Related articles** | 3 | 15% | `<RelatedPages>` |
| **FAQ** | 3 | 15% | `<FAQ> (markup + FAQPage schema)` |
| **AI Summary** | 2 | 10% | `<SummaryBlock>` |
| **Author byline** | 2 | 10% | `<AuthorByline>` |

Worked example — adding **Definitions** to 14 of the top 20 pages:

- /does-medicare-cover-dupixent
- /does-medicare-cover-rinvoq
- /skyrizi-assistance-program
- /does-medicare-cover-skyrizi
- /does-medicare-cover-enbrel
- /does-medicare-cover-trelegy
- /medicare-irmaa-life-changing-events
- /entresto-assistance-program
- /medicare-cost-estimator
- /mounjaro-assistance-program
- _… and 4 more_

## Systemic gaps — whole clusters missing an element

An element missing from ≥75% of a cluster is not a content problem, it is a template problem. One component change fixes every page in the row.

| Cluster | Missing element | Have | Coverage | Pages to fix | Cluster impressions |
| --- | --- | ---: | ---: | ---: | ---: |
| part-d | Definitions | 0/40 | 0% | 40 | 3,016 |
| medicare-101 | Definitions | 1/27 | 4% | 26 | 940 |
| costs-irmaa | Definitions | 0/11 | 0% | 11 | 492 |
| dual-eligible | Definitions | 0/7 | 0% | 7 | 217 |
| dual-eligible | Internal links | 1/7 | 14% | 6 | 217 |
| providers | FAQ | 0/4 | 0% | 4 | 9 |
| providers | Sources | 0/4 | 0% | 4 | 9 |
| providers | Internal links | 0/4 | 0% | 4 | 9 |
| medicare-advantage | Sources | 0/4 | 0% | 4 | 26 |
| other-insurance | Sources | 0/3 | 0% | 3 | 870 |
| other-insurance | Internal links | 0/3 | 0% | 3 | 870 |
| other-insurance | Comparison table | 0/3 | 0% | 3 | 870 |
| medicare-advantage | Internal links | 1/4 | 25% | 3 | 26 |
| medicare-advantage | Comparison table | 1/4 | 25% | 3 | 26 |

## Completeness by cluster

| Cluster | Pages | Completeness | Required elements | Weakest |
| --- | ---: | ---: | ---: | --- |
| trust | 5 | **56%** | 5 | AI Summary 40% · Author byline 40% · CTA 40% |
| part-d | 40 | **57%** | 11 | Definitions 0% · Comparison table 30% · Sources 43% |
| costs-irmaa | 11 | **66%** | 11 | Definitions 0% · Internal links 27% · Comparison table 27% |
| providers | 4 | **67%** | 9 | FAQ 0% · Sources 0% · Internal links 0% |
| tools | 2 | **67%** | 9 | AI Summary 50% · Author byline 50% · Sources 50% |
| other-insurance | 3 | **70%** | 10 | Sources 0% · Internal links 0% · Comparison table 0% |
| medicare-advantage | 4 | **73%** | 10 | Sources 0% · Internal links 25% · Comparison table 25% |
| dual-eligible | 7 | **73%** | 11 | Definitions 0% · Internal links 14% · Next steps 71% |
| medicare-101 | 27 | **74%** | 10 | Definitions 4% · FAQ 67% · Sources 70% |
| local | 21 | **77%** | 9 | Sources 48% · FAQ 67% · AI Summary 76% |
| enrollment | 18 | **81%** | 10 | Internal links 33% · Next steps 61% · Schema 72% |
| medigap | 4 | **85%** | 10 | Sources 50% · Internal links 50% · Comparison table 50% |

## Element coverage per cluster

A dash means the element is **not required** for that cluster.

| Cluster | AI Summary | Definitions | Comparison table | FAQ | Related articles | CTA | Sources | Author byline | Next steps | Breadcrumbs | Schema | Internal links |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| trust | 40% | — | — | — | — | 40% | — | 40% | — | 80% | 80% | — |
| part-d | 88% | 0% | 30% | 88% | 53% | 50% | 43% | 88% | — | 90% | 55% | 43% |
| costs-irmaa | 82% | 0% | 27% | 82% | 82% | 82% | 73% | 91% | — | 100% | 82% | 27% |
| providers | 100% | — | — | 0% | 100% | 100% | 0% | 100% | — | 100% | 100% | 0% |
| tools | 50% | — | — | 100% | 100% | 50% | 50% | 50% | — | 100% | 50% | 50% |
| other-insurance | 100% | — | 0% | 100% | 100% | 100% | 0% | 100% | — | 100% | 100% | 0% |
| medicare-advantage | 100% | — | 25% | 100% | 75% | 100% | 0% | 100% | — | 100% | 100% | 25% |
| dual-eligible | 86% | 0% | — | 100% | 86% | 86% | 86% | 86% | 71% | 100% | 86% | 14% |
| medicare-101 | 78% | 4% | — | 67% | 89% | 78% | 70% | 78% | — | 96% | 100% | 78% |
| local | 76% | — | — | 67% | 81% | 81% | 48% | 76% | — | 95% | 95% | 76% |
| enrollment | 89% | — | — | 94% | 94% | 89% | 78% | 94% | 61% | 100% | 72% | 33% |
| medigap | 100% | — | 50% | 100% | 100% | 100% | 50% | 100% | — | 100% | 100% | 50% |

## Pages furthest below standard

| Page | Cluster | Complete | Missing | Priority |
| --- | --- | ---: | --- | ---: |
| [/part-d-help-vernal](https://vernalmedicare.com/part-d-help-vernal.html) | part-d | 0% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Schema, Internal links, Comparison table, Definitions | 47 |
| [/reviews](https://vernalmedicare.com/reviews.html) | trust | 0% | AI Summary, Author byline, Breadcrumbs, Schema, CTA | 25 |
| [/does-medicare-cover-ozempic-wegovy](https://vernalmedicare.com/does-medicare-cover-ozempic-wegovy.html) | part-d | 9% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Comparison table, Definitions | 59 |
| [/insulin-cost-medicare-vernal](https://vernalmedicare.com/insulin-cost-medicare-vernal.html) | part-d | 9% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Comparison table, Definitions | 51 |
| [/does-medicare-cover-mounjaro-utah](https://vernalmedicare.com/does-medicare-cover-mounjaro-utah.html) | part-d | 9% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Comparison table, Definitions | 47 |
| [/does-medicare-cover-dental-vernal](https://vernalmedicare.com/does-medicare-cover-dental-vernal.html) | medicare-101 | 10% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Definitions | 25 |
| [/ (home)](https://vernalmedicare.com/) | local | 33% | Author byline, Sources, CTA, Related articles, Breadcrumbs, Schema | 77 |
| [/vernal](https://vernalmedicare.com/vernal.html) | local | 33% | AI Summary, FAQ, Sources, CTA, Related articles, Internal links | 64 |
| [/medicare-roosevelt-utah](https://vernalmedicare.com/medicare-roosevelt-utah.html) | local | 33% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles | 46 |
| [/medicare-duchesne-utah](https://vernalmedicare.com/medicare-duchesne-utah.html) | local | 33% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles | 33 |
| [/skyrizi-assistance-program](https://vernalmedicare.com/skyrizi-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 71 |
| [/enbrel-assistance-program](https://vernalmedicare.com/enbrel-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 70 |
| [/entresto-assistance-program](https://vernalmedicare.com/entresto-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 65 |
| [/repatha-assistance-program](https://vernalmedicare.com/repatha-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 63 |
| [/dupixent-assistance-program](https://vernalmedicare.com/dupixent-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 62 |
| [/mounjaro-assistance-program](https://vernalmedicare.com/mounjaro-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 61 |
| [/jardiance-assistance-program](https://vernalmedicare.com/jardiance-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 61 |
| [/trulicity-assistance-program](https://vernalmedicare.com/trulicity-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 61 |
| [/farxiga-assistance-program](https://vernalmedicare.com/farxiga-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 61 |
| [/xarelto-assistance-program](https://vernalmedicare.com/xarelto-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 57 |
| [/eliquis-assistance-program](https://vernalmedicare.com/eliquis-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 57 |
| [/medicare-drug-coverage](https://vernalmedicare.com/medicare-drug-coverage.html) | part-d | 36% | AI Summary, Author byline, Sources, CTA, Related articles, Comparison table, Definitions | 56 |
| [/rinvoq-assistance-program](https://vernalmedicare.com/rinvoq-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 51 |
| [/humira-assistance-program](https://vernalmedicare.com/humira-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 50 |
| [/medicare-costs](https://vernalmedicare.com/medicare-costs.html) | costs-irmaa | 36% | AI Summary, Author byline, Sources, CTA, Related articles, Comparison table, Definitions | 47 |
| [/ozempic-assistance-program](https://vernalmedicare.com/ozempic-assistance-program.html) | part-d | 36% | Sources, CTA, Related articles, Schema, Internal links, Comparison table, Definitions | 39 |
| [/medicare-financial-assistance](https://vernalmedicare.com/medicare-financial-assistance.html) | dual-eligible | 36% | AI Summary, Author byline, Sources, CTA, Related articles, Definitions, Next steps | 29 |
| [/faq](https://vernalmedicare.com/faq.html) | trust | 40% | AI Summary, Author byline, CTA | 57 |
| [/medicare-coverage](https://vernalmedicare.com/medicare-coverage.html) | medicare-101 | 40% | AI Summary, Author byline, Sources, CTA, Related articles, Definitions | 48 |
| [/medicare-news](https://vernalmedicare.com/medicare-news.html) | medicare-101 | 40% | AI Summary, Author byline, Sources, CTA, Related articles, Definitions | 38 |
| [/editorial-policy](https://vernalmedicare.com/editorial-policy.html) | trust | 40% | AI Summary, Author byline, CTA | 35 |
| [/medicare-quote-vernal](https://vernalmedicare.com/medicare-quote-vernal.html) | local | 44% | AI Summary, FAQ, Author byline, Sources, Internal links | 64 |
| [/free-medicare-comparison-vernal](https://vernalmedicare.com/free-medicare-comparison-vernal.html) | local | 44% | AI Summary, FAQ, Author byline, Sources, Internal links | 27 |
| [/medicare-help-center](https://vernalmedicare.com/medicare-help-center.html) | medicare-101 | 50% | AI Summary, Author byline, Sources, CTA, Definitions | 58 |
| [/turning-65](https://vernalmedicare.com/turning-65.html) | enrollment | 50% | AI Summary, Author byline, CTA, Related articles, Next steps | 49 |
| [/medicare-irmaa](https://vernalmedicare.com/medicare-irmaa.html) | costs-irmaa | 55% | AI Summary, CTA, Internal links, Comparison table, Definitions | 60 |
| [/tier-3-vs-tier-4-medicare-part-d](https://vernalmedicare.com/tier-3-vs-tier-4-medicare-part-d.html) | part-d | 55% | FAQ, Sources, Internal links, Comparison table, Definitions | 52 |
| [/medicare-out-of-pocket-maximum-2026](https://vernalmedicare.com/medicare-out-of-pocket-maximum-2026.html) | costs-irmaa | 55% | FAQ, Sources, Internal links, Comparison table, Definitions | 51 |
| [/medicare-cost-uintah-county](https://vernalmedicare.com/medicare-cost-uintah-county.html) | costs-irmaa | 55% | FAQ, Sources, Related articles, Comparison table, Definitions | 40 |
| [/medicare-calculators](https://vernalmedicare.com/medicare-calculators.html) | tools | 56% | AI Summary, Author byline, Sources, CTA | 30 |

## Fully compliant pages

16 of 146 pages meet their cluster standard in full.

| Page | Cluster | Impressions | Pos |
| --- | --- | ---: | ---: |
| [/medigap](https://vernalmedicare.com/medigap.html) | medigap | 70 | 13.7 |
| [/medicare-creditable-coverage](https://vernalmedicare.com/medicare-creditable-coverage.html) | enrollment | 19 | 31.7 |
| [/about](https://vernalmedicare.com/about.html) | trust | 10 | 1.6 |
| [/medicare-myton-utah](https://vernalmedicare.com/medicare-myton-utah.html) | local | 4 | 17.0 |
| [/medicare-tabiona-utah](https://vernalmedicare.com/medicare-tabiona-utah.html) | local | 3 | 26.0 |
| [/medicare-altamont-utah](https://vernalmedicare.com/medicare-altamont-utah.html) | local | 2 | 33.5 |
| [/medicare-enrollment-periods](https://vernalmedicare.com/medicare-enrollment-periods.html) | enrollment | 1 | 6.0 |
| [/medicare-ouray-utah](https://vernalmedicare.com/medicare-ouray-utah.html) | local | 1 | 33.0 |
| [/medicare-fort-duchesne-utah](https://vernalmedicare.com/medicare-fort-duchesne-utah.html) | local | 0 | — |
| [/medicare-neola-utah](https://vernalmedicare.com/medicare-neola-utah.html) | local | 0 | — |
| [/medicare-ballard-utah](https://vernalmedicare.com/medicare-ballard-utah.html) | local | 0 | — |
| [/medicare-jensen-utah](https://vernalmedicare.com/medicare-jensen-utah.html) | local | 0 | — |
| [/medicare-maeser-utah](https://vernalmedicare.com/medicare-maeser-utah.html) | local | 0 | — |
| [/medicare-naples-utah](https://vernalmedicare.com/medicare-naples-utah.html) | local | 0 | — |
| [/medicare-and-employer-coverage](https://vernalmedicare.com/medicare-and-employer-coverage.html) | enrollment | 0 | — |
| [/medicare-agent-credentials](https://vernalmedicare.com/medicare-agent-credentials.html) | trust | 0 | — |

## The standard

Edit `scripts/seo/standards.mjs` to change what any cluster is held to.

| Element | Satisfied by | Required in |
| --- | --- | --- |
| AI Summary | `<SummaryBlock>` | every cluster |
| Definitions | `<dl> / <dfn> / glossary term` | part-d, costs-irmaa, dual-eligible, medicare-101 |
| Comparison table | `<table> — 2+ columns, 3+ rows` | part-d, costs-irmaa, other-insurance, medicare-advantage, medigap |
| FAQ | `<FAQ> (markup + FAQPage schema)` | part-d, costs-irmaa, providers, tools, other-insurance, medicare-advantage, dual-eligible, medicare-101, local, enrollment, medigap |
| Related articles | `<RelatedPages>` | part-d, costs-irmaa, providers, tools, other-insurance, medicare-advantage, dual-eligible, medicare-101, local, enrollment, medigap |
| CTA | `<PageCTA>` | every cluster |
| Sources | `<SourcesList>` | part-d, costs-irmaa, providers, tools, other-insurance, medicare-advantage, dual-eligible, medicare-101, local, enrollment, medigap |
| Author byline | `<AuthorByline>` | every cluster |
| Next steps | `<NextSteps>` | dual-eligible, enrollment |
| Breadcrumbs | `<Breadcrumbs>` | every cluster |
| Schema | `Article + BreadcrumbList + Organization + Person` | every cluster |
| Internal links | `8+ in-content links out` | part-d, costs-irmaa, providers, tools, other-insurance, medicare-advantage, dual-eligible, medicare-101, local, enrollment, medigap |
