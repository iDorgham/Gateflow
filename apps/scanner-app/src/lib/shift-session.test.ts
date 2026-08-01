jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import {
  canScanWithShift,
  parseShiftSession,
  type ShiftSession,
} from './shift-session';

describe('parseShiftSession', () => {
  it('returns null for empty or invalid JSON', () => {
    expect(parseShiftSession(null)).toBeNull();
    expect(parseShiftSession('')).toBeNull();
    expect(parseShiftSession('{')).toBeNull();
    expect(parseShiftSession('{"gateId":"g1"}')).toBeNull();
  });

  it('parses a valid session payload', () => {
    const session: ShiftSession = {
      shiftLogId: 'shift_1',
      gateId: 'gate_1',
      gateName: 'Main',
      startTime: '2026-08-01T10:00:00.000Z',
    };
    expect(parseShiftSession(JSON.stringify(session))).toEqual(session);
  });
});

describe('canScanWithShift', () => {
  const session: ShiftSession = {
    shiftLogId: 'shift_1',
    gateId: 'gate_1',
    startTime: '2026-08-01T10:00:00.000Z',
  };

  it('blocks scanning without an active session', () => {
    expect(canScanWithShift(null, 'gate_1')).toBe(false);
  });

  it('blocks scanning when gate does not match the shift gate', () => {
    expect(canScanWithShift(session, 'gate_other')).toBe(false);
  });

  it('allows scanning when shift is active for the selected gate', () => {
    expect(canScanWithShift(session, 'gate_1')).toBe(true);
  });
});
