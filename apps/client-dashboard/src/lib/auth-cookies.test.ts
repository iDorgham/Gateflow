// Test file for auth-cookies
import * as nextHeaders from 'next/headers';

const mockCookiesObj = {
  set: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
};

const mockHeadersObj = {
  get: jest.fn(),
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => mockCookiesObj),
  headers: jest.fn(async () => mockHeadersObj),
}));

const mockVerifyAccessToken = jest.fn();
jest.mock('./auth', () => ({
  verifyAccessToken: mockVerifyAccessToken,
}));

describe('auth-cookies', () => {
  beforeEach(() => {
    mockCookiesObj.set.mockClear();
    mockCookiesObj.delete.mockClear();
    mockCookiesObj.get.mockReset();
    mockHeadersObj.get.mockReset();
    mockVerifyAccessToken.mockReset();
  });

  describe('resolveAuthCookieDomain', () => {
    it('returns undefined when AUTH_COOKIE_DOMAIN is unset', async () => {
      const { resolveAuthCookieDomain } = await import('./auth-cookies');
      expect(resolveAuthCookieDomain({})).toBeUndefined();
    });

    it('normalizes AUTH_COOKIE_DOMAIN with a leading dot', async () => {
      const { resolveAuthCookieDomain } = await import('./auth-cookies');
      expect(
        resolveAuthCookieDomain({ AUTH_COOKIE_DOMAIN: 'gateflow.site' })
      ).toBe('.gateflow.site');
      expect(
        resolveAuthCookieDomain({ AUTH_COOKIE_DOMAIN: '.gateflow.site' })
      ).toBe('.gateflow.site');
    });
  });

  describe('setAuthCookies', () => {
    const originalDomain = process.env.AUTH_COOKIE_DOMAIN;

    afterEach(() => {
      if (originalDomain === undefined) {
        delete process.env.AUTH_COOKIE_DOMAIN;
      } else {
        process.env.AUTH_COOKIE_DOMAIN = originalDomain;
      }
    });

    it('sets access and refresh tokens with correct options', async () => {
      delete process.env.AUTH_COOKIE_DOMAIN;
      const { setAuthCookies } = await import('./auth-cookies');
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      await setAuthCookies(accessToken, refreshToken);

      expect(mockCookiesObj.set).toHaveBeenCalledTimes(2);
      expect(mockCookiesObj.set).toHaveBeenCalledWith(
        'gf_access_token',
        accessToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 15,
        })
      );
      expect(mockCookiesObj.set).toHaveBeenCalledWith(
        'gf_refresh_token',
        refreshToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      );
      expect(mockCookiesObj.set.mock.calls[0][2].domain).toBeUndefined();
    });

    it('sets parent Domain when AUTH_COOKIE_DOMAIN is configured', async () => {
      process.env.AUTH_COOKIE_DOMAIN = '.gateflow.site';
      const { setAuthCookies } = await import('./auth-cookies');

      await setAuthCookies('access-token', 'refresh-token');

      expect(mockCookiesObj.set).toHaveBeenCalledWith(
        'gf_access_token',
        'access-token',
        expect.objectContaining({
          domain: '.gateflow.site',
          path: '/',
          sameSite: 'lax',
        })
      );
    });
  });

  describe('clearAuthCookies', () => {
    it('deletes access, refresh, and csrf tokens', async () => {
      const { clearAuthCookies } = await import('./auth-cookies');
      await clearAuthCookies();

      expect(mockCookiesObj.delete).toHaveBeenCalledTimes(3);
      expect(mockCookiesObj.delete).toHaveBeenCalledWith('gf_access_token');
      expect(mockCookiesObj.delete).toHaveBeenCalledWith('gf_refresh_token');
      expect(mockCookiesObj.delete).toHaveBeenCalledWith('gf_csrf_token');
    });
  });

  describe('getRefreshToken', () => {
    it('returns refresh token value if present', async () => {
      const { getRefreshToken } = await import('./auth-cookies');
      mockCookiesObj.get.mockReturnValue({ value: 'refresh-token-value' });

      const result = await getRefreshToken();

      expect(mockCookiesObj.get).toHaveBeenCalledWith('gf_refresh_token');
      expect(result).toBe('refresh-token-value');
    });

    it('returns undefined if refresh token is missing', async () => {
      const { getRefreshToken } = await import('./auth-cookies');
      mockCookiesObj.get.mockReturnValue(undefined);

      const result = await getRefreshToken();

      expect(mockCookiesObj.get).toHaveBeenCalledWith('gf_refresh_token');
      expect(result).toBeUndefined();
    });
  });

  describe('getSessionClaims', () => {
    const validClaims = {
      sub: 'user-id',
      email: 'test@example.com',
      role: 'ADMIN',
      orgId: 'org-id',
      orgType: 'REAL_ESTATE',
    };

    it('returns claims from valid Authorization header', async () => {
      const { getSessionClaims } = await import('./auth-cookies');
      mockHeadersObj.get.mockImplementation((key: string) => {
        if (key.toLowerCase() === 'authorization') return 'Bearer valid-token';
        return null;
      });
      mockVerifyAccessToken.mockResolvedValue(validClaims);

      const result = await getSessionClaims();

      expect(mockHeadersObj.get).toHaveBeenCalledWith('authorization');
      expect(mockVerifyAccessToken).toHaveBeenCalledWith('valid-token');
      expect(result).toEqual(validClaims);
    });

    it('returns null if Authorization header is invalid format', async () => {
      const { getSessionClaims } = await import('./auth-cookies');
      mockHeadersObj.get.mockImplementation((key: string) => {
        if (key.toLowerCase() === 'authorization') return 'InvalidToken';
        return null;
      });

      const result = await getSessionClaims();

      expect(mockVerifyAccessToken).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null if verifyAccessToken fails for header token', async () => {
      const { getSessionClaims } = await import('./auth-cookies');
      mockHeadersObj.get.mockImplementation((key: string) => {
        if (key.toLowerCase() === 'authorization')
          return 'Bearer invalid-token';
        return null;
      });
      mockVerifyAccessToken.mockRejectedValue(new Error('Invalid token'));

      const result = await getSessionClaims();

      expect(mockVerifyAccessToken).toHaveBeenCalledWith('invalid-token');
      expect(result).toBeNull();
    });

    it('returns claims from valid cookie if header is missing', async () => {
      const { getSessionClaims } = await import('./auth-cookies');
      mockHeadersObj.get.mockReturnValue(null);
      mockCookiesObj.get.mockImplementation((key: string) => {
        if (key === 'gf_access_token') return { value: 'valid-cookie-token' };
        return undefined;
      });
      mockVerifyAccessToken.mockResolvedValue(validClaims);

      const result = await getSessionClaims();

      expect(mockCookiesObj.get).toHaveBeenCalledWith('gf_access_token');
      expect(mockVerifyAccessToken).toHaveBeenCalledWith('valid-cookie-token');
      expect(result).toEqual(validClaims);
    });

    it('returns null if cookie is missing', async () => {
      const { getSessionClaims } = await import('./auth-cookies');
      mockHeadersObj.get.mockReturnValue(null);
      mockCookiesObj.get.mockReturnValue(undefined);

      const result = await getSessionClaims();

      expect(result).toBeNull();
    });

    it('returns null if verifyAccessToken fails for cookie token', async () => {
      const { getSessionClaims } = await import('./auth-cookies');
      mockHeadersObj.get.mockReturnValue(null);
      mockCookiesObj.get.mockImplementation((key: string) => {
        if (key === 'gf_access_token') return { value: 'invalid-cookie-token' };
        return undefined;
      });
      mockVerifyAccessToken.mockRejectedValue(new Error('Invalid token'));

      const result = await getSessionClaims();

      expect(result).toBeNull();
    });

    it('handles headers() throwing error (e.g. outside request context)', async () => {
      (nextHeaders.headers as jest.Mock).mockImplementationOnce(() => {
        throw new Error('headers() error');
      });
      mockCookiesObj.get.mockImplementation((key: string) => {
        if (key === 'gf_access_token') return { value: 'valid-cookie-token' };
        return undefined;
      });
      mockVerifyAccessToken.mockResolvedValue(validClaims);

      const { getSessionClaims } = await import('./auth-cookies');
      const result = await getSessionClaims();

      expect(result).toEqual(validClaims);
    });

    it('handles cookies() throwing error', async () => {
      mockHeadersObj.get.mockReturnValue(null);
      (nextHeaders.cookies as jest.Mock).mockImplementationOnce(() => {
        throw new Error('cookies() error');
      });

      const { getSessionClaims } = await import('./auth-cookies');
      const result = await getSessionClaims();

      expect(result).toBeNull();
    });
  });
});
