// scripts/seo/gate.mjs — the editorial publish gate.
//
//   npm run seo:gate               enforce the standard against the last snapshot
//   npm run seo:gate -- --accept   accept every current score as the new floor
//
// EDITORIAL-COMPLETENESS.md reports the standard; this command ENFORCES it.
// Two rules:
//
//   1. A page not yet in the baseline is NEW content, and new content may not
//      ship below GATE.threshold% completeness. Quality before quantity.
//   2. A page already in the baseline may never score below its recorded
//      floor. Floors rise automatically whenever a page improves, so quality
//      ratchets up and cannot silently slide back.
//
// Existing pages are grandfathered at their current score on the first run:
// historical debt stays visible in EDITORIAL-COMPLETENESS.md, but only NEW
// debt fails this command. The gate is a consumer of seo-snapshot.json, not a
// second scorer — the numbers it enforces are exactly the numbers the reports
// show. The baseline file is machine-written and committed: its git history IS
// the record of the standard rising.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PATHS, GATE } from './config.mjs';
import { ELEMENTS } from './standards.mjs';

/**
 * Apply the two gate rules to one snapshot's pages. Pure — no filesystem.
 *
 * @param pages     snapshot `pages` array ({ url, locale, completeness, missingElements })
 * @param baseline  parsed baseline file ({ pages: { url: floor } }) — may be empty
 * @param threshold minimum completeness for a page with no recorded floor
 * @returns {{ failures: Array, nextBaseline: Object, added: number, raised: number, dropped: string[] }}
 */
export function evaluateGate(pages, baseline, threshold) {
  const floors = baseline?.pages ?? {};
  const scored = pages.filter((p) => p.locale === 'en');
  const failures = [];
  const nextBaseline = {};
  let added = 0;
  let raised = 0;

  for (const p of scored) {
    const floor = floors[p.url];
    if (floor === undefined) {
      // Rule 1 — new content meets the publish standard or does not ship.
      // A failing page is NOT added to the baseline, so it fails again next
      // run rather than being quietly grandfathered.
      if (p.completeness < threshold) {
        failures.push({ kind: 'new', url: p.url, now: p.completeness, floor: threshold, missing: p.missingElements ?? [] });
      } else {
        nextBaseline[p.url] = p.completeness;
        added++;
      }
    } else if (p.completeness < floor) {
      // Rule 2 — no page slides below its recorded floor.
      failures.push({ kind: 'regression', url: p.url, now: p.completeness, floor, missing: p.missingElements ?? [] });
      nextBaseline[p.url] = floor;
    } else {
      if (p.completeness > floor) raised++;
      nextBaseline[p.url] = p.completeness;
    }
  }

  // Pages that no longer build leave the baseline with the page.
  const built = new Set(scored.map((p) => p.url));
  const dropped = Object.keys(floors).filter((u) => !built.has(u));

  return { failures, nextBaseline, added, raised, dropped };
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly) {
  const accept = process.argv.includes('--accept');

  const snapPath = path.join(PATHS.out, 'seo-snapshot.json');
  if (!existsSync(snapPath)) {
    console.error(
      `✖ ${snapPath} not found — run \`npm run seo:build\` first. ` +
        'The gate judges the last build, not the working tree.',
    );
    process.exit(1);
  }
  const snap = JSON.parse(readFileSync(snapPath, 'utf8'));
  if (snap.sources?.rendered?.stale) {
    console.warn(
      '⚠ the snapshot was generated from a dist/ older than src/ — ' +
        'run `npm run seo:build` for a verdict on current content.',
    );
  }

  const en = (snap.pages ?? []).filter((p) => p.locale === 'en');
  const siteAvg = Math.round(en.reduce((s, p) => s + p.completeness, 0) / Math.max(1, en.length));
  const labelOf = (key) => ELEMENTS[key]?.label ?? key;
  const sorted = (obj) =>
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
  const save = (floors) =>
    writeFileSync(
      GATE.baselineFile,
      JSON.stringify(
        { threshold: GATE.threshold, updated: new Date().toISOString().slice(0, 10), pages: sorted(floors) },
        null,
        2,
      ) + '\n',
    );

  if (!existsSync(GATE.baselineFile)) {
    // First run — grandfather every existing page at its current score.
    save(Object.fromEntries(en.map((p) => [p.url, p.completeness])));
    console.log(
      `✔ baseline created — ${en.length} existing pages grandfathered at their current scores ` +
        `(site mean ${siteAvg}%).\n` +
        `  From now on: new pages must reach ${GATE.threshold}%, and no page may drop below its floor.\n` +
        `  Commit ${GATE.baselineFile}.`,
    );
    process.exit(0);
  }

  const baseline = JSON.parse(readFileSync(GATE.baselineFile, 'utf8'));

  if (accept) {
    const lowered = en.filter((p) => (baseline.pages?.[p.url] ?? 0) > p.completeness);
    save(Object.fromEntries(en.map((p) => [p.url, p.completeness])));
    console.log(
      `✔ baseline reset to current scores — ${lowered.length} floor(s) lowered, site mean ${siteAvg}%.`,
    );
    for (const p of lowered) console.log(`  ▼ ${p.url}  ${baseline.pages[p.url]}% → ${p.completeness}%`);
    process.exit(0);
  }

  const { failures, nextBaseline, added, raised, dropped } = evaluateGate(
    snap.pages ?? [], baseline, GATE.threshold,
  );

  if (failures.length) {
    const fresh = failures.filter((f) => f.kind === 'new');
    const regressed = failures.filter((f) => f.kind === 'regression');
    console.error(`✖ EDITORIAL GATE FAILED — ${failures.length} page(s)\n`);
    if (fresh.length) {
      console.error(`New pages below the ${GATE.threshold}% publish standard:`);
      for (const f of fresh) {
        console.error(`  ${String(f.now).padStart(3)}%  ${f.url}`);
        console.error(`        missing: ${f.missing.map(labelOf).join(', ') || '—'}`);
      }
      console.error('');
    }
    if (regressed.length) {
      console.error('Regressions — pages now below their recorded floor:');
      for (const f of regressed) {
        console.error(`  ${String(f.now).padStart(3)}% (floor ${f.floor}%)  ${f.url}`);
        console.error(`        missing: ${f.missing.map(labelOf).join(', ') || '—'}`);
      }
      console.error('');
    }
    console.error(
      'Fix the pages (EDITORIAL-COMPLETENESS.md names every missing element), or if a drop is\n' +
        'intentional, re-run with `npm run seo:gate -- --accept`.',
    );
    process.exit(1);
  }

  save(nextBaseline);
  console.log(
    `✔ editorial gate passed — ${en.length} pages, site mean ${siteAvg}%` +
      (raised ? ` · ${raised} floor(s) raised` : '') +
      (added ? ` · ${added} new page(s) admitted at ≥${GATE.threshold}%` : '') +
      (dropped.length ? ` · ${dropped.length} removed page(s) dropped from baseline` : ''),
  );
}
