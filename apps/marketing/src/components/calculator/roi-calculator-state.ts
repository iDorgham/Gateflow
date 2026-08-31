/**
 * MENA Real Estate Security ROI & Headcount Savings Calculator Engine
 * Phase 4 — GateFlow v9.0_ENHANCED_BLUEPRINT
 *
 * Covers: guard labor, incident response, paper/badge printing, ANPR savings,
 * visitor queue time, compliance fines avoided, and insurance premium reductions.
 */

// ─── Input ───────────────────────────────────────────────────────────────────

export type PropertyType =
  | 'gated_community'
  | 'compound'
  | 'office_tower'
  | 'mixed_use'
  | 'industrial_park';

export type RegionCode = 'SA' | 'AE' | 'EG' | 'QA' | 'KW' | 'BH' | 'OM' | 'JO';

/** Monthly guard salary by region (USD) */
export const REGION_GUARD_SALARIES: Record<RegionCode, number> = {
  SA: 800,
  AE: 900,
  EG: 300,
  QA: 1000,
  KW: 950,
  BH: 700,
  OM: 650,
  JO: 380,
};

/** Annual compliance fine risk (USD) for non-digital visitor log — Law 151 / PDPL */
export const REGION_COMPLIANCE_FINE_RISK: Record<RegionCode, number> = {
  SA: 20000,
  AE: 15000,
  EG: 10000,
  QA: 18000,
  KW: 12000,
  BH: 10000,
  OM: 8000,
  JO: 5000,
};

export interface RoiCalculatorInput {
  // Property
  propertyType: PropertyType;
  gateCount: number;
  unitCount: number;

  // Traffic
  monthlyVisitorVolume: number;
  monthlyVehicleCount: number;

  // Headcount
  currentGuardCount: number;
  averageGuardSalaryMonthly?: number; // override (USD)

  // Region
  region: RegionCode;

  // Optional feature toggles (affects savings model)
  hasANPR?: boolean;
  hasWalletPasses?: boolean;
}

export const DEFAULT_ROI_INPUT: RoiCalculatorInput = {
  propertyType: 'gated_community',
  gateCount: 4,
  unitCount: 200,
  monthlyVisitorVolume: 10000,
  monthlyVehicleCount: 5000,
  currentGuardCount: 8,
  averageGuardSalaryMonthly: undefined, // use region default
  region: 'SA',
  hasANPR: true,
  hasWalletPasses: true,
};

// ─── Output ──────────────────────────────────────────────────────────────────

export interface RoiSavingsBreakdown {
  guardLaborSavingsAnnual: number;
  anprVehicleSavingsAnnual: number;
  queueTimeValueAnnual: number;
  paperBadgeSavingsAnnual: number;
  complianceFineRiskMitigatedAnnual: number;
  insurancePremiumReductionAnnual: number;
}

export interface RoiCalculatorResult {
  // Totals
  totalAnnualSavingsUsd: number;
  annualSoftwareCostUsd: number;
  netAnnualBenefitUsd: number;
  roiPercent: number;
  paybackMonths: number;

  // Operational
  queueTimeReductionPercent: number;
  laborHoursSavedMonthly: number;
  guardsFteSaved: number; // reallocated to patrol

  // Environmental
  paperWasteEliminatedKgAnnual: number;
  co2KgSavedAnnual: number;

  // Breakdown
  breakdown: RoiSavingsBreakdown;
}

// ─── Engine ──────────────────────────────────────────────────────────────────

/**
 * Calculates comprehensive MENA real estate security ROI metrics.
 * All monetary values are USD.
 */
