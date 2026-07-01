// ---------------------------------------------------------------------------
// src/data/turning65.ts — the "turning 65" journey (M30).
//
// The ordered steps of aging into Medicare. Powers the Turning-65 Center hub
// (timeline + checklist) and any future wizard/reminder tool. Each step links to
// an existing Vernal pillar or calculator — this file is the orchestrator, not
// new duplicate content. Types in types/Turning65.ts.
// ---------------------------------------------------------------------------

import type { Turning65Step } from '../types/Turning65';

export const TURNING_65_STEPS: Turning65Step[] = [
  {
    id: 'window-opens',
    when: '3 months before your 65th-birthday month',
    title: 'Your enrollment window opens',
    task: 'Your Initial Enrollment Period (IEP) is a 7-month window — the 3 months before your birthday month, the month itself, and the 3 months after. Signing up in the first 3 months gets your coverage started the soonest.',
    relatedHref: 'medicare-enrollment-periods.html', relatedLabel: 'Medicare enrollment periods',
    calculatorHref: 'medicare-enrollment-timeline.html', calculatorLabel: 'find your exact dates',
    nextStep: 'Before you enroll, check your employer coverage (next).',
  },
  {
    id: 'employer-coverage',
    when: 'Before you enroll',
    task: 'If you (or your spouse) still have active, creditable employer coverage, you may be able to delay Part B without a penalty and get a Special Enrollment Period later. If you don’t, enroll on time to avoid permanent penalties. Retiree and COBRA coverage usually do NOT count — check before you delay.',
    title: 'Check your employer coverage',
    relatedHref: 'medicare-special-enrollment-period.html', relatedLabel: 'Special Enrollment Period & creditable coverage',
    nextStep: 'Decide whether to enroll now or delay — then sign up for Part A & B.',
  },
  {
    id: 'sign-up-a-b',
    when: 'During your IEP',
    title: 'Sign up for Part A and Part B',
    task: 'Enroll through Social Security (online, by phone, or in person). Part A is usually premium-free; Part B has a monthly premium. This is your foundation — everything else builds on it.',
    relatedHref: 'medicare-part-a-vs-part-b.html', relatedLabel: 'Part A vs Part B',
    nextStep: 'Now choose how to cover Original Medicare’s gaps.',
  },
  {
    id: 'choose-path',
    when: 'The big decision',
    title: 'Choose your path: Medigap or Medicare Advantage',
    task: 'Original Medicare alone has gaps (no drug coverage, no out-of-pocket cap). You fill them one of two ways: Original Medicare + a Medigap policy + a Part D plan, or an all-in-one Medicare Advantage plan. This is the most consequential choice — and the hardest to reverse later.',
    relatedHref: 'medicare-supplement-vs-advantage.html', relatedLabel: 'Medigap vs Medicare Advantage',
    nextStep: 'If you lean Medigap → step 6. If you lean Advantage → step 7.',
  },
  {
    id: 'medigap',
    when: 'If you choose Medigap',
    title: 'Pick a Medigap plan while you have guaranteed issue',
    task: 'Your 6-month Medigap Open Enrollment starts when your Part B does — during it, insurers can’t deny you or charge more for health reasons. It’s the best time to lock in Plan G or Plan N. Miss it and Utah generally allows medical underwriting.',
    relatedHref: 'plan-g-vs-plan-n-vernal.html', relatedLabel: 'Plan G vs Plan N',
    calculatorHref: 'medicare-cost-estimator.html', calculatorLabel: 'estimate Medigap costs',
    nextStep: 'Add a Part D drug plan (step 8).',
  },
  {
    id: 'advantage',
    when: 'If you choose Medicare Advantage',
    title: 'Compare Medicare Advantage plans',
    task: 'Advantage plans bundle everything (usually including drugs) and cap your yearly out-of-pocket, often for a $0 premium — but they use networks. Verify your doctors, hospital, and pharmacy are in-network before you enroll, especially in the rural Basin.',
    relatedHref: 'best-medicare-advantage-vernal.html', relatedLabel: 'Best Medicare Advantage plans',
    nextStep: 'Advantage usually includes drug coverage — but confirm it covers your meds (step 8).',
  },
  {
    id: 'part-d',
    when: 'Everyone taking medications',
    title: 'Get Part D drug coverage that fits your prescriptions',
    task: 'With Medigap you add a standalone Part D plan; with Advantage it’s usually built in. Either way, the cheapest premium is rarely the cheapest plan — match the formulary and preferred pharmacy to your exact medication list.',
    relatedHref: 'best-part-d-plans-vernal.html', relatedLabel: 'Best Part D plans',
    nextStep: 'Now put real numbers to it.',
  },
  {
    id: 'costs',
    when: 'Know your numbers',
    title: 'Estimate your costs — and check IRMAA',
    task: 'Add up your Part B premium, any Part D and supplement premiums, and expected out-of-pocket. Higher earners also pay an income surcharge (IRMAA) on Part B and Part D — worth checking before you finalize.',
    relatedHref: 'medicare-costs.html', relatedLabel: 'Medicare costs',
    calculatorHref: 'medicare-cost-estimator.html', calculatorLabel: 'run the cost estimator',
    nextStep: 'You’re set — coverage begins on schedule.',
  },
  {
    id: 'coverage-begins',
    when: 'Your birthday month',
    title: 'Coverage begins',
    task: 'If you signed up during the 3 months before your birthday month, coverage starts the 1st of your birthday month. Keep your Medicare card and plan materials handy, and confirm your doctors and pharmacy have your new info.',
    nextStep: 'Then review your plan every year.',
  },
  {
    id: 'annual-review',
    when: 'Every year after',
    title: 'Review at Annual Enrollment (Oct 15 – Dec 7)',
    task: 'Plans change their formularies, premiums, and networks every year — so the plan that fit you at 65 may not fit you at 66. A free yearly review during AEP keeps you in the best plan for your current doctors and medications.',
    relatedHref: 'medicare-open-enrollment-2026.html', relatedLabel: 'Medicare Open Enrollment',
    nextStep: 'That’s the whole journey — and we’re here for all of it.',
  },
];
