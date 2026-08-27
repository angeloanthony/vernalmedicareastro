# Work Log

Every content change is logged here **before** the edit is made, per the two
project rules in `docs/ROADMAP.md`:

1. **Name the metric** — the expected outcome must be one of the tracked
   metrics (CTR, average position, topical completeness, internal linking,
   AI extractability, conversions).
2. **The Optimization Hypothesis** — exactly one sentence:
   *We expect this change to improve X because Y.*

After Google's recrawl, come back and fill in the **Outcome** from the Delta
report. An unfilled Outcome is an open experiment, not a finished task.

Experiments carry a stable `EXP-NNN` identifier assigned in
`docs/seo/EXPERIMENTS.md` (the Experiment Registry — canonical index and
lifecycle definition). New experiments get their ID there when the baseline
is written; entries below reference it as **Registry:** EXP-NNN.

## Entry format

```markdown
### YYYY-MM-DD — <page or pattern>

- **Pages:** /path/, /other-path/ (or "Part D cluster — all ~40 pages")
- **Metric:** <one of the six tracked metrics>
- **Hypothesis:** We expect this change to improve X because Y.
- **Outcome (after recrawl):** supported / not supported / mixed — evidence
  from DELTA.md
```

Newest entries at the top.

## Pattern Ledger

Per the Scientific Rule in `docs/ROADMAP.md`: **Experimental** (being tried,
no evidence) → **Proven** (supported outcomes on multiple pages across
optimization cycles) → **Standard** (documented in `EDITORIAL-STANDARD.md`,
enforced by the gate). Update a pattern's status only when the evidence
column can cite specific Outcome entries below.

### Attribution rule (canonical; adopted 2026-07-30)

> **Experimental evidence is credited only to editorial patterns that the
> experiment intentionally manipulated.** Every other pattern present on the
> page is environment, not evidence, and its ledger row is untouched by the
> outcome.

This is the ledger's single attribution authority. Where any other governance
document appears to say otherwise, this rule governs and that document is in
error.

What follows from it:

- **"Manipulated" means changed by the experiment's own scope statement** —
  the pattern was added, removed, or materially rewritten as part of the
  pre-registered change. A pattern that merely already existed on the page is
  never credited, however well the page performed.
- **Bundled experiments credit every pattern in the bundle, and only those.**
  A seven-pattern bundle gives each of those seven one *bundled* data point.
  It gives nothing to patterns the bundle did not touch.
- **The manipulated set is fixed at baseline time**, in the experiment's
  Patterns-under-evaluation field (`docs/seo/EXPERIMENTS.md`). It cannot be
  widened after the data is read — that would be retroactive attribution, the
  same failure mode the CTR-promotion rule exists to prevent.
- **Not every manipulated pattern is a ledger row.** Changes like contextual
  depth, FAQ expansion, or a title/meta rewrite are manipulated and judged as
  part of the experiment, but have no ledger row and so accrue no ledger
  evidence.
- **Confounded outcomes** are recorded as "supported with confound noted" and
  do **not** satisfy the isolated-evidence requirement (graduation criterion
  #2).

This makes the ledger an *experiment* ledger rather than a page-feature
ledger: a row moves only when an experiment set out to move it.

### Status

| Pattern | Status | Evidence |
|---|---|---|
| Standard definition pattern | Experimental | — |
| Standard comparison table | Experimental | — |
| Standard AI summary | Experimental | — |
| Standard source section | Experimental | — |
| Standard internal-link pattern | Experimental | — |
| Standard CTA pattern | Experimental | — |

### Manipulated-pattern map for the experiments in flight

Fixed at baseline time; this is the complete set of rows each experiment may
credit at Delta Review. Nothing here is an outcome — the Evidence column above
stays `—` until a verdict is written.

| Pattern | EXP-001 (bundled) | EXP-002 (isolated) | EXP-003 (isolated, replicated) |
|---|---|---|---|
| Standard definition pattern | manipulated | — | — |
| Standard comparison table | manipulated | — | manipulated |
| Standard AI summary | **present, not manipulated** | manipulated | — |
| Standard source section | manipulated | — | — |
| Standard internal-link pattern | manipulated | — | — |
| Standard CTA pattern | **present, not manipulated** | — | — |

EXP-001 also manipulated contextual depth, FAQ expansion, and a title/meta
rewrite — judged as part of the bundle, but not ledger rows.

The two **present, not manipulated** cells are the reason this rule exists.
`/medigap` already carried a `<SummaryBlock>` and a CTA before EXP-001
(baseline §3, "Present"); the hypothesis concerned neither. Crediting them from a
supported EXP-001 would manufacture evidence for patterns no experiment has
yet tested — and would let the AI-summary pattern reach 2 data points on the
strength of one real test.

---

<!-- Entries begin below. The performance-mode queue-validation gate described
     in ROADMAP.md ("The gate before Sprint 2A begins") ran on 2026-07-30 —
     see docs/PERFORMANCE-VALIDATION-2026-07-30.md. Sprint 2B content
     experiments (EXP-001 – EXP-003) are logged below and registered in
     docs/seo/EXPERIMENTS.md. -->

### 2026-08-26 — Prescription Assistance Batch 8: the 22 remaining confirmed medications, built LINK-DARK (new content, not an experiment)

- **Pages:** 22 NEW pages — `/anoro-assistance-program.html`, `/breo-…`, `/daliresp-…`, `/incruse-…`,
  `/nucala-…`, `/stiolto-…`, `/tezspire-…`, `/xolair-…`, `/yupelri-…`, `/invokana-…`, `/lantus-…`,
  `/lyumjev-…`, `/novolog-…`, `/toujeo-…`, `/tresiba-…`, `/victoza-…`, `/inpefa-…`, `/nexlizet-…`,
  `/pradaxa-…`, `/ranexa-…`, `/savaysa-…`, `/vascepa-assistance-program.html`. Registry 28 → **50**.
- **Change:** built every medication remaining on the §15.2 confirmed list in one expansion, rather
  than as another five-drug selection. Each page is an independently researched
  `MedicationAssistanceRecord` with dated primary sources. Four label-backed drug-class keys added
  (`lama-laba`, `pde4-inhibitor`, `antianginal`, `omega-3`); **no new condition keys**. One legacy
  tagline corrected (`lillycares`) under the Sanofi/AbbVie precedent — prose only, `drugs[]` intact.
- **Metric:** topical completeness (the primary metric for this project), plus internal linking within
  the prescription-assistance silo and AI extractability of program eligibility rules.
- **Optimization Hypothesis:** *We expect completing the confirmed medication list to improve topical
  completeness for the prescription-assistance silo, because the cluster now answers the assistance
  question for every medication the project has named rather than for a demand-ranked subset.*
- **Not an experiment.** This is new content, not a change to an existing page, so it has no EXP-NNN
  and no before/after comparison on any page under observation. It is logged for the record and for the
  topical-completeness metric only.
- **Built LINK-DARK — and proved so.** EXP-003's observation window is open until ~2026-09-03. No link
  was added into the frozen `does-medicare-cover-*` cohort. The proof is a byte-diff, not an assertion:
  the pre-expansion source tree was restored and rebuilt to its 180-page baseline, the 17 cohort pages
  were captured, the expansion was restored and rebuilt to 202 pages, and **all 17 cohort files are
  byte-identical between the two builds**. Every occurrence of `does-medicare-cover` across the 22 new
  record files is the LINK-DARK comment banner; all 22 built pages emit zero cohort hrefs.
  `drugCoverage.ts`, `does-medicare-cover-[drug].astro` and `DRUG_COVERAGE` were untouched.
- **Gates:** `npm test` 710/710 pass · `npm run lint` clean · `npm run typecheck` 0 errors, 0 warnings ·
  `npm run build` 202 pages · `npm run verify` passed · `npm run seo:gate` passed (153 pages, site mean
  76%). Two failures were found and fixed properly rather than accepted: seven records tripped the CMS
  superlative guard on the idiomatic phrase "on top of" (rephrased — the guard was not weakened), and the
  `record-precedence` fixture went stale exactly as its own comment anticipated (Victoza, Lantus and
  Pradaxa are now researched, so Levemir, Stelara and Otezla replace them).
- **Reconciliation:** 50 record files = 50 registry entries = 50 `FEATURED_DRUGS` rows = 50 sitemap
  entries = 50 hub/`PAGE_INDEX` entries = 50 built pages. Zero duplicates, zero orphans, zero invalid or
  duplicated taxonomy keys, zero fallback categories, zero legacy `categories` fields. 301 programs
  carrying 850 dated source citations; every `lastVerified` and every source `checked` date literal and
  non-future.
- **Outcome:** *(open — new content; revisit with the September delta report. Note that the Sprint 2B
  freeze governs interpretation: this is construction, and the observation window is still running.)*
- **What this does NOT complete.** 50 pages, not 75. Every medication the repository has ever named now
  has a page; the other 25 of the 75 have never been named in any revision of
  `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md`. There is no Batch 9 pending — the next expansion is blocked
  on those 25 names being supplied, not on a selection decision.

### 2026-08-26 — D10: insulin architecture decided (project decision, not a content change)

- **Pages:** none. Documentation only — `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md`
  §31 #4 and §32. No record, no `FEATURED_DRUGS` row, no taxonomy change, no
  build output affected.
- **Decision (Rocco):** one record per insulin brand under the existing
  `MedicationAssistanceRecord`; **no** generic "insulin assistance" record and no
  special record type, so D9 is untouched. Critically, **§31 #4 is no longer a
  prerequisite for medication selection** — Lantus, Lyumjev, NovoLog, Toujeo and
  Tresiba become ordinary Track A candidates.
- **Reasoning:** the $35 Part D insulin cap is a strong, uniform statutory rule
  that the existing `/insulin-cost-medicare-vernal.html` page already carries, so
  the open question was never really "does insulin have an assistance story" but
  "do five brand pages add value beyond that page". That is a **research**
  question, and it was being treated as an architecture blocker. A resolved
  statutory affordability rule should not become an artificial project blocker.
- **Applied constraints, recorded so they are not re-derived:** brand records
  cover the manufacturer layer (PAP, copay, Medicare exclusions, Extra Help,
  TotalAssist, HealthWell) rather than re-explaining the cap five times; brand
  pages may link to the insulin-cost page (it is not a `does-medicare-cover-*`
  page, so D8 does not restrict it); and **NovoLog's negotiated price is
  product-specific** — insulin aspart carries an MFP of $119.00 per 30-day
  equivalent supply from 2026-01-01 and $122.22 from 2027-01-01, while Lantus,
  Toujeo, Tresiba and Lyumjev are not selected at all.
- **Correction made in the same pass:** the §32 reconciliation wrongly placed
  Vyndamax outside the §15.2 confirmed list. It is on that list, as are Januvia
  and Brilinta — so the figures are **24 of the 46 have pages, 22 outstanding**,
  and the four off-list records are Humira, Enbrel, Skyrizi and Rinvoq. The
  eligible candidate pool is now the full 22 rather than 17.
- **Metric:** none — a decision record, not a manipulation.
- **Not done:** insulin is **not** the next batch. D10 removes a blocker; it does
  not make a selection. The next batch is still chosen on information value,
  category coverage and research opportunity.
- **Outcome (after recrawl):** not applicable — no content changed.

### 2026-08-26 — Prescription Assistance Batch 7: Vyndamax, Januvia, Brilinta — the first batch chosen by decision, LINK-DARK (new content, not an experiment)

- **Pages:** `/vyndamax-assistance-program.html` · `/januvia-assistance-program.html` ·
  `/brilinta-assistance-program.html` — three NEW slugs, each an independently
  researched record registered through `FEATURED_DRUGS` → registry → sitemap.
  Sitewide: the hub directory grew 25 → 28. Nav, coverage cohort and the existing
  25 medication pages untouched (byte-identical HTML before/after).
- **Driver:** Batch 6 exhausted the §24 Phase 4 order, so this is the first batch
  selected by a documented decision rather than from a queue. Criteria, set by
  the user: information value, category coverage and research opportunity —
  explicitly **not** demand, since the only Search Console export predates every
  assistance page. Insulins were excluded from Batch 7 because §31 #4 was open at
  the time; it was resolved as D10 immediately afterwards — see the entry above.
- **Metric:** topical completeness (tracked). `npm run seo:gate` passed — 153
  pages, site mean 76%, no `--accept`. Tests 435 → **468**, lint clean,
  `astro check` 0 errors / 0 warnings, build 177 → 180 pages, `verify` passed.
- **Hypothesis:** none pre-registered — content addition under a selection decision.

- **✅ Observation-window discipline (EXP-003): LINK-DARK, machine-checked.**
  `tests/observation-window.test.ts` passes (cohort 14, treated 12, control 2,
  both controls present and unlinked, no new inbound links). Every
  `does-medicare-cover-*.html` in `dist/` was byte-compared against a pre-batch
  build — **all 17 identical**, including both controls. The three new records
  contain zero `does-medicare-cover-*` strings in source and in rendered HTML.
  `drugCoverage.ts` and the coverage route untouched.

- **Selection process — worth recording because it changed the batch twice.**
  Five were proposed; research dropped one and deferred another before anything
  was authored. **Breo Ellipta was dropped** despite being the *only* candidate
  with demand evidence: GSK's PAP still publishes no covered-medicine list (so it
  would have been `verify`, exactly as Trelegy is), the same COPD and asthma
  funds were closed, and `www.breo.com` is not GSK's — it serves a Chinese
  massage-device company. **Xolair was deferred**: four indications spanning
  asthma, nasal polyps, food allergy and chronic spontaneous urticaria, with
  TotalAssist and HealthWell running separate CSU funds, deserve their own
  taxonomy pass rather than a rushed one.

