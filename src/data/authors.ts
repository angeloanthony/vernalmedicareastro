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
  url: '/medicare-agent-vernal.html',
  sameAs: ['https://www.facebook.com/VernalMedicare'],
  credentials: [
    'Licensed Medicare insurance agent',
    'Local, independent — serving Vernal and the Uintah Basin',
  ],
};

export const AUTHORS: Record<string, Author> = {
  rocco: ROCCO,
};

/** The site's default author/reviewer until more roles exist. */
export const DEFAULT_AUTHOR = ROCCO;

export const authorById = (id: string): Author | undefined => AUTHORS[id];
