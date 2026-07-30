# Search Console exports

Drop Google Search Console **Performance → Pages** CSV exports in this folder.
`npm run seo` reads every `.csv` here and merges them into the priority engine.

## How to export

1. Search Console → **Performance** → set the date range (3 months is a good default).
2. **Pages** tab → **Export** → *Download CSV* (or *Download ZIP* and unzip).
3. Copy `Pages.csv` here. Rename it so you can tell exports apart, e.g.
   `pages-2026-07.csv`. The name has no effect on parsing.

## What is read

The parser finds columns by name, so the export's exact layout does not matter:

| Needs a column named | Accepts |
|---|---|
| URL | `Top pages`, `Page`, `URL`, `Landing Page`, `Address` |
| Clicks | `Clicks`, `URL Clicks` |
| Impressions | `Impressions` |
| Position | `Position`, `Average Position`, `Avg. Position` |

Thousands separators (`"1,483"`), percent signs (`0.81%`) and a UTF-8 BOM are all
handled. CTR is **recomputed** from clicks ÷ impressions rather than trusted from
the file, so rounding in the export cannot skew the CTR-gap factor.

Files without a URL column — `Queries.csv`, `Dates.csv`, `Countries.csv` — are
skipped harmlessly, so you can drop a whole unzipped export in here.

## Multiple exports

All CSVs are merged: clicks and impressions **sum**, position is
**impression-weighted**, CTR is recomputed from the totals. Two windows of the
same URL therefore combine into one honest figure rather than double-counting.

## Commit these files

They are a canonical source, and keeping them in git gives you performance
history you can diff. They contain no personal data — only URLs and aggregates.

## Nothing here yet?

The engine still runs. Impressions, position and CTR normally carry 60 of the
100 priority points; with no export those factors are dropped and the remaining
ones are rescaled to 100, so the queue still ranks — on structure, business value
and freshness. Every opportunity score is capped as *unproven* until real data
arrives. See `docs/SEO-SYSTEM.md`.
