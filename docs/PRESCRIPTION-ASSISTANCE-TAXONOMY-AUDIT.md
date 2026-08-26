# Taxonomy Audit — `CONDITIONS` vs `ASSISTANCE_CATEGORIES`

**Status:** **ADOPTED AND IMPLEMENTED 2026-08-26.** §0–§2 are the audit as
written; §4 records what was actually built. The migration was URL-neutral.
**Date:** 2026-08-26
**Requested:** before Batch 2, so the classification model is settled while only
five medications use the structured architecture.

---

## 0. Headline finding

**These are not two competing versions of the same taxonomy. They are two
different axes, and one of them is mixed.**

- `CONDITIONS` (`src/data/conditions.ts`) is a clean **clinical-condition** axis:
  what the patient has.
- `ASSISTANCE_CATEGORIES` (`src/data/medicationAssistance/categories.ts`) mixes
  **conditions** (Diabetes & Blood Sugar, Heart & Blood Pressure, Cholesterol,
  COPD & Asthma, Lung Disease) with **drug classes** (Blood Thinners, Biologics,
  Weight Management / GLP-1).

That is why they cannot be reconciled by choosing one list. Picking either one
flattens two axes into a single namespace, and the collisions are unavoidable:
Eliquis is *both* a blood thinner (class) and a cardiovascular drug (condition);
Ozempic is *both* a GLP-1 (class) and a diabetes drug (condition).

**The fork is already producing a defect at n=5.** Every structured record
carries both fields, and both are concatenated into one tag array —
`src/components/medication/MedicationAssistancePage.astro:95` and
`src/data/pageIndex.ts:525`:

```js
tags: ['drug-assistance', 'part-d', 'prescription-assistance', ...r.conditions, ...r.categories]
```

`diabetes` and `heart` are keys in **both** lists, so Farxiga's tags today are:

```
drug-assistance, part-d, prescription-assistance, diabetes, heart, kidney, diabetes, heart
```

`diabetes` and `heart` are duplicated. The same duplication exists on Jardiance,
Ozempic and Eliquis. Those tags feed the internal-link engine, so the fork is
not cosmetic.

---

## 1. The seven questions

### Q1. Which categories already have SEO value?

From `data/search-console/queries-2026-07-29.csv` (1,000 query rows), bucketed by
brand name and condition term. **Caveats:** this file predates every Batch 1
page, absolute volume is small, and clicks are zero across all buckets — this is
*directional demand*, not performance.

| Bucket | Queries | Impressions | In `CONDITIONS`? | In `ASSISTANCE_CATEGORIES`? |
| --- | ---: | ---: | --- | --- |
| Biologics / autoimmune (Rinvoq, Dupixent, Humira, Enbrel, Skyrizi) | 81 | 267 | `autoimmune` yes | partial — `biologics` is scoped "Respiratory / Immune" |
| GLP-1 (Ozempic, Wegovy, Trulicity, Rybelsus, Mounjaro) | 61 | 140 | no key | `glp-1` yes |
| Blood thinners (Eliquis, Xarelto, AFib) | 43 | 120 | `blood-clots` yes | `blood-thinners` yes |
| Cholesterol | 16 | 45 | yes | yes |
| Heart (Entresto, blood pressure) | 16 | 28 | yes | yes |
| COPD / asthma (Trelegy, Symbicort) | 12 | 37 | `respiratory` yes | yes |
| Diabetes (non-GLP-1 phrasing) | 4 | 7 | yes | yes |
| Cancer | 0 | 0 | yes | no |
| Kidney | 0 | 0 | yes | no |
| HIV | 0 | 0 | yes | no |
| Bone / osteoporosis | 0 | 0 | yes | no |
| Lung disease (Ofev, pulmonary fibrosis) | 0 | 0 | no key | yes |

**Two findings that matter for the decision:**

1. **The highest-demand bucket is the one the new taxonomy covers worst.**
   Autoimmune/biologic drugs draw more query demand than any other bucket, and
   all of it comes from the **nine legacy pages** (project doc §32).
   `ASSISTANCE_CATEGORIES` has no autoimmune category — its `biologics` entry is
   explicitly scoped "Respiratory / Immune" for asthma and COPD biologics, a
   different set of drugs. A taxonomy built only from the 46-drug list
   under-serves the site's best-performing drug content.
