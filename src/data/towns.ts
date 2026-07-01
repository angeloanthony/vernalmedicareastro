// ---------------------------------------------------------------------------
// src/data/towns.ts — SINGLE SOURCE OF TRUTH for the 'local' silo town pages.
//
// Write the data once; pages/medicare-[town]-utah.astro renders one page per
// entry, and pageIndex spreads these in for automatic Related links. The two
// deep flagships (Roosevelt, Duchesne) stay as bespoke standalone pages — this
// file is for the smaller net-new towns whose pages are driven by structured
// data. Do NOT add 'roosevelt' or 'duchesne' here (their slugs already exist).
//
// VERIFY BEFORE PUBLISH (per Town.ts): zips and any named pharmacies are local
// specifics — confirm with the agent. County, hospital, and geography below are
// the high-confidence facts that give each page real local authority.
// ---------------------------------------------------------------------------

import type { Town } from '../types/Town';

export const TOWNS: Town[] = [
  {
    slug: 'naples',
    name: 'Naples',
    county: 'Uintah County',
    region: 'uintah',
    hospital: 'Ashley Regional Medical Center',
    hospitalCity: 'Vernal',
    distanceFromOffice: 'just a few minutes from our Vernal office',
    nearby: ['Vernal', 'Maeser'],
    intro:
      'Naples sits right alongside Vernal, so for Medicare help you are effectively local to our office — in-person meetings are only minutes away.',
    zips: ['84078'],
    faqs: [
      {
        question: 'Is there a Medicare agent near Naples, Utah?',
        answer:
          'Yes. Vernal Medicare is just minutes from Naples. We help Naples residents compare Medicare Advantage, Medigap, and Part D plans for free — by phone, video, or in person.',
      },
      {
        question: 'Which hospital do Naples residents use?',
        answer:
          'Most Naples residents use Ashley Regional Medical Center in Vernal. When we compare Medicare Advantage plans, we confirm your doctors and Ashley Regional are in-network before you enroll.',
      },
    ],
  },
  {
    slug: 'maeser',
    name: 'Maeser',
    county: 'Uintah County',
    region: 'uintah',
    hospital: 'Ashley Regional Medical Center',
    hospitalCity: 'Vernal',
    distanceFromOffice: 'about five minutes from our Vernal office',
    nearby: ['Vernal'],
    intro:
      'Maeser is just north of Vernal, which means fast, in-person Medicare help is right around the corner whenever you want it.',
    zips: ['84078'],
    faqs: [
      {
        question: 'Can Maeser residents get in-person Medicare help?',
        answer:
          'Absolutely. Our Vernal office is about five minutes from Maeser. You can also handle everything by phone or video if that is easier — the help and the cost (free) are the same either way.',
      },
      {
        question: 'What Medicare plans are available in Maeser?',
        answer:
          'Maeser residents can choose Medicare Advantage (HMO/PPO), Medigap (Plan G and Plan N), and Part D drug plans. Availability changes each year; we compare the current options at no cost.',
      },
    ],
  },
  {
    slug: 'jensen',
    name: 'Jensen',
    county: 'Uintah County',
    region: 'uintah',
    hospital: 'Ashley Regional Medical Center',
    hospitalCity: 'Vernal',
    distanceFromOffice: 'about 15 minutes east of Vernal on US-40',
    nearby: ['Vernal', 'Naples'],
    intro:
      'Jensen sits east of Vernal near Dinosaur National Monument — a short drive in for a meeting, or full Medicare help by phone and video without leaving home.',
    zips: ['84035'],
    faqs: [
      {
        question: 'Is there local Medicare help for Jensen, Utah?',
        answer:
          'Yes. Jensen is about 15 minutes from our Vernal office on US-40. We help Jensen residents compare and enroll in Medicare plans for free, in person or remotely.',
      },
      {
        question: 'Do Jensen residents have to drive to Vernal to enroll?',
        answer:
          'No. Everything — plan comparisons, drug-cost checks, and enrollment — can be done by phone or video. Some Jensen clients prefer the short drive in; it is your choice.',
      },
    ],
  },
  {
    slug: 'ballard',
    name: 'Ballard',
    county: 'Uintah County',
    region: 'duchesne',
    hospital: 'Uintah Basin Healthcare',
    hospitalCity: 'Roosevelt',
    distanceFromOffice: 'out toward Roosevelt, on the west end of the Uintah Basin',
    nearby: ['Roosevelt', 'Fort Duchesne'],
    intro:
      'Ballard sits out by Roosevelt on the west end of the Basin, closer to Uintah Basin Healthcare than to Vernal — and we serve the whole area, in person or remotely.',
    zips: ['84066'],
    faqs: [
      {
        question: 'Is there a Medicare agent serving Ballard, Utah?',
        answer:
          'Yes. Vernal Medicare serves Ballard and the whole Roosevelt area. Most Ballard residents start with a phone or video call; we can also arrange to meet. Plan comparisons and enrollment help are always free.',
      },
      {
        question: 'Which hospital do Ballard residents use?',
        answer:
          'Ballard residents are closest to Uintah Basin Healthcare in Roosevelt. When comparing Medicare Advantage plans, we verify that your providers and Uintah Basin Healthcare are in-network before you enroll.',
      },
    ],
  },
];
