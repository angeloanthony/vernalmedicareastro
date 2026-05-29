// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
// NOTE: @astrojs/sitemap is intentionally NOT enabled during migration.
// Your hand-built split sitemaps (sitemap-pages/money/posts/local) live in
// public/ and ship verbatim, so nothing changes for Search Console on launch.
// Switching to Astro's generator is a deliberate Phase 2 decision, not now.

// ---------------------------------------------------------------------------
// Vernal Medicare — Astro 6 config
//
// URL POLICY (decided deliberately, per Runbook Part 8):
//   Your existing pages live at /page.html and you chose to KEEP THAT FORM.
//   So we do NOT use Astro's default trailing-slash folder output.
//
//   We achieve .html preservation by simply NAMING the route files with the
//   page slug (e.g. src/pages/faq.astro -> /faq, then we keep the .html via
//   the build: { format: 'file' } setting below, which emits faq.html instead
//   of faq/index.html). Combined with the page filenames matching your old
//   slugs, every old URL keeps working with ZERO redirects.
//
//   If you ever decide to move to clean /page/ URLs later, that is a separate,
//   deliberate decision: switch trailingSlash to 'always', remove
//   build.format, and add a 301 for every page. Not now.
// ---------------------------------------------------------------------------

export default defineConfig({
  site: 'https://vernalmedicare.com',

  // 'file' => emit  about.html  (NOT about/index.html). This is what keeps
  // your existing /about.html style URLs intact.
  build: {
    format: 'file',
  },

  // With format:'file' URLs have no trailing slash; 'never' keeps canonicals
  // self-consistent so we never fight ourselves on // vs /.
  trailingSlash: 'never',

  integrations: [
    // Empty during migration. Hand-built sitemaps in public/ are authoritative.
  ],

  // In-app 301 redirects. Because we are PRESERVING .html URLs, this should
  // stay mostly empty. Only add entries here if a specific page's URL truly
  // has to change — and pair it with a status checker validation after launch.
  redirects: {
    // Example (commented out — we are NOT changing URLs in this migration):
    // '/old-page.html': '/new-page.html',
  },

  adapter: cloudflare(),
});