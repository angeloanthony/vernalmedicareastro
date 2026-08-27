# Vernal Medicare — 75-Drug Prescription Assistance Project

**Status:** Batch 5 shipped (2026-08-26) — **21 medication pages, all structured; the 75-medication expansion has begun** with five new slugs (Rybelsus, Wegovy, Zepbound, Praluent, Leqvio) from the §24 Phase 4 order. `weight` added to `CONDITIONS` (pre-registered by the taxonomy audit). Navigation settled. Taxonomy: two axes + Autoimmune view (D7) + `jak-inhibitor` class, verified against Dupixent's autoimmune+respiratory pair with no third axis introduced. Batches 3 and 4 were built **link-dark** — no links added into the frozen `does-medicare-cover-*` cohort while EXP-003's observation window is open.
**Created:** 2026-08-26
**Last updated:** 2026-08-26 (latest) — **Batch 5 checkpoint recorded: COMPLETE, 21 researched records, architecture PASS, observation window intact, no Batch 6 started; remaining work split into three independent tracks (§32)**; earlier the same day — Batch 5 shipped link-dark (Rybelsus, Wegovy, Zepbound, Praluent, Leqvio; five new slugs, `weight` added to `CONDITIONS`); earlier the same day — Batch 4 shipped link-dark (Dupixent; legacy migration complete, architecture confirmed frozen under D9); earlier the same day — Batch 3 shipped link-dark (Trulicity, Humira, Enbrel, Skyrizi, Rinvoq) plus the two Batch 2 review fixes (Entresto fund naming; the shared FPL source-year note); earlier the same day — Batch 2 shipped (§32 inventory, §31 D7); earlier the same day, Batch 1 review: navigation rule + measurement (§14), current page inventory (§32), decisions log (§31), taxonomy audit split out to `PRESCRIPTION-ASSISTANCE-TAXONOMY-AUDIT.md`
**Owner:** Vernal Medicare

> **Two open items before implementation starts:**
> 1. The full 75-medication list is **not yet final**. 46 medications are confirmed (§15); ~29 remain to be supplied by the user.
> 2. Every program-status claim in this document (fund open/closed, dollar figures, launch dates) is **as-reported and unverified**. Re-verify against the official source before it appears on a published page. See §29 for the snapshot and its caveat.

---

## 0. At a Glance

**Project purpose:** Add a comprehensive prescription-assistance section to VernalMedicare.com featuring 75 high-cost brand medications, with one dedicated page per medication explaining available financial-assistance programs, charitable grants, eligibility, and exactly how to apply.

**Primary audience:** Medicare beneficiaries and their families, particularly people in Vernal, Utah and the Uintah Basin, who are struggling with the cost of an expensive prescription.

**Core customer problem:**

> "I take this medication, but I can't afford it. Is there a grant, assistance program, or other way to reduce what I have to pay?"

The project answers that question directly and practically.

---

## 1. Project Concept

Vernal Medicare will create a new top-level content area focused specifically on help paying for prescription medications.

The project contains:

**Main hub — Prescription Assistance**
A central page explaining the different types of assistance available and directing visitors to individual medication pages.

**Medication directory**
A navigation dropdown or medication directory containing the 75 selected brand-name medications.

**75 individual medication pages**
Every medication receives its own page with:

- Medication name
- Brand/generic information
- What the medication is generally used for
- Why patients may encounter significant prescription costs
- Manufacturer assistance information
- Charitable grant information
- Patient-assistance programs
- Medicare Extra Help information
- Eligibility requirements
- Step-by-step application instructions
- Required documentation
- What the doctor/pharmacy may need to do
- What to do if a program is closed
- Official application/contact information
- Video placeholder
- FAQ
- Related resources
- Local Vernal Medicare assistance CTA

---

## 2. Core SEO Strategy

The project is **not** intended to create 75 generic drug-information pages.

The primary search intent is:

> "How can I get help paying for [drug]?"

Pages target combinations such as:

- `[drug] assistance`
- `[drug] financial assistance`
- `[drug] patient assistance`
- `[drug] grant`
- `[drug] prescription assistance`
- `help paying for [drug]`
- `[drug] grant application`
- `[drug] assistance program`
- `[drug] Medicare cost`
- `[drug] assistance Utah`

Each page should capture multiple related searches with one authoritative page, rather than creating separate thin pages for every keyword variation.

---

## 3. Why We Are Building This

The project originated from a real customer interaction. A person contacted Vernal Medicare because **Farxiga** was too expensive.

That revealed a much more valuable search intent than "What is Farxiga?" The real question is:

> "I have an expensive prescription. Where can I get financial help, and how do I apply?"

The project therefore combines: **SEO + useful information + financial-assistance navigation + local Medicare expertise.**

---

## 4. Medicare Positioning (Precision Required)

The site must be precise about Medicare.

Do **not** say that Original Medicare simply "covers" these outpatient drugs. For most prescription drugs discussed in this project, prescription coverage is generally through:

- Medicare Part D
- Medicare Advantage plans that include Part D

Different insurers have different formularies, tiers, restrictions, deductibles, and cost-sharing.

Therefore these pages are **not** primarily formulary-comparison pages. Formulary information may be mentioned where relevant, but the main purpose is **finding financial assistance**.

---

## 5. Types of Assistance We Will Research

Each medication must be researched independently. A page may contain one or more of these categories.

### A. Manufacturer Patient Assistance

A pharmaceutical company may operate a patient-assistance program for eligible patients. The page should explain:

- Who operates it
- Who may qualify
- Whether Medicare patients are eligible
- What documentation is required
- Whether the doctor must participate
- How to apply
- Official application link
- Official phone number
- Current status

### B. Manufacturer Savings Programs

These must be treated **separately** from patient-assistance programs.

A commercial insurance copay card is **not** automatically available to Medicare beneficiaries. Never tell a Medicare beneficiary to use a manufacturer coupon without verifying the eligibility rules.

The page must clearly distinguish **savings card / copay program** from **patient assistance program**, and explain Medicare restrictions when applicable.

**The specific hazard on a Medicare site:** many manufacturer copay cards are for commercially insured patients and explicitly exclude Medicare and Medicaid. Patient Advocate Foundation notes that manufacturer patient-assistance programs operate under different rules, and that federal regulations generally prevent manufacturers from providing direct support to people enrolled in federally funded insurance programs such as Medicare, with limited exceptions.

So a manufacturer savings card and a manufacturer patient assistance program are **not the same thing**, and the difference is exactly what our audience gets wrong. Do not send a Medicare beneficiary to an ordinary savings card.

### C. GLP-1 / weight-management caveat

The Medicare GLP-1 access landscape is changing during 2026 and into 2027. Lilly has stated its **Medicare GLP-1 Bridge** arrangement began **July 1, 2026** for certain medicines, with additional changes planned for 2027 (as reported — verify).

Any GLP-1 page (Mounjaro, Ozempic, Wegovy, Zepbound, Rybelsus, Trulicity, Victoza) therefore carries **higher maintenance risk** than the rest of the set. Build them, but expect to re-verify them more often, and never let a GLP-1 page state a coverage arrangement without a source and a date.

---

## 6. Charitable Grants

One of the most important parts of the project. Potential organizations include:

- HealthWell Foundation
- Patient Advocate Foundation / TotalAssist
- Other legitimate disease-specific charitable foundations
- Other verified nonprofit assistance organizations

**Never assume a grant exists simply because a drug is listed somewhere.**

A fund can:

- Be open
- Be closed to new patients
- Reopen later
- Have limited funding
- Apply only to a particular diagnosis
- Apply only to certain insurance types
- Have income requirements
- Cover only certain expenses

Every page must clearly distinguish:

> *Medication is included in a program*

from:

> *The program is currently accepting new applications*

**Those are not the same thing.**

---

## 7. TotalAssist

TotalAssist is an important component of the 2026 project.

Patient Advocate Foundation launched TotalAssist on **July 1, 2026**, replacing its previous new-grant process. TotalAssist provides financial assistance through disease-specific and health-equity funds and may help eligible patients with expenses including medication copays, coinsurance, and deductibles.

Current program information should always be checked before publishing or updating a medication page.

Use TotalAssist's medication/fund information as **one research source**, not as a blanket statement that every medication qualifies for a grant.

**Why TotalAssist matters most for this project (as reported — verify):**

- It reportedly covers nearly 150 serious and chronic conditions.
- Grants may help with eligible medication copays, coinsurance, deductibles, and other healthcare expenses.
- It maintains an **actual medication index**, which lets us build drug-specific pages from verified current listings rather than guessing.
- It offers **fund notifications** — a waitlist a visitor can join to be told when a closed fund reopens. This is the single most useful thing to give someone whose fund is closed (see §10, Step 7).
- Its application information needs reportedly include: diagnosis, medication, provider information, insurance information, contact information, and household income.

The TotalAssist medication index should be the **first** research stop for every one of the 75 medications.

---

## 8. HealthWell Foundation

HealthWell allows patients to search for assistance by medication or diagnosis. However, HealthWell funds can be closed to new patients and may reopen depending on funding.

Pages should include language such as:

> Funding availability changes. A medication may appear in an assistance database even when the applicable fund is currently closed to new applicants. Check the program's current status before applying.

This principle applies to **every** assistance organization.

**Reported status at the time of writing (verify before publishing):**

- The **Type 2 Diabetes** fund is closed to new patients.
- The **Asthma** fund is closed to new patients. Its medication list reportedly includes Trelegy, Symbicort, Spiriva, Nucala, Xolair, and Tezspire, among others.

Closed funds are still worth documenting — HealthWell explicitly states funds can reopen when funding becomes available. But a closed fund is exactly why our pages say *"check current availability"* rather than *"a grant is available."* This is the clearest real-world case for the §6 distinction.

**Do not add a HealthWell section to a page just to make the pages look uniform.** If HealthWell doesn't cover that drug, the page doesn't get a HealthWell section.

---

## 9. Medicare Extra Help

Every medication page should contain a dedicated section:

**"Could Medicare Extra Help Reduce Your Prescription Costs?"**

Extra Help is not a grant for a particular medication. It is a Medicare program that can reduce qualifying beneficiaries' Part D prescription costs.

The section should explain:

- What Extra Help is
- Who may qualify
- Income/resource eligibility
- What costs it can reduce
- How to apply
- Where to apply
- Official Medicare/Social Security resources

Link to the official Medicare/Social Security application information rather than reproducing an application.

This section matters because a person who cannot obtain a charitable grant may still have another legitimate path to lower prescription costs. It is the **most reliably useful section on the whole page** — a charitable fund may be closed, but Extra Help eligibility does not depend on fund balances.

**2026 figures (as reported — verify against the current Medicare publication before publishing):**

- Qualifying beneficiaries pay **$0** for the Part D premium and deductible.
- Generally **no more than $12.65** for a covered brand-name drug.
- Application route is through **Social Security**; the 2026 Medicare publication lists the current income/resource limits.

Every page frames this as a question, not a promise:

> **Could you qualify for Medicare Extra Help?**