- **Taxonomy (D9 — vocabulary, not architecture):** two class keys added, each
  confirmed against its own label — `dpp-4` (Januvia) and
  `transthyretin-stabilizer` (Vyndamax). **No condition key added, deliberately:**
  the Ofev test was applied to Vyndamax and came out the other way. Ofev needed
  `lung-disease` because `respiratory` was flatly wrong; Vyndamax's label
  indication *is* a cardiomyopathy, so `heart` is true rather than adjacent, and
  the amyloidosis funds live in the record's own program cards. Brilinta is the
  first record to use `antiplatelet` — an existing key no record had ever
  carried — which finally makes the "Blood Thinners" view hold both kinds of
  blood thinner; it deliberately does not carry `blood-clots`, which means
  AFib/DVT/PE on this site.

- **Research findings worth carrying forward** (each checked, not inherited):
  - **Vyndamax's funds are a prerequisite, not an alternative.** Pfizer states
    patients "are required to apply for and provide proof of denial prior to
    being considered for enrollment in the Pfizer Patient Assistance Program",
    which serves people "uninsured or with government-issued insurance". Both
    amyloidosis funds were **OPEN** — TotalAssist $2,500/$5,500 and HealthWell
    **$8,000**, the largest award in the registry. First record with two open funds.
  - **Merck's PAP names Medicare as disqualifying coverage** — the opposite of
    AZ&Me's and Pfizer's rules — with a documented financial-and-medical-hardship
    exception as the route through. Income $63,840 / $86,560 / $132,000.
  - **Januvia's negotiated price is already in effect:** MFP **$113.00** per
    30-day equivalent supply from 2026-01-01, **$116.06** from 2027-01-01;
    Janumet/Janumet XR $80.00 from 2027.
  - **Brilinta has no manufacturer route on Medicare** — absent from the AZ&Me
    list and from AstraZeneca Direct, while brilinta.com still names AZ&Me in its
    trademark footer. HealthWell runs **no** CAD, ACS or stroke fund at all.
    Generic ticagrelor: **35 labelled products**.

- **Uncertain claims left for human review:** the Januvia savings card
  (januvia.com now serves the prescribing-information PDF; no Merck-owned savings
  page found; third-party directories report a $5 card, not published here) and
  the Brilinta savings card (client-rendered, "Last Updated 5/24"). The Pfizer
  PAP's income thresholds are unstated on the VYNDAMAX pages and were recorded as
  unstated rather than borrowed.

- **Legacy PROGRAMS:** one prose correction under the Sanofi/AbbVie precedent —
  the `azme` tagline also named **Brilinta**, disproved by this batch the same
  way Symbicort was in Batch 6. Replaced with Airsupra; `drugs[]` untouched. The
  Farxiga claim in the same tagline stands and remains Track C item C3. No other
  legacy entry was touched.

- **Checkpoint (2026-08-26):** Batch 7 CLOSED and verified — 28 records, 28
  `FEATURED_DRUGS` rows, 28 sitemap entries, 28 built pages, 28 hub directory
  entries, no orphans or duplicates, 468/468 tests passing, EXP-003 cohort
  byte-identical and both controls unlinked. **No Batch 8 started and no
  medications selected.** Xolair is the named follow-up; insulins were unblocked
  by D10 the same day; Track B still gated on ~2026-09-03; Track C still deferred.

- **Outcome (after recrawl):** not applicable — no experimental manipulation.

### 2026-08-26 — Prescription Assistance Batch 6: the closing four (Nexletol, Symbicort, Spiriva, Ofev), built LINK-DARK (new content, not an experiment)

- **Pages:** `/nexletol-assistance-program.html` · `/symbicort-assistance-program.html` ·
  `/spiriva-assistance-program.html` · `/ofev-assistance-program.html` — four NEW
  slugs, each an independently researched record registered through
  `FEATURED_DRUGS` → registry → sitemap; hub directory and `PAGE_INDEX` picked
  them up automatically. Sitewide: the hub directory grew 21 → 25 and gained a
  "Pulmonary fibrosis / interstitial lung disease" group. Nav, coverage cohort
  and the existing 21 medication pages untouched (byte-identical HTML
  before/after).
- **Driver:** `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md` §24 Phase 4 order —
  Batch 5 shipped Rybelsus/Wegovy/Zepbound/Praluent/Leqvio, leaving exactly
  these four. This closes the documented Phase 4 order. Requested directly,
  under D9.
- **Metric:** topical completeness (tracked). `npm run seo:gate` passed —
  153 pages, site mean 76%, no `--accept`. Tests 435/435, lint clean,
  `astro check` 0 errors / 0 warnings, build 173 → 177 pages, `npm run verify`
  passed.
- **Hypothesis:** none pre-registered — content addition under the project spec.

- **✅ Observation-window discipline (EXP-003): LINK-DARK, machine-checked.**
  `tests/observation-window.test.ts` passes (cohort 14, treated 12, control 2,
  both control pages present and unlinked, no new inbound links). On top of it,
  every `does-medicare-cover-*.html` in `dist/` was byte-compared against a
  pre-batch build — **all 17 identical**, including both CONTROL pages. The four
  new records contain zero `does-medicare-cover-*` strings (grepped in source
  and in the rendered pages). `drugCoverage.ts`, the coverage route and the
  cohort definition untouched. Respiratory subject matter created no exception:
  D8 governs links, not topic.

