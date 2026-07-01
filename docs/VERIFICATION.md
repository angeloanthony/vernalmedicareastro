# Verification & Quality Gate

One command gates every commit and CI run:

```bash
npm run verify
```

It runs, in order, and fails fast:

1. **`astro check`** — full-project type + template diagnostics (ratcheted, see below).
2. **`vitest run`** — unit tests for `src/lib` (formatters, dates, validation, calculators).
3. **`astro build`** — the real production build; must succeed and report the page count.

Plus, available standalone:

| Command | What |
|---|---|
| `npm run lint` | ESLint over the TypeScript layer (`src/{lib,config,types,data}`, `tests`) |
| `npm run typecheck` | `astro check` only |
| `npm run test` / `test:watch` | unit tests |
| `npm run build` | production build |
| `npm run verify` | the full gate (the one CI runs) |

CI runs `npm run lint` + `npm run verify` on every push/PR ([.github/workflows/ci.yml](../.github/workflows/ci.yml)).

## The astro check ratchet

The legacy migrated pages carry **59 pre-existing type errors** (mostly inline
`<script>` year/DOM code) — none in the new framework code. Rather than edit 59
ranking pages inside a tooling change, the gate uses an **error ratchet**:

- The baseline lives in [`scripts/quality-baseline.json`](../scripts/quality-baseline.json) (`astroCheckErrors: 59`).
- `verify` **fails if the count exceeds the baseline** → no *new* type error can land.
- If the count drops (a legacy page gets fixed), `verify` prints a reminder to
  **lower the baseline** to the new number.
- The baseline only ever ratchets **down**, toward `0`. Target: clean it out in
  Phase 2 (SEO) / Phase 6 (cleanup), one small page-only commit at a time.

## Invariants the gate protects
- The production build **succeeds** and the **page count / URLs don't silently change**.
- **No new type errors** beyond the recorded legacy baseline.
- `src/lib` logic stays correct (unit tests).

## Future steps (slot into `scripts/verify.mjs`)
Lighthouse · broken-link scan · schema validation · HTML validation · sitemap
validation. Add each as a step with its own pass/fail so the gate grows with the
project.