2. **Four `CONDITIONS` keys have zero query demand** (`cancer`, `hiv`, `bone`,
   `kidney`). They remain load-bearing internally — see Q2 — so "zero demand" is
   an argument against making them *browse categories*, not against keeping them
   as classification keys.

### Q2. Which categories are used by existing pages?

| Consumer | Uses | What breaks if the keys change |
| --- | --- | --- |
| `programsForDrug()` — `src/data/drugs.ts:283` | `CONDITIONS` keys | **Correctness.** Nonprofit disease funds are matched to a drug by condition key. A wrong key shows the wrong charitable funds on a medication page. |
| `src/pages/prescription-drug-assistance.astro:22` | `CONDITIONS` | The directory grouping — the page the nav's "All Medications" now points at |
| `src/pages/prescription-drug-assistance.astro:486` | `CONDITIONS` | The finder's condition `<select>` options |
| `src/pages/[drug]-assistance-program.astro:49` | `CONDITION_STYLE[d.conditions[0]]` | Hero colour + icon on all 14 medication pages |
| `src/pages/[drug]-assistance-program.astro:186` | `condLabel()` | "Conditions:" line on every program card |
| `src/components/medication/MedicationAssistancePage.astro:163` | `ASSISTANCE_CATEGORIES` | Hero kicker line on the 5 structured pages only |

`CONDITIONS` is load-bearing in **five** places including one correctness path.
`ASSISTANCE_CATEGORIES` is used for **one visible string** plus tags.

### Q3. Which are used by navigation?

**Neither, as of today.** The Prescription Assistance dropdown is now three fixed
items with no category entries. `CONDITIONS` drives the *directory grouping on
the hub page*, which is where the nav points.

### Q4. Which are used by `FEATURED_DRUGS`?

`CONDITIONS` only. All 14 entries in `src/data/drugs.ts:261` carry
`conditions: ConditionKey[]`. `ASSISTANCE_CATEGORIES` is unknown to
`FEATURED_DRUGS` — it exists only on the 5 structured records.

### Q5. Which are used by internal linking?

**Both, into the same namespace** — the concatenated `tags` array shown in §0.
This is the only place the two taxonomies actually touch, and it is where the
duplicate-key defect lives. 33 `PROGRAMS` entries are also keyed on `CONDITIONS`
values for fund matching.

### Q6. Would changing the taxonomy alter existing URLs?

**No.** No route and no built page URL contains a condition or category key. The
only drug route is `[drug]-assistance-program.astro`, keyed on the medication
slug. Category hub pages do not exist. A taxonomy change is URL-neutral
**today** — which is why it is cheap now and expensive after category hubs ship.

### Q7. Do existing condition hubs depend on the old taxonomy?

**There are no condition hub pages.** What depends on it are the hub page's
directory and finder, the per-drug hero styling, and the fund-matching function
(Q2). No page would 404 or change address; the visible risk is mis-grouped drugs
and mis-matched charitable funds.

---

## 2. Recommendation — two axes, one classification each

**Do not pick a winner between the two lists.** Split them along the seam that
already exists.

**Axis 1 — `conditions` (canonical, load-bearing).** Keep `CONDITIONS` as the
single clinical classification. It carries the correctness dependency, all 14
pages, and 33 program records. Extend it where the 75-drug list needs it
(`weight` for Wegovy/Zepbound is the only clear gap in the confirmed 46).

**Axis 2 — `drugClass` (new, explicit).** The drug-class facts currently smuggled
into `ASSISTANCE_CATEGORIES` get their own small key set: `glp-1`, `sglt2`,
`insulin`, `anticoagulant`, `biologic`. These answer a real visitor question
("my doctor said I'm on a GLP-1") that a condition cannot.

**Browse categories become a view, not a taxonomy.** `ASSISTANCE_CATEGORIES`
survives — as *named groupings defined over the two axes*, not as a third
classification each record must be tagged with:

