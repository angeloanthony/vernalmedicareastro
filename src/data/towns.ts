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
  {
    slug: 'myton',
    name: 'Myton',
    county: 'Duchesne County',
    region: 'duchesne',
    hospital: 'Uintah Basin Healthcare',
    hospitalCity: 'Roosevelt',
    distanceFromOffice: 'along the US-40 corridor between Roosevelt and Duchesne, on the west end of the Basin',
    nearby: ['Roosevelt', 'Duchesne'],
    intro:
      'Myton sits right on US-40 between Roosevelt and Duchesne. Local Medicare help is scarce out here, so most Myton residents work with us by phone or video — or meet when it suits them.',
    faqs: [
      {
        question: 'Is there Medicare help for Myton, Utah?',
        answer:
          'Yes. Vernal Medicare serves Myton and the whole Duchesne County corridor. Plan comparisons and enrollment help are free — by phone, video, or in person.',
      },
      {
        question: 'Which hospital do Myton residents use?',
        answer:
          'Uintah Basin Healthcare in Roosevelt is the nearest hospital for Myton. We confirm it and your doctors are in-network before you pick a Medicare Advantage plan.',
      },
    ],
  },
  {
    slug: 'tabiona',
    name: 'Tabiona',
    county: 'Duchesne County',
    region: 'duchesne',
    hospital: 'Uintah Basin Healthcare',
    hospitalCity: 'Roosevelt',
    distanceFromOffice: 'in the rural northwest corner of Duchesne County',
    nearby: ['Duchesne', 'Hanna'],
    intro:
      'Tabiona is a small, rural community in northwest Duchesne County where in-person insurance help is hard to come by. We make Medicare easy from wherever you are — by phone or video, on your schedule.',
    faqs: [
      {
        question: 'Can Tabiona residents get Medicare help remotely?',
        answer:
          'Absolutely. Most Tabiona clients handle everything by phone or video — comparisons, drug-cost checks, and enrollment. It is free and there is no need to travel.',
      },
      {
        question: 'What Medicare plans are available in Tabiona?',
        answer:
          'Tabiona residents can choose Medicare Advantage (HMO/PPO), Medigap (Plan G and Plan N), and Part D drug plans. We compare the current options for your doctors and medications at no cost.',
      },
    ],
  },
  {
    slug: 'altamont',
    name: 'Altamont',
    county: 'Duchesne County',
    region: 'duchesne',
    hospital: 'Uintah Basin Healthcare',
    hospitalCity: 'Roosevelt',
    distanceFromOffice: 'in the Upper Country north of Roosevelt',
    nearby: ['Roosevelt', 'Neola', 'Bluebell'],
    intro:
      'Altamont sits in the "Upper Country" north of Roosevelt. We help Altamont-area families sort out Medicare without a long drive — most of it happens by phone or video, and we can meet when you want to.',
    faqs: [
      {
        question: 'Is there a Medicare agent near Altamont, Utah?',
        answer:
          'Yes. Vernal Medicare serves Altamont and the Upper Country. Free plan comparisons and enrollment help, by phone, video, or in person.',
      },
      {
        question: 'Which hospital do Altamont residents use?',
        answer:
          'Uintah Basin Healthcare in Roosevelt is the closest hospital. We verify it and your providers are covered before you choose a Medicare Advantage plan.',
      },
    ],
  },
  {
    slug: 'neola',
    name: 'Neola',
    county: 'Duchesne County',
    region: 'duchesne',
    hospital: 'Uintah Basin Healthcare',
    hospitalCity: 'Roosevelt',
    distanceFromOffice: 'in the Upper Country north of Roosevelt',
    nearby: ['Roosevelt', 'Altamont'],
    intro:
      'Neola is a rural community north of Roosevelt in the Upper Country. Medicare shouldn’t require a trip to the city — we handle it with Neola residents by phone, video, or in person, at no cost.',
    faqs: [
      {
        question: 'Can Neola residents enroll in Medicare without driving to town?',
        answer:
          'Yes. Enrollment, plan comparisons, and drug-cost checks can all be done by phone or video. Some Neola clients prefer to meet in person — that is your choice.',
      },
      {
        question: 'Does it cost anything to work with a local agent?',
        answer:
          'No. Our help is free — we’re paid by the carriers, and it doesn’t change your premium. You get an independent comparison instead of one company’s pitch.',
      },
    ],
  },
  {
    slug: 'fort-duchesne',
    name: 'Fort Duchesne',
    county: 'Uintah County',
    region: 'duchesne',
    hospital: 'Uintah Basin Healthcare',
    hospitalCity: 'Roosevelt',
    distanceFromOffice: 'between Roosevelt and Vernal on the Uintah & Ouray Reservation',
    nearby: ['Roosevelt', 'Ballard'],
    intro:
      'Fort Duchesne sits between Roosevelt and Vernal on the Uintah & Ouray Reservation. We serve the whole community with free, respectful Medicare help — by phone, video, or in person.',
    faqs: [
      {
        question: 'Is there local Medicare help for Fort Duchesne?',
        answer:
          'Yes. Vernal Medicare serves Fort Duchesne and the surrounding area. Plan comparisons and enrollment help are always free, in person or remotely.',
      },
      {
        question: 'Which hospital do Fort Duchesne residents use?',
        answer:
          'Uintah Basin Healthcare in Roosevelt is the nearest hospital. When comparing Medicare Advantage plans, we make sure your providers are in-network first.',
      },
    ],
  },
  {
    slug: 'ouray',
    name: 'Ouray',
    county: 'Uintah County',
    region: 'duchesne',
    hospital: 'Uintah Basin Healthcare',
    hospitalCity: 'Roosevelt',
    distanceFromOffice: 'in the remote south of Uintah County, near the Green River',
    nearby: ['Fort Duchesne', 'Randlett'],
    intro:
      'Ouray is a small, remote community in southern Uintah County. Distance shouldn’t keep you from good Medicare help — we work with Ouray-area residents by phone and video, and can arrange to meet.',
    faqs: [
      {
        question: 'Can Ouray residents get Medicare help without a long drive?',
        answer:
          'Yes. Everything — comparisons, drug-cost checks, and enrollment — can be handled by phone or video, at no cost to you.',
      },
      {
        question: 'What Medicare plans work in Ouray, Utah?',
        answer:
          'Ouray residents can access Medicare Advantage, Medigap, and Part D drug plans. We compare the current options against your doctors and medications for free.',
      },
    ],
  },
];
