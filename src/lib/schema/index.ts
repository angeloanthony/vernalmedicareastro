// src/lib/schema — reusable JSON-LD builders + the schema assembler (ADR-0008).
// assembleSchema(ctx, primaryKind) derives the full structured-data set from a
// PageContext; the LAYOUT chooses the primary kind, the author never hand-writes
// JSON-LD. Output feeds BaseLayout's `schema` prop (each object = one <script>).

import type { FAQItem } from '../../types/FAQ';
import type { Crumb } from '../../types/Location';
import type { Author, AuthorId, Evidence, PageContext, SchemaKind } from '../../types/Page';
import { BUSINESS } from '../../data/business';
import { authorById } from '../../data/authors';

type Json = Record<string, unknown>;
const CTX = 'https://schema.org';

const stripTags = (html: string): string =>
  html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const abs = (path: string): string => (path.startsWith('http') ? path : new URL(path, BUSINESS.url).href);
const resolveAuthor = (id?: AuthorId): Author | undefined => (id ? authorById(id) : undefined);

// ── Standalone builders (each a complete, @context'd node) ───────────────────
export const faqPageSchema = (items: FAQItem[]): Json => ({
  '@context': CTX,
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: stripTags(f.question),
    acceptedAnswer: { '@type': 'Answer', text: stripTags(f.answer) },
  })),
});

export const breadcrumbSchema = (trail: Crumb[]): Json => ({
  '@context': CTX,
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: abs(c.href),
  })),
});

export const personSchema = (a: Author): Json => ({
  '@context': CTX,
  '@type': 'Person',
  ...(a.url ? { '@id': `${abs(a.url)}#person`, url: abs(a.url) } : {}),
  name: a.name,
  jobTitle: a.jobTitle,
  ...(a.sameAs ? { sameAs: a.sameAs } : {}),
  ...(a.credentials ? { knowsAbout: a.credentials } : {}),
});

export const organizationSchema = (): Json => ({
  '@context': CTX,
  '@type': 'Organization',
  '@id': `${BUSINESS.url}#org`,
  name: BUSINESS.name,
  url: BUSINESS.url,
  logo: { '@type': 'ImageObject', url: BUSINESS.logo },
  telephone: BUSINESS.phoneE164,
});

const citationOf = (e: Evidence): Json => ({
  '@type': 'CreativeWork',
  name: e.title,
  url: e.url,
  publisher: { '@type': 'Organization', name: e.publisher },
  ...(e.date ? { datePublished: e.date } : {}),
});

// Reference the standalone Person/Organization node by @id — no duplicate full
// entity, and the linked entity can't drift. Inline Person only as a fallback
// when there's no url to key an @id on.
const personRef = (a: Author): Json =>
  a.url ? { '@id': `${abs(a.url)}#person` } : { '@type': 'Person', name: a.name };

// Primary @type per page kind. LocalBusiness/Drug/Review/WebSite builders land
// with their page types (Location/Drug); until then those fall back to WebPage.
const PRIMARY_TYPE: Partial<Record<SchemaKind, string>> = {
  Article: 'Article',
  MedicalWebPage: 'MedicalWebPage',
  WebPage: 'WebPage',
  HowTo: 'HowTo',
};

function primaryEntity(ctx: PageContext, primary: SchemaKind): Json {
  const { page, meta } = ctx;
  const type = PRIMARY_TYPE[primary] ?? 'WebPage';
  const node: Json = {
    '@context': CTX,
    '@type': type,
    name: page.title,
    description: page.description,
    url: abs(meta.canonical),
    mainEntityOfPage: abs(meta.canonical),
    // i18n (M4 QA): page language — 'en' default, 'es' on localized routes.
    // The rest of the node localizes automatically because it builds from the
    // already-localized PageContext (headline, description, FAQ, breadcrumb).
    inLanguage: meta.lang ?? 'en',
  };
  if (type === 'Article' || type === 'MedicalWebPage') {
    node.headline = page.heading ?? page.title;
    node.publisher = { '@id': `${BUSINESS.url}#org` }; // → standalone Organization node
  }

  const author = resolveAuthor(ctx.author);
  if (author) node.author = personRef(author);
  const reviewer = resolveAuthor(ctx.reviewedBy);
  if (reviewer) {
    node.reviewedBy = personRef(reviewer);
    if (ctx.lastUpdated) node.lastReviewed = ctx.lastUpdated;
  }
  if (ctx.datePublished) node.datePublished = ctx.datePublished;
  if (ctx.lastUpdated) node.dateModified = ctx.lastUpdated;
  if (page.sources?.length) node.citation = page.sources.map(citationOf);
  return node;
}

/** Derive the full JSON-LD set for a page (primary + auto breadcrumb/FAQ/person/
 *  org + overrides). Returns objects for BaseLayout's `schema` prop. */
export function assembleSchema(ctx: PageContext, primary: SchemaKind): Json[] {
  const out: Json[] = [primaryEntity(ctx, primary)];
  if (ctx.breadcrumb?.length) out.push(breadcrumbSchema(ctx.breadcrumb));
  if (ctx.page.faqs?.length) out.push(faqPageSchema(ctx.page.faqs));

  const author = resolveAuthor(ctx.author);
  if (author) out.push(personSchema(author));
  const reviewer = resolveAuthor(ctx.reviewedBy);
  if (reviewer && reviewer.id !== author?.id) out.push(personSchema(reviewer));

  out.push(organizationSchema());
  if (ctx.schema) for (const m of ctx.schema) out.push(m.build(ctx));
  return out;
}
