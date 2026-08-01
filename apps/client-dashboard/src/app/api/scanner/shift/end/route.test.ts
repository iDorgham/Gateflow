/**
 * Unit tests for POST /api/scanner/shift/end — ownership / IDOR / JSON body.
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

const mockCloseShift = jest.fn();
const mockFindOpenShiftForGuard = jest.fn();

jest.mock('@/lib/scanner-shift', () => ({
  closeShift: (...args: unknown[]) => mockCloseShift(...args),
  findOpenShiftForGuard: (...args: unknown[]) =>
    mockFindOpenShiftForGuard(...args),
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

import { NextRequest } from 'next/server';

function makeRequest(body: unknown): NextRequest {
  return makeRawRequest(JSON.stringify(body));
}

function makeRawRequest(raw: string): NextRequest {
  return { text: async () => raw } as NextRequest;
}

function makeEmptyRequest(): NextRequest {
  return makeRawRequest('');
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
    mockHasPermission.mockReturnValue(true);
  });

  it('returns 403 when caller lacks scans:view', async () => {
    mockHasPermission.mockReturnValueOnce(false);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(403);
    expect(mockCloseShift).not.toHaveBeenCalled();
  });

  it('returns 400 when non-empty body is not valid JSON', async () => {
    const res = await POST(makeRawRequest('{'));
    expect(res.status).toBe(400);
    expect(mockFindOpenShiftForGuard).not.toHaveBeenCalled();
    expect(mockCloseShift).not.toHaveBeenCalled();
  });

  it('returns 400 for a JSON null body instead of ending the open shift', async () => {
    const res = await POST(makeRequest(null));
    expect(res.status).toBe(400);
    expect(mockFindOpenShiftForGuard).not.toHaveBeenCalled();
    expect(mockCloseShift).not.toHaveBeenCalled();
  });

  it('treats empty JSON body with Content-Type as {}', async () => {
    mockFindOpenShiftForGuard.mockResolvedValueOnce({
      id: 'shift_open',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date(),
      endTime: null,
    });
    mockCloseShift.mockResolvedValueOnce({
      id: 'shift_open',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date(),
      endTime: new Date(),
    });

    const res = await POST(makeRawRequest('   '));
    expect(res.status).toBe(200);
    expect(mockCloseShift).toHaveBeenCalledWith(
      expect.objectContaining({ shiftLogId: 'shift_open' })
    );
  });

  it('returns 404 when ending another guard shift (IDOR)', async () => {
    mockCloseShift.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ shiftLogId: 'shift_other' }));
    expect(res.status).toBe(404);
    expect(mockCloseShift).toHaveBeenCalledWith(
      expect.objectContaining({
        organizationId: 'org_1',
        guardId: 'guard_1',
        shiftLogId: 'shift_other',
      })
    );
  });

  it('closes the open shift owned by the guard', async () => {
    mockCloseShift.mockResolvedValueOnce({
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
  });

  it('returns 404 when there is no active shift', async () => {
    mockFindOpenShiftForGuard.mockResolvedValueOnce(null);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(404);
  });

  it('returns 503 when persistence fails', async () => {
    mockCloseShift.mockRejectedValueOnce(new Error('db down'));
    const res = await POST(makeRequest({ shiftLogId: 'shift_1' }));
    expect(res.status).toBe(503);
  });

  it('allows empty body and clocks out the current open shift', async () => {
    mockFindOpenShiftForGuard.mockResolvedValueOnce({
      id: 'shift_open',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date(),
      endTime: null,
    });
    mockCloseShift.mockResolvedValueOnce({
      id: 'shift_open',
      gateId: 'gate_1',
      guardId: 'guard_1',
      organizationId: 'org_1',
      startTime: new Date(),
      endTime: new Date(),
    });

    const res = await POST(makeEmptyRequest());
    expect(res.status).toBe(200);
    expect(mockCloseShift).toHaveBeenCalledWith(
      expect.objectContaining({ shiftLogId: 'shift_open' })
    );
  });
});
