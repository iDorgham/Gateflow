import * as SecureStore from 'expo-secure-store';

/** Persisted active shift for the scanner duty session. */
export const SHIFT_SESSION_KEY = 'GATEFLOW_SCANNER_ACTIVE_SHIFT';

export interface ShiftSession {
  shiftLogId: string;
  gateId: string;
  gateName?: string;
  startTime: string;
  organizationId?: string;
}

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
    };
  } catch {
    return null;
  }
}

export async function loadShiftSession(): Promise<ShiftSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(SHIFT_SESSION_KEY);
    return parseShiftSession(raw);
  } catch (error) {
    console.error('[ShiftSession] Error reading session:', error);
    return null;
  }
}

export async function saveShiftSession(
  session: ShiftSession
): Promise<boolean> {
  try {
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
