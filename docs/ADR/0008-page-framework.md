# ADR-0008 — Page Framework (the page-rendering contract)

**Status:** Accepted · 2026-06-30 · **Supersedes ADR-0005** (SEO-only scope)

## Context
Almost every future page (article, calculator, drug, location, comparison) shares
~80% structure: breadcrumbs, author/reviewed-by/updated byline, summary, FAQ, CTA,
related pages, disclaimers, and JSON-LD orchestration. Building these per page — or
as four independent layouts — duplicates that 80%. Vernal's `BaseLayout` already
owns the `<head>` (title/OG/canonical/GA/`schema[]`) and must be preserved.

## Decision
Build **one Page Framework**: a `StandardPageLayout` that wraps `BaseLayout` and
owns the shared 80%, with thin page-type specializations on top. Key choices
(approved):

1. **Shared hierarchy**, not four independent layouts.
2. **One `PageContext` object** per page, not dozens of props.
3. **Authors live in `src/data/authors.ts`** (content, not config).
4. **Add `ComparisonPage`** as a first-class page type.
5. **Related pages are computed from taxonomy** (silo + tags), not hand-listed.
6. **Schema is composable** (`SchemaModule[]`), assembled from context — not one
   monolithic per-page builder.
7. **E-E-A-T fields supported from day one**: written-by, reviewed-by, last-updated,
   sources, medical disclaimer, local availability.

Plus a new shared block — **`DecisionBox`** (contextual "if X, do Y next" guidance).

> Astro note: "inheritance" here means **composition** — `ArticlePage.astro` renders
> `StandardPageLayout.astro` which renders `BaseLayout.astro`. No class inheritance.

## Component hierarchy (UML-style)

```
BaseLayout                         (unchanged: head / OG / canonical / GA / schema[])
  └─ StandardPageLayout            shared 80%: breadcrumb · header(title + AuthorByline +
       │                            updated + localAvailability) · summary · decisions ·
       │                            <body slot> · FAQ · sources · related · CTA ·
       │                            disclaimer · schema orchestration → BaseLayout.schema
       ├─ ArticlePage              + prose body              (Article | MedicalWebPage)
       ├─ ComparisonPage           + ComparisonTable + verdict (Article + FAQPage)
       ├─ CalculatorPage           = Phase-1 calculator/* re-parented onto StandardPageLayout
       │                            (+ HowTo / MedicalWebPage)
       └─ RecordPageLayout         data-record-driven: header from a record + taxonomy related
            ├─ LocationPage        from data/locations  (+ LocalBusiness areaServed)
            └─ DrugPage            from data/drugs       (+ MedicalWebPage / Drug)
```

Content blocks (`src/components/content/`): `AuthorByline`, `SummaryBox` (reuse
`SummaryBlock`), `FAQ` (reuse, welded visible+schema), `Breadcrumbs` (reuse),
`RelatedPages`, `DecisionBox`, `SourcesList`, `Disclaimer`, `PageCTA`
(generalize `CalculatorCTA`), `ComparisonTable` (generalize `CalculatorComparison`).

## The contract — TypeScript interfaces

