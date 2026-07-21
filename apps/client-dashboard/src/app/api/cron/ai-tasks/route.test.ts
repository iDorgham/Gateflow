export {};

jest.mock('@gate-access/db', () => ({
  prisma: {
    aiTask: {
      findMany: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
    },
  },
}));
jest.mock('@/lib/ai/ai-task-service', () => ({
  AiTaskService: { calculateNextRun: jest.fn() },
}));

import { NextRequest } from 'next/server';

describe('GET /api/cron/ai-tasks', () => {
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
      new NextRequest('http://localhost/api/cron/ai-tasks')
    );
    expect(res.status).toBe(503);
  });

  it('returns 401 when bearer token does not match', async () => {
    process.env.CRON_SECRET = 'a-very-long-cron-secret';
    const { GET } = await import('./route');
    const res = await GET(
      new NextRequest('http://localhost/api/cron/ai-tasks', {
        headers: { authorization: 'Bearer wrong' },
      })
    );
    expect(res.status).toBe(401);
  });

  it('returns 200 when bearer matches', async () => {
    process.env.CRON_SECRET = 'a-very-long-cron-secret';
    const { GET } = await import('./route');
    const res = await GET(
      new NextRequest('http://localhost/api/cron/ai-tasks', {
        headers: { authorization: 'Bearer a-very-long-cron-secret' },
      })
    );
    expect(res.status).toBe(200);
  });
});
