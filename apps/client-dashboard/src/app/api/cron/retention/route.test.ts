export {};

jest.mock('@gate-access/db', () => ({
  runRetentionBatch: jest.fn().mockResolvedValue({
    generatedAt: '2026-09-01T02:00:00.000Z',
    organizations: [],
    totals: { deleted: 0, anonymized: 0 },
  }),
}));

import { NextRequest } from 'next/server';

describe('GET /api/cron/retention', () => {
  const original = process.env.CRON_SECRET;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.CRON_SECRET;
    } else {
      process.env.CRON_SECRET = original;
    }
    jest.resetModules();
  });

  it('returns 503 when CRON_SECRET is missing (fail closed)', async () => {
    delete process.env.CRON_SECRET;
    const { GET } = await import('./route');
    const res = await GET(
      new NextRequest('http://localhost/api/cron/retention')
    );
    expect(res.status).toBe(503);
  });

  it('returns 401 when bearer token does not match', async () => {
    process.env.CRON_SECRET = 'a-very-long-cron-secret';
    const { GET } = await import('./route');
    const res = await GET(
      new NextRequest('http://localhost/api/cron/retention', {
        headers: { authorization: 'Bearer wrong' },
      })
    );
    expect(res.status).toBe(401);
  });

  it('returns success summary when bearer matches', async () => {
    process.env.CRON_SECRET = 'a-very-long-cron-secret';
    const { GET } = await import('./route');
    const res = await GET(
      new NextRequest('http://localhost/api/cron/retention', {
        headers: { authorization: 'Bearer a-very-long-cron-secret' },
      })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.totals.deleted).toBe('number');
  });
});
