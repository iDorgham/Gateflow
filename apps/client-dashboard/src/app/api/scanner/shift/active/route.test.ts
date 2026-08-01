const mockRequireAuth = jest.fn();
const mockHasPermission = jest.fn();
const mockGateFindFirst = jest.fn();
const mockCheckGateAssignment = jest.fn();
const mockFindOpenShiftForGate = jest.fn();

jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (value: unknown) =>
    Boolean(value && typeof value === 'object' && 'status' in value),
}));
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));
jest.mock('@gate-access/db', () => ({
  prisma: {
    gate: { findFirst: (...args: unknown[]) => mockGateFindFirst(...args) },
  },
}));
jest.mock('@/lib/gate-assignment', () => ({
  checkGateAssignment: (...args: unknown[]) => mockCheckGateAssignment(...args),
}));
jest.mock('@/lib/scanner-shift', () => ({
  findOpenShiftForGate: (...args: unknown[]) =>
    mockFindOpenShiftForGate(...args),
  serializeShift: (shift: { startTime: Date; endTime: Date | null }) => ({
    ...shift,
    startTime: shift.startTime.toISOString(),
    endTime: shift.endTime?.toISOString() ?? null,
  }),
}));

import { NextRequest } from 'next/server';
import { GET } from './route';

function request(gateId = 'gate_1'): NextRequest {
  return {
    nextUrl: new URL(
      `http://localhost/api/scanner/shift/active?gateId=${gateId}`
    ),
  } as NextRequest;
}

describe('GET /api/scanner/shift/active', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireAuth.mockResolvedValue({ sub: 'guard_1', orgId: 'org_1' });
    mockHasPermission.mockReturnValue(true);
    mockGateFindFirst.mockResolvedValue({ id: 'gate_1' });
    mockCheckGateAssignment.mockResolvedValue(null);
  });

  it('rejects a gate outside the org, inactive, or deleted', async () => {
    mockGateFindFirst.mockResolvedValue(null);
    const response = await GET(request());

    expect(response.status).toBe(404);
    expect(mockGateFindFirst).toHaveBeenCalledWith({
      where: {
        id: 'gate_1',
        organizationId: 'org_1',
        isActive: true,
        deletedAt: null,
      },
      select: { id: true },
    });
    expect(mockFindOpenShiftForGate).not.toHaveBeenCalled();
  });

  it('rejects a guard who is not assigned to the gate', async () => {
    mockCheckGateAssignment.mockResolvedValue(
      'You are not allowed to scan at this gate.'
    );
    const response = await GET(request());

    expect(response.status).toBe(403);
    expect(mockFindOpenShiftForGate).not.toHaveBeenCalled();
  });

  it('returns an owned shift for an active assigned gate', async () => {
    mockFindOpenShiftForGate.mockResolvedValue({
      id: 'shift_1',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date('2026-08-01T10:00:00.000Z'),
      endTime: null,
    });
    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(mockFindOpenShiftForGate).toHaveBeenCalledWith({
      organizationId: 'org_1',
      guardId: 'guard_1',
      gateId: 'gate_1',
    });
  });
});
