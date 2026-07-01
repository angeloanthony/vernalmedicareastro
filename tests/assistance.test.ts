import { describe, it, expect } from 'vitest';
import { computeAssistanceEligibility } from '../src/lib/calculators/assistance';
import { figuresFor } from '../src/data/annualMedicareData';

const F = figuresFor(2026); // qmb 1350 / slmb 1616 / qi 1816 (single); resources 9950; EH resources 16590

describe('computeAssistanceEligibility', () => {
  it('low income + low resources → QMB with automatic Extra Help', () => {
    const r = computeAssistanceEligibility(1000, 5000, false, F);
    expect(r.program).toBe('qmb');
    expect(r.withinResources).toBe(true);
    expect(r.extraHelp).toBe('automatic');
  });
  it('steps down SLMB then QI as income rises', () => {
    expect(computeAssistanceEligibility(1500, 5000, false, F).program).toBe('slmb');
    expect(computeAssistanceEligibility(1700, 5000, false, F).program).toBe('qi');
  });
  it('just above QI income → no MSP but Extra Help still possible', () => {
    const r = computeAssistanceEligibility(1900, 5000, false, F);
    expect(r.program).toBe('none');
    expect(r.extraHelp).toBe('possible');
  });
  it('high income → none / unlikely', () => {
    const r = computeAssistanceEligibility(3000, 5000, false, F);
    expect(r.program).toBe('none');
    expect(r.extraHelp).toBe('unlikely');
  });
  it('over the MSP resource limit disqualifies MSP even with low income', () => {
    const r = computeAssistanceEligibility(1000, 12000, false, F);
    expect(r.program).toBe('none'); // 12000 > 9950 MSP resource limit
    expect(r.extraHelp).toBe('possible'); // still under the higher Extra Help resource limit
  });
  it('married uses couple limits', () => {
    // couple qmb 1824 — income 1800 qualifies for a couple but not a single
    expect(computeAssistanceEligibility(1800, 5000, true, F).program).toBe('qmb');
    expect(computeAssistanceEligibility(1800, 5000, false, F).program).toBe('qi');
  });
});
