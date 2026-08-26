// tests/medication-assistance.test.ts — invariants for the Prescription
// Assistance data layer (docs/PRESCRIPTION-ASSISTANCE-PROJECT.md).
//
// These guard the rules that make the pages trustworthy rather than the
// content itself: one canonical page per medication, every claim sourced and
// dated, honest program status, no forbidden marketing language, and every
// internal link pointing at a page the registry knows about.

import { describe, it, expect } from 'vitest';
import {
  MEDICATION_ASSISTANCE,
  assistanceHref,
  extraHelpProgram,
  KEY_TERMS,
  taxonomyTags,
} from '../src/data/medicationAssistance';
import { ASSISTANCE_CATEGORIES, categoriesFor } from '../src/data/medicationAssistance/categories';
import { DRUG_CLASSES } from '../src/data/medicationAssistance/drugClasses';
import { FEATURED_DRUGS } from '../src/data/drugs';
import { PAGE_INDEX } from '../src/data/pageIndex';
import { CONDITIONS } from '../src/data/conditions';
import type { MedicationAssistanceRecord } from '../src/types/MedicationAssistance';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FORBIDDEN = /\b(best|top|#1)\b/i; // CMS superlative rule + spec §21
const registered = new Set(PAGE_INDEX.map((e) => e.href));
const drugSlugs = new Set(FEATURED_DRUGS.map((d) => d.slug));
const categoryKeys = new Set(ASSISTANCE_CATEGORIES.map((c) => c.key));
const drugClassKeys = new Set<string>(DRUG_CLASSES.map((c) => c.key));
const conditionKeys = new Set<string>(CONDITIONS.map((c) => c.key));

/** Every string reachable from a record. */
function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
  return out;
}

describe('medication assistance registry', () => {
  it('has records', () => {
    expect(MEDICATION_ASSISTANCE.length).toBeGreaterThan(0);
  });

  it('gives every record one canonical page that already exists (no duplicates)', () => {
    const seen = new Set<string>();
    for (const r of MEDICATION_ASSISTANCE) {
      expect(drugSlugs.has(r.slug), `${r.slug} is not a FEATURED_DRUGS slug`).toBe(true);
      expect(seen.has(r.slug), `duplicate record for ${r.slug}`).toBe(false);
      seen.add(r.slug);
      expect(registered.has(assistanceHref(r.slug))).toBe(true);
    }
  });

  it('builds the Extra Help program from the data layer with dated sources', () => {
    const eh = extraHelpProgram();
    expect(eh.kind).toBe('government');
    expect(eh.sources.length).toBeGreaterThanOrEqual(3);
    for (const s of eh.sources) expect(s.checked).toMatch(ISO_DATE);
    expect(KEY_TERMS.length).toBeGreaterThanOrEqual(4);
  });
});

