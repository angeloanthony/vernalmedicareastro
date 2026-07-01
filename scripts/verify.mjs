// scripts/verify.mjs — the developer quality gate. One command, every commit.
//   npm run verify
// Runs: astro check (ratcheted) → unit tests → production build.
// Exits non-zero on any failure, on NEW type errors above the baseline, or on a
// failed build. Future steps (lighthouse, link/schema/html/sitemap validation)
// slot in here as they're added.

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const baseline = JSON.parse(
  readFileSync(new URL('./quality-baseline.json', import.meta.url), 'utf8'),
);

function run(label, command) {
  console.log(`\n▶ ${label}`);
  // Single command string + shell (avoids Node DEP0190 from args+shell:true).
  const r = spawnSync(command, { encoding: 'utf8', shell: true });
  process.stdout.write(r.stdout || '');
  process.stderr.write(r.stderr || '');
  return { status: r.status ?? 1, out: (r.stdout || '') + (r.stderr || '') };
}

function fail(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}

// ── 1. unit tests ────────────────────────────────────────────────────────────
// Run first, in a clean process. Vitest intermittently fails to BOOTSTRAP on a
// cold cache (0 tests collected / "Cannot read properties of undefined (reading
// 'config')") — a deterministic init race, not a test failure. Retry once: a
// genuine test failure still fails both attempts, so this hides no real breakage.
let tests = run('unit tests', 'npx vitest run');
if (tests.status !== 0) {
  console.log("↻ vitest didn't bootstrap cleanly — retrying once (cold-cache init race)");
  tests = run('unit tests (retry)', 'npx vitest run');
}
if (tests.status !== 0) fail('unit tests failed.');

// ── 2. astro check (error ratchet — green today, blocks NEW errors) ──────────
const check = run('astro check', 'npx astro check');
const m = check.out.match(/-\s*(\d+)\s+errors?/);
if (!m && check.status !== 0) fail('astro check failed and no error count could be parsed.');
const errors = m ? parseInt(m[1], 10) : 0;
const limit = baseline.astroCheckErrors;
if (errors > limit) {
  fail(`astro check: ${errors} errors > baseline ${limit}. New type errors were introduced — fix them (do not raise the baseline).`);
}
console.log(
  errors < limit
    ? `✔ astro check: ${errors} errors (below baseline ${limit}) — ratchet scripts/quality-baseline.json down to ${errors}.`
    : `✔ astro check: ${errors} errors == baseline ${limit} (legacy debt; no new errors).`,
);

// ── 3. production build ──────────────────────────────────────────────────────
const build = run('build', 'npx astro build');
if (build.status !== 0) fail('production build failed.');
const pages = build.out.match(/(\d+)\s+page\(s\) built/);

console.log(`\n✔ verify passed${pages ? ` — ${pages[1]} pages built` : ''}.`);
