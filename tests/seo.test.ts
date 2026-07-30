// tests/seo.test.ts — contract tests for the SEO intelligence engine.
//
// These lock in the behaviour the generated reports depend on: URL
// normalization, Search Console CSV quirks, the weight renormalization that
// keeps the queue usable before any export exists, and the opportunity model's
// central claim — that a well-ranked page with a poor CTR beats a page buried
// at position 60.
//
// Only pure modules are imported. sources.mjs registers a Node module hook to
// read src/data/*.ts, which a unit test has no business doing.

import { describe, it, expect } from 'vitest';
import { normalizeUrl, localeOf, baseUrlOf, parseCsv, toNumber, findColumn } from '../scripts/seo/parse.mjs';
import { scorePages, activeWeights, expectedCtr, businessImpact } from '../scripts/seo/score.mjs';

/** The fields scorePages writes back onto each row that these tests assert on. */
interface ScoredRow {
  url: string;
  priority: number;
  opportunity: number;
  aiReadiness: number;
  unproven: boolean;
  ageDays: number | null;
  reasons: string[];
  flags: Record<string, boolean>;
  factors: Record<string, number>;
}

// The engine is plain JS with no type declarations; these give the tests a
// checked shape to assert against without inventing a .d.ts for tooling code.
type PageRecord = Record<string, unknown>;
const score = scorePages as unknown as (
  rows: PageRecord[],
  now: number,
  options: { hasPerformanceData: boolean },
) => { rows: ScoredRow[] };
const weightsFor = activeWeights as unknown as (hasData: boolean) => Record<string, number>;
const ctrAt = expectedCtr as unknown as (position: number | null) => number;
const impactOf = businessImpact as unknown as (url: string, silo: string) => number;
const csvRows = parseCsv as unknown as (text: string) => Record<string, string>[];
const numberOf = toNumber as unknown as (raw: string | undefined) => number | null;
const columnOf = findColumn as unknown as (header: string[], names: string[]) => string | null;

const sum = (values: Record<string, number>) => Object.values(values).reduce((a, b) => a + b, 0);

/** Look up a scored row, failing loudly rather than returning undefined. */
function row(rows: ScoredRow[], url: string): ScoredRow {
  const hit = rows.find((r) => r.url === url);
  if (!hit) throw new Error(`no scored row for ${url}`);
  return hit;
}

describe('normalizeUrl', () => {
  it('strips origin, query and hash', () => {
    expect(normalizeUrl('https://vernalmedicare.com/medicare-costs.html?utm=x#faq'))
      .toBe('/medicare-costs.html');
  });

  it('treats www and bare host the same', () => {
    expect(normalizeUrl('https://www.vernalmedicare.com/faq.html')).toBe('/faq.html');
  });

  it('collapses the homepage to a single form', () => {
    expect(normalizeUrl('https://vernalmedicare.com/')).toBe('/');
    expect(normalizeUrl('/index.html')).toBe('/');
  });

  it('adds a leading slash to bare paths', () => {
    expect(normalizeUrl('medicare-irmaa.html')).toBe('/medicare-irmaa.html');
  });

  it('decodes percent-encoding without throwing on malformed input', () => {
    expect(normalizeUrl('/medicare%2Dcosts.html')).toBe('/medicare-costs.html');
    expect(normalizeUrl('/bad%zz.html')).toBe('/bad%zz.html');
  });

  it('folds extensionless URLs into the .html form the registry uses', () => {
    // Cloudflare Pages serves both /aca and /aca.html; GSC reports mostly the
    // extensionless form. Both must land on one key or a page's data splits.
    expect(normalizeUrl('https://vernalmedicare.com/aca')).toBe('/aca.html');
    expect(normalizeUrl('/medicare-news/glp-1-drugs-medicare'))
      .toBe('/medicare-news/glp-1-drugs-medicare.html');
    expect(normalizeUrl('/es/medicare-irmaa')).toBe('/es/medicare-irmaa.html');
    expect(normalizeUrl('/es/medicare-irmaa/')).toBe('/es/medicare-irmaa.html');
    expect(normalizeUrl('https://vernalmedicare.com/')).toBe('/');
    // Real extensions are left alone.
    expect(normalizeUrl('/sitemap.xml')).toBe('/sitemap.xml');
  });
});

