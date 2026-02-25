/**
 * Unit tests for auth-client.ts
 *
 * Coverage:
 *  1. login()              — success (stores tokens), 401, network error
 *  2. getValidAccessToken() — valid token (no refresh), no token, expired+refresh,
 *                             expired+refresh-fails (clears tokens)
 *  3. logout()             — clears tokens, best-effort server revoke
 */

// ─── Hoist mocks before any imports ──────────────────────────────────────────

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-jwt', () => ({
  __esModule: true,
  default: { decode: jest.fn() },
}));

// ─── Imports after mocks ──────────────────────────────────────────────────────

import * as SecureStore from 'expo-secure-store';
import JWT from 'expo-jwt';
import { login, logout, getValidAccessToken } from './auth-client';

// ─── Typed mock helpers ───────────────────────────────────────────────────────

const mockGetItem = SecureStore.getItemAsync as jest.MockedFunction<
  typeof SecureStore.getItemAsync
>;
const mockSetItem = SecureStore.setItemAsync as jest.MockedFunction<
  typeof SecureStore.setItemAsync
>;
const mockDeleteItem = SecureStore.deleteItemAsync as jest.MockedFunction<
  typeof SecureStore.deleteItemAsync
>;
const mockJwtDecode = JWT.decode as jest.MockedFunction<typeof JWT.decode>;

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCESS_TOKEN = 'header.payload.sig';
const REFRESH_TOKEN = 'opaque-refresh-token-value';
const NEW_ACCESS_TOKEN = 'new.access.token';
const NEW_REFRESH_TOKEN = 'new-refresh-token';

// exp values (seconds since epoch)
const FUTURE_EXP = Math.floor(Date.now() / 1000) + 3_600; // 1 h from now → not expired
const PAST_EXP = Math.floor(Date.now() / 1000) - 200;     // 200 s ago → expired

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

// ─── 1. login() ───────────────────────────────────────────────────────────────

describe('login()', () => {
  it('returns success and stores both tokens on 200', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: jest.fn() },
      json: () =>
        Promise.resolve({
          success: true,
          data: { accessToken: ACCESS_TOKEN, refreshToken: REFRESH_TOKEN },
        }),
    });

    const result = await login('op@example.com', 'password123');

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
    expect(mockSetItem).toHaveBeenCalledWith('auth_token', ACCESS_TOKEN);
    expect(mockSetItem).toHaveBeenCalledWith('auth_refresh_token', REFRESH_TOKEN);
  });

  it('returns error and does NOT store tokens on 401 invalid credentials', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: jest.fn() },
      json: () =>
        Promise.resolve({ success: false, message: 'Invalid credentials' }),
    });

    const result = await login('op@example.com', 'wrong-password');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it('returns error on network failure (fetch throws)', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network request failed'));

    const result = await login('op@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network request failed');
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it('returns error from server message on 500', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: jest.fn() },
      json: () =>
        Promise.resolve({ success: false, message: 'Internal server error' }),
    });

    const result = await login('op@example.com', 'password123');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Internal server error');
  });
});

// ─── 2. getValidAccessToken() — auto-login / refresh ─────────────────────────

