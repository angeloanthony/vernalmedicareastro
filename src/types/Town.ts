// ---------------------------------------------------------------------------
// src/types/Town.ts — contract for one served community in the 'local' silo.
//
// Distilled from the two flagship migrations (Roosevelt, Duchesne, M12): the
// fields below are exactly what VARIES between town pages. Everything invariant
// (the MA/Medigap/Part D explainer, cost figures, enrollment windows, the
// marketing disclaimer) lives in the template, not here. Canonical data is in
// data/towns.ts; the template is pages/medicare-[town]-utah.astro.
//
// VERIFY BEFORE PUBLISH: zips, population, and pharmacies are local specifics —
// confirm them with the agent before a town page represents the business.
// ---------------------------------------------------------------------------

export interface TownFaq {
  question: string;
  answer: string;
}

export interface Town {
  /** URL slug → /medicare-<slug>-utah.html (matches the flagship convention). */
  slug: string;
  /** Display name, e.g. "Naples". */
  name: string;
  /** County the town sits in, e.g. "Uintah County". */
  county: string;
  /** Which end of the Uintah Basin — drives the primary hospital + office framing.
   *  'uintah' → Vernal side (Ashley Regional); 'duchesne' → Roosevelt side. */
  region: 'uintah' | 'duchesne';
  /** Primary regional hospital these residents use. */
  hospital: string;
  /** City the hospital is in. */
  hospitalCity: string;
  /** Human-readable distance/direction from the Vernal office. */
  distanceFromOffice: string;
  /** Nearby communities we also serve (for context + interlinking). */
  nearby: string[];
  /** One or two sentences: the page's unique local angle. */
  intro: string;
  /** Town-specific FAQ — keeps each page genuinely distinct (not a doorway page). */
  faqs: TownFaq[];
  /** OPTIONAL local specifics — rendered only when present (verify before publish). */
  zips?: string[];
  population?: number;
  pharmacies?: string[];
}
