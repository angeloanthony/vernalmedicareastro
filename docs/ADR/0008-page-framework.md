# ADR-0008 — Page Framework (the page-rendering contract)

**Status:** Accepted · 2026-06-30 · **Supersedes ADR-0005** (SEO-only scope)
**Companion:** ADR-0009 (Migration Rules)

## Context
Almost every future page (article, calculator, drug, location, comparison) shares
~80% structure: breadcrumbs, author/reviewed-by/updated byline, summary, FAQ,
next-steps, CTA, related pages, citations, disclaimers, and JSON-LD orchestration.
Building these per page — or as independent layouts — duplicates that 80%. Vernal's
`BaseLayout` already owns the `<head>` and must be preserved.

## Decision
One Page Framework: a `StandardPageLayout` that wraps `BaseLayout` and owns the
shared 80%, with thin page-type specializations on top, all driven by a single
`PageContext`. Approved refinements (this revision):

1. **Shared hierarchy** (not independent layouts).
2. **`RecordPageLayout`** parent for the data-record pages (Drug, Location) — a drug
   is not a location; both are *records*.
3. **Split `PageData` (portable content model) from `PageContext`** so MDX, CMS,
   AI-generated, and calculator pages share one content shape.
4. **Schema is chosen by the framework, not the author** — page type → primary
   JSON-LD; FAQ/Breadcrumb/Person added automatically from context.
5. **Authors in `src/data/authors.ts`**; **`Evidence` citations are first-class data**.
6. **`NextStep`** guidance block (renamed from DecisionBox).
7. **Related pages computed + weighted-scored** from taxonomy; top 4 shown.
8. **`InteractivePage` reserved** (workflows: quizzes, wizards, finders ≠ calculators).
9. **`src/lib/search/` reserved** for later (keyword/drug/plan/location search).
10. **`data/pageIndex.ts` built now** (manual; auto-generated later).
11. **E-E-A-T supported from day one** (written-by, reviewed-by, updated, sources,
   medical disclaimer, local availability).

> Astro note: "inheritance" = **composition** (`ArticlePage` → `StandardPageLayout`
> → `BaseLayout`). No class inheritance.

## Component hierarchy (UML-style)

```
BaseLayout                       (unchanged: head / OG / canonical / GA / schema[])
  └─ StandardPageLayout          shared 80%: breadcrumb · header(title + AuthorByline +
       │                          updated + localAvailability) · summary · nextSteps ·
       │                          <body slot> · FAQ · sources · related · CTA · disclaimer
       │                          · schema orchestration → BaseLayout.schema
       ├─ ArticlePage            prose                        → Article
       ├─ ComparisonPage         + ComparisonTable + verdict  → Article
       ├─ CalculatorPage         Phase-1 calculator/* re-parented → HowTo
       ├─ InteractivePage        RESERVED (Phase 4+): quizzes, eligibility wizard,
       │                          plan/county finder — workflows, not calculators
       └─ RecordPageLayout       data-record-driven (record header + taxonomy related)
            ├─ DrugPage           data/drugs      → MedicalWebPage
            └─ LocationPage       data/locations  → LocalBusiness
```

Content blocks (`src/components/content/`): `AuthorByline`, `SummaryBox` (reuse
`SummaryBlock`), `FAQ` (reuse — welded visible+schema), `Breadcrumbs` (reuse),
`RelatedPages`, `NextStep`, `SourcesList`, `Disclaimer`, `PageCTA` (generalize
`CalculatorCTA`), `ComparisonTable` (generalize `CalculatorComparison`).

## The contract — TypeScript interfaces

