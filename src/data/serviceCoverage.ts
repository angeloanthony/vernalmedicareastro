// ---------------------------------------------------------------------------
// src/data/serviceCoverage.ts — the services knowledge graph (M38).
//
// Single source of truth for the "does Medicare cover [service]?" cluster.
// Adding another service later = adding one record here; the hub and the
// [service] template pick it up automatically. Facts are YMYL — verified
// against Medicare.gov coverage pages. Cost-sharing is described in relative
// terms ("20% after the Part B deductible") rather than hard-coding dollar
// amounts that change yearly; the annual figures live in annualMedicareData.ts.
// ---------------------------------------------------------------------------

import type { ServiceCoverageEntry } from '../types/ServiceCoverage';

export const SERVICE_COVERAGE: ServiceCoverageEntry[] = [
  // ── Preventive & Wellness ────────────────────────────────────────────────
  {
    service: 'Preventive Services',
    slug: 'preventive-services',
    category: 'preventive',
    what: 'screenings, shots, and the yearly wellness visit',
    status: 'covered',
    coveredSummary: 'Yes — Medicare covers most preventive services at no cost to you.',
    coveredWhen:
      'The yearly "Wellness" visit, many cancer screenings (mammogram, colorectal, prostate), cardiovascular and diabetes screenings, a range of vaccines, and counseling are covered when you see a provider who accepts Medicare assignment.',
    whichPart: 'Part B covers preventive and screening services. Medicare Advantage plans must cover the same preventive services.',
    whatYouPay:
      'For most covered preventive services you pay nothing — no copay and no deductible — as long as the provider accepts assignment. A screening that turns into a diagnostic test or treatment can shift to normal Part B cost-sharing.',
    limits:
      'The "Welcome to Medicare" visit is a one-time benefit in your first 12 months on Part B; the yearly Wellness visit is separate. Neither is a head-to-toe physical exam — it is a prevention-planning visit.',
    related: ['mental-health', 'telehealth'],
    source: { title: 'Medicare.gov — preventive & screening services', url: 'https://www.medicare.gov/coverage/preventive-screening-services' },
  },
  {
    service: 'Mental Health Care',
    slug: 'mental-health',
    category: 'preventive',
    what: 'therapy, counseling, and psychiatric care',
    status: 'covered',
    coveredSummary: 'Yes — Medicare covers both outpatient and inpatient mental health care.',
    coveredWhen:
      'Part B covers a yearly depression screening, individual and group therapy, psychiatric evaluation, and medication management. As of 2024, licensed marriage and family therapists and mental health counselors can bill Medicare, widening the list of providers you can see.',
    whichPart: 'Part B covers outpatient mental health; Part A covers inpatient care in a hospital or psychiatric hospital.',
    whatYouPay:
      'For outpatient care you generally pay 20% of the Medicare-approved amount after the Part B deductible. The yearly depression screening is $0. Inpatient care follows the Part A hospital deductible and coinsurance.',
    limits:
      'A psychiatric hospital has a 190-day lifetime limit for inpatient care (this limit does not apply to a psychiatric unit inside a general hospital). Prescriptions you fill at a pharmacy are covered under Part D, not Part B.',
    related: ['preventive-services', 'telehealth'],
    source: { title: 'Medicare.gov — mental health care (outpatient)', url: 'https://www.medicare.gov/coverage/mental-health-care-outpatient' },
  },
  {
    service: 'Telehealth',
    slug: 'telehealth',
    category: 'preventive',
    what: 'doctor visits by video or phone',
    status: 'covered',
    coveredSummary: 'Yes — Medicare covers many services delivered by telehealth.',
    coveredWhen:
      'Behavioral and mental health visits, many office visits, and certain other services can be delivered by video (and in some cases audio-only). Some pandemic-era flexibilities have been extended by Congress; the rules for where you can be located and which services qualify continue to change.',
    whichPart: 'Part B covers telehealth. Medicare Advantage plans often offer additional telehealth benefits beyond what Original Medicare covers.',
    whatYouPay: 'You generally pay the same as an in-person visit — 20% of the Medicare-approved amount after the Part B deductible.',
    limits:
      'Because telehealth coverage has been governed by temporary extensions, the exact list of covered services and locations can change year to year. When it matters, confirm the current rule before your visit.',
    related: ['mental-health', 'preventive-services'],
    source: { title: 'Medicare.gov — telehealth', url: 'https://www.medicare.gov/coverage/telehealth' },
  },

  // ── Therapy & Specialists ────────────────────────────────────────────────
  {
    service: 'Physical Therapy',
    slug: 'physical-therapy',
    category: 'therapy',
    what: 'physical, occupational, and speech therapy',
    status: 'covered',
    coveredSummary: 'Yes — Medicare covers medically necessary physical, occupational, and speech therapy.',
    coveredWhen:
      'Outpatient therapy is covered when it is medically necessary and your provider certifies a plan of care. The old annual dollar "therapy cap" was eliminated — there is no longer a hard cap on covered therapy.',
    whichPart: 'Part B covers outpatient therapy. Part A covers therapy delivered as part of a covered inpatient or skilled nursing facility stay.',
    whatYouPay: 'You generally pay 20% of the Medicare-approved amount after the Part B deductible.',
    limits:
      'Although the dollar cap is gone, above a yearly threshold your therapist must confirm the care is still medically necessary (a targeted-review threshold), which can prompt Medicare to review the claim. Therapy must be skilled care, not general exercise.',
    related: ['skilled-nursing', 'durable-medical-equipment'],
    source: { title: 'Medicare.gov — physical therapy', url: 'https://www.medicare.gov/coverage/physical-therapy' },
  },
  {
    service: 'Chiropractic Care',
    slug: 'chiropractic',
    category: 'therapy',
    what: 'spinal manipulation by a chiropractor',
    status: 'limited',
    coveredSummary: 'Only in part — Medicare covers spinal manipulation, but not most other chiropractic services.',
    coveredWhen:
      'Part B covers manual manipulation of the spine by a chiropractor to correct a subluxation (a spinal joint that is out of position) when it is medically necessary.',
    whichPart: 'Part B.',
    whatYouPay: 'You pay 20% of the Medicare-approved amount for the covered manipulation after the Part B deductible.',
    limits:
      'Medicare does NOT cover the extras a chiropractor may offer — X-rays, massage therapy, acupuncture (except the narrow low-back-pain benefit), or maintenance visits once your condition has stabilized. Those are out-of-pocket.',
    related: ['acupuncture', 'physical-therapy'],
    source: { title: 'Medicare.gov — chiropractic services', url: 'https://www.medicare.gov/coverage/chiropractic-services' },
  },
  {
    service: 'Acupuncture',
    slug: 'acupuncture',
    category: 'therapy',
    what: 'acupuncture for chronic low back pain',
    status: 'limited',
    coveredSummary: 'Only for one condition — Medicare covers acupuncture solely for chronic low back pain.',
    coveredWhen:
      'Part B covers up to 12 acupuncture visits in 90 days for chronic low back pain (pain lasting 12+ weeks with no identifiable systemic cause). Up to 8 more visits are covered if you are improving — capped at 20 visits per year.',
    whichPart: 'Part B.',
    whatYouPay: 'You pay 20% of the Medicare-approved amount after the Part B deductible.',
    limits:
      'Acupuncture for any other condition — headaches, knee pain, nausea, anything but chronic low back pain — is not covered. Treatment must be stopped if your pain is not improving.',
    related: ['chiropractic', 'physical-therapy'],
    source: { title: 'Medicare.gov — acupuncture', url: 'https://www.medicare.gov/coverage/acupuncture' },
  },
  {
    service: 'Foot Care (Podiatry)',
    slug: 'foot-care',
    category: 'therapy',
    what: 'podiatry and medically necessary foot care',
    status: 'limited',
    coveredSummary: 'Sometimes — Medicare covers medically necessary foot care, but not routine foot care.',
    coveredWhen:
      'Part B covers foot care that is medically necessary — for example, treatment of injuries, foot problems tied to diabetes or nerve damage, and diabetic foot exams for people with diabetes-related nerve damage.',
    whichPart: 'Part B.',
    whatYouPay: 'You pay 20% of the Medicare-approved amount after the Part B deductible.',
    limits:
      'Routine foot care — cutting or removing corns and calluses, or trimming nails, for otherwise healthy feet — is generally NOT covered. A qualifying medical condition (such as diabetes with neuropathy) is what makes the same service covered.',
    related: ['preventive-services', 'physical-therapy'],
    source: { title: 'Medicare.gov — foot care', url: 'https://www.medicare.gov/coverage/foot-care' },
  },

  // ── Facility & End-of-Life Care ──────────────────────────────────────────
  {
    service: 'Skilled Nursing Facility Care',
    slug: 'skilled-nursing',
    category: 'facility',
    what: 'short-term skilled care after a hospital stay',
    status: 'conditional',
    coveredSummary: 'Yes, but short-term only — Medicare covers a skilled nursing facility stay after a qualifying hospital stay.',
    coveredWhen:
      'Part A covers up to 100 days of skilled nursing facility (SNF) care per benefit period when you have a qualifying inpatient hospital stay of at least 3 days and need daily skilled care (skilled nursing or therapy) for a condition treated during that stay.',
    whichPart: 'Part A.',
    whatYouPay:
      'Days 1–20 are fully covered. Days 21–100 carry a daily coinsurance amount. After day 100 in a benefit period, you pay all costs. (The exact daily amounts change yearly — see our costs page.)',
    limits:
      'The 3-day rule counts inpatient days only — time spent "under observation" does not count, a common and expensive surprise. Medicare does NOT cover long-term custodial (non-skilled) care, which is the biggest misunderstanding about nursing homes.',
    related: ['physical-therapy', 'hospice'],
    source: { title: 'Medicare.gov — skilled nursing facility care', url: 'https://www.medicare.gov/coverage/skilled-nursing-facility-snf-care' },
  },
  {
    service: 'Hospice Care',
    slug: 'hospice',
    category: 'facility',
    what: 'comfort care for a terminal illness',
    status: 'covered',
    coveredSummary: 'Yes — Medicare covers hospice care for a terminal illness, at little or no cost.',
    coveredWhen:
      'Part A covers hospice when a doctor certifies you are terminally ill (a life expectancy of 6 months or less) and you choose comfort care over care aimed at curing the illness. It covers nursing, medical equipment, drugs for symptom control, aide and homemaker services, counseling, and respite care.',
    whichPart: 'Part A.',
    whatYouPay:
      'You pay nothing for hospice care itself. You may pay a small copay (up to $5) for each prescription for symptom control, and 5% for inpatient respite care.',
    limits:
      'Once you elect the hospice benefit, Medicare stops paying for treatment intended to cure the terminal illness (you keep coverage for unrelated conditions). You can leave hospice and return to standard Medicare at any time.',
    related: ['skilled-nursing', 'mental-health'],
    source: { title: 'Medicare.gov — hospice care', url: 'https://www.medicare.gov/coverage/hospice-care' },
  },

  // ── Equipment & Transport ────────────────────────────────────────────────
  {
    service: 'Durable Medical Equipment',
    slug: 'durable-medical-equipment',
    category: 'equipment',
    what: 'wheelchairs, walkers, oxygen, hospital beds, CPAP',
    status: 'covered',
    coveredSummary: 'Yes — Medicare covers durable medical equipment (DME) that is medically necessary.',
    coveredWhen:
      'Part B covers equipment your doctor prescribes for use in your home — wheelchairs and walkers, hospital beds, oxygen equipment, CPAP machines, blood-sugar monitors, and more — when it is medically necessary and expected to last at least 3 years.',
    whichPart: 'Part B.',
    whatYouPay: 'You generally pay 20% of the Medicare-approved amount after the Part B deductible. Some items are rented, some purchased.',
    limits:
      'You must use a supplier that is enrolled in Medicare and accepts assignment, or you can pay much more. Equipment mainly for comfort or convenience — and most home modifications like grab bars or stairlifts — is not covered.',
    related: ['physical-therapy', 'ambulance'],
    source: { title: 'Medicare.gov — durable medical equipment', url: 'https://www.medicare.gov/coverage/durable-medical-equipment-dme-coverage' },
  },
  {
    service: 'Ambulance Services',
    slug: 'ambulance',
    category: 'equipment',
    what: 'emergency (and limited non-emergency) ambulance transport',
    status: 'conditional',
    coveredSummary: 'Yes, when it is medically necessary — Medicare covers emergency ambulance transport.',
    coveredWhen:
      'Part B covers ground ambulance transport to the nearest appropriate facility when other transportation could endanger your health. Limited non-emergency transport is covered when a doctor documents it is medically necessary; air ambulance is covered when ground transport cannot safely or quickly reach care.',
    whichPart: 'Part B.',
    whatYouPay: 'You pay 20% of the Medicare-approved amount after the Part B deductible.',
    limits:
      'Medicare covers transport to the nearest appropriate facility — if you choose a farther one, you may owe the difference. Transport for convenience, or when your condition does not require an ambulance, is not covered.',
    related: ['durable-medical-equipment', 'skilled-nursing'],
    source: { title: 'Medicare.gov — ambulance services', url: 'https://www.medicare.gov/coverage/ambulance-services' },
  },
];
