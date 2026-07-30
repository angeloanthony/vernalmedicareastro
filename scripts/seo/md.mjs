// scripts/seo/md.mjs — shared Markdown helpers and the report header.
//
// Extracted so every report file renders identically: same number formatting,
// same table alignment, same provenance block. A report that formats its own
// tables drifts from the others within a week.

import { PATHS, SITE_ORIGIN } from './config.mjs';

export const num = (n) => (n ?? 0).toLocaleString('en-US');
export const pct = (n, digits = 1) => `${((n ?? 0) * 100).toFixed(digits)}%`;
export const pos = (p) => (p === null || p === undefined ? '—' : p.toFixed(1));
export const short = (url) => (url === '/' ? '/ (home)' : url.replace(/\.html$/, ''));
export const link = (r) => `[${short(r.url)}](${SITE_ORIGIN}${r.url})`;
export const yesNo = (b) => (b ? '✓' : '·');

/** Movement indicator. `invert` for metrics where a lower number is better. */
export const arrow = (d, invert = false) => {
  if (!d) return '·';
  const good = invert ? d < 0 : d > 0;
  return `${good ? '▲' : '▼'} ${d > 0 ? '+' : ''}${d}`;
};

export function table(headers, rows, align = []) {
  if (!rows.length) return '_Nothing to report._\n';
  const sep = headers.map((_, i) => (align[i] === 'r' ? '---:' : align[i] === 'c' ? ':---:' : '---'));
  return [
    `| ${headers.join(' | ')} |`,
    `| ${sep.join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n') + '\n';
}

/**
 * Every report opens with the same provenance block, and with PERFORMANCE MODE
 * stated outright. Whether Search Console data is loaded changes what the
 * numbers mean, so it must never be something the reader has to infer.
 */
export function header(title, blurb, meta) {
  const mode = meta.hasPerformanceData
    ? '**PERFORMANCE MODE: ON** — impressions, position and CTR are live; all 7 priority factors active.'
    : '**PERFORMANCE MODE: OFF** — no Search Console export loaded. Impressions, position and CTR ' +
      'are dropped and the remaining 4 factors are rescaled to 100. Rankings are structural only.';
  return [
    '<!-- GENERATED FILE — DO NOT EDIT BY HAND. Run `npm run seo` to regenerate. -->',
    '',
    `# ${title}`,
    '',
    `> ${mode}`,
    '',
    blurb,
    '',
    `> Generated **${meta.generatedAt}** · ${meta.pageCount} pages scored · ` +
      `performance window: ${meta.performanceWindow}`,
    `> Derived from \`${PATHS.registry}\` · \`${PATHS.searchConsole}/*.csv\` · ` +
      `\`${PATHS.dist}/\` · \`git log\`. Never edited by hand.`,
    '',
  ].join('\n');
}
