// ---------------------------------------------------------------------------
// src/data/locations.ts  —  location framework  (SCAFFOLD)
//
// Reusable helpers for the hub → county → city page system (ported in concept
// from Alta's places.ts). The framework is defined now; actual Place data is
// seeded in counties.ts / cities.ts in Phase 5, Uintah Basin first (local-first
// per the locked positioning decision). No page consumes this yet.
//
// Type: types/Location.ts.
// ---------------------------------------------------------------------------

import type { Place, Crumb } from '../types/Location';

/** Every published location (state + counties + cities). Seeded in Phase 5. */
export const PLACES: Place[] = [];

/** Hub URL for a place, e.g. "/uintah-county.html". */
export const hubHref = (p: Place): string => `/${p.slug}.html`;

/** Sub-page URL, e.g. "/uintah-county/medicare-advantage.html". */
export const pageHref = (
  p: Place,
  type: 'medicare-advantage' | 'medicare-supplement' | 'part-d',
): string => `/${p.slug}/${type}.html`;

/** Parent hub URL for a place (city→county, county→state), else null. */
export const parentHub = (p: Place): string | null =>
  p.parentSlug ? `/${p.parentSlug}.html` : null;

/** Breadcrumb trail for a location page. `leaf` is the current sub-page (omit on
 *  the hub page itself). */
export function trail(place: Place, leaf?: Crumb): Crumb[] {
  const crumbs: Crumb[] = [{ name: 'Home', href: '/' }];
  const parent = parentHub(place);
  if (parent && place.stateName) {
    crumbs.push({ name: `Medicare in ${place.stateName}`, href: parent });
  }
  crumbs.push({ name: `Medicare in ${place.name}`, href: hubHref(place) });
  if (leaf) crumbs.push(leaf);
  return crumbs;
}