```ts
{ key: 'glp-1',          label: 'Weight Management / GLP-1', drugClass: ['glp-1'] }
{ key: 'blood-thinners', label: 'Blood Thinners',            drugClass: ['anticoagulant'] }
{ key: 'diabetes',       label: 'Diabetes & Blood Sugar',    conditions: ['diabetes'] }
```

A medication is classified **once per axis** and appears in every browse category
whose definition it satisfies. The spec's rule — "a medication may appear in
multiple categories, one canonical page" (§14) — is preserved, and the
marketing-friendly labels survive intact.

**What this buys:**

- The duplicate-tag defect disappears: `tags` derives from the two axes, and a
  browse category is never a tag.
- Adding a category becomes a naming decision, not a re-tagging pass across 75
  records.
- Records stop carrying two overlapping lists a human must keep in sync.
- Open question §31 #2 ("confirm the canonical category for multi-category
  drugs") largely dissolves — a drug belongs to several browse views because it
  has several facts, not because someone picked wrong.

### Suggested order of work (not started)

1. Add `drugClass` to `MedicationAssistanceRecord`; populate the 5 records.
2. Redefine `ASSISTANCE_CATEGORIES` entries as views over `conditions` /
   `drugClass`; drop `categories: AssistanceCategoryKey[]` from the record type.
3. Fix `tags` to derive from the two axes — removes the duplication.
4. Add an `autoimmune` browse category so the 9 legacy pages are reachable by the
   site's highest-demand bucket.
5. Extend `CONDITIONS` with `weight` only when Wegovy/Zepbound are built.

Steps 1–3 are a single mechanical change across 5 records and 2 call sites while
the inventory is small. After 75 records it is a migration.

---

## 3. What this audit does not decide