describe.each(MEDICATION_ASSISTANCE.map((r): [string, MedicationAssistanceRecord] => [r.brandName, r]))(
  '%s record',
  (_name, r) => {
    it('carries a verification date, publish date and video frame', () => {
      expect(r.lastVerified).toMatch(ISO_DATE);
      expect(r.datePublished).toMatch(ISO_DATE);
      expect(r.video.title).toContain(r.brandName);
      if (r.video.status === 'coming-soon') expect(r.video.youtubeId).toBeUndefined();
      if (r.video.status === 'published') expect(r.video.youtubeId).toBeTruthy();
    });

    it('classifies on both taxonomy axes with valid keys', () => {
      // Axis 1 — clinical condition (load-bearing: charitable-fund matching).
      expect(r.conditions.length).toBeGreaterThan(0);
      for (const c of r.conditions) expect(conditionKeys.has(c), `condition ${c}`).toBe(true);
      // Axis 2 — pharmacological class.
      expect(r.drugClass.length).toBeGreaterThan(0);
      for (const c of r.drugClass) expect(drugClassKeys.has(c), `drug class ${c}`).toBe(true);
      // Browse categories are DERIVED, never stored on the record.
      expect(Object.hasOwn(r, 'categories'), 'record still carries a categories field').toBe(false);
    });

    it('derives at least one valid browse category from those axes', () => {
      const derived = categoriesFor(r);
      expect(derived.length).toBeGreaterThan(0);
      for (const c of derived) expect(categoryKeys.has(c), `category ${c}`).toBe(true);
      expect(new Set(derived).size, 'duplicate derived category').toBe(derived.length);
    });

    it('produces taxonomy tags with no duplicates', () => {
      const tags = taxonomyTags(r, ['drug-assistance', 'part-d', 'prescription-assistance']);
      expect(new Set(tags).size, `duplicate tags: ${tags.join(', ')}`).toBe(tags.length);
      // A browse category is a view, never a tag.
      for (const c of categoriesFor(r)) {
        if (!conditionKeys.has(c) && !drugClassKeys.has(c)) {
          expect(tags.includes(c), `category ${c} leaked into tags`).toBe(false);
        }
      }
    });

    it('checked TotalAssist and HealthWell independently, and documented the result', () => {
      const ids = r.programs.map((p) => p.id);
      expect(ids.some((id) => id.startsWith('totalassist')), 'no TotalAssist finding').toBe(true);
      expect(ids.some((id) => id.startsWith('healthwell')), 'no HealthWell finding').toBe(true);
      expect(r.charitableSummary.length).toBeGreaterThan(40);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('distinguishes program kinds and never lets a commercial copay card claim Medicare eligibility', () => {
      const kinds = new Set(r.programs.map((p) => p.kind));
      expect(kinds.has('manufacturer-savings') || kinds.has('manufacturer-pap')).toBe(true);
      for (const p of r.programs) {
        if (p.kind === 'manufacturer-savings' && /copay|savings/i.test(p.name)) {
          expect(p.medicare, `${p.name} must not present a copay card as Medicare-eligible`).not.toBe('eligible');
        }
      }
    });

    it('sources every program claim with a dated official URL', () => {
      for (const p of r.programs) {
        expect(p.sources.length, `${p.name} has no source`).toBeGreaterThan(0);
        for (const s of p.sources) {
          expect(s.url).toMatch(/^https:\/\//);
          expect(s.checked).toMatch(ISO_DATE);
          expect(s.publisher.length).toBeGreaterThan(0);
        }
        if (p.applyUrl) expect(p.applyUrl).toMatch(/^https:\/\//);
        if (p.phone) expect(p.phone).toMatch(/^[0-9()\- ]+$/);
        expect(p.statusNote.length, `${p.name} needs a status note`).toBeGreaterThan(10);
        expect(p.medicareNote.length, `${p.name} needs a Medicare note`).toBeGreaterThan(10);
      }
      expect(r.sources.length).toBeGreaterThanOrEqual(5);
      for (const s of r.sources) expect(s.checked).toMatch(ISO_DATE);
    });

    it('has the seven-step application guide, a checklist, alternatives and FAQs', () => {
      expect(r.applicationSteps).toHaveLength(7);
      expect(r.applicationSteps[6].title.toLowerCase()).toContain('closed');
      expect(r.documentsNeeded.length).toBeGreaterThanOrEqual(4);
      expect(r.ifUnavailable.length).toBeGreaterThanOrEqual(4);
      expect(r.faqs.length).toBeGreaterThanOrEqual(4);
      expect(r.quickAnswer.points.length).toBeGreaterThanOrEqual(3);
    });

    it('links only to pages the registry knows about', () => {
      for (const x of r.relatedResources) expect(registered.has(x.href), `unregistered ${x.href}`).toBe(true);
      for (const slug of r.relatedMedications) expect(drugSlugs.has(slug), `unknown medication ${slug}`).toBe(true);
      for (const a of r.ifUnavailable) {
        if (a.href && a.href.startsWith('/')) expect(registered.has(a.href), `unregistered ${a.href}`).toBe(true);
      }
      for (const f of r.faqs) {
        for (const m of f.answer.matchAll(/href="(\/[^"]+)"/g)) {
          expect(registered.has(m[1]), `unregistered FAQ link ${m[1]}`).toBe(true);
        }
      }
    });

    it('contains no forbidden superlative marketing language', () => {
      const offenders = strings(r).filter((s) => FORBIDDEN.test(s));
      expect(offenders, offenders.join('\n')).toEqual([]);
    });

    it('never guarantees a grant or approval', () => {
      const offenders = strings(r).filter((s) => /\b(guaranteed approval|you will receive a grant|you can get a grant)\b/i.test(s));
      expect(offenders).toEqual([]);
    });
  },
);
