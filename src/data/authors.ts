// ---------------------------------------------------------------------------
// src/data/authors.ts — author entities for E-E-A-T (ADR-0008)
//
// Authors are content, not config. Name comes from business.ts (single source);
// the byline + Person schema render from these records. Expand with a medical
// reviewer, pharmacist, or CMS source as those roles are added.
// ---------------------------------------------------------------------------

import type { Author } from '../types/Page';
import { BUSINESS } from './business';

export const ROCCO: Author = {
  id: 'rocco',
  name: BUSINESS.legalAgent, // 'Rocco DeLuca'
  jobTitle: 'Licensed Medicare Insurance Agent',
  role: 'author',
  url: '/about.html', // canonical bio / "Meet Rocco" (E-E-A-T anchor)
  sameAs: ['https://www.facebook.com/VernalMedicare'],
  // True, general statements (no unverified specifics). Rocco can add his
  // license #, NPN, and specific carrier appointments on the credentials page.
  credentials: [
    'Licensed Medicare insurance agent (Utah)',
    'Completes annual AHIP Medicare certification',
    'Carrier-certified before offering any Medicare Advantage or Part D plan',
    'Local & independent — serving Vernal and the Uintah Basin',
  ],
};

export const AUTHORS = {
  rocco: ROCCO,
} satisfies Record<string, Author>;

/** Stricter id type for authoring-time safety within the data/UI layers.
 *  (PageContext uses the generic string `AuthorId` to keep types←data one-way.) */
export type KnownAuthorId = keyof typeof AUTHORS;

/** The site's default author/reviewer until more roles exist. */
export const DEFAULT_AUTHOR = ROCCO;

export const authorById = (id: string): Author | undefined =>
  (AUTHORS as Record<string, Author>)[id];
