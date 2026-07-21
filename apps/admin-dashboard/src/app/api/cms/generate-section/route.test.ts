export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthorized: jest.fn(),
}));
jest.mock('@ai-sdk/google', () => ({
  google: jest.fn(() => 'mock-model'),
}));
jest.mock('ai', () => ({
  generateObject: jest.fn(),
}));

import { isAdminAuthorized } from '@/lib/admin-auth';
import { generateObject } from 'ai';

describe('POST /api/cms/generate-section', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when not authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(false);
    const { POST } = await import('./route');
    const res = await POST(
      new Request('http://localhost/api/cms/generate-section', {
        method: 'POST',
        body: JSON.stringify({ prompt: 'x', blockType: 'hero' }),
      })
    );
    expect(res.status).toBe(401);
  });

  it('returns section when authorized', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    (generateObject as jest.Mock).mockResolvedValue({
      object: { en: { headline: 'Hi' }, ar: { headline: 'مرحبا' } },
    });
    const { POST } = await import('./route');
    const res = await POST(
      new Request('http://localhost/api/cms/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'x', blockType: 'hero' }),
      })
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { section: unknown };
    expect(body.section).toBeDefined();
  });
});
