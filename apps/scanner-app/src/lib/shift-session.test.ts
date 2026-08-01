jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import * as SecureStore from 'expo-secure-store';
import {
  canScanWithShift,
  finalizeLocalShiftEnd,
  loadShiftSession,
  loadShiftSessionForUser,
  markPendingShiftEnd,
  parseShiftSession,
  parseShiftTombstone,
  saveShiftSession,
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
    expect(
      parseShiftTombstone(
        JSON.stringify({
          shiftLogId: '   ',
          reason: 'pending_end',
          at: '2026-08-01T12:00:00.000Z',
        })
      )
    ).toBeNull();
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

  it('fails closed when the tombstone cannot be read', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      async (key: string) => {
        if (key.includes('TOMBSTONE')) throw new Error('keychain unavailable');
        return JSON.stringify({
          shiftLogId: 'shift_1',
          gateId: 'gate_1',
          startTime: '2026-08-01T10:00:00.000Z',
          guardId: 'guard_a',
        });
      }
    );

    await expect(loadShiftSession()).resolves.toBeNull();
    await expect(loadShiftSessionForUser('guard_a')).resolves.toBeNull();
  });

  it("does not apply another guard's tombstone to the current guard", async () => {
    const session: ShiftSession = {
      shiftLogId: 'shift_1',
      gateId: 'gate_1',
      startTime: '2026-08-01T10:00:00.000Z',
      guardId: 'guard_b',
    };
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      async (key: string) =>
        key.includes('TOMBSTONE')
          ? JSON.stringify({
              shiftLogId: 'shift_1',
              guardId: 'guard_a',
              reason: 'pending_end',
              at: '2026-08-01T12:00:00.000Z',
            })
          : JSON.stringify(session)
    );

    await expect(loadShiftSessionForUser('guard_b')).resolves.toEqual(session);
  });

  it('preserves the session when pending-end marker persistence fails', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      JSON.stringify({
        shiftLogId: 'shift_1',
        gateId: 'gate_1',
        startTime: '2026-08-01T10:00:00.000Z',
        guardId: 'guard_a',
      })
    );
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(
      new Error('keychain full')
    );

    await expect(markPendingShiftEnd('shift_1')).resolves.toBe(false);
    expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it('does not clear a tombstone before the replacement session is durable', async () => {
    const session: ShiftSession = {
      shiftLogId: 'shift_new',
      gateId: 'gate_1',
      startTime: '2026-08-01T13:00:00.000Z',
      guardId: 'guard_a',
    };
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(
      new Error('keychain full')
    );

    await expect(saveShiftSession(session)).resolves.toBe(false);
    expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
  });

  it('does not report a saved session while its tombstone cannot be cleared', async () => {
    const calls: string[] = [];
    (SecureStore.setItemAsync as jest.Mock).mockImplementation(async () => {
      calls.push('session-written');
    });
    (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(async () => {
      calls.push('tombstone-clear-attempted');
      throw new Error('keychain busy');
    });

    await expect(
      saveShiftSession({
        shiftLogId: 'shift_new',
        gateId: 'gate_1',
        startTime: '2026-08-01T13:00:00.000Z',
        guardId: 'guard_a',
      })
    ).resolves.toBe(false);
    expect(calls).toEqual(['session-written', 'tombstone-clear-attempted']);
  });

  it('reports pending-end state as safe when session deletion fails', async () => {
    const session: ShiftSession = {
      shiftLogId: 'shift_1',
      gateId: 'gate_1',
      startTime: '2026-08-01T10:00:00.000Z',
      guardId: 'guard_a',
    };
    let tombstoneRaw: string | null = null;
    (SecureStore.getItemAsync as jest.Mock).mockImplementation(
      async (key: string) =>
        key.includes('TOMBSTONE') ? tombstoneRaw : JSON.stringify(session)
    );
    (SecureStore.setItemAsync as jest.Mock).mockImplementation(
      async (_key: string, value: string) => {
        tombstoneRaw = value;
      }
    );
    (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(
      new Error('keychain busy')
    );

    await expect(markPendingShiftEnd('shift_1')).resolves.toBe(true);
    await expect(loadShiftSessionForUser('guard_a')).resolves.toBeNull();
  });

  it('does not delete a newer session when an older shift finalizes late', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      JSON.stringify({
        shiftLogId: 'shift_new',
        gateId: 'gate_1',
        startTime: '2026-08-01T13:00:00.000Z',
        guardId: 'guard_a',
      })
    );
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

    await expect(
      finalizeLocalShiftEnd('shift_old', 'guard_a')
    ).resolves.toEqual({ cleared: true });
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(1);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(
      expect.stringContaining('TOMBSTONE')
    );
  });

  it('deletes the stored session when the finalized shift matches', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(
      JSON.stringify({
        shiftLogId: 'shift_1',
        gateId: 'gate_1',
        startTime: '2026-08-01T10:00:00.000Z',
        guardId: 'guard_a',
      })
    );
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

    await expect(finalizeLocalShiftEnd('shift_1', 'guard_a')).resolves.toEqual({
      cleared: true,
    });
    expect(SecureStore.deleteItemAsync).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('ACTIVE_SHIFT')
    );
  });

  it('serializes a newer save after an older finalizer delete', async () => {
    const oldSession: ShiftSession = {
      shiftLogId: 'shift_old',
      gateId: 'gate_1',
      startTime: '2026-08-01T10:00:00.000Z',
      guardId: 'guard_a',
    };
    let storedRaw: string | null = JSON.stringify(oldSession);
    let releaseDelete: (() => void) | undefined;
    const deleteStarted = new Promise<void>((resolve) => {
      (SecureStore.getItemAsync as jest.Mock).mockImplementation(
        async (key: string) => (key.includes('TOMBSTONE') ? null : storedRaw)
      );
      (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
        async (key: string) => {
          if (key.includes('ACTIVE_SHIFT')) {
            resolve();
            await new Promise<void>((release) => {
              releaseDelete = release;
            });
            storedRaw = null;
          }
        }
      );
      (SecureStore.setItemAsync as jest.Mock).mockImplementation(
        async (key: string, value: string) => {
          if (key.includes('ACTIVE_SHIFT')) storedRaw = value;
        }
      );
    });

    const finalize = finalizeLocalShiftEnd('shift_old', 'guard_a');
    await deleteStarted;
    const save = saveShiftSession({
      ...oldSession,
      shiftLogId: 'shift_new',
      startTime: '2026-08-01T13:00:00.000Z',
    });
    releaseDelete?.();

    await expect(finalize).resolves.toEqual({ cleared: true });
    await expect(save).resolves.toBe(true);
    expect(parseShiftSession(storedRaw)?.shiftLogId).toBe('shift_new');
  });
});