- **The category hub URL pattern** (project §31 #3) — still open, still not needed
  until hubs are built.
- **The remaining ~29 medications** (§15.3) — the taxonomy must not be declared
  complete until that list exists; oncology, neurology and ophthalmic drugs would
  each add a condition key.
- **Whether the 9 legacy pages migrate before or after Batch 2** — see project §32.

One incidental observation, recorded and not acted on: the query data includes
`asistencia de eliquis para pacientes de medicare`. Spanish-language assistance
intent already exists in the data. Out of scope here.

---

## 4. As built (2026-08-26)

Approved and implemented. The migration touched data and two call sites; it did
not touch a single URL and did not rewrite page content.

### The model

```
conditions  (data/conditions.ts)                — axis 1, canonical, load-bearing
drugClass   (data/medicationAssistance/drugClasses.ts) — axis 2, new
    ↓ derived, never stored on a record
ASSISTANCE_CATEGORIES  — browse views: categoriesFor(subject)
```

`drugClass` vocabulary, deliberately small: `glp-1`, `sglt2`, `insulin`,
`anticoagulant`, `antiplatelet`, `biologic`, `pcsk9`. A new key is added when a
researched medication needs one, and the class is confirmed against that
medication's label during its research pass (spec §16 Rule 1) — never assigned
from memory to an unresearched drug.

`categoriesFor()` takes anything carrying the axes, so a legacy `Drug` with
`conditions` alone works. View order is **specific before general** — the broad
`heart` view comes last before the `specialty` fallback, so Eliquis reads
"Blood Thinners · Heart & Blood Pressure" rather than the reverse.

### The five migrated records

| Medication | conditions (axis 1) | drugClass (axis 2) | derived categories | taxonomy tags |
| --- | --- | --- | --- | --- |
| Farxiga | diabetes, heart, kidney | sglt2 | diabetes, heart | …, diabetes, heart, kidney, sglt2 |
| Jardiance | diabetes, heart, kidney | sglt2 | diabetes, heart | …, diabetes, heart, kidney, sglt2 |
| Eliquis | blood-clots, heart | anticoagulant | blood-thinners, heart | …, blood-clots, heart, anticoagulant |
| Mounjaro | diabetes | glp-1 | diabetes, glp-1 | …, diabetes, glp-1 |
| Ozempic | diabetes, heart, kidney | glp-1 | diabetes, glp-1, heart | …, diabetes, heart, kidney, glp-1 |

No duplicate tags remain. Previously Farxiga carried `diabetes` and `heart`
twice; a test now fails the build if any record's tags duplicate.

### Classification decisions worth knowing

- **Tirzepatide (Mounjaro) is classed `glp-1`.** It is a dual GIP/GLP-1 receptor
  agonist. A separate `gip-glp-1` key was considered and rejected: it would have
  produced a singleton tag shared with nothing, and would have split Mounjaro
  from Ozempic in tag-based internal linking. The dual mechanism is stated in the
  record's prose, where precision belongs.
- **Ozempic's category kicker gained "Heart & Blood Pressure."** Its record lists
  `heart` among its conditions, so the derived view includes it. This is the only
  visible text change on any of the five pages.
- **`lung-disease` and `autoimmune` are recorded as pending views**
  (`PENDING_CATEGORY_VIEWS`), not deleted. `lung-disease` needs a condition key
  that does not exist yet — the only lung key is `respiratory`, which would drag
  every COPD inhaler into it. `autoimmune` is a directory decision (below).

### The nine legacy medications DO need further taxonomy work

They carry `conditions` only, so `categoriesFor()` classifies them on one axis:

| Legacy drug | conditions | derives to | missing |
| --- | --- | --- | --- |
| Xarelto | blood-clots, heart | heart | `anticoagulant` → misses Blood Thinners |
| Trulicity | diabetes | diabetes | `glp-1` → misses the GLP-1 view |
| Repatha | cholesterol, heart | cholesterol, heart | `pcsk9` (view already correct) |
| Entresto | heart | heart | — correct as-is |
| Humira, Enbrel, Skyrizi, Rinvoq | autoimmune | ~~**specialty** (fallback)~~ → **autoimmune** since §5 | `biologic`/JAK classes (assigned at research time) |
| Dupixent | autoimmune, respiratory | ~~copd-asthma~~ → **autoimmune, copd-asthma** since §5 | `biologic` |

Two things follow, both decisions rather than migration steps:

1. **An `autoimmune` browse view is needed.** Four legacy pages currently fall to
   "Specialty & Other", and this is the site's highest-demand medication bucket
   (§1 Q1).
2. **`drugClass` has no home on a legacy `Drug`.** Either each legacy drug gets a
   researched record (the planned migration path), or `Drug` gains an optional
   `drugClass` so the second axis can be populated ahead of full research.
   Recommendation: the former — a class assigned outside a research pass is a
   fact stated from memory, which spec §16 Rule 1 forbids.


---

## 5. Autoimmune browse view — approved and built (2026-08-26)

Decision 1 from §4 was taken before Batch 2 (project §31 D7). What changed:

- `ASSISTANCE_CATEGORIES` gained `{ key: 'autoimmune', label: 'Autoimmune & Immune Conditions', conditions: ['autoimmune'] }`, placed **before** `copd-asthma` in the canonical order so Dupixent (autoimmune + respiratory) leads with the immune view instead of reading as an inhaler.
- `AssistanceCategoryKey` gained `'autoimmune'`. The entry was removed from `PENDING_CATEGORY_VIEWS` (only `lung-disease` remains pending).
- A test now asserts that **no** `FEATURED_DRUGS` entry derives the fallback view and that the five legacy autoimmune pages derive `autoimmune` as their primary view.

What deliberately did **not** change: the two axes. `CONDITIONS` is untouched; the legacy `Drug` type still has no `drugClass` (decision 2 in §4 stands — a class is assigned only in a research pass, when the drug becomes a `MedicationAssistanceRecord`). Browse categories remain derived views, never stored on a record. Mounjaro stays `glp-1`; a `gip-glp-1` class is revisited only if several dual agonists are researched.

The live view set is now: Diabetes & Blood Sugar · Blood Thinners · Cholesterol · Weight Management / GLP-1 · Biologics (Respiratory / Immune) · Autoimmune & Immune Conditions · COPD & Asthma · Heart & Blood Pressure · Specialty & Other (fallback).