describe('locale helpers', () => {
  it('detects the Spanish prefix and maps back to the English original', () => {
    expect(localeOf('/es/medicare-costs.html')).toBe('es');
    expect(localeOf('/medicare-costs.html')).toBe('en');
    expect(baseUrlOf('/es/medicare-costs.html')).toBe('/medicare-costs.html');
  });

  it('treats the /es.html homepage as Spanish, not English', () => {
    // build.format:'file' emits the locale root as /es.html, not /es/index.html.
    expect(localeOf('/es.html')).toBe('es');
    expect(baseUrlOf('/es.html')).toBe('/');
  });

  it('does not mistake an English page that merely starts with "es"', () => {
    expect(localeOf('/estimator.html')).toBe('en');
  });
});

describe('Search Console CSV parsing', () => {
  it('handles a BOM, quoted thousands separators and percent signs', () => {
    const csv =
      '﻿Top pages,Clicks,Impressions,CTR,Position\n' +
      'https://vernalmedicare.com/medicare-costs.html,12,"1,483",0.81%,14.2\n';
    const rows = csvRows(csv);
    expect(rows).toHaveLength(1);
    expect(numberOf(rows[0]['Impressions'])).toBe(1483);
    expect(numberOf(rows[0]['CTR'])).toBe(0.81);
    expect(numberOf(rows[0]['Position'])).toBe(14.2);
  });

  it('preserves escaped quotes and ignores blank lines', () => {
    expect(csvRows('a,b\n"say ""hi""",2\n\n')).toEqual([{ a: 'say "hi"', b: '2' }]);
  });

  it('finds columns by exact name and by prefix', () => {
    const header = ['Top pages', 'Impressions (Last 3 months)'];
    expect(columnOf(header, ['top pages'])).toBe('Top pages');
    expect(columnOf(header, ['impressions'])).toBe('Impressions (Last 3 months)');
    expect(columnOf(header, ['clicks'])).toBeNull();
  });
});

describe('expectedCtr', () => {
  it('falls monotonically with position', () => {
    const curve = [1, 3, 5, 10, 20, 50].map((p) => ctrAt(p));
    for (let i = 1; i < curve.length; i++) expect(curve[i]).toBeLessThan(curve[i - 1]);
  });

  it('returns zero when a page has no position data', () => {
    expect(ctrAt(null)).toBe(0);
  });
});

describe('activeWeights', () => {
  it('totals 100 with performance data', () => {
    const w = weightsFor(true);
    expect(sum(w)).toBeCloseTo(100);
    expect(w['impressions']).toBe(30);
  });

  it('drops performance factors and still totals 100 without an export', () => {
    const w = weightsFor(false);
    expect(w['impressions']).toBeUndefined();
    expect(w['position']).toBeUndefined();
    expect(w['ctrOpportunity']).toBeUndefined();
    expect(sum(w)).toBeCloseTo(100);
    // Business value must still dominate a pillar flag when nothing else is known.
    expect(w['business']).toBeGreaterThan(w['pillar']);
  });
});

describe('Business Impact (1-5)', () => {
  it('reads the per-URL override before the silo default', () => {
    expect(impactOf('/medicare-quote-vernal.html', 'local')).toBe(5);
    expect(impactOf('/editorial-policy.html', 'trust')).toBe(1);
    expect(impactOf('/some-unlisted-page.html', 'trust')).toBe(2);
  });

  it('falls back for an unknown silo rather than scoring zero', () => {
    expect(impactOf('/x.html', 'not-a-silo')).toBe(3);
  });

  it('keeps a Supporting page in the queue at reduced weight, not excluded', () => {
    const { rows } = score(
      [
        page({ url: '/editorial-policy.html', silo: 'trust' }),
        page({ url: '/medicare-quote-vernal.html', silo: 'local' }),
      ],
      Date.now(),
      { hasPerformanceData: false },
    );
    const supporting = row(rows, '/editorial-policy.html');
    const revenue = row(rows, '/medicare-quote-vernal.html');
    expect(supporting.priority).toBeGreaterThan(0); // level 1 = 20% weight, not zero
    expect(revenue.priority).toBeGreaterThan(supporting.priority);
  });
});

