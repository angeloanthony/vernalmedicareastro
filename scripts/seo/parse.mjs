// scripts/seo/parse.mjs — pure parsing helpers, no filesystem and no TS loader.
//
// Split out from sources.mjs so these can be unit-tested directly: importing
// sources.mjs registers a Node module hook, which is not something a test
// should need to do.

import { DEFAULT_LOCALE } from './config.mjs';

/** Canonical URL path form: leading slash, no origin, no query/hash, `/` for home. */
export function normalizeUrl(raw) {
  if (!raw) return null;
  let u = String(raw).trim();
  if (!u) return null;
  u = u.replace(/^https?:\/\/(www\.)?[^/]+/i, '');
  u = u.split('#')[0].split('?')[0];
  try {
    u = decodeURIComponent(u);
  } catch {
    /* leave as-is if it is not valid percent-encoding */
  }
  if (!u.startsWith('/')) u = `/${u}`;
  if (u === '/index.html' || u === '') return '/';
  if (u.length > 1 && u.endsWith('/')) u = u.slice(0, -1) || '/';
  // Cloudflare Pages serves aca.html at both /aca.html and /aca, and Google
  // indexes both forms. Fold the extensionless variant into the .html key the
  // registry and dist use, so one page's search data is not split in two.
  if (u !== '/' && !/\.[a-z0-9]+$/i.test(u)) u += '.html';
  return u;
}

/**
 * Locale of a URL: '/es/x.html' → 'es', everything else → the default locale.
 *
 * `build.format: 'file'` emits the Spanish homepage as `/es.html`, not
 * `/es/index.html`, so the extension is stripped before comparing — otherwise
 * the ES home is silently counted as an English page.
 */
export function localeOf(url) {
  const seg = (url.split('/')[1] ?? '').replace(/\.html$/, '');
  return seg === 'es' ? 'es' : DEFAULT_LOCALE;
}

/** Locale-stripped URL, so an ES page can be tied back to its EN original. */
export function baseUrlOf(url) {
  if (url === '/es.html' || url === '/es') return '/';
  return url.startsWith('/es/') ? url.slice(3) : url;
}

/** RFC4180-ish CSV → array of row objects keyed by header. Handles BOM and quoted commas. */
export function parseCsv(text) {
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];

  const header = rows[0].map((h) => h.trim());
  return rows.slice(1)
    .filter((r) => r.some((c) => c.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/** Search Console writes "1,483" and "0.81%" — both must land as plain numbers. */
export function toNumber(raw) {
  if (raw === undefined || raw === null || raw === '') return null;
  const s = String(raw).replace(/[\s,%]/g, '').replace(/[^0-9.\-]/g, '');
  if (s === '' || s === '-') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Locate a column by exact name, then by prefix ("Impressions (Last 3 months)"). */
export function findColumn(header, candidates) {
  const lower = header.map((h) => h.toLowerCase());
  for (const c of candidates) {
    const i = lower.indexOf(c);
    if (i >= 0) return header[i];
  }
  for (const c of candidates) {
    const i = lower.findIndex((h) => h.startsWith(c));
    if (i >= 0) return header[i];
  }
  return null;
}
