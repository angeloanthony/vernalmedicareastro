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

// Tests run with INHERITED stdio (not piped). Piping Vitest's stdout under
// spawnSync appears to trigger the cold-cache bootstrap race ("no tests" /
// reading 'config'); inheriting the terminal avoids it. We only need the exit
// status here, not the captured output.
function runInherit(label, command) {
  console.log(`\n▶ ${label}`);
  const r = spawnSync(command, { stdio: 'inherit', shell: true });
  return { status: r.status ?? 1 };
}

// Synchronous pause. The local (Windows) Vitest bootstrap flake is a transient
// file lock right after fresh writes (AV/FS settling); pausing before a retry
// lets it clear, rather than hammering the same window.
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function fail(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}

// ── 1. unit tests ────────────────────────────────────────────────────────────
// Inherited stdio (see runInherit) is the primary fix for the Vitest bootstrap
// race; the single retry remains as a belt-and-suspenders safety net.
// TODO(workaround): revisit after a future Astro/Vite/Vitest upgrade — if the
// bootstrap race is gone, the inherit+retry can be simplified.
let tests = runInherit('unit tests', 'npm test');
for (let attempt = 1; tests.status !== 0 && attempt <= 3; attempt++) {
  sleepSync(2000);
  console.log(`↻ vitest did not bootstrap cleanly — retry ${attempt}/3 (after 2s)`);
  tests = runInherit(`unit tests (retry ${attempt})`, 'npm test');
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
