// src/config/seo.ts — default SEO/meta settings (verification tokens, card type,
// default image). Tokens come from business.ts so there's one source.

import { BUSINESS } from '../data/business';

export const SEO = {
  twitterCard: 'summary_large_image',
  defaultOgImage: BUSINESS.ogImage,
  googleSiteVerification: BUSINESS.googleSiteVerification,
  bingVerification: BUSINESS.bingVerification,
  robots: 'index, follow',
} as const;
