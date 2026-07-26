export {};

jest.mock('next/server', () => {
  class MockNextRequest {
    private readonly body: string;

    constructor(_url: string, init?: { body?: string }) {
      this.body = init?.body ?? '{}';
    }

    async json() {
      return JSON.parse(this.body);
    }
  }

  class MockNextResponse {
    status: number;
    private readonly body: unknown;

    constructor(body: unknown, init?: { status?: number }) {
      this.body = body;
      this.status = init?.status ?? 200;
    }

    async json() {
      return this.body;
    }

    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }
  }

  return { NextRequest: MockNextRequest, NextResponse: MockNextResponse };
});

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockContactFindFirst = jest.fn();
const mockContactUpdate = jest.fn();
const mockContactUnitDeleteMany = jest.fn();
const mockContactUnitCreateMany = jest.fn();
const mockUnitFindMany = jest.fn();
const mockTransaction = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    contact: {
      findFirst: (...args: unknown[]) => mockContactFindFirst(...args),
    },
    $transaction: (...args: unknown[]) => mockTransaction(...args),
  },
  ContactSource: {
    MANUAL: 'MANUAL',
    IMPORT: 'IMPORT',
    QR_SCAN: 'QR_SCAN',
    REFERRAL: 'REFERRAL',
    OTHER: 'OTHER',
  },
}));

jest.mock('@/lib/realtime/emit-event', () => ({
  emitEvent: jest.fn().mockResolvedValue(undefined),
  EventType: { CONTACT_UPDATED: 'CONTACT_UPDATED' },
}));

import { NextRequest } from 'next/server';
import { PATCH } from './route';

const makeRequest = (unitIds: string[]) =>
  new NextRequest('http://localhost/api/contacts/contact_1', {
    body: JSON.stringify({ unitIds }),
  } as never);

const params = { params: Promise.resolve({ id: 'contact_1' }) };

describe('PATCH /api/contacts/[id] unit tenant isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionClaims.mockResolvedValue({ sub: 'user_1', orgId: 'org_1' });
    mockContactFindFirst.mockResolvedValue({ id: 'contact_1' });
    mockContactUpdate.mockResolvedValue({
      id: 'contact_1',
      firstName: 'A',
      lastName: 'B',
      birthday: null,
      company: null,
      phone: null,
      email: null,
      avatarUrl: null,
      jobTitle: null,
      source: null,
      companyWebsite: null,
      notes: null,
      units: [],
    });
    mockTransaction.mockImplementation(
      async (callback: (tx: unknown) => Promise<unknown>) =>
        callback({
          contact: { update: mockContactUpdate },
          unit: { findMany: mockUnitFindMany },
          contactUnit: {
            deleteMany: mockContactUnitDeleteMany,
            createMany: mockContactUnitCreateMany,
          },
        })
    );
  });

  it('rejects mixed or foreign-tenant unit IDs before mutating relations', async () => {
    mockUnitFindMany.mockResolvedValue([{ id: 'unit_owned' }]);

    const response = await PATCH(
      makeRequest(['unit_owned', 'unit_foreign']),
      params
    );

    expect(response.status).toBe(400);
    expect(mockUnitFindMany).toHaveBeenCalledWith({
      where: {
        id: { in: ['unit_owned', 'unit_foreign'] },
        organizationId: 'org_1',
        deletedAt: null,
      },
      select: { id: true },
    });
    expect(mockTransaction).toHaveBeenCalledTimes(1);
    expect(mockContactUnitDeleteMany).not.toHaveBeenCalled();
    expect(mockContactUnitCreateMany).not.toHaveBeenCalled();
    expect(mockContactUpdate).not.toHaveBeenCalled();
  });

  it('updates relations when every unit belongs to the organization', async () => {
    mockUnitFindMany.mockResolvedValue([{ id: 'unit_1' }, { id: 'unit_2' }]);

    const response = await PATCH(makeRequest(['unit_1', 'unit_2']), params);

    expect(response.status).toBe(200);
    expect(mockContactUnitCreateMany).toHaveBeenCalledWith({
      data: [
        { contactId: 'contact_1', unitId: 'unit_1' },
        { contactId: 'contact_1', unitId: 'unit_2' },
      ],
    });
  });

  it('deduplicates unit IDs before validation and insertion', async () => {
    mockUnitFindMany.mockResolvedValue([{ id: 'unit_1' }]);

    const response = await PATCH(makeRequest(['unit_1', 'unit_1']), params);

    expect(response.status).toBe(200);
    expect(mockUnitFindMany).toHaveBeenCalledWith({
      where: {
        id: { in: ['unit_1'] },
        organizationId: 'org_1',
        deletedAt: null,
      },
      select: { id: true },
    });
    expect(mockContactUnitCreateMany).toHaveBeenCalledWith({
      data: [{ contactId: 'contact_1', unitId: 'unit_1' }],
    });
  });
});
