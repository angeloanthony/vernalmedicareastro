// tests/observation-window.test.ts — automates decision D8, the link-dark rule
// for EXP-003's observation window (docs/PRESCRIPTION-ASSISTANCE-PROJECT.md §31).
//
// D8 in one line: while the observation window is open, no page in the frozen
// `does-medicare-cover-*` cohort may GAIN an inbound link, because a link added
// mid-experiment is a confounder that cannot be separated from the treatment
// afterwards. Batch 2 already fired that confounder once; Batches 3 and 4 were
// built link-dark by hand. This file replaces the hand-grep with an assertion,
// so a future batch cannot reintroduce the problem by accident.
//
// Two things this file is careful NOT to do:
//
//   • It does not invent a second cohort list. Cohort MEMBERSHIP is DRUG_COVERAGE
//     itself — the baseline defines the cohort as "14 pages rendered from
//     src/pages/does-medicare-cover-[drug].astro", and that route's
//     getStaticPaths is exactly DRUG_COVERAGE. So membership is read from the
//     code that produces the pages, not copied. Only the two-page CONTROL arm is
//     named here, because arm assignment exists nowhere in code; it is asserted
//     against the cohort so a drifting membership cannot pass silently.
//   • It does not treat pre-observation links as violations. The six links that
//     already existed when the window opened are recorded below as a frozen
//     baseline; the test fails on links that are NEW relative to that, not on
//     links that were always there.
//
// When the window closes, the linking pass is a deliberate, separately logged
// intervention (D8) — at that point update PRE_OBSERVATION_LINKS in the same
// commit that adds the links, and say so in docs/seo/WORK-LOG.md.

import { describe, it, expect } from 'vitest';
import { MEDICATION_ASSISTANCE } from '../src/data/medicationAssistance';
import { DRUG_COVERAGE } from '../src/data/drugCoverage';

/** The control arm, per the baseline's arm table
 *  (docs/seo/baselines/drug-coverage-cohort-2026-07-30.md §3–§4). Everything
 *  else in DRUG_COVERAGE is treated. */
const CONTROL_SLUGS = ['trelegy', 'zepbound'] as const;

const page = (slug: string) => `does-medicare-cover-${slug}`;
const control = CONTROL_SLUGS.map(page);
const treated = DRUG_COVERAGE.filter((e) => !CONTROL_SLUGS.includes(e.slug as never)).map((e) => page(e.slug));
const cohort = new Set([...treated, ...control]);

/**
 * Links from a medication-assistance record into the coverage cohort that
 * ALREADY EXISTED when the observation window opened (2026-07-30). Recorded
 * from source during the Phase 1 reconciliation, 2026-08-26.
 *
 * Only cohort pages appear here. Mounjaro and Ozempic also link to coverage
 * pages (`does-medicare-cover-mounjaro-utah`, `does-medicare-cover-ozempic-wegovy`),
 * but those two pages are NOT cohort members, so they are outside D8 and are
 * deliberately not listed.
 */
const PRE_OBSERVATION_LINKS: Record<string, string[]> = {
  eliquis: ['does-medicare-cover-eliquis'],
  entresto: ['does-medicare-cover-entresto'],
  farxiga: ['does-medicare-cover-farxiga'],
  jardiance: ['does-medicare-cover-jardiance'],
  repatha: ['does-medicare-cover-repatha'],
  xarelto: ['does-medicare-cover-xarelto'],
};

/** Every string reachable from a record — prose, hrefs, related resources. */
function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

/** Coverage pages a record links to, by page name (deduplicated). */
function coverageLinks(record: unknown): string[] {
  const found = new Set<string>();
  for (const s of strings(record)) {
    for (const m of s.matchAll(/\/(does-medicare-cover-[a-z0-9-]+)\.html/g)) found.add(m[1]);
  }
  return [...found].sort();
}

describe('EXP-003 observation window — cohort definition', () => {
  it('matches the frozen cohort the baseline recorded', () => {
    // The cohort is frozen for the duration of the window. If DRUG_COVERAGE
    // gains or loses an entry, the experiment's population changed underneath
    // it and the September read-out is no longer comparing what it measured.
    expect(cohort.size, 'cohort size').toBe(14);
    expect(treated.length, 'treated arm').toBe(12);
    expect(control.length, 'control arm').toBe(2);
  });

  it('still contains both control pages', () => {
    const slugs = DRUG_COVERAGE.map((e) => e.slug);
    for (const c of CONTROL_SLUGS) expect(slugs, `control page ${c}`).toContain(c);
  });
});

describe('EXP-003 observation window — D8 link-dark', () => {
  it('adds no NEW inbound link to any cohort page', () => {
    const violations: string[] = [];
    for (const r of MEDICATION_ASSISTANCE) {
      const allowed = new Set(PRE_OBSERVATION_LINKS[r.slug] ?? []);
      for (const target of coverageLinks(r)) {
        if (!cohort.has(target)) continue; // not in the experiment — D8 is silent
        if (!allowed.has(target)) {
          violations.push(
            `${r.slug} links to /${target}.html — a NEW inbound link into the frozen cohort. ` +
              'D8: link-dark holds until the observation window closes.',
          );
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('never links into the control arm', () => {
    // The control arm is the whole reason the experiment can be read at all.
    // A single link here invalidates the comparison, so it is asserted apart
    // from the general rule and has no baseline exemption.
    const hits: string[] = [];
    for (const r of MEDICATION_ASSISTANCE) {
      for (const target of coverageLinks(r)) {
        if (control.includes(target)) hits.push(`${r.slug} -> /${target}.html`);
      }
    }
    expect(hits).toEqual([]);
  });

  it('does not flag the pre-observation links as violations', () => {
    // Guards the guard: if this drops to zero, the baseline has drifted out of
    // sync with the records and the test above has quietly stopped proving
    // anything about the six links it is meant to tolerate.
    const stillPresent = Object.entries(PRE_OBSERVATION_LINKS).filter(([slug, targets]) => {
      const r = MEDICATION_ASSISTANCE.find((x) => x.slug === slug);
      return r && targets.every((t) => coverageLinks(r).includes(t));
    });
    expect(stillPresent.length).toBe(Object.keys(PRE_OBSERVATION_LINKS).length);
  });

  it('adds no NEW coverage → assistance link (the other direction)', () => {
    // The cohort pages link out to assistance pages through `assistanceSlug` in
    // data/drugCoverage.ts. Those links predate the window; what D8 forbids is
    // a NEW one appearing on a cohort page — including on a control page, which
    // has none and must keep none.
    const withAssistance = DRUG_COVERAGE
      .filter((e) => cohort.has(`does-medicare-cover-${e.slug}`) && e.assistanceSlug)
      .map((e) => e.slug)
      .sort();
    expect(withAssistance).toEqual([
      'dupixent', 'eliquis', 'enbrel', 'entresto', 'farxiga', 'humira',
      'jardiance', 'repatha', 'rinvoq', 'skyrizi', 'trulicity', 'xarelto',
    ]);

    const controlWithAssistance = DRUG_COVERAGE
      .filter((e) => control.includes(`does-medicare-cover-${e.slug}`) && e.assistanceSlug)
      .map((e) => e.slug);
    expect(controlWithAssistance, 'control pages must link to no assistance page').toEqual([]);
  });
});
