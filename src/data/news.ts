// ---------------------------------------------------------------------------
// src/data/news.ts — Medicare Intelligence Center articles (M31).
//
// Structured news: each article answers what changed / who's affected / what to
// do / learn more, and links into the authority clusters. Add articles here;
// the news index, category views, and per-article pages render from this file.
// Types in types/News.ts. VERIFY dates/figures against CMS/SSA on each update.
// ---------------------------------------------------------------------------

import type { NewsArticle } from '../types/News';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'part-d-2000-cap',
    title: 'The $2,000 Part D Drug Cap Is Now in Effect',
    category: 'part-d',
    published: '2026-01-05',
    lifecycle: 'current',
    featured: true,
    dek: 'Out-of-pocket spending on covered prescriptions is now capped at $2,000 a year — the old “donut hole” is gone.',
    whatChanged: 'Starting in 2025 and continuing in 2026, Medicare caps what you pay out of pocket for covered Part D drugs at $2,000 for the year. Once you hit it, covered prescriptions cost you nothing for the rest of the year. The old coverage-gap “donut hole” no longer applies.',
    whoAffected: 'Anyone with high prescription costs on a Part D plan or a Medicare Advantage plan with drug coverage — especially people on specialty or brand-name drugs who used to hit the donut hole.',
    whatToDo: 'You don’t have to do anything to get the cap — it applies automatically. But it’s still worth a yearly plan review, because premiums and formularies change even with the cap in place. You can also spread costs monthly with the payment-plan option.',
    learnMoreHref: 'best-part-d-plans-vernal.html', learnMoreLabel: 'Best Part D plans',
    related: [{ href: 'prescription-drug-assistance.html', label: 'Prescription drug assistance' }, { href: 'medicare-glossary.html#coverage-gap', label: 'What was the donut hole?' }],
    source: { title: 'Medicare.gov — drug coverage (Part D)', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    slug: 'insulin-35-cap',
    title: 'Insulin Is Capped at $35 a Month',
    category: 'costs',
    published: '2026-01-05',
    lifecycle: 'current',
    dek: 'Covered insulin costs no more than $35 for a month’s supply — with no deductible to meet first.',
    whatChanged: 'Medicare caps your copay for a covered insulin product at $35 per month, and you don’t have to meet the Part D deductible first. The cap applies at the pharmacy on both Part D and Medicare Advantage drug plans.',
    whoAffected: 'Anyone on Medicare who uses insulin.',
    whatToDo: 'Check that your specific insulin is on your plan’s formulary — the $35 cap applies to covered products. If yours isn’t covered well, a yearly plan review can find one that covers it at the capped price.',
    learnMoreHref: 'insulin-cost-medicare-vernal.html', learnMoreLabel: 'Insulin costs on Medicare',
    related: [{ href: 'best-part-d-plans-vernal.html', label: 'Best Part D plans' }],
    source: { title: 'Medicare.gov — Medicare costs', url: 'https://www.medicare.gov/basics/costs/medicare-costs' },
  },
  {
    slug: 'medicare-advantage-changes-2026',
    title: 'What’s Changing with Medicare Advantage in 2026',
    category: 'coverage',
    published: '2026-01-10',
    lifecycle: 'current',
    dek: 'Advantage plans adjust benefits, networks, and premiums every year — and some plans leave certain areas.',
    whatChanged: 'For 2026, many Medicare Advantage plans changed their extra benefits, provider networks, drug formularies, and out-of-pocket maximums; some plans exited certain counties. This happens every year — the plan that fit you last year may not this year.',
    whoAffected: 'Everyone in a Medicare Advantage plan, especially in rural areas where plan availability and networks shift more.',
    whatToDo: 'Read your plan’s Annual Notice of Change (mailed each fall) and compare during the Annual Enrollment Period (Oct 15–Dec 7). Confirm your doctors, hospital, and pharmacy are still in-network before you keep or switch a plan.',
    learnMoreHref: 'best-medicare-advantage-vernal.html', learnMoreLabel: 'Medicare Advantage plans',
    calculatorHref: 'medicare-cost-estimator.html', calculatorLabel: 'compare costs',
    related: [{ href: 'medicare-open-enrollment-2026.html', label: 'Annual Enrollment Period' }, { href: 'medicare-supplement-vs-advantage.html', label: 'Medigap vs Advantage' }],
    source: { title: 'Medicare.gov — find & compare plans', url: 'https://www.medicare.gov/plan-compare' },
  },
  {
    slug: 'glp-1-drugs-medicare',
    title: 'GLP-1 Drugs and Medicare: What’s Covered in 2026',
    category: 'part-d',
    published: '2026-02-01',
    lifecycle: 'current',
    dek: 'Medicare covers GLP-1 medications for approved medical conditions — but not for weight loss alone.',
    whatChanged: 'GLP-1 drugs (like Ozempic, Mounjaro, and similar) remain covered under Part D when prescribed for an approved condition such as type 2 diabetes, or in some cases to reduce cardiovascular risk. Coverage for weight loss alone remains limited, and the policy debate continues.',
    whoAffected: 'People prescribed a GLP-1 medication — coverage depends on your diagnosis and your plan’s formulary.',
    whatToDo: 'Check whether your specific drug and diagnosis are covered on your plan’s formulary, and what tier it’s on. If costs are high, ask about manufacturer and foundation assistance programs.',
    learnMoreHref: 'prescription-drug-assistance.html', learnMoreLabel: 'Prescription drug assistance',
    related: [{ href: 'best-part-d-plans-vernal.html', label: 'Best Part D plans' }, { href: 'tier-3-vs-tier-4-medicare-part-d.html', label: 'Drug tiers explained' }],
    source: { title: 'Medicare.gov — drug coverage', url: 'https://www.medicare.gov/drug-coverage-part-d' },
  },
  {
    slug: 'extra-help-expanded',
    title: 'More People Now Qualify for Extra Help',
    category: 'assistance',
    published: '2026-01-15',
    lifecycle: 'current',
    dek: 'The full Extra Help drug subsidy now reaches more moderate-income beneficiaries — and many still don’t apply.',
    whatChanged: 'The Part D Low-Income Subsidy (Extra Help) was expanded so the full benefit now reaches people at a higher income level than before. Extra Help can eliminate the Part D premium and deductible and sharply cut drug copays.',
    whoAffected: 'Lower- and moderate-income beneficiaries on Part D — many who qualify have never applied and are leaving hundreds or thousands of dollars on the table.',
    whatToDo: 'Apply free through Social Security, or let us check your eligibility. If you have Medicaid, SSI, or a Medicare Savings Program, you may qualify for Extra Help automatically.',
    learnMoreHref: 'medicare-extra-help-utah.html', learnMoreLabel: 'Extra Help',
    related: [{ href: 'medicare-savings-programs-utah.html', label: 'Medicare Savings Programs' }, { href: 'dual-eligible.html', label: 'Dual-eligible' }],
    source: { title: 'SSA — Extra Help with Medicare drug costs', url: 'https://www.ssa.gov/medicare/part-d-extra-help' },
  },
  {
    slug: 'medicare-scam-calls',
    title: 'Medicare Scam Calls: How to Protect Yourself',
    category: 'alerts',
    published: '2026-01-20',
    lifecycle: 'current',
    dek: 'Medicare will not cold-call you for your number. If someone does, hang up.',
    whatChanged: 'Scam calls, texts, and door knocks impersonating “Medicare” or offering free gifts, braces, or DNA tests remain common — often spiking around enrollment season. Medicare and legitimate agents follow strict rules and do not cold-call to sell you a plan.',
    whoAffected: 'Every Medicare beneficiary — scammers target this group year-round.',
    whatToDo: 'Never give your Medicare Number, Social Security Number, or bank info to an unsolicited caller. Medicare won’t call you out of the blue. When in doubt, hang up and call a person you trust — like us — or 1-800-MEDICARE directly.',
    learnMoreHref: 'medicare-agent-credentials.html', learnMoreLabel: 'How to know you’re working with a real agent',
    related: [{ href: 'editorial-policy.html', label: 'How we keep you informed' }],
    source: { title: 'Medicare.gov — reporting fraud & abuse', url: 'https://www.medicare.gov/basics/reporting-medicare-fraud-and-abuse' },
  },
];
