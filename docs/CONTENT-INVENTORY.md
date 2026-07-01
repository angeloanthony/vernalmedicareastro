# Content Inventory

Operational map of the content platform — **which page belongs to which product,
its status, and when it was last reviewed.** Not for SEO; for maintenance. When
the annual Medicare figures change, this tells you exactly what to re-review.

Data-driven clusters (Glossary, Drug-Coverage, Towns, Drug-Assistance, News) are
tracked by their data file, not row-by-row here — each entry is one data record.

Legend: ✅ complete · 🚧 in progress · 📋 planned

| Product / Hub | Page | Status | Last reviewed | Source |
|---|---|---|---|---|
| **Decision Center** | medicare-decision-center (data/decisionPaths.ts) | ✅ | Jul 2026 | Vernal |
| **Help Center** | medicare-help-center | ✅ | Jul 2026 | Vernal |
| **Turning 65 Center** | turning-65 (+ data/turning65.ts) | ✅ | Jul 2026 | Vernal |
| **Working Past 65** | working-past-65 (hub) | ✅ | Jul 2026 | Vernal |
| Working Past 65 | medicare-and-employer-coverage | ✅ | Jul 2026 | Adapted from Alta |
| Working Past 65 | delaying-medicare-part-b | ✅ | Jul 2026 | Adapted from Alta |
| Working Past 65 | cobra-and-medicare | ✅ | Jul 2026 | Adapted from Alta |
| Working Past 65 | medicare-creditable-coverage | ✅ | Jul 2026 | Adapted from Alta |
| **Coverage** | medicare-dental-vision-hearing | ✅ | Jul 2026 | Adapted from Alta |
| **Services-Coverage Center** | medicare-coverage + 11 (data/serviceCoverage.ts) | ✅ | Jul 2026 | Vernal (Alta topics) |
| **Drug-Coverage Center** | medicare-drug-coverage + 14 (data/drugCoverage.ts) | ✅ | Jul 2026 | Vernal (Alta drug list) |
| **Glossary** | medicare-glossary (data/glossary.ts, 43 terms) | ✅ | Jul 2026 | Vernal |
| **News Center** | medicare-news + 6 (data/news.ts) | ✅ | Jul 2026 | Curated (Alta topics) |
| **Calculators** | medicare-calculators + 6 tools | ✅ | Jul 2026 | Vernal |
| **Search** | medicare-search (Pagefind) | ✅ | Jul 2026 | Vernal |
| **E-E-A-T** | about · medicare-agent-credentials · editorial-policy · reviews · terms · privacy | ✅ | Jul 2026 | Vernal |
| **IRMAA cluster** | medicare-irmaa (+ brackets/calc/appeal/LCE/reduce) | ✅ | Jul 2026 | Vernal |
| **Costs** | medicare-costs (+ estimator, oop-max, uintah-county) | ✅ | Jul 2026 | Vernal |
| **Enrollment** | medicare-enrollment-periods (+ SEP/GEP/AEP/missed/checklist/when) | ✅ | Jul 2026 | Vernal |
| **Medigap** | medigap (+ Plan G vs N, HD-G, vs Advantage) | ✅ | Jul 2026 | Vernal |
| **Medicare Advantage** | best-medicare-advantage-vernal (+ $0/HMO-PPO/vs-Medigap) | ✅ | Jul 2026 | Vernal |
| **Part D** | prescription-drug-assistance (+ best/cheapest/tiers, 14 drug pages) | ✅ | Jul 2026 | Vernal |
| **Financial Assistance** | medicare-financial-assistance (hub) · medicare-income-limits-2026 (data-driven) | ✅ | Jul 2026 | Vernal |
| **Dual-Eligible** | dual-eligible (+ Extra Help/MSP/D-SNP/Medicaid) | ✅ | Jul 2026 | Vernal |
| **Local (Basin)** | medicare-plans-vernal-utah (pillar) + 13 town pages (data/towns.ts) | ✅ | Jul 2026 | Vernal |
| **Providers** | medicare-hospitals-uintah-county (+ Ashley/UBH/pharmacies) | ✅ | Jul 2026 | Vernal |
| **Other insurance** | aca · indemnity · life | ✅ | Jul 2026 | Vernal |

## On GSC hold (do NOT touch until Search Console data)
| Page | Note |
|---|---|
| does-medicare-cover-mounjaro-utah | overlapping drug page — hold |
| does-medicare-cover-ozempic-wegovy | overlapping drug page — hold |
| does-medicare-cover-dental-vernal | superseded by medicare-dental-vision-hearing? review vs GSC |
| insulin-cost-medicare-vernal | overlapping — hold |

## Annual-update checklist (each January)
1. Bump `CURRENT_YEAR` + add the new year's object in `data/annualMedicareData.ts` — every figure updates everywhere at once.
2. Re-review the IRMAA brackets, Part D cap, and MSP/Extra-Help limits in that file.
3. Refresh the News Center for the new year; set superseded items `lifecycle: 'historical'`.
4. Update the "Last reviewed" dates above for any page whose content changed.
5. Year-stamped slugs (`medicare-income-limits-2026`, `medicare-out-of-pocket-maximum-2026`, `medicare-irmaa-brackets-2026`, `medicare-open-enrollment-2026`) don't auto-rename — create the new-year page and redirect/relink. The page *bodies* are data-driven and update from `annualMedicareData.ts` automatically; only the URL and internal links need attention.
