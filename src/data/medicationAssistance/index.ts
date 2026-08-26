// ---------------------------------------------------------------------------
// src/data/medicationAssistance/index.ts — REGISTRY for the Prescription
// Assistance project (docs/PRESCRIPTION-ASSISTANCE-PROJECT.md).
//
// One file per medication (farxiga.ts, jardiance.ts, …), each an independently
// researched MedicationAssistanceRecord with dated sources. This registry is the
// only place that knows the URL / <title> / H1 pattern, so the pattern is
// locked in one file (spec §21) and the 75 pages can never drift.
//
// The record's `slug` must match a FEATURED_DRUGS slug in data/drugs.ts: the
// existing /<slug>-assistance-program.html route renders a record-driven page
// when a record exists and its legacy generic page otherwise. One medication,
// one canonical page — no duplicates (spec §20).
//
// MAINTENANCE: fund status is the most perishable data on the site. Re-verify
// every record against its `sources[].url` at least quarterly and bump
// `lastVerified`. GLP-1 records (Mounjaro, Ozempic) need more frequent checks
// (spec §5C).
// ---------------------------------------------------------------------------

import type {
  AssistanceProgram,
  MedicationAssistanceRecord,
  ProgramKind,
  ProgramStatus,
  MedicareEligibility,
  TaxonomySubject,
} from '../../types/MedicationAssistance';
import { figuresFor } from '../annualMedicareData';
import { usd } from '../../lib/formatters';
import { FARXIGA } from './farxiga';
import { JARDIANCE } from './jardiance';
import { ELIQUIS } from './eliquis';
import { MOUNJARO } from './mounjaro';
import { OZEMPIC } from './ozempic';
import { ENTRESTO } from './entresto';
import { XARELTO } from './xarelto';
import { REPATHA } from './repatha';
import { TRELEGY } from './trelegy';
import { BREZTRI } from './breztri';

// ── Taxonomy (two axes; browse categories are derived, never stored) ─────────
export {
  ASSISTANCE_CATEGORIES,
  PENDING_CATEGORY_VIEWS,
  categoryLabel,
  categoriesFor,
  categoryLabelsFor,
} from './categories';
export { DRUG_CLASSES, drugClassLabel, isDrugClassKey } from './drugClasses';

/**
 * The taxonomy tags for a medication page: the two canonical axes plus the
 * fixed silo tags, deduplicated. Browse categories are deliberately NOT tags —
 * they are a view over these axes, and including them is what previously
 * duplicated 'diabetes' and 'heart' on every record
 * (docs/PRESCRIPTION-ASSISTANCE-TAXONOMY-AUDIT.md §0).
 */
export const taxonomyTags = (subject: TaxonomySubject, base: string[]): string[] => [
  ...new Set([...base, ...subject.conditions, ...(subject.drugClass ?? [])]),
];

/** Spec §24 build order. Batch 1 = #1–5 (2026-08-26); Batch 2 = #6–10
 *  (2026-08-26). Add later batches here, one per line. */
export const MEDICATION_ASSISTANCE: MedicationAssistanceRecord[] = [
  FARXIGA,
  JARDIANCE,
  ELIQUIS,
  MOUNJARO,
  OZEMPIC,
  ENTRESTO,
  XARELTO,
  REPATHA,
  TRELEGY,
  BREZTRI,
];

export const medicationAssistanceFor = (slug: string): MedicationAssistanceRecord | undefined =>
  MEDICATION_ASSISTANCE.find((r) => r.slug === slug);

// ── URL / title / H1 pattern (spec §21) — change here, never per page ────────
export const assistanceHref = (slug: string): string => `/${slug}-assistance-program.html`;
export const assistanceTitle = (r: MedicationAssistanceRecord): string =>
  `${r.brandName} Assistance & Grants: How to Apply in Utah | Vernal Medicare`;
export const assistanceHeading = (r: MedicationAssistanceRecord): string =>
  `${r.brandName} Assistance Programs & Grants in Utah`;
/** Short label for nav / directory / related cards. */
export const assistanceLabel = (r: MedicationAssistanceRecord): string =>
  `${r.brandName} Assistance & Grants`;

/** "August 2026" from an ISO date (spec §16 Rule 6 display format). */
export const verifiedMonth = (iso: string): string =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(iso),
  );

