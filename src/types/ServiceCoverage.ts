// ---------------------------------------------------------------------------
// src/types/ServiceCoverage.ts — the "does Medicare cover [service]?" graph (M38).
//
// The SERVICES sibling of the drug-coverage graph. Every service is a node with
// the same standardized structure ("is it covered, which part, what you pay,
// the limits"), organized by the kind of care. Distinct intent from the
// drug-COVERAGE pages (medications) and the Dental/Vision/Hearing page — these
// answer "does Medicare cover this medical service?" so they interlink, not
// duplicate. `related` cross-links the services people ask about together.
// ---------------------------------------------------------------------------

export type ServiceCategory = 'preventive' | 'therapy' | 'facility' | 'equipment';

export const SERVICE_CATEGORY_META: Record<ServiceCategory, { label: string; blurb: string }> = {
  preventive: { label: 'Preventive & Wellness', blurb: 'Screenings, the annual wellness visit, mental health, and telehealth.' },
  therapy: { label: 'Therapy & Specialists', blurb: 'Physical therapy, chiropractic, acupuncture, and foot care.' },
  facility: { label: 'Facility & End-of-Life Care', blurb: 'Skilled nursing after a hospital stay, and hospice.' },
  equipment: { label: 'Equipment & Transport', blurb: 'Durable medical equipment and ambulance service.' },
};

/** covered = covered for its medically necessary use · conditional = only under
 *  specific circumstances (e.g. after a 3-day hospital stay) · limited =
 *  generally NOT covered except in narrow cases (e.g. routine vs. medical). */
export type ServiceStatus = 'covered' | 'conditional' | 'limited';

export interface ServiceCoverageEntry {
  /** The service, as people search it — e.g. "Physical Therapy". */
  service: string;
  slug: string;
  category: ServiceCategory;
  /** What it is, one phrase. */
  what: string;
  status: ServiceStatus;
  /** Plain-language answer to "does Medicare cover it?" */
  coveredSummary: string;
  /** The circumstances / details of what's covered. */
  coveredWhen: string;
  /** Which part of Medicare covers it (Part A, Part B, both…). */
  whichPart: string;
  /** What you typically pay (cost-sharing) once covered. */
  whatYouPay: string;
  /** The important limits or exclusions people get wrong. */
  limits: string;
  /** Related service slugs (questions people pair together). */
  related?: string[];
  source: { title: string; url: string };
}
