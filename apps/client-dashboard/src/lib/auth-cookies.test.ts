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
  cookies: jest.fn(() => mockCookiesObj),
  headers: jest.fn(() => mockHeadersObj),
}));

const mockVerifyAccessToken = jest.fn();
jest.mock('./auth', () => ({
  verifyAccessToken: mockVerifyAccessToken,
}));

describe('auth-cookies', () => {
  beforeEach(() => {
    mockCookiesObj.set.mockClear();
    mockCookiesObj.delete.mockClear();
    mockCookiesObj.get.mockClear();
    mockHeadersObj.get.mockClear();
    mockVerifyAccessToken.mockClear();
  });

  describe('setAuthCookies', () => {
    it('sets access and refresh tokens with correct options', async () => {
      const { setAuthCookies } = await import('./auth-cookies');
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      setAuthCookies(accessToken, refreshToken);

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
    });
  });

  describe('clearAuthCookies', () => {
    it('deletes access, refresh, and csrf tokens', async () => {
      const { clearAuthCookies } = await import('./auth-cookies');
      clearAuthCookies();

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

      const result = getRefreshToken();

      expect(mockCookiesObj.get).toHaveBeenCalledWith('gf_refresh_token');
      expect(result).toBe('refresh-token-value');
    });

    it('returns undefined if refresh token is missing', async () => {
      const { getRefreshToken } = await import('./auth-cookies');
      mockCookiesObj.get.mockReturnValue(undefined);

      const result = getRefreshToken();

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
      const { getSessionClaims } = await import('./auth-cookies');
      const originalHeaders = nextHeaders.headers;
      (nextHeaders as unknown as { headers: typeof nextHeaders.headers }).headers = jest.fn(() => {
        throw new Error('headers() error');
      });
      mockCookiesObj.get.mockImplementation((key: string) => {
        if (key === 'gf_access_token') return { value: 'valid-cookie-token' };
        return undefined;
      });
      mockVerifyAccessToken.mockResolvedValue(validClaims);

      const result = await getSessionClaims();

      (nextHeaders as unknown as { headers: typeof nextHeaders.headers }).headers = originalHeaders;
      expect(result).toEqual(validClaims);
    });

    it('handles cookies() throwing error', async () => {
      const { getSessionClaims } = await import('./auth-cookies');
      mockHeadersObj.get.mockReturnValue(null);
      const originalCookies = nextHeaders.cookies;
      (nextHeaders as unknown as { cookies: typeof nextHeaders.cookies }).cookies = jest.fn(() => {
        throw new Error('cookies() error');
      });

      const result = await getSessionClaims();

      (nextHeaders as unknown as { cookies: typeof nextHeaders.cookies }).cookies = originalCookies;
      expect(result).toBeNull();
    });
  });
});
