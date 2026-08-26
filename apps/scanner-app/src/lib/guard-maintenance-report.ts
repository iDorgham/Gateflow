/**
 * Guard Quick-Report Generator for Gate Hardware Faults.
 */

export type GateHardwareFaultType =
  | 'BARRIER_ARM_JAMMED'
  | 'LOOP_DETECTOR_FAULT'
  | 'SCANNER_HARDWARE_FAILURE'
  | 'GATE_LIGHTING_OUT'
  | 'BOLLARD_MALFUNCTION'
  | 'OTHER';

export interface GuardMaintenanceReportInput {
  gateId: string;
  gateName: string;
  guardId: string;
  guardName: string;
  faultType: GateHardwareFaultType;
  notes?: string;
  timestamp?: string;
}

export interface GeneratedGateWorkOrder {
  titleEn: string;
  titleAr: string;
  description: string;
  priority: 'URGENT';
  category: 'GATE_HARDWARE';
  assetType: 'GATE';
  assetId: string;
  assetName: string;
  reportedByGuardId: string;
  reportedByGuardName: string;
  createdAt: string;
}

export const FAULT_TYPE_METADATA: Record<
  GateHardwareFaultType,
  {
    labelEn: string;
    labelAr: string;
    defaultTitleEn: string;
    defaultTitleAr: string;
  }
> = {
  BARRIER_ARM_JAMMED: {
    labelEn: 'Barrier Arm Jammed / Broken',
    labelAr: 'عطل / كسر في ذراع البوابة',
    defaultTitleEn: 'Barrier Arm Jammed',
    defaultTitleAr: 'تعطل ذراع البوابة',
  },
  LOOP_DETECTOR_FAULT: {
    labelEn: 'Ground Loop Detector Fault',
    labelAr: 'عطل في حساس الأرضية للسيارات',
    defaultTitleEn: 'Ground Loop Detector Failure',
    defaultTitleAr: 'عطل حساس الأرضية',
  },
  SCANNER_HARDWARE_FAILURE: {
    labelEn: 'Scanner Hardware / Camera Failure',
    labelAr: 'عطل في جهاز المسح أو الكاميرا',
    defaultTitleEn: 'Scanner Hardware Malfunction',
    defaultTitleAr: 'عطل بجهاز المسح',
  },
  GATE_LIGHTING_OUT: {
    labelEn: 'Gate Lighting / Visibility Out',
    labelAr: 'انقطاع إضاءة كابينة البوابة',
    defaultTitleEn: 'Gate Lane Lighting Outage',
    defaultTitleAr: 'انقطاع إضاءة مسار البوابة',
  },
  BOLLARD_MALFUNCTION: {
    labelEn: 'Automatic Bollard Failure',
    labelAr: 'عطل في الحواجز الهيدروليكية',
    defaultTitleEn: 'Automatic Bollard Failure',
    defaultTitleAr: 'عطل الحواجز الهيدروليكية',
  },
  OTHER: {
    labelEn: 'Other Gate Hardware Issue',
    labelAr: 'مشكلة أخرى في أجهزة البوابة',
    defaultTitleEn: 'Gate Hardware Fault',
    defaultTitleAr: 'بلاغ صيانة أجهزة البوابة',
  },
};

/**
 * Creates a high-priority urgent work order payload from a guard's quick fault report.
 */
export function createGuardHardwareReport(
  input: GuardMaintenanceReportInput
): GeneratedGateWorkOrder {
  const meta =
    FAULT_TYPE_METADATA[input.faultType] || FAULT_TYPE_METADATA.OTHER;
  const timestamp = input.timestamp || new Date().toISOString();

  const titleEn = `[URGENT] ${meta.defaultTitleEn} - ${input.gateName}`;
  const titleAr = `[عاجل] ${meta.defaultTitleAr} - ${input.gateName}`;

  const description = [
    `Fault Category: ${meta.labelEn} / ${meta.labelAr}`,
    `Reported at Gate: ${input.gateName} (ID: ${input.gateId})`,
    `Reporting Guard: ${input.guardName} (ID: ${input.guardId})`,
    input.notes
      ? `Guard Notes: ${input.notes}`
      : 'No additional guard notes provided.',
  ].join('\n');

  return {
    titleEn,
    titleAr,
    description,
    priority: 'URGENT',
    category: 'GATE_HARDWARE',
    assetType: 'GATE',
    assetId: input.gateId,
    assetName: input.gateName,
    reportedByGuardId: input.guardId,
    reportedByGuardName: input.guardName,
    createdAt: timestamp,
  };
}

/**
 * Returns localized fault types for guard selection menu.
 */
export function getLocalizedFaultTypes(
  locale: 'en' | 'ar' = 'en'
): Array<{ type: GateHardwareFaultType; label: string }> {
  const isAr = locale === 'ar';
  return (Object.keys(FAULT_TYPE_METADATA) as GateHardwareFaultType[]).map(
    (type) => ({
      type,
      label: isAr
        ? FAULT_TYPE_METADATA[type].labelAr
        : FAULT_TYPE_METADATA[type].labelEn,
    })
  );
}
