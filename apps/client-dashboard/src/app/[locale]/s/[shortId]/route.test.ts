export {};

jest.mock('next/server', () => ({
  NextRequest: class MockNextRequest {},
  NextResponse: class MockNextResponse {
    status: number;

    constructor(
      public body: unknown,
      init?: { status?: number; headers?: Record<string, string> }
    ) {
      this.status = init?.status ?? 200;
    }
  },
}));

jest.mock('@atlaskit/tokens', () => ({
  token: (_name: string, fallback: string) => fallback,
}));

jest.mock('@/lib/arrival-capability', () => ({
  createArrivalCapability: jest.fn(() => 'arrival-capability'),
}));

const mockCheckRateLimit = jest.fn();
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
}));

const mockLinkFindUnique = jest.fn();
const mockClickCreate = jest.fn();
const mockVisitorFindFirst = jest.fn();
const mockOrganizationFindUnique = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    qrShortLink: {
      findUnique: (...args: unknown[]) => mockLinkFindUnique(...args),
    },
    shortLinkClick: {
      create: (...args: unknown[]) => mockClickCreate(...args),
    },
    visitorQR: {
      findFirst: (...args: unknown[]) => mockVisitorFindFirst(...args),
    },
    organization: {
      findUnique: (...args: unknown[]) => mockOrganizationFindUnique(...args),
    },
  },
}));

import { GET } from './route';

const LINK = {
  id: 'link-1',
  shortId: 'safe-link',
  fullPayload: 'signed-payload',
  qrId: 'qr-1',
  organizationId: 'org-1',
  projectId: 'project-1',
  expiresAt: null,
};

function browserRequest(url: string, forwardedFor = '203.0.113.42') {
  const headers = new Headers({
    accept: 'text/html',
    'user-agent': 'Browser/1.0',
    'x-forwarded-for': forwardedFor,
  });
  return { url, headers } as never;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockLinkFindUnique.mockResolvedValue(LINK);
  mockVisitorFindFirst.mockResolvedValue(null);
  mockOrganizationFindUnique.mockResolvedValue(null);
  mockClickCreate.mockResolvedValue({ id: 'click-1' });
  mockCheckRateLimit.mockResolvedValue({
    allowed: true,
    limit: 60,
    remaining: 59,
    retryAfterMs: 0,
  });
});

describe('GET /[locale]/s/[shortId] UTM attribution', () => {
  it('appends a bounded tenant-derived click without persisting the client IP', async () => {
    const response = await GET(
      browserRequest(
        'https://app.gateflow.site/en/s/safe-link?utm_source=%20newsletter%20&utm_campaign=summer'
      ),
      { params: Promise.resolve({ shortId: 'safe-link' }) }
    );

    expect(response.status).toBe(200);
    expect(mockCheckRateLimit).toHaveBeenCalledWith(
      expect.stringMatching(/^short-link-click:link-1:[a-f0-9]{64}$/),
      60,
      60_000
    );
    expect(mockClickCreate).toHaveBeenCalledWith({
      data: {
        shortLinkId: 'link-1',
        organizationId: 'org-1',
        projectId: 'project-1',
        utmSource: 'newsletter',
        utmMedium: null,
        utmCampaign: 'summer',
        utmContent: null,
        utmTerm: null,
        deviceInfo: { userAgent: 'Browser/1.0' },
      },
    });
    expect(JSON.stringify(mockClickCreate.mock.calls)).not.toContain(
      '203.0.113.42'
    );
  });

  it('still renders the pass without writing attribution when throttled', async () => {
    mockCheckRateLimit.mockResolvedValue({
      allowed: false,
      limit: 60,
      remaining: 0,
      retryAfterMs: 30_000,
    });

    const response = await GET(
      browserRequest(
        'https://app.gateflow.site/en/s/safe-link?utm_source=spam'
      ),
      { params: Promise.resolve({ shortId: 'safe-link' }) }
    );

    expect(response.status).toBe(200);
    expect(mockClickCreate).not.toHaveBeenCalled();
  });
});
