// ---------------------------------------------------------------------------
// src/data/business.ts  —  SINGLE SOURCE OF TRUTH  (Runbook Part 3)
//
// Every page, every LocalBusiness/Article schema block, every footer and
// header imports from this one object. Change the phone number here once and
// it updates on all 47 pages. A NAP/pricing mismatch becomes impossible —
// which is exactly the reliability signal AI systems reward.
//
// Values below are lifted VERBATIM from the existing site's JSON-LD and
// markup so nothing changes character-for-character on launch.
// ---------------------------------------------------------------------------

export const BUSINESS = {
  name: 'Vernal Medicare',
  legalAgent: 'Rocco DeLuca',
  url: 'https://vernalmedicare.com/',
  logo: 'https://vernalmedicare.com/pictures/Rocco.webp',
  image: 'https://vernalmedicare.com/pictures/vernalmedicare.webp',
  ogImage: 'https://vernalmedicare.com/pictures/opengraph.webp',

  // Contact
  phone: '435-219-5120',
  phoneE164: '+1-435-219-5120',
  phoneTel: '+14352195120',
  tty: '711',
  email: 'rocco@vernalmedicare.com',

  // Address — inside Smith's Pharmacy
  street: '1080 W Hwy 40',
  city: 'Vernal',
  region: 'UT',
  postal: '84078',
  country: 'US',
  containedInPlace: "Smith's Pharmacy",

  // Geo (from existing schema)
  geo: { lat: 40.4527277, lng: -109.5478186 },

  // Hours (from existing schema: Mon–Fri 13:00–17:00)
  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '13:00',
    closes: '17:00',
    humanReadable: 'Mon–Fri 1pm–5pm, Sat by appointment',
  },

  // Service area
  areaServed: ['Vernal', 'Naples', 'Maeser', 'Jensen'],
  county: 'Uintah County',

  // Verification tokens (carried over verbatim)
  googleSiteVerification: '7TnQ_J9i53PFlwcNw1vzvpyX_9giOLNRbT79H7t6-jA',
  bingVerification: '9FFF1C773C117D326057A0D65ABA9ABD',

  // Analytics
  gaId: 'G-NW6ENB89NF',
  // Always-on sitewide GA4 property: fires on EVERY page regardless of the
  // per-page `gaIds` override (which controls the additional property tags).
  gaGlobalId: 'G-NBXPYV4X2Q',

  // Third-party
  quoteUrl:
    'https://www.sunfirematrix.com/app/consumer/medicareadvocates/10569110/',
  facebookReviews: 'https://www.facebook.com/VernalMedicare/reviews',
  // Google Business Profile reviews — direct link to the profile.
  googleReviews:
    'https://www.google.com/maps/place/vernalmedicare.com/data=!4m2!3m1!1s0x0:0x6dd77439aee69843?sa=X&ved=1t:2428&ictx=111',

  // Compliance disclaimer (must appear in footer on every page, verbatim)
  disclaimer:
    'Not connected with or endorsed by the U.S. government or the federal Medicare program. By calling this number, you will be connected to a licensed insurance agent/producer.',

  // CMS multi-plan marketing disclaimer — required (verbatim) on any page that
  // markets specific Medicare Advantage / Part D plans. Rendered by
  // MarketingDisclaimer.astro; the TPMO `disclaimer` above covers the rest.
  marketingDisclaimer: {
    multiPlan:
      'We do not offer every plan available in your area. Any information we provide is limited to those plans we do offer in your area. Please contact Medicare.gov or 1-800-MEDICARE (TTY: 711), 24 hours a day, 7 days a week, to get information on all of your options.',
    representative:
      'Vernal Medicare is a licensed and certified representative of Medicare Advantage organizations and stand-alone prescription drug plans. Each of the organizations we represent has a Medicare contract. Enrollment in any plan depends on contract renewal.',
  },

  // ── i18n (M3) — compliance text per locale ─────────────────────────────────
  // Compliance copy is NEVER machine-translated: these are the CMS-published
  // Spanish wordings of the required TPMO / multi-plan disclaimers (the same
  // text beneficiaries see in CMS's own Spanish materials), kept HERE — next
  // to their English source of truth — not in the t() dictionary. Access via
  // businessDisclaimers(locale) below; English is the fallback.
  i18n: {
    es: {
      disclaimer:
        'No estamos conectados ni respaldados por el gobierno de los Estados Unidos ni por el programa federal de Medicare. Al llamar a este número, será conectado con un agente/productor de seguros con licencia.',
      marketingDisclaimer: {
        multiPlan:
          'No ofrecemos todos los planes disponibles en su área. Cualquier información que proporcionemos se limita a los planes que ofrecemos en su área. Comuníquese con Medicare.gov o llame al 1-800-MEDICARE (TTY: 711), las 24 horas del día, los 7 días de la semana, para obtener información sobre todas sus opciones.',
        representative:
          'Vernal Medicare es un representante con licencia y certificado de organizaciones Medicare Advantage y de planes independientes de medicamentos recetados. Cada una de las organizaciones que representamos tiene un contrato con Medicare. La inscripción en cualquier plan depende de la renovación del contrato.',
      },
    },
  },
} as const;

export type Business = typeof BUSINESS;

/** Locale-aware compliance text (TPMO + multi-plan) with English fallback. */
export function businessDisclaimers(locale: string): {
  disclaimer: string;
  multiPlan: string;
  representative: string;
} {
  const loc =
    locale !== 'en' ? BUSINESS.i18n[locale as keyof typeof BUSINESS.i18n] : undefined;
  return {
    disclaimer: loc?.disclaimer ?? BUSINESS.disclaimer,
    multiPlan: loc?.marketingDisclaimer.multiPlan ?? BUSINESS.marketingDisclaimer.multiPlan,
    representative:
      loc?.marketingDisclaimer.representative ?? BUSINESS.marketingDisclaimer.representative,
  };
}
