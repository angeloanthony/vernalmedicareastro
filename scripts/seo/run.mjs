// scripts/seo/run.mjs — the SEO intelligence engine.
//
//   npm run seo          score the current build and regenerate every report
//   npm run seo:build    rebuild the site first, then do the same
//
// Pipeline:
//   pageIndex.ts ─┐
//   GSC CSVs      ├─► merge ─► score ─► docs/seo/*.md + seo-snapshot.json
//   dist/*.html   │
//   git log      ─┘
//
// Everything downstream of "merge" is derived. No report is ever hand-edited.

import { writeFileSync, readFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PATHS, EXCLUDED, UNPROVEN_OPPORTUNITY_CAP, SITE_ORIGIN } from './config.mjs';
import { loadRegistry, loadSearchConsole, loadSiteIntel, loadFreshness } from './sources.mjs';
import { scorePages } from './score.mjs';
import * as reports from './reports.mjs';
import { topicCoverage, deltaReport } from './trends.mjs';
import { editorialCompleteness } from './editorial.mjs';
import { completenessFor } from './standards.mjs';

const args = new Set(process.argv.slice(2));
const quiet = args.has('--quiet');
const say = (...m) => !quiet && console.log(...m);

// ── 0. optional rebuild ──────────────────────────────────────────────────────
if (args.has('--build')) {
  say('▶ astro build');
  execFileSync('npx', ['astro', 'build'], { stdio: 'inherit', shell: true });
}

// ── 1-3. read the canonical sources ──────────────────────────────────────────
say('▶ reading sources');
const registry = await loadRegistry();
const gsc = loadSearchConsole();
const intel = loadSiteIntel();

// Redirect stubs and noindex pages cannot rank and have no SEO work queue —
// they are reported as counts, not scored as content.
const notContent = intel.pages.filter((p) => p.redirect || p.noindex);
const built = intel.pages.filter(
  (p) => !EXCLUDED.has(p.url) && !p.url.endsWith('/404.html') && !p.redirect && !p.noindex,
);
const freshness = loadFreshness(built.map((p) => p.url));

say(
  `  registry ${registry.byUrl.size} entries · built ${built.length} pages · ` +
    `search console ${gsc.rowsRead} rows from ${gsc.provenance.filter((p) => p.used).length} file(s)`,
);

// Warn when dist is older than src — the intel layer would describe a stale site.
const newestMtime = (dir, ext) => {
  let newest = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue;
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (!ext || e.name.endsWith(ext)) newest = Math.max(newest, statSync(full).mtimeMs);
    }
  };
  if (existsSync(dir)) walk(dir);
  return newest;
};
const srcTime = Math.max(newestMtime('src'), newestMtime('public'));
const distTime = newestMtime(PATHS.dist, '.html');
const distStale = srcTime > distTime;
if (distStale) {
  console.warn(
    `⚠ ${PATHS.dist}/ is older than src/ — page intelligence describes the last build, ` +
      'not your working tree. Run `npm run seo:build` for current numbers.',
  );
}

// ── merge into one row per built page ────────────────────────────────────────
const rows = built.map((p) => {
  const reg = registry.byUrl.get(p.url) ?? registry.byUrl.get(p.baseUrl);
  const perf = gsc.byUrl.get(p.url);
  const fresh = freshness.get(p.url) ?? {};
  return {
    ...p,
    registered: Boolean(registry.byUrl.get(p.url)),
    title: p.title || reg?.title || '',
    registryTitle: reg?.title ?? null,
    silo: reg?.silo ?? 'unregistered',
    tags: reg?.tags ?? [],
    pillar: Boolean(reg?.pillar),
    clicks: perf?.clicks ?? 0,
    impressions: perf?.impressions ?? 0,
    ctr: perf?.ctr ?? 0,
    position: perf?.position ?? null,
    lastModified: fresh.lastModified ?? null,
    sourceFiles: fresh.sourceFiles ?? [],
  };
});

const builtUrls = new Set(rows.map((r) => r.url));
const missingList = [...registry.byUrl.keys()].filter((u) => !builtUrls.has(u));
const unmatchedGsc = [...gsc.byUrl.values()]
  .filter((p) => !builtUrls.has(p.url))
  .sort((a, b) => b.impressions - a.impressions);

