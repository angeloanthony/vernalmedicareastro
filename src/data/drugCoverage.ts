// ---------------------------------------------------------------------------
// src/data/drugCoverage.ts — SINGLE SOURCE OF TRUTH for the Drug-Coverage
// Center (M32). 14 net-new "does Medicare cover X" drugs. Each node uses the
// same standardized structure (types/DrugCoverage.ts). General, accurate
// coverage guidance — no invented plan names or prices; confirm specifics on
// the beneficiary's own formulary. Holds Mounjaro/Ozempic/Wegovy/Insulin
// (GSC-sensitive) OUT of this set per the migration plan.
// ---------------------------------------------------------------------------

import type { DrugCoverageEntry } from '../types/DrugCoverage';

const PART_D_SELF = 'Part D. These are self-administered prescriptions, so they fall under your Part D drug plan (or the drug coverage built into a Medicare Advantage plan), not Part B.';

export const DRUG_COVERAGE: DrugCoverageEntry[] = [
  // ── Diabetes ─────────────────────────────────────────────────────────────
  {
    brand: 'Jardiance', slug: 'jardiance', generic: 'empagliflozin', condition: 'diabetes',
    treats: 'type 2 diabetes (and heart failure / kidney protection)',
    status: 'covered',
    coveredSummary: 'Yes — Medicare Part D plans generally cover Jardiance for type 2 diabetes.',
    coveredWhen: 'Covered when prescribed for an approved use like type 2 diabetes, heart failure, or chronic kidney disease. It’s usually on a brand (non-preferred) tier, so your copay depends on the plan.',
    whichPart: PART_D_SELF,
    priorAuth: 'Some plans require prior authorization or step therapy (trying a lower-cost drug first). Your doctor can request an exception if needed.',
    ifNotCovered: 'If your plan doesn’t cover it well, a yearly plan review can find one that does, and manufacturer or foundation assistance can lower the cost.',
    assistanceSlug: 'jardiance', related: ['farxiga', 'trulicity'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Farxiga', slug: 'farxiga', generic: 'dapagliflozin', condition: 'diabetes',
    treats: 'type 2 diabetes (and heart failure / kidney disease)',
    status: 'covered',
    coveredSummary: 'Yes — Part D plans generally cover Farxiga for type 2 diabetes.',
    coveredWhen: 'Covered for approved uses including type 2 diabetes, heart failure, and chronic kidney disease. Formulary tier and copay vary by plan.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization or step therapy applies on some plans. An exception request is available if a lower-cost option isn’t right for you.',
    ifNotCovered: 'Compare plans that place Farxiga on a better tier, and ask us about manufacturer savings and foundation grants.',
    assistanceSlug: 'farxiga', related: ['jardiance', 'trulicity'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Trulicity', slug: 'trulicity', generic: 'dulaglutide', condition: 'diabetes',
    treats: 'type 2 diabetes (a weekly GLP-1 injection)',
    status: 'covered',
    coveredSummary: 'Yes — Part D covers Trulicity for type 2 diabetes.',
    coveredWhen: 'Covered when prescribed for type 2 diabetes. Like other GLP-1s, it’s covered for diabetes — not for weight loss alone. Usually a higher brand tier.',
    whichPart: PART_D_SELF,
    priorAuth: 'Many plans require prior authorization confirming the diabetes diagnosis, and sometimes step therapy.',
    ifNotCovered: 'A plan review can find better coverage; manufacturer and foundation assistance can cut the cost for those who qualify.',
    assistanceSlug: 'trulicity', related: ['jardiance', 'farxiga'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },

  // ── Heart & Blood ────────────────────────────────────────────────────────
  {
    brand: 'Eliquis', slug: 'eliquis', generic: 'apixaban', condition: 'heart',
    treats: 'blood clots and stroke prevention in AFib',
    status: 'covered',
    coveredSummary: 'Yes — Part D plans widely cover Eliquis.',
    coveredWhen: 'Covered for approved uses such as reducing stroke risk in atrial fibrillation and treating or preventing blood clots (DVT/PE). Commonly on a preferred brand tier.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization is uncommon but possible on some plans. Eliquis is also one of the drugs selected for future Medicare price negotiation.',
    ifNotCovered: 'If your copay is high, compare plans and ask about the manufacturer’s savings resources.',
    assistanceSlug: 'eliquis', related: ['xarelto'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Xarelto', slug: 'xarelto', generic: 'rivaroxaban', condition: 'heart',
    treats: 'blood clots and stroke prevention',
    status: 'covered',
    coveredSummary: 'Yes — Part D plans generally cover Xarelto.',
    coveredWhen: 'Covered for approved uses like stroke prevention in AFib and treating/preventing blood clots. Tier and copay vary by plan.',
    whichPart: PART_D_SELF,
    priorAuth: 'Some plans use prior authorization or step therapy versus other anticoagulants. Xarelto is also slated for Medicare price negotiation.',
    ifNotCovered: 'Compare plans for the best tier placement; manufacturer savings may help.',
    assistanceSlug: 'xarelto', related: ['eliquis'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Entresto', slug: 'entresto', generic: 'sacubitril/valsartan', condition: 'heart',
    treats: 'chronic heart failure',
    status: 'covered',
    coveredSummary: 'Yes — Part D plans generally cover Entresto for heart failure.',
    coveredWhen: 'Covered when prescribed for chronic heart failure. Usually a brand tier; copay depends on the plan.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization or step therapy applies on some plans. Entresto is among the drugs selected for Medicare price negotiation.',
    ifNotCovered: 'A plan review can improve coverage; ask us about manufacturer and foundation help.',
    assistanceSlug: 'entresto', related: ['repatha'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Repatha', slug: 'repatha', generic: 'evolocumab', condition: 'heart',
    treats: 'high cholesterol / cardiovascular risk (a PCSK9 inhibitor)',
    status: 'conditional',
    coveredSummary: 'Usually — Part D covers Repatha when statins alone aren’t enough, with criteria.',
    coveredWhen: 'Covered for high cholesterol or cardiovascular risk, typically after statins haven’t worked or aren’t tolerated. Plans apply clinical criteria.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization is common — plans usually require documented statin use or intolerance (step therapy) first.',
    ifNotCovered: 'If denied, your doctor can appeal with clinical documentation; manufacturer and foundation assistance can help with cost.',
    assistanceSlug: 'repatha', related: ['entresto'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },

  // ── Autoimmune & Skin ────────────────────────────────────────────────────
  {
    brand: 'Humira', slug: 'humira', generic: 'adalimumab', condition: 'autoimmune',
    treats: 'rheumatoid arthritis, psoriasis, Crohn’s, and more',
    status: 'conditional',
    coveredSummary: 'Yes — Part D covers Humira (and its biosimilars) for approved autoimmune conditions.',
    coveredWhen: 'Covered for approved diagnoses like rheumatoid arthritis, psoriatic arthritis, plaque psoriasis, and Crohn’s. Self-injected pens are Part D; biosimilars may be preferred.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization is standard for biologics, and plans often prefer a biosimilar first (step therapy).',
    ifNotCovered: 'If cost is high, biosimilars can be cheaper, and manufacturer/foundation grants help many people. Ask us to compare.',
    assistanceSlug: 'humira', related: ['enbrel', 'rinvoq', 'skyrizi'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Enbrel', slug: 'enbrel', generic: 'etanercept', condition: 'autoimmune',
    treats: 'rheumatoid arthritis and psoriasis',
    status: 'conditional',
    coveredSummary: 'Yes — Part D covers Enbrel for approved autoimmune conditions.',
    coveredWhen: 'Covered for approved uses such as rheumatoid arthritis, psoriatic arthritis, and plaque psoriasis. Self-injected, so it’s a Part D drug.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization is standard, and step therapy (trying a preferred biologic first) is common.',
    ifNotCovered: 'Appeals with clinical notes, plus manufacturer and foundation assistance, can make it affordable.',
    assistanceSlug: 'enbrel', related: ['humira', 'rinvoq'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Rinvoq', slug: 'rinvoq', generic: 'upadacitinib', condition: 'autoimmune',
    treats: 'rheumatoid arthritis, eczema, and more',
    status: 'conditional',
    coveredSummary: 'Yes — Part D covers Rinvoq for approved conditions, with criteria.',
    coveredWhen: 'Covered for approved uses like rheumatoid arthritis, atopic dermatitis (eczema), and inflammatory bowel disease. An oral JAK inhibitor, so Part D.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization is standard; plans usually require you to have tried other treatments first (step therapy).',
    ifNotCovered: 'Your doctor can appeal; manufacturer and foundation programs help with the cost for those who qualify.',
    assistanceSlug: 'rinvoq', related: ['humira', 'skyrizi'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Skyrizi', slug: 'skyrizi', generic: 'risankizumab', condition: 'autoimmune',
    treats: 'plaque psoriasis and Crohn’s disease',
    status: 'conditional',
    coveredSummary: 'Yes — Part D covers Skyrizi for approved conditions, with criteria.',
    coveredWhen: 'Covered for approved uses like plaque psoriasis, psoriatic arthritis, and Crohn’s. Self-administered doses are Part D (some clinic-infused doses may fall under Part B).',
    whichPart: 'Usually Part D for the self-injected pen; a Part B possibility exists if it’s infused in a clinic. Confirm how yours is given.',
    priorAuth: 'Prior authorization is standard, often with step therapy.',
    ifNotCovered: 'Appeals plus manufacturer and foundation assistance can lower the cost significantly.',
    assistanceSlug: 'skyrizi', related: ['humira', 'rinvoq'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    brand: 'Dupixent', slug: 'dupixent', generic: 'dupilumab', condition: 'autoimmune',
    treats: 'eczema, asthma, and COPD',
    status: 'conditional',
    coveredSummary: 'Yes — Part D covers Dupixent for approved conditions, with criteria.',
    coveredWhen: 'Covered for approved uses like moderate-to-severe eczema, certain asthma, and COPD. Self-injected, so it’s a Part D drug.',
    whichPart: PART_D_SELF,
    priorAuth: 'Prior authorization is standard; plans usually require documentation of severity and prior treatments.',
    ifNotCovered: 'Your doctor can appeal; manufacturer and foundation programs assist many patients.',
    assistanceSlug: 'dupixent', related: ['rinvoq', 'trelegy'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },

  // ── Respiratory ──────────────────────────────────────────────────────────
  {
    brand: 'Trelegy Ellipta', slug: 'trelegy', generic: 'fluticasone/umeclidinium/vilanterol', condition: 'respiratory',
    treats: 'COPD and asthma (a 3-in-1 inhaler)',
    status: 'covered',
    coveredSummary: 'Yes — Part D plans generally cover Trelegy for COPD and asthma.',
    coveredWhen: 'Covered as a maintenance inhaler for COPD and asthma. It’s a brand inhaler, so tier and copay vary by plan.',
    whichPart: PART_D_SELF,
    priorAuth: 'Some plans use prior authorization or step therapy versus other inhalers.',
    ifNotCovered: 'Compare plans for better inhaler coverage; ask about manufacturer savings and prescription assistance.',
    related: ['dupixent'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },

  // ── Weight & Metabolic ───────────────────────────────────────────────────
  {
    brand: 'Zepbound', slug: 'zepbound', generic: 'tirzepatide', condition: 'weight',
    treats: 'chronic weight management (and obstructive sleep apnea)',
    status: 'limited',
    coveredSummary: 'Usually not — Medicare generally does not cover drugs used for weight loss alone.',
    coveredWhen: 'By law, Part D generally excludes drugs used only for weight loss, so Zepbound for weight management is typically not covered. Coverage may be possible when it’s prescribed for a separately approved condition (for example, obstructive sleep apnea) — this area is evolving.',
    whichPart: 'If covered for an approved non-weight-loss use, it would be Part D. Weight-loss-only use is generally excluded.',
    priorAuth: 'When any coverage applies, expect prior authorization confirming an approved, non-weight-loss diagnosis.',
    ifNotCovered: 'Talk with your doctor about whether an approved diagnosis applies, ask the manufacturer about savings programs (note: many exclude people with government insurance), and consider covered alternatives.',
    related: ['trulicity', 'jardiance'],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
];
