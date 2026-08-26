<!-- GENERATED FILE — DO NOT EDIT BY HAND. Run `npm run seo` to regenerate. -->

# Editorial Completeness

> **PERFORMANCE MODE: ON** — impressions, position and CTR are live; all 7 priority factors active.

Does each page contain what a page of its kind owes a reader? Measured against the editorial standard in `scripts/seo/standards.mjs` — a per-cluster spec, not a universal feature score. A page can be highly AI-readable and still incomplete.

> Generated **2026-08-26 21:21 UTC** · 164 pages scored · performance window: `pages-2026-07-29.csv` (exported 2026-07-30)
> Derived from `src/data/pageIndex.ts` · `data/search-console/*.csv` · `dist/` · `git log`. Never edited by hand.

**Site completeness: 75%**

## Build these components first

Across the top 20 pages by opportunity, this is how often each required element is missing. The elements at the top of this list are **template work**: build the component once and every page below it is fixed at the same time. Do these before touching individual pages.

| Missing element | Pages | of top 20 | Component to build |
| --- | ---: | ---: | --- |
| **Definitions** | 11 | 55% | `<dl> / <dfn> / glossary term` |
| **Internal links** | 6 | 30% | `8+ in-content links out` |
| **Sources** | 5 | 25% | `<SourcesList>` |
| **Schema** | 4 | 20% | `Article + BreadcrumbList + Organization + Person` |
| **Comparison table** | 4 | 20% | `<table> — 2+ columns, 3+ rows` |
| **FAQ** | 3 | 15% | `<FAQ> (markup + FAQPage schema)` |
| **AI Summary** | 2 | 10% | `<SummaryBlock>` |
| **Author byline** | 2 | 10% | `<AuthorByline>` |
| **CTA** | 1 | 5% | `<PageCTA>` |

Worked example — adding **Definitions** to 11 of the top 20 pages:

- /does-medicare-cover-dupixent
- /does-medicare-cover-rinvoq
- /does-medicare-cover-skyrizi
- /does-medicare-cover-enbrel
- /does-medicare-cover-trelegy
- /medicare-irmaa-life-changing-events
- /medicare-cost-estimator
- /medicare-out-of-state-utah
- /does-medicare-cover-eliquis
- /medicare-savings-programs-utah
- _… and 1 more_

## Systemic gaps — whole clusters missing an element

An element missing from ≥75% of a cluster is not a content problem, it is a template problem. One component change fixes every page in the row.

| Cluster | Missing element | Have | Coverage | Pages to fix | Cluster impressions |
| --- | --- | ---: | ---: | ---: | ---: |
| medicare-101 | Definitions | 1/27 | 4% | 26 | 940 |
| costs-irmaa | Definitions | 0/11 | 0% | 11 | 492 |
| dual-eligible | Definitions | 0/7 | 0% | 7 | 217 |
| dual-eligible | Internal links | 1/7 | 14% | 6 | 217 |
| providers | FAQ | 0/4 | 0% | 4 | 9 |
| providers | Sources | 0/4 | 0% | 4 | 9 |
| providers | Internal links | 0/4 | 0% | 4 | 9 |
| other-insurance | Sources | 0/3 | 0% | 3 | 870 |
| other-insurance | Internal links | 0/3 | 0% | 3 | 870 |
| other-insurance | Comparison table | 0/3 | 0% | 3 | 870 |
| medicare-advantage | Sources | 1/4 | 25% | 3 | 13 |

## Completeness by cluster

| Cluster | Pages | Completeness | Required elements | Weakest |
| --- | ---: | ---: | ---: | --- |
| trust | 5 | **56%** | 5 | AI Summary 40% · Author byline 40% · CTA 40% |
| costs-irmaa | 11 | **66%** | 11 | Definitions 0% · Internal links 27% · Comparison table 27% |
| providers | 4 | **67%** | 9 | FAQ 0% · Sources 0% · Internal links 0% |
| tools | 2 | **67%** | 9 | AI Summary 50% · Author byline 50% · Sources 50% |
| other-insurance | 3 | **70%** | 10 | Sources 0% · Internal links 0% · Comparison table 0% |
| dual-eligible | 7 | **73%** | 11 | Definitions 0% · Internal links 14% · Next steps 71% |
| medicare-101 | 27 | **74%** | 10 | Definitions 4% · FAQ 67% · Sources 70% |
| local | 21 | **77%** | 9 | Sources 48% · FAQ 67% · AI Summary 76% |
| part-d | 42 | **77%** | 11 | Definitions 40% · Schema 52% · Comparison table 69% |
| medicare-advantage | 4 | **80%** | 10 | Sources 25% · Internal links 50% · Comparison table 50% |
| enrollment | 18 | **81%** | 10 | Internal links 33% · Next steps 61% · Schema 72% |
| medigap | 4 | **88%** | 10 | Internal links 50% · Comparison table 50% · Sources 75% |

