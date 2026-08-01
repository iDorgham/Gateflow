/**
 * Unit tests for POST /api/scanner/shift/start — auth, org scoping, IDOR.
 */

const mockRequireAuth = jest.fn();
jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (value: unknown) =>
    Boolean(value && typeof value === 'object' && 'status' in value),
}));

const mockHasPermission = jest.fn();
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));

const mockCheckGateAssignment = jest.fn();
jest.mock('@/lib/gate-assignment', () => ({
  checkGateAssignment: (...args: unknown[]) => mockCheckGateAssignment(...args),
}));

const mockStartOrReuseShift = jest.fn();
jest.mock('@/lib/scanner-shift', () => ({
  startOrReuseShift: (...args: unknown[]) => mockStartOrReuseShift(...args),
  serializeShift: (shift: {
    id: string;
    gateId: string;
    guardId: string;
    organizationId: string;
    startTime: Date;
    endTime: Date | null;
  }) => ({
    id: shift.id,
    gateId: shift.gateId,
    guardId: shift.guardId,
    organizationId: shift.organizationId,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime?.toISOString() ?? null,
  }),
}));

const mockGateFindFirst = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findFirst: (...args: unknown[]) => mockGateFindFirst(...args),
    },
  },
}));

import { NextRequest } from 'next/server';

function makeRequest(body: object, auth = true): NextRequest {
  return new NextRequest('http://localhost/api/scanner/shift/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: 'Bearer test' } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/scanner/shift/start', () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    POST = mod.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue({
      sub: 'guard_1',
      orgId: 'org_1',
      email: 'g@test.com',
    });
    mockHasPermission.mockReturnValue(true);
    mockCheckGateAssignment.mockResolvedValue(null);
    mockGateFindFirst.mockResolvedValue({
      id: 'gate_1',
      name: 'Main',
      isActive: true,
    });
    mockStartOrReuseShift.mockResolvedValue({
      reused: false,
      shift: {
        id: 'shift_1',
        gateId: 'gate_1',
        guardId: 'guard_1',
        organizationId: 'org_1',
        startTime: new Date('2026-08-01T10:00:00.000Z'),
        endTime: null,
      },
    });
  });

  it('returns 401 when not authenticated', async () => {
    const { NextResponse } = await import('next/server');
    mockRequireAuth.mockResolvedValueOnce(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(401);
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 403 when org context is missing', async () => {
    mockRequireAuth.mockResolvedValueOnce({
      sub: 'guard_1',
      orgId: null,
    });
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(403);
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 403 when caller lacks scans:view', async () => {
    mockHasPermission.mockReturnValueOnce(false);
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(403);
    expect(mockHasPermission).toHaveBeenCalledWith(
      expect.anything(),
      'scans:view'
    );
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 404 when gate is outside the org', async () => {
    mockGateFindFirst.mockResolvedValueOnce(null);
    const res = await POST(makeRequest({ gateId: 'other_gate' }));
    expect(res.status).toBe(404);
    expect(mockGateFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 'other_gate',
          organizationId: 'org_1',
          deletedAt: null,
        }),
      })
    );
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 403 when gate is inactive', async () => {
    mockGateFindFirst.mockResolvedValueOnce({
      id: 'gate_1',
      name: 'Main',
      isActive: false,
    });
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(403);
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 400 when gateId is missing', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 403 when gate assignment denies the guard', async () => {
    mockCheckGateAssignment.mockResolvedValueOnce(
      'You are not allowed to scan at this gate.'
    );
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(403);
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 503 when startOrReuseShift fails', async () => {
    mockStartOrReuseShift.mockRejectedValueOnce(new Error('db down'));
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(503);
  });

  it('returns 503 when gate lookup fails', async () => {
    mockGateFindFirst.mockRejectedValueOnce(new Error('db down'));
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(503);
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('returns 503 when gate assignment check fails', async () => {
    mockCheckGateAssignment.mockRejectedValueOnce(new Error('db down'));
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(503);
    expect(mockStartOrReuseShift).not.toHaveBeenCalled();
  });

  it('creates a ShiftLog scoped to org + guard + gate', async () => {
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe('shift_1');
    expect(mockStartOrReuseShift).toHaveBeenCalledWith({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_1',
    });
  });

  it('reuses an existing open shift at the same gate', async () => {
    mockStartOrReuseShift.mockResolvedValueOnce({
      reused: true,
      shift: {
        id: 'shift_open',
        gateId: 'gate_1',
        guardId: 'guard_1',
        organizationId: 'org_1',
        startTime: new Date('2026-08-01T09:00:00.000Z'),
        endTime: null,
      },
    });

    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.reused).toBe(true);
    expect(data.data.id).toBe('shift_open');
  });

  it('closes an open shift at another gate via startOrReuseShift', async () => {
    mockStartOrReuseShift.mockResolvedValueOnce({
      reused: false,
      shift: {
        id: 'shift_new',
        gateId: 'gate_2',
        guardId: 'guard_1',
        organizationId: 'org_1',
        startTime: new Date('2026-08-01T11:00:00.000Z'),
        endTime: null,
      },
    });

    mockGateFindFirst.mockResolvedValueOnce({
      id: 'gate_2',
      name: 'Side',
      isActive: true,
    });

    const res = await POST(makeRequest({ gateId: 'gate_2' }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.data.gateId).toBe('gate_2');
    expect(mockStartOrReuseShift).toHaveBeenCalledWith({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_2',
    });
  });
});
