/**
 * Regression test for POST /api/audit/log.
 *
 * This endpoint used to be fully mocked: it never wrote to the database,
 * just console.logged and returned a fake `Math.random()`-based logId while
 * claiming success. It now persists a real AuditLog row and returns the
 * database-generated id.
 */
export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthorized: jest.fn(),
}));

const mockAuditLogCreate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    auditLog: {
      create: (...args: unknown[]) => mockAuditLogCreate(...args),
    },
  },
}));

import { isAdminAuthorized } from '@/lib/admin-auth';

function makeRequest(body: unknown) {
  return {
    json: async () => body,
  } as unknown as Request;
}

describe('POST /api/audit/log', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when not authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(false);
    const { POST } = await import('./route');
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
    expect(mockAuditLogCreate).not.toHaveBeenCalled();
  });

  it('rejects a body missing organizationId', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    const { POST } = await import('./route');
    const res = await POST(
      makeRequest({ action: 'DO_THING', entityType: 'Organization' })
    );
    expect(res.status).toBe(400);
    expect(mockAuditLogCreate).not.toHaveBeenCalled();
  });

  it('persists a real AuditLog row and returns its database id', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    mockAuditLogCreate.mockResolvedValue({
      id: 'auditlog_real_id_123',
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const { POST } = await import('./route');
    const res = await POST(
      makeRequest({
        organizationId: 'org_1',
        action: 'ORG_SETTINGS_UPDATED',
        entityType: 'Organization',
        entityId: 'org_1',
        userId: 'admin_1',
        metadata: { field: 'name' },
      })
    );

    expect(res.status).toBe(200);
    expect(mockAuditLogCreate).toHaveBeenCalledWith({
      data: {
        organizationId: 'org_1',
        action: 'ORG_SETTINGS_UPDATED',
        entityType: 'Organization',
        entityId: 'org_1',
        userId: 'admin_1',
        metadata: { field: 'name' },
      },
    });

    const body = (await res.json()) as { success: boolean; logId: string };
    expect(body.success).toBe(true);
    // The id must come from the database, not a client-computed Math.random() string.
    expect(body.logId).toBe('auditlog_real_id_123');
    expect(body.logId).not.toMatch(/^log-/);
  });
});
