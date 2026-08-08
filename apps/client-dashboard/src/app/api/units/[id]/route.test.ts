/**
 * Regression test for PATCH /api/units/[id].
 *
 * projectId/contactIds used to be linked without verifying they belong to
 * the caller's organization, and the response echoed back the linked
 * project/contact names — a cross-tenant name-disclosure leak. Both are
 * now validated against claims.orgId before the update runs.
 */
export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    url: string;
    private _body: string;
    constructor(url: string, init?: { method?: string; body?: string }) {
      this.url = url;
      this._body = init?.body ?? '{}';
    }
    async json() {
      return JSON.parse(this._body);
    }
  }
  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  };
});

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockUnitFindFirst = jest.fn();
const mockProjectFindFirst = jest.fn();
const mockContactFindMany = jest.fn();
const mockUserFindFirst = jest.fn();
const mockUnitUpdate = jest.fn();
const mockContactUnitDeleteMany = jest.fn();
const mockContactUnitCreateMany = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    unit: {
      findFirst: (...args: unknown[]) => mockUnitFindFirst(...args),
      update: (...args: unknown[]) => mockUnitUpdate(...args),
    },
    project: {
      findFirst: (...args: unknown[]) => mockProjectFindFirst(...args),
    },
    contact: {
      findMany: (...args: unknown[]) => mockContactFindMany(...args),
    },
    user: {
      findFirst: (...args: unknown[]) => mockUserFindFirst(...args),
    },
    $transaction: (fn: (tx: unknown) => Promise<unknown>) =>
      fn({
        contactUnit: {
          deleteMany: (...args: unknown[]) =>
            mockContactUnitDeleteMany(...args),
          createMany: (...args: unknown[]) =>
            mockContactUnitCreateMany(...args),
        },
        unit: { update: (...args: unknown[]) => mockUnitUpdate(...args) },
      }),
  },
  UnitType: { STUDIO: 'STUDIO', ONE_BR: 'ONE_BR' },
}));

function makeRequest(body: unknown) {
  const { NextRequest } = jest.requireMock('next/server');
  return new NextRequest('http://localhost/api/units/unit_1', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

describe('PATCH /api/units/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionClaims.mockResolvedValue({ orgId: 'org_1', sub: 'user_1' });
    mockUnitFindFirst.mockResolvedValue({
      id: 'unit_1',
      organizationId: 'org_1',
    });
    mockContactUnitDeleteMany.mockResolvedValue({ count: 0 });
    mockContactUnitCreateMany.mockResolvedValue({ count: 0 });
    mockUnitUpdate.mockResolvedValue({
      id: 'unit_1',
      name: 'Unit 1',
      type: 'STUDIO',
      sizeSqm: null,
      qrQuota: 1,
      projectId: null,
      project: null,
      user: null,
      contacts: [],
    });
  });

  it('rejects a projectId belonging to another organization', async () => {
    mockProjectFindFirst.mockResolvedValue(null); // not found under org_1 scope

    const { PATCH } = await import('./route');
    const res = await PATCH(makeRequest({ projectId: 'proj_other_org' }), {
      params: Promise.resolve({ id: 'unit_1' }),
    });

    expect(res.status).toBe(400);
    expect(mockProjectFindFirst.mock.calls[0]?.[0]).toEqual({
      where: { id: 'proj_other_org', organizationId: 'org_1', deletedAt: null },
      select: { id: true },
    });
    expect(mockUnitUpdate).not.toHaveBeenCalled();
  });

  it('rejects contactIds belonging to another organization', async () => {
    mockContactFindMany.mockResolvedValue([]); // none matched under org_1 scope

    const { PATCH } = await import('./route');
    const res = await PATCH(
      makeRequest({ contactIds: ['contact_other_org'] }),
      {
        params: Promise.resolve({ id: 'unit_1' }),
      }
    );

    expect(res.status).toBe(400);
    expect(mockContactFindMany.mock.calls[0]?.[0]).toEqual({
      where: {
        id: { in: ['contact_other_org'] },
        organizationId: 'org_1',
        deletedAt: null,
      },
      select: { id: true },
    });
    expect(mockUnitUpdate).not.toHaveBeenCalled();
  });

  it('accepts a projectId/contactIds that belong to the caller org', async () => {
    mockProjectFindFirst.mockResolvedValue({ id: 'proj_1' });
    mockContactFindMany.mockResolvedValue([{ id: 'contact_1' }]);

    const { PATCH } = await import('./route');
    const res = await PATCH(
      makeRequest({ projectId: 'proj_1', contactIds: ['contact_1'] }),
      { params: Promise.resolve({ id: 'unit_1' }) }
    );

    expect(res.status).toBe(200);
    expect(mockUnitUpdate).toHaveBeenCalled();
  });
});
