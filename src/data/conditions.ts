// ---------------------------------------------------------------------------
// src/data/conditions.ts  —  clinical condition taxonomy for drug content
//
// The condition keys that tie drugs, manufacturer programs, and nonprofit
// disease funds together (data/drugs.ts reads these). One source of truth so
// the condition-based "Drug Coverage → Diabetes / Heart / Cancer / Autoimmune"
// navigation stays consistent as the drug database grows.
//
// The Condition shape is defined in types/Condition.ts; ConditionKey is derived
// from the data below so the union can never drift from CONDITIONS.
//
// Provenance: ported from the AltaMedicare data layer (drugAssistance.ts).
// ---------------------------------------------------------------------------

import type { Condition } from '../types/Condition';

export const CONDITIONS: Condition[] = [
  { key: 'cancer', label: 'Cancer' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'heart', label: 'Heart & cardiovascular' },
  { key: 'blood-clots', label: 'Blood clots / AFib' },
  { key: 'cholesterol', label: 'High cholesterol' },
  { key: 'autoimmune', label: "Autoimmune (RA, Crohn's, psoriasis)" },
  { key: 'respiratory', label: 'Asthma / COPD / lung' },
  { key: 'kidney', label: 'Kidney disease' },
  { key: 'hiv', label: 'HIV' },
  { key: 'bone', label: 'Bone / osteoporosis' },
];

/** Condition key values, e.g. 'diabetes' | 'heart' — derived from CONDITIONS. */
export type ConditionKey = (typeof CONDITIONS)[number]['key'];

/** Human label for a condition key (falls back to the raw key). */
export const condLabel = (key: string): string =>
  CONDITIONS.find((c) => c.key === key)?.label ?? key;

export type { Condition } from '../types/Condition';
