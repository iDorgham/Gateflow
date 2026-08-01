import * as SecureStore from 'expo-secure-store';

/** Persisted active shift for the scanner duty session. */
export const SHIFT_SESSION_KEY = 'GATEFLOW_SCANNER_ACTIVE_SHIFT';

/**
 * Durable marker so a cleared in-memory session cannot be revived from SecureStore
 * after a successful clock-out whose delete failed, or while an end is pending retry.
 */
export const SHIFT_TOMBSTONE_KEY = 'GATEFLOW_SCANNER_SHIFT_TOMBSTONE';

// SecureStore has no compare-and-delete primitive. Serialize local mutations so
// a late finalizer cannot read an old session and then delete a concurrently saved
// replacement between that read and delete.
let mutationQueue: Promise<void> = Promise.resolve();

function withMutationLock<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

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
  /** Auth JWT `sub` — prevents another guard from consuming this marker. */
  guardId?: string;
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
      parsed.shiftLogId.trim().length === 0 ||
      (parsed.reason !== 'ended' && parsed.reason !== 'pending_end') ||
      typeof parsed.at !== 'string'
    ) {
      return null;
    }
    return {
      shiftLogId: parsed.shiftLogId,
      ...(typeof parsed.guardId === 'string'
        ? { guardId: parsed.guardId }
        : {}),
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

async function loadShiftTombstoneStrict(): Promise<ShiftTombstone | null> {
  const raw = await SecureStore.getItemAsync(SHIFT_TOMBSTONE_KEY);
  return parseShiftTombstone(raw);
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
      loadShiftTombstoneStrict(),
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
  let raw: string | null;
  let tombstone: ShiftTombstone | null;
  try {
    [raw, tombstone] = await Promise.all([
      SecureStore.getItemAsync(SHIFT_SESSION_KEY),
      loadShiftTombstoneStrict(),
    ]);
  } catch (error) {
    console.error('[ShiftSession] Error reading guarded session:', error);
    return null;
  }
  const session = parseShiftSession(raw);
  if (!session) return null;
  if (!session.guardId || session.guardId !== guardId) return null;
  if (
    tombstone?.guardId === guardId &&
    tombstone.shiftLogId === session.shiftLogId
  ) {
    return null;
  }
  return session;
}

export async function saveShiftSession(
  session: ShiftSession
): Promise<boolean> {
  return withMutationLock(async () => {
    try {
      await SecureStore.setItemAsync(
        SHIFT_SESSION_KEY,
        JSON.stringify(session)
      );
      // Never remove the fail-closed marker until the replacement session is durable.
      // A failed marker clear is also a failed save contract: callers must not enable
      // scanning while persisted state remains ambiguous.
      return clearShiftTombstone();
    } catch (error) {
      console.error('[ShiftSession] Error saving session:', error);
      return false;
    }
  });
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
  shiftLogId: string,
  guardId?: string
): Promise<{ cleared: boolean }> {
  return withMutationLock(() =>
    finalizeLocalShiftEndLocked(shiftLogId, guardId)
  );
}

async function finalizeLocalShiftEndLocked(
  shiftLogId: string,
  guardId?: string
): Promise<{ cleared: boolean }> {
  let stored: ShiftSession | null;
  let tombstone: ShiftTombstone | null;
  try {
    const [rawSession, rawTombstone] = await Promise.all([
      SecureStore.getItemAsync(SHIFT_SESSION_KEY),
      SecureStore.getItemAsync(SHIFT_TOMBSTONE_KEY),
    ]);
    stored = parseShiftSession(rawSession);
    tombstone = parseShiftTombstone(rawTombstone);
  } catch (error) {
    console.error('[ShiftSession] Error checking session before clear:', error);
    return { cleared: false };
  }

  // A late finalizer for an older request must never erase a newer shift.
  const cleared =
    stored == null ||
    stored.shiftLogId !== shiftLogId ||
    (await clearShiftSession());
  if (!cleared) {
    await saveShiftTombstone({
      shiftLogId,
      ...(guardId ? { guardId } : {}),
      reason: 'ended',
      at: new Date().toISOString(),
    });
  } else {
    // Do not let a late finalizer erase a marker belonging to a newer shift.
    if (!tombstone || tombstone.shiftLogId === shiftLogId) {
      await clearShiftTombstone();
    }
  }
  return { cleared };
}

/**
 * After a retryable clock-out failure: stop scanning locally and persist
 * pending_end so we can retry without re-enabling the camera from SecureStore.
 */
export async function markPendingShiftEnd(
  shiftLogId: string,
  guardId?: string
): Promise<boolean> {
  return withMutationLock(() => markPendingShiftEndLocked(shiftLogId, guardId));
}

async function markPendingShiftEndLocked(
  shiftLogId: string,
  guardId?: string
): Promise<boolean> {
  let ownerGuardId = guardId;
  if (!ownerGuardId) {
    try {
      const stored = parseShiftSession(
        await SecureStore.getItemAsync(SHIFT_SESSION_KEY)
      );
      if (stored?.shiftLogId === shiftLogId) ownerGuardId = stored.guardId;
    } catch (error) {
      console.error('[ShiftSession] Error reading session owner:', error);
      return false;
    }
  }

  const marked = await saveShiftTombstone({
    shiftLogId,
    ...(ownerGuardId ? { guardId: ownerGuardId } : {}),
    reason: 'pending_end',
    at: new Date().toISOString(),
  });
  if (!marked) return false;
  // Once the marker is durable, failure to delete the stale session is recoverable:
  // hydration will see the marker and fail closed, and a later retry can clean up.
  await clearShiftSession();
  return true;
}