/** "August 26, 2026" — for per-claim "checked" dates. */
export const checkedDate = (iso: string): string =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(iso),
  );

// ── Presentation metadata (shared by every medication page) ──────────────────
export const KIND_META: Record<ProgramKind, { label: string; explainer: string; color: string; tint: string }> = {
  'manufacturer-pap': {
    label: 'Manufacturer patient assistance',
    explainer: 'The drug maker supplies the medication free or at low cost to people who meet its income and insurance rules. Different from a copay card.',
    color: '#2563eb', tint: '#e5edfe',
  },
  'manufacturer-savings': {
    label: 'Commercial copay / savings card',
    explainer: 'A manufacturer discount for people with commercial insurance. These cards usually exclude Medicare and other government insurance.',
    color: '#b45309', tint: '#fef3e2',
  },
  'manufacturer-direct': {
    label: 'Manufacturer self-pay pricing',
    explainer: 'A cash price offered directly by the manufacturer, outside your insurance.',
    color: '#0d9488', tint: '#d7f0ec',
  },
  charitable: {
    label: 'Charitable grant',
    explainer: 'A nonprofit fund that pays eligible copays or coinsurance for a specific diagnosis. Funds open and close as money is available.',
    color: '#16a34a', tint: '#e4f5ea',
  },
  government: {
    label: 'Government program',
    explainer: 'Medicare and state programs that lower prescription costs for people with limited income and resources.',
    color: '#7c3aed', tint: '#f0e9fd',
  },
};

export const STATUS_META: Record<ProgramStatus, { label: string; cls: string }> = {
  open: { label: 'Accepting applications', cls: 'is-open' },
  limited: { label: 'Open with limits', cls: 'is-limited' },
  closed: { label: 'Closed to new applicants', cls: 'is-closed' },
  verify: { label: 'Check current availability', cls: 'is-verify' },
  'not-found': { label: 'No program found', cls: 'is-none' },
};

export const MEDICARE_META: Record<MedicareEligibility, { label: string; cls: string }> = {
  eligible: { label: 'Medicare: may apply', cls: 'is-open' },
  conditional: { label: 'Medicare: with conditions', cls: 'is-limited' },
  excluded: { label: 'Medicare: not eligible', cls: 'is-closed' },
  unknown: { label: 'Medicare: not stated', cls: 'is-verify' },
};

// ── Medicare Extra Help — one definition, rendered on every page (spec §9) ───
// Dollar figures come from the annual data layer so a new year's numbers change
// in ONE place, not in 75 records. Income test verified on SSA POMS HI 03001.020
// (2026-08-26): income below 150% of the Federal Poverty Level.
export const EXTRA_HELP_CHECKED = '2026-08-26';

export interface ExtraHelpFacts {
  year: number;
  resourcesIndividual: string;
  resourcesCouple: string;
  incomeIndividual: string;
  incomeCouple: string;
  brandCopay: string;
  applyUrl: string;
  phone: string;
  checked: string;
}

// Medicare.gov publishes the resource limits INCLUDING the $1,500 / $3,000
// burial-expense allowance ($18,090 / $36,100 for 2026); the data layer stores
// the POMS base figures ($16,590 / $33,100, HI 03030.025). Both are official —
// we show the Medicare.gov form because that is what beneficiaries will see.
const BURIAL_ALLOWANCE = { individual: 1500, couple: 3000 };

export function extraHelpFacts(): ExtraHelpFacts {
  const f = figuresFor();
  return {
    year: f.year,
    resourcesIndividual: usd(f.extraHelp.resourcesIndividual + BURIAL_ALLOWANCE.individual),
    resourcesCouple: usd(f.extraHelp.resourcesCouple + BURIAL_ALLOWANCE.couple),
    // 150% FPL, 2026, contiguous U.S. (SSA POMS HI 03001.020, rev. 02/11/2026).
    incomeIndividual: '$23,940',
    incomeCouple: '$32,460',
    brandCopay: usd(f.extraHelp.maxDrugCopay, { cents: true }),
    applyUrl: 'https://www.ssa.gov/medicare/part-d-extra-help',
    phone: '1-800-772-1213',
    checked: EXTRA_HELP_CHECKED,
  };
}

