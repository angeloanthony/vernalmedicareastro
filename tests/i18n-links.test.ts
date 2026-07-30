// tests/i18n-links.test.ts — regression guard for localized internal links.
//
// A relative href does NOT "auto-upgrade" under /es/. The browser resolves it
// against /es/, so `medicare-glossary.html` on a Spanish page becomes
// /es/medicare-glossary.html — a 404 for every page that has no translation.
// That shipped: 20 broken links across the Spanish site, all pointing at
// untranslated pages.
//
// getPageContent() must therefore rewrite EVERY link it returns, whether it
// sits inside an HTML blob (`<a href="…">`) or is a bare link field
// ({ label, href: 'x.html' } / ctaHref / faqAllHref). Bare fields were the gap:
// localizeHtml only fires on strings containing `href="`.

import { describe, it, expect } from 'vitest';
import { localizeHref, localizeHtml, getPageContent, getAvailableLocales } from '../src/i18n/content';
import { CONTENT_PAGES } from '../src/i18n/content-pages';

const UNTRANSLATED = 'medicare-glossary'; // exists in EN only
const TRANSLATED = 'medigap'; // exists in EN + ES

describe('localizeHref', () => {
  it('sends an untranslated target to the English page, never to /es/', () => {
    expect(localizeHref(`${UNTRANSLATED}.html`, 'es')).toBe(`/${UNTRANSLATED}.html`);
    expect(localizeHref(`/${UNTRANSLATED}.html`, 'es')).toBe(`/${UNTRANSLATED}.html`);
  });

  it('keeps a translated target inside the locale', () => {
    expect(localizeHref(`${TRANSLATED}.html`, 'es')).toBe(`/es/${TRANSLATED}.html`);
  });

  it('maps the home link to the locale root', () => {
    expect(localizeHref('/', 'es')).toBe('/es.html');
  });

  it('leaves English untouched so master output cannot change', () => {
    expect(localizeHref(`${UNTRANSLATED}.html`, 'en')).toBe(`${UNTRANSLATED}.html`);
  });

  it('passes through external, tel, mailto and hash links', () => {
    for (const href of ['https://medicare.gov', 'tel:+14352195120', 'mailto:a@b.c', '#faq']) {
      expect(localizeHref(href, 'es')).toBe(href);
    }
  });

  it('does not rewrite asset paths', () => {
    expect(localizeHref('/pictures/rocco.webp', 'es')).toBe('/pictures/rocco.webp');
    expect(localizeHref('/pagefind/pagefind.js', 'es')).toBe('/pagefind/pagefind.js');
  });

  it('rewrites hrefs inside an HTML blob', () => {
    const html = `<a href="${UNTRANSLATED}.html">x</a> and <a href="${TRANSLATED}.html">y</a>`;
    expect(localizeHtml(html, 'es')).toBe(
      `<a href="/${UNTRANSLATED}.html">x</a> and <a href="/es/${TRANSLATED}.html">y</a>`,
    );
  });
});

/** Every string reachable from a content object, with the key that holds it. */
function walk(value: unknown, key: string | null, out: { key: string; value: string }[]): void {
  if (typeof value === 'string') {
    if (key) out.push({ key, value });
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) walk(v, key, out);
    return;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, k, out);
  }
}

describe('localized page content emits no locale-relative links', () => {
  const localized = CONTENT_PAGES.filter((p) => getAvailableLocales(p).includes('es'));

  it('covers the translated pages', () => {
    expect(localized.length).toBeGreaterThan(0);
  });

  for (const slug of localized) {
    it(`${slug}: every bare link field is absolute`, () => {
      const content = getPageContent<unknown>(slug, 'es');
      const strings: { key: string; value: string }[] = [];
      walk(content, null, strings);

      const offenders = strings
        .filter(({ key }) => /(href|url)$/i.test(key))
        .filter(({ value }) => value && !/^(https?:|tel:|mailto:|#|\/)/i.test(value));

      expect(offenders, `relative link field(s) in ${slug}: ${JSON.stringify(offenders)}`).toEqual([]);
    });

    it(`${slug}: every href inside HTML copy is absolute`, () => {
      const content = getPageContent<unknown>(slug, 'es');
      const strings: { key: string; value: string }[] = [];
      walk(content, null, strings);

      const offenders: string[] = [];
      for (const { value } of strings) {
        for (const m of value.matchAll(/href="([^"]*)"/g)) {
          const href = m[1];
          if (href && !/^(https?:|tel:|mailto:|#|\/)/i.test(href)) offenders.push(href);
        }
      }

      expect(offenders, `relative href(s) in ${slug}: ${offenders.join(', ')}`).toEqual([]);
    });
  }
});
