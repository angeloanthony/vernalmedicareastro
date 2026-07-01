// src/lib/schema — reusable JSON-LD builders. One place to generate the
// structured data Vernal currently hand-writes per page, so visible content and
// schema stay welded. Builders are pure (data in → plain object out).

import type { FAQItem } from '../../types/FAQ';
import type { Crumb } from '../../types/Location';

const stripTags = (html: string): string =>
  html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** FAQPage from FAQ items (answers may contain inline HTML; stripped for schema). */
export const faqPageSchema = (items: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: stripTags(f.question),
    acceptedAnswer: { '@type': 'Answer', text: stripTags(f.answer) },
  })),
});

/** BreadcrumbList from a trail of crumbs. */
export const breadcrumbSchema = (trail: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: c.href,
  })),
});

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

/** Article with optional author (E-E-A-T) + dates (freshness). */
export const articleSchema = (a: ArticleSchemaInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: a.headline,
  description: a.description,
  mainEntityOfPage: a.url,
  ...(a.datePublished ? { datePublished: a.datePublished } : {}),
  ...(a.dateModified ? { dateModified: a.dateModified } : {}),
  ...(a.authorName ? { author: { '@type': 'Person', name: a.authorName } } : {}),
});