- **Taxonomy (D9 — the pre-registered `lung-disease` gate, decided on evidence):**
  Ofev was the medication the project reserved to settle open question §31 #6,
  and the evidence said the existing `respiratory` key could not carry it.
  Demonstration, measured not asserted: Ofev's label has **no asthma or COPD
  indication** (IPF, chronic fibrosing ILDs with a progressive phenotype,
  SSc-ILD); and the funds that pay for it are *different funds*. On 2026-08-26
  TotalAssist's **Pulmonary fibrosis fund was OPEN** ($3,500 guaranteed /
  $7,000 max) and lists "Ofev (Nintedanib Esylate)", while its **COPD and Asthma
  funds were CLOSED** ($1,200 / $3,500) and **do not list Ofev at all**.
  HealthWell splits identically: Pulmonary Fibrosis and Systemic Sclerosis with
  ILD at **$9,000** max (both list Ofev) versus COPD – Medicare Access at $3,250
  and Asthma at $4,500 (neither does). Because `conditions` is what
  `programsForDrug()` matches disease funds on, tagging Ofev `respiratory` would
  have pointed a fibrosis patient at funds that are closed, smaller and do not
  cover their medicine — a wrong answer, not an imprecise one. So: `lung-disease`
  added to `CONDITIONS`, the reserved `lung-disease` view promoted out of
  `PENDING_CATEGORY_VIEWS` (which is now empty) and placed **before**
  `copd-asthma` under specific-before-general. **Nothing moved**: every existing
  inhaler keeps `respiratory`, and Ofev derives the single view "Lung Disease".
  Four class keys added, each confirmed against its own label — `acl-inhibitor`
  (Nexletol: "an adenosine triphosphate-citrate lyase (ACL) inhibitor"),
  `ics-laba` (Symbicort: a corticosteroid + a LABA, deliberately **not**
  `triple-inhaler`), `lama` (Spiriva: "an anticholinergic"), `kinase-inhibitor`
  (Ofev: "OFEV is a kinase inhibitor", kept broader than `jak-inhibitor`).
  No new axis, no category hub, no record-level category field.

- **Research findings worth carrying forward** (each checked, not inherited):
  - **Symbicort is NOT on AZ&Me.** AstraZeneca's own included-medications page
    lists Airsupra, Baxfendy, Bevespi, Breztri, Calquence, Etcamah, Fasenra,
    Imfinzi, Imjudo, Lokelma, Lynparza, Saphnelo, Tagrisso, Truqap, Wainua —
    Symbicort appears in no logo, no application PDF and no trademark footer,
    and is absent from the 2026 additions/removals notice. Recorded as
    "not on the list", not "removed". AstraZeneca Direct does not carry it
    either (`/symbicort` → "File not found"). This disproved the `azme` tagline.
  - **Ofev is a CMS-negotiated drug.** IPAY 2027, **MFP $6,350.00 per 30-day
    equivalent supply, effective 2027-01-01** (NDC-9 00597-0143 and 00597-0145,
    per-unit $108.972348) — read from CMS's selected-drug data file dated
    2026-05-26, not from a fact-sheet PDF. Nexletol, Symbicort and Spiriva
    appear in **no** row for 2026, 2027 or 2028.
  - **Generic nintedanib is on the U.S. market** — eleven capsule label entries
    on DailyMed besides Ofev. Symbicort has Breyna plus a generic
    budesonide/formoterol aerosol; the Spiriva **HandiHaler** has a generic
    tiotropium capsule but the **Respimat** spray does not. Nexletol has no
    generic (DailyMed returns only Nexletol and Nexlizet).
  - **Esperion publishes no patient assistance program for Nexletol** — only the
    NEXSTEP co-pay card ("as little as $10 per fill", commercial only, explicit
    Medicare/Medigap/TRICARE/VA exclusion, annual re-enrolment) and a Navigator
    access service. Honest negative, recorded as `not-found`.
  - **One open fund per cholesterol/fibrosis record:** TotalAssist
    Hypercholesterolemia OPEN ($1,900/$3,800, lists Nexletol and Nexlizet) and
    TotalAssist Pulmonary fibrosis OPEN ($3,500/$7,000, lists Ofev). Everything
    else checked was closed: TotalAssist COPD, Asthma and both health-equity
    variants, TotalAssist CAD health equity, HealthWell Hypercholesterolemia –
    Medicare Access ($2,500), COPD – Medicare Access ($3,250), Asthma ($4,500),
    Pulmonary Fibrosis ($9,000) and SSc-ILD ($9,000). Good Days has no fund for
    any of the four diagnoses.

- **Uncertain claims left for human review:** every Boehringer Ingelheim
  patient-facing host (`boehringer-ingelheim.com`, `patient.`, `pro.`, and
  `spiriva.com`/`ofev.com`, which redirect into them) returned an Incapsula
  block to every automated request on 2026-08-26. Only
  `docs.boehringer-ingelheim.com` was readable, and the Spiriva Respimat and
  Ofev savings-card terms it serves both state **"Benefits not to exceed Program
  expiration on 12/31/2024"** — expired documents (the Ofev one is also headed
  "nintedanib **tablets**" although Ofev is capsules). Consequences, all
  deliberate: the **Boehringer Cares PAP** and both **savings cards** are
  `verify`; the PAP's Medicare field is `unknown` rather than a borrowed
  "conditional"; no dollar terms are published for either card. What could be
  confirmed came from the foundation's own program description via PhRMA's
  Partnership for Prescription Assistance (lists Ofev Capsules, Spiriva
  HandiHaler, Spiriva Respimat) and an RxAssist entry updated 2026-04-27
  ("Patients with Medicare Part D may be eligible, contact program for details";
  income limit "Not Published"). Also unresolved: Symbicort's savings page
  carries a 2025 copyright/update stamp while advertising "$35 per month", and
  TrumpRx generic prices vary by location so no figure was quoted.

- **Legacy PROGRAMS:** one PROSE correction, following the Sanofi/AbbVie
  precedent — the `azme` tagline named **Symbicort**, which Batch 6 research
  disproved; only that token was replaced (with Breztri, confirmed on the same
  AZ&Me list and already researched in Batch 2). `drugs` arrays untouched
  everywhere. The `bicares` tagline names **Ofev and Spiriva** and research
  **confirmed** both are on the BI Cares therapy list, so it was correctly left
  alone. Deferred items were **not** touched: the `novartis` → Entresto and
  `lillycares` → Mounjaro taglines, and the `azme` tagline's Farxiga claim
  (AZ&Me stopped taking new Farxiga patients 2026-05-01, established in Batch 1).
  **New for the deferred task:** `bicares.org`, the URL the legacy `bicares`
  entry still points at, is a **non-existent domain** (NXDOMAIN on 8.8.8.8 and
  1.1.1.1); BI's program now lives under `boehringer-ingelheim.com`.
  `tests/record-precedence.test.ts` fixtures moved Spiriva → Pradaxa (assertion
  unchanged).

- **Checkpoint (2026-08-26):** Batch 6 CLOSED and verified — 25 records in
  `src/data/medicationAssistance/`, registry/directory/sitemap aligned, 435/435
  tests passing, EXP-003 cohort byte-identical and both controls unlinked.
  **The §24 Phase 4 order is complete. No Batch 7 started, no medications
  selected beyond it.** Remaining work is unchanged and still three independent
  tracks (project §32): (A) research expansion beyond §24, which needs a
  selection decision, not a queue; (B) the controlled linking pass, gated on the
  observation window closing ~2026-09-03; (C) legacy foundation data hygiene —
  now the `novartis` and `lillycares` taglines, the `azme` Farxiga claim, and
  the dead `bicares.org` URL, each its own change with its own entry.

- **Phase 4 checkpoint (2026-08-26, verified after the entry above — audit, not a
  content change).** Re-verified independently from the repository: 25 records =
  25 `FEATURED_DRUGS` rows = 25 sitemap entries = 25 built pages = 25 hub
  directory entries, no orphans or duplicates, all 25 suppressed from legacy
  claims, no researched medication leaking through a legacy `drugs[]` entry, no
  duplicate taxonomy tags, no fallback categories, `PENDING_CATEGORY_VIEWS`
  empty, every `lastVerified` a literal valid non-future date, every program
  dated-sourced, all `relatedMedications` and `relatedResources` resolving.
  Cohort still 14/12/2, both controls link-dark, zero new cohort links,
  `drugCoverage.ts` and the coverage route untouched. Gates: 435/435 tests, lint
  clean, `astro check` 0/0, build 177 pages, `verify` passed, `seo:gate` passed
  (153 pages, mean 76%). **One real state change came out of the audit and is why
  this bullet exists:** the §32 reconciliation figure was wrong. 4 of the 25
  records (Humira, Enbrel, Skyrizi, Rinvoq) are pre-existing inventory that never
  appeared on the §15.2 confirmed-46 list, so **21 of the 46 have pages and 25 do
  not** — not "21 remaining". §32 now states the corrected figure, classifies
  Track C into three kinds (disproved taglines C1–C3, dead program URLs C4–C5,
  broad unverified-directory hygiene C6), records that `jjpaf.org` is dead as
  well as `bicares.org`, and lists the taglines that were audited and found
  consistent so they are not re-litigated. No code changed; nothing was fixed,
  selected or linked.

