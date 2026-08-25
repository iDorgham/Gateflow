/**
 * Work Order Lifecycle State Machine, SLA Calculator, and Validation Engine.
 */

export type WorkOrderStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PENDING_PARTS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type WorkOrderCategory =
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'HVAC'
  | 'GATE_HARDWARE'
  | 'ELEVATOR'
  | 'LANDSCAPING'
  | 'GENERAL';

export const SLA_TARGET_HOURS: Record<WorkOrderPriority, number> = {
  URGENT: 4,
  HIGH: 24,
  MEDIUM: 48,
  LOW: 96,
};

const VALID_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  OPEN: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['PENDING_PARTS', 'RESOLVED', 'CANCELLED'],
  PENDING_PARTS: ['IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS'], // Can reopen to IN_PROGRESS if issue persists
  CLOSED: [], // Terminal state
  CANCELLED: [], // Terminal state
};

/**
 * Evaluates whether a requested work order status transition is permissible.
 */
export function isValidStatusTransition(
  currentStatus: WorkOrderStatus,
  nextStatus: WorkOrderStatus,
  isSupervisor: boolean = false
): { allowed: boolean; reason?: string } {
  if (currentStatus === nextStatus) {
    return { allowed: true };
  }

  // Supervisors can reopen closed tickets
  if (
    isSupervisor &&
    currentStatus === 'CLOSED' &&
    nextStatus === 'IN_PROGRESS'
  ) {
    return { allowed: true };
  }

  const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
  if (allowedNext.includes(nextStatus)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `Illegal transition from ${currentStatus} to ${nextStatus}. Allowed: [${allowedNext.join(', ')}]`,
  };
}

export interface SlaCalculationResult {
  targetHours: number;
  deadline: Date;
  isBreached: boolean;
  hoursRemaining: number;
  formattedRemaining: string;
}

/**
 * Calculates remaining SLA resolution time and breach status.
 */
export function calculateSlaStatus(
  createdAt: Date | string,
  priority: WorkOrderPriority,
  now: Date = new Date()
): SlaCalculationResult {
  const createdDate =
    typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const targetHours = SLA_TARGET_HOURS[priority] || 48;
  const deadline = new Date(
    createdDate.getTime() + targetHours * 60 * 60 * 1000
  );

  const diffMs = deadline.getTime() - now.getTime();
  const hoursRemaining = diffMs / (1000 * 60 * 60);
  const isBreached = hoursRemaining <= 0;

  let formattedRemaining: string;
  if (isBreached) {
    const overdueHours = Math.abs(Math.floor(hoursRemaining));
    formattedRemaining = `Breached by ${overdueHours}h`;
  } else if (hoursRemaining < 1) {
    const minsRemaining = Math.max(1, Math.floor(hoursRemaining * 60));
    formattedRemaining = `${minsRemaining}m remaining`;
  } else {
    formattedRemaining = `${Math.floor(hoursRemaining)}h remaining`;
  }

  return {
    targetHours,
    deadline,
    isBreached,
    hoursRemaining: Number(hoursRemaining.toFixed(2)),
    formattedRemaining,
  };
}

export interface WorkOrderCreationInput {
  title: string;
  description: string;
  priority: WorkOrderPriority;
  category: WorkOrderCategory;
  organizationId: string;
  gateId?: string;
  unitId?: string;
}

/**
 * Validates work order creation payloads.
 */
export function validateWorkOrderCreation(
  input: Partial<WorkOrderCreationInput>
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long';
  }

  if (!input.description || input.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (!input.priority || !SLA_TARGET_HOURS[input.priority]) {
    errors.priority =
      'Valid priority level is required (LOW, MEDIUM, HIGH, URGENT)';
  }

  if (!input.category) {
    errors.category = 'Category is required';
  }

  if (!input.organizationId) {
    errors.organizationId = 'Organization scope ID is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
