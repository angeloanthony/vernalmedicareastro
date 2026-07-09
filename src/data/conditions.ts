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

/** Presentation only — icon + accent color per condition, shared by the drug
 *  assistance hub and individual drug pages. Falls back to FALLBACK_STYLE for
 *  any condition not listed here. */
export const CONDITION_STYLE: Partial<Record<ConditionKey, { color: string; tint: string; icon: string }>> = {
  heart: {
    color: '#dc2626', tint: '#fde8e8',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S4.5 15.2 4.5 9.7A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.7C19.5 15.2 12 20.5 12 20.5z"/></svg>',
  },
  'blood-clots': {
    color: '#e11d48', tint: '#fde7ec',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5c3 4 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-7 6-11z"/></svg>',
  },
  diabetes: {
    color: '#d97706', tint: '#fef3e2',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M14.6 9a2.7 2.7 0 0 0-2.6-1.6c-1.5 0-2.5.8-2.5 1.9 0 2.5 5 1.4 5 4 0 1.1-1 2-2.6 2A2.8 2.8 0 0 1 9.2 15"/></svg>',
  },
  cholesterol: {
    color: '#ea580c', tint: '#fdeadd',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v4l2.6 1.6"/></svg>',
  },
  autoimmune: {
    color: '#16a34a', tint: '#e4f5ea',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  },
  respiratory: {
    color: '#7c3aed', tint: '#f0e9fd',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v6.5C9 12 7 13 6 15c-1.2 2.4-.3 5.5 2 5.5 2.8 0 3-3 3-5.5V9"/><path d="M15 3v6.5c0 2.5 2 3.5 3 5.5 1.2 2.4.3 5.5-2 5.5-2.8 0-3-3-3-5.5V9"/><path d="M9 9h6"/></svg>',
  },
  kidney: {
    color: '#2563eb', tint: '#e5edfe',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4c-3 0-4.5 3-4.5 7.5S6 20 9.5 20c1.6 0 2-1.3 1.8-3-.3-2 .2-3.3 1.7-3.3s2 1.3 1.7 3.3c-.2 1.7.2 3 1.8 3 3.5 0 4.5-4 4.5-8.5S18 4 15 4c-2 0-2.6 1.6-3 3-.4-1.4-1-3-3-3z"/></svg>',
  },
  cancer: {
    color: '#0d9488', tint: '#d7f0ec',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M18.4 5.6l-2.5 2.5M8.1 15.9l-2.5 2.5"/></svg>',
  },
  hiv: {
    color: '#0891b2', tint: '#d7f0f5',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.4 9.3a2.6 2.6 0 0 1 4.7 1.4c0 1.7-2.1 2.1-2.1 3.6"/><circle cx="12" cy="17.1" r="0.6" fill="currentColor" stroke="none"/></svg>',
  },
  bone: {
    color: '#64748b', tint: '#eef1f5',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5c1 1 1 2.5 0 3.5l4 4c1-1 2.5-1 3.5 0a2.5 2.5 0 1 0 3.5-3.5c-1-1-2.5-1-3.5 0l-4-4c1-1 1-2.5 0-3.5a2.5 2.5 0 1 0-3.5 3.5z"/></svg>',
  },
};

/** Style for a condition not covered by CONDITION_STYLE. */
export const FALLBACK_CONDITION_STYLE = {
  color: '#475569', tint: '#eef1f5',
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.6" y="8.4" width="18.8" height="7.2" rx="3.6" transform="rotate(-45 12 12)"/><path d="M8.7 8.7l6.6 6.6"/></svg>',
};

export type { Condition } from '../types/Condition';
