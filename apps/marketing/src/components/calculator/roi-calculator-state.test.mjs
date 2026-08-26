import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateGateRoi, DEFAULT_ROI_INPUT } from './roi-calculator-state.ts';
import { SOLUTIONS_DATA } from '../../lib/solutions-data.ts';

describe('roi-calculator-state & solutions-data (node:test)', () => {
  it('calculates accurate ROI metrics with default parameters', () => {
    const result = calculateGateRoi(DEFAULT_ROI_INPUT);

    assert.equal(result.queueTimeReductionPercent, 85);
    assert.ok(result.annualSavingsUsd > 10000);
    assert.ok(result.laborHoursSavedMonthly > 0);
    assert.ok(result.paperWasteEliminatedKgAnnual > 0);
    assert.ok(result.roiPaybackMonths <= 12);
  });

  it('scales savings proportionally with higher visitor volume and gate count', () => {
    const smallProperty = calculateGateRoi({
      gateCount: 2,
      monthlyVisitorVolume: 3000,
      currentGuardCount: 4,
      averageGuardSalaryMonthly: 500,
    });

    const largeProperty = calculateGateRoi({
      gateCount: 10,
      monthlyVisitorVolume: 50000,
      currentGuardCount: 20,
      averageGuardSalaryMonthly: 700,
    });

    assert.ok(largeProperty.annualSavingsUsd > smallProperty.annualSavingsUsd);
    assert.ok(
      largeProperty.laborHoursSavedMonthly >
        smallProperty.laborHoursSavedMonthly
    );
  });

  it('provides complete localized data for all vertical solutions', () => {
    const verticals = ['compounds', 'commercial', 'events'];

    for (const key of verticals) {
      const sol = SOLUTIONS_DATA[key];
      assert.ok(sol, `Solution data exists for ${key}`);
      assert.ok(sol.titleEn.length > 0);
      assert.ok(sol.titleAr.length > 0);
      assert.equal(sol.keyBenefitsEn.length, 3);
      assert.equal(sol.keyBenefitsAr.length, 3);
      assert.equal(sol.metricsEn.length, 3);
      assert.equal(sol.metricsAr.length, 3);
    }
  });
});