## Element coverage per cluster

A dash means the element is **not required** for that cluster.

| Cluster | AI Summary | Definitions | Comparison table | FAQ | Related articles | CTA | Sources | Author byline | Next steps | Breadcrumbs | Schema | Internal links |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| trust | 40% | — | — | — | — | 40% | — | 40% | — | 80% | 80% | — |
| costs-irmaa | 82% | 0% | 27% | 82% | 82% | 82% | 73% | 91% | — | 100% | 82% | 27% |
| providers | 100% | — | — | 0% | 100% | 100% | 0% | 100% | — | 100% | 100% | 0% |
| tools | 50% | — | — | 100% | 100% | 50% | 50% | 50% | — | 100% | 50% | 50% |
| other-insurance | 100% | — | 0% | 100% | 100% | 100% | 0% | 100% | — | 100% | 100% | 0% |
| dual-eligible | 86% | 0% | — | 100% | 86% | 86% | 86% | 86% | 71% | 100% | 86% | 14% |
| medicare-101 | 78% | 4% | — | 67% | 89% | 78% | 70% | 78% | — | 96% | 100% | 78% |
| local | 76% | — | — | 67% | 81% | 81% | 48% | 76% | — | 95% | 95% | 76% |
| part-d | 88% | 40% | 69% | 88% | 88% | 86% | 81% | 88% | — | 90% | 52% | 79% |
| medicare-advantage | 100% | — | 50% | 100% | 75% | 100% | 25% | 100% | — | 100% | 100% | 50% |
| enrollment | 89% | — | — | 94% | 94% | 89% | 78% | 94% | 61% | 100% | 72% | 33% |
| medigap | 100% | — | 50% | 100% | 100% | 100% | 75% | 100% | — | 100% | 100% | 50% |

## Pages furthest below standard

