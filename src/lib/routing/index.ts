// src/lib/routing — URL/slug helpers that encode Vernal's URL policy
// (build.format:'file' → every route is `/foo.html`, no trailing slash).

/** Kebab-case slug from arbitrary text. */
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Ensure a path uses the site's `.html` form (leaves "/", anchors, and
 *  already-suffixed paths untouched). */
export const htmlHref = (path: string): string => {
  if (path === '/' || path.endsWith('.html') || path.startsWith('#') || path.includes('://')) return path;
  return `${path.replace(/\/$/, '')}.html`;
};

/** Is `href` the current page? Normalizes "/" and "/index.html" to home. */
export const isActive = (current: string, href: string): boolean => {
  const norm = (p: string) => (p === '/' || p === '/index.html' ? '/' : '/' + p.replace(/^\//, ''));
  return norm(current) === norm(href);
};