/** Minimal page record — only the fields scorePages reads. */
const page = (over: PageRecord = {}): PageRecord => ({
  url: '/x.html',
  silo: 'costs-irmaa',
  pillar: false,
  clicks: 0,
  impressions: 0,
  ctr: 0,
  position: null,
  words: 900,
  tables: 1,
  definitions: 1,
  schemaTypes: ['Article', 'BreadcrumbList', 'Organization', 'Person'],
  hasSummary: true,
  hasFaqSchema: true,
  hasFaqMarkup: true,
  hasByline: true,
  hasSources: true,
  inboundCount: 5,
  outboundCount: 10,
  depth: 2,
  lastModified: new Date().toISOString(),
  registered: true,
  ...over,
});

describe('opportunity model', () => {
  it('ranks a high-impression page with a bad CTR above a buried page', () => {
    // The scenario the model exists to catch: position 9 on 8,000 impressions at
    // 0.8% CTR is a title rewrite away from real clicks; position 61 on 34
    // impressions is not worth touching.
    const { rows } = score(
      [
        page({ url: '/strong.html', impressions: 8000, clicks: 64, ctr: 0.008, position: 9 }),
        page({ url: '/buried.html', impressions: 34, clicks: 0, ctr: 0, position: 61 }),
      ],
      Date.now(),
      { hasPerformanceData: true },
    );

    const strong = row(rows, '/strong.html');
    const buried = row(rows, '/buried.html');
    expect(strong.opportunity).toBeGreaterThan(buried.opportunity);
    expect(strong.opportunity).toBeGreaterThan(60);
    expect(strong.flags['ctrProblem']).toBe(true);
  });

  it('scores an already-winning page lower than one in striking distance', () => {
    const { rows } = score(
      [
        page({ url: '/won.html', impressions: 900, clicks: 140, ctr: 0.156, position: 2.1 }),
        page({ url: '/close.html', impressions: 1890, clicks: 2, ctr: 0.001, position: 15.7 }),
      ],
      Date.now(),
      { hasPerformanceData: true },
    );

    expect(row(rows, '/close.html').opportunity).toBeGreaterThan(row(rows, '/won.html').opportunity);
  });

  it('caps pages with no impressions — unproven is not an opportunity', () => {
    const { rows } = score([page({ url: '/new.html' })], Date.now(), { hasPerformanceData: true });
    const fresh = row(rows, '/new.html');
    expect(fresh.unproven).toBe(true);
    expect(fresh.opportunity).toBeLessThanOrEqual(25);
  });
});

describe('AI readiness', () => {
  it('gives a fully-equipped page a high score and a bare one a low score', () => {
    const { rows } = score(
      [
        page({ url: '/rich.html' }),
        page({
          url: '/bare.html',
          words: 120,
          tables: 0,
          definitions: 0,
          schemaTypes: [],
          hasSummary: false,
          hasFaqSchema: false,
          hasFaqMarkup: false,
          hasByline: false,
          hasSources: false,
          outboundCount: 0,
        }),
      ],
      Date.now(),
      { hasPerformanceData: false },
    );

    expect(row(rows, '/rich.html').aiReadiness).toBeGreaterThan(85);
    expect(row(rows, '/bare.html').aiReadiness).toBe(0);
  });

  it('flags a missing summary and names it as the next action', () => {
    const { rows } = score([page({ url: '/nosummary.html', hasSummary: false })], Date.now(), {
      hasPerformanceData: false,
    });
    const p = row(rows, '/nosummary.html');
    expect(p.flags['needsSummary']).toBe(true);
    expect(p.reasons.join(' ')).toContain('AI summary');
  });
});

describe('structural flags', () => {
  it('detects orphans and thin content', () => {
    const { rows } = score([page({ url: '/orphan.html', inboundCount: 0, words: 200 })], Date.now(), {
      hasPerformanceData: false,
    });
    const p = row(rows, '/orphan.html');
    expect(p.flags['orphan']).toBe(true);
    expect(p.flags['thin']).toBe(true);
    expect(p.factors['linkWeakness']).toBe(1);
  });

  it('ages content from its last commit date', () => {
    const old = new Date(Date.now() - 400 * 86_400_000).toISOString();
    const { rows } = score([page({ url: '/old.html', lastModified: old })], Date.now(), {
      hasPerformanceData: false,
    });
    const p = row(rows, '/old.html');
    expect(p.ageDays).toBeGreaterThanOrEqual(399);
    expect(p.flags['criticallyStale']).toBe(true);
  });
});