```ts
// ── Identity / E-E-A-T (records in src/data/authors.ts) ──────────────────────
interface Author {
  id: string;                          // 'rocco'
  name: string; jobTitle: string;
  role: 'author' | 'reviewer' | 'source' | 'contributor';
  url?: string; sameAs?: string[];     // bio, license lookup, GBP, socials
  credentials?: string[];              // 'NPN #…', 'AHIP certified 2026'
}

// ── Evidence: authoritative citations as first-class data ────────────────────
interface Evidence {
  title: string;
  url: string;
  publisher: string;                   // 'CMS' | 'Medicare.gov' | 'SSA' | 'IRS' | …
  date?: string;                       // ISO publication/accessed date
}

// ── Taxonomy (drives weighted related) ───────────────────────────────────────
type SiloKey =
  | 'medicare-101' | 'enrollment' | 'medicare-advantage' | 'medigap'
  | 'part-d' | 'costs-irmaa' | 'providers' | 'local' | 'tools'
  | 'dual-eligible' | 'other-insurance' | 'trust';
interface Taxonomy { silo: SiloKey; tags?: string[]; pillar?: boolean; }

// ── NextStep: contextual "what do I do now?" guidance ────────────────────────
interface NextStep {
  when: string;                        // 'If you're turning 65 in the next 3 months'
  action: string;                      // 'Enroll during your Initial Enrollment Period'
  href?: string; cta?: string;
}

// ── PageData: the PORTABLE content model (MDX / CMS / AI / calculators share it) ─
interface PageData {
  title: string;
  description: string;
  taxonomy: Taxonomy;
  summary?: string;                    // AI-pullable TL;DR
  faqs?: FAQItem[];                    // FAQItem from types/FAQ
  sources?: Evidence[];                // citations
  nextSteps?: NextStep[];
  // body is supplied via the layout <slot/> (or rendered MDX later)
}

// ── PageMeta: head extras only (title/description come from PageData) ─────────
interface PageMeta {
  canonical: string;                   // absolute .html (ADR-0002)
  ogTitle?: string; ogDescription?: string;
  ogType?: 'website' | 'article'; ogImage?: string;
  robots?: string;                     // default 'index, follow'
}

interface CTAConfig {
  heading?: string; text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

// ── Related: computed + scored; top 4 rendered ───────────────────────────────
interface RelatedPage { href: string; label: string; blurb?: string; silo?: SiloKey; score?: number; }

// ── Schema: composable; KIND IS CHOSEN BY THE LAYOUT, never the author ───────
type SchemaKind =
  | 'Article' | 'MedicalWebPage' | 'WebPage' | 'HowTo' | 'FAQPage'
  | 'BreadcrumbList' | 'Person' | 'Organization' | 'LocalBusiness'
  | 'WebSite' | 'Review' | 'Drug';
interface SchemaModule { kind: SchemaKind; build: (ctx: PageContext) => Record<string, unknown>; }

// ── THE master object: one per page ──────────────────────────────────────────
interface PageContext {
  page: PageData;                      // portable content
  meta: PageMeta;                      // head extras (canonical, og)
  // identity / E-E-A-T (optional, day one)
  author?: Author;                     // default: ROCCO (data/authors)
  reviewedBy?: Author;
  lastUpdated?: string;
  medicalDisclaimer?: boolean | string;
  localAvailability?: string;
  // structure
  breadcrumb?: Crumb[];                // Crumb from types/Location
  related?: RelatedPage[];             // omit → computed (scored) from taxonomy
  cta?: CTAConfig;
  // schema OVERRIDES only — primary kind + base set are set automatically
  schema?: SchemaModule[];
}
```

## Automatic schema selection
The **layout** passes its primary `SchemaKind` to `assembleSchema(ctx, primaryKind)`;
authors never choose. Mapping:

| Page type | Primary schema |
|---|---|
| ArticlePage / ComparisonPage | `Article` |
| CalculatorPage | `HowTo` |
| DrugPage | `MedicalWebPage` (+ `Drug`) |
| LocationPage | `LocalBusiness` |

`assembleSchema` then auto-adds: `BreadcrumbList` (if `breadcrumb`), `FAQPage` (if
`page.faqs`), `Person` (author/reviewer), sitewide `Organization`/`WebSite`, and
`citation` from `page.sources` (Evidence → CreativeWork). Finally appends
`ctx.schema` overrides. Output → `BaseLayout.schema`. No page hand-writes JSON-LD.

## Weighted related model
`lib/related.relatedFor(taxonomy, index): RelatedPage[]` scores each candidate and
returns the top 4 (excluding self):

```
score = (sameSilo ? 60 : 0) + 12 × sharedTagCount + (candidate.pillar ? 10 : 0)
```

Tunable in `lib/related`; reads `data/pageIndex.ts` (manual now; generated from
content collections in Phase 4). Pages declare `taxonomy`; the framework picks
"Related" — no hand-maintained lists.

## File layout (build in Phase 2)
```
src/types/Page.ts        PageData, PageContext, PageMeta, Author, Evidence,
                         Taxonomy, NextStep, RelatedPage, CTAConfig,
                         SchemaKind, SchemaModule (+ barrel)
src/data/authors.ts      ROCCO (+ future reviewer / pharmacist / CMS source)
src/data/pageIndex.ts    manual page registry for related-computation (now)
src/lib/schema/*         + builders per kind; assembleSchema(ctx, primary)
src/lib/related/*        relatedFor(...) (weighted)
src/lib/search/          RESERVED placeholder (future: keyword/drug/plan/location)
src/components/layout/    StandardPageLayout, ArticlePage, ComparisonPage,
                          CalculatorPage (re-parent), RecordPageLayout,
                          DrugPage, LocationPage  (InteractivePage reserved)
src/components/content/   AuthorByline, RelatedPages, NextStep, SourcesList,
                          Disclaimer, PageCTA, ComparisonTable (+ reuse FAQ/Summary/Breadcrumbs)
```

## Resolved questions
- **RecordPageLayout** — adopted (Drug & Location are records, not an is-a).
- **pageIndex.ts** — built now, manual.
- **Default schema** — neither hand-picked; **automatic by page type** (table above).

## Consequences
- A page = `PageData` + `PageContext` + body slot; the 80% is centralized/tested once.
- Fixes audit bugs centrally (welded FAQ schema, breadcrumbs, author E-E-A-T,
  canonicals) and ratchets the astro-check baseline down as pages adopt it.
- Phase-2 touches one Phase-1 component (re-parent `CalculatorLayout`) — additive,
  behind the gate, no existing page changed.
- Existing 47 pages migrate later, one small commit each (ADR-0009).
