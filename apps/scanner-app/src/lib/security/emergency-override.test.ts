import {
  issueEmergencyToken,
  verifyEmergencyToken,
} from './emergency-override';

describe('emergency-override signed offline tokens', () => {
  const SECRET = 'emergency-guard-shift-hmac-secret-32-chars';
  const GUARD_ID = 'guard_ali_55';
  const GATE_ID = 'gate_south_02';
  const SHIFT_ID = 'shift_night_888';
  const REASON = 'Ambulance Entry — Power Outage';

  test('issueEmergencyToken creates valid EMG token that passes verification', () => {
    const token = issueEmergencyToken({
      guardId: GUARD_ID,
      gateId: GATE_ID,
      shiftId: SHIFT_ID,
      reason: REASON,
      secret: SECRET,
    });

    expect(token.startsWith('EMG:')).toBe(true);

    const result = verifyEmergencyToken(token, SECRET, { gateId: GATE_ID });
    expect(result.valid).toBe(true);
    expect(result.payload?.guardId).toBe(GUARD_ID);
    expect(result.payload?.gateId).toBe(GATE_ID);
    expect(result.payload?.reason).toBe(REASON);
  });

  test('verifyEmergencyToken rejects tampered token', () => {
    const token = issueEmergencyToken({
      guardId: GUARD_ID,
      gateId: GATE_ID,
      shiftId: SHIFT_ID,
      reason: REASON,
      secret: SECRET,
    });

    const tampered = token.slice(0, -3) + 'abc';
    const result = verifyEmergencyToken(tampered, SECRET);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('TAMPERED');
  });

  test('verifyEmergencyToken rejects expired token', () => {
    const token = issueEmergencyToken({
      guardId: GUARD_ID,
      gateId: GATE_ID,
      shiftId: SHIFT_ID,
      reason: REASON,
      secret: SECRET,
      ttlMs: -1000,
    });

    const result = verifyEmergencyToken(token, SECRET);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('EXPIRED');
  });

  test('verifyEmergencyToken rejects gate mismatch', () => {
    const token = issueEmergencyToken({
      guardId: GUARD_ID,
      gateId: GATE_ID,
      shiftId: SHIFT_ID,
      reason: REASON,
      secret: SECRET,
    });

    const result = verifyEmergencyToken(token, SECRET, {
      gateId: 'gate_different_99',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('GATE_MISMATCH');
  });
});
