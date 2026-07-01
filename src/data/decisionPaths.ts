// ---------------------------------------------------------------------------
// src/data/decisionPaths.ts — the seven starting points (M39).
//
// Single source of truth for the Decision Center's situation router. Every
// primary/href here MUST point at a page that already exists — this layer only
// routes into hubs we've built. Order = rough frequency of the question.
// ---------------------------------------------------------------------------

import type { DecisionPath } from '../types/DecisionPath';

export const DECISION_PATHS: DecisionPath[] = [
  {
    id: 'turning-65',
    situation: 'I’m turning 65',
    blurb: 'New to Medicare — you want to know what to do and when.',
    primary: { label: 'Start the turning-65 walkthrough', href: '/turning-65.html' },
    links: [
      { label: 'When to enroll (Utah)', href: '/when-to-enroll-medicare-utah.html' },
      { label: 'Medigap vs Advantage — the big choice', href: '/medicare-supplement-vs-advantage.html' },
      { label: 'Enrollment timeline calculator', href: '/medicare-enrollment-timeline.html' },
    ],
  },
  {
    id: 'still-working',
    situation: 'I’m still working past 65',
    blurb: 'You have employer coverage and need to know whether to enroll or delay.',
    primary: { label: 'Open the Working Past 65 Center', href: '/working-past-65.html' },
    links: [
      { label: 'Medicare & employer coverage', href: '/medicare-and-employer-coverage.html' },
      { label: 'Should you delay Part B?', href: '/delaying-medicare-part-b.html' },
      { label: 'Part B late-penalty calculator', href: '/medicare-part-b-penalty-calculator.html' },
    ],
  },
  {
    id: 'already-have',
    situation: 'I already have Medicare',
    blurb: 'You’re enrolled and want to review, switch, or check what’s covered.',
    primary: { label: 'Review your plan for 2026', href: '/medicare-open-enrollment-2026.html' },
    links: [
      { label: 'Does Medicare cover it? (by service)', href: '/medicare-coverage.html' },
      { label: 'Dental, vision & hearing', href: '/medicare-dental-vision-hearing.html' },
      { label: 'Compare Medigap vs Advantage', href: '/medicare-supplement-vs-advantage.html' },
    ],
  },
  {
    id: 'drug-help',
    situation: 'I need prescription drug help',
    blurb: 'You want to know if a drug is covered, or find a better Part D plan.',
    primary: { label: 'Find the best Part D plan', href: '/best-part-d-plans-vernal.html' },
    links: [
      { label: 'Does Medicare cover my drug?', href: '/medicare-drug-coverage.html' },
      { label: 'Help paying for prescriptions', href: '/prescription-drug-assistance.html' },
      { label: 'Part D cost calculator', href: '/medicare-part-d-cost-calculator.html' },
    ],
  },
  {
    id: 'financial-help',
    situation: 'I need help paying for Medicare',
    blurb: 'You’re on a fixed or lower income and want to lower your costs.',
    primary: { label: 'See Medicare Savings Programs', href: '/medicare-savings-programs-utah.html' },
    links: [
      { label: 'Extra Help for drug costs', href: '/medicare-extra-help-utah.html' },
      { label: 'Dual-eligible (Medicare + Medicaid)', href: '/dual-eligible.html' },
      { label: 'Extra Help eligibility calculator', href: '/medicare-extra-help-calculator.html' },
    ],
  },
  {
    id: 'compare-plans',
    situation: 'I want to compare plans',
    blurb: 'You’re weighing Medigap against Medicare Advantage.',
    primary: { label: 'Compare Medigap vs Advantage', href: '/medicare-supplement-vs-advantage.html' },
    links: [
      { label: 'Medigap (Medicare Supplement)', href: '/medigap.html' },
      { label: 'Medicare Advantage', href: '/best-medicare-advantage-vernal.html' },
      { label: 'Plan G vs Plan N', href: '/plan-g-vs-plan-n-vernal.html' },
    ],
  },
  {
    id: 'estimate-costs',
    situation: 'I want to estimate my costs',
    blurb: 'You want the numbers — premiums, IRMAA, drug costs, penalties.',
    primary: { label: 'Open the calculator toolkit', href: '/medicare-calculators.html' },
    links: [
      { label: 'How much does Medicare cost?', href: '/medicare-costs.html' },
      { label: 'Cost estimator', href: '/medicare-cost-estimator.html' },
      { label: 'IRMAA calculator', href: '/medicare-irmaa-calculator.html' },
    ],
  },
];
