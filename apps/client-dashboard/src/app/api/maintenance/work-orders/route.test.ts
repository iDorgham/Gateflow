import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { MaintenanceStatus, MaintenancePriority, MaintenanceCategory, MaintenanceLocationType } from '@gate-access/types';

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockWorkOrderFindMany = jest.fn();
const mockWorkOrderCount = jest.fn();
const mockWorkOrderCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    workOrder: {
      findMany: (...args: unknown[]) => mockWorkOrderFindMany(...args),
      count: (...args: unknown[]) => mockWorkOrderCount(...args),
      create: (...args: unknown[]) => mockWorkOrderCreate(...args),
    },
    gate: {
      findFirst: jest.fn(),
    },
    unit: {
      findFirst: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
    },
  },
}));

describe('Maintenance Work Orders API', () => {
  let GET: (req: NextRequest) => Promise<NextResponse>;
  let POST: (req: NextRequest) => Promise<NextResponse>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
    POST = mod.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/maintenance/work-orders', () => {
    it('returns 401 when session has no orgId', async () => {
      mockGetSessionClaims.mockResolvedValue(null);
      const req = new NextRequest('http://localhost/api/maintenance/work-orders');
      const res = await GET(req);
      expect(res.status).toBe(401);
    });

    it('scopes work orders by organizationId and status', async () => {
      const orgId = 'org_123';
      mockGetSessionClaims.mockResolvedValue({ orgId, sub: 'user_1' });
      mockWorkOrderFindMany.mockResolvedValue([]);
      mockWorkOrderCount.mockResolvedValue(0);

      const req = new NextRequest('http://localhost/api/maintenance/work-orders?status=OPEN');
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockWorkOrderFindMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          organizationId: orgId,
          status: 'OPEN',
          deletedAt: null,
        }),
      }));
    });
  });

  describe('POST /api/maintenance/work-orders', () => {
    it('creates a new work order with organizationId and reporterId', async () => {
      const orgId = 'org_123';
      const userId = 'user_1';
      mockGetSessionClaims.mockResolvedValue({ orgId, sub: userId });
      mockWorkOrderCreate.mockResolvedValue({ id: 'wo_1', title: 'Test WO' });
      (prisma.unit.findFirst as jest.Mock).mockResolvedValue({ id: 'unit_1' });

      const payload = {
        title: 'Fix Leak',
        description: 'Kitchen sink leaking',
        priority: MaintenancePriority.HIGH,
        category: MaintenanceCategory.PLUMBING,
        locationType: MaintenanceLocationType.UNIT,
        unitId: 'unit_1',
      };

      const req = new NextRequest('http://localhost/api/maintenance/work-orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(mockWorkOrderCreate).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          title: 'Fix Leak',
          organizationId: orgId,
          reporterId: userId,
          status: MaintenanceStatus.OPEN,
        }),
      }));
    });
  });
});