- **Outcome (after recrawl):** not applicable — no experimental manipulation.

### 2026-08-26 — Prescription Assistance Batch 5: five NEW medication pages (Rybelsus, Wegovy, Zepbound, Praluent, Leqvio), built LINK-DARK (new content, not an experiment)

- **Pages:** `/rybelsus-assistance-program.html` · `/wegovy-assistance-program.html` ·
  `/zepbound-assistance-program.html` · `/praluent-assistance-program.html` ·
  `/leqvio-assistance-program.html` — five NEW slugs (the first new URLs since
  Batch 2), each an independently researched record registered through
  `FEATURED_DRUGS` → registry → sitemap; hub directory and `PAGE_INDEX` picked
  them up automatically. Sitewide: the hub directory grew 16 → 21 and gained a
  "Weight management / obesity" group. Nav, coverage cohort and the existing
  16 medication pages untouched (byte-identical HTML before/after).
- **Driver:** `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md` §24 Phase 4 order
  (Trulicity · Rybelsus · Wegovy · Zepbound · Praluent · Leqvio · …) — Trulicity
  shipped in Batch 3, so these are the next five. Requested directly, under D9.
- **Metric:** topical completeness (tracked). All five new pages admitted at
  **91%** (`npm run seo:gate` passed — 153 pages, site mean 76%, no `--accept`);
  AI readiness 89. Tests 336 → 391, lint clean, `astro check` 0 errors /
  0 warnings, build 168 → 173 pages, `npm run verify` passed.
- **Hypothesis:** none pre-registered — content addition under the project spec.

- **✅ Observation-window discipline (EXP-003): LINK-DARK, now machine-checked.**
  `tests/observation-window.test.ts` (P1 cleanup) passes; on top of it, every
  `does-medicare-cover-*.html` in `dist/` was byte-compared against a pre-batch
  build — all 17 identical, including the CONTROL page
  `does-medicare-cover-zepbound.html`. The Zepbound record links to no coverage
  page (the `/medicare-drug-coverage.html` hub instead, as Trelegy does); the
  Wegovy record's only coverage link is `/does-medicare-cover-ozempic-wegovy.html`,
  which is not a cohort member. `drugCoverage.ts` untouched. **Caveat for the
  September read-out:** a Zepbound assistance page now exists and may compete
  with the control page for "zepbound" queries — the same situation Trelegy has
  had since Batch 2. D8 governs links, not query overlap; noting it so it is
  not mistaken for a treatment effect.

- **Taxonomy (D9 — vocabulary, not architecture):** `weight` added to
  `CONDITIONS`, the one gap the taxonomy audit pre-registered for exactly this
  batch (§2 step 5). Demonstration: Wegovy and Zepbound carry no diabetes
  indication; obesity is not `heart`, and Zepbound's sleep-apnea indication is
  not `respiratory` (asthma/COPD/lung) — using either would mis-match charitable
  funds. No foundation in PROGRAMS matches `weight`, which is correct: no
  obesity fund was open anywhere on 2026-08-26. The existing "Weight Management /
  GLP-1" view gained `conditions: ['weight']` so a conditions-only
  `FEATURED_DRUGS` row does not fall to the fallback (same shape as the diabetes
  view + `insulin`). The `pcsk9` class blurb was widened for Leqvio, an siRNA
  "directed to PCSK9 mRNA", instead of adding a one-drug key. No new axis, no
  category hub, no record-level category field.

