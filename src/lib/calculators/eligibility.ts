// src/lib/calculators/eligibility.ts — Medicare eligibility + IEP timeline. Pure.
import { computeEnrollmentTimeline, type EnrollmentTimeline } from './timeline';

export type EligibilityStatus = 'esrd' | 'disability' | 'in-iep' | 'before-iep' | 'sep-eligible' | 'missed-iep';

export interface EligibilityInputs {
  employer: boolean;
  ssdi: boolean;
  esrd: boolean;
}

export interface EligibilityResult extends EnrollmentTimeline {
  status: EligibilityStatus;
}

export function computeEligibility(
  birthDate: Date,
  inputs: EligibilityInputs,
  now: Date = new Date(),
): EligibilityResult {
  const t = computeEnrollmentTimeline(birthDate);

  let status: EligibilityStatus;
  if (inputs.esrd) status = 'esrd';
  else if (inputs.ssdi) status = 'disability';
  else if (now >= t.iepStart && now <= t.iepEnd) status = 'in-iep';
  else if (now < t.iepStart) status = 'before-iep';
  else if (inputs.employer) status = 'sep-eligible';
  else status = 'missed-iep';

  return { ...t, status };
}
