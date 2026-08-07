/**
 * Regression test for POST /api/admin/reset-tenant.
 *
 * This endpoint used to hard-delete ScanLog and Incident rows via deleteMany(),
 * permanently destroying security/audit records — a Zero Trust violation, since
 * gate entry/exit decisions must be append-only. It now soft-deletes them
 * (updateMany + deletedAt) like every other model in the same transaction.
 *
 * These tests exist to catch a regression back to deleteMany().
 */
export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthorized: jest.fn(),
}));

const mockScanLogUpdateMany = jest.fn();
const mockScanLogDeleteMany = jest.fn();
const mockQRCodeUpdateMany = jest.fn();
const mockUnitUpdateMany = jest.fn();
const mockContactUpdateMany = jest.fn();
const mockContactFindFirst = jest.fn();
const mockIncidentUpdateMany = jest.fn();
const mockIncidentDeleteMany = jest.fn();
const mockAiActionLogCreate = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    scanLog: {
      updateMany: (...args: unknown[]) => mockScanLogUpdateMany(...args),
      deleteMany: (...args: unknown[]) => mockScanLogDeleteMany(...args),
    },
    qRCode: {
      updateMany: (...args: unknown[]) => mockQRCodeUpdateMany(...args),
    },
    unit: {
      updateMany: (...args: unknown[]) => mockUnitUpdateMany(...args),
    },
    contact: {
      updateMany: (...args: unknown[]) => mockContactUpdateMany(...args),
      findFirst: (...args: unknown[]) => mockContactFindFirst(...args),
    },
    incident: {
      updateMany: (...args: unknown[]) => mockIncidentUpdateMany(...args),
      deleteMany: (...args: unknown[]) => mockIncidentDeleteMany(...args),
    },
    aiActionLog: {
      create: (...args: unknown[]) => mockAiActionLogCreate(...args),
    },
    $transaction: (ops: Promise<unknown>[]) => Promise.all(ops),
  },
  AiActionStatus: { EXECUTED: 'EXECUTED', FAILED: 'FAILED' },
}));

import { isAdminAuthorized } from '@/lib/admin-auth';

function makeRequest(body: unknown) {
  return {
    json: async () => body,
  } as unknown as Parameters<typeof import('./route').POST>[0];
}

describe('POST /api/admin/reset-tenant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScanLogUpdateMany.mockResolvedValue({ count: 12 });
    mockQRCodeUpdateMany.mockResolvedValue({ count: 3 });
    mockUnitUpdateMany.mockResolvedValue({ count: 2 });
    mockContactUpdateMany.mockResolvedValue({ count: 1 });
    mockIncidentUpdateMany.mockResolvedValue({ count: 4 });
    mockContactFindFirst.mockResolvedValue({ id: 'contact_existing' });
    mockAiActionLogCreate.mockResolvedValue({ id: 'log_1' });
  });

  it('returns 401 when not authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(false);
    const { POST } = await import('./route');
    const res = await POST(makeRequest({ organizationId: 'org_1' }));
    expect(res.status).toBe(401);
    expect(mockScanLogUpdateMany).not.toHaveBeenCalled();
    expect(mockScanLogDeleteMany).not.toHaveBeenCalled();
  });

  it('soft-deletes ScanLog via updateMany, never deleteMany', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    const { POST } = await import('./route');
    const res = await POST(makeRequest({ organizationId: 'org_1' }));

    expect(res.status).toBe(200);
    expect(mockScanLogDeleteMany).not.toHaveBeenCalled();
    expect(mockScanLogUpdateMany).toHaveBeenCalledTimes(1);

    const call = mockScanLogUpdateMany.mock.calls[0]?.[0] as {
      where: { deletedAt: null | unknown; gate: { organizationId: string } };
      data: { deletedAt: Date };
    };
    expect(call.where.deletedAt).toBeNull();
    expect(call.where.gate.organizationId).toBe('org_1');
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });

  it('soft-deletes Incident via updateMany, never deleteMany', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    const { POST } = await import('./route');
    await POST(makeRequest({ organizationId: 'org_1' }));

    expect(mockIncidentDeleteMany).not.toHaveBeenCalled();
    expect(mockIncidentUpdateMany).toHaveBeenCalledTimes(1);

    const call = mockIncidentUpdateMany.mock.calls[0]?.[0] as {
      where: { organizationId: string; deletedAt: null };
      data: { deletedAt: Date };
    };
    expect(call.where.organizationId).toBe('org_1');
    expect(call.where.deletedAt).toBeNull();
    expect(call.data.deletedAt).toBeInstanceOf(Date);
  });

  it('records soft-delete counts (not "removed") in the audit log metadata', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    const { POST } = await import('./route');
    await POST(makeRequest({ organizationId: 'org_1' }));

    const logCall = mockAiActionLogCreate.mock.calls[0]?.[0] as {
      data: {
        status: string;
        metadata: { stats: Record<string, number> };
      };
    };
    expect(logCall.data.status).toBe('EXECUTED');
    expect(logCall.data.metadata.stats.scansSoftDeleted).toBe(12);
    expect(logCall.data.metadata.stats.incidentsSoftDeleted).toBe(4);
    expect(logCall.data.metadata.stats).not.toHaveProperty('scansRemoved');
    expect(logCall.data.metadata.stats).not.toHaveProperty('incidentsRemoved');
  });
});
