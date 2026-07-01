# Vernal Medicare — Authority Architecture (Phase II blueprint)

**Status:** M24 · design only, no code. The blueprint that governs every content
and migration decision from here forward.

```
PHASE I  — Framework Migration ....... M1–M23  ✅ COMPLETE
PHASE II — Authority Platform ........ M24 → (this document opens it)
```

Phase I built the *engine*: one `PageContext` → schema, breadcrumbs, related,
byline, data-sourced figures, disclosures, taxonomy. 85 pages, 60 on the
framework, 11 silos, 10 pillars, CI green, astro-check ratcheted 59→47. That is
infrastructure — a means, not the goal.

Phase II builds *authority*: organizing what exists into one coherent structure,
filling the gaps that matter, and only then evaluating outside content (Alta)
against this blueprint. **We design Vernal first; Alta is measured against this,
never merged wholesale.** (Ref: ADR-0007 migration strategy — "Vernal is the
vehicle, Alta is the engine.")

---

## 1. Site Authority Map

The target hierarchy. Bold = exists today; _italic_ = gap to build.

```
Home (/)
│
├─ **Medicare Help Center** ............ _NEW top-level hub — the spine (gap)_
│   │
│   ├─ **Medicare Basics (101)** ....... thin today: Part A vs B, home-health, out-of-state
│   │     └─ _Turning 65 hub (gap — huge intent)_
│   ├─ **Enrollment** ................. pillar: enrollment-periods · IEP/SEP/GEP/AEP · penalty & timeline calcs
│   ├─ **Costs & IRMAA** .............. pillar: costs · estimator · IRMAA hub/brackets/calc/appeal/LCE/reduce
│   ├─ **Medigap** .................... pillar: medigap · Plan G vs N · HD Plan G · vs Advantage
│   ├─ **Medicare Advantage** ......... pillar: best-MA · $0-premium · HMO vs PPO · vs Medigap
│   ├─ **Part D & Drugs** ............. pillar: drug-assistance · best/cheapest plans · tiers · 14 drug pages
│   │     └─ _"Does Medicare cover X" coverage cluster (GSC hold)_
│   ├─ **Dual-Eligible / Low-Income** . pillar: dual-eligible · Extra Help · MSP · D-SNP · Medicare+Medicaid
│   └─ **Tools** ...................... 4 calculators (IRMAA, Cost, Penalty, Timeline)
│           └─ _plan-finder / formulary lookup / quiz (gaps)_
│
├─ **Local (Uintah Basin)** ........... pillar: Vernal plans · agent/help/office/quote · Roosevelt · Duchesne · 4 towns
│   └─ **Providers** .................. pillar: county hospitals · Ashley Regional · UB Healthcare · pharmacies
│           └─ _per-town provider depth · statewide counties (future)_
│
├─ **Trust / E-E-A-T** ................ about (pillar) · faq · reviews
│     └─ _credentials · licensing · certifications · editorial policy · review process (gaps)_
│
├─ **Other Insurance** ................ ACA · fixed indemnity · life  (non-Medicare lines)
│
├─ _News / Timely Center_ ............. bespoke & thin (gap: framework-driven news)
├─ _Glossary / Reference_ ............. none (gap)
│
└─ Utility ............................ homepage · privacy · (bespoke by design)
```

**The one structural gap that matters most: there is no master hub.** Every silo
has a pillar, but nothing sits above them. A **Medicare Help Center** page that
branches to all nine topic pillars would give Google a clean topical spine and
users a single front door. This is the single highest-leverage new page on the
site.

---

## 2. Local Authority Map

Local is the moat — the thing national Medicare sites cannot copy. Depth beats
breadth here.

```
Utah
└─ Uintah Basin ...................... served, real E-E-A-T
   ├─ Uintah County
   │   ├─ **Vernal** ................. deep: plans · agent · help · office · quote · comparison
   │   ├─ **Naples / Maeser / Jensen** town pages (data-driven, TownData.ts)
   │   └─ **Ballard**
   ├─ Duchesne County
   │   ├─ **Roosevelt** .............. flagship town page
   │   ├─ **Duchesne** ............... town page
   │   └─ _Myton · Tabiona · Altamont · Neola · Fort Duchesne · Ouray (gaps — cheap via TownData)_
   └─ Providers ..................... **Ashley Regional · Uintah Basin Healthcare · Vernal pharmacies**
       └─ _per-town hospital/pharmacy/clinic depth (gap)_

Statewide (Salt Lake / Davis / Weber / Utah / Washington counties)
   └─ HOLD — local-first is a locked decision (ADR/positioning). Do NOT expand
      statewide until (a) the Uintah Basin cluster is deep and (b) E-E-A-T
      supports a statewide service claim. Alta's county pages are a FUTURE input,
      not a now.
```

**Local priorities, in order:** (1) deepen Vernal into a true local cluster —
link Vernal ↔ hospitals ↔ pharmacies ↔ enrollment ↔ reviews ↔ quote; (2) add the
remaining Basin towns via `TownData.ts` (near-free); (3) per-town provider depth;
(4) *only later* statewide.

---

## 3. Topic Authority Scores

Honest current-state scores (0–100) against a "complete, best-in-market cluster"
goal of 100. Drives priority: biggest (goal − current) gaps on high-value topics
win.

| Cluster | Current | Goal | Gap | Priority | Why |
|---|---:|---:|---:|---|---|
| Costs & IRMAA | 90 | 100 | 10 | maintain | hub, brackets, calc, appeal, LCE, reduce, estimator — near-complete |
| Part D & Drugs | 85 | 100 | 15 | medium | strong + 14 drug pages; coverage cluster on GSC hold |
| Enrollment | 80 | 100 | 20 | medium | strong; **missing a Turning-65 hub** |
| Dual-Eligible | 80 | 100 | 20 | low | complete small cluster |
| Local (Basin) | 75 | 100 | 25 | **high** | the moat; needs cluster interlinking + more towns/providers |
| Tools / Calculators | 70 | 100 | 30 | medium | 4 calcs; plan-finder/formulary/quiz would extend |
| Medigap | 65 | 100 | 35 | medium | 4 pages; can deepen (plan types, pricing, underwriting) |
| Medicare Advantage | 65 | 100 | 35 | medium | 4 pages; SNP/networks/extras depth |
| Providers | 60 | 100 | 40 | high | Uintah only; pairs with Local |
| Medicare Basics (101) | 35 | 100 | 65 | **high** | thin — **no basics hub, no Turning-65** |
| Trust / E-E-A-T | 40 | 100 | 60 | **highest** | about+faq+reviews only — see §4 |
| News / Timely | 20 | 100 | 80 | low-med | bespoke/thin; framework news center is a gap |
| Glossary / Reference | 0 | 100 | 100 | medium | none; a glossary is a cheap authority + internal-link multiplier |

**Reading it:** the highest ROI is *not* another commercial page — it's **E-E-A-T
(§4)**, the **Medicare Basics + Help Center hub**, and **deepening Local**. Those
three lift the whole domain, not one page.

---

## 4. E-E-A-T Blueprint  ← the biggest single opportunity

Medicare is YMYL (Your-Money-Your-Life); Google weights Experience, Expertise,
Authoritativeness, Trust heavily. Today we have `about` + a byline that emits a
`Person` for Rocco. That's a start, not a system. Build these, and wire them
site-wide.

**Pages to create (a `trust` silo build-out):**

| Page | Purpose | Signal |
|---|---|---|
| `medicare-agent-credentials` / enhance `about` | License #, NPN, states licensed, years active | Expertise + Authoritativeness |
| `certifications` | Annual AHIP + carrier certifications, renewal cadence | Expertise (current, not stale) |
| `editorial-policy` | How pages are written, sourced (CMS/Medicare.gov/SSA), reviewed | Trust |
| `how-we-review` / review process | Fact-check + annual-figures update process (ties to `annualMedicareData`) | Trust |
| `local-experience` / community | Years in the Basin, Smith's Pharmacy presence, local involvement | Experience (the hardest to fake) |

**Wire site-wide (mostly framework work, cheap):**
- Enhance the author byline to link Rocco → credentials page (author box).
- Add `reviewedBy` + "Last reviewed" dates on YMYL pages (the framework already
  supports `reviewedBy` and `lastUpdated`).
- Strengthen `Person`/`Organization` schema with `sameAs`, credentials,
  license info (schema engine already emits `sameAs`/`knowsAbout` — populate the
  `AUTHORS` data).
- Surface the 4.9★ AggregateRating (reviews) in more places.

This is the recommendation Claude's own analysis under-weighted and the reviewer
correctly flagged as the #1 gap.

---

## 5. Internal Linking Blueprint

Stop ad-hoc links; design the graph. Three tiers + conversion rails.

```
TIER 0  Master hub ............ Medicare Help Center → links all 9 topic pillars
TIER 1  Silo pillars .......... one per silo (10 exist) ↕ each other via the hub
TIER 2  Spokes ................ articles link UP to their pillar + laterally to siblings (pageIndex/related handles same-silo)
TIER 3  Conversion rails ...... quote · free-comparison · contact — linked from EVERY pillar and every high-intent spoke
```

**Cross-silo link paths to design deliberately** (the related engine only does
*same-silo*; these are the money paths that must be hand-linked in pillars):

```
Drug coverage → Part D plans → Drug assistance → IRMAA (high-income drug costs) → Quote
Enrollment → Turning 65 → Costs → Medigap vs Advantage → Quote
IRMAA → Costs → Dual-Eligible/Extra Help (low-income) → Savings Programs
Local (town) → Providers (hospital/pharmacy) → Plans → Quote
```

**Rule:** every pillar links its conversion rail; every spoke links its pillar;
no orphans. Audit with `pageIndex` coverage + a link-graph check.

---

## 6. Alta Gap Analysis (first pass)

Do **not** bulk-import. For each Alta asset, one question: *does it fill a gap in
the Vernal blueprint above, for OUR geography and brand?* Import only yes,
rebranded (strip Alta NAP/brand/analytics/Wasatch geography, author → Rocco).

| Alta asset (from ZIP audit) | Fills gap? | Verdict | Priority |
|---|---|---|---|
| **Glossary** (100+ terms) | Reference (§3, score 0) | **Import** — brand-neutral, big internal-link multiplier | High |
| **Drug Assistance cluster** (Repatha, Rinvoq, Skyrizi…) | Extends Part D (data-driven) | **Import as data** — add drugs to `drugs.ts`, pages auto-generate | Medium |
| **Formulary lookup tool** | Tools gap | **Evaluate** — verify data currency + maintenance cost | Medium |
| **News Center** | Timely gap (§3, score 20) | **Import framework**, seed Vernal-relevant, author=Rocco | Medium |
| **Quiz / plan-finder** | Engagement/Tools | **Evaluate** — nice-to-have, not authority-critical | Low |
| **Topical FAQ centers** | FAQ organization | **Partial** — per-page `page.faqs` already covers; a hub could group | Low |
| **County pages** (SLC/Davis/Weber/Utah/Washington) | Statewide | **HOLD** — violates local-first until Basin is deep + E-E-A-T ready | Future |
| **"Does Medicare cover X"** (Mounjaro/Ozempic/etc.) | Coverage cluster | **GSC hold** (locked decision) — pull Search Console first | Hold |
| Alta brand / NAP / Bret / Alta analytics / Orem geography | — | **Never** | — |

---

## Recommended Phase II roadmap

Design-first, exactly as the reviewer framed it — no mechanical imports.

```
M24  Authority Architecture ........... THIS DOC ✅
M25  Medicare Help Center hub .......... build the master TIER-0 hub + wire pillars (small, highest-leverage)
M26  E-E-A-T build-out ................. credentials/editorial/review pages + site-wide author box & reviewedBy
M27  Local deepening ................... Vernal cluster interlink + remaining Basin towns (TownData) + per-town providers
M28  Migration Master Plan ............. URL inventory of Alta: keep/merge/rewrite/redirect/archive/create (no code)
M29  Alta gap-fill #1 ................. Glossary (import, rebrand) + drug-assistance data adds
M30+ Turning-65 hub · News center · coverage cluster (post-GSC) · statewide (only when ready)
```

**Rationale:** the engineering foundation is strong enough that ROI has shifted
from *building pages* to *designing the authority those pages support*. M25–M27
(hub, E-E-A-T, local depth) lift the whole domain and cost little; Alta work
(M28+) is then strategic — measured against this blueprint — not a bulk port.