Dollar figures are year-specific. When the 2027 numbers publish, they change in **one** place in the data layer (§17), not in 75 pages.

---

## 10. Standard Application Guide

Every medication page contains a **medication-specific** version of "How to Apply for Assistance."

**Step 1 — Search for the medication.** Enter the medication name into the assistance organization's medication/fund search. HealthWell allows searching by **medication or diagnosis** — if the drug name returns nothing, the diagnosis may still match a fund.

**Step 2 — Check whether the fund is open.** This is the crucial step. A medication can be listed while the fund is temporarily closed to new applicants. HealthWell states funds can reopen when funding becomes available. **Do not assume that *listed* means *open*.**

**Step 3 — Check eligibility.** Depending on the program this may include: medication, diagnosis, insurance, Medicare status, income, household size, residency, treatment location, prescriber requirements.

**Step 4 — Gather documentation.** Potentially: Medicare card, insurance information, Part D / Medicare Advantage information, medication name, dosage, prescription information, doctor information, pharmacy information, diagnosis information, household income, financial documentation.

**Step 5 — Complete the application.** Explain which sections are completed by the patient, physician, pharmacy, or other authorized party when applicable.

**Step 6 — Wait for determination.** Explain what the applicant should expect after submitting.

**Step 7 — If the fund is closed or the application is denied — don't stop.** Tell the visitor to:

- Join the **notification list / waitlist** if the organization offers one (TotalAssist currently offers fund notifications for people who want to know when a fund opens)
- Check another charitable organization
- Check **Medicare Extra Help**
- Ask their doctor's office — many practices have staff who do this routinely
- Check the manufacturer's current patient-assistance resources (not a savings card — see §5B)

Step 7 is critical. The visitor should never be left with "Sorry, the grant is closed." Instead: *here are the next five places to check.*

---

## 11. Every Drug Gets Its Own Instructions

**Fundamental project rule.** We are not creating one generic assistance article and swapping the medication name.

The Farxiga page may have one set of assistance programs and application instructions. Eliquis may have different programs. Mounjaro may have different programs. Ofev may have completely different assistance resources.

**Every medication must be researched independently.** Never infer that a program applies to a drug merely because it applies to another medication in the same therapeutic category.

### The honest negative

If a medication has no currently open charitable grant, **we do not manufacture one.** The page says something like:

> We could not identify a currently open charitable grant specifically covering this medication. However, you may have other options, including manufacturer patient assistance, Medicare Extra Help, or assistance based on your diagnosis.

This makes the site **more** trustworthy, not less — and it is the reason a visitor will come back and call.

The corollary: **pages are not required to look identical.** If HealthWell doesn't cover a drug, that page has no HealthWell section. Sections appear because they are true, not because the template has a slot for them. A page with three real programs beats a page with three real programs and two padded ones.

---

## 12. Video Component

Every medication page contains a dedicated video frame. Videos will be produced later.

For now, the page contains a polished placeholder:

> **How to Apply for [Medication] Assistance**
> *Video coming soon*

The video component must be designed so a future video can be inserted without redesigning the page.

The written instructions must remain complete without the video. The video is supplemental, not the primary source of critical information.

---

## 13. Page Structure

Every medication page follows a consistent architecture.

**Hero**
`[Drug] Assistance Programs & Grants` — short explanation of the problem. Example: *"Having trouble paying for Farxiga? Learn about financial assistance programs, charitable grants, Medicare assistance and how to apply."*
Include: `Last verified: [Month Year]`

**Video** — large video frame: "How to Apply for [Drug] Assistance"

**Quick Answer** — a prominent summary explaining:
- Whether assistance may exist
- Major assistance categories
- Important eligibility limitations
- Whether current programs are open/closed

**Assistance Programs** — individual cards/sections for manufacturer assistance, charitable grants, TotalAssist, HealthWell, other verified programs, Medicare Extra Help. *Only include programs that actually apply to the medication.*

**How to Apply** — medication-specific step-by-step instructions.

**What You'll Need** — checklist of documentation.

**If the Program Is Closed** — alternative options.

**Medicare Extra Help** — standardized but current information.

**Video** — if desired, the video can appear earlier on the page, with the written guide remaining underneath.

**Frequently Asked Questions** — specific to that medication. Examples:
- Can Medicare help pay for [Drug]?
- Is there a [Drug] patient assistance program?
- Can Medicare beneficiaries receive [Drug] assistance?
- How do I apply?
- What income qualifies?
- What happens if the grant is closed?
- Can my doctor's office apply for me?
- Can I use manufacturer coupons with Medicare?

*Only answer questions that can be accurately supported.*

**Local Help** — a Vernal Medicare CTA. Example: *"Having trouble figuring out your prescription costs? If you live in Vernal or the Uintah Basin, Vernal Medicare can help you understand your Medicare prescription coverage and where to look for assistance."* Then: Call / Text / Get Help.

**The site should never imply that Vernal Medicare approves grants.**

---

## 14. The 75-Medication Directory

The site has a **Prescription Assistance** navigation item giving access to the
complete medication directory. The directory itself lives on the hub page — it
is **not** in the navigation.

> **RULE (decided 2026-08-26): the navigation never lists individual medications.**
> The dropdown is fixed-size. It has the same three entries whether the site has
> 5 medication pages or 75. The directory is generated from the medication
> registry, so a new record appears in it automatically.
>
> This rule exists because the first version broke it: the dropdown hand-listed
> five drug names while **fourteen** medication pages were live, so nine pages
> were unreachable from the navigation (§32). Hand-maintained lists in
> `navigation.ts` drift from the inventory — that is what the rule prevents.

**Shipped navigation (interim, 2026-08-26):**

```
Prescription Assistance ▾
  → Help Paying for Prescription Drugs   (hub)
  → All Medications                      (→ hub #all-medications, the directory)
  → Medicare Extra Help
```

