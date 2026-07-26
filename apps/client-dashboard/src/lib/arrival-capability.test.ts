import {
  createArrivalCapability,
  verifyArrivalCapability,
} from './arrival-capability';

const SECRET = 'test-arrival-capability-secret-at-least-32-characters';
const NOW = new Date('2026-07-25T12:00:00.000Z');

describe('arrival capability', () => {
  it('round-trips a purpose-bound visitor QR claim', () => {
    const token = createArrivalCapability('visitor-1', SECRET, NOW);

    expect(verifyArrivalCapability(token, SECRET, NOW)).toEqual({
      visitorQRId: 'visitor-1',
    });
  });

  it('rejects tampering and the wrong secret', () => {
    const token = createArrivalCapability('visitor-1', SECRET, NOW);

    expect(verifyArrivalCapability(`${token}x`, SECRET, NOW)).toBeNull();
    expect(
      verifyArrivalCapability(
        token,
        'different-arrival-secret-at-least-32-characters',
        NOW
      )
    ).toBeNull();
  });

  it('rejects expired capabilities', () => {
    const token = createArrivalCapability('visitor-1', SECRET, NOW);
    const expiredAt = new Date(NOW.getTime() + 5 * 60_000 + 1);

    expect(verifyArrivalCapability(token, SECRET, expiredAt)).toBeNull();
  });

  it('fails closed when the secret is too short', () => {
    expect(() => createArrivalCapability('visitor-1', 'short', NOW)).toThrow();
    expect(verifyArrivalCapability('invalid', 'short', NOW)).toBeNull();
  });
});
