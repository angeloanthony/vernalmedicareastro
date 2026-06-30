# Contributing

Working agreement for the Vernal Medicare 2.0 migration. The overriding goal is
to add capability **without risking existing SEO**.

## Golden rules
1. **Never change a URL** without an explicit, recorded decision (DECISIONS.md).
   The build must keep emitting the same route set (currently **47 pages**).
2. **Don't modify existing ranking pages** unless that page is the task.
3. **Facts live in `src/data/`** (typed by `src/types/`). Pages never hardcode a
   phone number, premium, or drug fact — read from data.
4. **One architectural area per commit.** Keep architecture out of large feature
   diffs.

## Two-step cycle for every major feature
1. **Design** — interfaces, file layout, composition plan. No production code.
2. **Review** — human approval.
3. **Implement** — exactly the approved design.

## Dependency direction (one-way)
`types ← data ← (lib, config) ← components ← pages`. No cycles.

## Where things go
| Need | Put it in |
|---|---|
| A fact (figure, drug, place, review) | `src/data/` |
| A shared interface | `src/types/` |
| A pure helper | `src/lib/<domain>/` |
| A site setting / nav / social | `src/config/` |
| A reusable UI piece | `src/components/<group>/` |
| A new route | `src/pages/` (composes the above) |

## Verification before every commit
Run, in order:
1. `astro check` *(once added — catches `.astro` type issues `tsc` misses)*
2. `npm run build` — confirm the page count and URLs are unchanged
3. (when present) the unit tests for `lib/`

Until `astro check` is wired up, validate `.ts` with `tsc --noEmit` and rely on
`npm run build` for `.astro`.

## Commit messages
Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). Describe
the architectural area and confirm "47 pages, URLs unchanged" when relevant.
