import { GET } from './route';
import { NextRequest } from 'next/server';

const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: () => mockGetSessionClaims(),
}));

const mockUserFindFirst = jest.fn();
const mockQRCodeFindFirst = jest.fn();

jest.mock('@gate-access/db', () => ({
  prisma: {
    user: { findFirst: (...args: unknown[]) => mockUserFindFirst(...args) },
    qRCode: { findFirst: (...args: unknown[]) => mockQRCodeFindFirst(...args) },
  },
}));

describe('Wallet Export API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSessionClaims.mockResolvedValue({ sub: 'user_1', orgId: 'org_1' });
    mockUserFindFirst.mockResolvedValue({
      id: 'user_1',
      firstName: 'Fatima',
      lastName: 'Al-Mansoor',
      organization: { name: 'Al-Mansoor Heights' },
    });
    mockQRCodeFindFirst.mockResolvedValue({
      id: 'qr_999',
      code: 'https://app.gateflow.site/qr/valid_999',
      validUntil: new Date('2026-12-31T23:59:59Z'),
    });
  });

  it('rejects unauthenticated GET requests with 401', async () => {
    mockGetSessionClaims.mockResolvedValue(null);

    const req = new NextRequest(
      'http://localhost/api/wallet/export?format=apple'
    );
    const res = await GET(req);

    expect(res.status).toBe(401);
  });

  it('returns Google Pay save URL when format=google', async () => {
    const req = new NextRequest(
      'http://localhost/api/wallet/export?format=google'
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.format).toBe('google');
    expect(data.saveUrl).toContain('https://pay.google.com/gp/v/save/');
  });

  it('returns Apple Wallet pass dictionary when format=apple', async () => {
    const req = new NextRequest(
      'http://localhost/api/wallet/export?format=apple'
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.format).toBe('apple');
    expect(data.pass.organizationName).toBe('Al-Mansoor Heights');
    expect(data.downloadFilename).toContain('.pkpass');
  });
});
