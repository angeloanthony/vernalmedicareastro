// src/i18n/locales.ts — locale registry + pure URL helpers (Phase A.5).
//
// Master language is English at the root (/page.html); other locales are
// prefixed (/es/page.html). This file is data + pure functions only — safe to
// import from anywhere, including getStaticPaths' isolated prerender chunk.

export interface LocaleMeta {
  /** URL prefix + content directory name. */
  code: string;
  /** Native name, shown in the language switcher. */
  name: string;
  /** og:locale value. */
  ogLocale: string;
  /** hreflang attribute value. */
  hreflang: string;
}

export const LOCALES = [
  { code: 'en', name: 'English', ogLocale: 'en_US', hreflang: 'en' },
  { code: 'es', name: 'Español', ogLocale: 'es_US', hreflang: 'es' },
] as const satisfies readonly LocaleMeta[];

export const DEFAULT_LOCALE = 'en';
export type Locale = (typeof LOCALES)[number]['code'];

export function getLocaleMeta(code: string): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

/** First path segment → locale ("/es/x.html" → 'es'; "/x.html" → 'en').
 *  Strips a trailing .html so a future locale home at /es.html also parses. */
export function getLangFromUrl(url: URL): Locale {
  const seg = url.pathname.split('/').filter(Boolean)[0]?.replace(/\.html$/, '');
  const hit = LOCALES.find((l) => l.code === seg && l.code !== DEFAULT_LOCALE);
  return (hit?.code ?? DEFAULT_LOCALE) as Locale;
}

/** Content key for the current URL: locale prefix + .html stripped; "" → "index".
 *  ("/es/turning-65.html" → "turning-65", "/" → "index"). */
export function pageSlugFromUrl(url: URL): string {
  const segs = url.pathname.split('/').filter(Boolean);
  const first = segs[0]?.replace(/\.html$/, '');
  if (first && LOCALES.some((l) => l.code === first && l.code !== DEFAULT_LOCALE)) segs.shift();
  const rest = segs.join('/').replace(/\.html$/, '');
  return rest === '' ? 'index' : rest;
}

// ── UI-chrome dictionary (shared layout strings — NOT page body copy) ────────
// Page copy lives in src/i18n/content/{locale}/{page}.json; strings that the
// shared layouts render (headings, labels, aria, CTA defaults, …) live here,
// flat, with master fallback. Partial dictionaries per locale are fine.
// INVARIANT: every `en` value is byte-identical to the literal it replaced in
// the component — English output must not change (M3 chrome localization).
export const strings = {
  en: {
    'faq.heading': 'Frequently Asked Questions',
    'switcher.label': 'Language',
    'breadcrumb.aria': 'Breadcrumb',
    'summary.aria': 'Quick summary',
    // Byline (AuthorByline.astro)
    'byline.by': 'By',
    'byline.reviewedBy': 'Reviewed by',
    'byline.updated': 'Updated',
    'byline.editorial': 'How we keep this accurate',
    // Next steps (NextSteps.astro)
    'nextSteps.aria': 'Next steps',
    'nextSteps.learnMore': 'Learn more',
    // Sources / related
    'sources.heading': 'Sources',
    'sources.aria': 'Sources',
    'related.heading': 'Related',
    'related.aria': 'Related pages',
    'related.resourcesTitle': 'Related Resources',
    'related.explore': 'Explore More Resources',
    'faq.viewAll': 'View All FAQs',
    // CTA defaults (PageCTA.astro)
    'cta.heading': 'Talk to a local, licensed agent',
    'cta.text': '{agent} can walk you through your options — free, no pressure.',
    'cta.call': 'Call {phone}',
    'cta.quote': 'Get a Free Quote',
    // Disclaimers
    'disclaimer.medical':
      'This page is general information, not medical or financial advice. Confirm details for your own situation before acting.',
    'marketing.heading': 'Important Medicare Information',
    'marketing.aria': 'Important Medicare information',
    // Header
    'header.homeAria': 'Medicare Simplified — Home',
    'header.toggleAria': 'Toggle navigation',
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.email': 'Email:',
    'footer.phone': 'Phone:',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.resourcesAria': 'Medicare Resources',
    'footer.helpLabel': 'Medicare Help:',
  },
  es: {
    'faq.heading': 'Preguntas frecuentes',
    'switcher.label': 'Idioma',
    'breadcrumb.aria': 'Ruta de navegación',
    'summary.aria': 'Resumen rápido',
    'byline.by': 'Por',
    'byline.reviewedBy': 'Revisado por',
    'byline.updated': 'Actualizado en',
    'byline.editorial': 'Cómo mantenemos esta información precisa',
    'nextSteps.aria': 'Próximos pasos',
    'nextSteps.learnMore': 'Más información',
    'sources.heading': 'Fuentes',
    'sources.aria': 'Fuentes',
    'related.heading': 'Páginas relacionadas',
    'related.aria': 'Páginas relacionadas',
    'related.resourcesTitle': 'Recursos relacionados',
    'related.explore': 'Ver más recursos',
    'faq.viewAll': 'Ver todas las preguntas',
    'cta.heading': 'Hable con un agente local con licencia',
    'cta.text': '{agent} puede guiarlo por todas sus opciones — gratis, sin presión.',
    'cta.call': 'Llame al {phone}',
    'cta.quote': 'Obtenga una cotización gratuita',
    'disclaimer.medical':
      'Esta página es información general, no asesoramiento médico ni financiero. Confirme los detalles de su propia situación antes de actuar.',
    'marketing.heading': 'Información importante de Medicare',
    'marketing.aria': 'Información importante de Medicare',
    'header.homeAria': 'Medicare Simplified — Inicio',
    'header.toggleAria': 'Abrir o cerrar la navegación',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.email': 'Correo:',
    'footer.phone': 'Teléfono:',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.resourcesAria': 'Recursos de Medicare',
    'footer.helpLabel': 'Ayuda con Medicare:',
  },
} as const;

