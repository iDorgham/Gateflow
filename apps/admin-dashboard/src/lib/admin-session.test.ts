import { generateSessionToken, verifySessionToken } from './admin-session';

const SECRET = 'my-secret-key-1234567890abcdef';

describe('Admin Session Security', () => {
  test('generateSessionToken returns a token', () => {
    const token = generateSessionToken(SECRET);
    expect(typeof token).toBe('string');
    expect(token.includes('.')).toBe(true);
  });

  test('Tokens are unique (contain nonce)', () => {
    const token1 = generateSessionToken(SECRET);
    const token2 = generateSessionToken(SECRET);
    expect(token1).not.toBe(token2);
  });

  test('Valid token verifies correctly', () => {
    const token = generateSessionToken(SECRET);
    const payload = verifySessionToken(token, SECRET);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('admin');
    expect(payload?.jti).toBeDefined();
  });

  test('Invalid signature fails verification', () => {
    const token = generateSessionToken(SECRET);
    const parts = token.split('.');
    // Tamper with signature
    const tamperedToken = `${parts[0]}.badsignature`;
    expect(verifySessionToken(tamperedToken, SECRET)).toBeNull();
  });

  test('Tampered payload fails verification', () => {
    const token = generateSessionToken(SECRET);
    const parts = token.split('.');
    // Tamper with payload but keep signature
    const tamperedPayload = Buffer.from(JSON.stringify({ sub: 'admin', iat: Date.now(), exp: Date.now() + 99999, jti: 'fake' })).toString('base64url');
    const tamperedToken = `${tamperedPayload}.${parts[1]}`;

    expect(verifySessionToken(tamperedToken, SECRET)).toBeNull();
  });

  test('Wrong secret fails verification', () => {
    const token = generateSessionToken(SECRET);
    expect(verifySessionToken(token, 'wrong-secret')).toBeNull();
  });
});
