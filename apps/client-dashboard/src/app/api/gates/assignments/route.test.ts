/**
 * Unit tests for GET/POST/DELETE /api/gates/assignments — org scoping and permission.
 */

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockHasPermission = jest.fn();
jest.mock('@/lib/auth', () => ({
  hasPermission: (...args: unknown[]) => mockHasPermission(...args),
}));

const mockFindMany = jest.fn();
const mockFindFirst = jest.fn();
const mockFindUnique = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    gateAssignment: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      findFirst: (...args: unknown[]) => mockFindFirst(...args),
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
    user: { findFirst: jest.fn() },
    gate: { findMany: jest.fn() },
  },
}));

import { NextRequest } from 'next/server';
import { prisma } from '@gate-access/db';

function makePostRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/gates/assignments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeDeleteRequest(body: object): NextRequest {
  return new NextRequest('http://localhost/api/gates/assignments', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /api/gates/assignments', () => {
  let GET: () => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it('returns 403 when user lacks gates:manage permission', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'user_1' });
    mockHasPermission.mockReturnValue(false);
    const res = await GET();
    expect(res.status).toBe(403);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it('returns org-scoped assignments when permitted', async () => {
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'user_1' });
    mockHasPermission.mockReturnValue(true);
    mockFindMany.mockResolvedValue([
      {
        id: 'a1',
        userId: 'u1',
        gateId: 'g1',
        user: { id: 'u1', email: 'a@b.com', name: 'Alice' },
        gate: { id: 'g1', name: 'Main', location: 'Lobby' },
        createdAt: new Date(),
      },
    ]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].gateId).toBe('g1');
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org_1', deletedAt: null },
      })
    );
  });
});

describe('POST /api/gates/assignments', () => {
  let POST: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    POST = mod.POST;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'admin_1' });
    mockHasPermission.mockReturnValue(true);
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({ id: 'user_1' });
    (prisma.gate.findMany as jest.Mock).mockResolvedValue([
      { id: 'gate_1' },
      { id: 'gate_2' },
    ]);
  });

  it('creates assignments when user and gates belong to org', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate
      .mockResolvedValueOnce({ id: 'assign_1', userId: 'user_1', gateId: 'gate_1' })
      .mockResolvedValueOnce({ id: 'assign_2', userId: 'user_1', gateId: 'gate_2' });

    const res = await POST(makePostRequest({ userId: 'user_1', gateIds: ['gate_1', 'gate_2'] }));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.assigned).toHaveLength(2);
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('returns 404 when user not in org', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(makePostRequest({ userId: 'other_user', gateIds: ['gate_1'] }));
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/gates/assignments', () => {
  let DELETE: (req: Request) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    DELETE = mod.DELETE;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'admin_1' });
    mockHasPermission.mockReturnValue(true);
  });

  it('soft-deletes assignment when found', async () => {
    mockFindFirst.mockResolvedValue({ id: 'assign_1', userId: 'u1', gateId: 'g1' });
    mockUpdate.mockResolvedValue({});

    const res = await DELETE(makeDeleteRequest({ userId: 'u1', gateId: 'g1' }));
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'assign_1' },
        data: { deletedAt: expect.any(Date) },
      })
    );
  });

  it('returns 404 when assignment not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const res = await DELETE(makeDeleteRequest({ userId: 'u1', gateId: 'g1' }));
    expect(res.status).toBe(404);
  });
});
