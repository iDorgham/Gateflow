import * as SecureStore from 'expo-secure-store';

/** Persisted active shift for the scanner duty session. */
export const SHIFT_SESSION_KEY = 'GATEFLOW_SCANNER_ACTIVE_SHIFT';

/**
 * Durable marker so a cleared in-memory session cannot be revived from SecureStore
 * after a successful clock-out whose delete failed, or while an end is pending retry.
 */
export const SHIFT_TOMBSTONE_KEY = 'GATEFLOW_SCANNER_SHIFT_TOMBSTONE';

export interface ShiftSession {
  shiftLogId: string;
  gateId: string;
  gateName?: string;
  startTime: string;
  organizationId?: string;
  /** Auth JWT `sub` — binds persisted session to the signed-in guard. */
  guardId?: string;
}

export type ShiftTombstone = {
  shiftLogId: string;
  reason: 'ended' | 'pending_end';
  at: string;
};

export function canScanWithShift(
  session: ShiftSession | null,
  gateId: string | null | undefined
): boolean {
  if (!session?.shiftLogId || !gateId) return false;
  return session.gateId === gateId;
}

export function parseShiftSession(raw: string | null): ShiftSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ShiftSession>;
    if (
      typeof parsed.shiftLogId !== 'string' ||
      typeof parsed.gateId !== 'string' ||
      typeof parsed.startTime !== 'string'
    ) {
      return null;
    }
    return {
      shiftLogId: parsed.shiftLogId,
      gateId: parsed.gateId,
      startTime: parsed.startTime,
      ...(typeof parsed.gateName === 'string'
        ? { gateName: parsed.gateName }
        : {}),
      ...(typeof parsed.organizationId === 'string'
        ? { organizationId: parsed.organizationId }
        : {}),
      ...(typeof parsed.guardId === 'string'
        ? { guardId: parsed.guardId }
        : {}),
    };
  } catch {
    return null;
  }
}

export function parseShiftTombstone(raw: string | null): ShiftTombstone | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ShiftTombstone>;
    if (
      typeof parsed.shiftLogId !== 'string' ||
      (parsed.reason !== 'ended' && parsed.reason !== 'pending_end') ||
      typeof parsed.at !== 'string'
    ) {
      return null;
    }
    return {
      shiftLogId: parsed.shiftLogId,
      reason: parsed.reason,
      at: parsed.at,
    };
  } catch {
    return null;
  }
}

export async function loadShiftTombstone(): Promise<ShiftTombstone | null> {
  try {
    const raw = await SecureStore.getItemAsync(SHIFT_TOMBSTONE_KEY);
    return parseShiftTombstone(raw);
  } catch (error) {
    console.error('[ShiftSession] Error reading tombstone:', error);
    return null;
  }
}

export async function saveShiftTombstone(
  tombstone: ShiftTombstone
): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(
      SHIFT_TOMBSTONE_KEY,
      JSON.stringify(tombstone)
    );
    return true;
  } catch (error) {
    console.error('[ShiftSession] Error saving tombstone:', error);
    return false;
  }
}

export async function clearShiftTombstone(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(SHIFT_TOMBSTONE_KEY);
    return true;
  } catch (error) {
    console.error('[ShiftSession] Error clearing tombstone:', error);
    return false;
  }
}

export async function loadShiftSession(): Promise<ShiftSession | null> {
  try {
    const [raw, tombstone] = await Promise.all([
      SecureStore.getItemAsync(SHIFT_SESSION_KEY),
      loadShiftTombstone(),
    ]);
    const session = parseShiftSession(raw);
    if (
      session &&
      tombstone &&
      tombstone.shiftLogId === session.shiftLogId &&
      (tombstone.reason === 'ended' || tombstone.reason === 'pending_end')
    ) {
      // Stale store after clear failure / pending end — do not re-enable scanning.
      return null;
    }
    return session;
  } catch (error) {
    console.error('[ShiftSession] Error reading session:', error);
    return null;
  }
}

/**
 * Load persisted shift only when it belongs to the current authenticated guard.
 * Legacy sessions without guardId are discarded when guardId is known.
 */
export async function loadShiftSessionForUser(
  guardId: string | null | undefined
): Promise<ShiftSession | null> {
  if (!guardId) return null;
  const session = await loadShiftSession();
  if (!session) return null;
  if (!session.guardId || session.guardId !== guardId) return null;
  return session;
}

export async function saveShiftSession(
  session: ShiftSession
): Promise<boolean> {
  try {
    await clearShiftTombstone();
    await SecureStore.setItemAsync(SHIFT_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch (error) {
    console.error('[ShiftSession] Error saving session:', error);
    return false;
  }
}

export async function clearShiftSession(): Promise<boolean> {
  try {
    await SecureStore.deleteItemAsync(SHIFT_SESSION_KEY);
    return true;
  } catch (error) {
    console.error('[ShiftSession] Error clearing session:', error);
    return false;
  }
}

/**
 * After a confirmed server clock-out: clear session; if delete fails, write
 * an `ended` tombstone so reload cannot revive the duty session.
 */
export async function finalizeLocalShiftEnd(
  shiftLogId: string
): Promise<{ cleared: boolean }> {
  const cleared = await clearShiftSession();
  if (!cleared) {
    await saveShiftTombstone({
      shiftLogId,
      reason: 'ended',
      at: new Date().toISOString(),
    });
  } else {
    await clearShiftTombstone();
  }
  return { cleared };
}

/**
 * After a retryable clock-out failure: stop scanning locally and persist
 * pending_end so we can retry without re-enabling the camera from SecureStore.
 */
export async function markPendingShiftEnd(shiftLogId: string): Promise<void> {
  await saveShiftTombstone({
    shiftLogId,
    reason: 'pending_end',
    at: new Date().toISOString(),
  });
  await clearShiftSession();
}
