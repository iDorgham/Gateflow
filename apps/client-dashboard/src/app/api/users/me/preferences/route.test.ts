const mockGetSessionClaims = jest.fn();
jest.mock('@/lib/auth-cookies', () => ({
  getSessionClaims: (...args: unknown[]) => mockGetSessionClaims(...args),
}));

const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@gate-access/db', () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

import { NextRequest } from 'next/server';

describe('/api/users/me/preferences', () => {
  let GET: () => Promise<Response>;
  let PATCH: (req: NextRequest) => Promise<Response>;

  beforeAll(async () => {
    const mod = await import('./route');
    GET = mod.GET;
    PATCH = mod.PATCH;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET returns 401 when session is missing', async () => {
    mockGetSessionClaims.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it('GET returns current preferences payload', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'user_1' });
    mockFindUnique.mockResolvedValue({
      preferences: { tableViews: { contacts: { activeView: 'default' } } },
    });

    const res = await GET();
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.data.tableViews.contacts.activeView).toBe('default');
  });

  it('PATCH merges tableViews and persists preferences', async () => {
    mockGetSessionClaims.mockResolvedValue({ sub: 'user_1' });
    mockFindUnique.mockResolvedValue({
      preferences: { tableViews: { contacts: { activeView: 'default' } } },
    });
    mockUpdate.mockResolvedValue({});

    const req = new NextRequest('http://localhost/api/users/me/preferences', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableViews: { units: { columnOrder: ['name', 'type'] } },
      }),
    });

    const res = await PATCH(req);
    const payload = await res.json();

    expect(res.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user_1' },
        data: expect.objectContaining({
          preferences: expect.objectContaining({
            tableViews: expect.objectContaining({
              contacts: expect.objectContaining({ activeView: 'default' }),
              units: expect.objectContaining({ columnOrder: ['name', 'type'] }),
            }),
          }),
        }),
      })
    );
  });
});
