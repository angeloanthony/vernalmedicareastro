// src/lib/seo — small SEO helpers built on the single source of truth.

import { BUSINESS } from '../../data/business';

/** Absolute canonical URL for a site-relative path (preserves the .html policy). */
export const canonical = (path: string): string => new URL(path, BUSINESS.url).href;

/** Append the brand suffix unless the title already contains it. */
export const titleWithBrand = (title: string): string =>
  title.includes(BUSINESS.name) ? title : `${title} | ${BUSINESS.name}`;

/** Absolute URL for an OG/social image path (or pass through an absolute URL). */
export const ogImageUrl = (path: string = BUSINESS.ogImage): string =>
  path.startsWith('http') ? path : new URL(path, BUSINESS.url).href;
