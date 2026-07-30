// scripts/seo/trends.mjs — the two reports that look across pages and across time.
//
//   Topic Coverage  which whole CLUSTER is weak (not which page)
//   Delta           what MOVED since the last snapshot
//
// Both exist because a per-page snapshot cannot answer the two questions that
// actually drive content work: "what should we rewrite next" is a cluster
// decision, and "did the last rewrite work" is a time decision.

import { AI_WEIGHTS } from './config.mjs';
import { num, pos, short, link, arrow, table, header } from './md.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// Topic Coverage
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cluster-level coverage.
 *
 * Each dimension is the MEAN feature score across the silo, so a cluster where
 * every page lacks tables reads near 0% instead of hiding behind one strong
 * page. `Authority` is the one dimension not from AI readiness: mean inbound
 * editorial links per page relative to the site median.
 */
export function topicCoverage(rows, meta) {
  const scored = rows.filter((r) => r.locale === 'en');
  if (!scored.length) return header('Topic Coverage', 'No pages scored.', meta);

  const featureKeys = Object.keys(AI_WEIGHTS);
  const labelOf = (k) =>
    k === 'authority' ? 'Authority' : scored[0]?.aiFeatures[k]?.label ?? k;
  const medianInbound = Math.max(1, meta.medianInbound ?? 1);

  const silos = new Map();
  for (const r of scored) {
    let s = silos.get(r.silo);
    if (!s) {
      s = {
        silo: r.silo,
        pages: 0,
        sums: Object.fromEntries([...featureKeys, 'authority'].map((k) => [k, 0])),
        impressions: 0,
        clicks: 0,
        readiness: 0,
        impact: 0,
        pillars: 0,
      };
      silos.set(r.silo, s);
    }
    s.pages++;
    for (const k of featureKeys) s.sums[k] += r.aiFeatures[k].score;
    s.sums.authority += Math.min(1, r.inboundCount / medianInbound);
    s.impressions += r.impressions ?? 0;
    s.clicks += r.clicks ?? 0;
    s.readiness += r.aiReadiness;
    s.impact += r.businessImpact ?? 0;
    if (r.pillar) s.pillars++;
  }

  const dimKeys = [...featureKeys, 'authority'];
  const clusters = [...silos.values()]
    .map((s) => {
      const dims = Object.fromEntries(
        dimKeys.map((k) => [k, Math.round((s.sums[k] / s.pages) * 100)]),
      );
      return {
        ...s,
        dims,
        overall: Math.round(s.readiness / s.pages),
        meanImpact: (s.impact / s.pages).toFixed(1),
        weakest: Object.entries(dims).sort((a, b) => a[1] - b[1]).slice(0, 2),
      };
    })
    .sort((a, b) => a.overall - b.overall);

  /** Highest-priority pages in a cluster that are missing a given dimension. */
  const draggers = (silo, key) =>
    scored
      .filter((r) => r.silo === silo)
      .filter((r) => (key === 'authority' ? r.inboundCount === 0 : !r.aiFeatures[key].got))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)
      .map((r) => short(r.url));

  return [
    header(
      'Topic Coverage',
      'Cluster-level coverage. AI-READINESS tells you which page is weak; this tells you ' +
        'which entire topic is weak — the level content work is actually planned at. ' +
        'Weakest cluster first.',
      meta,
    ),
    '`Authority` is mean inbound editorial links per page relative to the site median ' +
      `(${medianInbound}), capped at 100%. Every other dimension is the mean of that ` +
      'AI-readiness feature across the cluster.',
    '',
    '## Coverage matrix',
    '',
    table(
      ['Cluster', 'Pages', 'Overall', ...dimKeys.map(labelOf), 'Impact'],
      clusters.map((c) => [
        c.silo,
        num(c.pages),
        `**${c.overall}%**`,
        ...dimKeys.map((k) => `${c.dims[k]}%`),
        c.meanImpact,
      ]),
      ['', 'r', 'r', ...dimKeys.map(() => 'r'), 'r'],
    ),
    '',
    '## Weakest dimension per cluster',
    '',
    'The fastest way to raise a cluster: fix its weakest dimension across the pages listed.',
    '',
    table(
      ['Cluster', 'Overall', 'Weakest', 'Second weakest', 'Start with'],
      clusters.map((c) => [
        c.silo,
        `${c.overall}%`,
        `${labelOf(c.weakest[0][0])} ${c.weakest[0][1]}%`,
        `${labelOf(c.weakest[1][0])} ${c.weakest[1][1]}%`,
        draggers(c.silo, c.weakest[0][0]).join(', ') || '—',
      ]),
      ['', 'r', '', '', ''],
    ),
    '',
    '## Where the traffic is',
    '',
    'Coverage matters most where demand already exists. A weak cluster with impressions is ' +
      'a bigger loss than a weak cluster nobody searches for.',
    '',
    table(
      ['Cluster', 'Pages', 'Impressions', 'Clicks', 'Coverage', 'Pillars', 'Mean impact'],
      [...clusters]
        .sort((a, b) => b.impressions - a.impressions || b.pages - a.pages)
        .map((c) => [
          c.silo, num(c.pages), num(c.impressions), num(c.clicks),
          `${c.overall}%`, num(c.pillars), c.meanImpact,
        ]),
      ['', 'r', 'r', 'r', 'r', 'r', 'r'],
    ),
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Console Delta
// ─────────────────────────────────────────────────────────────────────────────

const pctChange = (now, before) =>
  before > 0 ? `${now >= before ? '+' : ''}${Math.round(((now - before) / before) * 100)}%` : 'new';

/**
 * Movement since the previous snapshot.
 *
 * Current position tells you where you stand; only movement tells you whether
 * the last round of edits worked. Compared against the most recent PRIOR
 * history file, so re-running on the same day never diffs against itself.
 */
export function deltaReport(rows, meta, previous) {
  const scored = rows.filter((r) => r.locale === 'en');

  if (!previous) {
    return [
      header(
        'Search Console Delta',
        'Movement since the previous snapshot — the only report that tells you whether ' +
          'your edits actually worked.',
        meta,
      ),
      '## No baseline yet',
      '',
      'This run wrote the first snapshot to `docs/seo/history/`. There is nothing to compare against.',
      '',
      'Run `npm run seo` again after the next Search Console export — ideally 2-4 weeks later, ' +
        'and after Google has recrawled the pages you edited — and this report will show ' +
        'position, impression, click and readiness movement for every page.',
      '',
    ].join('\n');
  }

  const prev = new Map(previous.pages.map((p) => [p.url, p]));
  const nowByUrl = new Map(rows.map((r) => [r.url, r]));

  const moved = scored
    .filter((r) => prev.has(r.url))
    .map((r) => {
      const p = prev.get(r.url);
      return {
        row: r,
        // A position IMPROVES when the number falls, so gain = previous - now.
        dPos:
          p.position !== null && p.position !== undefined && r.position !== null
            ? Math.round((p.position - r.position) * 10) / 10
            : null,
        dImpr: (r.impressions ?? 0) - (p.impressions ?? 0),
        dClicks: (r.clicks ?? 0) - (p.clicks ?? 0),
        dPriority: r.priority - (p.priority ?? 0),
        dAi: r.aiReadiness - (p.aiReadiness ?? 0),
        // Older history files predate completeness tracking — null, not 0,
        // so absence of data never reads as "nothing moved".
        dComp: p.completeness !== undefined ? r.completeness.completeness - p.completeness : null,
        prevComp: p.completeness ?? null,
        prevPos: p.position ?? null,
        prevImpr: p.impressions ?? 0,
      };
    });

  const gained = moved.filter((m) => m.dPos > 0).sort((a, b) => b.dPos - a.dPos);
  const lost = moved.filter((m) => m.dPos < 0).sort((a, b) => a.dPos - b.dPos);
  const imprUp = moved.filter((m) => m.dImpr > 0).sort((a, b) => b.dImpr - a.dImpr);
  const imprDown = moved.filter((m) => m.dImpr < 0).sort((a, b) => a.dImpr - b.dImpr);
  const readier = moved.filter((m) => m.dAi > 0).sort((a, b) => b.dAi - a.dAi);
  const entered = scored.filter(
    (r) => r.impressions > 0 && !((prev.get(r.url)?.impressions ?? 0) > 0),
  );
  const exited = previous.pages.filter(
    (p) => (p.impressions ?? 0) > 0 && !((nowByUrl.get(p.url)?.impressions ?? 0) > 0),
  );

  const sum = (list, key) => list.reduce((s, x) => s + (x[key] ?? 0), 0);
  const totals = {
    clicks: sum(scored, 'clicks'),
    impressions: sum(scored, 'impressions'),
    prevClicks: sum(previous.pages, 'clicks'),
    prevImpressions: sum(previous.pages, 'impressions'),
  };

  return [
    header(
      'Search Console Delta',
      `Movement since **${String(previous.generatedAt).slice(0, 10)}**. Current position tells you ` +
        'where you stand; only movement tells you whether the last round of edits worked.',
      meta,
    ),
    '## Site totals',
    '',
    table(
      ['Metric', 'Previous', 'Now', 'Change'],
      [
        ['Clicks', num(totals.prevClicks), num(totals.clicks), pctChange(totals.clicks, totals.prevClicks)],
        ['Impressions', num(totals.prevImpressions), num(totals.impressions), pctChange(totals.impressions, totals.prevImpressions)],
        [
          'Pages with impressions',
          num(previous.pages.filter((p) => (p.impressions ?? 0) > 0).length),
          num(scored.filter((r) => r.impressions > 0).length),
          '',
        ],
      ],
      ['', 'r', 'r', 'r'],
    ),
    '',
    '## Biggest position gains',
    '',
    table(
      ['Page', 'Was', 'Now', 'Move', 'Impressions', 'Clicks'],
      gained.slice(0, 20).map((m) => [
        link(m.row), pos(m.prevPos), pos(m.row.position), arrow(m.dPos),
        `${num(m.row.impressions)} (${arrow(m.dImpr)})`,
        `${num(m.row.clicks)} (${arrow(m.dClicks)})`,
      ]),
      ['', 'r', 'r', 'r', 'r', 'r'],
    ),
    '',
    '## Biggest position losses',
    '',
    table(
      ['Page', 'Was', 'Now', 'Move', 'Impressions', 'Priority now'],
      lost.slice(0, 20).map((m) => [
        link(m.row), pos(m.prevPos), pos(m.row.position), arrow(m.dPos),
        `${num(m.row.impressions)} (${arrow(m.dImpr)})`, m.row.priority,
      ]),
      ['', 'r', 'r', 'r', 'r', 'r'],
    ),
    '',
    '## Impression growth',
    '',
    table(
      ['Page', 'Was', 'Now', 'Change', 'Pos'],
      imprUp.slice(0, 20).map((m) => [
        link(m.row), num(m.prevImpr), num(m.row.impressions),
        pctChange(m.row.impressions, m.prevImpr), pos(m.row.position),
      ]),
      ['', 'r', 'r', 'r', 'r'],
    ),
    '',
    '## Impression decline',
    '',
    table(
      ['Page', 'Was', 'Now', 'Change', 'Pos'],
      imprDown.slice(0, 20).map((m) => [
        link(m.row), num(m.prevImpr), num(m.row.impressions),
        pctChange(m.row.impressions, m.prevImpr), pos(m.row.position),
      ]),
      ['', 'r', 'r', 'r', 'r'],
    ),
    '',
    '## Newly earning impressions',
    '',
    entered.length
      ? table(
          ['Page', 'Impressions', 'Pos', 'Priority'],
          entered
            .sort((a, b) => b.impressions - a.impressions)
            .slice(0, 25)
            .map((r) => [link(r), num(r.impressions), pos(r.position), r.priority]),
          ['', 'r', 'r', 'r'],
        )
      : '_None._\n',
    '',
    '## Dropped out of Search Console',
    '',
    exited.length
      ? exited
          .slice(0, 25)
          .map((p) => `- \`${p.url}\` — had ${num(p.impressions)} impressions, now none`)
          .join('\n') + '\n'
      : '_None._\n',
    '',
    '## AI readiness movement',
    '',
    'Did the structural work land? These pages gained readiness points since the last snapshot.',
    '',
    table(
      ['Page', 'AI readiness', 'Change', 'Priority change'],
      readier.slice(0, 25).map((m) => [
        link(m.row), `${m.row.aiReadiness}%`, arrow(m.dAi), arrow(m.dPriority, true),
      ]),
      ['', 'r', 'r', 'r'],
    ),
    '',
    '## Editorial completeness movement',
    '',
    (() => {
      const tracked = moved.filter((m) => m.dComp !== null);
      if (!tracked.length) {
        return '_The previous snapshot predates completeness tracking — movement will appear on the next run._\n';
      }
      const meanNow = Math.round(
        scored.reduce((s, r) => s + r.completeness.completeness, 0) / scored.length,
      );
      const withPrev = previous.pages.filter((p) => p.completeness !== undefined);
      const meanPrev = Math.round(
        withPrev.reduce((s, p) => s + p.completeness, 0) / Math.max(1, withPrev.length),
      );
      const movers = tracked.filter((m) => m.dComp !== 0).sort((a, b) => b.dComp - a.dComp);
      return [
        `Site mean: **${meanPrev}% → ${meanNow}%** — the number the publish gate protects ` +
          'and the sprint goal is measured in.',
        '',
        movers.length
          ? table(
              ['Page', 'Was', 'Now', 'Change'],
              movers.slice(0, 25).map((m) => [
                link(m.row), `${m.prevComp}%`, `${m.row.completeness.completeness}%`, arrow(m.dComp),
              ]),
              ['', 'r', 'r', 'r'],
            )
          : '_No page moved._\n',
      ].join('\n');
    })(),
  ].join('\n');
}
