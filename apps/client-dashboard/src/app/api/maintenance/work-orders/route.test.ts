import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  BUILT_IN_ROLES,
  MaintenanceLocationType,
  MaintenancePriority,
  MaintenanceCategory,
} from '@gate-access/types';

// ─── next/server mock ─────────────────────────────────────────────────────────
jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    nextUrl: { searchParams: URLSearchParams };
    bodyJson: any;

    constructor(url: string, init?: { body?: any }) {
      this.url = url;
      this.nextUrl = { searchParams: new URLSearchParams(new URL(url).search) };
      this.bodyJson = init?.body;
    }

    async json() {
      return this.bodyJson;
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  };
});

// ─── Service + Auth mocks ──────────────────────────────────────────────────────

const mockGetSessionClaims = jest.fn() as any;
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockWorkOrderList = jest.fn() as any;
const mockWorkOrderCreate = jest.fn() as any;

jest.mock('@/lib/maintenance/work-order-service', () => ({
  WorkOrderService: {
    list: (...args: unknown[]) => mockWorkOrderList(...args),
    create: (...args: unknown[]) => mockWorkOrderCreate(...args),
  },
}));

function makeGetRequest(qs = '') {
  const { NextRequest } = jest.requireMock('next/server') as any;
  return new NextRequest(`http://localhost/api/maintenance/work-orders${qs}`);
}

function makePostRequest(body: any) {
  const { NextRequest } = jest.requireMock('next/server') as any;
  return new NextRequest(`http://localhost/api/maintenance/work-orders`, {
    body,
  });
}

describe('Maintenance Work Orders API', () => {
  let GET: (req: any) => Promise<{ status: number; json: () => Promise<any> }>;
  let POST: (req: any) => Promise<{ status: number; json: () => Promise<any> }>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
    POST = mod.POST;
  });

  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/maintenance/work-orders', () => {
    it('returns 401 when no session', async () => {
      mockGetSessionClaims.mockResolvedValue(null);
      const res = await GET(makeGetRequest());
      expect(res.status).toBe(401);
    });

    it('lists work orders for admin with full access', async () => {
      const orgId = 'org1';
      mockGetSessionClaims.mockResolvedValue({
        orgId,
        sub: 'u1',
        roleName: BUILT_IN_ROLES.ORG_ADMIN,
      });
      mockWorkOrderList.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      const res = await GET(makeGetRequest('?status=OPEN'));
      expect(res.status).toBe(200);

      expect(mockWorkOrderList).toHaveBeenCalledWith(
        orgId,
        expect.objectContaining({
          status: 'OPEN',
        })
      );
    });

    it('enforces reporterId filter for residents', async () => {
      const orgId = 'org1';
      const userId = 'u_resident';
      mockGetSessionClaims.mockResolvedValue({
        orgId,
        sub: userId,
        roleName: BUILT_IN_ROLES.RESIDENT,
      });
      mockWorkOrderList.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      const res = await GET(makeGetRequest());
      expect(res.status).toBe(200);

      expect(mockWorkOrderList).toHaveBeenCalledWith(
        orgId,
        expect.objectContaining({
          reporterId: userId,
        })
      );
    });
  });

  describe('POST /api/maintenance/work-orders', () => {
    it('creates a new work order', async () => {
      const orgId = 'org1';
      const userId = 'u1';
      mockGetSessionClaims.mockResolvedValue({
        orgId,
        sub: userId,
        roleName: BUILT_IN_ROLES.ORG_ADMIN,
      });

      const payload = {
        title: 'Broken Gate',
        description: 'Gate 1 is stuck',
        priority: MaintenancePriority.HIGH,
        category: MaintenanceCategory.HARDWARE,
        locationType: MaintenanceLocationType.GATE,
        locationId: 'gate1',
      };

      mockWorkOrderCreate.mockResolvedValue({ id: 'wo1', ...payload });

      const res = await POST(makePostRequest(payload));
      expect(res.status).toBe(201);

      expect(mockWorkOrderCreate).toHaveBeenCalledWith(
        orgId,
        userId,
        expect.objectContaining({
          title: 'Broken Gate',
        })
      );
    });

    it('returns 400 on validation failure', async () => {
      mockGetSessionClaims.mockResolvedValue({ orgId: 'org1', sub: 'u1' });

      const res = await POST(makePostRequest({ title: '' })); // Missing required fields
      expect(res.status).toBe(400);
    });
  });
});
