// scripts/seo/score.mjs — Layer 4: the priority engine.
//
// Turns the merged sources into three numbers per page:
//   priority     what to work on next, all factors considered
//   opportunity  where effort converts fastest (already ranking, already trusted)
//   aiReadiness  how extractable the page is for AI answers
//
// Every sub-score is 0..1 and carries a human-readable reason, so a queue entry
// can always explain itself. No number in a report is unexplained.

import {
  PRIORITY_WEIGHTS,
  OPPORTUNITY_WEIGHTS,
  AI_WEIGHTS,
  BUSINESS_IMPACT,
  THRESHOLDS,
  EXPECTED_CTR,
  UNPROVEN_OPPORTUNITY_CAP,
} from './config.mjs';

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * p)));
  return sorted[i];
}

export function expectedCtr(position) {
  if (position === null || position === undefined) return 0;
  for (const [max, ctr] of EXPECTED_CTR) if (position <= max) return ctr;
  return 0.001;
}

// Below this, impressions are noise rather than demand — it anchors the bottom
// of the log scale so a 20-impression page doesn't score like a real contender.
const IMPRESSION_FLOOR = 10;

/**
 * Impressions, log-scaled between a noise floor and the 95th percentile, so one
 * runaway page can't flatten the field and a trickle can't look like traffic.
 *
 * The percentile is taken over pages that HAVE impressions, not over every
 * built page. With a partial export most pages are zero, and including them
 * would drag p95 down to near-nothing and inflate every page that has any data.
 */
function impressionScore(impressions, p95) {
  if (!impressions || p95 <= IMPRESSION_FLOOR) return 0;
  const floor = Math.log1p(IMPRESSION_FLOOR);
  return clamp01((Math.log1p(impressions) - floor) / (Math.log1p(p95) - floor));
}

/**
 * Position value for PRIORITY: page 1-2 is where an edit still moves revenue.
 * Already top-3 has little headroom; past 40 an edit is rarely enough.
 */
function positionScore(pos) {
  if (pos === null) return 0.25; // not ranking yet — unknown, not zero
  if (pos <= 3) return 0.35;
  if (pos <= 10) return 1.0;
  if (pos <= 20) return 0.85;
  if (pos <= 30) return 0.6;
  if (pos <= 40) return 0.45;
  return 0.2;
}

/**
 * Position value for OPPORTUNITY: peaks in the 5-15 "striking distance" band,
 * where a page already has authority and a small push crosses a real threshold.
 */
function proximityScore(pos) {
  if (pos === null) return 0;
  if (pos < 3) return 0.35;
  if (pos <= 5) return 0.85;
  if (pos <= 15) return 1.0;
  if (pos <= 20) return 0.8;
  if (pos <= 30) return 0.5;
  if (pos <= 50) return 0.2;
  return 0.05;
}

/** A page's Business Impact level, 1-5. */
export function businessImpact(url, silo) {
  if (url in BUSINESS_IMPACT.byUrl) return BUSINESS_IMPACT.byUrl[url];
  return BUSINESS_IMPACT.bySilo[silo] ?? BUSINESS_IMPACT.fallback;
}

/** Impact as a 0..1 scoring factor. Level 1 keeps 20% weight, not zero. */
function businessValue(url, silo) {
  return businessImpact(url, silo) / 5;
}

function daysSince(iso, now) {
  if (!iso) return null;
  return Math.max(0, Math.round((now - new Date(iso).getTime()) / 86_400_000));
}

// ─────────────────────────────────────────────────────────────────────────────
// AI readiness
// ─────────────────────────────────────────────────────────────────────────────

const CORE_SCHEMA = ['Article', 'WebPage', 'BreadcrumbList', 'Organization', 'Person'];

