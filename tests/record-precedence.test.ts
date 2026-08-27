// tests/record-precedence.test.ts — proves a researched MedicationAssistance
// record takes precedence over the legacy PROGRAMS directory in data/drugs.ts
// (P1 cleanup, 2026-08-26).
//
// Why this exists. Two layers describe assistance programs:
//
//   MEDICATION_ASSISTANCE  researched records, dated sources, authoritative
//   PROGRAMS               the older directory — the INTERIM source for
//                          medications nobody has researched yet
//
// The legacy layer decays wherever the researched layer has already looked: its
// `drugs` lists still claim Dupixent for Sanofi Patient Connection (Sanofi's own
// medicine list does not include it) and Humira for myAbbVie Assist (removed
// 2026-07-01). The Program Finder on /prescription-drug-assistance.html was
// rendering those claims beside the medication pages that disprove them.
//
// The fix is precedence, not deletion — the fallback still serves the ~59
// medications awaiting research. These tests pin both halves of that: the
// registry suppresses the legacy layer for medications it owns, AND the legacy
// layer still answers for medications it does not.

import { describe, it, expect } from 'vitest';
import {
  MEDICATION_ASSISTANCE,
  isResearchedMedication,
  recordForSearch,
} from '../src/data/medicationAssistance';
import { PROGRAMS, FEATURED_DRUGS } from '../src/data/drugs';

const legacyManufacturer = PROGRAMS.filter((p) => p.type === 'manufacturer');

describe('record precedence — the registry wins for what it owns', () => {
  it('recognises every researched medication by brand name and by slug', () => {
    for (const r of MEDICATION_ASSISTANCE) {
      expect(isResearchedMedication(r.brandName), r.brandName).toBe(true);
      expect(isResearchedMedication(r.slug), r.slug).toBe(true);
      expect(recordForSearch(r.brandName)?.slug, `search ${r.brandName}`).toBe(r.slug);
      expect(recordForSearch(r.slug)?.slug, `search ${r.slug}`).toBe(r.slug);
    }
  });

  it('matches multi-word brands the legacy layer spells differently', () => {
    // Legacy `drugs` lists say "Trelegy Ellipta" and "Breztri"; the records are
    // "Trelegy Ellipta" (slug trelegy) and "Breztri Aerosphere" (slug breztri).
    expect(isResearchedMedication('Trelegy Ellipta')).toBe(true);
    expect(isResearchedMedication('Breztri')).toBe(true);
    expect(recordForSearch('Trelegy Ellipta')?.slug).toBe('trelegy');
    expect(recordForSearch('Breztri')?.slug).toBe('breztri');
  });

  it('suppresses no legacy manufacturer claim for a medication it has NOT researched', () => {
    // The fallback must survive. These are real entries in the legacy `drugs`
    // lists with no record, and they must keep answering from PROGRAMS.
    // Batch 5 (2026-08-26) researched Praluent and Rybelsus, so they left this
    // list; Batch 6 (2026-08-26) researched Spiriva and Ofev, so Spiriva left
    // it too and Pradaxa — the other Boehringer Ingelheim entry in the legacy
    // `bicares` list — took its place. The assertion is unchanged; only the
    // fixtures move on as the registry takes ownership of more medications.
    for (const name of ['Victoza', 'Lantus', 'Revlimid', 'Pradaxa', 'Xtandi', 'Cosentyx']) {
      expect(isResearchedMedication(name), `${name} must stay on the legacy layer`).toBe(false);
      expect(recordForSearch(name), `${name} has no record`).toBeUndefined();
    }
  });

  it('suppresses the two known stale legacy claims', () => {
    // The specific contradictions the Phase 1 reconciliation found. Each is a
    // medication a legacy entry still lists that its record disproves.
    const sanofi = legacyManufacturer.find((p) => p.id === 'sanofi');
    const abbvie = legacyManufacturer.find((p) => p.id === 'abbvie');
    expect(sanofi?.drugs, 'legacy data is unchanged — precedence, not deletion')
      .toContain('Dupixent');
    expect(abbvie?.drugs).toContain('Humira');
    // …and precedence removes both from anything the hub derives from them.
    expect((sanofi?.drugs ?? []).filter((d) => !isResearchedMedication(d)))
      .not.toContain('Dupixent');
    expect((abbvie?.drugs ?? []).filter((d) => !isResearchedMedication(d)))
      .not.toContain('Humira');
  });

  it('leaves no researched medication answerable by the legacy layer', () => {
    // The general form of the rule: after precedence filtering, no legacy
    // manufacturer entry may still name a medication that has a record. This is
    // what fails if a future batch researches a drug and the hub keeps
    // asserting the old claim beside it.
    const leaks: string[] = [];
    for (const p of legacyManufacturer) {
      for (const d of (p.drugs ?? []).filter((x) => !isResearchedMedication(x))) {
        const rec = MEDICATION_ASSISTANCE.find(
          (r) =>
            r.brandName.toLowerCase() === d.toLowerCase() ||
            d.toLowerCase().startsWith(`${r.brandName.toLowerCase()} `),
        );
        if (rec) leaks.push(`${p.id} still claims ${d} (record: ${rec.slug})`);
      }
    }
    expect(leaks).toEqual([]);
  });

  it('covers every researched medication, so the hub can always defer', () => {
    // Precedence is only safe if the record it defers to actually exists.
    for (const d of FEATURED_DRUGS) {
      if (!isResearchedMedication(d.drug)) continue;
      expect(recordForSearch(d.drug), `${d.drug} resolves to a record`).toBeTruthy();
    }
  });

  it('does not over-match short or empty queries', () => {
    expect(recordForSearch('')).toBeUndefined();
    expect(recordForSearch('   ')).toBeUndefined();
    expect(isResearchedMedication('')).toBe(false);
    // A 3-character fragment must not silently claim a medication.
    expect(recordForSearch('eli')).toBeUndefined();
  });
});