// ── 4. score ─────────────────────────────────────────────────────────────────
say('▶ scoring');
const now = Date.now();
const { rows: scored, stats, weights } = scorePages(rows, now, {
  hasPerformanceData: gsc.rowsRead > 0,
});

// Editorial standard: what a page of this kind owes a reader (standards.mjs).
for (const r of scored) r.completeness = completenessFor(r);

// Suggest where a weakly-linked page should be linked FROM: same silo, does not
// already link to it, prefer the silo's pillar and its best-supported pages.
const byUrl = new Map(scored.map((r) => [r.url, r]));
for (const r of scored) {
  if (!r.flags.orphan && !r.flags.weakLinks) continue;
  r.linkSuggestions = scored
    .filter(
      (c) =>
        c.url !== r.url &&
        c.locale === r.locale &&
        c.silo === r.silo &&
        !c.linksOut.includes(r.url),
    )
    .sort((a, b) => Number(b.pillar) - Number(a.pillar) || b.inboundCount - a.inboundCount)
    .slice(0, 3)
    .map((c) => c.url);
}

// ── 5. write ─────────────────────────────────────────────────────────────────
const usedFiles = gsc.provenance.filter((p) => p.used);
const meta = {
  generatedAt: new Date(now).toISOString().slice(0, 16).replace('T', ' ') + ' UTC',
  pageCount: scored.length,
  performanceWindow: usedFiles.length
    ? usedFiles.map((p) => `\`${path.basename(p.file)}\` (exported ${p.modified})`).join(', ')
    : 'no Search Console export loaded',
  missingBuilds: missingList.length,
  missingList,
  unprovenCap: UNPROVEN_OPPORTUNITY_CAP,
  distStale,
  weights,
  hasPerformanceData: gsc.rowsRead > 0,
  medianInbound: stats.medianInbound,
};

// ── history: the baseline every Delta report compares against ────────────────
// One compact snapshot per day under docs/seo/history/. Re-running on the same
// day overwrites today's file and still diffs against the most recent EARLIER
// one, so a second run never reports "nothing moved".
const historyDir = path.join(PATHS.out, 'history');
mkdirSync(historyDir, { recursive: true });
const today = new Date(now).toISOString().slice(0, 10);
const priorFiles = readdirSync(historyDir)
  .filter((f) => f.endsWith('.json') && f.slice(0, 10) < today)
  .sort();
const previous = priorFiles.length
  ? JSON.parse(readFileSync(path.join(historyDir, priorFiles.at(-1)), 'utf8'))
  : null;

writeFileSync(
  path.join(historyDir, `${today}.json`),
  JSON.stringify(
    {
      generatedAt: new Date(now).toISOString(),
      hasPerformanceData: meta.hasPerformanceData,
      performanceWindow: meta.performanceWindow,
      // Deliberately compact: the fields a delta needs and nothing else, so a
      // year of weekly snapshots stays small enough to keep in git.
      pages: scored.map((r) => ({
        url: r.url,
        clicks: r.clicks,
        impressions: r.impressions,
        position: r.position,
        priority: r.priority,
        opportunity: r.opportunity,
        aiReadiness: r.aiReadiness,
        completeness: r.completeness.completeness,
        inboundCount: r.inboundCount,
      })),
    },
    null,
    0,
  ) + '\n',
);

