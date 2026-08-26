/**
 * ROI and operational savings calculation engine for GateFlow marketing pages.
 */

export interface RoiCalculatorInput {
  gateCount: number;
  monthlyVisitorVolume: number;
  currentGuardCount: number;
  averageGuardSalaryMonthly?: number; // USD default: $600
}

export interface RoiCalculatorResult {
  annualSavingsUsd: number;
  queueTimeReductionPercent: number;
  laborHoursSavedMonthly: number;
  paperWasteEliminatedKgAnnual: number;
  roiPaybackMonths: number;
}

export const DEFAULT_ROI_INPUT: RoiCalculatorInput = {
  gateCount: 4,
  monthlyVisitorVolume: 10000,
  currentGuardCount: 8,
  averageGuardSalaryMonthly: 600,
};

/**
 * Calculates financial and operational ROI metrics based on property size.
 */
export function calculateGateRoi(
  input: RoiCalculatorInput = DEFAULT_ROI_INPUT
): RoiCalculatorResult {
  const gates = Math.max(1, input.gateCount);
  const monthlyVisitors = Math.max(100, input.monthlyVisitorVolume);
  const guards = Math.max(1, input.currentGuardCount);
  const guardSalary = input.averageGuardSalaryMonthly ?? 600;

  // Manual check-in takes ~45 seconds vs 4 seconds with digital QR pass (91% reduction)
  const queueTimeReductionPercent = 85;

  // Time saved per visitor = 40 seconds (0.0111 hours)
  const laborHoursSavedMonthly = Math.round((monthlyVisitors * 40) / 3600);

  // Guard efficiency gain allows 25-35% staff re-allocation to perimeter patrols
  const guardOptimizationCount = Math.max(1, Math.floor(guards * 0.3));
  const annualGuardSavings = guardOptimizationCount * guardSalary * 12;

  // Paper visitor logs and badge printing costs ($0.05 per visitor)
  const annualPaperBadgeSavings = Math.round(monthlyVisitors * 0.05 * 12);
  const annualSavingsUsd = annualGuardSavings + annualPaperBadgeSavings;

  // Environmental impact: ~5g paper per manual visitor receipt
  const paperWasteEliminatedKgAnnual = Math.round(monthlyVisitors * 12 * 0.005);

  // Estimated platform subscription cost based on gates ($120/gate/mo)
  const annualSoftwareCost = gates * 120 * 12;
  const roiPaybackMonths = Math.max(
    1,
    Math.min(
      12,
      Number(((annualSoftwareCost / annualSavingsUsd) * 12).toFixed(1))
    )
  );

  return {
    annualSavingsUsd,
    queueTimeReductionPercent,
    laborHoursSavedMonthly,
    paperWasteEliminatedKgAnnual,
    roiPaybackMonths,
  };
}
