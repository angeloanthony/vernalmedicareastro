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
    // Blurb widened 2026-08-26 (Batch 5, Leqvio): the key covers PCSK9-directed
    // LDL-lowering injectables — the monoclonal antibodies (Repatha, Praluent)
    // and the siRNA inclisiran (Leqvio), which the label calls "a small
    // interfering RNA (siRNA) directed to PCSK9 mRNA", not an antibody.
    key: 'pcsk9',
    label: 'PCSK9 inhibitor',
    blurb: 'Injected medicines that lower LDL cholesterol by targeting PCSK9 — antibodies given every two to four weeks, or the twice-yearly siRNA inclisiran — when statins are not enough.',
  },
  {
    // Added 2026-08-26 for Batch 2 (Entresto); confirmed against the label —
    // sacubitril (neprilysin inhibitor) + valsartan (angiotensin II receptor blocker).
    key: 'arni',
    label: 'ARNI (angiotensin receptor–neprilysin inhibitor)',
    blurb: 'A heart-failure tablet that combines a neprilysin inhibitor with an angiotensin receptor blocker.',
  },
  {
    // Added 2026-08-26 for Batch 2 (Trelegy Ellipta, Breztri Aerosphere);
    // confirmed against each label (ICS + LAMA + LABA in one inhaler).
    key: 'triple-inhaler',
    label: 'Triple-therapy inhaler (ICS/LAMA/LABA)',
    blurb:
      'Maintenance inhalers that combine an inhaled steroid with two long-acting bronchodilators for COPD, and in some cases asthma.',
  },
  {
    // Added 2026-08-26 for Batch 3 (Rinvoq); confirmed against the label —
    // "RINVOQ/RINVOQ LQ is a Janus kinase (JAK) inhibitor" (DailyMed). It is a
    // tablet, not a biologic, so it must not carry the 'biologic' key.
    key: 'jak-inhibitor',
    label: 'JAK inhibitor',
    blurb:
      'Tablets that block Janus kinase signalling inside immune cells. Taken by mouth, unlike the injected biologics used for the same conditions.',
  },
  {
    // Added 2026-08-26 for Batch 6 (Nexletol); confirmed against the label
    // Highlights — "NEXLETOL is an adenosine triphosphate-citrate lyase (ACL)
    // inhibitor" (DailyMed, rev. 1/2026). It is an oral tablet acting upstream
    // of the statin target, so it is neither a statin nor a 'pcsk9' medicine.
    key: 'acl-inhibitor',
    label: 'ACL inhibitor',
    blurb:
      'A cholesterol tablet that blocks ATP-citrate lyase, an enzyme the liver uses to make cholesterol — a step above the enzyme statins block. Activated in the liver, not in muscle.',
  },
  {
    // Added 2026-08-26 for Batch 6 (Symbicort); confirmed against the label —
    // budesonide, a corticosteroid, with formoterol, a long-acting beta2
    // agonist (DailyMed, rev. 7/2019). Two ingredients, so it must NOT carry
    // 'triple-inhaler', which the taxonomy reserves for ICS/LAMA/LABA.
    key: 'ics-laba',
    label: 'Combination inhaler (ICS/LABA)',
    blurb:
      'Maintenance inhalers that pair an inhaled corticosteroid with one long-acting bronchodilator, for asthma and in some cases COPD.',
  },
  {
    // Added 2026-08-26 for Batch 6 (Spiriva HandiHaler and Spiriva Respimat);
    // the label Highlights call tiotropium "an anticholinergic" (DailyMed,
    // rev. 12/2024 and 1/2025). A single long-acting bronchodilator with no
    // steroid, which is what separates it from 'ics-laba' and 'triple-inhaler'.
    key: 'lama',
    label: 'LAMA inhaler (long-acting anticholinergic)',
    blurb:
      'Once-daily maintenance inhalers that relax the airway muscle by blocking acetylcholine. No steroid, and not a rescue inhaler.',
  },
  {
    // Added 2026-08-26 for Batch 6 (Ofev); the label Highlights say "OFEV is a
    // kinase inhibitor" (DailyMed, rev. 5/2025) and the mechanism section calls
    // nintedanib "a small molecule that inhibits multiple receptor tyrosine
    // kinases (RTKs) and non-receptor tyrosine kinases (nRTKs)". Kept broader
    // than 'jak-inhibitor', which names one specific kinase family.
    key: 'kinase-inhibitor',
    label: 'Kinase inhibitor',
    blurb:
      'Capsules or tablets that block signalling enzymes inside cells. In lung fibrosis they slow the scarring process rather than open the airways.',
  },
  {
    // Added 2026-08-26 for Batch 7 (Januvia); confirmed against the label —
    // "JANUVIA is a dipeptidyl peptidase-4 (DPP-4) inhibitor" (DailyMed,
    // rev. 7/2023). The diabetes browse view has named DPP-4s in its blurb
    // since the taxonomy was built; this is the first record to carry one.
    key: 'dpp-4',
    label: 'DPP-4 inhibitor',
    blurb:
      'Tablets that help the body keep its own blood-sugar-lowering hormones working longer. Taken by mouth once a day, and not insulin.',
  },
  {
    // Added 2026-08-26 for Batch 7 (Vyndamax); the label calls tafamidis one of
    // the "transthyretin stabilizers" (DailyMed, rev. 10/2023). It treats a
    // cardiomyopathy but is neither a heart-failure tablet ('arni') nor a
    // blood thinner — it stabilises a misfolding protein.
    key: 'transthyretin-stabilizer',
    label: 'Transthyretin stabilizer',
    blurb:
      'Capsules that hold a blood protein called transthyretin in its correct shape so it stops depositing in the heart muscle.',
  },
];

const BY_KEY = new Map(DRUG_CLASSES.map((c) => [c.key, c]));

/** Human label for a drug-class key (falls back to the raw key). */
export const drugClassLabel = (key: DrugClassKey): string => BY_KEY.get(key)?.label ?? key;

export const isDrugClassKey = (key: string): key is DrugClassKey => BY_KEY.has(key as DrugClassKey);
