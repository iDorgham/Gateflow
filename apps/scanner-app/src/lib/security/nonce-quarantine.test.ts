import { NonceQuarantineManager } from './nonce-quarantine';

describe('nonce-quarantine anti-replay defense', () => {
  let manager: NonceQuarantineManager;
  const GATE_ID = 'gate_north_01';
  const DEVICE_ID = 'scanner_pos_09';

  beforeEach(() => {
    manager = new NonceQuarantineManager(10 * 60 * 1000); // 10 min window
  });

  test('allows first presentation of a unique nonce in under 5ms', () => {
    const result = manager.evaluateNonce('nonce_unique_101', {
      gateId: GATE_ID,
      deviceId: DEVICE_ID,
    });

    expect(result.allowed).toBe(true);
    expect(result.quarantined).toBe(false);
    expect(result.latencyMs).toBeLessThan(5);
  });

  test('quarantines rapid replay of same nonce immediately', () => {
    // First scan — allowed
    const first = manager.evaluateNonce('nonce_replay_202', {
      gateId: GATE_ID,
      deviceId: DEVICE_ID,
    });
    expect(first.allowed).toBe(true);

    // Second scan (replay) — blocked & quarantined
    const second = manager.evaluateNonce('nonce_replay_202', {
      gateId: GATE_ID,
      deviceId: DEVICE_ID,
    });
    expect(second.allowed).toBe(false);
    expect(second.quarantined).toBe(true);
    expect(second.reason).toBe('REPLAY_DETECTED');
    expect(second.record?.attemptsCount).toBe(2);
    expect(second.latencyMs).toBeLessThan(5);

    // Third scan — still quarantined
    const third = manager.evaluateNonce('nonce_replay_202', {
      gateId: GATE_ID,
      deviceId: DEVICE_ID,
    });
    expect(third.allowed).toBe(false);
    expect(third.record?.attemptsCount).toBe(3);
  });

  test('quarantines nonces with severe clock skew / outside window', () => {
    const pastTime = Date.now() - 30 * 60 * 1000; // 30 mins ago
    const result = manager.evaluateNonce('nonce_expired_303', {
      gateId: GATE_ID,
      deviceId: DEVICE_ID,
      timestamp: pastTime,
    });

    expect(result.allowed).toBe(false);
    expect(result.quarantined).toBe(true);
    expect(result.reason).toBe('EXPIRED_WINDOW');
  });

  test('getQuarantinedRecords returns list of blocked security incidents', () => {
    manager.evaluateNonce('n1', { gateId: GATE_ID, deviceId: DEVICE_ID });
    manager.evaluateNonce('n1', { gateId: GATE_ID, deviceId: DEVICE_ID }); // Replay

    const records = manager.getQuarantinedRecords();
    expect(records).toHaveLength(1);
    expect(records[0].nonce).toBe('n1');
  });
});
