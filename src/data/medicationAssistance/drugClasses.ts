// ---------------------------------------------------------------------------
// src/data/medicationAssistance/drugClasses.ts — AXIS 2 of the medication
// taxonomy: what the medication IS (docs/PRESCRIPTION-ASSISTANCE-TAXONOMY-AUDIT.md).
//
// Axis 1 is `conditions` (src/data/conditions.ts) — what the patient has. The
// two axes are independent and neither derives from the other: Eliquis is an
// anticoagulant (class) prescribed for AFib and clots (conditions); Ozempic is
// a GLP-1 (class) prescribed for type 2 diabetes (condition).
//
// Keep this vocabulary SMALL and factual. A new key is added when a researched
// medication needs it, and the class is confirmed against the medication's
// label during that research pass (spec §16 Rule 1) — never assigned from
// memory to a medication that has not been researched yet.
// ---------------------------------------------------------------------------

import type { DrugClass, DrugClassKey } from '../../types/MedicationAssistance';

export const DRUG_CLASSES: DrugClass[] = [
  {
    key: 'glp-1',
    label: 'GLP-1 receptor agonist',
    blurb:
      'Medicines that act on the GLP-1 receptor to lower blood sugar and slow digestion. Includes the dual GIP/GLP-1 agonist tirzepatide.',
  },
  {
    key: 'sglt2',
    label: 'SGLT2 inhibitor',
    blurb:
      'Tablets that lower blood sugar by making the kidneys remove glucose in urine; several also carry heart-failure and kidney indications.',
  },
  {
    key: 'insulin',
    label: 'Insulin',
    blurb: 'Injected insulin products, long-acting and rapid-acting.',
  },
  {
    key: 'anticoagulant',
    label: 'Anticoagulant',
    blurb:
      'Blood thinners that slow clot formation — used for atrial fibrillation, deep vein thrombosis and pulmonary embolism.',
  },
  {
    key: 'antiplatelet',
    label: 'Antiplatelet',
    blurb:
      'Blood thinners that stop platelets clumping — used after a heart attack or a stent.',
  },
  {
    key: 'biologic',
    label: 'Biologic',
    blurb:
      'Injected or infused proteins (often monoclonal antibodies) that target one part of the immune system.',
  },
  {
    key: 'pcsk9',
    label: 'PCSK9 inhibitor',
    blurb: 'Injected medicines that lower LDL cholesterol when statins are not enough.',
  },
];

const BY_KEY = new Map(DRUG_CLASSES.map((c) => [c.key, c]));

/** Human label for a drug-class key (falls back to the raw key). */
export const drugClassLabel = (key: DrugClassKey): string => BY_KEY.get(key)?.label ?? key;

export const isDrugClassKey = (key: string): key is DrugClassKey => BY_KEY.has(key as DrugClassKey);
