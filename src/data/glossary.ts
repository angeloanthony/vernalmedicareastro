// ---------------------------------------------------------------------------
// src/data/glossary.ts — SINGLE SOURCE OF TRUTH for the Medicare glossary (M29).
//
// ~45 high-value terms. Definitions lead with a plain-language answer (for people
// and AI search), then the Medicare-specific detail, and link to the Vernal page
// that owns the topic. Add terms here; the glossary index + any future per-term
// pages render from this file. Types in types/Glossary.ts.
// ---------------------------------------------------------------------------

import type { GlossaryTerm } from '../types/Glossary';

export const GLOSSARY: GlossaryTerm[] = [
  // ── Enrollment & Timing ──────────────────────────────────────────────────
  {
    term: 'Initial Enrollment Period (IEP)', slug: 'iep', category: 'enrollment',
    short: 'Your first chance to sign up for Medicare — a 7-month window around your 65th birthday.',
    full: 'The IEP runs from 3 months before the month you turn 65, through your birthday month, to 3 months after. Signing up in the first 3 months gets coverage started the fastest. Missing it can trigger permanent late penalties.',
    authorityHref: 'medicare-enrollment-periods.html', authorityLabel: 'Medicare enrollment periods',
    calculatorHref: 'medicare-enrollment-timeline.html', related: ['gep', 'sep', 'late-enrollment-penalty'],
  },
  {
    term: 'General Enrollment Period (GEP)', slug: 'gep', category: 'enrollment',
    short: 'A yearly Jan 1–Mar 31 window to sign up for Part B if you missed your first chance.',
    full: 'If you didn’t enroll in Part B when first eligible and don’t qualify for a Special Enrollment Period, you use the GEP. A late-enrollment penalty usually applies for as long as you have Part B.',
    authorityHref: 'medicare-general-enrollment-period.html', authorityLabel: 'General Enrollment Period',
    related: ['iep', 'sep', 'late-enrollment-penalty'],
  },
  {
    term: 'Special Enrollment Period (SEP)', slug: 'sep', category: 'enrollment',
    short: 'A penalty-free window to enroll or change plans after a qualifying life event.',
    full: 'Events like losing employer coverage, moving out of a plan’s area, or qualifying for Extra Help open a SEP. It lets you enroll outside the normal windows without a late penalty.',
    authorityHref: 'medicare-special-enrollment-period.html', authorityLabel: 'Special Enrollment Period',
    related: ['iep', 'gep', 'creditable-coverage'],
  },
  {
    term: 'Annual Enrollment Period (AEP)', slug: 'aep', category: 'enrollment',
    short: 'Oct 15–Dec 7 each year, when anyone on Medicare can change plans for January 1.',
    full: 'During AEP you can switch Medicare Advantage plans, move between Advantage and Original Medicare, or change Part D drug plans. Formularies, premiums, and networks change yearly, so it’s the time for a free plan review.',
    authorityHref: 'medicare-open-enrollment-2026.html', authorityLabel: 'Medicare Open Enrollment',
    related: ['oep'],
  },
  {
    term: 'Medicare Advantage Open Enrollment (OEP)', slug: 'oep', category: 'enrollment',
    short: 'Jan 1–Mar 31, when Advantage members can make one change.',
    full: 'If you’re already in a Medicare Advantage plan, the OEP lets you switch to a different Advantage plan or drop back to Original Medicare with a Part D plan — one change per year.',
    authorityHref: 'medicare-open-enrollment-2026.html', authorityLabel: 'Open Enrollment',
    related: ['aep'],
  },
  {
    term: 'Creditable Coverage', slug: 'creditable-coverage', category: 'enrollment',
    short: 'Other drug or health coverage at least as good as Medicare’s — it protects you from late penalties.',
    full: 'If you keep creditable coverage (like an active employer plan) past 65, you can delay Medicare without a penalty and get a Special Enrollment Period later. Keep the notice your plan sends proving it’s creditable.',
    authorityHref: 'medicare-special-enrollment-period.html', authorityLabel: 'Special Enrollment Period',
    related: ['sep', 'late-enrollment-penalty'],
  },
  {
    term: 'Late Enrollment Penalty', slug: 'late-enrollment-penalty', category: 'enrollment',
    short: 'A permanent surcharge for signing up for Part B or Part D too late.',
    full: 'Part B adds 10% to your premium for each full 12 months you could have had it but didn’t; Part D adds about 1% of the national base premium per uncovered month. Both usually last as long as you have the coverage.',
    authorityHref: 'medicare-part-b-penalty-calculator.html', authorityLabel: 'Part B penalty calculator',
    calculatorHref: 'medicare-part-b-penalty-calculator.html', related: ['gep', 'creditable-coverage'],
  },
  {
    term: 'Guaranteed Issue', slug: 'guaranteed-issue', category: 'enrollment',
    short: 'Times when a Medigap insurer must sell you a policy without health questions.',
    full: 'During your Medigap Open Enrollment (the 6 months after your Part B starts at 65) and certain guaranteed-issue situations, insurers can’t deny you or charge more for health reasons. Outside those windows, Utah generally allows medical underwriting.',
    authorityHref: 'medigap.html', authorityLabel: 'Medigap',
    related: ['medigap', 'iep'],
  },

  // ── Costs & IRMAA ────────────────────────────────────────────────────────
  {
    term: 'Premium', slug: 'premium', category: 'costs',
    short: 'The monthly amount you pay to have a coverage — whether or not you use it.',
    full: 'Most people pay no Part A premium; Part B has a standard monthly premium (higher earners pay more via IRMAA). Part D, Medigap, and Medicare Advantage may have their own premiums on top.',
    authorityHref: 'medicare-costs.html', authorityLabel: 'Medicare costs',
    related: ['deductible', 'irmaa'],
  },
  {
    term: 'Deductible', slug: 'deductible', category: 'costs',
    short: 'What you pay out of pocket before your coverage starts paying.',
    full: 'Medicare has separate deductibles — a Part A hospital deductible per benefit period and a smaller annual Part B deductible. Part D and Advantage plans may have their own drug deductibles.',
    authorityHref: 'medicare-costs.html', authorityLabel: 'Medicare costs',
    related: ['coinsurance', 'copayment', 'premium'],
  },
  {
    term: 'Coinsurance', slug: 'coinsurance', category: 'costs',
    short: 'Your share of a cost as a percentage — often 20% under Original Medicare Part B.',
    full: 'After you meet the deductible, Original Medicare typically pays 80% of the approved amount for Part B services and you pay the remaining 20% — with no cap, which is why many people add Medigap or Medicare Advantage.',
    authorityHref: 'medicare-costs.html', authorityLabel: 'Medicare costs',
    related: ['copayment', 'deductible', 'moop'],
  },
  {
    term: 'Copayment', slug: 'copayment', category: 'costs',
    short: 'A flat dollar amount you pay for a service or prescription (e.g. $20 for a visit).',
    full: 'Copays are common in Medicare Advantage and Part D plans — a set amount per office visit, specialist, or drug tier — instead of a percentage. Predictable, but they add up with frequent care.',
    authorityHref: 'medicare-costs.html', authorityLabel: 'Medicare costs',
    related: ['coinsurance', 'deductible'],
  },
  {
    term: 'IRMAA', slug: 'irmaa', category: 'costs',
    short: 'An income-based surcharge added to Part B and Part D premiums for higher earners.',
    full: 'The Income-Related Monthly Adjustment Amount uses your income (MAGI) from two years ago. Above the year’s threshold, you pay extra on both Part B and Part D. A life-changing event lets you appeal with Form SSA-44.',
    authorityHref: 'medicare-irmaa.html', authorityLabel: 'IRMAA explained',
    calculatorHref: 'medicare-irmaa-calculator.html', related: ['magi', 'premium'],
  },
  {
    term: 'MAGI', slug: 'magi', category: 'costs',
    short: 'Modified Adjusted Gross Income — the income figure that decides your IRMAA.',
    full: 'MAGI is your adjusted gross income plus tax-exempt interest. Social Security uses your MAGI from two years prior to set any IRMAA surcharge, which is why a one-time income spike can raise your premiums later.',
    authorityHref: 'medicare-irmaa.html', authorityLabel: 'IRMAA',
    related: ['irmaa'],
  },
  {
    term: 'Out-of-Pocket Maximum (MOOP)', slug: 'moop', category: 'costs',
    short: 'A yearly cap on what you pay for covered care — Medicare Advantage has one; Original Medicare does not.',
    full: 'Every Medicare Advantage plan caps your in-network out-of-pocket spending for the year. Original Medicare alone has no cap, which is why people add Medigap or choose Advantage for protection.',
    authorityHref: 'medicare-out-of-pocket-maximum-2026.html', authorityLabel: 'Out-of-pocket maximum',
    related: ['coinsurance', 'medicare-advantage'],
  },
  {
    term: 'Coverage Gap (Donut Hole)', slug: 'coverage-gap', category: 'costs',
    short: 'A former Part D phase of higher drug costs — replaced in 2026 by a $2,000 out-of-pocket cap.',
    full: 'The old “donut hole” is gone. Now once your out-of-pocket drug spending reaches the annual cap ($2,000 in 2026), you pay nothing more for covered drugs the rest of the year.',
    authorityHref: 'best-part-d-plans-vernal.html', authorityLabel: 'Part D plans',
    related: ['part-d', 'formulary'],
  },

  // ── Plans & Parts ────────────────────────────────────────────────────────
  {
    term: 'Original Medicare', slug: 'original-medicare', category: 'plans',
    short: 'The federal program — Part A (hospital) and Part B (medical) — you get directly from Medicare.',
    full: 'With Original Medicare you can see any provider nationwide that accepts Medicare, with no networks. It has no drug coverage and no out-of-pocket cap, so most people add Part D and either Medigap or choose Medicare Advantage instead.',
    authorityHref: 'medicare-part-a-vs-part-b.html', authorityLabel: 'Part A vs Part B',
    related: ['part-a', 'part-b', 'medigap', 'medicare-advantage'],
  },
  {
    term: 'Medicare Part A', slug: 'part-a', category: 'plans',
    short: 'Hospital insurance — inpatient stays, skilled nursing, hospice. Usually premium-free.',
    full: 'Part A covers inpatient hospital care, skilled nursing facility care after a qualifying stay, hospice, and some home health. Most people pay no premium because they or a spouse paid Medicare taxes for 10+ years.',
    authorityHref: 'medicare-part-a-vs-part-b.html', authorityLabel: 'Part A vs Part B',
    related: ['part-b', 'original-medicare', 'snf'],
  },
  {
    term: 'Medicare Part B', slug: 'part-b', category: 'plans',
    short: 'Medical insurance — doctor visits, outpatient care, preventive services. Has a monthly premium.',
    full: 'Part B covers doctors, outpatient care, durable medical equipment, and preventive services. It has a standard monthly premium (higher with IRMAA) and an annual deductible, then usually 20% coinsurance.',
    authorityHref: 'medicare-part-a-vs-part-b.html', authorityLabel: 'Part A vs Part B',
    related: ['part-a', 'premium', 'irmaa'],
  },
  {
    term: 'Medicare Part C (Medicare Advantage)', slug: 'medicare-advantage', category: 'plans',
    short: 'An all-in-one private plan that replaces Original Medicare, often with extras and a $0 premium.',
    full: 'Advantage plans bundle Part A, B, and usually D, plus extras like dental and vision, and cap your yearly out-of-pocket. The trade-off is provider networks and possible referrals. Availability and networks matter locally.',
    authorityHref: 'best-medicare-advantage-vernal.html', authorityLabel: 'Medicare Advantage',
    related: ['hmo', 'ppo', 'moop', 'medigap'],
  },
  {
    term: 'Medicare Part D', slug: 'part-d', category: 'plans',
    short: 'Prescription drug coverage — a standalone plan or built into a Medicare Advantage plan.',
    full: 'Part D covers prescriptions through a plan’s formulary and pharmacy network. Costs vary a lot by plan and pharmacy; in 2026 out-of-pocket drug spending is capped at $2,000.',
    authorityHref: 'best-part-d-plans-vernal.html', authorityLabel: 'Part D plans',
    related: ['formulary', 'drug-tier', 'coverage-gap'],
  },
  {
    term: 'Medigap (Medicare Supplement)', slug: 'medigap', category: 'plans',
    short: 'A policy that pairs with Original Medicare to pay its out-of-pocket gaps.',
    full: 'Medigap covers cost-sharing like coinsurance and deductibles, so you can see any Medicare provider nationwide with predictable costs and no networks. You add a separate Part D plan. Plan G and Plan N are the most popular.',
    authorityHref: 'medigap.html', authorityLabel: 'Medigap',
    related: ['plan-g', 'plan-n', 'guaranteed-issue', 'medicare-advantage'],
  },
  {
    term: 'HMO', slug: 'hmo', category: 'plans',
    short: 'A Medicare Advantage plan that uses an in-network-only model, often with referrals.',
    full: 'HMO Advantage plans usually require you to use in-network providers and get referrals to see specialists — lower cost in exchange for less flexibility. Out-of-network care is generally only covered for emergencies.',
    authorityHref: 'hmo-vs-ppo-medicare-advantage.html', authorityLabel: 'HMO vs PPO',
    related: ['ppo', 'medicare-advantage', 'network'],
  },
  {
    term: 'PPO', slug: 'ppo', category: 'plans',
    short: 'A Medicare Advantage plan that lets you go out-of-network at higher cost.',
    full: 'PPO Advantage plans don’t usually require referrals and cover out-of-network care at a higher share of cost — more flexibility than an HMO, often for a higher premium.',
    authorityHref: 'hmo-vs-ppo-medicare-advantage.html', authorityLabel: 'HMO vs PPO',
    related: ['hmo', 'medicare-advantage', 'network'],
  },
  {
    term: 'Special Needs Plan (SNP)', slug: 'snp', category: 'plans',
    short: 'A Medicare Advantage plan tailored to a specific group — like people with both Medicare and Medicaid.',
    full: 'SNPs limit membership to people who share a condition or situation. The most common locally is the D-SNP, for people who are dual-eligible (Medicare + Medicaid), with benefits coordinated for that group.',
    authorityHref: 'd-snp-plans-utah.html', authorityLabel: 'D-SNP plans',
    related: ['d-snp', 'dual-eligible'],
  },
  {
    term: 'Plan G', slug: 'plan-g', category: 'plans',
    short: 'The most comprehensive Medigap plan for new enrollees — covers nearly everything but the Part B deductible.',
    full: 'After you pay the annual Part B deductible, Plan G covers your Medicare cost-sharing at 100%. A High-Deductible version trades a much lower premium for a high annual deductible.',
    authorityHref: 'plan-g-vs-plan-n-vernal.html', authorityLabel: 'Plan G vs Plan N',
    related: ['plan-n', 'medigap'],
  },
  {
    term: 'Plan N', slug: 'plan-n', category: 'plans',
    short: 'A lower-premium Medigap plan with small copays at visits and the ER.',
    full: 'Plan N covers most Medigap gaps for a lower premium than Plan G, in exchange for small office and ER copays and not covering Part B excess charges.',
    authorityHref: 'plan-g-vs-plan-n-vernal.html', authorityLabel: 'Plan G vs Plan N',
    related: ['plan-g', 'medigap', 'excess-charges'],
  },

  // ── Financial Assistance ─────────────────────────────────────────────────
  {
    term: 'Extra Help (Low-Income Subsidy)', slug: 'extra-help', category: 'assistance',
    short: 'A federal program that lowers or eliminates Part D premiums, deductibles, and drug copays.',
    full: 'Extra Help (the Part D Low-Income Subsidy) can dramatically cut what you pay for prescriptions. Many who qualify never apply; if you have Medicaid, SSI, or a Medicare Savings Program you may qualify automatically.',
    authorityHref: 'medicare-extra-help-utah.html', authorityLabel: 'Extra Help',
    related: ['msp', 'dual-eligible', 'part-d'],
  },
  {
    term: 'Medicare Savings Programs (MSP)', slug: 'msp', category: 'assistance',
    short: 'State programs that pay your Part B premium — and can unlock Extra Help automatically.',
    full: 'MSPs (QMB, SLMB, QI) help with Medicare costs based on income and resources. Qualifying for one also enrolls you in Extra Help for drug costs. Limits are higher than many people expect.',
    authorityHref: 'medicare-savings-programs-utah.html', authorityLabel: 'Medicare Savings Programs',
    related: ['qmb', 'slmb', 'qi', 'extra-help'],
  },
  {
    term: 'QMB (Qualified Medicare Beneficiary)', slug: 'qmb', category: 'assistance',
    short: 'The most generous Medicare Savings Program — pays Part A/B premiums, deductibles, and coinsurance.',
    full: 'QMB has the lowest income limit of the MSPs and the biggest benefit: it covers your Part B premium and most Medicare cost-sharing, and providers can’t bill you for covered services.',
    authorityHref: 'medicare-savings-programs-utah.html', authorityLabel: 'Medicare Savings Programs',
    related: ['msp', 'slmb', 'qi'],
  },
  {
    term: 'SLMB (Specified Low-Income Medicare Beneficiary)', slug: 'slmb', category: 'assistance',
    short: 'A Medicare Savings Program that pays your Part B premium (higher income limit than QMB).',
    full: 'SLMB pays the Part B premium for people slightly above the QMB income limit, and qualifies you for Extra Help. It doesn’t cover other cost-sharing the way QMB does.',
    authorityHref: 'medicare-savings-programs-utah.html', authorityLabel: 'Medicare Savings Programs',
    related: ['msp', 'qmb', 'qi'],
  },
  {
    term: 'QI (Qualifying Individual)', slug: 'qi', category: 'assistance',
    short: 'A Medicare Savings Program that pays the Part B premium for a slightly higher income range.',
    full: 'QI pays your Part B premium and unlocks Extra Help, with the highest income limit of the three main MSPs. It’s first-come, first-served each year and you must re-apply.',
    authorityHref: 'medicare-savings-programs-utah.html', authorityLabel: 'Medicare Savings Programs',
    related: ['msp', 'qmb', 'slmb'],
  },
  {
    term: 'Dual Eligible', slug: 'dual-eligible', category: 'assistance',
    short: 'Having both Medicare and Medicaid — which together cover most of your costs.',
    full: 'If you qualify for both programs, Medicaid can pay Medicare premiums and cost-sharing, you usually get Extra Help automatically, and a D-SNP can coordinate everything in one plan.',
    authorityHref: 'dual-eligible.html', authorityLabel: 'Dual-eligible',
    related: ['d-snp', 'medicaid', 'extra-help', 'msp'],
  },
  {
    term: 'Medicaid', slug: 'medicaid', category: 'assistance',
    short: 'A joint state-federal program that helps with health costs for people with limited income.',
    full: 'In Utah, Medicaid can work alongside Medicare — paying premiums and cost-sharing for dual-eligible beneficiaries and opening the door to D-SNP plans and Extra Help.',
    authorityHref: 'medicare-medicaid-utah.html', authorityLabel: 'Medicare & Medicaid in Utah',
    related: ['dual-eligible', 'd-snp'],
  },
  {
    term: 'D-SNP (Dual-Eligible Special Needs Plan)', slug: 'd-snp', category: 'assistance',
    short: 'A Medicare Advantage plan built for people who have both Medicare and Medicaid.',
    full: 'A D-SNP coordinates Medicare and Medicaid benefits in one plan, often with extra benefits like transportation, OTC allowances, and dental, at little or no cost to dual-eligible members.',
    authorityHref: 'd-snp-plans-utah.html', authorityLabel: 'D-SNP plans',
    related: ['dual-eligible', 'snp', 'medicaid'],
  },

  // ── Coverage & Drugs ─────────────────────────────────────────────────────
  {
    term: 'Formulary', slug: 'formulary', category: 'coverage',
    short: 'A plan’s list of covered drugs, organized into cost tiers.',
    full: 'Every Part D and Advantage drug plan has its own formulary. The same drug can sit on different tiers (and cost very different amounts) from plan to plan, so matching the formulary to your medications is key.',
    authorityHref: 'best-part-d-plans-vernal.html', authorityLabel: 'Part D plans',
    related: ['drug-tier', 'part-d', 'prior-authorization'],
  },
  {
    term: 'Drug Tier', slug: 'drug-tier', category: 'coverage',
    short: 'A level within a formulary that sets your copay — lower tiers cost less.',
    full: 'Formularies group drugs into tiers, from Tier 1 (generics, cheapest) to specialty tiers (most expensive). A drug on Tier 2 in one plan might be Tier 4 in another, with a very different copay.',
    authorityHref: 'tier-3-vs-tier-4-medicare-part-d.html', authorityLabel: 'Tier 3 vs Tier 4',
    related: ['formulary', 'part-d'],
  },
  {
    term: 'Prior Authorization', slug: 'prior-authorization', category: 'coverage',
    short: 'A plan’s requirement to approve a drug or service before it’s covered.',
    full: 'Some drugs and services need the plan’s OK first. It’s common in Medicare Advantage and for higher-tier drugs. Your doctor submits the request; if denied, you can appeal.',
    authorityHref: 'best-medicare-advantage-vernal.html', authorityLabel: 'Medicare Advantage',
    related: ['step-therapy', 'formulary'],
  },
  {
    term: 'Step Therapy', slug: 'step-therapy', category: 'coverage',
    short: 'A rule requiring you to try a lower-cost drug before the plan covers a pricier one.',
    full: 'Under step therapy, the plan asks you to “step through” a preferred, usually cheaper drug first. If it doesn’t work or isn’t appropriate, your doctor can request an exception for the drug you need.',
    authorityHref: 'best-part-d-plans-vernal.html', authorityLabel: 'Part D plans',
    related: ['prior-authorization', 'formulary'],
  },
  {
    term: 'Network', slug: 'network', category: 'coverage',
    short: 'The doctors, hospitals, and pharmacies a plan contracts with for the best cost.',
    full: 'Medicare Advantage plans use networks (HMO or PPO); Original Medicare + Medigap has no network — any Medicare provider works. In rural areas, verifying your providers are in-network matters a lot.',
    authorityHref: 'hmo-vs-ppo-medicare-advantage.html', authorityLabel: 'HMO vs PPO',
    related: ['hmo', 'ppo', 'medicare-advantage'],
  },
  {
    term: 'Assignment', slug: 'assignment', category: 'coverage',
    short: 'When a provider agrees to accept Medicare’s approved amount as full payment.',
    full: 'Providers who “accept assignment” bill Medicare directly and can’t charge you more than the Medicare-approved amount (beyond your deductible/coinsurance). Most providers accept assignment.',
    authorityHref: 'medicare-part-a-vs-part-b.html', authorityLabel: 'Part A vs Part B',
    related: ['excess-charges', 'coinsurance'],
  },
  {
    term: 'Part B Excess Charges', slug: 'excess-charges', category: 'coverage',
    short: 'An extra amount (up to 15%) a non-participating provider can bill above Medicare’s rate.',
    full: 'A provider who doesn’t accept assignment can charge up to 15% over the Medicare-approved amount. Medigap Plan G covers these excess charges; Plan N does not.',
    authorityHref: 'plan-g-vs-plan-n-vernal.html', authorityLabel: 'Plan G vs Plan N',
    related: ['assignment', 'plan-g', 'plan-n'],
  },
  {
    term: 'Skilled Nursing Facility (SNF) Care', slug: 'snf', category: 'coverage',
    short: 'Short-term rehab or nursing care Part A covers after a qualifying hospital stay.',
    full: 'Medicare Part A can cover skilled nursing care after a qualifying inpatient hospital stay — fully for the first 20 days, then with daily coinsurance. It’s short-term recovery care, not long-term custodial care.',
    authorityHref: 'medicare-part-a-vs-part-b.html', authorityLabel: 'Part A vs Part B',
    related: ['part-a', 'coinsurance'],
  },
];