describe('getValidAccessToken()', () => {
  it('returns token directly when stored token is not expired (auto-login path)', async () => {
    mockGetItem.mockResolvedValue(ACCESS_TOKEN);
    // decodeJwt returns a far-future exp → not expired
    mockJwtDecode.mockReturnValue({ exp: FUTURE_EXP });

    const token = await getValidAccessToken();

    expect(token).toBe(ACCESS_TOKEN);
    // No refresh call made
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns null when no token is stored (first launch / logged out)', async () => {
    mockGetItem.mockResolvedValue(null);

    const token = await getValidAccessToken();

    expect(token).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('refreshes and returns new access token when stored token is expired', async () => {
    // 1st call → access token (expired), 2nd call → refresh token
    mockGetItem
      .mockResolvedValueOnce(ACCESS_TOKEN)
      .mockResolvedValueOnce(REFRESH_TOKEN);
    mockJwtDecode.mockReturnValue({ exp: PAST_EXP });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: jest.fn() },
      json: () =>
        Promise.resolve({
          success: true,
          data: { accessToken: NEW_ACCESS_TOKEN, refreshToken: NEW_REFRESH_TOKEN },
        }),
    });

    const token = await getValidAccessToken();

    expect(token).toBe(NEW_ACCESS_TOKEN);
    expect(mockSetItem).toHaveBeenCalledWith('auth_token', NEW_ACCESS_TOKEN);
    expect(mockSetItem).toHaveBeenCalledWith('auth_refresh_token', NEW_REFRESH_TOKEN);
  });

  it('returns null and clears both tokens when refresh endpoint fails', async () => {
    mockGetItem
      .mockResolvedValueOnce(ACCESS_TOKEN)
      .mockResolvedValueOnce(REFRESH_TOKEN);
    mockJwtDecode.mockReturnValue({ exp: PAST_EXP });

    (global.fetch as jest.Mock).mockResolvedValue({ 
      ok: false,
      headers: { get: jest.fn() },
      json: () => Promise.resolve({ success: false }) 
    });

    const token = await getValidAccessToken();

    expect(token).toBeNull();
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_token');
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_refresh_token');
  });

  it('returns null when expired but no refresh token is stored', async () => {
    mockGetItem
      .mockResolvedValueOnce(ACCESS_TOKEN) // access token found
      .mockResolvedValueOnce(null);         // but no refresh token
    mockJwtDecode.mockReturnValue({ exp: PAST_EXP });

    const token = await getValidAccessToken();

    expect(token).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

// ─── 2b. getValidAccessToken() — concurrent refresh deduplication ─────────────

describe('getValidAccessToken() — concurrent deduplication', () => {
  it('makes exactly one network request when called concurrently with an expired token', async () => {
    // Both concurrent calls will see the same expired access token and the
    // same refresh token.  Only one fetch should be sent to the server.
    mockGetItem.mockImplementation(async (key: string) => {
      if (key === 'auth_token') return ACCESS_TOKEN;
      if (key === 'auth_refresh_token') return REFRESH_TOKEN;
      return null;
    });
    mockJwtDecode.mockReturnValue({ exp: PAST_EXP });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: { get: jest.fn().mockReturnValue(null) },
      json: () =>
        Promise.resolve({
          success: true,
          data: { accessToken: NEW_ACCESS_TOKEN, refreshToken: NEW_REFRESH_TOKEN },
        }),
    });

    const [token1, token2] = await Promise.all([
      getValidAccessToken(),
      getValidAccessToken(),
    ]);

    expect(token1).toBe(NEW_ACCESS_TOKEN);
    expect(token2).toBe(NEW_ACCESS_TOKEN);
    // Only one network request despite two concurrent calls.
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // Both calls store the rotated tokens.
    expect(mockSetItem).toHaveBeenCalledWith('auth_token', NEW_ACCESS_TOKEN);
    expect(mockSetItem).toHaveBeenCalledWith('auth_refresh_token', NEW_REFRESH_TOKEN);
  });

  it('returns null for all concurrent callers when refresh fails', async () => {
    mockGetItem.mockImplementation(async (key: string) => {
      if (key === 'auth_token') return ACCESS_TOKEN;
      if (key === 'auth_refresh_token') return REFRESH_TOKEN;
      return null;
    });
    mockJwtDecode.mockReturnValue({ exp: PAST_EXP });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: jest.fn().mockReturnValue(null) },
      json: () => Promise.resolve({ success: false, message: 'Refresh token expired' }),
    });

    const [token1, token2] = await Promise.all([
      getValidAccessToken(),
      getValidAccessToken(),
    ]);

    expect(token1).toBeNull();
    expect(token2).toBeNull();
    // Still only one network request.
    expect(global.fetch).toHaveBeenCalledTimes(1);
    // Both callers cleared tokens on failure.
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_token');
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_refresh_token');
  });
});

// ─── 3. logout() ─────────────────────────────────────────────────────────────

describe('logout()', () => {
  it('clears both secure store tokens and best-effort revokes on server', async () => {
    mockGetItem.mockResolvedValue(REFRESH_TOKEN);
    (global.fetch as jest.Mock).mockResolvedValue({ 
      ok: true,
      headers: { get: jest.fn() }
    });

    await logout();

    expect(mockDeleteItem).toHaveBeenCalledWith('auth_token');
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_refresh_token');
    // Server revocation was attempted
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('still clears tokens when server revocation fails (fire-and-forget)', async () => {
    mockGetItem.mockResolvedValue(REFRESH_TOKEN);
    // fetch throws — should be caught by .catch(() => {}) in logout()
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await logout();

    expect(mockDeleteItem).toHaveBeenCalledWith('auth_token');
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_refresh_token');
  });

  it('skips server revoke call when no refresh token is stored', async () => {
    mockGetItem.mockResolvedValue(null);

    await logout();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_token');
    expect(mockDeleteItem).toHaveBeenCalledWith('auth_refresh_token');
  });
});