**Target navigation** — identical in size and shape; category entries are added
only once real category pages exist (§31 #3). No thin category pages before then:

```
Prescription Assistance ▾
  → Help Paying for Prescription Drugs   (hub)
  → All Medications A–Z                  (directory)
  → Diabetes & Blood Sugar
  → Heart, Cholesterol & Blood Thinners
  → COPD, Asthma & Lung
  → Weight Management / GLP-1
  → Specialty & Other
  → Medicare Extra Help
```

**Preferred UX — two ways to find a drug.** A giant alphabetical list with no context is bad UX. The directory should support both:

1. **Search by medication** — type the name, land on the page. *Already exists:*
   site-wide Pagefind search at `/medicare-search.html`, plus the hub page's own
   medication finder. Nothing new to build.
2. **Browse by category** — for the visitor who knows their condition but not which of their drugs is the expensive one. *Today:* the hub's condition-grouped directory at `#all-medications`.

### Navigation measurement (2026-08-26)

Measured with a throwaway Playwright script against `dist/`, on
`/prescription-drug-assistance.html` (the homepage has an unrelated
reviews-carousel overflow that contaminates document-level readings). Nothing was
installed into this project — an existing machine-level Playwright was used.
Widths are the right edge the nav row requires; the header container caps at
1600px.

| Nav CSS | Top-level items | 1280 | 1366 | 1440 | 1536 | 1600 |
| --- | --- | --- | --- | --- | --- | --- |
| Original (`nowrap`) | 8 (with Home) | overflow, needs 1690 | overflow | overflow | overflow | overflow |
| Original (`nowrap`) | 7 (Home removed) | overflow, needs 1588 | overflow | overflow | overflow | fits |
| Shipped (wrap rule) | 8 (with Home) | 2 rows, no overflow | 2 rows | 2 rows | 2 rows | 1 row |
| Shipped (wrap rule) | 7 (Home removed) | 2 rows, no overflow | 2 rows | 2 rows | **1 row** | 1 row |

**Conclusions.**

1. The `nowrap` bar overflowed at **every tested width up to 1600px even with 8
   items removed down to 7** — the pre-existing bug was real and larger than
   assumed (1690px required, not 1600px).
2. **Removing "Home" does not fix 1280 or 1366.** It only lowers the single-row
   threshold from 1600px to 1536px. Per the stated condition — "if removing Home
   solves the 1280/1366 layout problem, great; if it doesn't, we need a different
   solution" — **Home was left in place and the top-level bar was not changed.**
3. The shipped wrap rule does prevent header overflow at all tested widths. It
   stays as-is. No additional global CSS was written.
4. Mobile (390px): the vertical menu, where every dropdown renders expanded, was
   **2,152px** tall with the five drug names and is **1,897px** after removing
   them. More importantly it is now fixed-size with respect to the medication
   inventory — under the old scheme, 75 medications would have added roughly
   3,500px of scroll.

### Category taxonomy

| Category | Examples |
| --- | --- |
| Diabetes & Blood Sugar | Farxiga, Jardiance, Mounjaro, Ozempic, Trulicity, Rybelsus, Januvia, Invokana, Inpefa, insulins |
| Heart & Blood Pressure | Entresto, Vyndamax, Ranexa, Inpefa |
| Blood Thinners | Eliquis, Xarelto, Pradaxa, Savaysa, Brilinta |
| Cholesterol | Repatha, Praluent, Leqvio, Nexletol, Nexlizet, Vascepa |
| COPD & Asthma | Trelegy, Breztri, Symbicort, Spiriva, Breo Ellipta, Anoro Ellipta, Stiolto, Incruse Ellipta, Daliresp, Yupelri |
| Lung Disease | Ofev |
| Biologics (respiratory/immune) | Dupixent, Nucala, Xolair, Tezspire |
| Autoimmune & Immune Conditions | Humira, Enbrel, Skyrizi, Rinvoq, Dupixent (view added 2026-08-26, D7) |
| Weight Management / GLP-1 | Mounjaro, Ozempic, Wegovy, Zepbound |
| Specialty & Other | Remaining medications |

Some medications legitimately belong to more than one category (Mounjaro and Ozempic in both Diabetes and GLP-1; Repatha in both Heart and Cholesterol; Inpefa in both Diabetes and Heart). **A medication may appear in multiple categories — but only one canonical page and one canonical URL.** Categories are navigation, not content duplication.

The final decision should be based on the existing site's navigation and mobile behavior. Goal: **a visitor should be able to find their medication in seconds.**

> Note: the current header is 6 topic-hub dropdowns; Prescription Assistance would be added as a hub, with categories as children and the medication directory beneath.

---

## 15. Medication Selection

The project contains **75 brand medications**. The earlier 30-drug ranking was a *priority sample*, not the list — it must not be treated as limiting the project.

**Confirmed so far: 46 of 75.** The remaining ~29 must be supplied by the user. The implementation must **not** invent or substitute medications to reach 75.

### 15.1 Confirmed medications by category (46)

**Diabetes & GLP-1 (11)**

| # | Brand | Generic |
| --- | --- | --- |
| 1 | Farxiga | dapagliflozin |
| 2 | Jardiance | empagliflozin |
| 3 | Mounjaro | tirzepatide |
| 4 | Ozempic | semaglutide |
| 5 | Trulicity | dulaglutide |
| 6 | Rybelsus | semaglutide |
| 7 | Januvia | sitagliptin |
| 8 | Invokana | canagliflozin |
| 9 | Inpefa | sotagliflozin |
| 10 | Wegovy | semaglutide |
| 11 | Zepbound | tirzepatide |

**Heart, Cholesterol & Blood Thinners (14)**

| # | Brand | Generic |
| --- | --- | --- |
| 12 | Eliquis | apixaban |
| 13 | Xarelto | rivaroxaban |
| 14 | Entresto | sacubitril/valsartan |
| 15 | Repatha | evolocumab |
| 16 | Praluent | alirocumab |
| 17 | Leqvio | inclisiran |
| 18 | Nexletol | bempedoic acid |
| 19 | Nexlizet | bempedoic acid/ezetimibe |
| 20 | Brilinta | ticagrelor |
| 21 | Vyndamax | tafamidis |
| 22 | Pradaxa | *verify at research* |
| 23 | Savaysa | *verify at research* |
| 24 | Ranexa | *verify at research* |
| 25 | Vascepa | *verify at research* |

**COPD, Asthma & Respiratory (15)**

| # | Brand | Generic |
| --- | --- | --- |
| 26 | Trelegy | fluticasone/umeclidinium/vilanterol |
| 27 | Breztri | budesonide/glycopyrrolate/formoterol |
| 28 | Symbicort | budesonide/formoterol |
| 29 | Spiriva | tiotropium |
| 30 | Ofev | nintedanib |
| 31 | Dupixent | dupilumab |
| 32 | Xolair | omalizumab |
| 33 | Nucala | mepolizumab |
| 34 | Tezspire | tezepelumab |
| 35 | Breo Ellipta | *verify at research* |
| 36 | Anoro Ellipta | *verify at research* |
| 37 | Stiolto | *verify at research* |
| 38 | Incruse Ellipta | *verify at research* |
| 39 | Daliresp | *verify at research* |
| 40 | Yupelri | *verify at research* |

**Insulin & Injectable Diabetes Products (6)**

| # | Brand | Generic |
| --- | --- | --- |
| 41 | Lantus | *verify at research* |
| 42 | Tresiba | *verify at research* |
| 43 | Toujeo | *verify at research* |
| 44 | NovoLog | *verify at research* |
| 45 | Lyumjev | *verify at research* |
| 46 | Victoza | *verify at research* |

Generic names marked *verify at research* were not supplied with the list. They are well-known, but per §16 Rule 1 they get confirmed against an official source during that medication's research pass rather than filled in from memory.

### 15.2 Alphabetical index (46 confirmed)

Anoro Ellipta · Breo Ellipta · Breztri · Brilinta · Daliresp · Dupixent · Eliquis · Entresto · Farxiga · Incruse Ellipta · Inpefa · Invokana · Januvia · Jardiance · Lantus · Leqvio · Lyumjev · Mounjaro · Nexletol · Nexlizet · NovoLog · Nucala · Ofev · Ozempic · Pradaxa · Praluent · Ranexa · Repatha · Rybelsus · Savaysa · Spiriva · Stiolto · Symbicort · Tezspire · Toujeo · Trelegy · Tresiba · Trulicity · Vascepa · Victoza · Vyndamax · Wegovy · Xarelto · Xolair · Yupelri · Zepbound

### 15.3 Outstanding — ~29 medications

The remaining medications have not been supplied. When the user provides them, this section is updated to the **complete deduplicated, alphabetized, numbered master list of 75**, and that becomes the single source of truth for the build.

Candidate gaps worth considering when the list is finalized (not approved, not assumed): additional insulins, oral oncology, autoimmune/biologic therapies, neurology, and ophthalmic drugs — all common among Medicare beneficiaries and all high-cost. **This is a prompt for the user's decision, not a proposed list.**

---

## 16. Research Rules

The most important operating section.

**Rule 1 — Use official sources first.** Prioritize the manufacturer's official assistance program, Medicare.gov, Social Security (Extra Help), HealthWell Foundation, Patient Advocate Foundation / TotalAssist, and other established nonprofit assistance organizations. Avoid relying on random coupon websites or affiliate sites as authoritative sources.

**Rule 2 — Verify current status.** Every assistance program must be checked for current availability, eligibility, Medicare eligibility/exclusion, income requirements, diagnosis requirements, insurance requirements, and application procedure.

**Rule 3 — Never guarantee assistance.** Do not write "You can get a grant." Write "You may qualify for assistance if you meet the program's requirements."

**Rule 4 — Never fabricate a program.** If no verified assistance program exists, say so — then provide the legitimate alternatives that actually are available.

**Rule 5 — Never confuse manufacturer programs.** Clearly distinguish commercial copay card / patient assistance program / charitable grant / Medicare Extra Help.

**Rule 6 — Preserve dates.** Each page needs `Assistance information last verified: August 2026` (or the actual month/year verified).

---

## 17. Data Architecture

Do **not** hard-code all 75 pages independently. Create structured medication data.

Each medication record should contain fields such as:

| Field | Purpose |
| --- | --- |
| `brandName` | Brand name |
| `genericName` | Generic / active ingredient |
| `manufacturer` | Manufacturer |
| `category` | Therapeutic category |
| `description` | What the medication is used for |
| `assistancePrograms` | All applicable programs |
| `manufacturerAssistance` | Manufacturer patient-assistance details |
| `charitablePrograms` | Verified charitable funds |
| `totalAssist` | TotalAssist findings |
| `healthWell` | HealthWell findings |
| `extraHelp` | Extra Help section data |
| `eligibility` | Eligibility requirements |
| `applicationSteps` | Medication-specific steps |
| `documentsNeeded` | Documentation checklist |
| `applicationUrl` | Official application link |
| `phone` | Official phone |
| `programStatus` | Open / closed / limited |
| `lastVerified` | Verification date |
| `officialSources` | Source URLs |
| `videoPlaceholder` | Video frame data |
| `relatedMedications` | Internal links |

The implementation may use whatever structure fits the existing Vernal Medicare architecture. The principle: **content/data separated from presentation whenever practical**, which makes future updates dramatically easier.

---

## 18. Source Tracking

Every assistance claim should have a source. For example:

```
Program:      HealthWell
Status:       Closed to new patients
Last checked: August 26, 2026
Source:       Official HealthWell page
```

This allows the team to update the page later without rediscovering where every claim came from.

---

## 19. Maintenance

This is not a "publish once and forget" project. Assistance programs change. Funds open and close. Eligibility changes. Manufacturers change programs. Medicare rules change annually.

Therefore: **every medication page needs a verification date**, and the project should maintain a centralized medication-assistance data registry. This is one of the strongest arguments for structured data.

---

## 20. SEO Architecture

```
Vernal Medicare
└── Prescription Assistance  ("Help Paying for Prescription Drugs in Utah")
    ├── Medication Directory (searchable, all 75)
    ├── Diabetes & Blood Sugar
    │   ├── Farxiga Assistance
    │   ├── Jardiance Assistance
    │   ├── Mounjaro Assistance
    │   └── …
    ├── Heart & Blood Pressure
    ├── Blood Thinners
    │   ├── Eliquis Assistance
    │   └── …
    ├── Cholesterol
    ├── COPD & Asthma
    ├── Lung Disease
    ├── Weight Management / GLP-1
    └── Specialty & Other
```

Category pages are hubs. Each medication has exactly **one** canonical page even when it appears under two categories (§14).

Each drug page should link naturally to:

- Prescription Assistance hub
- Medicare Extra Help
- Prescription cost calculator
- Formulary lookup
- Part D information
- Relevant related medications
- Relevant condition/assistance pages
- Local Medicare help

The hub links to all medication pages. This creates a clear internal-linking cluster.

---

## 21. SEO Titles and URLs

Avoid "Best" in titles, H1s, URLs, breadcrumbs, anchor text, FAQs, and marketing copy. Use descriptive search language.

**URL:** `/farxiga-assistance-grants-utah`
**Title:** Farxiga Assistance & Grants: How to Apply in Utah
**H1:** Farxiga Assistance Programs & Grants in Utah
**Meta description:** *Learn how to find financial assistance for Farxiga, including patient assistance programs, charitable grants and Medicare Extra Help.*

**Not** `/farxiga` — too generic, and it communicates no intent. **Not** "Get a Farxiga Grant" — the visitor may or may not qualify, and that title promises an outcome we cannot deliver. The title says *how to apply*; the page never says *you will receive*.

That one page naturally captures: `Farxiga assistance` · `Farxiga financial assistance` · `Farxiga grant` · `Farxiga patient assistance` · `help paying for Farxiga` · `Farxiga Medicare cost` · `Farxiga prescription assistance` · `Farxiga assistance Utah` · `Farxiga grant application`.

**Standard framing paragraph** — a version of this belongs near the top of every page:

> Financial assistance may be available through charitable foundations, manufacturer programs, Medicare's Extra Help program, or other assistance resources. Availability and eligibility change frequently.

Accurate and safe. The exact title/URL pattern is locked once the Farxiga page is approved.

### Internal link chain

Every medication page links back through:

```
Prescription Assistance in Utah
  → Medicare Extra Help
  → Part D plans
  → Formulary Lookup
  → Prescription Cost Calculator
  → Contact Vernal Medicare
```

---

## 22. Compliance

The project is a financial-assistance **information resource**, not a promise of financial assistance.

- Do not guarantee approval.
- Do not guarantee a grant is available.
- Do not imply Vernal Medicare administers the grant.
- Do not misrepresent Medicare coverage.
- Do not imply a manufacturer endorses Vernal Medicare.
- Use official application links.
- Keep program status current.
- Clearly identify third-party organizations.
- Do not alter official application requirements.

---

## 23. Video Strategy

Videos are created after the written pages are established. The initial page needs only the visual frame.

Later, each medication can receive a short instructional video — *"How to Apply for Farxiga Assistance"* — walking through:

- Where to start
- How to check eligibility
- What documents are needed
- How to complete the application
- What happens after applying
- What to do if the program is closed

The video complements the page and may improve engagement, but the page must remain fully useful without it.

---

## 24. Production Workflow

**Phase 1 — Architecture.** Build: Prescription Assistance navigation, medication directory, medication page template, video placeholder component, assistance-program components, application-step component, FAQ component, source/verification component, data structure. *Do not populate all 75 yet.*

**Phase 2 — One complete medication.** Build **Farxiga** completely. This becomes the reference implementation. Verify: visual design, SEO, mobile, links, accessibility, schema, sources, assistance accuracy, application instructions, video frame, internal linking.

**Phase 3 — First batch of 10.** Then **watch Search Console before continuing.**

| # | Medication | Category |
| --- | --- | --- |
| 1 | Farxiga | Diabetes |
| 2 | Jardiance | Diabetes |
| 3 | Eliquis | Blood thinner |
| 4 | Mounjaro | Diabetes / GLP-1 |
| 5 | Ozempic | Diabetes / GLP-1 |
| 6 | Entresto | Heart |
| 7 | Xarelto | Blood thinner |
| 8 | Repatha | Cholesterol |
| 9 | Trelegy | COPD/asthma |
| 10 | Breztri | COPD |

Run the full validation/build suite. Look for: duplicate content, broken links, missing sources, inconsistent terminology, incorrect assistance claims, mobile navigation, page speed, schema, sitemap, internal links.

**Phase 4 — Second batch of 10.**

Trulicity · Rybelsus · Wegovy · Zepbound · Praluent · Leqvio · Nexletol · Symbicort · Spiriva · Ofev

**Phase 5 — Expand on evidence, not on inventory.** Extend into the longer-tail medications based on **actual impressions, clicks, and customer questions** — not by publishing everything in advance. The remaining medications still each need independent research.

### Build categories in this order

**Diabetes first.** It is the strongest category for this audience: the TotalAssist medication index for Type 2 diabetes is enormous (reportedly including Farxiga, Jardiance, Mounjaro, Ozempic, Rybelsus, Trulicity, and multiple insulin products), and HealthWell has a Type 2 Diabetes fund — currently reported closed to new patients, which is precisely the case our "check current availability" framing exists for.

**Cardiovascular second.** Older Medicare beneficiaries encounter Eliquis, Entresto, and Xarelto far more often than most specialty drugs. TotalAssist reportedly includes many of them in cardiovascular funds.

**Respiratory third.** Excellent local Medicare topic; both TotalAssist and HealthWell reportedly list many COPD/asthma treatments.

### A note on scope

75 pages is the project. But the winning strategy is **not** "a page for every expensive drug." It is authoritative, current, application-focused assistance guides for the medications most relevant to Medicare beneficiaries, expanded on real demand. Phases 3–5 exist so the 75 arrive as 75 *good* pages rather than 75 published at once.

---

## 25. Definition of Done

A medication page is not finished simply because it builds. A completed page has:

- [ ] Correct medication
- [ ] Correct generic name
- [ ] Accurate medication description
- [ ] Current manufacturer information
- [ ] Current assistance programs
- [ ] Current charitable programs
- [ ] TotalAssist checked
- [ ] HealthWell checked where relevant
- [ ] Medicare Extra Help section
- [ ] Correct application instructions
- [ ] Correct eligibility information
- [ ] Required documentation
- [ ] Official application links
- [ ] Official phone/contact information
- [ ] Program status
- [ ] Last verified date
- [ ] Video placeholder
- [ ] FAQ
- [ ] Related resources
- [ ] Local Vernal Medicare CTA
- [ ] Internal links
- [ ] SEO title
- [ ] Meta description
- [ ] Canonical URL
- [ ] Schema where appropriate
- [ ] Accessibility check
- [ ] Mobile check
- [ ] Build passes
- [ ] Tests pass
- [ ] No forbidden "Best" language
- [ ] No unsupported claims

---

## 26. What We Are NOT Doing

This project is **not**:

- A list of drug prices
- A guarantee of grants
- A manufacturer coupon site
- A replacement for a doctor or pharmacist
- A replacement for Medicare.gov
- A formulary database
- A promise that every medication has assistance
- 75 copies of the same article
- A page designed solely to manipulate Google rankings

It **is**: a practical prescription-assistance resource that helps Medicare beneficiaries understand where financial help may be available and how to apply.

---

## 27. Overall Goal — The User Journey

```
Google
  ↓  "How can I get help paying for Farxiga?"
Vernal Medicare — Farxiga Assistance
  ↓  Quick answer
  ↓  Video / written instructions
  ↓  Available assistance programs
  ↓  How to apply
  ↓  Medicare Extra Help
  ↓  What to do if the program is closed
  ↓  Prescription cost / Medicare resources
  ↓  Local Vernal Medicare assistance
```

---

## 28. Final Implementation Direction

> Build a scalable Prescription Assistance section for VernalMedicare.com containing 75 approved brand medications. Create a medication directory accessible from the site's navigation and create one dedicated page per medication. Each page must contain independently researched, current, medication-specific financial-assistance information, including manufacturer patient-assistance programs, legitimate charitable grants, TotalAssist, HealthWell where applicable, Medicare Extra Help, eligibility requirements, documentation requirements, detailed application instructions, official application/contact links, program status and a last-verified date. Each page must include a dedicated video frame for a future instructional video. Do not assume an assistance program applies to a medication merely because it applies to another drug. Never guarantee eligibility or grant approval. Do not confuse commercial copay cards with patient-assistance programs or charitable grants. Use official sources wherever possible. Build the system as structured reusable data/components rather than 75 independently hard-coded page implementations. The first complete medication should establish the reference implementation before scaling to all 75.

**Farxiga is the first reference page**, because that is the medication that generated the real customer request that started this project.

Once that page is correct, the remaining 74 medications can be supplied for large-scale implementation.

---

## 29. Program Status Snapshot — As Reported, Unverified

Everything in this table came from planning discussion, **not** from a check against the official source. It is recorded here so the first research pass knows what to confirm or correct. **No item below may appear on a published page until it has been verified and dated.**

| Item | As reported | Must verify |
| --- | --- | --- |
| TotalAssist launch | July 1, 2026; replaced PAF's previous new-grant process | Launch date, scope |
| TotalAssist coverage | ~150 serious and chronic conditions | Current count |
| TotalAssist features | Medication index; fund notification/waitlist | Both still offered |
| HealthWell Type 2 Diabetes fund | Closed to new patients | Current status |
| HealthWell Asthma fund | Closed to new patients | Current status |
| HealthWell Asthma medication list | Trelegy, Symbicort, Spiriva, Nucala, Xolair, Tezspire, others | Per-drug listing |
| Extra Help 2026 premium/deductible | $0 for qualifying beneficiaries | Current publication |
| Extra Help 2026 brand-name drug | Generally no more than $12.65 | Current publication |
| Extra Help application route | Social Security | Current route |
| Lilly Medicare GLP-1 Bridge | Began July 1, 2026; further changes planned 2027 | Terms, which medicines, current status |
| Manufacturer copay cards | Generally exclude Medicare/Medicaid under federal rules, limited exceptions | Per-manufacturer |

**Fund status is the most perishable data in this project.** A status recorded here in August 2026 may be wrong by the time the page publishes. That is the entire reason §6, §8, and §10 Step 2 exist.

---

## 30. Division of Responsibility

| Who | Provides |
| --- | --- |
| **User** | The approved 75-medication list and any per-medication requirements. Source of truth — see §15.3. |
| **Research pass** | Verified assistance/application research and the page specification for each medication, against official sources (§16). |
| **Implementation** | The 75 pages, category hubs, directory, navigation, video frames, SEO, schema, internal links, and validation. |

The implementation phase does **not** start from the 30-drug priority sample. It starts from the user's actual 75-drug list.

---

## 31. Decisions and Open Questions

### Decided (2026-08-26, Batch 1 review)

| # | Decision |
| --- | --- |
| D1 | **Medication URLs stay as they are** — `/<slug>-assistance-program.html`. No renames, no redirects. Batch 1 rebuilt the existing canonical pages in place; no duplicate URLs were created. |
| D2 | **No "Utah" suffix in medication URLs.** Local intent is carried by the `<title>`, H1, body copy, schema, internal links and CTA — not by the slug. (Closes former open question #5.) |
| D3 | **No category hub pages yet.** They are worth building, but not at 14 medications — thin category pages are worse than no category pages. Revisit at roughly 25+. |
| D4 | **The navigation never lists individual medications** (§14). Fixed-size dropdown; the directory lives on the hub page and is generated from the registry. |
| D5 | **The top-level nav bar is unchanged.** Measurement showed removing "Home" does not fix 1280/1366 (§14), so it was left alone and no further global CSS was written. |
| D6 | **Two-axis medication taxonomy adopted and implemented.** `conditions` (canonical, load-bearing) + new `drugClass`; `ASSISTANCE_CATEGORIES` retired as a record-level taxonomy and rebuilt as derived views. URL-neutral. See `docs/PRESCRIPTION-ASSISTANCE-TAXONOMY-AUDIT.md` §4. |
| D7 | **Autoimmune & Immune Conditions browse view added** (approved 2026-08-26, before Batch 2). A derived view over the existing `autoimmune` condition key — not a new axis, no change to `CONDITIONS`, no `drugClass` on the legacy `Drug` type. The five legacy autoimmune pages (Humira, Enbrel, Skyrizi, Rinvoq, Dupixent) no longer fall to "Specialty & Other". Legacy drugs still gain `drugClass` only when converted to a researched record. Mounjaro stays `glp-1`. See taxonomy audit §5. |

| D8 | **Link-dark discipline holds until the EXP-003 observation window actually closes** (approved 2026-08-26, Batch 3 checkpoint). New assistance pages may link to each other and to the shared hubs, but nothing is added to the frozen `does-medicare-cover-*` cohort — treated or control — while the window is open. **Do not "clean up" the internal links early just because the pages are ready.** After the window closes, the linking pass is performed deliberately and logged as its OWN intervention, so the experiment has a clean before/after rather than a muddied one. |
| D9 | **The record architecture is treated as established; no further architectural changes without a demonstrated defect** (approved 2026-08-26, Batch 3 checkpoint). Fifteen records have now exercised eight drug classes (SGLT2, GLP-1, anticoagulant, ARNI, PCSK9, triple inhaler, biologic, JAK inhibitor) and every assistance situation the model was built for: open manufacturer PAPs, a PAP closed to new patients for one drug while open for its shelf-mates (Humira), self-pay pricing, commercial-only copay cards, charitable funds open / closed / not-found, and two official pages of the same program contradicting each other (Enbrel). That is enough variation to stop tuning the model and start applying it. |

### Still open

1. **The remaining ~29 medications** — required before the master list can be finalized (§15.3).
2. **Multi-category medications** — confirm the canonical category for each drug that fits two (Mounjaro, Ozempic, Repatha, Inpefa, Rybelsus, Trulicity). Largely dissolves if the two-axis model in the taxonomy audit is adopted.
3. **URL pattern for category hubs** — e.g. `/prescription-assistance/diabetes` vs `/diabetes-prescription-assistance-utah`. Not needed until D3 is revisited.
4. ~~**Insulin pages**~~ — **RESOLVED 2026-08-26 as D10 (Rocco).** One record per insulin brand, under the existing `MedicationAssistanceRecord`. No generic "insulin assistance" record and no special record type. **This question is no longer a prerequisite for medication selection** — Lantus, Lyumjev, NovoLog, Toujeo and Tresiba are ordinary Track A candidates from now on. `/insulin-cost-medicare-vernal.html` remains the broad Medicare insulin-cost resource and brand pages may link to it. Full decision and reasoning in §32. (Note: §15.1's "Insulin & Injectable Diabetes Products (6)" group is five insulins plus **Victoza, a GLP-1** — the "six insulin brands" is really five.)
5. ~~An `autoimmune` browse view~~ — **resolved 2026-08-26 as D7** (view added; numbering kept so later references stay valid).
6. ~~**A `lung-disease` view**~~ — **resolved 2026-08-26 (Batch 6).** Ofev was researched and its own record demonstrated that `respiratory` could not represent it: the label carries no asthma or COPD indication, and the funds that pay for Ofev (TotalAssist Pulmonary fibrosis, OPEN; HealthWell Pulmonary Fibrosis and SSc-ILD) are separate funds from the COPD and asthma funds, which were closed, pay less, and do not list Ofev. The `lung-disease` CONDITIONS key was added and the view promoted out of `PENDING_CATEGORY_VIEWS`, which is now empty. No inhaler moved. Full demonstration in the Batch 6 result in §32.
7. ~~**Migration order for the legacy medication pages**~~ — **closed 2026-08-26 (Batch 4).** Dupixent was migrated; no legacy medication pages remain. History kept below.
   ~~settled~~. Batch 2 migrated Entresto, Xarelto and Repatha; Batch 3 (2026-08-26) migrated Trulicity and the four autoimmune pages the taxonomy audit flagged as highest-demand (Humira, Enbrel, Skyrizi, Rinvoq). **One remains: Dupixent**, which carries `conditions` only and is classified on one axis until it gets a researched record. Its two condition keys (`autoimmune`, `respiratory`) make it the natural first entry of the next batch.

---

## 32. Current Page Inventory — 28 Medication Pages (28 structured, 0 legacy)

### Project state (Batch 7 checkpoint, 2026-08-26 — PASS)

| Batch | Medications | Status |
| --- | --- | --- |
| Batch 1 | 5 — Farxiga, Jardiance, Eliquis, Mounjaro, Ozempic | Complete |
| Batch 2 | 5 — Entresto, Xarelto, Repatha, Trelegy, Breztri | Complete |
| Batch 3 | 5 — Trulicity, Humira, Enbrel, Skyrizi, Rinvoq | Complete (link-dark) |
| Batch 4 | 1 — Dupixent | Complete (link-dark) |
| Batch 5 | 5 — Rybelsus, Wegovy, Zepbound, Praluent, Leqvio | Complete (link-dark, NEW slugs) |
| Batch 6 | 4 — Nexletol, Symbicort, Spiriva, Ofev | Complete (link-dark, NEW slugs) |
| Batch 7 | 3 — Vyndamax, Januvia, Brilinta | Complete (link-dark, NEW slugs; first batch chosen by decision) |
| **Total structured** | **28** | **Complete** |
| Legacy remaining | 0 | — |
| 75-medication expansion | **Not started.** 24 of the 46 confirmed medications (§15.2) have pages; 22 do not. The other 4 records — Humira, Enbrel, Skyrizi, Rinvoq — are pre-existing inventory that is not on the §15.2 list | **§24 Phase 4 order COMPLETE.** Any further batch needs a selection decision, not a queue |

**Checkpoint recorded 2026-08-26 — Batch 7 COMPLETE. 28 researched records.
PHASE 4 COMPLETE and Batch 7 built on top of it by decision. Architecture PASS (D9 holds; no demonstrated defect).
No Batch 7 started and no medications selected. The EXP-003 observation window
is STILL ACTIVE — the linking pass (Track B) remains deferred until its
documented gate (~2026-09-03). Track C legacy data hygiene remains deferred.
The 75-medication expansion has NOT started, and the next research expansion
requires a new selection decision rather than a continuation of the §24 order.**

Measured at the checkpoint, not asserted: 25 medication records in
`src/data/medicationAssistance/`; registry, hub directory and sitemap aligned;
435/435 tests passing; all 17 `does-medicare-cover-*` coverage pages and the 21
pre-Batch-6 assistance pages byte-identical to the pre-batch build; the EXP-003
control pages (`does-medicare-cover-trelegy`, `does-medicare-cover-zepbound`)
untouched and unlinked; the four new records contain zero `does-medicare-cover-*`
strings in source or in rendered HTML. The `lung-disease` key was added only
after a demonstrated need (D9, see the Batch 6 result below), four drug-class
keys were each confirmed against their own label, and the legacy layer received
exactly one prose correction — the claim this batch's research disproved — with
`drugs[]` left intact.

**The remaining work is three independent tracks.** None of them is a
continuation of Batch 6, and none blocks another:

| Track | Work | Gate |
| --- | --- | --- |
| **A — Research expansion** | Beyond the §24 Phase 4 order, which Batch 6 finished. A further batch is no longer "the next names on the list" — §15's outstanding medications need a **selection decision** first, and §24 Phase 5 says that decision should follow real impressions, clicks and customer questions rather than inventory. | None mechanical; needs a deliberate scope decision. |
| **B — Experiment** | The controlled linking pass into the `does-medicare-cover-*` cohort | Blocked until EXP-003's observation window closes (~2026-09-03). Nothing in Track A may link into the cohort before then. |
| **C — Data hygiene** | Legacy `src/data/drugs.ts` issues that record precedence cannot reach, classified in the table below. Three disproved taglines, two dead program URLs, and one broad unverified-directory problem. The `sanofi`, `abbvie` and `azme`/Symbicort corrections are the worked precedent — fix the disproved prose only, leave `drugs[]` intact so precedence keeps the fallback honest for unresearched medications | None. Each is its own change with its own log entry. |


**Track C, classified at this checkpoint (audited, not fixed).** The distinction
that matters is *what kind* of problem each one is, because only one kind is
suppressible by the mechanism the project already has:

| # | Item | Kind | Evidence | Action |
| --- | --- | --- | --- | --- |
| C1 | `lillycares` tagline names **Mounjaro** | Tagline prose contradicted by a record — precedence CANNOT filter free text | `mounjaro.ts` records Lilly Cares as `not-found` | Deferred. Prose-only edit, `drugs[]` untouched |
| C2 | `novartis` tagline names **Entresto** | Same | `entresto.ts` records NPAF as `not-found` ("Entresto not supported") | Deferred. Prose-only edit |
| C3 | `azme` tagline names **Farxiga** | Same | `farxiga.ts` records AZ&Me as `closed` — no new Farxiga patients since 2026-05-01, removed entirely 2026-12-31 | Deferred. Prose-only edit |
| C4 | `bicares` URL `https://www.bicares.org/` | Dead program URL — a live outbound link, not a claim | NXDOMAIN on 8.8.8.8 and 1.1.1.1 (re-confirmed at this checkpoint) | Deferred. URL swap to the boehringer-ingelheim.com portal |
| C5 | `jjpaf` URL `https://www.jjpaf.org/` (and its phone) | Dead program URL | Domain resolves (204.232.236.248) but every HTTPS request times out; `xarelto.ts` already names the successor, "Johnson & Johnson Patient Assistance Program" | Deferred. URL/phone swap |
| C6 | 49 of 72 legacy `drugs[]` entries still answer from `PROGRAMS` for medications with no record | Broad legacy-directory hygiene — statuses and eligibility prose never independently verified | Precedence covers the 23 entries naming researched medications; the rest are unverified by construction | Deferred, and NOT a batch. This is the real scope of "legacy data hygiene" |

**Checked and deliberately NOT on the list.** A tagline naming a researched
medication is not automatically a contradiction — it is one only when the record
disproves it. Audited at this checkpoint and found consistent: `bms` → Eliquis
(BMSPAF `open`), `novocare` → Ozempic (Novo PAP `limited`), `bicares` →
Jardiance/Ofev/Spiriva (all `verify` — unconfirmed, not disproved), `azme` →
Breztri (`open`, corrected in Batch 6), `novartis` → Leqvio (on the NPAF list),
`abbvie` → Skyrizi/Rinvoq, `amgen` → Enbrel/Repatha, `pfizer` → Eliquis,
`jjpaf` → Xarelto (the J&J PAP itself is `open`; only its URL is dead), and
`gsk` → Trelegy (`verify` — GSK publishes no covered-medicine list, so the claim
is unverified rather than false). None of these needs an edit.

**Track A, reconciled at this checkpoint (reported, not selected).** The
documentation does **not** produce an unambiguous next batch, and that is the
finding — §15.3 states the remaining medications "have not been supplied" and
that its candidate gaps are "a prompt for the user's decision, not a proposed
list", while §24 Phase 5 says to expand "on **actual impressions, clicks, and
customer questions** — not by publishing everything in advance." Two documented
inputs exist and neither resolves on its own:

- **The 22 confirmed medications from §15.2 that have no page yet** (updated
  after Batch 7 took Vyndamax, Januvia and Brilinta out of the pool) — Anoro
  Ellipta · Breo Ellipta · Daliresp · Incruse Ellipta · Inpefa · Invokana ·
  Lantus · Lyumjev · Nexlizet · NovoLog · Nucala · Pradaxa · Ranexa · Savaysa ·
  Stiolto · Tezspire · Toujeo · Tresiba · Vascepa · Victoza · Xolair · Yupelri.
  **All 22 are eligible** — the five insulins were unblocked by D10 on
  2026-08-26. These are user-confirmed, so they are the legitimate pool — but
  §15.2 is an alphabetical index, not a priority order. Two carry standing notes:
  **Xolair** is the named follow-up from Batch 7 (its four indications and the
  separate CSU funds need a focused taxonomy pass) and **Breo Ellipta** was
  examined and dropped in Batch 7 for low marginal information value, so it
  should not be re-proposed without a new reason.
- **The §24 category order** (diabetes → cardiovascular → respiratory), which
  was written for the Phase 3/4 build and is now largely spent.

**Nothing was selected at this checkpoint.** The next expansion needs a
deliberate decision that names both the medications and the evidence behind
them; until then Track A is open, not queued.

**Phase 5 selection analysis run 2026-08-26 — evidence gathered, nothing
selected.** The 25 outstanding §15.2 medications were checked against the only
demand evidence the repository holds: `data/search-console/queries-2026-07-29.csv`.
Result: **5 of the 25 appear in any query at all**, for 31 impressions and 0
clicks combined — Breo Ellipta 15 (across "does medicare cover fluticasone
furoate vilanterol ellipta" 12 and "does medicare cover breo ellipta" 3), Ranexa
6 (as "ranolazine"), Savaysa 4, Anoro Ellipta 3, Incruse Ellipta 3. The other 20
have **no** evidence of any kind: no impressions, no clicks, and no mention
anywhere in the project documentation outside the §15.2 list itself. No captured
customer questions or user requests exist in the repository.

Three limits on that evidence, all material to any decision made from it:

1. **The export is a single snapshot dated 2026-07-29 and predates every
   researched record** (Batch 1 shipped 2026-08-26), so it cannot show demand for
   anything this project has built. A fresh export is the cheapest way to make
   the next selection defensible.
2. **Every candidate query is coverage-intent** ("does medicare cover X"), not
   assistance-intent. The page type that answers them is `does-medicare-cover-*`,
   which is the frozen EXP-003 cohort — so the strongest-evidenced response is
   the one D8 currently forbids. Evidence for an *assistance* page is indirect.
3. **The priority engine cannot answer this question.** `queries-*.csv` has no
   URL column, so the parser skips it (see the README in that folder); and
   OPPORTUNITY ranks only pages that already exist — "a page with no impressions
   is a bet, not an opportunity". Nothing in the generated reports recommends a
   medication.

**No longer blocking:** open question §31 #4 was **resolved on 2026-08-26 as
D10**. Lantus, Lyumjev, NovoLog, Toujeo and Tresiba are ordinary candidates, and
the eligible pool is the whole outstanding list rather than a subset of it.

No medications were chosen, no `FEATURED_DRUGS` row was added and no research was
started. The selection remains the user's decision.

**Evidence refresh attempted 2026-08-26 — no newer data exists.**
`data/search-console/` still holds only `pages-2026-07-29.csv` and
`queries-2026-07-29.csv` (both last written 2026-07-29 20:16), and a repository-wide
search found no other export in any format. There is no Search Console connector
available to this environment either. **The candidate ranking above therefore
stands unrefreshed and must be treated as historical calibration, not as current
demand** — it predates all 25 assistance records, so it cannot show demand for
anything the project has built. Breo Ellipta / Anoro Ellipta / Incruse Ellipta
remain the only evidenced candidates, and remain *unconfirmed* for that reason.
No priority ranking was manufactured from the stale export. The blocking input is
unchanged and cheap: one fresh Search Console export covering the period since
2026-08-26.

**D10 — insulin architecture: DECIDED 2026-08-26 (Rocco). One record per brand,
and no longer a prerequisite for selection.**

The decision, in the form it should be applied:

- **One record per insulin brand**, using the existing `MedicationAssistanceRecord`.
  **No generic "insulin assistance" record and no special record type** — the
  existing architecture works for individual brands, so D9 is untouched.
- **§31 #4 is not a gate on medication selection.** Lantus, Lyumjev, NovoLog,
  Toujeo and Tresiba are ordinary Track A candidates, judged on the same criteria
  as everything else. Whether individual insulin records earn their place is a
  **research question** — do they add assistance information beyond the existing
  insulin-cost page? — not an architecture question.
- **Brand records cover the manufacturer layer**: PAP, copay program, Medicare
  exclusions, Extra Help, TotalAssist, HealthWell, and product-specific detail.
  They should **not** re-explain the $35 Part D insulin cap five times.
- **`/insulin-cost-medicare-vernal.html` remains the broad resource** for the
  Medicare insulin-cost story, and brand pages may link to it subject to the
  project's linking rules (it is not a `does-medicare-cover-*` page, so D8 does
  not restrict that link).
- **NovoLog's negotiated price is product-specific.** Insulin aspart carries an
  MFP of **$119.00** per 30-day equivalent supply from 2026-01-01 and **$122.22**
  from 2027-01-01, covering "NOVOLOG; NOVOLOG FLEXPEN; NOVOLOG PENFILL; FIASP…".
  Lantus, Toujeo, Tresiba and Lyumjev are **not** selected for negotiation. Never
  write or imply that one insulin's negotiated price applies to another.
- **The shared statutory cap does not make the programs interchangeable.** The
  $35 cap is uniform; Sanofi's, Novo Nordisk's and Lilly's assistance rules are
  not, and that difference is the whole reason a brand page can be worth having.

The reasoning that produced it, kept because the counter-argument is real:

**Against a single shared page:**

1. **The five candidates span three manufacturers, hence three separate
   programs.** Confirmed from the DailyMed labellers, not assumed: Lantus and
   Toujeo are Sanofi-Aventis; NovoLog and Tresiba are Novo Nordisk; Lyumjev is
   Eli Lilly. That means Sanofi Patient Connection, the Novo Nordisk PAP and
   Lilly Cares — three income tables, three Medicare rules, three application
   routes. The project already forbids transferring terms between manufacturers
   (§11, §16 Rule 5) and renders `FPL_NOTE` on every page precisely because two
   programs quoting the same FPL percentage publish different dollars. A single
   page would have to flatten exactly the thing the architecture exists to keep
   apart.
2. **The Medicare facts already diverge by product.** NovoLog is a
   Medicare-negotiated drug — CMS's selected-drug file lists "NOVOLOG; NOVOLOG
   FLEXPEN; NOVOLOG PENFILL; FIASP…" with a maximum fair price of **$119.00 per
   30-day equivalent supply from 2026-01-01**, inflation-adjusted to **$122.22
   from 2027-01-01**. Lantus, Toujeo, Tresiba and Lyumjev are not selected. One
   page covering all five either omits that or blurs whose price it is.
3. **Search intent is brand-shaped, not class-shaped.** In our own Search Console
   export every drug query names a brand or a generic molecule; the bare term
   "insulin" returns **zero** queries.
4. **A class page does not fit the record type.** `MedicationAssistanceRecord`
   carries one `brandName`, one `genericName`, one `manufacturer`, one
   `quickAnswer` and one `medicareContext`, and the registry locks the title
   pattern to `${brandName} Assistance & Grants`. An "insulin" page has none of
   those singular values, so it would require a second record shape — an
   architectural change, which D9 forbids without a demonstrated defect.

**For a single shared page — the honest counter-argument:** much of the content
genuinely *is* shared. The $35 Part D insulin cap applies to all of them, and the
Extra Help, TotalAssist and HealthWell sections would be near-identical across
five records. Five near-duplicate pages is a real thin-content risk, and the
editorial gate would probably pass them, so the gate is not the safeguard here.

**Recommended resolution, which satisfies both sides:** keep one record per
brand — but **do not build the five as a batch**, and build an insulin record
only when demand evidence names that brand. The shared class-level story already
has a home: `/insulin-cost-medicare-vernal.html` exists, ranks in the part-d
silo, and already covers "The $35 Insulin Cap" and "Which Insulin Products Are
Covered?", naming Lantus, Tresiba, NovoLog, Humalog and Basaglar. That page *is*
the "single insulin page" the earlier outline wanted; it simply is not an
assistance-program page. Read that way the conflict in §31 #4 dissolves rather
than needing a winner.

**Nothing has been built on this decision.** No insulin record, no
`FEATURED_DRUGS` row, no change to `/insulin-cost-medicare-vernal.html`, and
insulin is **not** automatically the next batch. D10 removes a blocker; it does
not make a selection. The next batch is still chosen on information value,
category coverage and research opportunity.

**What "complete" means here, precisely.** These 25 records cover every
`FEATURED_DRUGS` row that generates a live assistance page today, Batch 4 closed
the legacy representation completely, and Batch 6 closed the §24 Phase 4 build
order. They do **not** complete §15's medication list or the 75-page target in
§30. Reconciled at this checkpoint rather than assumed: **24 of the 46 confirmed
medications in §15.2 have pages and 22 do not**, and four of the 28 records
(Humira, Enbrel, Skyrizi and Rinvoq) are pre-existing site inventory that never
appeared on the §15.2 list at all. That is why "28 records" and "24 of the 46"
are not the same statement. Each of the 22 outstanding confirmed medications
would need a new slug. (All three Batch 7 medications — Vyndamax, Januvia and
Brilinta — were on the §15.2 list; an earlier draft of this section wrongly
placed Vyndamax outside it, corrected 2026-08-26.) "Legacy migration complete", "current inventory complete",
"the documented build order complete" and "prescription assistance project
complete" are four different statements, and only the first three are true.

### Batch 7 result — the first batch chosen by decision, not by the list (2026-08-26, PASS)

Batch 6 exhausted the §24 Phase 4 order, so this is the first batch selected by
a documented decision on **information value, category coverage and research
opportunity** rather than by taking the next names off a queue. Five were
proposed; research changed the batch twice before anything was authored, which
is the process working rather than failing.

| Medication | Why selected | Outcome |
| --- | --- | --- |
| **Vyndamax** | First rare-disease assistance shape | Built. The registry's first record with **two OPEN funds** |
| **Januvia** | Fills the DPP-4 gap the diabetes view already advertised | Built. First PAP that names **Medicare as disqualifying coverage** |
| **Brilinta** | Fills the empty half of the Blood Thinners view | Built. The registry's first **antiplatelet** |
| ~~Breo Ellipta~~ | Only candidate with (stale) demand evidence | **Dropped on research** — duplicates Trelegy's picture |
| ~~Xolair~~ | IPAY 2028; Part B vs Part D question | **Deferred** — needs its own indication/taxonomy pass |

**Taxonomy verification, measured not asserted:**

| Medication | `conditions` | `drugClass` | Derived views | Note |
| --- | --- | --- | --- | --- |
| Vyndamax | `heart` | `transthyretin-stabilizer` | Heart & Blood Pressure | no amyloidosis key added — see below |
| Januvia | `diabetes` | `dpp-4` | Diabetes & Blood Sugar | first DPP-4 in the registry |
| Brilinta | `heart` | `antiplatelet` | **Blood Thinners · Heart & Blood Pressure** | first use of an existing unused key |

**Two class keys added, both confirmed against their own labels** —
`dpp-4` ("JANUVIA is a dipeptidyl peptidase-4 (DPP-4) inhibitor") and
`transthyretin-stabilizer` (tafamidis is one of the "transthyretin
stabilizers"). **No condition key was added**, and that was a decision rather
than an omission: the Ofev test from Batch 6 was applied to Vyndamax and came
out the other way. Ofev needed `lung-disease` because `respiratory` was flatly
wrong for it — the label carries no asthma or COPD indication. Vyndamax's label
indication IS a cardiomyopathy, so `heart` is true rather than merely adjacent,
and the amyloidosis-specific funds live in the record's own program cards, which
is what the record body is for. The gate works in both directions.

**Brilinta closes a gap that had been open since the taxonomy was built.** The
Blood Thinners view has always described itself as "Anticoagulants and
antiplatelets"; until now every medication in it was an anticoagulant. Brilinta
carries `antiplatelet` — a key that existed but had never been used by any
record — and the rendered page reads "Blood Thinners · Heart & Blood Pressure".
It deliberately does **not** carry `blood-clots`: that key means AFib, DVT and
PE on this site, none of which Brilinta treats, and tagging it so would have
implied it is interchangeable with Eliquis and Xarelto — the exact confusion the
page exists to correct.

**Findings that were checked rather than inherited:**

1. **Vyndamax's funds are a prerequisite, not an alternative.** Pfizer's own
   VYNDAMAX site states patients "are required to apply for and provide proof of
   denial prior to being considered for enrollment in the Pfizer Patient
   Assistance Program", and that the program serves people "who are uninsured or
   have government-issued insurance". Both amyloidosis funds were **OPEN** —
   TotalAssist ($2,500 guaranteed / $5,500 max) and HealthWell ($8,000 max, the
   largest award in the registry). The page is ordered funds-first because
   Pfizer orders it that way.
2. **Merck's program excludes Medicare by name.** Its eligibility requires that
   you "do not have insurance or other coverage for your prescription medicine",
   listing Medicare among the examples — the opposite of AZ&Me's rule and of
   Pfizer's. The route through is Merck's documented exception for "special
   circumstances of financial and medical hardship". Income $63,840 / $86,560 /
   $132,000. **Do not generalise these to another manufacturer.**
3. **Januvia already has a negotiated price in effect** — MFP **$113.00** per
   30-day equivalent supply from 2026-01-01, **$116.06** from 2027-01-01
   (Janumet/Janumet XR $80.00 from 2027 under IPAY 2027). Most negotiated prices
   described on this site have not started yet.
4. **Brilinta has no manufacturer route for a Medicare beneficiary.** Not on the
   AZ&Me medication list, not on AstraZeneca Direct — while brilinta.com still
   names AZ&Me in its trademark footer, which is easy to misread as inclusion.
   HealthWell runs **no** CAD, ACS or stroke fund at all. What exists instead is
   generic ticagrelor: **35 labelled products** on DailyMed.
5. **Breo Ellipta was dropped on evidence.** GSK's PAP still publishes no
   covered-medicine list (so Breo would be `verify`, exactly as Trelegy is), the
   same COPD and asthma funds were closed, and **www.breo.com is not GSK's** —
   it serves a Chinese massage-device company. The only candidate carrying demand
   evidence left the batch because its *information* value proved low.

**Gaps carried as `verify` rather than guessed:** the Januvia savings card
(januvia.com now serves the prescribing-information PDF rather than a consumer
site, and no Merck-owned savings page could be found — third-party directories
report a $5 card, which is not an official source, so no figure is published)
and the Brilinta savings card (brilinta.com renders its Commercial Insurance and
Medicare Part D sections client-side and carries a "Last Updated 5/24" stamp).
The Pfizer PAP's income thresholds are not published on the VYNDAMAX pages and
are recorded as unstated rather than borrowed.

**Legacy layer:** one prose correction under the Sanofi/AbbVie precedent — the
`azme` tagline also named **Brilinta**, which this batch disproved the same way
it disproved Symbicort in Batch 6. Replaced with Airsupra, confirmed on the same
AZ&Me list; `drugs[]` untouched. The Farxiga claim in that tagline still stands
and is still deferred (Track C item C3) — this batch corrected only what it
disproved.

**Next:** nothing is queued. Track A returns to needing a selection decision;
Xolair is the named follow-up when someone takes the indication/taxonomy
question head-on.

### Batch 6 result — the closing four, and the `lung-disease` decision (2026-08-26, PASS)

The last four names in the §24 Phase 4 order — Nexletol, Symbicort, Spiriva,
Ofev — taken as four, not padded to five. Every one is a new `FEATURED_DRUGS`
row, a new `/<slug>-assistance-program.html` URL, a sitemap entry and a
researched record; the hub directory and `PAGE_INDEX` needed no edit. No
redirects, no existing URL changed, no existing page redesigned.

**Taxonomy verification, measured not asserted:**

| Medication | `conditions` | `drugClass` | Derived views | Note |
| --- | --- | --- | --- | --- |
| Nexletol | `cholesterol`, `heart` | `acl-inhibitor` | Cholesterol · Heart & Blood Pressure | label carries a standalone MACE indication, as Praluent does |
| Symbicort | `respiratory` | `ics-laba` | COPD & Asthma | ICS + LABA — deliberately not `triple-inhaler` |
| Spiriva | `respiratory` | `lama` | COPD & Asthma | label calls tiotropium "an anticholinergic" |
| Ofev | `lung-disease` | `kinase-inhibitor` | Lung Disease | **no `respiratory` key — see below** |

**The `lung-disease` gate (open question §31 #6), decided on evidence.** The
question was never "is Ofev a lung medicine" — it obviously is. The question was
whether the existing `respiratory` key can *represent* it, and `conditions` is
load-bearing: `programsForDrug()` matches nonprofit disease funds on it. Two
findings settled it:

1. **The label has no asthma or COPD indication at all** — idiopathic pulmonary
   fibrosis, chronic fibrosing ILDs with a progressive phenotype, and
   SSc-ILD (DailyMed, rev. 5/2025).
2. **The funds are different funds, with different money and non-overlapping
   medication lists.** On 2026-08-26 TotalAssist's **Pulmonary fibrosis fund was
   OPEN** ($3,500 guaranteed / $7,000 maximum) and lists "Ofev (Nintedanib
   Esylate)"; its **COPD and Asthma funds were CLOSED** ($1,200 / $3,500) and do
   **not** list Ofev. HealthWell splits the same way: Pulmonary Fibrosis and
   Systemic Sclerosis with ILD at **$9,000** maximum, both listing Ofev, versus
   COPD – Medicare Access at $3,250 and Asthma at $4,500, neither listing it.

Tagging Ofev `respiratory` would therefore have pointed a fibrosis patient at
funds that are closed, smaller, and do not cover their medicine. That is a wrong
answer, not an imprecise one — which is what makes the key necessary and keeps
it inside D9. `lung-disease` was added to `CONDITIONS`; the reserved
`lung-disease` view was promoted out of `PENDING_CATEGORY_VIEWS` (now empty) and
placed **before** `copd-asthma` under specific-before-general. **Nothing moved:**
every existing inhaler keeps `respiratory`, Symbicort and Spiriva were built on
`respiratory` in the same batch, and Ofev derives the single view "Lung Disease".
Had the funds overlapped, the correct outcome would have been to leave the key
uncreated — the decision was contingent on the evidence, not on the subject.

Four drug-class keys were added, each confirmed against its own label rather
than assigned from memory: `acl-inhibitor`, `ics-laba`, `lama`,
`kinase-inhibitor` (kept broader than the existing `jak-inhibitor`, which names
one family). No third axis, no category hub, no record-level category field.
**Architecture remains frozen under D9.**

**Findings that were checked rather than inherited:**

1. **Symbicort is not on AZ&Me.** AstraZeneca's included-medications page lists
   Airsupra, Bevespi and Breztri on the respiratory side and Symbicort nowhere —
   no logo, no application PDF, no trademark footer, and no entry in the 2026
   additions/removals notice. Recorded as "not on the list", not "removed".
   AstraZeneca Direct does not carry it either. This is the one legacy tagline
   claim Batch 6 disproved, and the only prose that was changed.
2. **Ofev is a CMS-negotiated drug** — IPAY 2027, MFP **$6,350.00 per 30-day
   equivalent supply, effective 2027-01-01**, read from CMS's selected-drug data
   file (2026-05-26), not from a fact sheet. Nexletol, Symbicort and Spiriva
   appear in no row for 2026, 2027 or 2028.
3. **Generic nintedanib exists** (eleven DailyMed capsule entries besides Ofev),
   as do Breyna and generic budesonide/formoterol for Symbicort and a generic
   tiotropium capsule for the Spiriva HandiHaler. The Spiriva **Respimat** has no
   generic and Nexletol has none — a distinction that changes the advice.
4. **Esperion publishes no patient assistance program for Nexletol** — only a
   commercial co-pay card ("as little as $10 per fill", explicit Medicare
   exclusion) and a Navigator access service. Recorded `not-found`.
5. **Two funds were open**, which is unusual for this registry: TotalAssist
   Hypercholesterolemia (lists Nexletol) and TotalAssist Pulmonary fibrosis
   (lists Ofev). Everything else checked was closed, and Good Days had no fund
   for any of the four diagnoses.

**Gaps carried as `verify` rather than guessed:** every Boehringer Ingelheim
patient-facing host refused automated access on 2026-08-26, and the only
savings-card terms reachable (on `docs.boehringer-ingelheim.com`) expired
12/31/2024. So the Boehringer Cares PAP and both BI savings cards are `verify`;
the PAP's Medicare field is `unknown` rather than a borrowed "conditional"; and
no dollar terms are published for either card. What could be confirmed came from
the foundation's own program description via PhRMA's Partnership for
Prescription Assistance and an RxAssist entry updated 2026-04-27. **Spiriva and
Ofev should be re-verified as soon as BI's pages become readable.**

**Legacy layer:** one prose correction (`azme`, Symbicort → Breztri), following
the Sanofi/AbbVie precedent; `drugs[]` untouched everywhere. The `bicares`
tagline names Ofev and Spiriva and research **confirmed** both, so it was left
alone. Deferred items were not touched, and one was added to the deferred list:
`bicares.org` no longer resolves.

**Next:** nothing in the §24 order. Track A now requires a selection decision.

### Batch 4 result — Dupixent, the legacy-migration test (2026-08-26, PASS)

Dupixent was the last page carrying the old `Drug`-only representation and the
only medication whose condition keys are `autoimmune` **and** `respiratory` —
the pair that prompted D7's ordering. The objective was not "convert Dupixent"
but to verify that the architecture replaces the legacy representation
**without creating a third classification system.** It does.

**Taxonomy verification (§15), measured not asserted:**

| Check | Result |
| --- | --- |
| `conditions` | `['autoimmune', 'respiratory']` — both canonical `CONDITIONS` keys |
| `drugClass` | `['biologic']` — label §12.1: "human monoclonal antibody of the IgG4 subclass" |
| Derived categories | `['autoimmune', 'biologics', 'copd-asthma']` — non-empty, no fallback |
| Ordering | `autoimmune` (index 0) precedes `copd-asthma` — D7 holds under a real dual record |
| Taxonomy tags | `prescription-assistance, autoimmune, respiratory, biologic` — no duplicates |
| Legacy `categories` field | absent |
| New axis / field / lookup introduced | **none** |

**Architecture verdict: no defect found. The record architecture remains frozen
under D9.** Nine indications across skin, airway, gut and blood-vessel disease
fit the two axes without strain, because `conditions` records what the *patient*
has and only two keys change which charitable funds match.

**Three findings that were checked rather than inherited** — each contradicts a
reasonable assumption, and each is the kind of error §11 exists to prevent:

1. **Sanofi Patient Connection does not cover Dupixent.** Its
   medications-available list names 20 medicines (Admelog, Lantus, Lovenox,
   Toujeo, …) and Dupixent is not among them — zero occurrences in the page
   source. The Dupixent route is the separate DUPIXENT MyWay Patient Assistance
   Program.
2. **HealthWell's AutoImmune – Medicare Access fund does not list Dupixent,**
   though it lists Humira, Enbrel, Skyrizi and Rinvoq. Dupixent's HealthWell
   listings are Asthma, COPD and Urticaria instead — so an eczema or prurigo
   nodularis diagnosis has no HealthWell route at all.
3. **TotalAssist's Eosinophilic Esophagitis fund was OPEN** ($1,500 guaranteed,
   $2,000 maximum) — the first open charitable fund found anywhere in this
   project. "Charity funds are closed" had begun to look like a rule. It is not
   one, and the page says so.

**Known defect found, deliberately NOT fixed in this batch.** The legacy
assistance-program directory in `src/data/drugs.ts` (the `sanofi` entry, ~line
196) still claims Sanofi Patient Connection supplies Dupixent — tagline "Free
Sanofi/Regeneron medicines (Dupixent, Praluent, Lantus)" and `drugs: ['Dupixent',
'Praluent', …]`. Finding 1 above shows that is wrong, and it is wrong on every
page that renders the directory, not just this one. It sits outside the Batch 4
scope (which was Dupixent's record) and outside D9 (it is a data error, not an
architectural one). **Fix it as its own change, with its own log entry**, and
re-check Praluent at the same time — it is not on the Sanofi list either.

### Batch 5 result — five NEW slugs, the first scale test of the frozen architecture (2026-08-26, PASS)

Selected strictly from the §24 Phase 4 order (Trulicity · **Rybelsus · Wegovy ·
Zepbound · Praluent · Leqvio** · Nexletol · Symbicort · Spiriva · Ofev) — Trulicity
shipped in Batch 3, so these were the next five. Every one is a new
`FEATURED_DRUGS` row, a new `/<slug>-assistance-program.html` URL, a sitemap
entry and a researched record; the hub directory and `PAGE_INDEX` needed no
edit. No redirects, no existing URL changed, no existing page redesigned (all 16
prior assistance pages and all 17 coverage pages byte-identical before/after).

**Taxonomy verification, measured not asserted:**

| Medication | `conditions` | `drugClass` | Derived views | Note |
| --- | --- | --- | --- | --- |
| Rybelsus | `diabetes`, `heart` | `glp-1` | diabetes · glp-1 · heart | label carries a MACE indication |
| Wegovy | `weight`, `heart` | `glp-1` | glp-1 · heart | MASH indication has no key — deliberately none added |
| Zepbound | `weight` | `glp-1` | glp-1 | OSA indication is not `respiratory` |
| Praluent | `cholesterol`, `heart` | `pcsk9` | cholesterol · heart | |
| Leqvio | `cholesterol` | `pcsk9` | cholesterol | siRNA "directed to PCSK9 mRNA"; class blurb widened |

**One vocabulary key added — `weight` — and why the existing vocabulary could
not represent Wegovy and Zepbound:** neither carries a diabetes indication;
obesity/overweight is not cardiovascular disease (`heart`), and obstructive
sleep apnea in adults with obesity is not asthma, COPD or lung disease
(`respiratory`). Either substitute would have matched the wrong charitable
funds through `programsForDrug()`. The taxonomy audit pre-registered this
exact addition (§2 step 5: "Extend `CONDITIONS` with `weight` only when
Wegovy/Zepbound are built"). No foundation entry matches `weight`, which is
correct — no obesity fund was open at TotalAssist, HealthWell or Good Days on
2026-08-26. The existing "Weight Management / GLP-1" view gained
`conditions: ['weight']` (the same shape as the diabetes view pairing
`diabetes` with `insulin`) so a conditions-only `Drug` row does not fall to the
fallback view. **No third axis, no category hub, no record-level category
field. Architecture remains frozen under D9.**

**Findings that were checked rather than inherited:**

1. **Rybelsus is being replaced in the U.S. by "Ozempic" tablets** (from May 4,
   2026; one combined label). It is not on Novo's 2026 PAP list, has no
   self-pay price, and its savings-offer URLs redirect to the Ozempic offer.
2. **The Medicare GLP-1 Bridge is live and covers Wegovy (pen and tablet) and
   the Zepbound KwikPen at $50/month** through 2027-12-31 for Part D enrollees
   prescribed them for weight management; Extra Help cannot lower the $50, and
   type 2 diabetes / OSA / MASH / CV-risk uses go to the Part D plan instead.
3. **The negotiated semaglutide price is one blended $274 figure** for
   "Ozempic; Rybelsus; Wegovy"; CMS's Wegovy example is $385.63 per 4-pen
   package. Never write "Wegovy's negotiated price is $274."
4. **Regeneron runs Praluent's program** (Sanofi Patient Connection's own list
   omits it — confirming the P1 tagline fix); the only published MyPRALUENT PAP
   form is a re-enrollment form; Praluent is $225/month on TrumpRx.
5. **Leqvio is a Part B drug.** Extra Help and the Part D cap do not apply;
   Medigap, Medicare Savings Programs and Medicaid do. The record therefore
   leads with coverage itself and links the Medigap and MSP pages.

**Gaps carried as `verify` / omitted rather than guessed:** MyPRALUENT copay
card dollar terms (login-gated), LEQVIO Co-pay terms (site unreachable), NPAF
income table (JavaScript wizard), whether TotalAssist grants reimburse a Bridge
copay or Part B coinsurance. The Leqvio research agent was cut off by a session
limit; its sources were read directly on the same day.

**Legacy layer:** untouched, per the batch brief. Two prose contradictions that
precedence cannot filter were noted for the deferred data-hygiene task — the
`novartis` tagline still names Entresto and the `lillycares` tagline still
names Mounjaro, both disproved in earlier batches.

**Next in §24 order:** Nexletol, Symbicort, Spiriva, Ofev (Ofev triggers open
question §31 #6, the `lung-disease` key). — **Done: Batch 6, 2026-08-26.** That
batch closed the §24 Phase 4 order and answered §31 #6 in the affirmative on
evidence; see the Batch 6 result earlier in this section.
### Phase 1 completion gate — inventory reconciliation (run after Dupixent, before Batch 4)

Do not start another batch until every medication in the inventory reconciles
end to end across the whole chain:

`FEATURED_DRUGS` → assistance registry → generated page → navigation →
hub directory → sitemap → `PAGE_INDEX` → search index

For each medication, verify it has: exactly one canonical assistance URL · one
structured record · condition classification · drug-class classification ·
derived browse categories · assistance programs · a Medicare status per program ·
dated sources on every material claim · application instructions · fallback
guidance · FAQs · related medications · a video placeholder · directory
presence · sitemap presence · test coverage. Expanding the inventory before
this reconciliation is how architectural debt accumulates.

Batch 1 is easy to describe wrongly. It did **not** create the site's first five
medication pages. The accurate description is:

> **Five of the fourteen medication assistance pages that already existed were
> converted to the structured assistance architecture. Nine remained on the
> legacy architecture.** Batch 2 (2026-08-26) then converted three more legacy
> pages in place (Entresto, Xarelto, Repatha — they were next in the §24 build
> order) and added two new slugs (Trelegy Ellipta, Breztri Aerosphere). Six
> legacy pages remain — the five autoimmune pages plus Trulicity.

Every one of the sixteen is built from `FEATURED_DRUGS` in `src/data/drugs.ts`
through the single route `src/pages/[drug]-assistance-program.astro`. That route
renders the record-driven page when a `MedicationAssistanceRecord` exists for the
slug, and the older condition-matched page when it does not. One medication, one
URL, either way.

### Structured (25) — researched records with dated sources

| Brand | URL | Record |
| --- | --- | --- |
| Farxiga | `/farxiga-assistance-program.html` | `src/data/medicationAssistance/farxiga.ts` |
| Jardiance | `/jardiance-assistance-program.html` | `jardiance.ts` |
| Eliquis | `/eliquis-assistance-program.html` | `eliquis.ts` |
| Mounjaro | `/mounjaro-assistance-program.html` | `mounjaro.ts` |
| Ozempic | `/ozempic-assistance-program.html` | `ozempic.ts` |
| Entresto | `/entresto-assistance-program.html` | `entresto.ts` (Batch 2, migrated) |
| Xarelto | `/xarelto-assistance-program.html` | `xarelto.ts` (Batch 2, migrated) |
| Repatha | `/repatha-assistance-program.html` | `repatha.ts` (Batch 2, migrated) |
| Trelegy Ellipta | `/trelegy-assistance-program.html` | `trelegy.ts` (Batch 2, new) |
| Breztri Aerosphere | `/breztri-assistance-program.html` | `breztri.ts` (Batch 2, new) |
| Trulicity | `/trulicity-assistance-program.html` | `trulicity.ts` (Batch 3, migrated) |
| Humira | `/humira-assistance-program.html` | `humira.ts` (Batch 3, migrated) |
| Enbrel | `/enbrel-assistance-program.html` | `enbrel.ts` (Batch 3, migrated) |
| Skyrizi | `/skyrizi-assistance-program.html` | `skyrizi.ts` (Batch 3, migrated) |
| Rinvoq | `/rinvoq-assistance-program.html` | `rinvoq.ts` (Batch 3, migrated) |
| Dupixent | `/dupixent-assistance-program.html` | `dupixent.ts` (Batch 4, migrated) |
| Rybelsus | `/rybelsus-assistance-program.html` | `rybelsus.ts` (Batch 5, new) |
| Wegovy | `/wegovy-assistance-program.html` | `wegovy.ts` (Batch 5, new) |
| Zepbound | `/zepbound-assistance-program.html` | `zepbound.ts` (Batch 5, new — EXP-003 control drug, record links to no coverage page) |
| Praluent | `/praluent-assistance-program.html` | `praluent.ts` (Batch 5, new) |
| Leqvio | `/leqvio-assistance-program.html` | `leqvio.ts` (Batch 5, new — Part B drug) |
| Nexletol | `/nexletol-assistance-program.html` | `nexletol.ts` (Batch 6, new — no manufacturer PAP found) |
| Symbicort | `/symbicort-assistance-program.html` | `symbicort.ts` (Batch 6, new — not on AZ&Me) |
| Spiriva | `/spiriva-assistance-program.html` | `spiriva.ts` (Batch 6, new — BI programs `verify`, site unreadable) |
| Ofev | `/ofev-assistance-program.html` | `ofev.ts` (Batch 6, new — the `lung-disease` key; CMS MFP from 2027-01-01) |

Batch 3 (2026-08-26) migrated the five highest-demand legacy pages in place. No
new URLs: all five slugs were already in `FEATURED_DRUGS`, so the pages the
`does-medicare-cover-*` cohort already linked to simply became record-driven.
That is what made the batch link-dark — see `docs/seo/WORK-LOG.md`.

### Legacy (0) — none remaining

Dupixent, the last one, was migrated in Batch 4 (2026-08-26). Every medication
page in the current inventory is now record-driven. The legacy rendering path in
`src/pages/[drug]-assistance-program.astro` is retained deliberately: it is what
will render a new `FEATURED_DRUGS` slug during the 75-medication expansion, in
the window between adding the drug and finishing its research.

### Why this matters more than it looks

The legacy pages are **not** dead weight. In the July 2026 query data they
are the site's highest-demand drug content: the autoimmune/biologic cluster
(Rinvoq, Dupixent, Humira, Enbrel, Skyrizi) drew more query impressions than any
other medication bucket — more than the GLP-1s. See the taxonomy audit, Q1.

### Migration approach (agreed, not scheduled)

Do **not** delete them. Migrate them into the same data architecture as each
one's research is completed, one record at a time:

```
14 existing pages
  → 5 structured
  → 9 legacy
  → migrate the 9 as research completes
  → add the remaining approved medications
  → complete inventory
```

The order of that migration relative to Batch 2 is open question §31 #6. The
argument for doing at least the five autoimmune pages early is that they carry
the demand; the argument against is that Batch 2's medication list may be
higher-priority for the user. That is a decision, not an implementation detail.
