import { MaintenanceExecutor } from '../maintenance-executor';
import {
  prisma,
  MaintenanceStatus,
  MaintenancePriority,
} from '@gate-access/db';

// Fallback for missing mock enums
const Status = MaintenanceStatus || { OPEN: 'OPEN', ASSIGNED: 'ASSIGNED' };
const Priority = MaintenancePriority || { URGENT: 'URGENT' };

// Mock AiActionService
jest.mock('../ai-action-service', () => ({
  AiActionService: {
    createAction: jest.fn().mockResolvedValue({ id: 'mock-action-id' }),
  },
}));

describe('MaintenanceExecutor', () => {
  const orgId = 'org_123';
  const gateId = 'gate_123';
  const projectId = 'proj_123';

  beforeEach(() => {
    jest.clearAllMocks();

    // Ensure nested mocks are available
    if (!prisma.eventLog.findMany) {
      (prisma.eventLog as any).findMany = jest.fn();
    }
    if (!prisma.vendor) {
      (prisma as any).vendor = {
        findFirst: jest.fn(),
      };
    }
    if (!prisma.workOrder) {
      (prisma as any).workOrder = {
        create: jest.fn(),
      };
    }
  });

  it('should log a SCAN_FAILURE event and not create a work order if below threshold', async () => {
    (prisma.eventLog.create as jest.Mock).mockResolvedValue({ id: 'evt_1' });
    (prisma.eventLog.findMany as jest.Mock).mockResolvedValue([
      { payload: { gateId } }, // Only 1 failure
    ]);

    const result = await MaintenanceExecutor.handleScanFailure({
      organizationId: orgId,
      gateId,
      projectId,
      reason: 'Timeout',
    });

    expect(prisma.eventLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'SCAN_FAILURE',
          organizationId: orgId,
        }),
      })
    );
    expect(result).toBeNull();
  });

  it('should create a WorkOrder and assign a vendor if 3+ failures occur', async () => {
    // 1. Mock EventLog history (3 failures)
    (prisma.eventLog.findMany as jest.Mock).mockResolvedValue([
      { payload: { gateId } },
      { payload: { gateId } },
      { payload: { gateId } },
    ]);

    // 2. Mock Vendor lookup
    const mockVendor = { id: 'vendor_abc', name: 'GateFix Co' };
    (prisma.vendor.findFirst as jest.Mock).mockResolvedValue(mockVendor);

    // 3. Mock Admin user lookup
    const mockAdmin = { id: 'admin_123' };
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(mockAdmin);

    // 4. Mock WorkOrder creation
    const mockWorkOrder = { id: 'wo_999', status: Status.ASSIGNED };
    (prisma.workOrder.create as jest.Mock).mockResolvedValue(mockWorkOrder);

    // 5. Run Executor
    const result = await MaintenanceExecutor.handleScanFailure({
      organizationId: orgId,
      gateId,
      projectId,
      reason: 'Hardware Error',
    });

    // 6. Assertions
    expect(prisma.workOrder.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          vendorId: 'vendor_abc',
          reporterId: 'admin_123',
          status: Status.ASSIGNED,
          priority: Priority.URGENT,
        }),
      })
    );
    expect(result).toEqual(mockWorkOrder);
  });

  it('should create a WorkOrder but leave it OPEN if no vendor is found', async () => {
    // 3 failures
    (prisma.eventLog.findMany as jest.Mock).mockResolvedValue([
      { payload: { gateId } },
      { payload: { gateId } },
      { payload: { gateId } },
    ]);

    // No vendor
    (prisma.vendor.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'admin_123' });

    const mockWorkOrder = { id: 'wo_777', status: Status.OPEN };
    (prisma.workOrder.create as jest.Mock).mockResolvedValue(mockWorkOrder);

    const result = await MaintenanceExecutor.handleScanFailure({
      organizationId: orgId,
      gateId,
      projectId,
      reason: 'General Error',
    });

    expect(prisma.workOrder.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          vendorId: undefined,
          status: Status.OPEN,
        }),
      })
    );
    expect(result).toEqual(mockWorkOrder);
  });
});
