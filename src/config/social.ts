// src/config/social.ts — social profiles + the sameAs array for entity schema.

import { BUSINESS } from '../data/business';

export const SOCIAL = {
  facebook: 'https://www.facebook.com/VernalMedicare',
  facebookReviews: BUSINESS.facebookReviews,
} as const;

/** sameAs links for Organization / LocalBusiness / Person schema (E-E-A-T). */
export const SAME_AS: string[] = [SOCIAL.facebook];
