// src/pages/sitemap-es.xml.ts — GENERATED bilingual sitemap (Milestone 5).
//
// Emits dist/sitemap-es.xml at build time from the i18n registry
// (getLocalizedContent), so it can never drift from what's actually
// translated: every committed (es, page) pair gets a <url> entry with
// xhtml:link hreflang alternates (es + en + x-default). The hand-built
// English sitemaps in public/ remain authoritative for English URLs; the
// on-page <link rel="alternate"> tags carry the bidirectional signal.
// Registered in public/sitemap.xml (the static index).
//
// Deterministic: reads only committed content files; no dates, no API.
import { getLocalizedContent, SITE_ORIGIN } from '../i18n/content';

export function GET(): Response {
  const entries = getLocalizedContent().sort(
    (a, b) => a.locale.localeCompare(b.locale) || a.page.localeCompare(b.page),
  );

  const urls = entries
    .map(({ locale, page }) => {
      const localized = `${SITE_ORIGIN}/${locale}/${page}.html`;
      const master = `${SITE_ORIGIN}/${page}.html`;
      return [
        '  <url>',
        `    <loc>${localized}</loc>`,
        `    <xhtml:link rel="alternate" hreflang="${locale}" href="${localized}"/>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${master}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${master}"/>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
