// src/lib/calculators/assistance.ts — Extra Help / Medicare Savings Program
// eligibility ESTIMATE. Pure. Uses the year's limits from annualMedicareData.
// This is an estimate to encourage applying (free) — not a determination.
import type { MedicareFigures } from '../../types/MedicareFigures';

export type MspProgram = 'qmb' | 'slmb' | 'qi' | 'none';
export type ExtraHelpLikelihood = 'automatic' | 'possible' | 'unlikely';

export interface AssistanceResult {
  /** The most generous Medicare Savings Program the income/resources suggest. */
  program: MspProgram;
  /** Whether resources are within the MSP limit. */
  withinResources: boolean;
  /** Extra Help outlook: automatic if on an MSP, possible if close, else unlikely. */
  extraHelp: ExtraHelpLikelihood;
  /** The monthly income limit that applied for the qualifying (or nearest) program. */
  incomeLimitUsed: number;
  resourceLimitUsed: number;
}

/** Estimate MSP + Extra Help eligibility from monthly income and countable
 *  resources. MSP eligibility grants Extra Help automatically; Extra Help also
 *  reaches somewhat higher incomes with a higher resource limit. */
export function computeAssistanceEligibility(
  monthlyIncome: number,
  resources: number,
  married: boolean,
  figures: MedicareFigures,
): AssistanceResult {
  const msp = figures.medicareSavingsPrograms;
  const income = Math.max(0, monthlyIncome);
  const res = Math.max(0, resources);

  const resourceLimit = married ? msp.resources.couple : msp.resources.individual;
  const withinResources = res <= resourceLimit;
  const qmbL = married ? msp.qmb.couple : msp.qmb.individual;
  const slmbL = married ? msp.slmb.couple : msp.slmb.individual;
  const qiL = married ? msp.qi.couple : msp.qi.individual;

  let program: MspProgram = 'none';
  if (withinResources) {
    if (income <= qmbL) program = 'qmb';
    else if (income <= slmbL) program = 'slmb';
    else if (income <= qiL) program = 'qi';
  }

  const ehResLimit = married ? figures.extraHelp.resourcesCouple : figures.extraHelp.resourcesIndividual;
  // Extra Help income ceiling is roughly ~11% above the QI (135% FPL) limit.
  const ehIncomeCeiling = qiL * 1.11;
  let extraHelp: ExtraHelpLikelihood;
  if (program !== 'none') extraHelp = 'automatic';
  else if (income <= ehIncomeCeiling && res <= ehResLimit) extraHelp = 'possible';
  else extraHelp = 'unlikely';

  const incomeLimitUsed = program === 'qmb' ? qmbL : program === 'slmb' ? slmbL : qiL;

  return { program, withinResources, extraHelp, incomeLimitUsed, resourceLimitUsed: resourceLimit };
}
