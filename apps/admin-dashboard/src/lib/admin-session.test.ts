import { generateSessionToken, verifySessionToken } from './admin-session';

const SECRET = 'my-secret-key-1234567890abcdef';

describe('Admin Session Security', () => {
  test('generateSessionToken returns a signed token', async () => {
    const token = await generateSessionToken(SECRET);
    expect(typeof token).toBe('string');
    expect(token.includes('.')).toBe(true);
  });

  test('Tokens are unique (contain nonce)', async () => {
    const token1 = await generateSessionToken(SECRET);
    const token2 = await generateSessionToken(SECRET);
    expect(token1).not.toBe(token2);
  });

  test('Valid token verifies correctly', async () => {
    const token = await generateSessionToken(SECRET);
    const payload = await verifySessionToken(token, SECRET);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('admin');
    expect(payload?.jti).toBeDefined();
  });

  test('Invalid signature fails verification', async () => {
    const token = await generateSessionToken(SECRET);
    const parts = token.split('.');
    const tamperedToken = `${parts[0]}.badsignature`;
    expect(await verifySessionToken(tamperedToken, SECRET)).toBeNull();
  });

  test('Tampered payload fails verification', async () => {
    const token = await generateSessionToken(SECRET);
    const parts = token.split('.');
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        sub: 'admin',
        iat: Date.now(),
        exp: Date.now() + 99999,
        jti: 'fake',
      })
    ).toString('base64url');
    const tamperedToken = `${tamperedPayload}.${parts[1]}`;

    expect(await verifySessionToken(tamperedToken, SECRET)).toBeNull();
  });

  test('Wrong secret fails verification', async () => {
    const token = await generateSessionToken(SECRET);
    expect(await verifySessionToken(token, 'wrong-secret')).toBeNull();
  });
});
