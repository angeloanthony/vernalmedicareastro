// src/config/site.ts — site-level presentation/SEO settings.
// NAP/brand identity lives in src/data/business.ts; this composes from it for
// site-meta concerns (titles, locale, defaults). No identity is duplicated.

import { BUSINESS } from '../data/business';

export const SITE = {
  name: BUSINESS.name,
  url: BUSINESS.url,
  locale: 'en_US',
  defaultDescription:
    'Local, licensed Medicare help in Vernal and the Uintah Basin. Compare Medicare Advantage, Medigap, and Part D with a local agent.',
  defaultOgImage: BUSINESS.ogImage,
  /** Brand-suffixed title (unless already branded). */
  titleTemplate: (t: string): string => (t.includes(BUSINESS.name) ? t : `${t} | ${BUSINESS.name}`),
} as const;
