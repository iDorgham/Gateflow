import { TicketTriageService } from '../ticket-triage-service';
import { MaintenanceCategory, MaintenancePriority } from '@gate-access/db';

const mockWorkOrderCreate = jest.fn();
const mockVendorFindFirst = jest.fn();
const mockCreateAction = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    workOrder: { create: (...args: unknown[]) => mockWorkOrderCreate(...args) },
    vendor: { findFirst: (...args: unknown[]) => mockVendorFindFirst(...args) },
  },
  MaintenanceCategory: {
    GENERAL: 'GENERAL',
    HARDWARE: 'HARDWARE',
    ELECTRICAL: 'ELECTRICAL',
    PLUMBING: 'PLUMBING',
    HVAC: 'HVAC',
  },
  MaintenancePriority: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
  },
  MaintenanceStatus: {
    OPEN: 'OPEN',
    ASSIGNED: 'ASSIGNED',
  },
  MaintenanceLocationType: {
    GENERAL: 'GENERAL',
    GATE: 'GATE',
  },
}));

jest.mock('../ai-action-service', () => ({
  AiActionService: {
    createAction: (...args: unknown[]) => mockCreateAction(...args),
  },
}));

describe('TicketTriageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeRequestText()', () => {
    it('correctly classifies urgent hardware issues for gate barrier failures', () => {
      const result = TicketTriageService.analyzeRequestText(
        'Urgent: Main exit barrier gate is stuck open and camera is offline!'
      );

      expect(result.category).toBe(MaintenanceCategory.HARDWARE);
      expect(result.priority).toBe(MaintenancePriority.URGENT);
      expect(result.urgencyScore).toBeGreaterThanOrEqual(90);
    });

    it('correctly classifies electrical issues', () => {
      const result = TicketTriageService.analyzeRequestText(
        'Power outage at guard house, lights and short circuit observed.'
      );

      expect(result.category).toBe(MaintenanceCategory.ELECTRICAL);
    });
  });

  describe('triageAndDispatch()', () => {
    it('creates a WorkOrder and assigns a vendor automatically', async () => {
      mockVendorFindFirst.mockResolvedValue({
        id: 'v_101',
        name: 'Apex Gate Systems',
      });
      mockWorkOrderCreate.mockResolvedValue({
        id: 'wo_555',
        status: 'ASSIGNED',
      });

      const res = await TicketTriageService.triageAndDispatch({
        organizationId: 'org_1',
        reporterId: 'user_1',
        description: 'Main barrier arm is jammed and failing ANPR scans.',
        gateId: 'gate_1',
      });

      expect(res.workOrder.id).toBe('wo_555');
      expect(res.assignedVendor?.name).toBe('Apex Gate Systems');
      expect(mockCreateAction).toHaveBeenCalled();
    });
  });
});