mkdirSync(PATHS.out, { recursive: true });
const write = (name, content) => {
  writeFileSync(path.join(PATHS.out, name), content.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
  say(`  ✔ ${PATHS.out}/${name}`);
};

write('DASHBOARD.md', reports.dashboard(scored, meta, intel, gsc));
write('SEO-QUEUE.md', reports.seoQueue(scored, meta));
write('OPPORTUNITY.md', reports.opportunity(scored, meta));
write('AI-READINESS.md', reports.aiReadiness(scored, meta));
write('INTERNAL-LINKS.md', reports.internalLinks(scored, meta, intel));
write('REFRESH-QUEUE.md', reports.refreshQueue(scored, meta));
write('WEEKLY-TASKS.md', reports.weeklyTasks(scored, meta));
write('TOPIC-COVERAGE.md', topicCoverage(scored, meta));
write('DELTA.md', deltaReport(scored, meta, previous));
write('EDITORIAL-COMPLETENESS.md', editorialCompleteness(scored, meta));

writeFileSync(
  path.join(PATHS.out, 'seo-snapshot.json'),
  JSON.stringify(
    {
      generatedAt: new Date(now).toISOString(),
      site: SITE_ORIGIN,
      sources: {
        registry: { file: PATHS.registry, entries: registry.count, duplicates: registry.duplicates },
        searchConsole: gsc.provenance,
        rendered: {
          dir: PATHS.dist,
          pages: intel.pages.length,
          scored: built.length,
          stale: distStale,
          notContent: notContent.map((p) => ({
            url: p.url,
            reason: p.redirect ? 'redirect stub' : 'noindex',
          })),
        },
      },
      stats,
      priorityWeights: weights,
      integrity: {
        registeredNotBuilt: missingList,
        builtNotRegistered: scored.filter((r) => !r.registered && r.locale === 'en').map((r) => r.url),
        brokenLinks: intel.brokenLinks,
        gscUrlsWithNoPage: unmatchedGsc.slice(0, 50),
        navLinks: intel.navLinks,
      },
      pages: scored.map((r) => ({
        url: r.url,
        title: r.title,
        locale: r.locale,
        silo: r.silo,
        tags: r.tags,
        pillar: r.pillar,
        registered: r.registered,
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
        expectedCtr: r.expectedCtr,
        ctrGap: r.ctrGap,
        words: r.words,
        tables: r.tables,
        definitions: r.definitions,
        h2: r.h2,
        schemaTypes: r.schemaTypes,
        hasSummary: r.hasSummary,
        hasFaq: r.hasFaqSchema && r.hasFaqMarkup,
        hasByline: r.hasByline,
        hasSources: r.hasSources,
        inboundCount: r.inboundCount,
        outboundCount: r.outboundCount,
        // linksOut only — the full graph. linksIn is its exact inverse, and
        // storing both doubles the file for no information.
        linksOut: r.linksOut,
        navLinked: r.navLinked,
        depth: r.depth,
        lastModified: r.lastModified,
        ageDays: r.ageDays,
        sourceFiles: r.sourceFiles,
        priority: r.priority,
        opportunity: r.opportunity,
        aiReadiness: r.aiReadiness,
        completeness: r.completeness.completeness,
        missingElements: r.completeness.missing,
        aiFeatures: Object.fromEntries(
          Object.entries(r.aiFeatures).map(([k, v]) => [k, { got: v.got, score: v.score }]),
        ),
        factors: r.factors,
        tier: r.tier,
        flags: r.flags,
        reasons: r.reasons,
        linkSuggestions: r.linkSuggestions ?? [],
        nextAction: reports.nextAction(r),
      })),
    },
    null,
    2,
  ) + '\n',
);
say(`  ✔ ${PATHS.out}/seo-snapshot.json`);

// ── summary ──────────────────────────────────────────────────────────────────
const t = (n) => scored.filter((r) => r.tier === n && r.locale === 'en').length;
say(
  `\n✔ SEO snapshot complete — P1 ${t(1)} · P2 ${t(2)} · P3 ${t(3)} · ` +
    `${scored.filter((r) => r.flags.orphan).length} orphans · ` +
    `${scored.filter((r) => r.flags.needsSummary).length} missing AI summary`,
);
if (!gsc.rowsRead) {
  say(
    `\n  Next: export Search Console → Performance → Pages as CSV into ${PATHS.searchConsole}/ ` +
      'and re-run. Impressions, position and CTR are 60 of the 100 priority points.',
  );
}
if (unmatchedGsc.length) {
  say(
    `\n  Note: ${unmatchedGsc.length} Search Console URL(s) have no page in ${PATHS.dist}/ — ` +
      'see `integrity.gscUrlsWithNoPage` in seo-snapshot.json (possible 404s or removed pages).',
  );
}
