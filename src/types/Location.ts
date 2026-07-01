// ---------------------------------------------------------------------------
// src/types/Location.ts  —  shared contracts for the location engine
//
// FORWARD-LOOKING (Phase 5). A `Place` is a state, county, or city; the
// location components render hub + sub-pages from these. Framework helpers live
// in data/locations.ts; canonical place data in data/counties.ts & data/cities.ts.
// Seeded with the Uintah Basin first (local-first), expanded later.
// ---------------------------------------------------------------------------

export type PlaceKind = 'state' | 'county' | 'city';

export interface Place {
  /** Display name, e.g. 'Uintah County' or 'Vernal'. */
  name: string;
  /** Path under root (no leading slash, no .html). */
  slug: string;
  kind: PlaceKind;
  /** Parent place slug (county→state, city→county), drives breadcrumb up-links. */
  parentSlug?: string;
  /** Convenience: the state name for breadcrumbs. */
  stateName?: string;
}

export interface Crumb {
  name: string;
  href: string;
}
