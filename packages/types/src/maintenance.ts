import { z } from 'zod';
import {
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceCategory,
  MaintenanceLocationType,
} from './base';

export const createWorkOrderSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(1000).optional(),
  priority: z
    .nativeEnum(MaintenancePriority)
    .default(MaintenancePriority.MEDIUM),
  category: z
    .nativeEnum(MaintenanceCategory)
    .default(MaintenanceCategory.GENERAL),
  locationType: z.nativeEnum(MaintenanceLocationType),
  locationId: z.string().optional(),
  gateId: z.string().optional(),
  unitId: z.string().optional(),
  projectId: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
});

export type CreateWorkOrderInput = z.infer<typeof createWorkOrderSchema>;

export const updateWorkOrderSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional().nullable(),
  status: z.nativeEnum(MaintenanceStatus).optional(),
  priority: z.nativeEnum(MaintenancePriority).optional(),
  category: z.nativeEnum(MaintenanceCategory).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
});

export type UpdateWorkOrderInput = z.infer<typeof updateWorkOrderSchema>;

export const workOrderQuerySchema = z.object({
  status: z.nativeEnum(MaintenanceStatus).optional(),
  priority: z.nativeEnum(MaintenancePriority).optional(),
  category: z.nativeEnum(MaintenanceCategory).optional(),
  locationType: z.nativeEnum(MaintenanceLocationType).optional(),
  locationId: z.string().optional(),
  reporterId: z.string().optional(),
  assigneeId: z.string().optional(),
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('20'),
});

export type WorkOrderQuery = z.infer<typeof workOrderQuerySchema>;

/**
 * Status transition validation logic.
 * Ensures work orders follow a logical lifecycle.
 */
export const isValidStatusTransition = (
  currentStatus: MaintenanceStatus,
  newStatus: MaintenanceStatus
): boolean => {
  if (currentStatus === newStatus) return true;

  const transitions: Record<MaintenanceStatus, MaintenanceStatus[]> = {
    [MaintenanceStatus.OPEN]: [
      MaintenanceStatus.ASSIGNED,
      MaintenanceStatus.CANCELLED,
    ],
    [MaintenanceStatus.ASSIGNED]: [
      MaintenanceStatus.IN_PROGRESS,
      MaintenanceStatus.CANCELLED,
    ],
    [MaintenanceStatus.IN_PROGRESS]: [
      MaintenanceStatus.PENDING_PARTS,
      MaintenanceStatus.RESOLVED,
      MaintenanceStatus.CANCELLED,
    ],
    [MaintenanceStatus.PENDING_PARTS]: [
      MaintenanceStatus.IN_PROGRESS,
      MaintenanceStatus.CANCELLED,
    ],
    [MaintenanceStatus.RESOLVED]: [
      MaintenanceStatus.CLOSED,
      MaintenanceStatus.IN_PROGRESS, // Re-open if fix didn't hold
    ],
    [MaintenanceStatus.CANCELLED]: [
      MaintenanceStatus.OPEN, // Allow re-opening if cancelled by mistake
    ],
    [MaintenanceStatus.CLOSED]: [], // Terminal state
  };

  return transitions[currentStatus].includes(newStatus);
};
