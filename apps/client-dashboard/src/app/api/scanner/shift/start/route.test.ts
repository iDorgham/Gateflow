/**
 * Unit tests for POST /api/scanner/shift/start — auth, org scoping, IDOR.
 */

const mockRequireAuth = jest.fn();
jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (value: unknown) =>
    Boolean(value && typeof value === 'object' && 'status' in value),
}));

const mockCheckGateAssignment = jest.fn();
jest.mock('@/lib/gate-assignment', () => ({
  checkGateAssignment: (...args: unknown[]) => mockCheckGateAssignment(...args),
}));

const mockGateFindFirst = jest.fn();
const mockShiftFindFirst = jest.fn();
const mockShiftCreate = jest.fn();
const mockShiftUpdate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: {
      findFirst: (...args: unknown[]) => mockGateFindFirst(...args),
    },
    shiftLog: {
      findFirst: (...args: unknown[]) => mockShiftFindFirst(...args),
      create: (...args: unknown[]) => mockShiftCreate(...args),
      update: (...args: unknown[]) => mockShiftUpdate(...args),
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
    mockCheckGateAssignment.mockResolvedValue(null);
    mockGateFindFirst.mockResolvedValue({
      id: 'gate_1',
      name: 'Main',
      isActive: true,
    });
    mockShiftFindFirst.mockResolvedValue(null);
    mockShiftCreate.mockResolvedValue({
      id: 'shift_1',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date('2026-08-01T10:00:00.000Z'),
      endTime: null,
    });
  });

  it('returns 401 when not authenticated', async () => {
    const { NextResponse } = await import('next/server');
    mockRequireAuth.mockResolvedValueOnce(
      NextResponse.json({ success: false }, { status: 401 })
    );
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(401);
    expect(mockShiftCreate).not.toHaveBeenCalled();
  });

  it('returns 403 when org context is missing', async () => {
    mockRequireAuth.mockResolvedValueOnce({
      sub: 'guard_1',
      orgId: null,
    });
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(403);
    expect(mockShiftCreate).not.toHaveBeenCalled();
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
    expect(mockShiftCreate).not.toHaveBeenCalled();
  });

  it('returns 403 when gate assignment denies the guard', async () => {
    mockCheckGateAssignment.mockResolvedValueOnce(
      'You are not allowed to scan at this gate.'
    );
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    expect(res.status).toBe(403);
    expect(mockShiftCreate).not.toHaveBeenCalled();
  });

  it('creates a ShiftLog scoped to org + guard + gate', async () => {
    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.id).toBe('shift_1');
    expect(mockShiftCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organizationId: 'org_1',
        guardId: 'guard_1',
        gateId: 'gate_1',
      }),
    });
  });

  it('reuses an existing open shift at the same gate', async () => {
    mockShiftFindFirst.mockResolvedValueOnce({
      id: 'shift_open',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date('2026-08-01T09:00:00.000Z'),
      endTime: null,
    });

    const res = await POST(makeRequest({ gateId: 'gate_1' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.reused).toBe(true);
    expect(data.data.id).toBe('shift_open');
    expect(mockShiftCreate).not.toHaveBeenCalled();
  });
});
