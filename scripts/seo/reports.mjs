// scripts/seo/reports.mjs — renders every generated report.
//
// These files are OUTPUT. They are rewritten from scratch on every run and must
// never be hand-edited: the sources are pageIndex.ts, the Search Console CSVs,
// dist/ and git history. If a report says something wrong, fix the source or
// the weights in config.mjs — not the Markdown.

import { PRIORITY_WEIGHTS, AI_WEIGHTS, THRESHOLDS, PATHS } from './config.mjs';
import { num, pct, pos, short, link, yesNo, table, header } from './md.mjs';

// ─────────────────────────────────────────────────────────────────────────────

export function dashboard(rows, meta, intel, gsc) {
  const scored = rows.filter((r) => r.locale === 'en');
  const totalImpr = scored.reduce((s, r) => s + (r.impressions ?? 0), 0);
  const totalClicks = scored.reduce((s, r) => s + (r.clicks ?? 0), 0);
  const weighted = scored.filter((r) => r.position !== null && r.impressions > 0);
  const avgPos = weighted.length
    ? weighted.reduce((s, r) => s + r.position * r.impressions, 0) /
      weighted.reduce((s, r) => s + r.impressions, 0)
    : null;
  const count = (fn) => scored.filter(fn).length;

  const silos = new Map();
  for (const r of scored) {
    const s = silos.get(r.silo) ?? {
      silo: r.silo, pages: 0, impressions: 0, clicks: 0, posSum: 0, posWeight: 0, ai: 0,
    };
    s.pages++;
    s.impressions += r.impressions ?? 0;
    s.clicks += r.clicks ?? 0;
    s.ai += r.aiReadiness;
    if (r.position !== null && r.impressions > 0) {
      s.posSum += r.position * r.impressions;
      s.posWeight += r.impressions;
    }
    silos.set(r.silo, s);
  }

  return [
    header(
      'SEO Dashboard',
      'One screen for the whole site. Every number below is computed, not typed.',
      meta,
    ),
    '## Content',
    '',
    table(
      ['Metric', 'Value'],
      [
        ['Pages built (EN)', num(scored.length)],
        ['Pages built (ES)', num(rows.filter((r) => r.locale === 'es').length)],
        ['Registered in `pageIndex.ts`', num(count((r) => r.registered))],
        ['Built but **not registered**', num(count((r) => !r.registered))],
        ['Registered but **not built**', num(meta.missingBuilds)],
        ['Pillar pages', num(count((r) => r.pillar))],
        ['Silos', num(silos.size)],
      ],
      ['', 'r'],
    ),
    '',
    '## Performance',
    '',
    gsc.rowsRead === 0
      ? `> ⚠ **No Search Console data loaded.** Drop a Performance → Pages export into \`${PATHS.searchConsole}/\`. ` +
        'Until then, priority runs on business value, structure and freshness only, and every ' +
        'opportunity score is capped as unproven.\n'
      : table(
          ['Metric', 'Value'],
          [
            ['Clicks', num(totalClicks)],
            ['Impressions', num(totalImpr)],
            ['Site CTR', totalImpr ? pct(totalClicks / totalImpr, 2) : '—'],
            ['Average position (impression-weighted)', pos(avgPos)],
            ['Pages with impressions', num(count((r) => r.impressions > 0))],
            ['Pages with **zero** impressions', num(count((r) => !r.impressions))],
            ['In striking distance (pos 4-20)', num(count((r) => r.flags.strikingDistance))],
          ],
          ['', 'r'],
        ),
    '',
    '## Work queue',
    '',
    table(
      ['Tier', 'Pages', 'Meaning'],
      [
        ['Priority 1', num(count((r) => r.tier === 1)), `score ≥ ${THRESHOLDS.tier1} — work these now`],
        ['Priority 2', num(count((r) => r.tier === 2)), `score ${THRESHOLDS.tier2}-${THRESHOLDS.tier1 - 1} — next`],
        ['Priority 3', num(count((r) => r.tier === 3)), `score < ${THRESHOLDS.tier2} — maintain`],
      ],
      ['', 'r', ''],
    ),
    '',
    '## Gaps',
    '',
    table(
      ['Gap', 'Pages', 'Report'],
      [
        ['Need AI Summary', num(count((r) => r.flags.needsSummary)), '[AI-READINESS](AI-READINESS.md)'],
        ['Missing FAQ + schema', num(count((r) => r.flags.needsFaq)), '[AI-READINESS](AI-READINESS.md)'],
        ['Weak internal links', num(count((r) => r.flags.weakLinks)), '[INTERNAL-LINKS](INTERNAL-LINKS.md)'],
        ['Orphaned (no in-content links in)', num(count((r) => r.flags.orphan)), '[INTERNAL-LINKS](INTERNAL-LINKS.md)'],
        ['Need refresh', num(count((r) => r.flags.stale)), '[REFRESH-QUEUE](REFRESH-QUEUE.md)'],
        ['Thin (< ' + THRESHOLDS.thinWords + ' words)', num(count((r) => r.flags.thin)), '[SEO-QUEUE](SEO-QUEUE.md)'],
        ['CTR below expectation', num(count((r) => r.flags.ctrProblem)), '[OPPORTUNITY](OPPORTUNITY.md)'],
        [`AI readiness < ${THRESHOLDS.aiReadinessFloor}%`, num(count((r) => r.flags.aiGap)), '[AI-READINESS](AI-READINESS.md)'],
        ['Broken in-content links', num(intel.brokenLinks.length), '[INTERNAL-LINKS](INTERNAL-LINKS.md)'],
      ],
      ['', 'r', ''],
    ),
    '',
    '## Averages',
    '',
    table(
      ['Metric', 'Value'],
      [
        ['AI readiness', `${Math.round(scored.reduce((s, r) => s + r.aiReadiness, 0) / (scored.length || 1))}%`],
        ['Words per page', num(Math.round(scored.reduce((s, r) => s + r.words, 0) / (scored.length || 1)))],
        ['In-content inbound links', (scored.reduce((s, r) => s + r.inboundCount, 0) / (scored.length || 1)).toFixed(1)],
        ['Click depth from home', (() => {
          const d = scored.filter((r) => r.depth !== null);
          return d.length ? (d.reduce((s, r) => s + r.depth, 0) / d.length).toFixed(1) : '—';
        })()],
      ],
      ['', 'r'],
    ),
    '',
    '## Top 10 opportunities',
    '',
    table(
      ['#', 'Page', 'Opp', 'Pri', 'Impr', 'Pos', 'CTR', 'Why'],
      rows
        .filter((r) => r.locale === 'en' && !r.unproven)
        .sort((a, b) => b.opportunity - a.opportunity)
        .slice(0, 10)
        .map((r, i) => [
          i + 1, link(r), r.opportunity, r.priority, num(r.impressions), pos(r.position),
          pct(r.ctr), r.reasons[0] ?? '—',
        ]),
      ['r', '', 'r', 'r', 'r', 'r', 'r', ''],
    ),
    '',
    '## By silo',
    '',
    table(
      ['Silo', 'Pages', 'Impressions', 'Clicks', 'Avg pos', 'AI readiness'],
      [...silos.values()]
        .sort((a, b) => b.impressions - a.impressions || b.pages - a.pages)
        .map((s) => [
          s.silo, num(s.pages), num(s.impressions), num(s.clicks),
          s.posWeight ? pos(s.posSum / s.posWeight) : '—',
          `${Math.round(s.ai / s.pages)}%`,
        ]),
      ['', 'r', 'r', 'r', 'r', 'r'],
    ),
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

export function seoQueue(rows, meta) {
  const scored = rows.filter((r) => r.locale === 'en');
  const tiers = [
    { n: 1, label: `Priority 1 — work these now (score ≥ ${THRESHOLDS.tier1})` },
    { n: 2, label: `Priority 2 — next up (score ${THRESHOLDS.tier2}-${THRESHOLDS.tier1 - 1})` },
    { n: 3, label: `Priority 3 — maintain (score < ${THRESHOLDS.tier2})` },
  ];

  const body = tiers.map(({ n, label }) => {
    const list = scored.filter((r) => r.tier === n);
    const lines = [`## ${label}`, '', `**${list.length} pages**`, ''];
    if (!list.length) return [...lines, '_None._', ''].join('\n');

    if (n === 3) {
      // Tier 3 is a maintenance list, not a work list — keep it compact.
      lines.push(
        table(
          ['Page', 'Pri', 'Opp', 'Impr', 'Pos', 'AI'],
          list.slice(0, 60).map((r) => [
            link(r), r.priority, r.opportunity, num(r.impressions), pos(r.position), `${r.aiReadiness}%`,
          ]),
          ['', 'r', 'r', 'r', 'r', 'r'],
        ),
      );
      if (list.length > 60) lines.push('', `_… and ${list.length - 60} more. Full data in \`seo-snapshot.json\`._`);
      return [...lines, ''].join('\n');
    }

    for (const r of list) {
      lines.push(
        `- [ ] **${short(r.url)}** — priority ${r.priority} · opportunity ${r.opportunity} · ` +
          `AI ${r.aiReadiness}% · ${num(r.impressions)} impr · pos ${pos(r.position)}`,
        `  - ${r.title || '(no title)'}`,
        `  - Why: ${r.reasons.join('; ') || 'baseline maintenance'}`,
        `  - Do: ${nextAction(r)}`,
      );
    }
    return [...lines, ''].join('\n');
  });

  return [
    header(
      'SEO Work Queue',
      'The ordered list of what to work on, and what to do to each page. ' +
        'Tick a box if you like — the file is rewritten on the next run, so the queue is ' +
        'the source of truth, not the checkmarks.',
      meta,
    ),
    '**How priority is computed** — ' +
      Object.entries(meta.weights).map(([k, w]) => `${k} ${Math.round(w)}`).join(' · ') +
      ' (weights in `scripts/seo/config.mjs`).',
    '',
    meta.hasPerformanceData
      ? ''
      : '> ⚠ **No Search Console export loaded.** Impressions, position and CTR normally carry ' +
        `60 of the 100 points; with no data they are dropped and the remaining factors are ` +
        'rescaled to 100 so the queue still ranks. It ranks on structure, business value and ' +
        `freshness only. Drop a Pages export into \`${PATHS.searchConsole}/\` and re-run to get ` +
        'the real ordering.\n',
    '',
    ...body,
  ].join('\n');
}

const ACTIONS = {
  ctr: (r) =>
    `rewrite \`<title>\` + meta description — it ranks at ${pos(r.position)} but earns ${pct(r.ctr)} vs ~${pct(r.expectedCtr)} expected`,
  orphan: (r) =>
    `add in-content links from ${(r.linkSuggestions ?? []).map(short).join(', ') || 'related pages in the same silo'}`,
  weakLinks: (r) =>
    `raise inbound links from ${r.inboundCount} — link from ${(r.linkSuggestions ?? []).map(short).join(', ') || 'its silo hub'}`,
  summary: () => 'add a `<SummaryBlock>` TL;DR under the H1',
  faq: () => 'add the `<FAQ>` component (visible Q&A + FAQPage schema, welded)',
  thin: (r) => `expand to depth — currently ${num(r.words)} words`,
  stale: (r) => `refresh figures and dates — untouched for ${r.ageDays} days`,
  aiGap: (r) =>
    `close AI-readiness gaps: ${Object.values(r.aiFeatures).filter((f) => !f.got).map((f) => f.label).join(', ')}`,
};

/**
 * The single highest-leverage next edit for a page.
 *
 * `focus` lets a themed section ask for its own kind of fix, so a task filed
 * under "internal links" does not come back saying "expand the page".
 */
export function nextAction(r, focus) {
  if (focus === 'links') {
    if (r.flags.orphan) return ACTIONS.orphan(r);
    if (r.flags.weakLinks) return ACTIONS.weakLinks(r);
  }
  if (focus === 'ai') {
    if (r.flags.needsSummary) return ACTIONS.summary(r);
    if (r.flags.needsFaq) return ACTIONS.faq(r);
    if (r.flags.aiGap) return ACTIONS.aiGap(r);
  }
  if (focus === 'refresh' && r.ageDays !== null) return ACTIONS.stale(r);

  if (r.flags.ctrProblem) return ACTIONS.ctr(r);
  if (r.flags.orphan) return ACTIONS.orphan(r);
  if (r.flags.needsSummary) return ACTIONS.summary(r);
  if (r.flags.needsFaq) return ACTIONS.faq(r);
  if (r.flags.thin) return ACTIONS.thin(r);
  if (r.flags.weakLinks) return ACTIONS.weakLinks(r);
  if (r.flags.criticallyStale) return ACTIONS.stale(r);
  if (r.flags.aiGap) return ACTIONS.aiGap(r);
  if (r.flags.strikingDistance) return 'deepen the page and add internal links — it is one push from page 1';
  if (r.flags.noData) return 'no impressions yet — confirm it is indexed, then build internal links to it';
  return 'monitor';
}

// ─────────────────────────────────────────────────────────────────────────────

export function opportunity(rows, meta) {
  const scored = rows.filter((r) => r.locale === 'en');
  const proven = scored.filter((r) => !r.unproven).sort((a, b) => b.opportunity - a.opportunity);
  const gapVsPriority = proven
    .filter((r) => r.opportunity - r.priority >= 15)
    .slice(0, 20);

  return [
    header(
      'Opportunity Rankings',
      'Where effort converts fastest. Opportunity favours pages Google already indexes, ' +
        'already ranks, and already trusts — those move in weeks, not quarters. ' +
        'A page with no impressions is a bet, not an opportunity, so it is capped.',
      meta,
    ),
    `**Weights** — impressions 40 · striking-distance proximity 30 · CTR gap 20 · click headroom 10. ` +
      `Pages with zero impressions cap at ${meta.unprovenCap}.`,
    '',
    '## Ranked',
    '',
    table(
      ['#', 'Page', 'Opp', 'Pri', 'Impressions', 'Clicks', 'Pos', 'CTR', 'Expected', 'Action'],
      proven.slice(0, 50).map((r, i) => [
        i + 1, link(r), r.opportunity, r.priority, num(r.impressions), num(r.clicks),
        pos(r.position), pct(r.ctr), pct(r.expectedCtr), nextAction(r),
      ]),
      ['r', '', 'r', 'r', 'r', 'r', 'r', 'r', 'r', ''],
    ),
    '',
    '## Fast wins — opportunity far above priority',
    '',
    'These rank higher on speed-to-result than on strategic weight. Good filler work ' +
      'between the Priority 1 pages.',
    '',
    table(
      ['Page', 'Opp', 'Pri', 'Δ', 'Pos', 'Impr', 'Action'],
      gapVsPriority.map((r) => [
        link(r), r.opportunity, r.priority, `+${r.opportunity - r.priority}`,
        pos(r.position), num(r.impressions), nextAction(r),
      ]),
      ['', 'r', 'r', 'r', 'r', 'r', ''],
    ),
    '',
    '## Not yet proven',
    '',
    `${scored.filter((r) => r.unproven).length} pages have no Search Console impressions. ` +
      'They are ranked by business value only, and are usually an indexing or ' +
      'internal-linking problem rather than a content one.',
    '',
    table(
      ['Page', 'Silo', 'Inbound', 'Depth', 'Indexed?'],
      scored
        .filter((r) => r.unproven)
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 30)
        .map((r) => [
          link(r), r.silo, r.inboundCount, r.depth ?? '—',
          r.inboundCount === 0 && !r.navLinked ? '⚠ orphan — likely not crawled' : 'linked',
        ]),
      ['', '', 'r', 'r', ''],
    ),
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

export function aiReadiness(rows, meta) {
  const scored = rows.filter((r) => r.locale === 'en');
  const featureKeys = Object.keys(AI_WEIGHTS);
  const labels = featureKeys.map((k) => scored[0]?.aiFeatures[k]?.label ?? k);

  const rollup = featureKeys.map((k, i) => {
    const got = scored.filter((r) => r.aiFeatures[k].got).length;
    return [
      labels[i], `${AI_WEIGHTS[k]}`, num(got), num(scored.length - got),
      `${Math.round((got / (scored.length || 1)) * 100)}%`,
    ];
  });

  const worst = [...scored].sort((a, b) => a.aiReadiness - b.aiReadiness);

  return [
    header(
      'AI Readiness',
      'How extractable each page is for AI Overviews and assistant answers. ' +
        'Scored from the built HTML, so it reflects what a crawler actually receives.',
      meta,
    ),
    `**Site average: ${Math.round(scored.reduce((s, r) => s + r.aiReadiness, 0) / (scored.length || 1))}%**`,
    '',
    '## Coverage by feature',
    '',
    table(['Feature', 'Weight', 'Have', 'Missing', 'Coverage'], rollup, ['', 'r', 'r', 'r', 'r']),
    '',
    '> `Original insights` has no machine-readable marker. It is scored from three ' +
      'observable proxies — a named author byline, a cited sources list, and word count at ' +
      'or above the site median. Treat it as a hint, not a verdict.',
    '',
    '## Lowest-scoring pages',
    '',
    table(
      ['Page', 'Score', ...labels, 'Priority'],
      worst.slice(0, 60).map((r) => [
        link(r), `${r.aiReadiness}%`, ...featureKeys.map((k) => yesNo(r.aiFeatures[k].got)), r.priority,
      ]),
      ['', 'r', ...featureKeys.map(() => 'c'), 'r'],
    ),
    '',
    '## Fix lists',
    '',
    ...['summary', 'faq', 'definitions', 'tables'].flatMap((key) => {
      const missing = scored.filter((r) => !r.aiFeatures[key].got).sort((a, b) => b.priority - a.priority);
      const label = scored[0]?.aiFeatures[key]?.label ?? key;
      return [
        `### Missing ${label} — ${missing.length} pages`,
        '',
        missing.length
          ? missing.slice(0, 40).map((r) => `- ${link(r)} — priority ${r.priority}, ${num(r.impressions)} impr`).join('\n') +
            (missing.length > 40 ? `\n- _… and ${missing.length - 40} more_` : '')
          : '_None — full coverage._',
        '',
      ];
    }),
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

export function internalLinks(rows, meta, intel) {
  const scored = rows.filter((r) => r.locale === 'en');
  const orphans = scored.filter((r) => r.flags.orphan).sort((a, b) => b.priority - a.priority);
  const weak = scored
    .filter((r) => !r.flags.orphan && r.flags.weakLinks)
    .sort((a, b) => b.priority - a.priority);
  const hubs = [...scored].sort((a, b) => b.inboundCount - a.inboundCount).slice(0, 20);
  const stingy = scored
    .filter((r) => r.flags.lowOutbound)
    .sort((a, b) => a.outboundCount - b.outboundCount || b.priority - a.priority);

  const depths = new Map();
  for (const r of scored) {
    const key = r.depth === null ? 'unreachable' : r.depth;
    depths.set(key, (depths.get(key) ?? 0) + 1);
  }

  return [
    header(
      'Internal Link Report',
      'The editorial link graph — links inside page content only. Header, footer and ' +
        'other site furniture are excluded, because a nav link on every page tells you ' +
        'nothing about whether a page is genuinely supported.',
      meta,
    ),
    `Site furniture excluded: **${intel.navLinks.length} link targets** appear in the header/footer of ` +
      `≥${Math.round(THRESHOLDS.boilerplateShare * 100)}% of pages.`,
    '',
    '## Orphans — no in-content link points here',
    '',
    orphans.length
      ? table(
          ['Page', 'Silo', 'Priority', 'Impressions', 'In nav?', 'Link it from'],
          orphans.map((r) => [
            link(r), r.silo, r.priority, num(r.impressions), yesNo(r.navLinked),
            (r.linkSuggestions ?? []).map(short).join(', ') || '—',
          ]),
          ['', '', 'r', 'r', 'c', ''],
        )
      : '_No orphans. Every page has at least one editorial link pointing at it._\n',
    '',
    `## Weakly linked — fewer than ${THRESHOLDS.weakInboundLinks} inbound`,
    '',
    table(
      ['Page', 'Inbound', 'Priority', 'Impressions', 'Link it from'],
      weak.slice(0, 50).map((r) => [
        link(r), r.inboundCount, r.priority, num(r.impressions),
        (r.linkSuggestions ?? []).map(short).join(', ') || '—',
      ]),
      ['', 'r', 'r', 'r', ''],
    ),
    '',
    '## Strongest hubs — most inbound editorial links',
    '',
    table(
      ['Page', 'Inbound', 'Outbound', 'Pillar', 'Silo'],
      hubs.map((r) => [link(r), r.inboundCount, r.outboundCount, yesNo(r.pillar), r.silo]),
      ['', 'r', 'r', 'c', ''],
    ),
    '',
    `## Pages that link out least — fewer than ${THRESHOLDS.lowOutboundLinks} outbound`,
    '',
    'Low outbound is a wasted asset: these pages receive equity and pass none on.',
    '',
    table(
      ['Page', 'Outbound', 'Impressions', 'Silo'],
      stingy.slice(0, 40).map((r) => [link(r), r.outboundCount, num(r.impressions), r.silo]),
      ['', 'r', 'r', ''],
    ),
    '',
    '## Click depth from the homepage',
    '',
    'Following in-content links only — nav shortcuts are excluded on purpose.',
    '',
    table(
      ['Depth', 'Pages'],
      [...depths.entries()]
        .sort((a, b) => (a[0] === 'unreachable' ? 1 : b[0] === 'unreachable' ? -1 : a[0] - b[0]))
        .map(([d, n]) => [d === 'unreachable' ? 'unreachable via content links' : `${d} click(s)`, num(n)]),
      ['', 'r'],
    ),
    '',
    '## Broken in-content links',
    '',
    intel.brokenLinks.length
      ? table(
          ['From', 'To (no such page)'],
          intel.brokenLinks.slice(0, 50).map((b) => [short(b.from), `\`${b.to}\``]),
        )
      : '_None. Every in-content link resolves to a built page._\n',
    '',
    '## Registry integrity',
    '',
    '### Built but not in `pageIndex.ts`',
    '',
    'These pages exist but are invisible to the Related engine and to this system\'s ' +
      'taxonomy. Register them or delete them.',
    '',
    scored.filter((r) => !r.registered).length
      ? table(
          ['Page', 'Impressions', 'Words'],
          scored.filter((r) => !r.registered).map((r) => [link(r), num(r.impressions), num(r.words)]),
          ['', 'r', 'r'],
        )
      : '_None — every built page is registered._\n',
    '',
    '### In `pageIndex.ts` but not built',
    '',
    meta.missingList.length
      ? meta.missingList.map((u) => `- \`${u}\` — registered but no HTML in \`${PATHS.dist}/\``).join('\n') + '\n'
      : '_None — every registered page builds._\n',
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

export function refreshQueue(rows, meta) {
  const scored = rows
    .filter((r) => r.locale === 'en' && r.ageDays !== null)
    .map((r) => ({ ...r, decay: r.ageDays * Math.log1p(r.impressions ?? 0) }))
    .sort((a, b) => b.decay - a.decay);
  const stale = scored.filter((r) => r.flags.stale);
  const noHistory = rows.filter((r) => r.locale === 'en' && r.ageDays === null);

  return [
    header(
      'Refresh Queue',
      'Ordered by decay — how long a page has gone untouched, weighted by how much ' +
        'traffic it carries. A stale page nobody visits can wait; a stale page with ' +
        '5,000 impressions is losing money every week.',
      meta,
    ),
    `Stale threshold: **${THRESHOLDS.staleDays} days** · critical: **${THRESHOLDS.criticalStaleDays} days**. ` +
      'Freshness comes from `git log` on the page\'s route file — and, for generated pages, ' +
      'on the `src/data` module that produces them.',
    '',
    `## Needs refresh — ${stale.length} pages`,
    '',
    table(
      ['Page', 'Last updated', 'Age', 'Impressions', 'Pos', 'Priority', 'Source'],
      stale.slice(0, 60).map((r) => [
        link(r), (r.lastModified ?? '').slice(0, 10), `${r.ageDays}d`, num(r.impressions),
        pos(r.position), r.priority,
        `\`${(r.sourceFiles ?? []).map((f) => f.split('/').pop()).join('`, `') || '—'}\``,
      ]),
      ['', '', 'r', 'r', 'r', 'r', ''],
    ),
    '',
    '## Freshest pages',
    '',
    table(
      ['Page', 'Last updated', 'Age'],
      [...scored].sort((a, b) => a.ageDays - b.ageDays).slice(0, 15)
        .map((r) => [link(r), (r.lastModified ?? '').slice(0, 10), `${r.ageDays}d`]),
      ['', '', 'r'],
    ),
    '',
    noHistory.length
      ? `## No git history — ${noHistory.length} pages\n\n` +
        'No route file could be matched to these URLs, so freshness is unknown. Usually a ' +
        'generated page whose template moved.\n\n' +
        noHistory.slice(0, 30).map((r) => `- ${link(r)}`).join('\n') + '\n'
      : '',
  ].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────

export function weeklyTasks(rows, meta) {
  const scored = rows.filter((r) => r.locale === 'en');
  const pick = (fn, n) => scored.filter(fn).sort((a, b) => b.priority - a.priority).slice(0, n);

  // With no export loaded, every page reads as zero impressions — gating on
  // traffic would empty most buckets and hand back a two-item week.
  const hasTraffic = (r) => !meta.hasPerformanceData || r.impressions > 0;

  // One task per page, drawn from different buckets so a week's work is varied
  // and each task is a different kind of fix.
  const buckets = [
    ['Fastest wins — title/meta only', pick((r) => r.flags.ctrProblem, 3), null],
    ['Highest-priority content work', pick((r) => r.tier === 1 && !r.flags.ctrProblem, 4), null],
    ['Structural — internal links', pick((r) => r.flags.orphan || (r.flags.weakLinks && hasTraffic(r)), 3), 'links'],
    ['AI readiness', pick((r) => r.flags.needsSummary && hasTraffic(r), 3), 'ai'],
    ['Refresh', pick((r) => r.flags.criticallyStale && hasTraffic(r), 2), 'refresh'],
  ];

  const seen = new Set();
  const sections = buckets.map(([title, list, focus]) => {
    const items = list.filter((r) => !seen.has(r.url));
    items.forEach((r) => seen.add(r.url));
    return [
      `## ${title}`,
      '',
      items.length
        ? items
            .map(
              (r) =>
                `- [ ] **${short(r.url)}** — ${nextAction(r, focus)}\n` +
                `      _${num(r.impressions)} impr · pos ${pos(r.position)} · priority ${r.priority} · opportunity ${r.opportunity}_`,
            )
            .join('\n')
        : '_Nothing outstanding in this bucket._',
      '',
    ].join('\n');
  });

  return [
    header(
      'This Week',
      `${seen.size} concrete tasks, one per page, chosen so the week covers fast wins, ` +
        'deep work, structure, AI readiness and maintenance rather than fifteen variations ' +
        'of the same edit.',
      meta,
    ),
    ...sections,
    '---',
    '',
    'Done for the week? Re-run `npm run seo` after the next build — the queue recomputes ' +
      'from the new HTML, the new git history and the latest Search Console export.',
  ].join('\n');
}
