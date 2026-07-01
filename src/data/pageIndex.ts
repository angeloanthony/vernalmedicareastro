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
import { TOWNS } from './towns';

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
    taxonomy: { silo: 'local', tags: ['local', 'vernal', 'uintah-county', 'overview', 'original-medicare'], pillar: true },
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
  // ── Costs pillar hub (M11) — silo head that ties the costs spokes together ──
  {
    href: '/medicare-costs.html',
    title: 'How Much Does Medicare Cost?',
    taxonomy: { silo: 'costs-irmaa', tags: ['costs', 'part-a', 'part-b', 'part-d', 'irmaa', 'overview'], pillar: true },
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
    taxonomy: { silo: 'medigap', tags: ['medigap', 'supplement', 'overview', 'vernal', 'original-medicare'], pillar: true },
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
  {
    href: '/medicare-checklist-2026.html',
    title: 'Your 2026 Medicare Checklist',
    taxonomy: { silo: 'enrollment', tags: ['checklist', 'enrollment', 'deadlines', 'turning-65'] },
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
  // ── Vernal home-turf cluster (M14) — migrated onto the framework ──
  {
    href: '/vernal.html',
    title: 'Vernal Medicare — Local, Licensed Help',
    taxonomy: { silo: 'local', tags: ['local', 'vernal', 'uintah-county', 'overview'] },
  },
  {
    href: '/medicare-agent-vernal.html',
    title: 'Medicare Agent in Vernal, Utah (Rocco DeLuca)',
    taxonomy: { silo: 'local', tags: ['local', 'vernal', 'agent', 'uintah-county', 'trust'] },
  },
  {
    href: '/medicare-help-vernal.html',
    title: 'Who Helps with Medicare in Vernal, Utah?',
    taxonomy: { silo: 'local', tags: ['local', 'vernal', 'help', 'uintah-county'] },
  },
  {
    href: '/medicare-enrollment-vernal.html',
    title: 'Medicare Enrollment Help in Vernal, Utah',
    taxonomy: { silo: 'local', tags: ['local', 'vernal', 'enrollment', 'uintah-county'] },
  },
  // Local tools / office (M22):
  {
    href: '/medicare-quote-vernal.html',
    title: 'Get a Free Medicare Quote — Vernal',
    taxonomy: { silo: 'local', tags: ['local', 'quote', 'tools', 'vernal', 'uintah-county'] },
  },
  {
    href: '/free-medicare-comparison-vernal.html',
    title: 'Free Medicare Plan Comparison — Vernal',
    taxonomy: { silo: 'local', tags: ['local', 'comparison', 'tools', 'vernal', 'uintah-county'] },
  },
  {
    href: '/medicare-vernal-ut.html',
    title: "Visit Vernal Medicare at Smith's Pharmacy",
    taxonomy: { silo: 'local', tags: ['local', 'vernal', 'office', 'uintah-county'] },
  },
  // ── Local silo (M12) — flagship migrations; blueprint for future towns ──
  {
    href: '/medicare-roosevelt-utah.html',
    title: 'Medicare Plans in Roosevelt, Utah',
    taxonomy: { silo: 'local', tags: ['local', 'roosevelt', 'duchesne-county', 'overview', 'original-medicare'] },
  },
  {
    href: '/medicare-duchesne-utah.html',
    title: 'Medicare Agent Serving Duchesne, Utah',
    taxonomy: { silo: 'local', tags: ['local', 'duchesne', 'duchesne-county', 'overview', 'original-medicare'] },
  },
  // Town pages generated from data/towns.ts (M13):
  ...TOWNS.map((t): PageIndexEntry => ({
    href: `/medicare-${t.slug}-utah.html`,
    title: `Medicare in ${t.name}, Utah`,
    taxonomy: {
      silo: 'local',
      tags: ['local', t.slug, t.county.toLowerCase().replace(/\s+/g, '-'), 'overview', 'original-medicare'],
    },
  })),
  // ── Medicare Advantage silo (M16) — high commercial intent ──
  {
    href: '/best-medicare-advantage-vernal.html',
    title: 'Best Medicare Advantage Plans in Vernal, Utah',
    taxonomy: { silo: 'medicare-advantage', tags: ['medicare-advantage', 'advantage', 'vernal', 'uintah-county', 'local'], pillar: true },
  },
  {
    href: '/zero-premium-medicare-advantage.html',
    title: '$0 Premium Medicare Advantage Plans in Uintah County',
    taxonomy: { silo: 'medicare-advantage', tags: ['medicare-advantage', 'advantage', 'zero-premium', 'uintah-county', 'costs'] },
  },
  {
    href: '/hmo-vs-ppo-medicare-advantage.html',
    title: 'HMO vs PPO Medicare Advantage in Vernal',
    taxonomy: { silo: 'medicare-advantage', tags: ['medicare-advantage', 'advantage', 'hmo', 'ppo', 'comparison', 'vernal'] },
  },
  {
    href: '/medicare-advantage-vs-medigap-vernal.html',
    title: 'Medicare Advantage vs Medigap in Vernal',
    taxonomy: { silo: 'medicare-advantage', tags: ['medicare-advantage', 'advantage', 'medigap', 'comparison', 'vernal', 'local'] },
  },
  // ── Trust silo (M21) — E-E-A-T: agent bio, FAQ, reviews ──
  {
    href: '/about.html',
    title: 'About Vernal Medicare (Rocco DeLuca)',
    taxonomy: { silo: 'trust', tags: ['trust', 'about', 'agent', 'vernal', 'uintah-county'], pillar: true },
  },
  {
    href: '/faq.html',
    title: 'Medicare & Health Insurance FAQ — Vernal',
    taxonomy: { silo: 'trust', tags: ['trust', 'faq', 'local', 'vernal', 'uintah-county'] },
  },
  {
    href: '/reviews.html',
    title: 'Client Reviews — Vernal Medicare',
    taxonomy: { silo: 'trust', tags: ['trust', 'reviews', 'local', 'vernal'] },
  },
  // ── Providers silo (M15) — local hospitals & pharmacies (E-E-A-T) ──
  {
    href: '/medicare-hospitals-uintah-county.html',
    title: 'Medicare Coverage for Hospitals in Uintah County',
    taxonomy: { silo: 'providers', tags: ['providers', 'hospital', 'uintah-county', 'local', 'overview'], pillar: true },
  },
  {
    href: '/medicare-ashley-regional-vernal.html',
    title: 'Medicare Coverage at Ashley Regional Medical Center',
    taxonomy: { silo: 'providers', tags: ['providers', 'hospital', 'ashley-regional', 'vernal', 'uintah-county', 'local'] },
  },
  {
    href: '/medicare-uintah-basin-medical-center.html',
    title: 'Medicare Plans for Uintah Basin Healthcare',
    taxonomy: { silo: 'providers', tags: ['providers', 'hospital', 'uintah-basin-healthcare', 'roosevelt', 'duchesne-county', 'local'] },
  },
  {
    href: '/medicare-vernal-pharmacies.html',
    title: 'Medicare Plans Accepted at Vernal Pharmacies',
    taxonomy: { silo: 'providers', tags: ['providers', 'pharmacy', 'part-d', 'vernal', 'uintah-county', 'local'] },
  },
  // ── Part D / Drug Assistance silo (M8) ──
  {
    href: '/prescription-drug-assistance.html',
    title: 'Prescription Drug Assistance on Medicare',
    taxonomy: { silo: 'part-d', tags: ['drug-assistance', 'part-d', 'extra-help', 'costs'], pillar: true },
  },
  // Part-D commercial trio (M18):
  {
    href: '/best-part-d-plans-vernal.html',
    title: 'Best Medicare Part D Plans in Vernal, Utah',
    taxonomy: { silo: 'part-d', tags: ['part-d', 'best-plans', 'drugs', 'vernal', 'uintah-county', 'local'] },
  },
  {
    href: '/cheapest-prescription-drug-plans.html',
    title: 'Cheapest Prescription Drug Plans in Vernal',
    taxonomy: { silo: 'part-d', tags: ['part-d', 'cheapest', 'costs', 'drugs', 'vernal', 'local'] },
  },
  {
    href: '/tier-3-vs-tier-4-medicare-part-d.html',
    title: 'Tier 3 vs Tier 4 Drugs on Medicare Part D',
    taxonomy: { silo: 'part-d', tags: ['part-d', 'formulary', 'tiers', 'drugs', 'costs'] },
  },
  // Drug pages generated from data/drugs.ts:
  ...FEATURED_DRUGS.map((d): PageIndexEntry => ({
    href: `/${d.slug}-assistance-program.html`,
    title: `${d.drug} Assistance Programs`,
    taxonomy: { silo: 'part-d', tags: ['drug-assistance', 'part-d', ...d.conditions] },
  })),
];
