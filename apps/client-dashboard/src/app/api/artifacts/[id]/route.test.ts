/**
 * GET /api/artifacts/[id] — cross-org denial test.
 */

import type { NextRequest } from 'next/server';
import { GET } from './route';
import { prisma } from '@gate-access/db';

const mockGetSessionClaims = jest.fn();
const mockHasPermission = jest.fn();

jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));
jest.mock('@gate-access/db', () => ({
  prisma: {
    scanAttachment: { findFirst: jest.fn() },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSessionClaims.mockResolvedValue({ orgId: 'org-1', permissions: { 'gates:manage': true } });
  mockHasPermission.mockReturnValue(true);
});

describe('GET /api/artifacts/[id]', () => {
  it('returns 404 when artifact belongs to another org', async () => {
    (prisma.scanAttachment.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await GET(
      new Request('http://localhost/api/artifacts/att-1') as NextRequest,
      { params: Promise.resolve({ id: 'att-1' }) } as { params: Promise<{ id: string }> }
    );
    expect(res.status).toBe(404);
  });

  it('returns artifact when it belongs to same org', async () => {
    (prisma.scanAttachment.findFirst as jest.Mock).mockResolvedValue({
      id: 'att-1',
      type: 'id_front',
      contentBase64: 'data',
      scanLogId: 'scan-1',
      incidentId: null,
      createdAt: new Date(),
    });

    const res = await GET(
      new Request('http://localhost/api/artifacts/att-1') as NextRequest,
      { params: Promise.resolve({ id: 'att-1' }) } as { params: Promise<{ id: string }> }
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.organizationId).toBeUndefined();
    expect(json.data.contentBase64).toBe('data');
    expect(prisma.scanAttachment.findFirst).toHaveBeenCalledWith({
      where: { id: 'att-1', organizationId: 'org-1' },
      select: expect.any(Object),
    });
  });
});
