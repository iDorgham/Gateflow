/**
 * Tests for MENA ROI Calculator Engine — Phase 4
 */

import {
  calculateGateRoi,
  DEFAULT_ROI_INPUT,
  REGION_GUARD_SALARIES,
  REGION_COMPLIANCE_FINE_RISK,
  type RoiCalculatorInput,
} from './roi-calculator-state';

describe('calculateGateRoi()', () => {
  describe('default inputs produce valid output', () => {
    const result = calculateGateRoi(DEFAULT_ROI_INPUT);

    it('returns a positive total annual savings', () => {
      expect(result.totalAnnualSavingsUsd).toBeGreaterThan(0);
    });

    it('returns a positive ROI percent', () => {
      expect(result.roiPercent).toBeGreaterThan(0);
    });

    it('paybackMonths is between 1 and 36', () => {
      expect(result.paybackMonths).toBeGreaterThanOrEqual(1);
      expect(result.paybackMonths).toBeLessThanOrEqual(36);
    });

    it('queueTimeReductionPercent is 85', () => {
      expect(result.queueTimeReductionPercent).toBe(85);
    });

    it('returns laborHoursSavedMonthly > 0', () => {
      expect(result.laborHoursSavedMonthly).toBeGreaterThan(0);
    });

    it('returns guardsFteSaved >= 1', () => {
      expect(result.guardsFteSaved).toBeGreaterThanOrEqual(1);
    });

    it('net benefit = total savings - software cost', () => {
      expect(result.netAnnualBenefitUsd).toBe(
        result.totalAnnualSavingsUsd - result.annualSoftwareCostUsd
      );
    });

    it('breakdown sums to totalAnnualSavingsUsd', () => {
      const { breakdown } = result;
      const sum =
        breakdown.guardLaborSavingsAnnual +
        breakdown.anprVehicleSavingsAnnual +
        breakdown.queueTimeValueAnnual +
        breakdown.paperBadgeSavingsAnnual +
        breakdown.complianceFineRiskMitigatedAnnual +
        breakdown.insurancePremiumReductionAnnual;
      expect(sum).toBe(result.totalAnnualSavingsUsd);
    });
  });

  describe('ANPR toggle', () => {
    it('ANPR disabled sets anprVehicleSavingsAnnual to 0', () => {
      const result = calculateGateRoi({ ...DEFAULT_ROI_INPUT, hasANPR: false });
      expect(result.breakdown.anprVehicleSavingsAnnual).toBe(0);
    });

    it('ANPR enabled increases total savings', () => {
      const withANPR = calculateGateRoi({
        ...DEFAULT_ROI_INPUT,
        hasANPR: true,
      });
      const withoutANPR = calculateGateRoi({
        ...DEFAULT_ROI_INPUT,
        hasANPR: false,
      });
      expect(withANPR.totalAnnualSavingsUsd).toBeGreaterThan(
        withoutANPR.totalAnnualSavingsUsd
      );
    });
  });

  describe('regional guard salary defaults', () => {
    it('SA region uses $800/month guard salary by default', () => {
      expect(REGION_GUARD_SALARIES.SA).toBe(800);
    });

    it('EG region produces lower guard savings than SA region', () => {
      const sa = calculateGateRoi({
        ...DEFAULT_ROI_INPUT,
        region: 'SA',
        averageGuardSalaryMonthly: undefined,
      });
      const eg = calculateGateRoi({
        ...DEFAULT_ROI_INPUT,
        region: 'EG',
        averageGuardSalaryMonthly: undefined,
      });
      expect(sa.breakdown.guardLaborSavingsAnnual).toBeGreaterThan(
        eg.breakdown.guardLaborSavingsAnnual
      );
    });

    it('QA region has the highest compliance fine risk', () => {
      expect(REGION_COMPLIANCE_FINE_RISK.QA).toBeLessThanOrEqual(
        REGION_COMPLIANCE_FINE_RISK.SA
      );
    });
  });

  describe('scaling behavior', () => {
    it('more gates increases software cost', () => {
      const small = calculateGateRoi({ ...DEFAULT_ROI_INPUT, gateCount: 2 });
      const large = calculateGateRoi({ ...DEFAULT_ROI_INPUT, gateCount: 10 });
      expect(large.annualSoftwareCostUsd).toBeGreaterThan(
        small.annualSoftwareCostUsd
      );
    });

    it('more visitors increases labor hours saved', () => {
      const low = calculateGateRoi({
        ...DEFAULT_ROI_INPUT,
        monthlyVisitorVolume: 1000,
      });
      const high = calculateGateRoi({
        ...DEFAULT_ROI_INPUT,
        monthlyVisitorVolume: 50000,
      });
      expect(high.laborHoursSavedMonthly).toBeGreaterThan(
        low.laborHoursSavedMonthly
      );
    });

    it('more units increases insurance premium reduction', () => {
      const small = calculateGateRoi({ ...DEFAULT_ROI_INPUT, unitCount: 50 });
      const large = calculateGateRoi({ ...DEFAULT_ROI_INPUT, unitCount: 1000 });
      expect(large.breakdown.insurancePremiumReductionAnnual).toBeGreaterThan(
        small.breakdown.insurancePremiumReductionAnnual
      );
    });

    it('minimum guard count is clamped to 1', () => {
      const result = calculateGateRoi({
        ...DEFAULT_ROI_INPUT,
        currentGuardCount: 0,
      });
      expect(result.guardsFteSaved).toBeGreaterThanOrEqual(1);
    });
  });

  describe('environmental metrics', () => {
    it('returns positive paperWasteEliminatedKgAnnual', () => {
      const result = calculateGateRoi(DEFAULT_ROI_INPUT);
      expect(result.paperWasteEliminatedKgAnnual).toBeGreaterThan(0);
    });

    it('returns positive co2KgSavedAnnual', () => {
      const result = calculateGateRoi(DEFAULT_ROI_INPUT);
      expect(result.co2KgSavedAnnual).toBeGreaterThan(0);
    });
  });
});
