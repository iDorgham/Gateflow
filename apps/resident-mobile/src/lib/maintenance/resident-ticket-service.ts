/**
 * Resident Maintenance Submission and Live Tracking Timeline Service.
 */

export type ResidentMaintenanceCategory =
  'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'CARPENTRY' | 'PAINTING' | 'OTHER';

export interface ResidentTicketInput {
  unitId: string;
  unitNumber: string;
  residentId: string;
  residentName: string;
  category: ResidentMaintenanceCategory;
  description: string;
  isUrgent: boolean;
  photoUrls?: string[];
}

export type TimelineStepKey =
  'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export interface TimelineStep {
  key: TimelineStepKey;
  labelEn: string;
  labelAr: string;
  isCurrent: boolean;
  isCompleted: boolean;
  timestamp?: string;
}

export const TIMELINE_STEPS: {
  key: TimelineStepKey;
  labelEn: string;
  labelAr: string;
}[] = [
  { key: 'SUBMITTED', labelEn: 'Request Submitted', labelAr: 'تم إرسال الطلب' },
  {
    key: 'ASSIGNED',
    labelEn: 'Technician Assigned',
    labelAr: 'تم تعيين الفني',
  },
  {
    key: 'IN_PROGRESS',
    labelEn: 'Work In Progress',
    labelAr: 'العمل قيد التنفيذ',
  },
  {
    key: 'RESOLVED',
    labelEn: 'Issue Resolved',
    labelAr: 'تم الإصلاح والإنهاء',
  },
];

/**
 * Validates resident maintenance ticket submission form.
 */
export function validateResidentTicket(input: Partial<ResidentTicketInput>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.unitId || !input.unitNumber) {
    errors.unit = 'Unit information is required';
  }

  if (!input.residentId || !input.residentName) {
    errors.resident = 'Resident identity is required';
  }

  if (!input.category) {
    errors.category = 'Maintenance category is required';
  }

  if (!input.description || input.description.trim().length < 8) {
    errors.description = 'Please describe the issue in at least 8 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Maps backend work order status to resident timeline progression steps.
 */
export function getResidentTrackingTimeline(
  currentStatus: string,
  statusTimestamps: Record<string, string> = {}
): TimelineStep[] {
  const statusOrder: Record<string, number> = {
    OPEN: 0,
    ASSIGNED: 1,
    IN_PROGRESS: 2,
    PENDING_PARTS: 2, // Maps visually to in progress
    RESOLVED: 3,
    CLOSED: 3,
  };

  const currentIndex =
    statusOrder[currentStatus] !== undefined ? statusOrder[currentStatus] : 0;

  return TIMELINE_STEPS.map((step, idx) => {
    const isCompleted =
      idx < currentIndex ||
      (idx === currentIndex && currentStatus === 'CLOSED');
    const isCurrent = idx === currentIndex && currentStatus !== 'CLOSED';
    const timestamp =
      statusTimestamps[step.key] ||
      (idx === 0 ? statusTimestamps['OPEN'] : undefined);

    return {
      key: step.key,
      labelEn: step.labelEn,
      labelAr: step.labelAr,
      isCurrent,
      isCompleted,
      timestamp,
    };
  });
}