- **Research findings worth carrying forward** (each checked, not inherited):
  - **Rybelsus is being replaced in the U.S. by the "Ozempic pill"** (May 4,
    2026, one combined label). It is off the 2026 Novo PAP list, has no self-pay
    price, and its savings-offer URLs 301 to the Ozempic offer. Honest-negative page.
  - **Wegovy pen AND tablet, and the Zepbound KwikPen, are Medicare GLP-1 Bridge
    drugs** ($50/month, 2026-07-01 → 2027-12-31, Part D enrollees, weight
    management only; T2D/OSA/MASH/CV-risk uses go to Part D). No plan opt-in, no
    patient enrollment, Extra Help cannot lower the $50.
  - **The semaglutide MFP is a blended $274** for the "Ozempic; Rybelsus; Wegovy"
    entry; CMS's Wegovy-specific example is **$385.63 per 4-pen package**.
  - **Regeneron, not Sanofi, runs Praluent's program**; Sanofi Patient
    Connection's 22-item list omits it (confirms the P1 tagline fix). The
    MyPRALUENT PAP's only published form is a RE-ENROLLMENT form; Praluent
    sells for **$225 on TrumpRx** (from $537.21) with Medicare buy-outside-plan terms.
  - **Leqvio is a Part B drug** (Novartis: "covered under traditional Medicare,
    also called Part B") — Extra Help and the Part D cap do not apply; Medigap /
    MSP / QMB do. It IS on the NPAF list.
  - TotalAssist Hypercholesterolemia fund OPEN ($1,900/$3,800) and lists Praluent
    and Leqvio; TotalAssist Obesity fund CLOSED; MASH funds OPEN at TotalAssist and
    HealthWell (list Wegovy); HealthWell has no obesity fund; Good Days nothing.

- **Uncertain claims left for human review:** MyPRALUENT copay-card dollar terms
  (praluent.com is login-gated; recorded as `verify`, no figure); LEQVIO Co-pay
  terms page (start.leqvio.com refused every connection); NPAF income table (JS
  wizard, not reproduced); whether TotalAssist grants reimburse a Bridge $50
  copay or Part B coinsurance (not addressed on totalassist.org); Novo's own
  pages disagree on whether Medicare enrollees may use the Ozempic-pill self-pay
  price; two agents read the CMS 12234 PDF URL differently (consumer booklet vs
  PA form) — re-check before citing it as a booklet.

- **Legacy PROGRAMS:** no cleanup performed (as instructed). Precedence now
  suppresses Rybelsus, Zepbound, Praluent and Leqvio wherever a legacy entry
  names them; `tests/record-precedence.test.ts` fixtures moved from
  Praluent/Rybelsus to Victoza/Cosentyx (assertion unchanged). Two PROSE
  contradictions precedence cannot filter were noticed and left for the
  deferred data-hygiene task: the `novartis` tagline still names Entresto (not
  on NPAF since Batch 2) and the `lillycares` tagline still names Mounjaro (not
  on Lilly Cares since Batch 1).

- **Checkpoint (2026-08-26, after the entry above):** Batch 5 CLOSED and
  verified — 21 records in `src/data/medicationAssistance/`, registry/directory/
  sitemap aligned, 391/391 tests passing, EXP-003 controls untouched and
  unlinked. **No Batch 6 started.** Remaining work is three independent tracks,
  recorded in `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md` §32: (A) research
  expansion — Batch 6 is the four remaining §24 names, Nexletol/Symbicort/
  Spiriva/Ofev; (B) the controlled linking pass, gated on the observation window
  closing ~2026-09-03; (C) legacy foundation data hygiene — the `novartis`
  and `lillycares` taglines only (`sanofi` and `abbvie` were already corrected
  in the P1 cleanup), each its own change with its own entry.

- **Outcome (after recrawl):** not applicable — no experimental manipulation.

### 2026-08-26 — Prescription Assistance Batch 4: Dupixent, the final legacy migration, LINK-DARK (new content, not an experiment)

- **Pages:** `/dupixent-assistance-program.html` — same URL, legacy generic page
  rebuilt in place from an independently researched record. **No new URL** (the
  slug was already in `FEATURED_DRUGS`), no redirect, no duplicate. Sitewide:
  nothing. Nav, hub, coverage cohort and unrelated pages untouched.
- **Driver:** `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md` §32 — the last page on
  the legacy `Drug`-only representation, and the architecture's dual-axis test
  case (`autoimmune` + `respiratory`). Requested directly.
- **Metric:** topical completeness (tracked). **36% → 91%** (`npm run seo:gate`
  passed — 148 pages, site mean 75%, no `--accept`). AI readiness 89 (+26).
  Tests 311 → 322, lint clean, `astro check` 0 errors / 0 warnings, build 168
  pages, `npm run verify` passed.
- **Hypothesis:** none pre-registered — content addition under the project spec.
  Recorded so the September read-out does not mistake a construction change for
  an experimental result.

- **✅ Observation-window discipline (EXP-003): LINK-DARK, same as Batch 3.**
  Zero links added into the frozen `does-medicare-cover-*` cohort, treated or
  control. Checks run on the built HTML:
  - `grep 'does-medicare-cover'` on `dist/dupixent-assistance-program.html` → 0
    matches; the same grep on a Batch 3 page (`skyrizi`) → 0, so the check
    matches the established baseline rather than a new one.
  - `git status` on `src/data/drugCoverage.ts` and `src/pages/` → unchanged.
  - `does-medicare-cover-dupixent.html` already linked *to* the assistance URL
    through `drugCoverage.ts`. That link predates this batch and its target
    URL is unchanged, so no link, anchor or link count on any cohort page moved.
  - **The post-observation linking pass is still owed and still unstarted** (D8).

- **Architecture verdict: no defect. Frozen under D9.** Dupixent's nine FDA
  indications across skin, airway, gut and blood-vessel disease resolved on the
  existing two axes with no new field, tag or lookup. Derived categories came
  out `['autoimmune', 'biologics', 'copd-asthma']` — `autoimmune` first, which
  is what D7 was ordered for. Verified by assertion, not by eye.

- **Research findings worth carrying forward** (each checked, not inherited):
  - Sanofi Patient Connection does **not** cover Dupixent — it is absent from
    that program's medications-available list. The route is the separate
    DUPIXENT MyWay Patient Assistance Program, which names Medicare Part D
    explicitly.
  - HealthWell's AutoImmune – Medicare Access fund does **not** list Dupixent,
    though it lists Humira, Enbrel, Skyrizi and Rinvoq.
  - TotalAssist's Eosinophilic Esophagitis fund was **OPEN** — the first open
    charitable fund found in this project. Worth re-checking before any page
    repeats the "funds are generally closed" framing as though it were a rule.

- **Defect found, not fixed here:** the `sanofi` entry in `src/data/drugs.ts`
  still lists Dupixent (and Praluent) as medicines Sanofi Patient Connection
  supplies. It is wrong on every page that renders the assistance directory.
  Out of Batch 4's scope; needs its own change and its own entry.

- **Outcome (after recrawl):** not applicable — no experimental manipulation.
  Structural scores above are construction facts, not evidence about rankings.

### 2026-08-26 — Prescription Assistance Batch 3: five medication pages, built LINK-DARK (new content, not an experiment)

- **Pages:** `/trulicity-assistance-program.html` · `/humira-assistance-program.html` ·
  `/enbrel-assistance-program.html` · `/skyrizi-assistance-program.html` ·
  `/rinvoq-assistance-program.html` — same URLs, legacy generic pages rebuilt in
  place from independently researched records. **No new URLs** (all five slugs
  were already in `FEATURED_DRUGS`); 21 medications now. Sitewide: nothing.
  Nav, hub, SEO gates and unrelated pages untouched.
- **Driver:** `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md` Batch 3 (spec §24 build
  order #11–15), requested directly. Same architecture and research standard as
  Batches 1–2: official sources first, dated source on every material claim,
  honest closed / not-found / unknown statuses.
- **Metric:** topical completeness (tracked). **36% → 91%** on all five pages
  (`npm run seo:gate` passed — 148 pages, site mean 73%, no `--accept`). Words
  ~600 → 5,700–6,100; AI readiness 89. Remaining gap on all five is the
  `schema` detector false negative already recorded for Batch 1 (DrugPage emits
  `MedicalWebPage`). Tests 256 → 311, `astro check` 0 errors, build 168 pages.
- **Hypothesis:** none pre-registered — content addition under the project spec.

- **✅ Observation-window discipline (EXP-003): this batch is LINK-DARK, and that
  is the difference from Batch 2.** Batch 2 fired confounder #5 by adding one
  in-content inbound link to each of three treated pages. Batch 3 adds **zero**
  links into the cohort, treated or control. Three independent checks:
  1. The cohort's source files — `src/pages/does-medicare-cover-[drug].astro`,
     `src/data/drugCoverage.ts`, `src/data/business.ts` — are untouched, so the
     14 pages' HTML is unchanged by construction.
  2. `grep 'href="/does-medicare-cover-'` over all five built pages returns
     **NONE**. (The coverage pages already linked *out* to
     `/<slug>-assistance-program.html` via `drugCoverage.ts`, so a record
     appearing changes no link, anchor text or link count on their side either.)
  3. Post-run snapshot: **0 of 17** `does-medicare-cover-*` pages changed
     `words`, `aiReadiness`, `tables` or `completeness`.
- **✅ No `medianWords` artifact this time.** Batch 2's erratum 2 recorded that a
  cohort-scale content addition moved the site-relative median (552 → 566) and
  silently cost three untouched pages an insights point. Checked explicitly
  here: `medianWords` held at **567** before and after, so no untouched page's
  AI readiness moved. `medianInbound` did shift 8 → 7 (a site statistic, not a
  page edit) — recorded so the September Delta review does not read any
  priority movement on the cohort as an experimental effect.
- **Taxonomy:** one drug-class key added because a researched medication needed
  it — `jak-inhibitor` for Rinvoq, confirmed against the label ("RINVOQ/RINVOQ LQ
  is a Janus kinase (JAK) inhibitor"); it is a tablet and must not carry
  `biologic`. The `autoimmune` browse view was moved ahead of `biologics` in the
  canonical order: Batch 3 is the first batch whose records carry the
  `biologic` class, so the ordering had never been exercised, and left alone
  Humira/Enbrel/Skyrizi would have led with "Biologics (Respiratory / Immune)".
  Verified to change no existing page (no prior record carries `biologic`;
  legacy `Drug` entries carry `conditions` only).
- **Evidence-discipline notes worth keeping:**
  - **Humira is the batch's real finding.** AbbVie closed myAbbVie Assist to new
    HUMIRA patients on July 1, 2026 while keeping Skyrizi and Rinvoq in the same
    program. "AbbVie has a PAP" would have produced a wrong page; only the
    drug-specific source settles it. AbbVie's application-overview page *still*
    links a December 2024 HUMIRA application form — the page says so.
  - **Enbrel's Medicare question is recorded as `unknown`, not guessed.** Two
    official Amgen pages contradict each other (the FAQ says qualifying patients
    "must not be eligible for … Medicare"; the eligibility page allows Medicare
    patients "for certain products" without naming Enbrel). Per the
    signal → verification → conclusion rule, the page reports the contradiction
    and tells the reader to ask, rather than defaulting to the likely answer.
  - **Access technique, reusable:** `www.abbvie.com`, `www.lilly.com` and
    `www.lillycares.com` serve WAF/JS-challenge blocks; the **apex hosts**
    (`abbvie.com`, `lilly.com`, `lillycares.com`) serve the same pages, and
    AbbVie's PDFs are readable under `abbvie.com/content/dam/`. Every
    manufacturer claim in this batch was read on an official page, not a
    search summary.

---

### 2026-08-26 — Batch 2 review fixes: Entresto fund naming and the FPL source-year note (presentation only, not an experiment)

- **Pages:** `/entresto-assistance-program.html` (fund naming) and **every**
  medication assistance page (the shared income-limit note + a new key term).
  `/xarelto-assistance-program.html` and `/breztri-assistance-program.html` also
  gained a table attribution. No cohort page touched.
- **Driver:** the two non-blocking findings from the Batch 2 review.
- **Fix 1 — Entresto.** Two TotalAssist cards read as near-identical names with
  opposite statuses, so a reader scanning them could not tell whether the
  heart-failure fund was open or closed. They are now
  "TotalAssist — Heart failure health-equity fund (**ZIP-code restricted**)" and
  "TotalAssist — **general** Heart failure and Cardiomyopathy funds (no ZIP-code
  rule)", each summary cross-referencing the other. The open card's status also
  moved `open` → `limited` — the type's own definition of `limited` is
  "accepting, but with a material restriction," which a ZIP-code eligibility
  rule is. Its pill now reads "Open with limits" rather than "Accepting
  applications". No underlying fact changed; `openCount` is unaffected because
  the quick-answer count already includes `limited`.
- **Fix 2 — the 300% FPL figures.** Neither number was altered. AZ&Me publishes
  $47,880 / $64,920 (one/two people) and Johnson & Johnson publishes
  $46,950 / $63,450, both while saying "300% FPL", because each program builds
  its table from a poverty-guideline year of its own choosing. A shared
  `FPL_NOTE` now renders once on every medication page above the program cards,
  a "Federal poverty level (FPL)" key term was added, and each figure is
  attributed to the table it came from (J&J's February 2026 program guide;
  AZ&Me's table effective January 26, 2026). **Batch 3 corroborated the
  diagnosis independently:** Lilly Cares states outright that its limits are
  "300% … of 2026 Federal Poverty Guidelines" and publishes $47,880 / $64,920 —
  matching AZ&Me and Amgen Safety Net Foundation to the dollar, and differing
  from J&J. Three programs on the 2026 table agree; the outlier is a table-year
  difference, exactly as the note says. Normalising the numbers would have
  produced a figure no program would recognise on the phone.
- **Metric:** topical completeness (tracked) — unchanged, as intended;
  `npm run seo:gate` passed with no floors moved. This is a comprehension fix,
  not a content addition.

---

### 2026-08-26 — Prescription Assistance Batch 2: five record-driven medication pages (new content, not an experiment)

- **Pages:** `/entresto-assistance-program.html` · `/xarelto-assistance-program.html` ·
  `/repatha-assistance-program.html` — same URLs, legacy generic pages rebuilt in
  place from independently researched records. **New URLs:**
  `/trelegy-assistance-program.html` · `/breztri-assistance-program.html` (two
  new `FEATURED_DRUGS` slugs; both appear in the hub directory automatically —
  16 medications now). Sitewide: nothing. Nav, hub, SEO gates and unrelated
  pages untouched.
- **Driver:** `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md` Batch 2 (spec §24 build
  order #6–10), requested directly after the taxonomy migration. Same
  architecture and research standard as Batch 1: official sources first, dated
  source on every material claim, honest closed / not-found / verify statuses.
  Two drug-class keys added because researched medications needed them
  (`arni` for Entresto, `triple-inhaler` for Trelegy and Breztri).
- **Metric:** topical completeness (tracked). **36% → 91%** on the three migrated
  pages; the two new pages admitted at **91%** (`npm run seo:gate` passed; 3
  floors raised, 2 new pages admitted; no `--accept`). Words ~600 → 5,200–5,900;
  AI readiness 89. Remaining gap on all five is the `schema` detector false
  negative already recorded for Batch 1 (DrugPage emits `MedicalWebPage`).
- **Hypothesis:** none pre-registered — content addition under the project
  spec. Position/impressions on the five URLs recorded for damage control.
- **⚠ Observation-window notes (EXP-003):** confounder **#5** fires again —
  +1 in-content inbound link to treated pages `does-medicare-cover-entresto`,
  `-xarelto`, `-repatha` from their rebuilt assistance pages (same shape as
  Batch 1). The **control arm was deliberately protected**: `does-medicare-cover-trelegy`
  is a control page, so the new Trelegy assistance page does **not** link to it
  and `drugCoverage.ts` (which still lacks an `assistanceSlug` for Trelegy)
  was not edited. Verified in `dist/`: zero links in either direction. Logged
  in the cohort plan §5. No sitewide template change this time (confounder #4
  did not fire).
- **Sitemap:** `lastmod` bumped to 2026-08-26 for the three migrated URLs (in
  the pre-existing literal-`
` line, left as-is); the two new URLs appended as
  normal XML entries.
- **Outcome (after recrawl):** _open — check that position/impressions on the
  five URLs and on the EXP-003 treated arm do not fall; confirm the two new URLs
  are indexed._

### 2026-08-26 — Autoimmune & Immune Conditions browse view (taxonomy view layer, not an experiment)

- **Pages:** none change today. The view is a derived browse category over the
  existing `autoimmune` condition key (project §31 D7); no record, URL, nav
  entry, hub grouping or `CONDITIONS` key was touched, and the legacy `Drug`
  type still has no `drugClass`. The on-page category kicker renders only on
  record-driven pages, and no autoimmune medication has a researched record
  yet — so the built site is byte-identical for those five pages.
- **Change:** `ASSISTANCE_CATEGORIES` gained `autoimmune` ("Autoimmune & Immune
  Conditions"), placed before `copd-asthma` so Dupixent leads with the immune
  view; `AssistanceCategoryKey` widened; the pending-view entry removed. A
  test now fails the build if any `FEATURED_DRUGS` entry derives the fallback
  view, and asserts Humira/Enbrel/Skyrizi/Rinvoq/Dupixent derive `autoimmune`.
- **Metric:** none — no visible output changes. Recorded so the September
  reading knows this is the reason the five legacy pages will read
  "Autoimmune & Immune Conditions" rather than "Specialty & Other" the day
  they migrate to researched records.
- **Hypothesis:** none pre-registered (no content changed).
- **Outcome (after recrawl):** n/a

### 2026-08-26 — Two-axis medication taxonomy (data-model migration, not an experiment)

- **Pages:** no URLs changed. Data layer + 2 call sites; one visible text change
  (the Ozempic category kicker gained "Heart & Blood Pressure").
- **Change:** `ASSISTANCE_CATEGORIES` retired as a record-level taxonomy.
  Medications are now classified on two independent axes — `conditions`
  (canonical, load-bearing for charitable-fund matching) and a new `drugClass`
  — and browse categories are derived views over those axes via
  `categoriesFor()`. Five Batch 1 records migrated.
- **Metric:** internal linking.
- **Hypothesis:** We expect this change to improve internal linking because the
  taxonomy tags on every medication page were duplicating `diabetes` and
  `heart` (the same key existed in both taxonomies), which double-weighted two
  tags and suppressed the rest in tag-based link scoring.
- **Tag deltas:** Farxiga/Jardiance `+sglt2`, duplicate `diabetes`/`heart`
  removed · Eliquis `blood-thinners` → `anticoagulant`, duplicate `heart`
  removed · Mounjaro/Ozempic keep `glp-1`, duplicates removed. A test now fails
  the build if any record's tags contain a duplicate.
- **EXP-003 confounder note:** tag-derived internal-link suggestions change on
  5 pages. Smaller in scope than the nav change logged below, same window,
  same caveat — carry it into the September reading; no ledger pattern is
  credited.
- **Outcome (after recrawl):** _open_

### 2026-08-26 — Prescription Assistance nav: medication names removed from the sitewide dropdown (IA change, not an experiment)

- **Pages:** none rewritten. Sitewide nav (`src/config/navigation.ts`) + one
  anchor/subhead on `/prescription-drug-assistance.html`.
- **Change:** the Prescription Assistance dropdown listed five drug names while
  fourteen medication pages were live, so nine were unreachable from the nav.
  The five names were removed; the dropdown is now three fixed items (hub ·
  All Medications → `#all-medications` · Extra Help) and the directory on the
  hub page — generated from `FEATURED_DRUGS` — carries the inventory instead.
- **Metric:** internal linking.
- **Hypothesis:** We expect this change to improve internal linking because the
  medication directory is now generated from the registry, so every medication
  page is reachable from the nav path as the set grows, instead of only the
  five that were hand-listed.
- **EXP-003 confounder note:** this is a **sitewide nav link change** made
  during the observation window (confounder #4, same class as the 2026-08-26
  wrap rule). Five sitewide outbound links were removed and one added. It
  changes site-level internal-link distribution and must be carried into the
  September evidence reading — it is not a Sprint 2B experiment and no ledger
  pattern is credited for it.
- **Desktop nav bar unchanged.** Measured first (see
  docs/PRESCRIPTION-ASSISTANCE-PROJECT.md §14): the `nowrap` bar needed 1690px
  at 8 items and 1588px at 7, so removing "Home" would not have fixed 1280/1366.
  Per the stated condition, the top-level structure was left alone and no
  further global CSS was written.
- **Outcome (after recrawl):** _open_

### 2026-08-26 — Prescription Assistance Batch 1: five record-driven medication pages + nav hub (new content, not an experiment)

- **Pages:** `/farxiga-assistance-program.html` · `/jardiance-assistance-program.html` ·
  `/eliquis-assistance-program.html` · `/mounjaro-assistance-program.html` ·
  `/ozempic-assistance-program.html` — same URLs, rebuilt from independently
  researched records. Sitewide: a new **Prescription Assistance** nav hub
  (`src/config/navigation.ts`, es labels in `locales.ts`) and one nav CSS rule
  (`public/styles.css`, `STYLES_VERSION` bumped).
- **Driver:** `docs/PRESCRIPTION-ASSISTANCE-PROJECT.md` Batch 1 (spec §24 build
  order #1–5), requested directly. Architecture: `src/types/MedicationAssistance.ts`,
  `src/data/medicationAssistance/` (registry + one source-dated record per drug),
  `src/components/medication/` (page, program card, 7-step guide, video frame).
  The `[drug]-assistance-program.astro` route renders the record page when a
  record exists and the legacy generic page otherwise — the other nine drug
  pages are untouched in content.
- **Metric:** topical completeness (tracked). **36% → 91%** on all five
  (`npm run seo:gate` passed; five floors raised; no `--accept`). Words ~600 →
  5,000–5,800; 14 in-content outbound links each; AI readiness 89. The one
  remaining gap is the `schema` element: the detector accepts `Article`/`WebPage`
  only, and DrugPage emits `MedicalWebPage` (a schema.org WebPage subtype) — a
  detector false negative, not a page defect. Engine fix deferred: Phase 1
  infrastructure is frozen; queue it for after the observation window.
- **Hypothesis:** none pre-registered. This is a content addition under the
  project spec, not an optimization; average position/impressions on the five
  URLs are recorded for damage control and as the spec's own Phase 3 checkpoint
  ("watch Search Console before continuing").
- **⚠ Observation-window notes:** lands inside the Sprint 2B freeze. EXP-003
  confounders fired and are logged in its observation plan §5: **#4** sitewide
  template change (the new nav hub appears on all 14 cohort pages, treated and
  control alike, plus the nav CSS rule) and **#5** inbound-link drift (+1
  in-content link each to `does-medicare-cover-farxiga/jardiance/eliquis` —
  treated arm — from their sibling assistance pages; control arm unchanged).
  Touches none of EXP-001/EXP-002's pages.
- **Nav CSS (repair, not optimization):** the pre-change 7-hub bar already
  overflowed at ≤1366px (+92px at 1280, "Contact" off-screen behind a horizontal
  scrollbar); the 8th hub extended that to 1600px. The rule lets the desktop row
  wrap at 1.15rem type: one row ≥1600px, two rows on laptops, no label breaks,
  header height unchanged. Measured with headless Chromium at 961–1920px.
- **Sitemap:** `lastmod` bumped to 2026-08-26 for the five URLs in
  `public/sitemap-posts.xml` (note: those entries sit on one physical line with
  literal `\n` text — pre-existing; left as-is).
- **Outcome (after recrawl):** _open — check that position/impressions on the
  five URLs and on the EXP-003 treated arm do not fall._

### 2026-08-25 — Part D pillar redesign (design parity with the Advantage pillar; not an experiment)

- **Pages:** `/part-d-plans-vernal.html` + `/es/part-d-plans-vernal.html`
  (`src/components/content/PartDPlansPage.astro`, `src/i18n/content/{en,es}/part-d-plans-vernal.json`)
- **Driver:** design parity, requested directly. The Part D pillar was still the
  plain `ArticlePage` prose template while its sibling Advantage pillar had
  already been redesigned in the entry below. Rebuilt on the same
  `bareHeader`/`bareFooter` pattern: split hero (H1 + byline + lede | Vernal
  photo), two-column body with icon-badged sections and a sticky agent card,
  FAQ accordion, "Related Helpful Resources" card grid, navy CTA band.
- **Copy:** unchanged, word for word. `keyHtml` was split into a `keyPoints[]`
  array so the three "Key Factors" render as a checklist — same sentences, same
  order, both locales. New strings are chrome only (`ui` block: agent-card
  labels, CTA band, section headings), added to `en/` and `es/`.
- **Editorial-gate check (the trap the Advantage redesign hit):** `bareHeader`/
  `bareFooter` drop the components the completeness detector reads. Re-added
  before shipping — the real `<SummaryBlock>` now doubles as the hero lede, and
  the bespoke blocks carry the contract substrings the detector documents
  (`pd-sources`, `related`, `page-cta`). Result: completeness **82%**, the two
  remaining gaps (`comparisonTable`, `definitions`) both predate the redesign.
  All 7 `relatedItemsHtml` internal links were kept (as a secondary list under
  the four framework cards), so the link graph did not shrink.
- **Metric:** none pre-registered. This is a presentation change made on
  request; average position and CTR on the URL are recorded for **damage
  control only** — the question is whether the redesign costs anything, not
  whether it helps.
- **Hypothesis:** none. Per the Scientific Rule, attaching a prediction to a
  change whose reason was "make it look like the sibling pillar" would put an
  untested pattern in the ledger that nobody chose to test.
- **⚠ Observation-window note:** lands inside the Sprint 2B freeze
  (2026-07-30 → ~2026-09-03) and inside the fresh-URL window opened by the
  rename logged below. It touches none of EXP-001–003's pages (/medigap, /,
  the drug cluster). It does mean any Sprint 2C baseline for the Part D pillar
  must be taken after **this** build's recrawl, not after the rename's.
- **Outcome (after recrawl):** _open — check that position/impressions on
  `/part-d-plans-vernal.html` do not fall relative to the post-rename reading._

### 2026-08-25 — Editorial-contract repair after three custom-layout redesigns

- **Pages:** /medicare-advantage-plans-vernal.html · /part-d-plans-vernal.html ·
  /medicare-supplement-vs-advantage.html
- **Driver:** not optimization — closing a hole the redesigns opened. Three
  pages were rebuilt into custom layouts (`bareHeader` + `bareFooter`) in
  parallel across two sessions. That pair of flags suppresses `SummaryBlock`,
  `PageCTA`, `SourcesList` and `RelatedPages`, which are exactly the markers
  `scripts/seo/sources.mjs` detects — so a redesign that loses nothing a reader
  can see still drops the page's completeness score. The Advantage page fell
  70% → 50% and Part D 73% → 45% before this was caught by `npm run seo:gate`.
- **Change:** restored the real components inside each custom layout rather than
  lowering any floor. Advantage: `<SummaryBlock>`, `<SourcesList>`, `page-cta`
  contract class on the CTA band, HMO-vs-PPO comparison table, in-content links
  6 → 13. Part D: comparison table (standalone PDP vs MAPD) and a `<dl>` of six
  Part D terms, links 9 → 12. Supplement-vs-Advantage: a Sources block with
  three Medicare.gov/CMS citations, also carried into the page schema. Retired
  the leftover `best-plans` taxonomy tag in `PartDPlansPage.astro` +
  `pageIndex.ts`.
- **Metric:** topical completeness (tracked metric). 100% on all three, up from
  floors of 70 / 73 / 90. Words: 621 → 771, 666 → 943, 1376 → 1432.
- **Hypothesis:** none — restoring a standard the pages already met is repair,
  not a prediction, and does not earn a ledger data point.
- **⚠ Gate note:** `npm run seo:gate` raises floors on a pass, so the three
  floors are now 100%. Do **not** clear a future failure with
  `npm run seo:gate -- --accept` — that resets *every* page's floor sitewide, not
  just the failing one, and silently discards the standard.
- **Outcome (after recrawl):** _open_

### 2026-08-25 — CMS superlative scrub + two money-page URL renames (compliance, not an experiment)

- **Pages:** `/best-medicare-advantage-vernal.html` → `/medicare-advantage-plans-vernal.html`
  and `/best-part-d-plans-vernal.html` → `/part-d-plans-vernal.html` (plus their
  `/es/` siblings); superlative anchor text, `<title>`s and FAQ questions scrubbed
  across ~30 further files.
- **Driver:** compliance, not optimization. 42 CFR §422.2262 / the Medicare
  Communications and Marketing Guidelines bar absolute superlatives ("best",
  "top", "#1") in MA/Part D marketing unless the claim cites current- or
  prior-year data and its source and date. The site made the claim in two H1s,
  two slugs, ~20 internal anchors and three page titles, with no substantiation.
- **Change:** slugs renamed; components renamed to match
  (`MedicareAdvantagePage`, `PartDPlansPage`); content JSON keys renamed in
  `en/` and `es/`; real 301s added to `public/_redirects` (NOT to
  `astro.config.mjs` — that emits a static `.html` at the old path which would
  shadow the edge rule); `sitemap-money.xml` lastmod bumped. The Medicare
  Advantage pillar was also redesigned (hero + trust strip + HMO/PPO cards +
  dark CTA band) using the `medicare-roosevelt-utah.astro` bareHeader/bareFooter
  pattern. The first cut of that redesign *regressed* the editorial gate 70% →
  50%: `bareHeader`/`bareFooter` drop the components the completeness detector
  reads (`summary-block`, `page-cta`, `sources`, `related`). Fixed by putting the
  real `<SummaryBlock>` and `<SourcesList>` back in the custom layout, giving the
  CTA band the `page-cta` contract class, adding an HMO-vs-PPO comparison table,
  and raising in-content links 6 → 13. Net: completeness **70% → 100%**, words
  621 → 771. Nothing was removed.
- **Metric:** none pre-registered — this is a legal-risk removal that would have
  been made regardless of its search effect. Average position and impressions on
  the two URLs are recorded for **damage control only**: the question is whether
  the 301s hold, not whether the change helped.
- **Hypothesis:** none. Logging a hypothesis here would be retrofitting a
  prediction onto a change whose reason was compliance; per the Scientific Rule
  that would pollute the ledger with a pattern nobody chose to test.
- **⚠ Observation-window note:** this lands inside the Sprint 2B freeze window
  (2026-07-30 → ~2026-09-03). It does not touch EXP-001–003's pages (/medigap,
  /, the drug cluster), so those tests are not directly confounded. It does
  reset URL-level GSC history for the two renamed pages: Search Console tracks
  the new URLs as new rows, and the old rows stop accruing. Any Sprint 2C
  baseline for the Advantage or Part D pillars must be taken **after** the
  recrawl of the new URLs, not carried over from the `best-*` rows.
- **Outcome (after recrawl):** _open — check that (a) both old URLs return 301
  (not 200 or 404), (b) the new URLs are indexed and the old ones dropped, and
  (c) no "best" superlative survives a site-wide crawl._

### 2026-07-30 — `does-medicare-cover-[drug]` comparison table (Sprint 2B, experiment #3 — first cohort-based isolated test)

- **Registry:** EXP-003 (`docs/seo/EXPERIMENTS.md`)
- **Pages:** 14 pages from `src/pages/does-medicare-cover-[drug].astro`.
  **Treated (12):** dupixent, rinvoq, skyrizi, enbrel, eliquis, xarelto,
  entresto, humira, repatha, trulicity, farxiga, jardiance. **Control (2):**
  trelegy, zepbound — condition-group singletons that render no table. No
  Spanish variants exist.
- **Baseline:** docs/seo/baselines/drug-coverage-cohort-2026-07-30.md
  (immutable; treated arm 913 impressions, 1 click, weighted position 12.66;
  control arm 187 impressions, weighted position 14.52; all 14 pages uniform at
  completeness 82%, AI readiness 74, tables 0)
- **Change:** add exactly one `<table>` per treated page, comparing the page's
  drug against the other drugs treating the same condition. Three columns
  (Drug / Covered by Medicare? / Typical formulary tier), 3–5 data rows. Every
  cell is an existing `drugCoverage.ts` field the template already renders as
  prose; the only new logic is a presentation mapping of the existing
  `CoverageStatus` union to a label. No links in the table, no new headings
  (the table is titled by its own `<caption>`), no other change.
- **Metric:** impression-weighted average position across the 12 treated pages
  (primary; post-change-only window vs 12.66). Treated impressions (secondary
  guard — flat or up). Control-arm position recorded as a downgrade reference
  only. CTR and clicks recorded, **not judged** — 2 clicks on 1,100
  impressions against a standing "confirmed, low-confidence CTR" verdict.
- **Hypothesis:** We expect this change to improve average position because the
  twelve treated pages already rank at an impression-weighted 12.7 in the
  striking-distance band while missing the one element the editorial standard
  says a Part D page cannot omit — a page whose entire job is answering "is
  this drug covered, and how does it compare" currently compares nothing — so
  adding the standard comparison table supplies the cohort's single structural
  deficit.
- **Attribution note:** exactly **one pattern (Standard comparison table)
  replicated across 12 structurally identical pages**, with 2 untreated
  siblings as a within-template control. A supported outcome is the ledger's
  first *isolated* evidence for this pattern, and the strongest single result
  it can hold. The control arm can downgrade a verdict but never gate one
  (baseline §4). Because content is held constant and only structure changes,
  a supported outcome attributes to presentation, not to added information.
- **Expected engine effect:** the edited file **is** in every page's
  `sourceFiles`, so freshness recomputes on all 14 pages, treated and control
  alike. `freshness = clamp01(ageDays/365)` is a *staleness* factor, so the
  reset **lowers** Priority by ~0.33 (0–1 point after rounding). It does not
  raise it. This is an engine artifact, never evidence — and it is a positive
  control for the `sourceFiles` finding recorded in EXP-002.
- **Check-0 verification (2026-07-30, post-edit run):** tests 142 ✓, build 166
  pages ✓, editorial gate ✓ raising **exactly 12 floors** (the treated arm).
  Treated: tables 1 ✓, AI `tables` component 0.5 ✓, completeness 91 ✓,
  `missingElements` → `["definitions"]` ✓, outbound unchanged ✓, definitions 0 ✓,
  summary/FAQ/sources/byline/schema/internal-links unchanged ✓. Control: tables
  0, AI 74, completeness 82 — unchanged ✓. Opportunity unchanged on all 14 ✓.
  Five errata (observation plan §0): (1) AI readiness is 79 on nine treated
  pages but **82 on three** — the `insights` component includes
  `words >= medianWords`, so "all other AI components unchanged" cannot be
  pre-registered for any word-adding intervention; (2) that median moved
  **552 → 566**, costing three **untouched** pages their insights point
  (`/medicare-formulary-lookup` → AI 65, `/medicare-enrollment-vernal` → 63,
  `/medicare-enrollment-periods` → 79) — AI readiness is not a page-local
  score; (3) the freshness reset is **pending commit**, not falsified — the
  engine reads git commit dates, not the working tree, so `ageDays` is still 24
  and Priority unchanged; re-verify at check 0b after the auto-commit lands;
  (4) the pre-registered 3-column table was **degenerate on 8 of 12 pages**
  (diabetes and autoimmune groups share one status and one tier), so a fourth
  column (`Used for`, from the existing `treats` field, distinct on 12/12) was
  added at t=0 before any post-change data existed — and the engine scored both
  versions identically, because `hasComparisonTable` is pure shape
  (`cols>=2 && rows>=3`), so **table credit is awarded for structure, not
  information**; (5) `thin` cleared on jardiance (602 words), holding on the
  other 11.
- **Evaluation protocol:** docs/seo/observation-plans/drug-coverage-cohort-2026-07-30.md
- **Outcome (after recrawl):** _open_

### 2026-07-30 — / homepage AI summary (Sprint 2B, experiment #2 — first isolated pattern test)

- **Registry:** EXP-002 (`docs/seo/EXPERIMENTS.md`)
- **Pages:** / (and /es.html via shared HomePage component; judged on / only,
  /es.html recorded as orientation)
- **Baseline:** docs/seo/baselines/home-2026-07-30.md (immutable; impressions
  1,040, clicks 23, position 7.15, CTR 2.21%, completeness 22%, AI readiness 47,
  1,137 words, 17 outbound links)
- **Change:** insert exactly one `<SummaryBlock>` immediately below the H1,
  with EN and ES copy in the i18n content files. Nothing else — no title/meta,
  no links, no tables, no definitions, no byline, no sources, no restructuring.
- **Metric:** average position (primary; post-change-only window vs 7.15).
  Impressions (secondary guard — flat or up). CTR and clicks recorded, **not
  judged** — environment verdict is "confirmed, low-confidence CTR"; promotion
  of CTR to a judged metric requires an explicit observation-log entry, never
  retroactive.
- **Hypothesis:** We expect this change to improve average position because the
  homepage already ranks at 7.2 in the striking-distance band on the site's
  highest impression volume, and its dominant structural deficit is
  extractability (AI readiness 47, `needsSummary`) — adding the standard AI
  summary block under the H1 gives Google and AI surfaces a clean, quotable
  statement of what the page is about, which is the single element the queue
  prescribes.
- **Attribution note:** exactly **one pattern (Standard AI summary) on one
  page** — the Pattern Ledger's first *isolated* data point if supported
  (graduation criterion #2). By-construction movements pre-registered in the
  baseline (§§3–4, 8): completeness 22% → 33%, AI readiness 47 → 67,
  `needsSummary`/`aiGap` cleared, word count ~1,190, all other AI component
  scores unchanged. **Expected engine effect:** on the first post-edit run,
  Priority is expected to increase by ~4–5 points due solely to the freshness
  factor resetting. This is not evidence supporting the hypothesis and must not
  be interpreted as experimental success.
- **Check-0 verification (2026-07-30, post-edit run):** completeness 33 ✓,
  AI readiness 67 ✓, words 1,189 ✓, outbound 17 ✓, inbound 10 ✓,
  `needsSummary` cleared ✓, all other AI components unchanged ✓, Opportunity
  76 unchanged ✓. Two baseline pre-registrations were wrong (errata in the
  observation plan §0): `aiGap` **stays set** — the floor is 70, not "below
  67"; and the freshness reset **does not fire** — the engine attributes
  freshness to git commits of `src/pages/index.astro` only, so component/i18n
  edits are invisible to it and Priority stays 77. Neither affects the
  experimental metrics; both are engine-model findings, parked for
  post-experiment queue work.
- **Evaluation protocol:** docs/seo/observation-plans/home-2026-07-30.md
  (post-change-only GSC window; supported = position ≤ 5.0 with impressions
  flat/up; directional = ≥1.0 improvement; judged no earlier than 4 weeks
  post-recrawl, hard stop at 8 weeks).
- **Outcome (after recrawl):** _open_

### 2026-07-30 — /medigap pillar expansion (Sprint 2B, optimization #1)

- **Registry:** EXP-001 (`docs/seo/EXPERIMENTS.md`)
- **Pages:** /medigap.html (and /es/medigap.html via shared component)
- **Baseline:** docs/seo/baselines/medigap-2026-07-29.md (immutable; impressions
  70, clicks 0, position 13.73, completeness 70%, AI readiness 67, 249 words)
- **Change:** expand the pillar from 249 words to cluster depth — standard
  comparison table (Plan G vs Plan N vs HD-G, figures from annualMedicareData),
  definitions `<dl>`, `<SourcesList>`, 8+ in-content links, prose targeting the
  "utah medigap plans" head terms; `<title>` + meta description rewritten.
- **Metric:** average position (primary); impressions (secondary). CTR recorded
  but not judged — at 70 impressions a CTR delta is not attributable.
- **Hypothesis:** We expect this change to improve average position because the
  pillar already ranks at 13.7 in the striking-distance band while being 3.5×
  thinner than its cluster siblings, so adding the standard comparison table,
  definitions, sources, and 8+ internal links supplies the depth that is the
  page's only structural deficit.
- **Attribution note:** this change exercised seven patterns at once
  (comparison table, definitions, sources, internal-link expansion, contextual
  depth, FAQ expansion, title/meta rewrite). A supported outcome validates the
  **bundle on this page archetype**, not any individual pattern — each ledger
  pattern gains one *bundled* data point only. Later Sprint 2B pages should
  isolate patterns where the queue prescription allows.
- **Evaluation protocol:** docs/seo/observation-plans/medigap-2026-07-30.md
  (observation schedule, post-change-only GSC window methodology, thresholds:
  supported = position ≤10.0; directional = ≥2.0 improvement; judged no earlier
  than 4 weeks post-recrawl, hard stop at 8 weeks).
- **Outcome (after recrawl):** _open_

### 2026-07-30 — First Search Console import + URL-join fix (data layer, not model)

- **Pages:** none — `normalizeUrl()` in `scripts/seo/parse.mjs` + 6 new tests
- **Change:** imported first GSC export (`pages-2026-07-29.csv`, 3-month window,
  200 rows). First run orphaned 115/200 GSC URLs: Google indexes extensionless
  URLs (`/aca`) while registry/canonicals use `.html`. `normalizeUrl()` now
  folds extensionless paths into the `.html` key. After fix: 1/200 unmatched
  (`/privacy.html`, noindex). No weight/threshold/business assumption touched.
- **Hypothesis:** folding both URL forms into one key attributes each page's
  full search history to it, making the performance-aware queue trustworthy.
- **Metric:** unmatched GSC URLs 115 → 1; pages with performance data 0 → 118/146 EN.
- **Audit verdict:** Performance Mode ON. Queue validated in
  `docs/PERFORMANCE-VALIDATION-2026-07-30.md` — **model confirmed with
  low-confidence performance data**; weights remain frozen; CTR-derived
  prescriptions advisory until ~10 pages have ≥10 clicks.
- **Outcome (after recrawl):** n/a — no content changed

### 2026-07-29 — Structural queue audit (model change, not content)

- **Pages:** none — one Business Impact weight in `scripts/seo/config.mjs`
- **Change:** `other-insurance` silo Business Impact 5 → 3. ACA / life /
  indemnity are strategic cross-sells, not core Medicare revenue; at 5 they
  outranked core Medicare pillars (/medicare-costs, /turning-65) on business
  weight alone.
- **Metric:** none (pre-performance-data; a business-assumption correction, not
  an outcome-tuned adjustment — does not violate the Phase 1 freeze)
- **Audit verdict:** the engine passed its first structural audit — every top-10
  ranking was explainable, and independent editorial judgment converged on the
  same first target (/medigap, a 249-word Impact-5 pillar). This was the only
  assumption the audit contested. Weights are now re-frozen until Performance
  Mode is ON.
- **Outcome (after recrawl):** n/a — no content changed
