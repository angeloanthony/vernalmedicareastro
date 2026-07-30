// tests/editorial-standards.test.ts — the editorial standard is a contract.
//
// standards.mjs encodes judgment ("a Part D page must compare something"), so
// the tests here guard its STRUCTURE, not its opinions: every required element
// must be detectable from built HTML, every cluster must reference real
// elements, and the score must be a plain present/required ratio. Opinions can
// change freely; a standard that references a non-existent detector cannot.

import { describe, it, expect } from 'vitest';
import { ELEMENTS, STANDARDS, requiredFor, completenessFor } from '../scripts/seo/standards.mjs';

type Element = { label: string; component: string; detect: (p: Record<string, unknown>) => boolean };
const elements = ELEMENTS as unknown as Record<string, Element>;
const standards = STANDARDS as unknown as Record<string, { add?: string[]; replace?: string[] }>;
const required = requiredFor as unknown as (silo: string) => string[];
const completeness = completenessFor as unknown as (
  page: Record<string, unknown>,
) => { required: string[]; present: string[]; missing: string[]; completeness: number };

/** A page satisfying every element in the catalog. */
const completePage = (over: Record<string, unknown> = {}) => ({
  silo: 'part-d',
  hasSummary: true,
  definitions: 2,
  hasComparisonTable: true,
  hasFaqMarkup: true,
  hasFaqSchema: true,
  hasRelated: true,
  hasCta: true,
  hasSources: true,
  hasByline: true,
  hasNextSteps: true,
  hasBreadcrumbs: true,
  schemaTypes: ['Article', 'BreadcrumbList', 'Organization', 'Person'],
  outboundCount: 12,
  ...over,
});

describe('element catalog', () => {
  it('gives every element a label, a component and a detector', () => {
    for (const [key, e] of Object.entries(elements)) {
      expect(e.label, `${key}.label`).toBeTruthy();
      expect(e.component, `${key}.component`).toBeTruthy();
      expect(typeof e.detect, `${key}.detect`).toBe('function');
    }
  });

  it('detects every element on a fully-equipped page', () => {
    const page = completePage();
    for (const [key, e] of Object.entries(elements)) {
      expect(e.detect(page), `${key} should be detected`).toBe(true);
    }
  });

  it('detects nothing on a bare page', () => {
    const bare = { silo: 'part-d', definitions: 0, outboundCount: 0, schemaTypes: [] };
    for (const [key, e] of Object.entries(elements)) {
      expect(Boolean(e.detect(bare)), `${key} should be absent`).toBe(false);
    }
  });
});

describe('cluster standards', () => {
  it('references only elements that exist in the catalog', () => {
    for (const [silo, spec] of Object.entries(standards)) {
      for (const key of [...(spec.add ?? []), ...(spec.replace ?? [])]) {
        expect(elements[key], `${silo} requires unknown element "${key}"`).toBeDefined();
      }
    }
  });

  it('requires a comparison table where options must actually be compared', () => {
    for (const silo of ['part-d', 'medicare-advantage', 'medigap', 'costs-irmaa']) {
      expect(required(silo), silo).toContain('comparisonTable');
    }
  });

  it('holds trust pages to a reduced standard, not the full content spec', () => {
    expect(required('trust')).not.toContain('comparisonTable');
    expect(required('trust')).not.toContain('faq');
    expect(required('trust').length).toBeLessThan(required('part-d').length);
  });

  it('falls back to the baseline for an unknown silo', () => {
    const base = required('not-a-real-silo');
    expect(base).toContain('summary');
    expect(base).toContain('faq');
  });
});

describe('completeness scoring', () => {
  it('scores a fully compliant page 100 with nothing missing', () => {
    const r = completeness(completePage());
    expect(r.completeness).toBe(100);
    expect(r.missing).toEqual([]);
  });

  it('scores a bare page 0 and lists every requirement as missing', () => {
    const r = completeness({ silo: 'part-d', definitions: 0, outboundCount: 0, schemaTypes: [] });
    expect(r.completeness).toBe(0);
    expect(r.missing).toEqual(r.required);
  });

  it('is a plain present-over-required ratio', () => {
    const r = completeness(completePage({ hasSources: false, hasCta: false }));
    expect(r.missing.sort()).toEqual(['cta', 'sources']);
    expect(r.completeness).toBe(
      Math.round(((r.required.length - 2) / r.required.length) * 100),
    );
  });

  it('penalises a Part D page with no comparison table even when AI-readable', () => {
    const r = completeness(completePage({ hasComparisonTable: false }));
    expect(r.missing).toContain('comparisonTable');
    expect(r.completeness).toBeLessThan(100);
  });

  it('a single-column table is not a comparison table', () => {
    expect(elements['comparisonTable'].detect({ hasComparisonTable: false })).toBe(false);
  });
});
