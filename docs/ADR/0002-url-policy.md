# ADR-0002 — URL policy: preserve every `.html` URL

**Status:** Accepted (inherited from the original migration) · 2026-06-30

## Context
Vernal's live pages rank at `/[slug].html`. The site's entire SEO value is tied to
these exact URLs. Any change risks losing rankings and requires 301s.

## Decision
Preserve every existing URL **exactly**. `astro.config.mjs` sets
`build.format: 'file'` (emits `foo.html`, not `foo/index.html`) and
`trailingSlash: 'never'`. Route filenames mirror the legacy slugs. **No redirects.**
The production build must keep emitting the **same route set** (currently 47 pages);
the verify gate guards the build.

## Alternatives rejected
- **Clean `/foo/` folder URLs.** Rejected: would require a 301 for every page and
  risk ranking loss for purely cosmetic gain.

## Consequences
- New routing helpers encode this (`src/lib/routing.htmlHref`).
- A URL change requires its own explicit ADR + GSC-aware plan; it never rides
  along in another change.
- "47 pages, URLs unchanged" is the standing invariant reported by `verify`.
