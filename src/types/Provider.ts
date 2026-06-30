// ---------------------------------------------------------------------------
// src/types/Provider.ts  —  shared contract for local providers
//
// FORWARD-LOOKING (Phase 5). Hospitals, pharmacies, and clinics that power the
// provider pages and the location → provider cross-links. Canonical data in
// data/providers.ts (e.g. Ashley Regional, UBMC, Smith's Pharmacy).
// ---------------------------------------------------------------------------

export type ProviderType = 'hospital' | 'pharmacy' | 'clinic';

export interface Provider {
  name: string;
  type: ProviderType;
  /** Primary city, e.g. 'Vernal'. */
  city: string;
  county?: string;
  address?: string;
  url?: string;
}
