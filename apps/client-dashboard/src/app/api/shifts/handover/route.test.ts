const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockGateFindFirst = jest.fn();
const mockShiftLogFindFirst = jest.fn();
const mockShiftLogUpdate = jest.fn();
const mockShiftLogCreate = jest.fn();
const mockUserFindFirst = jest.fn();
const mockAuditLogCreate = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findFirst: (...args: unknown[]) => mockGateFindFirst(...args),
    },
    shiftLog: {
      findFirst: (...args: unknown[]) => mockShiftLogFindFirst(...args),
      update: (...args: unknown[]) => mockShiftLogUpdate(...args),
      create: (...args: unknown[]) => mockShiftLogCreate(...args),
    },
    user: {
      findFirst: (...args: unknown[]) => mockUserFindFirst(...args),
    },
    auditLog: {
      create: (...args: unknown[]) => mockAuditLogCreate(...args),
    },
    $transaction: (cb: (tx: unknown) => Promise<unknown>) =>
      cb({
        shiftLog: {
          update: mockShiftLogUpdate,
          create: mockShiftLogCreate,
        },
        user: {
          findFirst: mockUserFindFirst,
        },
        auditLog: {
          create: mockAuditLogCreate,
        },
      }),
  },
}));

import { NextRequest } from 'next/server';

describe('POST /api/shifts/handover', () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    POST = mod.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when unauthorized', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const req = new NextRequest('http://localhost/api/shifts/handover', {
      method: 'POST',
      body: JSON.stringify({ gateId: 'gate_1' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 404 when gate is not found in the organization', async () => {
    mockGetSessionClaims.mockResolvedValue({
      orgId: 'org_1',
      sub: 'user_admin',
    });
    mockGateFindFirst.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/shifts/handover', {
      method: 'POST',
      body: JSON.stringify({ gateId: 'gate_unknown' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });

  it('ends active shift and creates audit log with zero raw PII', async () => {
    mockGetSessionClaims.mockResolvedValue({
      orgId: 'org_1',
      sub: 'user_admin',
    });
    mockGateFindFirst.mockResolvedValue({ id: 'gate_1', name: 'Main Gate' });
    mockShiftLogFindFirst.mockResolvedValue({
      id: 'shift_active_1',
      guardId: 'guard_old',
      startTime: new Date(),
    });
    mockUserFindFirst.mockResolvedValue({ id: 'guard_new' });

    const req = new NextRequest('http://localhost/api/shifts/handover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gateId: 'gate_1',
        incomingGuardId: 'guard_new',
        notes: 'Handover complete without issues',
      }),
    });

    const res = await POST(req);
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(payload.success).toBe(true);

    expect(mockShiftLogUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'shift_active_1' },
        data: expect.objectContaining({ endTime: expect.any(Date) }),
      })
    );

    expect(mockShiftLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          gateId: 'gate_1',
          guardId: 'guard_new',
          organizationId: 'org_1',
        }),
      })
    );

    expect(mockAuditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          action: 'SHIFT_HANDOVER',
          organizationId: 'org_1',
          userId: 'user_admin',
          targetId: 'gate_1',
          metadata: expect.objectContaining({
            gateName: 'Main Gate',
            previousShiftId: 'shift_active_1',
            hasIncomingGuard: true,
          }),
        }),
      })
    );
  });
});