/** The Extra Help program card, built from the data layer. */
export function extraHelpProgram(): AssistanceProgram {
  const e = extraHelpFacts();
  return {
    id: 'extra-help',
    kind: 'government',
    name: 'Medicare Extra Help (Part D Low-Income Subsidy)',
    operator: 'Medicare / Social Security Administration',
    status: 'open',
    statusNote: `Year-round federal program (figures for ${e.year})`,
    medicare: 'eligible',
    medicareNote: 'For people with Medicare Part D or a Medicare Advantage drug plan who have limited income and resources.',
    summary:
      'Not a grant for one drug — a Medicare program that lowers what qualifying beneficiaries pay for their Part D premium, deductible and every covered prescription.',
    covers: `Part D premium and deductible (often to $0) and reduced copays — generally no more than ${e.brandCopay} for a covered brand-name drug in ${e.year} with full Extra Help.`,
    eligibility: [
      `Income below 150% of the federal poverty level — about ${e.incomeIndividual} a year for one person or ${e.incomeCouple} for a married couple in ${e.year}.`,
      `Countable resources (savings, investments — not your home or car) limited to ${e.resourcesIndividual} for an individual or ${e.resourcesCouple} for a married couple living together in ${e.year} (Medicare.gov figures, which include a burial-expense allowance).`,
      'Automatic if you have Medicaid, Supplemental Security Income (SSI), or a Medicare Savings Program.',
    ],
    requirements: [
      'Social Security number and Medicare number',
      'Income (Social Security, pensions, wages) for you and a spouse you live with',
      'Value of savings, investments and other countable resources',
    ],
    howToApply:
      'You (or someone helping you) apply free through Social Security — online, by phone, or at a Social Security office. There is never a fee to apply.',
    applyUrl: e.applyUrl,
    applyLabel: 'Apply for Extra Help at SSA.gov',
    phone: e.phone,
    sources: [
      {
        title: 'Apply for Medicare Part D Extra Help program',
        url: 'https://www.ssa.gov/medicare/part-d-extra-help',
        publisher: 'Social Security Administration',
        checked: e.checked,
        supports: 'application route',
      },
      {
        title: 'POMS HI 03001.020 — Eligibility for Extra Help (income below 150% FPL)',
        url: 'https://secure.ssa.gov/poms.nsf/lnx/0603001020',
        publisher: 'Social Security Administration',
        checked: e.checked,
        supports: '2026 income test',
      },
      {
        title: 'POMS HI 03030.025 — Resource limits for Extra Help',
        url: 'https://secure.ssa.gov/poms.nsf/lnx/0603030025',
        publisher: 'Social Security Administration',
        checked: e.checked,
        supports: `${e.year} resource limits`,
      },
      {
        title: 'Help with drug costs (Extra Help — 2026 limits and copays)',
        url: 'https://www.medicare.gov/basics/costs/help/drug-costs',
        publisher: 'Medicare.gov',
        checked: e.checked,
        supports: `${e.year} income/resource limits and brand-name copay`,
      },
    ],
  };
}

// ── Key terms rendered on every medication page (<dl>) ───────────────────────
export const KEY_TERMS: { term: string; definition: string }[] = [
  {
    term: 'Patient assistance program (PAP)',
    definition:
      'A manufacturer program that provides its medication free or at low cost to people who meet income and insurance rules. Many PAPs accept Medicare Part D enrollees; each sets its own criteria.',
  },
  {
    term: 'Copay card / savings card',
    definition:
      'A manufacturer discount for commercially insured patients. Federal anti-kickback rules mean these cards generally cannot be used with Medicare, Medicaid or other government insurance.',
  },
  {
    term: 'Charitable copay grant',
    definition:
      'Money from a nonprofit foundation (for example HealthWell or Patient Advocate Foundation) that pays eligible copays or coinsurance for a specific diagnosis. A drug can be listed while the fund is closed to new applicants.',
  },
  {
    term: 'Medicare Extra Help',
    definition:
      'The Part D Low-Income Subsidy: a Medicare program that lowers or eliminates Part D premiums, deductibles and copays for beneficiaries with limited income and resources. You apply through Social Security.',
  },
  {
    term: 'Maximum Fair Price (MFP)',
    definition:
      'The price Medicare negotiated for a selected drug under the Medicare Drug Price Negotiation Program. It applies to Part D plans, not to the pharmacy cash price, and it lowers what plans and enrollees pay for that drug.',
  },
];

export type { MedicationAssistanceRecord, AssistanceProgram } from '../../types/MedicationAssistance';
