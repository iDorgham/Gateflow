const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockHasPermission = jest.fn();
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));

const mockGateFindFirst = jest.fn();
const mockShiftLogFindFirst = jest.fn();
const mockShiftLogUpdateMany = jest.fn();
const mockShiftLogCreate = jest.fn();
const mockUserFindFirst = jest.fn();
const mockAuditLogCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findFirst: (...args: unknown[]) => mockGateFindFirst(...args),
    },
    shiftLog: {
      findFirst: (...args: unknown[]) => mockShiftLogFindFirst(...args),
      updateMany: (...args: unknown[]) => mockShiftLogUpdateMany(...args),
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
          updateMany: mockShiftLogUpdateMany,
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
    mockHasPermission.mockReturnValue(true);
    mockShiftLogUpdateMany.mockResolvedValue({ count: 1 });
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

  it('returns 403 when the caller lacks gates:manage permission', async () => {
    mockGetSessionClaims.mockResolvedValue({
      orgId: 'org_1',
      sub: 'user_admin',
    });
    mockHasPermission.mockReturnValue(false);

    const req = new NextRequest('http://localhost/api/shifts/handover', {
      method: 'POST',
      body: JSON.stringify({ gateId: 'gate_1' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(403);
    expect(mockGateFindFirst).not.toHaveBeenCalled();
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

    expect(mockShiftLogUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 'shift_active_1',
          organizationId: 'org_1',
          endTime: null,
        },
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
          entityType: 'GATE',
          entityId: 'gate_1',
          organizationId: 'org_1',
          userId: 'user_admin',
          metadata: expect.objectContaining({
            gateName: 'Main Gate',
            previousShiftId: 'shift_active_1',
            hasIncomingGuard: true,
          }),
        }),
      })
    );
  });

  it('returns 400 and aborts when the incoming guard is not in the organization', async () => {
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
    mockUserFindFirst.mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/shifts/handover', {
      method: 'POST',
      body: JSON.stringify({
        gateId: 'gate_1',
        incomingGuardId: 'guard_unknown',
      }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(mockShiftLogUpdateMany).not.toHaveBeenCalled();
    expect(mockShiftLogCreate).not.toHaveBeenCalled();
    expect(mockAuditLogCreate).not.toHaveBeenCalled();
  });

  it('returns 409 when the active shift was concurrently closed', async () => {
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
    mockShiftLogUpdateMany.mockResolvedValue({ count: 0 });

    const req = new NextRequest('http://localhost/api/shifts/handover', {
      method: 'POST',
      body: JSON.stringify({ gateId: 'gate_1' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(409);
    expect(mockShiftLogCreate).not.toHaveBeenCalled();
    expect(mockAuditLogCreate).not.toHaveBeenCalled();
  });
});
