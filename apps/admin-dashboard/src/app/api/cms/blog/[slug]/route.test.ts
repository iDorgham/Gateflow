export {};

jest.mock('@/lib/admin-auth', () => ({
  isAdminAuthorized: jest.fn(),
}));

jest.mock('@gate-access/db', () => ({
  prisma: {
    blogPost: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

describe('PATCH /api/cms/blog/[slug]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sanitizes stored XSS in blog content on update', async () => {
    (isAdminAuthorized as jest.Mock).mockResolvedValue(true);
    (prisma.blogPost.findFirst as jest.Mock).mockResolvedValue({
      id: 'post-1',
      publishedAt: null,
    });
    (prisma.blogPost.update as jest.Mock).mockResolvedValue({ id: 'post-1' });

    const { PATCH } = await import('./route');
    const req = new Request('http://localhost/api/cms/blog/test-post', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentEn: '<p>Safe</p><script>alert(1)</script>',
        status: 'DRAFT',
      }),
    });

    const res = await PATCH(req, { params: { slug: 'test-post' } });
    expect(res.status).toBe(200);

    const updateCall = (prisma.blogPost.update as jest.Mock).mock.calls[0][0];
    expect(updateCall.data.contentEn).toContain('Safe');
    expect(updateCall.data.contentEn).not.toMatch(/script/i);
  });
});
