// scripts/seo/editorial.mjs — Editorial Completeness.
//
// AI-READINESS asks "can a machine extract this page?".
// TOPIC-COVERAGE asks "which cluster is weak?".
// This asks the question neither can: "does this page meet OUR standard for
// what a page of its kind must contain?" — scored against the editorial spec in
// standards.mjs rather than against universal feature weights.
//
// The last section answers the planning question directly: across the pages
// that matter most right now, which single missing element appears most often?
// That element is a template fix, not a page fix — one component lands across
// dozens of pages at once.

import { ELEMENTS, requiredFor } from './standards.mjs';
import { num, pos, short, link, yesNo, table, header } from './md.mjs';

const TOP_N = 20;

export function editorialCompleteness(rows, meta) {
  const scored = rows.filter((r) => r.locale === 'en');
  if (!scored.length) return header('Editorial Completeness', 'No pages scored.', meta);

  const siteAvg = Math.round(
    scored.reduce((s, r) => s + r.completeness.completeness, 0) / scored.length,
  );

  // ── per cluster ──
  const silos = new Map();
  for (const r of scored) {
    let s = silos.get(r.silo);
    if (!s) s = { silo: r.silo, pages: 0, total: 0, hits: new Map(), impressions: 0 };
    s.pages++;
    s.total += r.completeness.completeness;
    s.impressions += r.impressions ?? 0;
    for (const key of r.completeness.required) {
      const hit = s.hits.get(key) ?? { have: 0, need: 0 };
      hit.need++;
      if (ELEMENTS[key].detect(r)) hit.have++;
      s.hits.set(key, hit);
    }
    silos.set(r.silo, s);
  }

  const clusters = [...silos.values()]
    .map((s) => ({
      ...s,
      completeness: Math.round(s.total / s.pages),
      elements: [...s.hits.entries()].map(([key, h]) => ({
        key,
        label: ELEMENTS[key].label,
        pct: Math.round((h.have / h.need) * 100),
        have: h.have,
        need: h.need,
      })),
    }))
    .sort((a, b) => a.completeness - b.completeness);

  // ── systemic gaps: element × cluster combinations that are near-universally missing ──
  const systemic = [];
  for (const c of clusters) {
    for (const e of c.elements) {
      if (e.pct <= 25 && e.need >= 3) {
        systemic.push({ silo: c.silo, ...e, missing: e.need - e.have, impressions: c.impressions });
      }
    }
  }
  systemic.sort((a, b) => b.missing - a.missing || a.pct - b.pct);

  // ── the planning question: what's missing most among the pages that matter now ──
  // Ranked by opportunity when Search Console data is loaded, by priority when
  // it is not — so the answer is always about the pages actually queued next.
  const rankKey = meta.hasPerformanceData ? 'opportunity' : 'priority';
  const top = [...scored].sort((a, b) => b[rankKey] - a[rankKey]).slice(0, TOP_N);
  const freq = new Map();
  for (const r of top) {
    for (const key of r.completeness.missing) {
      const f = freq.get(key) ?? { key, label: ELEMENTS[key].label, count: 0, pages: [] };
      f.count++;
      f.pages.push(r.url);
      freq.set(key, f);
    }
  }
  const patterns = [...freq.values()].sort((a, b) => b.count - a.count);

  const worst = [...scored].sort(
    (a, b) => a.completeness.completeness - b.completeness.completeness || b.priority - a.priority,
  );

  return [
    header(
      'Editorial Completeness',
      'Does each page contain what a page of its kind owes a reader? Measured against ' +
        'the editorial standard in `scripts/seo/standards.mjs` — a per-cluster spec, not ' +
        'a universal feature score. A page can be highly AI-readable and still incomplete.',
      meta,
    ),
    `**Site completeness: ${siteAvg}%**`,
    '',
    '## Build these components first',
    '',
    `Across the top ${TOP_N} pages by ${rankKey}, this is how often each required element is ` +
      'missing. The elements at the top of this list are **template work**: build the component ' +
      'once and every page below it is fixed at the same time. Do these before touching ' +
      'individual pages.',
    '',
    patterns.length
      ? table(
          ['Missing element', 'Pages', `of top ${TOP_N}`, 'Component to build'],
          patterns.map((p) => [
            `**${p.label}**`, p.count, `${Math.round((p.count / top.length) * 100)}%`,
            `\`${ELEMENTS[p.key].component}\``,
          ]),
          ['', 'r', 'r', ''],
        )
      : '_Every top page already meets its standard._\n',
    '',
    patterns.length
      ? `Worked example — adding **${patterns[0].label}** to ${patterns[0].count} of the top ` +
        `${TOP_N} pages:\n\n` +
        patterns[0].pages.slice(0, 10).map((u) => `- ${short(u)}`).join('\n') +
        (patterns[0].pages.length > 10 ? `\n- _… and ${patterns[0].pages.length - 10} more_` : '') +
        '\n'
      : '',
    '',
    '## Systemic gaps — whole clusters missing an element',
    '',
    'An element missing from ≥75% of a cluster is not a content problem, it is a template ' +
      'problem. One component change fixes every page in the row.',
    '',
    systemic.length
      ? table(
          ['Cluster', 'Missing element', 'Have', 'Coverage', 'Pages to fix', 'Cluster impressions'],
          systemic.map((s) => [
            s.silo, s.label, `${s.have}/${s.need}`, `${s.pct}%`, num(s.missing), num(s.impressions),
          ]),
          ['', '', 'r', 'r', 'r', 'r'],
        )
      : '_No cluster-wide gaps._\n',
    '',
    '## Completeness by cluster',
    '',
    table(
      ['Cluster', 'Pages', 'Completeness', 'Required elements', 'Weakest'],
      clusters.map((c) => {
        const weak = [...c.elements].sort((a, b) => a.pct - b.pct).slice(0, 3);
        return [
          c.silo, num(c.pages), `**${c.completeness}%**`, num(requiredFor(c.silo).length),
          weak.map((w) => `${w.label} ${w.pct}%`).join(' · '),
        ];
      }),
      ['', 'r', 'r', 'r', ''],
    ),
    '',
    '## Element coverage per cluster',
    '',
    'A dash means the element is **not required** for that cluster.',
    '',
    (() => {
      const keys = Object.keys(ELEMENTS);
      return table(
        ['Cluster', ...keys.map((k) => ELEMENTS[k].label)],
        clusters.map((c) => [
          c.silo,
          ...keys.map((k) => {
            const e = c.elements.find((x) => x.key === k);
            return e ? `${e.pct}%` : '—';
          }),
        ]),
        ['', ...keys.map(() => 'r')],
      );
    })(),
    '',
    '## Pages furthest below standard',
    '',
    table(
      ['Page', 'Cluster', 'Complete', 'Missing', 'Priority'],
      worst.slice(0, 40).map((r) => [
        link(r), r.silo, `${r.completeness.completeness}%`,
        r.completeness.missing.map((k) => ELEMENTS[k].label).join(', ') || '—',
        r.priority,
      ]),
      ['', '', 'r', '', 'r'],
    ),
    '',
    '## Fully compliant pages',
    '',
    (() => {
      const complete = scored.filter((r) => r.completeness.completeness === 100);
      return complete.length
        ? `${complete.length} of ${scored.length} pages meet their cluster standard in full.\n\n` +
            table(
              ['Page', 'Cluster', 'Impressions', 'Pos'],
              complete
                .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
                .slice(0, 20)
                .map((r) => [link(r), r.silo, num(r.impressions), pos(r.position)]),
              ['', '', 'r', 'r'],
            )
        : '_No page meets its cluster standard in full yet._\n';
    })(),
    '',
    '## The standard',
    '',
    'Edit `scripts/seo/standards.mjs` to change what any cluster is held to.',
    '',
    table(
      ['Element', 'Satisfied by', 'Required in'],
      Object.entries(ELEMENTS).map(([key, e]) => [
        e.label,
        `\`${e.component}\``,
        clusters.filter((c) => requiredFor(c.silo).includes(key)).length === clusters.length
          ? 'every cluster'
          : clusters.filter((c) => requiredFor(c.silo).includes(key)).map((c) => c.silo).join(', ') || '—',
      ]),
    ),
  ].join('\n');
}

export { yesNo };
