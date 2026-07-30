// tests/page-registry.test.ts — THE registry invariant.
//
//   If a page exists, it exists in pageIndex.ts.
//
// This is the assumption the whole SEO engine rests on: pageIndex.ts is the
// only canonical inventory, so a page missing from it is invisible to the
// Related engine, to every generated report, and to the priority queue. It does
// not show up as an error anywhere — it simply never appears. That is the worst
// kind of bug, so it gets a permanent test.
//
// Runs against SOURCE, not dist/, so it fails in CI without needing a build.
// Dynamic routes ([town], [drug], [...path]) are expanded inside pageIndex.ts
// from the same data modules that generate them, so they cannot drift and are
// not checked here.

import { describe, it, expect } from 'vitest';
import { PAGE_INDEX } from '../src/data/pageIndex';

/**
 * Routes that are deliberately NOT content and must stay out of the registry.
 * Adding to this list is a deliberate editorial decision, not a shortcut —
 * every entry needs a reason that survives review.
 */
const EXEMPT: Record<string, string> = {
  '/404.html': 'error page — never indexed, has no taxonomy',
  '/medicare-search.html': 'search UI, not content',
  '/privacy.html': 'legal boilerplate — no topical taxonomy',
  '/terms.html': 'legal boilerplate — no topical taxonomy',
};

// Enumerated with import.meta.glob rather than node:fs — the project has no
// @types/node, and this is the same mechanism src/i18n/content.ts already uses
// to read committed files. Keys look like '../src/pages/about.astro'.
const routeFiles = import.meta.glob('../src/pages/**/*.astro');

function staticRoutes(): string[] {
  return Object.keys(routeFiles)
    .map((k) => k.replace('../src/pages/', '').replace(/\.astro$/, ''))
    .filter((slug) => !slug.includes('[')) // dynamic route — expanded in pageIndex
    .map((slug) => (slug === 'index' ? '/' : `/${slug}.html`));
}

describe('registry invariant: every page exists in pageIndex.ts', () => {
  const routes = staticRoutes();
  const registered = new Set(PAGE_INDEX.map((e) => e.href));

  it('finds the static routes', () => {
    expect(routes.length).toBeGreaterThan(50);
  });

  it('has no page outside the registry', () => {
    const missing = routes.filter((r) => !registered.has(r) && !(r in EXEMPT));
    expect(
      missing,
      `These pages exist but are not in src/data/pageIndex.ts, so the SEO engine ` +
        `cannot see them:\n  ${missing.join('\n  ')}\n` +
        `Register each one, or add it to EXEMPT in this test with a reason.`,
    ).toEqual([]);
  });

  it('keeps exempt routes OUT of the registry', () => {
    const wrongly = Object.keys(EXEMPT).filter((r) => registered.has(r));
    expect(
      wrongly,
      `Exempt (non-content) routes must not be registered: ${wrongly.join(', ')}`,
    ).toEqual([]);
  });

  it('has no dead entry pointing at a static route that does not exist', () => {
    // Only static hrefs are checkable here; data-generated hrefs are expanded
    // from the same modules that build them.
    const routeSet = new Set(routes);
    const dataGenerated = /^\/(medicare-news|medicare-coverage)\//;
    const dead = PAGE_INDEX.map((e) => e.href)
      .filter((h) => !routeSet.has(h))
      .filter((h) => !dataGenerated.test(h))
      // Anything left is presumed data-generated only if a template could emit it.
      .filter((h) => !/-utah\.html$|-assistance-program\.html$|^\/does-medicare-cover-/.test(h));
    expect(dead, `Registry entries with no matching route: ${dead.join(', ')}`).toEqual([]);
  });

  it('has no duplicate hrefs', () => {
    const seen = new Set<string>();
    const dupes = PAGE_INDEX.map((e) => e.href).filter((h) => !seen.add(h) && true);
    expect(dupes).toEqual([]);
  });

  it('gives every entry a silo and a title', () => {
    const broken = PAGE_INDEX.filter((e) => !e.title?.trim() || !e.taxonomy?.silo?.trim()).map(
      (e) => e.href,
    );
    expect(broken, `Entries missing a title or silo: ${broken.join(', ')}`).toEqual([]);
  });
});
