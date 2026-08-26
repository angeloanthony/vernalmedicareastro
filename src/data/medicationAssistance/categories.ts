// ---------------------------------------------------------------------------
// src/data/medicationAssistance/categories.ts — the Prescription Assistance
// directory taxonomy (docs/PRESCRIPTION-ASSISTANCE-PROJECT.md §14).
//
// RETIRED AS A RECORD-LEVEL TAXONOMY (2026-08-26). These are now DERIVED VIEWS
// over the two canonical axes — `conditions` (data/conditions.ts) and
// `drugClass` (drugClasses.ts). A record is never tagged with a category; call
// categoriesFor() instead. See docs/PRESCRIPTION-ASSISTANCE-TAXONOMY-AUDIT.md.
//
// Why: the old list mixed the two axes (Diabetes and Cholesterol are
// conditions; Blood Thinners, Biologics and GLP-1 are drug classes), so a
// record had to be tagged twice with overlapping keys — 'diabetes' and 'heart'
// existed in both lists and were duplicated in every taxonomy tag array.
//
// The autoimmune view was promoted from PENDING_CATEGORY_VIEWS on 2026-08-26
// (project §31 D7): it is a view over the existing `autoimmune` condition key,
// so the five legacy autoimmune pages no longer fall to the fallback view.
//
// Presentation only. A medication may appear in several views, but it has
// exactly one canonical page. Category HUB pages are not built yet — their URL
// pattern is an open project question (spec §31 #3) — so this list drives the
// directory grouping and the on-page category kicker, nothing else.
// ---------------------------------------------------------------------------

import type {
  AssistanceCategory,
  AssistanceCategoryKey,
  TaxonomySubject,
} from '../../types/MedicationAssistance';

/** Canonical view order — categoriesFor() returns matches in this order, so the
 *  first match is the medication's primary category. Ordered SPECIFIC BEFORE
 *  GENERAL: a precise view ('Blood Thinners', 'Cholesterol') leads and the broad
 *  cardiovascular view ('Heart & Blood Pressure') comes last before the
 *  fallback, so Eliquis reads "Blood Thinners · Heart & Blood Pressure" rather
 *  than the reverse. Changing this order changes the on-page category kicker. */
export const ASSISTANCE_CATEGORIES: AssistanceCategory[] = [
  {
    key: 'diabetes',
    label: 'Diabetes & Blood Sugar',
    blurb: 'SGLT2 inhibitors, GLP-1s, DPP-4s and insulins for type 2 diabetes.',
    conditions: ['diabetes'],
    drugClass: ['insulin'],
  },
  {
    key: 'blood-thinners',
    label: 'Blood Thinners',
    blurb: 'Anticoagulants and antiplatelets for AFib, clots and stroke prevention.',
    drugClass: ['anticoagulant', 'antiplatelet'],
  },
  {
    key: 'cholesterol',
    label: 'Cholesterol',
    blurb: 'PCSK9 inhibitors and other lipid-lowering brands.',
    conditions: ['cholesterol'],
    drugClass: ['pcsk9'],
  },
  {
    key: 'glp-1',
    label: 'Weight Management / GLP-1',
    blurb:
      'GLP-1 and GIP/GLP-1 medicines. Medicare Part D covers these for diabetes, not weight loss.',
    drugClass: ['glp-1'],
  },
  {
    // Approved 2026-08-26 (project §31 D7). A browse view over the existing
    // `autoimmune` CONDITIONS key — no new axis, no change to CONDITIONS.
    // Sits before 'copd-asthma' so Dupixent (autoimmune + respiratory) leads
    // with the immune view rather than reading as an inhaler, and before
    // 'biologics' (moved 2026-08-26, Batch 3) so Humira, Enbrel and Skyrizi —
    // the first records to carry the 'biologic' class — lead with what the
    // patient has rather than with what the molecule is.
    key: 'autoimmune',
    label: 'Autoimmune & Immune Conditions',
    blurb: "Biologics and JAK inhibitors for rheumatoid arthritis, psoriasis, Crohn's, eczema and related conditions.",
    conditions: ['autoimmune'],
    drugClass: ['jak-inhibitor'],
  },
  {
    // Blurb widened 2026-08-26 (Batch 3): this is a drug-class view over
    // 'biologic', and it now also holds three autoimmune biologics, so naming
    // only respiratory and allergic conditions described the wrong set.
    key: 'biologics',
    label: 'Biologics',
    blurb: 'Injected and infused biologics — for autoimmune conditions, asthma, COPD and allergic disease.',
    drugClass: ['biologic'],
  },
  {
    key: 'copd-asthma',
    label: 'COPD & Asthma',
    blurb: 'Maintenance inhalers.',
    conditions: ['respiratory'],
  },
  {
    key: 'heart',
    label: 'Heart & Blood Pressure',
    blurb: 'Heart failure and cardiovascular medications.',
    conditions: ['heart'],
  },
  {
    key: 'specialty',
    label: 'Specialty & Other',
    blurb: 'Everything else in the directory.',
    fallback: true,
  },
];

/**
 * Views kept as concepts but NOT yet matchable, because the axes cannot express
 * them today. Recorded rather than deleted so the reason survives (spec §14
 * lists them); each needs a decision before it can become a live view.
 */
export const PENDING_CATEGORY_VIEWS: { key: string; label: string; needs: string }[] = [
  {
    key: 'lung-disease',
    label: 'Lung Disease',
    needs:
      'A condition key for pulmonary fibrosis / interstitial lung disease. Today the only lung key is `respiratory`, which would wrongly pull every COPD and asthma inhaler into this view. Decide when Ofev is researched — adding a CONDITIONS key also changes which nonprofit funds programsForDrug() matches.',
  },
];

const BY_KEY = new Map(ASSISTANCE_CATEGORIES.map((c) => [c.key, c]));

export const categoryLabel = (key: AssistanceCategoryKey): string => BY_KEY.get(key)?.label ?? key;

/**
 * Derive a medication's browse categories from the two canonical axes. Returns
 * matches in canonical view order (first = primary), or the fallback view when
 * nothing matches. Accepts anything carrying the axes — a researched record, or
 * a legacy `Drug` from data/drugs.ts that has `conditions` only.
 */
export function categoriesFor(subject: TaxonomySubject): AssistanceCategoryKey[] {
  const conditions = new Set(subject.conditions ?? []);
  const classes = new Set(subject.drugClass ?? []);

  const matched = ASSISTANCE_CATEGORIES.filter(
    (c) =>
      !c.fallback &&
      ((c.conditions?.some((k) => conditions.has(k)) ?? false) ||
        (c.drugClass?.some((k) => classes.has(k)) ?? false)),
  ).map((c) => c.key);

  if (matched.length > 0) return matched;
  const fallback = ASSISTANCE_CATEGORIES.find((c) => c.fallback);
  return fallback ? [fallback.key] : [];
}

/** The same, as display labels — used for the on-page category kicker. */
export const categoryLabelsFor = (subject: TaxonomySubject): string[] =>
  categoriesFor(subject).map(categoryLabel);