| Page | Cluster | Complete | Missing | Priority |
| --- | --- | ---: | --- | ---: |
| [/part-d-help-vernal](https://vernalmedicare.com/part-d-help-vernal.html) | part-d | 0% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Schema, Internal links, Comparison table, Definitions | 47 |
| [/reviews](https://vernalmedicare.com/reviews.html) | trust | 0% | AI Summary, Author byline, Breadcrumbs, Schema, CTA | 24 |
| [/does-medicare-cover-ozempic-wegovy](https://vernalmedicare.com/does-medicare-cover-ozempic-wegovy.html) | part-d | 9% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Comparison table, Definitions | 59 |
| [/insulin-cost-medicare-vernal](https://vernalmedicare.com/insulin-cost-medicare-vernal.html) | part-d | 9% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Comparison table, Definitions | 50 |
| [/does-medicare-cover-mounjaro-utah](https://vernalmedicare.com/does-medicare-cover-mounjaro-utah.html) | part-d | 9% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Comparison table, Definitions | 46 |
| [/does-medicare-cover-dental-vernal](https://vernalmedicare.com/does-medicare-cover-dental-vernal.html) | medicare-101 | 10% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles, Breadcrumbs, Internal links, Definitions | 24 |
| [/ (home)](https://vernalmedicare.com/) | local | 33% | Author byline, Sources, CTA, Related articles, Breadcrumbs, Schema | 77 |
| [/vernal](https://vernalmedicare.com/vernal.html) | local | 33% | AI Summary, FAQ, Sources, CTA, Related articles, Internal links | 65 |
| [/medicare-roosevelt-utah](https://vernalmedicare.com/medicare-roosevelt-utah.html) | local | 33% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles | 47 |
| [/medicare-duchesne-utah](https://vernalmedicare.com/medicare-duchesne-utah.html) | local | 33% | AI Summary, FAQ, Author byline, Sources, CTA, Related articles | 32 |
| [/medicare-drug-coverage](https://vernalmedicare.com/medicare-drug-coverage.html) | part-d | 36% | AI Summary, Author byline, Sources, CTA, Related articles, Comparison table, Definitions | 56 |
| [/medicare-costs](https://vernalmedicare.com/medicare-costs.html) | costs-irmaa | 36% | AI Summary, Author byline, Sources, CTA, Related articles, Comparison table, Definitions | 47 |
| [/medicare-financial-assistance](https://vernalmedicare.com/medicare-financial-assistance.html) | dual-eligible | 36% | AI Summary, Author byline, Sources, CTA, Related articles, Definitions, Next steps | 28 |
| [/faq](https://vernalmedicare.com/faq.html) | trust | 40% | AI Summary, Author byline, CTA | 57 |
| [/medicare-coverage](https://vernalmedicare.com/medicare-coverage.html) | medicare-101 | 40% | AI Summary, Author byline, Sources, CTA, Related articles, Definitions | 49 |
| [/medicare-news](https://vernalmedicare.com/medicare-news.html) | medicare-101 | 40% | AI Summary, Author byline, Sources, CTA, Related articles, Definitions | 39 |
| [/editorial-policy](https://vernalmedicare.com/editorial-policy.html) | trust | 40% | AI Summary, Author byline, CTA | 35 |
| [/medicare-quote-vernal](https://vernalmedicare.com/medicare-quote-vernal.html) | local | 44% | AI Summary, FAQ, Author byline, Sources, Internal links | 64 |
| [/free-medicare-comparison-vernal](https://vernalmedicare.com/free-medicare-comparison-vernal.html) | local | 44% | AI Summary, FAQ, Author byline, Sources, Internal links | 27 |
| [/medicare-help-center](https://vernalmedicare.com/medicare-help-center.html) | medicare-101 | 50% | AI Summary, Author byline, Sources, CTA, Definitions | 59 |
| [/turning-65](https://vernalmedicare.com/turning-65.html) | enrollment | 50% | AI Summary, Author byline, CTA, Related articles, Next steps | 49 |
| [/medicare-irmaa](https://vernalmedicare.com/medicare-irmaa.html) | costs-irmaa | 55% | AI Summary, CTA, Internal links, Comparison table, Definitions | 60 |
| [/tier-3-vs-tier-4-medicare-part-d](https://vernalmedicare.com/tier-3-vs-tier-4-medicare-part-d.html) | part-d | 55% | FAQ, Sources, Internal links, Comparison table, Definitions | 51 |
| [/medicare-out-of-pocket-maximum-2026](https://vernalmedicare.com/medicare-out-of-pocket-maximum-2026.html) | costs-irmaa | 55% | FAQ, Sources, Internal links, Comparison table, Definitions | 50 |
| [/medicare-cost-uintah-county](https://vernalmedicare.com/medicare-cost-uintah-county.html) | costs-irmaa | 55% | FAQ, Sources, Related articles, Comparison table, Definitions | 40 |
| [/medicare-calculators](https://vernalmedicare.com/medicare-calculators.html) | tools | 56% | AI Summary, Author byline, Sources, CTA | 31 |
| [/medicare-out-of-state-utah](https://vernalmedicare.com/medicare-out-of-state-utah.html) | medicare-101 | 60% | FAQ, Sources, Internal links, Definitions | 54 |
| [/medicare-decision-center](https://vernalmedicare.com/medicare-decision-center.html) | medicare-101 | 60% | AI Summary, Author byline, CTA, Definitions | 45 |
| [/medicare-home-health-utah](https://vernalmedicare.com/medicare-home-health-utah.html) | medicare-101 | 60% | FAQ, Sources, Internal links, Definitions | 42 |
| [/medicare-glossary](https://vernalmedicare.com/medicare-glossary.html) | medicare-101 | 60% | AI Summary, Author byline, Sources, CTA | 40 |
| [/medicare-checklist-2026](https://vernalmedicare.com/medicare-checklist-2026.html) | enrollment | 60% | FAQ, Sources, Internal links, Next steps | 20 |
| [/medicare-cost-estimator](https://vernalmedicare.com/medicare-cost-estimator.html) | costs-irmaa | 64% | Schema, Internal links, Comparison table, Definitions | 63 |
| [/medicare-formulary-lookup](https://vernalmedicare.com/medicare-formulary-lookup.html) | part-d | 64% | Schema, Internal links, Comparison table, Definitions | 62 |
| [/medicare-drug-cost-calculator](https://vernalmedicare.com/medicare-drug-cost-calculator.html) | part-d | 64% | Schema, Internal links, Comparison table, Definitions | 55 |
| [/medicare-part-d-cost-calculator](https://vernalmedicare.com/medicare-part-d-cost-calculator.html) | part-d | 64% | Schema, Internal links, Comparison table, Definitions | 49 |
| [/cheapest-prescription-drug-plans](https://vernalmedicare.com/cheapest-prescription-drug-plans.html) | part-d | 64% | Sources, Internal links, Comparison table, Definitions | 46 |
| [/medicare-extra-help-calculator](https://vernalmedicare.com/medicare-extra-help-calculator.html) | dual-eligible | 64% | Schema, Internal links, Definitions, Next steps | 43 |
| [/prescription-drug-assistance](https://vernalmedicare.com/prescription-drug-assistance.html) | part-d | 64% | Sources, CTA, Comparison table, Definitions | 32 |
| [/medicare-agent-vernal](https://vernalmedicare.com/medicare-agent-vernal.html) | local | 67% | FAQ, Sources, Internal links | 53 |
| [/medicare-uintah-basin-medical-center](https://vernalmedicare.com/medicare-uintah-basin-medical-center.html) | providers | 67% | FAQ, Sources, Internal links | 38 |

## Fully compliant pages

19 of 148 pages meet their cluster standard in full.

| Page | Cluster | Impressions | Pos |
| --- | --- | ---: | ---: |
| [/medigap](https://vernalmedicare.com/medigap.html) | medigap | 70 | 13.7 |
| [/medicare-supplement-vs-advantage](https://vernalmedicare.com/medicare-supplement-vs-advantage.html) | medigap | 43 | 31.4 |
| [/medicare-creditable-coverage](https://vernalmedicare.com/medicare-creditable-coverage.html) | enrollment | 19 | 31.7 |
| [/about](https://vernalmedicare.com/about.html) | trust | 10 | 1.6 |
| [/medicare-myton-utah](https://vernalmedicare.com/medicare-myton-utah.html) | local | 4 | 17.0 |
| [/medicare-tabiona-utah](https://vernalmedicare.com/medicare-tabiona-utah.html) | local | 3 | 26.0 |
| [/medicare-altamont-utah](https://vernalmedicare.com/medicare-altamont-utah.html) | local | 2 | 33.5 |
| [/medicare-enrollment-periods](https://vernalmedicare.com/medicare-enrollment-periods.html) | enrollment | 1 | 6.0 |
| [/medicare-ouray-utah](https://vernalmedicare.com/medicare-ouray-utah.html) | local | 1 | 33.0 |
| [/medicare-advantage-plans-vernal](https://vernalmedicare.com/medicare-advantage-plans-vernal.html) | medicare-advantage | 0 | — |
| [/medicare-fort-duchesne-utah](https://vernalmedicare.com/medicare-fort-duchesne-utah.html) | local | 0 | — |
| [/medicare-neola-utah](https://vernalmedicare.com/medicare-neola-utah.html) | local | 0 | — |
| [/medicare-ballard-utah](https://vernalmedicare.com/medicare-ballard-utah.html) | local | 0 | — |
| [/medicare-jensen-utah](https://vernalmedicare.com/medicare-jensen-utah.html) | local | 0 | — |
| [/medicare-maeser-utah](https://vernalmedicare.com/medicare-maeser-utah.html) | local | 0 | — |
| [/medicare-naples-utah](https://vernalmedicare.com/medicare-naples-utah.html) | local | 0 | — |
| [/part-d-plans-vernal](https://vernalmedicare.com/part-d-plans-vernal.html) | part-d | 0 | — |
| [/medicare-and-employer-coverage](https://vernalmedicare.com/medicare-and-employer-coverage.html) | enrollment | 0 | — |
| [/medicare-agent-credentials](https://vernalmedicare.com/medicare-agent-credentials.html) | trust | 0 | — |

## The standard

Edit `scripts/seo/standards.mjs` to change what any cluster is held to.

| Element | Satisfied by | Required in |
| --- | --- | --- |
| AI Summary | `<SummaryBlock>` | every cluster |
| Definitions | `<dl> / <dfn> / glossary term` | costs-irmaa, dual-eligible, medicare-101, part-d |
| Comparison table | `<table> — 2+ columns, 3+ rows` | costs-irmaa, other-insurance, part-d, medicare-advantage, medigap |
| FAQ | `<FAQ> (markup + FAQPage schema)` | costs-irmaa, providers, tools, other-insurance, dual-eligible, medicare-101, local, part-d, medicare-advantage, enrollment, medigap |
| Related articles | `<RelatedPages>` | costs-irmaa, providers, tools, other-insurance, dual-eligible, medicare-101, local, part-d, medicare-advantage, enrollment, medigap |
| CTA | `<PageCTA>` | every cluster |
| Sources | `<SourcesList>` | costs-irmaa, providers, tools, other-insurance, dual-eligible, medicare-101, local, part-d, medicare-advantage, enrollment, medigap |
| Author byline | `<AuthorByline>` | every cluster |
| Next steps | `<NextSteps>` | dual-eligible, enrollment |
| Breadcrumbs | `<Breadcrumbs>` | every cluster |
| Schema | `Article + BreadcrumbList + Organization + Person` | every cluster |
| Internal links | `8+ in-content links out` | costs-irmaa, providers, tools, other-insurance, dual-eligible, medicare-101, local, part-d, medicare-advantage, enrollment, medigap |
