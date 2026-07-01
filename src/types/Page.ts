// ---------------------------------------------------------------------------
// src/types/Page.ts — the Page Framework contract (ADR-0008)
//
// One PageContext object drives every page type (Article, Comparison, Calculator,
// Location, Drug). PageData is the portable content model; PageContext wraps it
// with identity/structure/schema. See docs/ADR/0008-page-framework.md.
// ---------------------------------------------------------------------------

import type { Crumb } from './Location';
import type { FAQItem } from './FAQ';

// ── Identity / E-E-A-T (records in data/authors.ts) ──────────────────────────
export interface Author {
  id: string;
  name: string;
  jobTitle: string;
  role: 'author' | 'reviewer' | 'source' | 'contributor';
  url?: string;
  sameAs?: string[];
  credentials?: string[];
}

/** Reference to an Author record (see data/authors.ts). Kept as a plain string
 *  in the contract to preserve the types←data layering; data/authors.ts exports
 *  `KnownAuthorId` (keyof typeof AUTHORS) for authoring-time safety. Pages carry
 *  the id; the schema engine resolves it to the full Author (no stale copies). */
export type AuthorId = string;

// ── Evidence: authoritative citations as first-class data ────────────────────
export interface Evidence {
  title: string;
  url: string;
  /** 'CMS' | 'Medicare.gov' | 'SSA' | 'IRS' | … */
  publisher: string;
  /** ISO publication/accessed date. */
  date?: string;
}

// ── Taxonomy (drives weighted related) ───────────────────────────────────────
export type SiloKey =
  | 'medicare-101'
  | 'enrollment'
  | 'medicare-advantage'
  | 'medigap'
  | 'part-d'
  | 'costs-irmaa'
  | 'providers'
  | 'local'
  | 'tools'
  | 'dual-eligible'
  | 'other-insurance'
  | 'trust';

export interface Taxonomy {
  silo: SiloKey;
  tags?: string[];
  pillar?: boolean;
}

// ── NextStep: contextual "what do I do now?" guidance ────────────────────────
export interface NextStep {
  when: string;
  action: string;
  href?: string;
  cta?: string;
}

// ── PageData: the portable content model (MDX / CMS / AI / calculators share it) ─
export interface PageData {
  title: string;
  description: string;
  taxonomy: Taxonomy;
  summary?: string;
  faqs?: FAQItem[];
  sources?: Evidence[];
  nextSteps?: NextStep[];
}

// ── PageMeta: head extras (title/description come from PageData) ──────────────
export interface PageMeta {
  /** Absolute .html canonical (ADR-0002). */
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  robots?: string;
}

export interface CTAConfig {
  heading?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

// ── Related: computed + scored; top 4 rendered ───────────────────────────────
export interface RelatedPage {
  href: string;
  label: string;
  blurb?: string;
  silo?: SiloKey;
  score?: number;
}

// ── Schema: composable; the LAYOUT picks the primary kind, never the author ──
export type SchemaKind =
  | 'Article'
  | 'MedicalWebPage'
  | 'WebPage'
  | 'HowTo'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'Person'
  | 'Organization'
  | 'LocalBusiness'
  | 'WebSite'
  | 'Review'
  | 'Drug';

export interface SchemaModule {
  kind: SchemaKind;
  build: (ctx: PageContext) => Record<string, unknown>;
}

// ── The master object: one per page ──────────────────────────────────────────
export interface PageContext {
  page: PageData;
  meta: PageMeta;
  // identity / E-E-A-T (optional, day one) — references, resolved by the schema engine
  author?: AuthorId;
  reviewedBy?: AuthorId;
  lastUpdated?: string;
  medicalDisclaimer?: boolean | string;
  localAvailability?: string;
  // structure
  breadcrumb?: Crumb[];
  /** Omit → computed (scored) from taxonomy. */
  related?: RelatedPage[];
  cta?: CTAConfig;
  /** Schema OVERRIDES only — primary kind + base set are set automatically. */
  schema?: SchemaModule[];
}