export function calculateGateRoi(
  input: RoiCalculatorInput = DEFAULT_ROI_INPUT
): RoiCalculatorResult {
  const gates = Math.max(1, input.gateCount);
  const units = Math.max(10, input.unitCount);
  const monthlyVisitors = Math.max(100, input.monthlyVisitorVolume);
  const monthlyVehicles = Math.max(0, input.monthlyVehicleCount);
  const guards = Math.max(1, input.currentGuardCount);
  const region = input.region;

  const guardSalary =
    input.averageGuardSalaryMonthly ?? REGION_GUARD_SALARIES[region] ?? 600;

  // ── 1. Guard Labor Savings ──
  // GateFlow reduces manual check-in workload by ~30% per gate.
  // Guards are reallocated to patrols rather than eliminated.
  const guardsFteSaved = Math.max(1, Math.floor(guards * 0.3));
  const guardLaborSavingsAnnual = guardsFteSaved * guardSalary * 12;

  // ── 2. ANPR Vehicle Processing Savings ──
  // Manual vehicle log: ~3 min. ANPR: ~8 sec. Saved time valued at guard hourly rate.
  let anprVehicleSavingsAnnual = 0;
  if (input.hasANPR) {
    const guardHourlyRate = guardSalary / 176; // avg working hours/month
    const minutesSavedPerVehicle = 2.8; // 3min → 8s ≈ 2.8min saved
    const hoursSavedMonthly = (monthlyVehicles * minutesSavedPerVehicle) / 60;
    anprVehicleSavingsAnnual = Math.round(
      hoursSavedMonthly * guardHourlyRate * 12
    );
  }

  // ── 3. Visitor Queue Time Value ──
  // Each visitor saves ~40 sec. Value = minimum wage equivalent ($4/hr for MENA avg).
  const visitorTimeValuePerHour = 4; // USD
  const laborHoursSavedMonthly = Math.round((monthlyVisitors * 40) / 3600);
  const queueTimeValueAnnual = Math.round(
    laborHoursSavedMonthly * visitorTimeValuePerHour * 12
  );
  const queueTimeReductionPercent = 85;

  // ── 4. Paper & Badge Printing ──
  // ~$0.05 per visitor (paper, badge, printer ink, archiving)
  const paperBadgeSavingsAnnual = Math.round(monthlyVisitors * 0.05 * 12);

  // ── 5. Compliance Fine Risk Mitigation ──
  // Egyptian Law 151 / Saudi PDPL: up to $20K fine for paper PII logs.
  // GateFlow digital logs + audit trail reduces risk by ~80%.
  const fineRisk = REGION_COMPLIANCE_FINE_RISK[region] ?? 10000;
  const complianceFineRiskMitigatedAnnual = Math.round(fineRisk * 0.8);

  // ── 6. Insurance Premium Reduction ──
  // Verified access control systems yield 5-10% reduction on property security insurance.
  // Estimated at $15/unit/year insurance saving.
  const insurancePremiumReductionAnnual = Math.round(units * 15);

  const breakdown: RoiSavingsBreakdown = {
    guardLaborSavingsAnnual,
    anprVehicleSavingsAnnual,
    queueTimeValueAnnual,
    paperBadgeSavingsAnnual,
    complianceFineRiskMitigatedAnnual,
    insurancePremiumReductionAnnual,
  };

  const totalAnnualSavingsUsd =
    guardLaborSavingsAnnual +
    anprVehicleSavingsAnnual +
    queueTimeValueAnnual +
    paperBadgeSavingsAnnual +
    complianceFineRiskMitigatedAnnual +
    insurancePremiumReductionAnnual;

  // Software cost: $120/gate/month + $2/unit/month
  const annualSoftwareCostUsd = gates * 120 * 12 + units * 2 * 12;
  const netAnnualBenefitUsd = totalAnnualSavingsUsd - annualSoftwareCostUsd;
  const roiPercent = Math.round(
    (netAnnualBenefitUsd / annualSoftwareCostUsd) * 100
  );
  const paybackMonths = Math.max(
    1,
    Math.min(
      36,
      Math.round((annualSoftwareCostUsd / totalAnnualSavingsUsd) * 12)
    )
  );

  // ── Environmental ──
  // 5g paper per manual visitor receipt, 12 months
  const paperWasteEliminatedKgAnnual = Math.round(monthlyVisitors * 12 * 0.005);
  // Printing CO₂ ≈ 6g per A4 sheet (toner); visitor badge ≈ 1 sheet
  const co2KgSavedAnnual = Math.round(monthlyVisitors * 12 * 0.006);

  return {
    totalAnnualSavingsUsd,
    annualSoftwareCostUsd,
    netAnnualBenefitUsd,
    roiPercent,
    paybackMonths,
    queueTimeReductionPercent,
    laborHoursSavedMonthly,
    guardsFteSaved,
    paperWasteEliminatedKgAnnual,
    co2KgSavedAnnual,
    breakdown,
  };
}
