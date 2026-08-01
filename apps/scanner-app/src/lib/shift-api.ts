import { getValidAccessToken } from './auth-client';
import type { ShiftSession } from './shift-session';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

/** Bounded wait so shift start/end cannot leave UI `busy` stuck forever. */
const SHIFT_FETCH_TIMEOUT_MS = 15_000;

type ShiftApiData = {
  id: string;
  gateId: string;
  organizationId: string;
  startTime: string;
  endTime: string | null;
  gateName?: string;
};

export type EndShiftResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      /** HTTP status when a response was received */
      status?: number;
      /** True for network/5xx/timeout — local clear should leave a pending-end tombstone */
      retryable: boolean;
    };

async function fetchJsonWithTimeout<T>(
  url: string,
  init: RequestInit
): Promise<{ response: Response; body: T }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SHIFT_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const body = (await response.json().catch(() => ({}))) as T;
    return { response, body };
  } finally {
    clearTimeout(timer);
  }
}

export async function startShiftOnServer(params: {
  gateId: string;
  gateName?: string;
}): Promise<
  { ok: true; session: ShiftSession } | { ok: false; message: string }
> {
  const token = await getValidAccessToken();
  if (!token) {
    return { ok: false, message: 'Not signed in' };
  }

  try {
    const { response, body } = await fetchJsonWithTimeout<{
      success?: boolean;
      message?: string;
      data?: ShiftApiData;
    }>(`${API_BASE_URL}/scanner/shift/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gateId: params.gateId }),
    });

    if (!response.ok || !body.success || !body.data) {
      return {
        ok: false,
        message: body.message ?? `Could not start shift (${response.status})`,
      };
    }

    return {
      ok: true,
      session: {
        shiftLogId: body.data.id,
        gateId: body.data.gateId,
        gateName: body.data.gateName ?? params.gateName,
        startTime: body.data.startTime,
        organizationId: body.data.organizationId,
      },
    };
  } catch (error) {
    const aborted =
      error instanceof Error &&
      (error.name === 'AbortError' || /aborted/i.test(error.message));
    return {
      ok: false,
      message: aborted
        ? 'Start shift timed out — check connection and retry'
        : 'Network error — could not start shift',
    };
  }
}

export async function endShiftOnServer(
  shiftLogId?: string
): Promise<EndShiftResult> {
  const token = await getValidAccessToken();
  if (!token) {
    return { ok: false, message: 'Not signed in', retryable: true };
  }

  try {
    const { response, body } = await fetchJsonWithTimeout<{
      success?: boolean;
      message?: string;
    }>(`${API_BASE_URL}/scanner/shift/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shiftLogId ? { shiftLogId } : {}),
    });

    if (!response.ok || !body.success) {
      // 404 = already ended / not found — safe to clear local session.
      const alreadyEnded = response.status === 404;
      return {
        ok: false,
        message: body.message ?? `Could not end shift (${response.status})`,
        status: response.status,
        retryable: !alreadyEnded,
      };
    }

    return { ok: true };
  } catch (error) {
    const aborted =
      error instanceof Error &&
      (error.name === 'AbortError' || /aborted/i.test(error.message));
    return {
      ok: false,
      message: aborted
        ? 'End shift timed out — will retry when online'
        : 'Network error — could not end shift',
      retryable: true,
    };
  }
}

/**
 * Re-validate a persisted shift against the server.
 * 404 → not active; 200 + matching id → active; other → unknown (keep local).
 */
export async function fetchActiveShiftOnServer(
  gateId: string
): Promise<
  | { ok: true; active: true; session: ShiftSession }
  | { ok: true; active: false }
  | { ok: false; message: string }
> {
  const token = await getValidAccessToken();
  if (!token) {
    return { ok: false, message: 'Not signed in' };
  }

  try {
    const url = `${API_BASE_URL}/scanner/shift/active?gateId=${encodeURIComponent(gateId)}`;
    const { response, body } = await fetchJsonWithTimeout<{
      success?: boolean;
      message?: string;
      data?: ShiftApiData;
    }>(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 404) {
      return { ok: true, active: false };
    }

    if (!response.ok || !body.success || !body.data) {
      return {
        ok: false,
        message: body.message ?? `Could not verify shift (${response.status})`,
      };
    }

    return {
      ok: true,
      active: true,
      session: {
        shiftLogId: body.data.id,
        gateId: body.data.gateId,
        gateName: body.data.gateName,
        startTime: body.data.startTime,
        organizationId: body.data.organizationId,
      },
    };
  } catch {
    return { ok: false, message: 'Network error — could not verify shift' };
  }
}