export type StringKey = keyof typeof strings.en;

/** Chrome-string translator with master fallback and {var} interpolation. */
export function t(
  key: StringKey,
  locale: string = DEFAULT_LOCALE,
  vars?: Record<string, string | number>,
): string {
  const dict = (strings as unknown as Record<string, Record<string, string>>)[locale];
  let s = dict?.[key] ?? strings.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

// ── Data-driven label translations ───────────────────────────────────────────
// Some chrome text is DATA, not a component literal: nav labels from
// config/navigation.ts, footer resource links, author job titles. Their
// authoritative source stays the data module (English); translations live
// here, keyed by the exact English string, with fallback to English.
// (Miss = English shown — never an error, matching the master-fallback rule.)
const LABELS: Record<string, Record<string, string>> = {
  es: {
    // Primary nav (config/navigation.ts, M44 hubs)
    'Home': 'Inicio',
    'Start Here': 'Empiece aquí',
    'Medicare Decision Center': 'Centro de Decisiones de Medicare',
    'Turning 65': 'Cumplir 65 años',
    'Working Past 65': 'Trabajar después de los 65',
    'Financial Assistance': 'Ayuda financiera',
    'Plans': 'Planes',
    'Medicare Advantage': 'Medicare Advantage',
    'Medigap (Supplement)': 'Medigap (Suplemento)',
    'Part D Drug Plans': 'Planes de la Parte D',
    'Compare Plans': 'Comparar planes',
    'Coverage': 'Cobertura',
    'Services Coverage': 'Cobertura de servicios',
    'Drug Coverage': 'Cobertura de medicamentos',
    'Medicare Costs': 'Costos de Medicare',
    'IRMAA': 'IRMAA',
    'Learn': 'Aprenda',
    'Medicare Help Center': 'Centro de Ayuda de Medicare',
    'Calculators': 'Calculadoras',
    'Glossary': 'Glosario',
    'News': 'Noticias',
    'FAQ': 'Preguntas frecuentes',
    'Search': 'Buscar',
    'Locations': 'Ubicaciones',
    'Vernal': 'Vernal',
    'Roosevelt': 'Roosevelt',
    'Duchesne': 'Duchesne',
    'Uintah County': 'Condado de Uintah',
    'Contact': 'Contacto',
    'Schedule a Free Review': 'Agende una revisión gratuita',
    'Reviews': 'Reseñas',
    'About': 'Sobre nosotros',
    'Other Insurance': 'Otros seguros',
    'Under-65 Health Insurance': 'Seguro de salud para menores de 65',
    'Copay Coverage': 'Cobertura de copagos',
    'Life Insurance': 'Seguro de vida',
    // Footer resource links (Footer.astro)
    'Help Center': 'Centro de Ayuda',
    'Help Paying': 'Ayuda para pagar',
    'Local Help': 'Ayuda local',
    'About Rocco': 'Sobre Rocco',
    'Part D': 'Parte D',
    'Enrollment': 'Inscripción',
    // Author job titles (data/authors.ts)
    'Licensed Medicare Insurance Agent': 'Agente de seguros de Medicare con licencia',
  },
};

/** Translate a data-driven label (nav item, footer link, job title) for a
 *  locale; returns the English label unchanged when no translation exists. */
export function localizeLabel(label: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) return label;
  return LABELS[locale]?.[label] ?? label;
}