function aiReadiness(page, medianWords) {
  const types = new Set(page.schemaTypes ?? []);
  const schemaHits = CORE_SCHEMA.filter((t) => types.has(t)).length;

  // "Original insights" has no machine-readable marker, so we score its
  // observable proxies: a named author, cited sources, and real depth.
  const insightSignals =
    (page.hasByline ? 1 : 0) + (page.hasSources ? 1 : 0) + (page.words >= medianWords ? 1 : 0);

  const features = {
    summary: { got: page.hasSummary, score: page.hasSummary ? 1 : 0, label: 'AI Summary' },
    faq: {
      got: page.hasFaqSchema && page.hasFaqMarkup,
      score: page.hasFaqSchema && page.hasFaqMarkup ? 1 : page.hasFaqSchema || page.hasFaqMarkup ? 0.5 : 0,
      label: 'FAQ',
    },
    schema: { got: schemaHits >= 4, score: schemaHits / CORE_SCHEMA.length, label: 'Schema' },
    tables: { got: page.tables > 0, score: clamp01(page.tables / 2), label: 'Tables' },
    definitions: { got: page.definitions > 0, score: clamp01(page.definitions / 1), label: 'Definitions' },
    internalLinks: {
      got: page.outboundCount >= 8,
      score: clamp01(page.outboundCount / 8),
      label: 'Internal links',
    },
    insights: { got: insightSignals === 3, score: insightSignals / 3, label: 'Original insights' },
  };

  const total = Object.entries(features).reduce(
    (sum, [key, f]) => sum + f.score * AI_WEIGHTS[key],
    0,
  );
  return { score: Math.round(total), features };
}

// ─────────────────────────────────────────────────────────────────────────────
// main
// ─────────────────────────────────────────────────────────────────────────────

/** Factors that are meaningless until a Search Console export exists. */
const PERFORMANCE_FACTORS = ['impressions', 'position', 'ctrOpportunity'];

/**
 * Priority weights for this run, renormalized to 100 over the factors whose
 * source is actually present. Without a CSV, 60 of the 100 points would be
 * dead and nothing could ever reach tier 1 — the queue would be empty and
 * useless. Dropping the performance factors and rescaling the rest keeps the
 * ranking honest today, and the numbers become directly comparable the moment
 * the first export lands.
 */
export function activeWeights(hasPerformanceData) {
  const entries = Object.entries(PRIORITY_WEIGHTS).filter(
    ([k]) => hasPerformanceData || !PERFORMANCE_FACTORS.includes(k),
  );
  const total = entries.reduce((s, [, w]) => s + w, 0);
  return Object.fromEntries(entries.map(([k, w]) => [k, (w / total) * 100]));
}

/**
 * @param rows     merged page records (registry + rendered + performance + git)
 * @param now      epoch ms, so a report is reproducible for a given run
 * @param options  hasPerformanceData — whether ANY Search Console rows loaded
 */
