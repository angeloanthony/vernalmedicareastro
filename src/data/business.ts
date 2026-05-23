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
  ogImage: 'https://vernalmedicare.com/pictures/og-1200x630.jpg',

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

  // Third-party
  quoteUrl:
    'https://www.sunfirematrix.com/app/consumer/medicareadvocates/10569110/',
  facebookReviews: 'https://www.facebook.com/VernalMedicare/reviews',

  // Compliance disclaimer (must appear in footer on every page, verbatim)
  disclaimer:
    'Not connected with or endorsed by the U.S. government or the federal Medicare program. By calling this number, you will be connected to a licensed insurance agent/producer.',
} as const;

export type Business = typeof BUSINESS;