```ts
// ── Identity / E-E-A-T (records in src/data/authors.ts) ──────────────────────
interface Author {
  id: string;                         // 'rocco'
  name: string;                       // 'Rocco DeLuca'
  jobTitle: string;                   // 'Licensed Medicare Agent'
  role: 'author' | 'reviewer' | 'source' | 'contributor';
  url?: string;                       // bio/about page
  sameAs?: string[];                  // license lookup, Facebook, GBP
  credentials?: string[];             // 'NPN #…', 'AHIP certified 2026'
}

// ── SEO / head (fed straight into BaseLayout) ────────────────────────────────
interface PageMeta {
  title: string;
  description: string;
  canonical: string;                  // absolute, .html (URL policy, ADR-0002)
  ogTitle?: string;
  ogDescription?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  robots?: string;                    // default 'index, follow'
}

// ── Taxonomy (drives auto-related) ───────────────────────────────────────────
type SiloKey =
  | 'medicare-101' | 'enrollment' | 'medicare-advantage' | 'medigap'
  | 'part-d' | 'costs-irmaa' | 'providers' | 'local' | 'tools'
  | 'dual-eligible' | 'other-insurance' | 'trust';

interface Taxonomy {
  silo: SiloKey;                      // primary cluster (exactly one)
  tags?: string[];                    // cross-cutting topics
  pillar?: boolean;                   // hub/pillar page?
}

// ── Related (computed from taxonomy; override allowed) ───────────────────────
interface RelatedPage {
  href: string;
  label: string;
  blurb?: string;
  silo?: SiloKey;
}

// ── Contextual guidance block ────────────────────────────────────────────────
interface DecisionBox {
  condition: string;                  // "If you're turning 65 in the next 3 months…"
  guidance: string;                   // "…enroll during your Initial Enrollment Period."
  href?: string;                      // optional next step
  cta?: string;                       // optional link label
}

// ── CTA (defaults pull phone/quote from business.ts) ─────────────────────────
interface CTAConfig {
  heading?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

// ── Schema as composable modules ─────────────────────────────────────────────
type SchemaKind =
  | 'Article' | 'MedicalWebPage' | 'WebPage' | 'HowTo' | 'FAQPage'
  | 'BreadcrumbList' | 'Person' | 'Organization' | 'LocalBusiness'
  | 'WebSite' | 'Review' | 'Drug';

interface SchemaModule {
  kind: SchemaKind;
  build: (ctx: PageContext) => Record<string, unknown>;   // → one JSON-LD object
}

// ── THE master contract: one object per page ─────────────────────────────────
interface PageContext {
  meta: PageMeta;
  taxonomy: Taxonomy;

  // E-E-A-T (optional, supported from day one)
  author?: Author;                    // default: ROCCO (data/authors)
  reviewedBy?: Author;
  lastUpdated?: string;               // 'June 2026' or ISO
  sources?: { label: string; href: string }[];
  medicalDisclaimer?: boolean | string;
  localAvailability?: string;         // 'Available in Vernal & the Uintah Basin'

  // Structure
  breadcrumb?: Crumb[];               // Crumb from types/Location
  summary?: string;                   // AI-pullable TL;DR
  decisions?: DecisionBox[];
  faqs?: FAQItem[];                   // FAQItem from types/FAQ
  related?: RelatedPage[];            // omit → computed from taxonomy
  cta?: CTAConfig;

  // Schema
  schemaType?: Extract<SchemaKind, 'Article' | 'MedicalWebPage' | 'WebPage' | 'HowTo'>;
  schema?: SchemaModule[];            // extra/override modules; base set auto-derived
}
```

## Schema composition model
`lib/schema` exports one builder per `SchemaKind` (have: `faqPageSchema`,
`breadcrumbSchema`, `articleSchema`; add: `medicalWebPageSchema`, `personSchema`,
`organizationSchema`, `localBusinessSchema`, `websiteSchema`, `reviewSchema`,
`drugSchema`, `howToSchema`). A single `assembleSchema(ctx): object[]` **derives the
base set** from context — `schemaType` → Article/MedicalWebPage; `breadcrumb` →
BreadcrumbList; `faqs` → FAQPage; `author`/`reviewedBy` → Person — then appends any
`ctx.schema` overrides. `StandardPageLayout` passes the result to
`BaseLayout.schema`. No page hand-writes JSON-LD.

## Related-from-taxonomy model
`lib/related.relatedFor(taxonomy, index, limit = 4): RelatedPage[]` ranks by
same-silo then tag overlap. It reads a **page index** (`data/pageIndex.ts` now;
derived from content collections once Phase 4 lands). Pages declare `taxonomy`; the
framework computes "Related" — no manual lists to maintain.

## File layout (to build in Phase 2)
```
src/types/Page.ts            PageContext, PageMeta, Author, Taxonomy, RelatedPage,
                             DecisionBox, CTAConfig, SchemaKind, SchemaModule (+ barrel)
src/data/authors.ts          ROCCO (+ future reviewer / pharmacist / CMS source)
src/data/pageIndex.ts        registry for related-computation (interim)
src/lib/schema/*             + new builders; assembleSchema(ctx)
src/lib/related/*            relatedFor(...)
src/components/layout/        StandardPageLayout, ArticlePage, ComparisonPage,
                              RecordPageLayout, LocationPage, DrugPage
src/components/content/       AuthorByline, RelatedPages, DecisionBox, SourcesList,
                              Disclaimer, PageCTA, ComparisonTable (+ reuse FAQ/Summary/Breadcrumbs)
```

## Consequences
- Every page becomes **`PageContext` + body**; the 80% is centralized and tested once.
- Fixes audit bugs **centrally**: welded FAQ schema, breadcrumbs everywhere, author
  E-E-A-T, canonical correctness.
- Phase-2 work touches one Phase-1 component (re-parent `CalculatorLayout` onto
  `StandardPageLayout`) — additive, behind the gate, no existing page changed.
- Existing 47 pages are migrated onto the framework **later, one small commit each**
  (also ratchets the astro-check baseline down).

## Deferred / open
- `RecordPageLayout` vs. `DrugPage extends LocationPage` (proposed: shared parent).
- Page index now (`data/pageIndex.ts`) vs. waiting for content collections (Phase 4).
- `MedicalWebPage` vs `Article` default for health guides.