export function scorePages(rows, now = Date.now(), { hasPerformanceData = true } = {}) {
  const weights = activeWeights(hasPerformanceData);
  const impressionsSorted = rows
    .map((r) => r.impressions ?? 0)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const p95Impressions = percentile(impressionsSorted, 0.95) || 1;

  const inboundSorted = rows.map((r) => r.inboundCount ?? 0).sort((a, b) => a - b);
  const medianInbound = Math.max(1, percentile(inboundSorted, 0.5));

  const wordsSorted = rows.map((r) => r.words ?? 0).sort((a, b) => a - b);
  const medianWords = percentile(wordsSorted, 0.5);

  const maxClicks = Math.max(1, ...rows.map((r) => r.clicks ?? 0));

  for (const r of rows) {
    const hasData = (r.impressions ?? 0) > 0;
    const pos = r.position ?? null;

    // ── factors (0..1) ──
    const f = {
      impressions: impressionScore(r.impressions, p95Impressions),
      position: positionScore(pos),
      business: businessValue(r.url, r.silo),
      pillar: r.pillar ? 1 : 0,
      linkWeakness:
        r.inboundCount === 0 ? 1 : clamp01((medianInbound - r.inboundCount) / medianInbound),
      freshness: 0,
      ctrOpportunity: 0,
    };

    r.ageDays = daysSince(r.lastModified, now);
    f.freshness =
      r.ageDays === null ? 0.5 : clamp01(r.ageDays / THRESHOLDS.criticalStaleDays);

    const expCtr = expectedCtr(pos);
    r.expectedCtr = expCtr;
    r.ctrGap = hasData && expCtr > 0 ? clamp01((expCtr - (r.ctr ?? 0)) / expCtr) : 0;
    f.ctrOpportunity = r.ctrGap;

    r.businessImpact = businessImpact(r.url, r.silo);
    r.factors = f;
    r.priority = Math.round(
      Object.entries(weights).reduce((sum, [k, w]) => sum + f[k] * w, 0),
    );

    // ── opportunity ──
    const opp =
      f.impressions * OPPORTUNITY_WEIGHTS.impressions +
      proximityScore(pos) * OPPORTUNITY_WEIGHTS.proximity +
      r.ctrGap * OPPORTUNITY_WEIGHTS.ctrGap +
      clamp01(1 - (r.clicks ?? 0) / maxClicks) * OPPORTUNITY_WEIGHTS.headroom;
    r.opportunity = hasData
      ? Math.round(opp)
      : Math.min(UNPROVEN_OPPORTUNITY_CAP, Math.round(f.business * UNPROVEN_OPPORTUNITY_CAP));
    r.unproven = !hasData;

    // ── AI readiness ──
    const ai = aiReadiness(r, medianWords);
    r.aiReadiness = ai.score;
    r.aiFeatures = ai.features;

    // ── flags & tier ──
    r.tier = r.priority >= THRESHOLDS.tier1 ? 1 : r.priority >= THRESHOLDS.tier2 ? 2 : 3;
    r.flags = {
      orphan: r.inboundCount === 0,
      weakLinks: r.inboundCount < THRESHOLDS.weakInboundLinks,
      lowOutbound: r.outboundCount < THRESHOLDS.lowOutboundLinks,
      needsSummary: !r.hasSummary,
      needsFaq: !(r.hasFaqSchema && r.hasFaqMarkup),
      thin: r.words < THRESHOLDS.thinWords,
      stale: r.ageDays !== null && r.ageDays >= THRESHOLDS.staleDays,
      criticallyStale: r.ageDays !== null && r.ageDays >= THRESHOLDS.criticalStaleDays,
      aiGap: r.aiReadiness < THRESHOLDS.aiReadinessFloor,
      ctrProblem: hasData && r.ctrGap >= 0.5 && (r.position ?? 99) <= 20,
      strikingDistance: hasData && pos !== null && pos > 3 && pos <= 20,
      unregistered: !r.registered,
      duplicateTitle: Boolean(r.duplicateTitle),
      noData: !hasData,
    };
    r.reasons = buildReasons(r, hasPerformanceData);
  }

  rows.sort((a, b) => b.priority - a.priority || b.opportunity - a.opportunity);
  return {
    rows,
    weights,
    stats: { p95Impressions, medianInbound, medianWords, maxClicks, hasPerformanceData },
  };
}

/** The "why is this in the queue" line. Ordered by how actionable each reason is. */
function buildReasons(r, hasPerformanceData = true) {
  const out = [];
  const pos = r.position !== null && r.position !== undefined ? r.position.toFixed(1) : null;

  if (r.flags.ctrProblem) {
    out.push(
      `CTR ${(r.ctr * 100).toFixed(1)}% vs ~${(r.expectedCtr * 100).toFixed(1)}% expected at position ${pos} — title/meta rewrite`,
    );
  }
  if (r.flags.strikingDistance && r.impressions >= 100) {
    out.push(`position ${pos} on ${r.impressions.toLocaleString()} impressions — striking distance`);
  } else if (r.impressions > 0) {
    out.push(`${r.impressions.toLocaleString()} impressions at position ${pos ?? 'n/a'}`);
  }
  if (r.flags.orphan) out.push('orphaned — no in-content links point here');
  else if (r.flags.weakLinks) out.push(`only ${r.inboundCount} in-content inbound link(s)`);
  if (r.flags.needsSummary) out.push('no AI summary block');
  if (r.flags.needsFaq) out.push('no FAQ + FAQPage schema');
  if (r.flags.thin) out.push(`thin (${r.words} words)`);
  if (r.flags.criticallyStale) out.push(`not updated in ${r.ageDays} days`);
  else if (r.flags.stale) out.push(`${r.ageDays} days since last update`);
  if (r.pillar) out.push('pillar page');
  if (r.flags.duplicateTitle) out.push('duplicate <title> with another page');
  // Only worth saying when OTHER pages do have data — if no export is loaded at
  // all, it is true of every page and tells the reader nothing.
  if (r.flags.noData && hasPerformanceData) out.push('no Search Console data yet');
  return out;
}
