// scripts/seo/sources.mjs — Layers 1-3: read the four canonical sources.
//
//   Layer 1  src/data/pageIndex.ts      → what pages exist, and how they relate
//   Layer 2  data/search-console/*.csv  → how they perform
//   Layer 3  dist/**/*.html + git log   → what they contain, link to, and when
//                                         they last changed
//
// Nothing in this file interprets or ranks. It only reads and normalizes, so
// that every number downstream can be traced back to a source.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { importTs } from './ts-loader.mjs';
import { PATHS, SITE_ORIGIN, DEFAULT_LOCALE, THRESHOLDS } from './config.mjs';
import { normalizeUrl, localeOf, baseUrlOf, parseCsv, toNumber, findColumn } from './parse.mjs';

export { normalizeUrl, localeOf, baseUrlOf };

// ─────────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Every file under `dir` matching `ext`, as project-relative POSIX paths. */
function walk(dir, ext, skip = new Set()) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name) || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, ext, skip));
    else if (entry.name.endsWith(ext)) out.push(full.split(path.sep).join('/'));
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer 1 — the canonical page registry
// ─────────────────────────────────────────────────────────────────────────────

export async function loadRegistry() {
  const mod = await importTs(PATHS.registry);
  const entries = mod.PAGE_INDEX;
  if (!Array.isArray(entries)) {
    throw new Error(`${PATHS.registry} did not export a PAGE_INDEX array.`);
  }

  const byUrl = new Map();
  const duplicates = [];
  for (const e of entries) {
    const url = normalizeUrl(e.href);
    if (byUrl.has(url)) {
      duplicates.push(url);
      continue;
    }
    byUrl.set(url, {
      url,
      title: e.title,
      silo: e.taxonomy?.silo ?? 'unknown',
      tags: e.taxonomy?.tags ?? [],
      pillar: Boolean(e.taxonomy?.pillar),
    });
  }
  return { byUrl, duplicates, count: entries.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer 2 — Search Console performance
// ─────────────────────────────────────────────────────────────────────────────

const URL_COLUMNS = ['top pages', 'page', 'url', 'landing page', 'address', 'páginas principales'];
const NUM_COLUMNS = {
  clicks: ['clicks', 'url clicks', 'clics'],
  impressions: ['impressions', 'impresiones'],
  ctr: ['ctr', 'site ctr', 'url ctr'],
  position: ['position', 'average position', 'avg. position', 'posición media'],
};

/**
 * Reads every CSV in data/search-console/. Multiple exports are merged:
 * clicks/impressions sum, position is impression-weighted, CTR is recomputed.
 */
export function loadSearchConsole() {
  const dir = PATHS.searchConsole;
  const files = walk(dir, '.csv');
  const byUrl = new Map();
  const provenance = [];
  let rowsRead = 0;

  for (const file of files) {
    const rows = parseCsv(readFileSync(file, 'utf8'));
    if (!rows.length) continue;
    const header = Object.keys(rows[0]);
    const urlCol = findColumn(header, URL_COLUMNS);
    if (!urlCol) {
      // Not a "Pages" export (probably Queries.csv or Dates.csv) — skip it.
      provenance.push({ file, rows: rows.length, used: false, reason: 'no page/URL column' });
      continue;
    }
    const cols = Object.fromEntries(
      Object.entries(NUM_COLUMNS).map(([k, names]) => [k, findColumn(header, names)]),
    );

    let used = 0;
    for (const r of rows) {
      const url = normalizeUrl(r[urlCol]);
      if (!url) continue;
      const clicks = toNumber(cols.clicks && r[cols.clicks]) ?? 0;
      const impressions = toNumber(cols.impressions && r[cols.impressions]) ?? 0;
      const position = toNumber(cols.position && r[cols.position]);
      const prev = byUrl.get(url);
      if (prev) {
        const w = prev.impressions + impressions;
        prev.position = w > 0 && position !== null && prev.position !== null
          ? (prev.position * prev.impressions + position * impressions) / w
          : (prev.position ?? position);
        prev.clicks += clicks;
        prev.impressions += impressions;
      } else {
        byUrl.set(url, { url, clicks, impressions, position });
      }
      used++;
    }
    rowsRead += used;
    provenance.push({
      file,
      rows: rows.length,
      used: true,
      modified: statSync(file).mtime.toISOString().slice(0, 10),
      urlColumn: urlCol,
    });
  }

  for (const p of byUrl.values()) {
    p.ctr = p.impressions > 0 ? p.clicks / p.impressions : 0;
  }

  return { byUrl, provenance, rowsRead, files: files.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer 3a — rendered-page intelligence (dist/**/*.html)
// ─────────────────────────────────────────────────────────────────────────────

const ASSET_EXT = /\.(css|js|mjs|json|xml|txt|png|jpe?g|svg|webp|avif|ico|gif|pdf|woff2?)$/i;

function stripNoise(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”', times: '×', middot: '·',
};

/**
 * Decode rather than strip: replacing `&#39;` with a space would split
 * "Don't" into two words and quietly inflate every word count.
 */
function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body) => {
    if (body[0] === '#') {
      const cp =
        body[1].toLowerCase() === 'x' ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return Number.isFinite(cp) && cp > 0 ? String.fromCodePoint(cp) : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

function textOf(html) {
  return decodeEntities(stripNoise(html).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

const BREADCRUMB_NAV = /<nav[^>]*class="[^"]*\bbreadcrumbs\b[^"]*"[\s\S]*?<\/nav>/gi;
const ANY_NAV = /<nav[\s\S]*?<\/nav>/gi;

// Author byline, disclaimer and sources blocks sit in the content region but are
// components: they emit the same links (editorial policy, about, licensing) on
// every page they appear on. Their links are not editorial decisions, so they
// are removed before the link graph is built — but AFTER the byline/sources
// presence flags are read, since those are real AI-readiness signals.
const COMPONENT_BLOCKS =
  /<(p|div|span|section|aside|footer)[^>]*class="[^"]*(byline|disclaimer|sources)[^"]*"[\s\S]*?<\/\1>/gi;

/**
 * Split a built page into editorial content vs site furniture.
 *
 * BaseLayout renders <header class="main-header">…</header> … <footer class="footer">…</footer>,
 * so everything between the two is the page's own content.
 *
 * Breadcrumbs sit inside that region but appear on every page and always point
 * at the same hubs — counting them would make every hub look well-supported and
 * hide which pages editors actually chose to link. They are dropped from the
 * link graph. The Related block stays: it is generated from pageIndex.ts
 * taxonomy, which is exactly the editorial signal this system measures.
 *
 * `prose` additionally drops every <nav>, so word counts measure writing rather
 * than link furniture.
 */
function splitRegions(html) {
  const headerEnd = html.indexOf('</header>');
  const footerStart = html.lastIndexOf('<footer');
  const content =
    headerEnd === -1 || footerStart === -1 || footerStart <= headerEnd
      ? html
      : html.slice(headerEnd + 9, footerStart);
  const furniture =
    headerEnd === -1 || footerStart === -1 ? '' : html.slice(0, headerEnd) + html.slice(footerStart);
  return {
    raw: content,
    content: content.replace(BREADCRUMB_NAV, ' '),
    prose: content.replace(ANY_NAV, ' '),
    furniture,
  };
}

/**
 * Largest table on the page, as {rows, cols}.
 *
 * A "comparison table" is not just any <table>: a single-column list styled as
 * a table is not what an editor means, and not what an AI answer extracts. Two
 * or more columns and three or more rows is the smallest thing that genuinely
 * compares options.
 */
function tableStats(html) {
  let best = { rows: 0, cols: 0 };
  for (const m of html.matchAll(/<table[\s\S]*?<\/table>/gi)) {
    const t = m[0];
    const rows = (t.match(/<tr[\s>]/gi) ?? []).length;
    let cols = 0;
    for (const r of t.matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
      cols = Math.max(cols, (r[0].match(/<t[hd][\s>]/gi) ?? []).length);
    }
    if (rows * cols > best.rows * best.cols) best = { rows, cols };
  }
  return best;
}

const NON_PAGE_SCHEME = /^(https?:|tel:|mailto:|javascript:|data:|sms:|#)/i;

/**
 * Internal page links in a region, resolved against the page's own URL.
 *
 * The site links RELATIVELY ("medicare-irmaa.html", not "/medicare-irmaa.html"),
 * which is correct for a flat .html site — so relative hrefs must be resolved,
 * not skipped. Same-origin absolute URLs are folded in too.
 */
function extractLinks(region, fromUrl) {
  const out = new Set();
  const base = new URL(fromUrl, 'https://internal.invalid');
  for (const m of region.matchAll(/href\s*=\s*"([^"]+)"/gi)) {
    let raw = m[1].trim();
    if (!raw) continue;
    if (raw.startsWith('//')) continue;
    if (raw.toLowerCase().startsWith(SITE_ORIGIN.toLowerCase())) {
      raw = raw.slice(SITE_ORIGIN.length) || '/';
    } else if (NON_PAGE_SCHEME.test(raw)) {
      continue; // external, non-HTTP scheme, or a same-page anchor
    }
    const path0 = raw.split('?')[0].split('#')[0];
    if (!path0 || ASSET_EXT.test(path0)) continue;
    let resolved;
    try {
      resolved = new URL(path0, base).pathname;
    } catch {
      continue;
    }
    const url = normalizeUrl(resolved);
    if (url) out.add(url);
  }
  return out;
}

function collectSchemaTypes(html) {
  const types = new Set();
  for (const m of html.matchAll(
    /<script[^>]+type\s*=\s*"application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch {
      continue;
    }
    const visit = (node) => {
      if (Array.isArray(node)) return node.forEach(visit);
      if (!node || typeof node !== 'object') return;
      const t = node['@type'];
      if (typeof t === 'string') types.add(t);
      else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
      Object.values(node).forEach(visit);
    };
    visit(data);
  }
  return types;
}

const countOf = (html, re) => (html.match(re) ?? []).length;

function readPage(file, distRoot) {
  const html = readFileSync(file, 'utf8');
  const rel = `/${path.relative(distRoot, file).split(path.sep).join('/')}`;
  const url = normalizeUrl(rel);
  const { raw, content, prose, furniture } = splitRegions(html);
  const schemaTypes = collectSchemaTypes(html);
  const contentClean = stripNoise(content);
  const rawClean = stripNoise(raw);
  const tables = tableStats(contentClean);

  // The FAQ component renders <section aria-label="Frequently Asked Questions">
  // with <details>/<summary> pairs; some pages use the bespoke .cst-faq block.
  // Match on any of them rather than on one component's markup.
  const faqMarkup =
    /aria-label="Frequently Asked Questions"/.test(contentClean) ||
    /class="[^"]*\bcst-faq\b/.test(contentClean) ||
    countOf(contentClean, /<summary[\s>]/gi) >= 2;

  return {
    url,
    file: file.split(path.sep).join('/'),
    locale: localeOf(url),
    baseUrl: baseUrlOf(url),
    bytes: Buffer.byteLength(html),
    // Astro emits a meta-refresh stub for each configured redirect. It is not
    // content and must not be scored as a page.
    redirect: /<meta[^>]+http-equiv\s*=\s*"refresh"/i.test(html),
    noindex: /<meta[^>]+name\s*=\s*"robots"[^>]+content\s*=\s*"[^"]*noindex/i.test(html),
    words: textOf(prose).split(' ').filter(Boolean).length,
    title: decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim(),
    metaDescription: decodeEntities(
      html.match(/<meta[^>]+name\s*=\s*"description"[^>]+content\s*=\s*"([^"]*)"/i)?.[1] ?? '',
    ).trim(),
    canonical: html.match(/<link[^>]+rel\s*=\s*"canonical"[^>]+href\s*=\s*"([^"]*)"/i)?.[1] ?? '',
    schemaTypes: [...schemaTypes],
    hasSummary: /class="summary-block"/.test(content),
    hasFaqMarkup: faqMarkup,
    hasFaqSchema: schemaTypes.has('FAQPage'),
    faqCount: countOf(html, /"@type"\s*:\s*"Question"/g),
    tables: countOf(contentClean, /<table[\s>]/gi),
    definitions:
      countOf(contentClean, /<dl[\s>]/gi) +
      countOf(contentClean, /<dfn[\s>]/gi) +
      countOf(contentClean, /class="gl-term"/g),
    h2: countOf(contentClean, /<h2[\s>]/gi),
    h3: countOf(contentClean, /<h3[\s>]/gi),
    // Substring, not word-boundary: components scope these as `irm-hero__byline`.
    hasByline: /class="[^"]*byline[^"]*"/.test(contentClean),
    hasSources: /class="[^"]*sources[^"]*"/.test(contentClean),
    // Editorial building blocks, detected by their component's class marker.
    // Breadcrumbs are read from the RAW region because the link graph strips
    // them before it counts anything.
    tableRows: tables.rows,
    tableCols: tables.cols,
    hasComparisonTable: tables.cols >= 2 && tables.rows >= 3,
    hasRelated: /class="[^"]*\brelated\b[^"]*"/.test(contentClean),
    hasCta: /class="[^"]*page-cta[^"]*"/.test(contentClean),
    hasNextSteps: /class="[^"]*next-steps[^"]*"/.test(contentClean),
    hasDisclaimer: /class="[^"]*(page-disclaimer|marketing-disclaimer)[^"]*"/.test(rawClean),
    hasBreadcrumbs: /class="[^"]*breadcrumbs[^"]*"/.test(rawClean),
    contentLinks: extractLinks(contentClean.replace(COMPONENT_BLOCKS, ' '), url),
    furnitureLinks: extractLinks(furniture, url),
  };
}

/**
 * Reads the built site and computes the internal link graph.
 *
 * The graph counts EDITORIAL links only: links found in the content region,
 * minus any target that appears in the header/footer of nearly every page.
 * Counting nav links would make every page look well-linked and hide the real
 * orphans.
 */
export function loadSiteIntel() {
  const distRoot = PATHS.dist;
  if (!existsSync(distRoot)) {
    throw new Error(
      `No build found at ${distRoot}/. Run "npm run build" first, or use "npm run seo:build".`,
    );
  }
  const files = walk(distRoot, '.html', new Set(['_astro', 'pagefind', '_worker.js']));
  if (!files.length) throw new Error(`${distRoot}/ contains no HTML — is the build complete?`);

  const pages = files.map((f) => readPage(f, distRoot));
  const known = new Set(pages.map((p) => p.url));

  // Site furniture = a link target present on ≥ boilerplateShare of pages.
  const furnitureHits = new Map();
  for (const p of pages) {
    for (const l of p.furnitureLinks) furnitureHits.set(l, (furnitureHits.get(l) ?? 0) + 1);
  }
  const navLinks = new Set(
    [...furnitureHits.entries()]
      .filter(([, n]) => n / pages.length >= THRESHOLDS.boilerplateShare)
      .map(([url]) => url),
  );

  // Backstop for component links the marker-based strip missed: a target that
  // appears in the CONTENT of nearly every page is emitted by a template, not
  // chosen by an editor. Reported alongside the graph so the exclusion is
  // auditable rather than silent.
  const contentHits = new Map();
  for (const p of pages) {
    for (const l of p.contentLinks) contentHits.set(l, (contentHits.get(l) ?? 0) + 1);
  }
  const ubiquitousLinks = [...contentHits.entries()]
    .filter(([, n]) => n / pages.length >= THRESHOLDS.boilerplateShare)
    .map(([url, n]) => ({ url, pages: n, share: n / pages.length }));
  const ubiquitous = new Set(ubiquitousLinks.map((u) => u.url));

  // Editorial out-links, resolved against pages that actually exist.
  const brokenLinks = [];
  for (const p of pages) {
    p.linksOut = [];
    for (const target of p.contentLinks) {
      if (target === p.url) continue;
      if (!known.has(target)) {
        if (localeOf(target) === p.locale) brokenLinks.push({ from: p.url, to: target });
        continue;
      }
      if (ubiquitous.has(target)) continue;
      // Otherwise no filtering: the header/footer regions are already excluded,
      // so a surviving link to a hub is a real editorial link. Nav membership
      // only informs the navLinked flag below.
      p.linksOut.push(target);
    }
    // Reachable from the global header/footer nav, independent of editorial links.
    p.navLinked = navLinks.has(p.url);
  }

  // Reverse the graph.
  const inbound = new Map(pages.map((p) => [p.url, []]));
  for (const p of pages) for (const t of p.linksOut) inbound.get(t).push(p.url);
  for (const p of pages) {
    p.linksIn = inbound.get(p.url);
    p.inboundCount = p.linksIn.length;
    p.outboundCount = p.linksOut.length;
  }

  // Click depth from the homepage over editorial links only.
  const byUrl = new Map(pages.map((p) => [p.url, p]));
  for (const root of ['/', '/es/index.html', '/es']) {
    const start = byUrl.get(root);
    if (!start) continue;
    const queue = [[root, 0]];
    const seen = new Set([root]);
    while (queue.length) {
      const [url, d] = queue.shift();
      const page = byUrl.get(url);
      if (!page) continue;
      page.depth = Math.min(page.depth ?? Infinity, d);
      for (const t of page.linksOut) {
        if (seen.has(t)) continue;
        seen.add(t);
        queue.push([t, d + 1]);
      }
    }
  }
  for (const p of pages) if (p.depth === undefined) p.depth = null;

  // Titles duplicated across pages are a real cannibalization signal.
  const titleHits = new Map();
  for (const p of pages) {
    if (!p.title) continue;
    titleHits.set(p.title, (titleHits.get(p.title) ?? 0) + 1);
  }

  for (const p of pages) {
    delete p.contentLinks;
    delete p.furnitureLinks;
    p.duplicateTitle = p.title ? titleHits.get(p.title) > 1 : false;
  }

  return { pages, byUrl, navLinks: [...navLinks], ubiquitousLinks, brokenLinks };
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer 3b — freshness from git history
// ─────────────────────────────────────────────────────────────────────────────

/** file path → ISO date of the newest commit that touched it (one git call). */
function lastTouchedMap() {
  let out;
  try {
    out = execFileSync(
      'git',
      ['log', '--no-renames', '--pretty=format:\x01%aI', '--name-only'],
      { encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 },
    );
  } catch {
    return new Map(); // not a git repo, or git unavailable — freshness degrades to null
  }
  const map = new Map();
  let current = null;
  for (const line of out.split('\n')) {
    if (line.startsWith('\x01')) { current = line.slice(1).trim(); continue; }
    const file = line.trim();
    if (!file || !current) continue;
    if (!map.has(file)) map.set(file, current); // git log is newest-first
  }
  return map;
}

/** Route templates with [params], as regexes that match a built URL path. */
function dynamicRoutes(pagesDir) {
  return walk(pagesDir, '.astro')
    .filter((f) => f.includes('['))
    .map((file) => {
      const route = file
        .slice(pagesDir.length + 1)
        .replace(/\.astro$/, '')
        .replace(/\/index$/, '');
      const pattern = route
        .split('/')
        .map((seg) =>
          seg
            .replace(/[.*+?^${}()|\\]/g, '\\$&')
            .replace(/\\?\[\.\.\.[^\]]+\\?\]/g, '.+')
            .replace(/\[[^\]]+\]/g, '[^/]+'),
        )
        .join('/');
      return { file, re: new RegExp(`^/${pattern}$`) };
    });
}

/** src/data modules a route file imports — a generated page is only as fresh as its data. */
function dataDependencies(file, dataDir, cache) {
  if (cache.has(file)) return cache.get(file);
  const deps = [];
  try {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(/from\s+'([^']*\/data\/[^']+)'/g)) {
      const name = m[1].split('/data/')[1].replace(/\.(ts|js)$/, '');
      for (const candidate of [`${dataDir}/${name}.ts`, `${dataDir}/${name}/index.ts`]) {
        if (existsSync(candidate)) deps.push(candidate);
      }
    }
  } catch {
    /* unreadable route file — no deps */
  }
  cache.set(file, deps);
  return deps;
}

/**
 * url → { lastModified, sourceFiles }.
 * Static routes map to their .astro file. Generated routes map to the [param]
 * template PLUS the data modules it reads, so adding a town or drug correctly
 * refreshes every page it generates.
 */
export function loadFreshness(urls) {
  const touched = lastTouchedMap();
  const pagesDir = PATHS.pagesDir;
  const dynamic = dynamicRoutes(pagesDir);
  const depCache = new Map();
  const result = new Map();

  for (const url of urls) {
    const route = url === '/' ? '/index' : url.replace(/\.html$/, '');
    const sources = [];
    const direct = [
      `${pagesDir}${route}.astro`,
      `${pagesDir}${route}/index.astro`,
      `${pagesDir}${route}.md`,
    ].find((f) => existsSync(f));

    if (direct) sources.push(direct);
    else {
      for (const d of dynamic) {
        if (d.re.test(route)) {
          sources.push(d.file, ...dataDependencies(d.file, PATHS.dataDir, depCache));
          break;
        }
      }
    }
    // Spanish pages are produced from the EN route through the [locale] catch-all.
    if (localeOf(url) !== DEFAULT_LOCALE) {
      const enRoute = baseUrlOf(url) === '/' ? '/index' : baseUrlOf(url).replace(/\.html$/, '');
      const enFile = `${pagesDir}${enRoute}.astro`;
      if (existsSync(enFile)) sources.push(enFile);
    }

    const dates = sources.map((f) => touched.get(f)).filter(Boolean);
    result.set(url, {
      lastModified: dates.length ? dates.sort().at(-1) : null,
      sourceFiles: sources,
    });
  }
  return result;
}

export const SOURCE_LABELS = {
  registry: `${PATHS.registry} (canonical page registry)`,
  performance: `${PATHS.searchConsole}/*.csv (Google Search Console export)`,
  rendered: `${PATHS.dist}/**/*.html (production build)`,
  history: 'git log (content freshness)',
  origin: SITE_ORIGIN,
};
