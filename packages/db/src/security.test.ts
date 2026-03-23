export {};

import {
  createSecureInviteSignature,
  verifySecureInviteSignature,
} from './security';

const SECRET = 'test-secret-min-16-chars';
const PAYLOAD = 'unit:123:org:456:1711100000';

describe('createSecureInviteSignature', () => {
  test('returns a 64-char lowercase hex string (URL-safe)', () => {
    const sig = createSecureInviteSignature(PAYLOAD, SECRET);
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });

  test('is deterministic — same payload+secret always produce the same signature', () => {
    expect(createSecureInviteSignature(PAYLOAD, SECRET)).toBe(
      createSecureInviteSignature(PAYLOAD, SECRET)
    );
  });

  test('differs when payload changes', () => {
    expect(createSecureInviteSignature(PAYLOAD, SECRET)).not.toBe(
      createSecureInviteSignature('unit:999:org:456:1711100000', SECRET)
    );
  });

  test('differs when secret changes', () => {
    expect(createSecureInviteSignature(PAYLOAD, SECRET)).not.toBe(
      createSecureInviteSignature(PAYLOAD, 'different-secret-xxxx')
    );
  });

  test('throws when secret is shorter than 16 chars', () => {
    expect(() => createSecureInviteSignature(PAYLOAD, 'short')).toThrow();
  });

  test('throws when secret is empty', () => {
    expect(() => createSecureInviteSignature(PAYLOAD, '')).toThrow();
  });
});

describe('verifySecureInviteSignature', () => {
  test('returns true for a valid signature', () => {
    const sig = createSecureInviteSignature(PAYLOAD, SECRET);
    expect(verifySecureInviteSignature(PAYLOAD, sig, SECRET)).toBe(true);
  });

  test('returns false when payload is tampered', () => {
    const sig = createSecureInviteSignature(PAYLOAD, SECRET);
    expect(
      verifySecureInviteSignature(
        'tampered:payload:org:456:1711100000',
        sig,
        SECRET
      )
    ).toBe(false);
  });

  test('returns false when signature is bit-flipped (single byte)', () => {
    const sig = createSecureInviteSignature(PAYLOAD, SECRET);
    // Flip the last two hex chars to corrupt one byte
    const flipped = sig.slice(0, -2) + (sig.endsWith('ff') ? '00' : 'ff');
    expect(verifySecureInviteSignature(PAYLOAD, flipped, SECRET)).toBe(false);
  });

  test('returns false when secret is wrong', () => {
    const sig = createSecureInviteSignature(PAYLOAD, SECRET);
    expect(verifySecureInviteSignature(PAYLOAD, sig, 'wrong-secret-16xx')).toBe(
      false
    );
  });

  test('returns false when payload is empty', () => {
    const sig = createSecureInviteSignature(PAYLOAD, SECRET);
    expect(verifySecureInviteSignature('', sig, SECRET)).toBe(false);
  });

  test('returns false when signature is empty', () => {
    expect(verifySecureInviteSignature(PAYLOAD, '', SECRET)).toBe(false);
  });

  test('returns false when secret is empty', () => {
    const sig = createSecureInviteSignature(PAYLOAD, SECRET);
    expect(verifySecureInviteSignature(PAYLOAD, sig, '')).toBe(false);
  });

  test('returns false for non-hex garbage signature (invalid bytes stripped by Buffer)', () => {
    expect(
      verifySecureInviteSignature(PAYLOAD, 'gg-not-valid-hex!@#$', SECRET)
    ).toBe(false);
  });

  test('returns false for signature of correct hex length but wrong value', () => {
    const zeros = '0'.repeat(64);
    expect(verifySecureInviteSignature(PAYLOAD, zeros, SECRET)).toBe(false);
  });
});
