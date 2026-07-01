// ---------------------------------------------------------------------------
// src/data/pageIndex.ts — registry that powers weighted "Related" (ADR-0008)
//
// Manual now; auto-generated from content collections in Phase 4. Per Migration
// Rule 10, this GROWS one entry at a time as each page is migrated onto the Page
// Framework — it is NOT a big-bang catalog of all 47 pages. Seeded with the
// Medicare-101 / enrollment / costs cluster that the first proof page
// (Part A vs Part B, M4) links to, so lib/related has real data to rank.
// ---------------------------------------------------------------------------

import type { Taxonomy } from '../types/Page';
import { FEATURED_DRUGS } from './drugs';

export interface PageIndexEntry {
  href: string;
  title: string;
  taxonomy: Taxonomy;
}

export const PAGE_INDEX: PageIndexEntry[] = [
  {
    href: '/medicare-part-a-vs-part-b.html',
    title: 'Medicare Part A vs Part B',
    taxonomy: { silo: 'medicare-101', tags: ['part-a', 'part-b', 'original-medicare'] },
  },
  {
    href: '/medicare-plans-vernal-utah.html',
    title: 'Medicare Plans in Vernal, Utah — Complete Guide',
    taxonomy: { silo: 'medicare-101', tags: ['overview', 'original-medicare'], pillar: true },
  },
  {
    href: '/when-to-enroll-medicare-utah.html',
    title: 'When to Enroll in Medicare in Utah',
    taxonomy: { silo: 'enrollment', tags: ['iep', 'deadlines', 'part-b'] },
  },
  {
    href: '/medicare-supplement-vs-advantage.html',
    title: 'Medicare Supplement vs Medicare Advantage',
    taxonomy: { silo: 'medigap', tags: ['comparison', 'advantage', 'original-medicare'] },
  },
  {
    href: '/medicare-cost-uintah-county.html',
    title: 'How Much Does Medicare Cost in Uintah County',
    taxonomy: { silo: 'costs-irmaa', tags: ['costs', 'part-b'] },
  },
  {
    href: '/medicare-out-of-pocket-maximum-2026.html',
    title: 'Medicare Out-of-Pocket Maximum 2026',
    taxonomy: { silo: 'costs-irmaa', tags: ['moop', 'costs'] },
  },
  {
    href: '/medigap.html',
    title: 'Medigap (Medicare Supplement) in Vernal',
    taxonomy: { silo: 'medigap', tags: ['overview'] },
  },
  // ── IRMAA authority cluster (M10). Calculator was indexed since M5. ──
  {
    href: '/medicare-irmaa.html',
    title: 'Medicare IRMAA Explained',
    taxonomy: { silo: 'costs-irmaa', tags: ['irmaa', 'costs', 'part-b', 'part-d', 'magi'], pillar: true },
  },
  {
    href: '/medicare-irmaa-calculator.html',
    title: '2026 Medicare IRMAA Calculator',
    taxonomy: { silo: 'costs-irmaa', tags: ['irmaa', 'costs', 'part-b', 'part-d'] },
  },
  {
    href: '/medicare-irmaa-brackets-2026.html',
    title: '2026 Medicare IRMAA Brackets',
    taxonomy: { silo: 'costs-irmaa', tags: ['irmaa', 'brackets', 'costs', 'part-b', 'part-d', 'magi'] },
  },
  {
    href: '/medicare-irmaa-appeal-ssa-44.html',
    title: 'How to Appeal Medicare IRMAA (Form SSA-44)',
    taxonomy: { silo: 'costs-irmaa', tags: ['irmaa', 'appeal', 'ssa-44', 'costs', 'part-b', 'part-d'] },
  },
  {
    href: '/medicare-irmaa-life-changing-events.html',
    title: 'Medicare IRMAA Life-Changing Events',
    taxonomy: { silo: 'costs-irmaa', tags: ['irmaa', 'appeal', 'life-changing-events', 'costs', 'part-b', 'part-d'] },
  },
  {
    href: '/how-to-reduce-medicare-irmaa.html',
    title: 'How to Reduce Medicare IRMAA (Legally)',
    taxonomy: { silo: 'costs-irmaa', tags: ['irmaa', 'planning', 'magi', 'costs', 'part-b', 'part-d'] },
  },
  // ── Dual-Eligible / Medicaid silo (M6) ──
  {
    href: '/dual-eligible.html',
    title: 'Dual Eligible & Medicaid Plans (D-SNP)',
    taxonomy: { silo: 'dual-eligible', tags: ['d-snp', 'medicaid', 'extra-help', 'qmb', 'msp'], pillar: true },
  },
  {
    href: '/medicare-extra-help-utah.html',
    title: 'Medicare Extra Help (Part D Low-Income Subsidy)',
    taxonomy: { silo: 'dual-eligible', tags: ['extra-help', 'lis', 'part-d', 'medicaid', 'costs'] },
  },
  {
    href: '/medicare-savings-programs-utah.html',
    title: 'Medicare Savings Programs (QMB, SLMB, QI)',
    taxonomy: { silo: 'dual-eligible', tags: ['msp', 'qmb', 'slmb', 'qi', 'medicaid', 'costs', 'part-b'] },
  },
  {
    href: '/d-snp-plans-utah.html',
    title: 'D-SNP Plans (Dual-Eligible Special Needs Plans)',
    taxonomy: { silo: 'dual-eligible', tags: ['d-snp', 'medicare-advantage', 'medicaid', 'extra-help'] },
  },
  {
    href: '/medicare-medicaid-utah.html',
    title: 'Medicare and Medicaid Together in Utah',
    taxonomy: { silo: 'dual-eligible', tags: ['medicaid', 'dual-eligible', 'utah', 'extra-help', 'msp'] },
  },
  // ── Enrollment silo (M7). when-to-enroll is already indexed above. ──
  {
    href: '/medicare-enrollment-periods.html',
    title: 'Medicare Enrollment Periods Explained',
    taxonomy: { silo: 'enrollment', tags: ['enrollment', 'iep', 'sep', 'gep', 'aep', 'deadlines'], pillar: true },
  },
  {
    href: '/medicare-special-enrollment-period.html',
    title: 'Medicare Special Enrollment Period (SEP)',
    taxonomy: { silo: 'enrollment', tags: ['sep', 'special-enrollment', 'deadlines', 'part-b'] },
  },
  {
    href: '/medicare-general-enrollment-period.html',
    title: 'Medicare General Enrollment Period (GEP)',
    taxonomy: { silo: 'enrollment', tags: ['gep', 'general-enrollment', 'part-b', 'penalties', 'deadlines'] },
  },
  // Existing enrollment pages, registered so the cluster auto-interlinks:
  {
    href: '/medicare-open-enrollment-2026.html',
    title: 'Medicare Open Enrollment 2026 (AEP)',
    taxonomy: { silo: 'enrollment', tags: ['aep', 'oep', 'enrollment', 'deadlines'] },
  },
  {
    href: '/missed-medicare-enrollment.html',
    title: 'What Happens If You Miss Medicare Enrollment',
    taxonomy: { silo: 'enrollment', tags: ['penalties', 'missed', 'part-b', 'part-d', 'gep'] },
  },
  // ── Medigap silo (M9): HD Plan G gap + register Plan G vs N ──
  {
    href: '/medicare-plan-g-high-deductible.html',
    title: 'High-Deductible Medicare Supplement Plan G',
    taxonomy: { silo: 'medigap', tags: ['medigap', 'plan-g', 'high-deductible', 'costs'] },
  },
  {
    href: '/plan-g-vs-plan-n-vernal.html',
    title: 'Medicare Supplement Plan G vs Plan N',
    taxonomy: { silo: 'medigap', tags: ['medigap', 'plan-g', 'plan-n', 'comparison'] },
  },
  // ── Decision Tools (M9) ──
  {
    href: '/medicare-cost-estimator.html',
    title: 'Medicare Cost Estimator',
    taxonomy: { silo: 'costs-irmaa', tags: ['costs', 'tools', 'medigap', 'advantage'] },
  },
  {
    href: '/medicare-part-b-penalty-calculator.html',
    title: 'Part B Late Enrollment Penalty Calculator',
    taxonomy: { silo: 'enrollment', tags: ['penalties', 'part-b', 'tools', 'gep'] },
  },
  {
    href: '/medicare-enrollment-timeline.html',
    title: 'Medicare Enrollment Timeline Calculator',
    taxonomy: { silo: 'enrollment', tags: ['iep', 'timeline', 'tools', 'turning-65'] },
  },
  // ── Part D / Drug Assistance silo (M8) ──
  {
    href: '/prescription-drug-assistance.html',
    title: 'Prescription Drug Assistance on Medicare',
    taxonomy: { silo: 'part-d', tags: ['drug-assistance', 'part-d', 'extra-help', 'costs'], pillar: true },
  },
  // Drug pages generated from data/drugs.ts:
  ...FEATURED_DRUGS.map((d): PageIndexEntry => ({
    href: `/${d.slug}-assistance-program.html`,
    title: `${d.drug} Assistance Programs`,
    taxonomy: { silo: 'part-d', tags: ['drug-assistance', 'part-d', ...d.conditions] },
  })),
];
