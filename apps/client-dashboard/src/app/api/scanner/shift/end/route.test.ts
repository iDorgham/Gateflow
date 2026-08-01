/**
 * Unit tests for POST /api/scanner/shift/end — ownership / IDOR / JSON body.
 */

const mockRequireAuth = jest.fn();
jest.mock('@/lib/require-auth', () => ({
  requireAuth: (...args: unknown[]) => mockRequireAuth(...args),
  isNextResponse: (value: unknown) =>
    Boolean(value && typeof value === 'object' && 'status' in value),
}));

const mockCloseShift = jest.fn();
const mockFindOpenShiftForGuard = jest.fn();

jest.mock('@/lib/scanner-shift', () => ({
  closeShift: (...args: unknown[]) => mockCloseShift(...args),
  findOpenShiftForGuard: (...args: unknown[]) =>
    mockFindOpenShiftForGuard(...args),
}));

import { NextRequest } from 'next/server';

function makeRequest(
  body?: object | string,
  opts?: { raw?: boolean }
): NextRequest {
  const payload =
    body === undefined
      ? undefined
      : opts?.raw
        ? String(body)
        : JSON.stringify(body);
  return new NextRequest('http://localhost/api/scanner/shift/end', {
    method: 'POST',
    headers: {
      ...(payload !== undefined ? { 'Content-Type': 'application/json' } : {}),
      Authorization: 'Bearer test',
    },
    ...(payload !== undefined ? { body: payload } : {}),
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

  it('returns 400 when non-empty body is not valid JSON', async () => {
    const res = await POST(makeRequest('{not-json', { raw: true }));
    expect(res.status).toBe(400);
    expect(mockCloseShift).not.toHaveBeenCalled();
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

    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockCloseShift).toHaveBeenCalledWith(
      expect.objectContaining({ shiftLogId: 'shift_open' })
    );
  });
});
