// tests/editorial-gate.test.ts — the publish gate is a contract.
//
// gate.mjs enforces two rules: new content ships at ≥ threshold or not at all,
// and no page ever scores below its recorded floor. These tests guard exactly
// that — the ratchet only turns one way, grandfathered debt passes until it
// grows, and a failing new page is never quietly admitted to the baseline.

import { describe, it, expect } from 'vitest';
import { evaluateGate } from '../scripts/seo/gate.mjs';

type Failure = { kind: 'new' | 'regression'; url: string; now: number; floor: number; missing: string[] };
type Result = {
  failures: Failure[];
  nextBaseline: Record<string, number>;
  added: number;
  raised: number;
  dropped: string[];
};
const gate = evaluateGate as unknown as (
  pages: Record<string, unknown>[],
  baseline: { pages: Record<string, number> } | null,
  threshold: number,
) => Result;

const page = (url: string, completeness: number, over: Record<string, unknown> = {}) => ({
  url,
  locale: 'en',
  completeness,
  missingElements: [],
  ...over,
});

describe('rule 1 — new content meets the standard or does not ship', () => {
  it('fails a new page below the threshold and keeps it out of the baseline', () => {
    const r = gate([page('/new.html', 67, { missingElements: ['sources', 'faq'] })], { pages: {} }, 90);
    expect(r.failures).toHaveLength(1);
    expect(r.failures[0]).toMatchObject({ kind: 'new', url: '/new.html', now: 67, floor: 90 });
    expect(r.failures[0].missing).toEqual(['sources', 'faq']);
    expect(r.nextBaseline['/new.html']).toBeUndefined();
  });

  it('admits a new page at or above the threshold, floored at its own score', () => {
    const r = gate([page('/new.html', 92)], { pages: {} }, 90);
    expect(r.failures).toEqual([]);
    expect(r.added).toBe(1);
    expect(r.nextBaseline['/new.html']).toBe(92);
  });
});

describe('rule 2 — the ratchet only turns one way', () => {
  it('passes a grandfathered page below the threshold as long as it holds its floor', () => {
    const r = gate([page('/old.html', 60)], { pages: { '/old.html': 60 } }, 90);
    expect(r.failures).toEqual([]);
  });

  it('raises the floor when a page improves', () => {
    const r = gate([page('/old.html', 78)], { pages: { '/old.html': 60 } }, 90);
    expect(r.failures).toEqual([]);
    expect(r.raised).toBe(1);
    expect(r.nextBaseline['/old.html']).toBe(78);
  });

  it('fails a page that drops below its floor and does not lower the floor', () => {
    const r = gate([page('/old.html', 55)], { pages: { '/old.html': 70 } }, 90);
    expect(r.failures).toHaveLength(1);
    expect(r.failures[0]).toMatchObject({ kind: 'regression', now: 55, floor: 70 });
    expect(r.nextBaseline['/old.html']).toBe(70);
  });
});

describe('baseline hygiene', () => {
  it('drops pages that no longer build', () => {
    const r = gate([page('/kept.html', 80)], { pages: { '/kept.html': 80, '/gone.html': 95 } }, 90);
    expect(r.dropped).toEqual(['/gone.html']);
    expect(r.nextBaseline['/gone.html']).toBeUndefined();
  });

  it('ignores non-English pages — localized mirrors follow their templates', () => {
    const r = gate([page('/es/nuevo.html', 10, { locale: 'es' })], { pages: {} }, 90);
    expect(r.failures).toEqual([]);
    expect(Object.keys(r.nextBaseline)).toEqual([]);
  });

  it('treats a missing baseline map as all-new content', () => {
    const r = gate([page('/a.html', 95), page('/b.html', 40)], null, 90);
    expect(r.added).toBe(1);
    expect(r.failures.map((f) => f.url)).toEqual(['/b.html']);
  });
});
