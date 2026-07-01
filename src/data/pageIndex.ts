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
  {
    href: '/medicare-irmaa-calculator.html',
    title: '2026 Medicare IRMAA Calculator',
    taxonomy: { silo: 'costs-irmaa', tags: ['irmaa', 'costs', 'part-b', 'part-d'] },
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
];
