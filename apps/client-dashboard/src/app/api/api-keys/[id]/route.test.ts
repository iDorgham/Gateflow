export {};

jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {},
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockFindFirst = jest.fn();
const mockAuditCreate = jest.fn();
const mockDelete = jest.fn();
const mockTransaction = jest.fn(async (callback: (tx: unknown) => unknown) =>
  callback({
    apiKey: {
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
    auditLog: { create: mockAuditCreate },
  })
);

jest.mock('@gate-access/db', () => ({
  prisma: {
    $transaction: (...args: unknown[]) => mockTransaction(...args),
    apiKey: {
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
    },
    auditLog: { create: (...args: unknown[]) => mockAuditCreate(...args) },
  },
}));

import { DELETE } from './route';

const props = { params: Promise.resolve({ id: 'key-1' }) };
const API_KEY = {
  id: 'key-1',
  name: 'Scanner integration',
  keyPrefix: 'gflv_ab12',
  scopes: ['QR_VALIDATE'],
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  createdBy: 'admin-old',
  expiresAt: null,
  lastUsedAt: new Date('2026-07-20T00:00:00.000Z'),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionClaims.mockResolvedValue({
    orgId: 'org-1',
    sub: 'admin-1',
    permissions: { 'workspace:manage': true },
  });
  mockFindFirst.mockResolvedValue(API_KEY);
  mockAuditCreate.mockResolvedValue({ id: 'audit-1' });
  mockDelete.mockResolvedValue({ id: 'key-1' });
});

describe('DELETE /api/api-keys/[id]', () => {
  it('requires workspace management permission', async () => {
    mockGetSessionClaims.mockResolvedValue({
      orgId: 'org-1',
      sub: 'member-1',
      permissions: {},
    });

    const response = await DELETE({} as never, props);

    expect(response.status).toBe(403);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('returns a non-enumerating 404 for a foreign or missing key', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await DELETE({} as never, props);

    expect(response.status).toBe(404);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: 'key-1', organizationId: 'org-1' },
      select: expect.not.objectContaining({ keyHash: true }),
    });
    expect(mockAuditCreate).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('writes a non-secret revocation receipt and deletes atomically', async () => {
    const response = await DELETE({} as never, props);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ success: true });
    expect(mockTransaction).toHaveBeenCalledTimes(1);
    expect(mockAuditCreate).toHaveBeenCalledWith({
      data: {
        action: 'API_KEY_REVOKED',
        entityType: 'ApiKey',
        entityId: 'key-1',
        organizationId: 'org-1',
        userId: 'admin-1',
        metadata: {
          createdAt: API_KEY.createdAt.toISOString(),
          createdBy: 'admin-old',
          expiresAt: null,
          keyPrefix: 'gflv_ab12',
          lastUsedAt: API_KEY.lastUsedAt.toISOString(),
          name: 'Scanner integration',
          scopes: ['QR_VALIDATE'],
        },
      },
    });
    expect(JSON.stringify(mockAuditCreate.mock.calls)).not.toContain('keyHash');
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: 'key-1' } });
  });
});
