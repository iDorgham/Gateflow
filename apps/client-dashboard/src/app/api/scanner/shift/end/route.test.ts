/**
 * Unit tests for POST /api/scanner/shift/end — ownership / IDOR.
 */

const mockRequireAuth = jest.fn();
jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (value: unknown) =>
    Boolean(value && typeof value === 'object' && 'status' in value),
}));

const mockShiftFindFirst = jest.fn();
const mockShiftUpdate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    shiftLog: {
      findFirst: (...args: unknown[]) => mockShiftFindFirst(...args),
      update: (...args: unknown[]) => mockShiftUpdate(...args),
    },
  },
}));

import { NextRequest } from 'next/server';

function makeRequest(body: object = {}): NextRequest {
  return new NextRequest('http://localhost/api/scanner/shift/end', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test',
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/scanner/shift/end', () => {
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
    });
  });

  it('returns 404 when ending another guard shift (IDOR)', async () => {
    // closeShift looks up with guardId + orgId — foreign shift yields null
    mockShiftFindFirst.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ shiftLogId: 'shift_other' }));
    expect(res.status).toBe(404);
    expect(mockShiftUpdate).not.toHaveBeenCalled();
    expect(mockShiftFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: 'shift_other',
          organizationId: 'org_1',
          guardId: 'guard_1',
          endTime: null,
        }),
      })
    );
  });

  it('closes the open shift owned by the guard', async () => {
    mockShiftFindFirst.mockResolvedValueOnce({
      id: 'shift_1',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date('2026-08-01T10:00:00.000Z'),
      endTime: null,
    });
    mockShiftUpdate.mockResolvedValueOnce({
      id: 'shift_1',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date('2026-08-01T10:00:00.000Z'),
      endTime: new Date('2026-08-01T18:00:00.000Z'),
    });

    const res = await POST(makeRequest({ shiftLogId: 'shift_1' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.endTime).toBeTruthy();
    expect(mockShiftUpdate).toHaveBeenCalled();
  });

  it('returns 404 when there is no active shift', async () => {
    mockShiftFindFirst.mockResolvedValueOnce(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(404);
  });
});
