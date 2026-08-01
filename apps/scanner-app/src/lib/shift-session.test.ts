jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from 'expo-secure-store';
import {
  canScanWithShift,
  loadShiftSession,
  loadShiftSessionForUser,
  parseShiftSession,
  parseShiftTombstone,
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

describe('loadShiftSession + tombstone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('parses ended/pending_end tombstones', () => {
    expect(
      parseShiftTombstone(
        JSON.stringify({
          shiftLogId: 'shift_1',
          reason: 'ended',
          at: '2026-08-01T12:00:00.000Z',
        })
      )
    ).toEqual({
      shiftLogId: 'shift_1',
      reason: 'ended',
      at: '2026-08-01T12:00:00.000Z',
    });
    expect(parseShiftTombstone('{"shiftLogId":"x"}')).toBeNull();
  });

  it('hides a SecureStore session when an ended tombstone matches', async () => {
    const session: ShiftSession = {
      shiftLogId: 'shift_1',
      gateId: 'gate_1',
      startTime: '2026-08-01T10:00:00.000Z',
    };
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      async (key: string) => {
        if (key.includes('TOMBSTONE')) {
          return JSON.stringify({
            shiftLogId: 'shift_1',
            reason: 'ended',
            at: '2026-08-01T12:00:00.000Z',
          });
        }
        return JSON.stringify(session);
      }
    );

    await expect(loadShiftSession()).resolves.toBeNull();
  });

  it('discards a session when guardId does not match the current user', async () => {
    const session: ShiftSession = {
      shiftLogId: 'shift_1',
      gateId: 'gate_1',
      startTime: '2026-08-01T10:00:00.000Z',
      guardId: 'guard_a',
    };
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      async (key: string) => {
        if (key.includes('TOMBSTONE')) return null;
        return JSON.stringify(session);
      }
    );

    await expect(loadShiftSessionForUser('guard_b')).resolves.toBeNull();
    await expect(loadShiftSessionForUser('guard_a')).resolves.toEqual(session);
  });

  it('discards legacy sessions without guardId when a guard is signed in', async () => {
    const session: ShiftSession = {
      shiftLogId: 'shift_1',
      gateId: 'gate_1',
      startTime: '2026-08-01T10:00:00.000Z',
    };
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      async (key: string) => {
        if (key.includes('TOMBSTONE')) return null;
        return JSON.stringify(session);
      }
    );

    await expect(loadShiftSessionForUser('guard_a')).resolves.toBeNull();
  });
});
