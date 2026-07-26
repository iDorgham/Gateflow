jest.mock('next/server', () => ({
  NextResponse: {
    next: () => ({ status: 200 }),
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      body,
    }),
    redirect: () => ({ status: 307 }),
  },
}));

jest.mock('negotiator', () => jest.fn());
jest.mock('@formatjs/intl-localematcher', () => ({ match: () => 'en' }));
jest.mock('./lib/i18n', () => ({
  i18n: { locales: ['en', 'ar'], defaultLocale: 'en' },
  LOCALE_COOKIE: 'gf_locale',
}));

import { config, middleware } from './middleware';

function request(
  path: string,
  init: {
    method?: string;
    origin?: string;
    authorization?: string;
    csrfCookie?: string;
    csrfHeader?: string;
    auth?: boolean;
    nextAction?: boolean;
  } = {}
) {
  const headers = new Headers();
  const cookies: string[] = [];
  if (init.auth !== false) cookies.push('gf_access_token=session');
  if (init.csrfCookie) cookies.push(`gf_csrf_token=${init.csrfCookie}`);
  if (cookies.length) headers.set('cookie', cookies.join('; '));
  if (init.origin) headers.set('origin', init.origin);
  if (init.authorization) headers.set('authorization', init.authorization);
  if (init.csrfHeader) headers.set('x-csrf-token', init.csrfHeader);
  if (init.nextAction) headers.set('next-action', 'action-id');

  const url = new URL(`http://localhost${path}`);
  const cookieMap = new Map(
    cookies.map((cookie) => cookie.split('=') as [string, string])
  );
  return {
    method: init.method ?? 'POST',
    url: url.toString(),
    nextUrl: {
      pathname: url.pathname,
      search: url.search,
      origin: url.origin,
    },
    headers,
    cookies: {
      get: (name: string) => {
        const value = cookieMap.get(name);
        return value ? { value } : undefined;
      },
    },
  } as never;
}

describe('client dashboard CSRF middleware', () => {
  it('matches API routes in production configuration', () => {
    expect(config.matcher[0]).not.toContain('(?!api|');
  });

  it('rejects a cross-origin cookie-authenticated mutation', async () => {
    const response = await middleware(
      request('/api/projects', { origin: 'https://evil.example' })
    );
    expect(response.status).toBe(403);
  });

  it('allows an exact double-submit token without Origin', async () => {
    const response = await middleware(
      request('/api/projects', {
        csrfCookie: 'csrf-value',
        csrfHeader: 'csrf-value',
      })
    );
    expect(response.status).toBe(200);
  });

  it('does not let same-origin fallback hide an invalid explicit token', async () => {
    const response = await middleware(
      request('/api/projects', {
        origin: 'http://localhost',
        csrfCookie: 'expected',
        csrfHeader: 'wrong',
      })
    );
    expect(response.status).toBe(403);
  });

  it('allows a same-origin compatibility request with no token header', async () => {
    const response = await middleware(
      request('/api/projects', { origin: 'http://localhost' })
    );
    expect(response.status).toBe(200);
  });

  it('does not treat API requests as Next Server Actions', async () => {
    const response = await middleware(
      request('/api/projects', {
        origin: 'https://evil.example',
        nextAction: true,
      })
    );
    expect(response.status).toBe(403);
  });

  it('requires a non-empty bearer credential for exemption', async () => {
    const response = await middleware(
      request('/api/projects', {
        origin: 'https://evil.example',
        authorization: 'Bearer ',
      })
    );
    expect(response.status).toBe(403);
  });
});
