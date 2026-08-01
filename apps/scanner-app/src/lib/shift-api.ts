import { getValidAccessToken } from './auth-client';
import type { ShiftSession } from './shift-session';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

/** Bounded wait so shift start/end cannot leave UI `busy` stuck forever. */
const SHIFT_FETCH_TIMEOUT_MS = 15_000;

type TokenResult =
  | { ok: true; token: string }
  | {
      ok: false;
      message: string;
      status?: number;
      retryable: boolean;
      authFailure: boolean;
    };

async function getTokenWithTimeout(): Promise<TokenResult> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const token = await Promise.race([
      getValidAccessToken(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('Token acquisition timed out')),
          SHIFT_FETCH_TIMEOUT_MS
        );
      }),
    ]);
    if (!token) {
      return {
        ok: false,
        message: 'Not signed in',
        status: 401,
        retryable: false,
        authFailure: true,
      };
    }
    return { ok: true, token };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error && /timed out/i.test(error.message)
          ? 'Authentication timed out — check connection and retry'
          : 'Could not access authentication credentials',
      retryable: true,
      authFailure: false,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

type ShiftApiData = {
  id: string;
  gateId: string;
  organizationId: string;
  startTime: string;
  endTime: string | null;
  gateName?: string;
};

type ShiftApiFailure = {
  ok: false;
  message: string;
  status?: number;
  retryable: boolean;
  authFailure: boolean;
};

export type EndShiftResult =
  | { ok: true }
  | (ShiftApiFailure & {
      /** HTTP status when a response was received */
      status?: number;
      /** True for network/408/429/5xx/timeout — leave a pending-end tombstone */
      retryable: boolean;
      /** Credentials are absent or the server rejected them. */
      authFailure: boolean;
    });

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
}): Promise<{ ok: true; session: ShiftSession } | ShiftApiFailure> {
  const tokenResult = await getTokenWithTimeout();
  if (!tokenResult.ok) {
    return tokenResult;
  }
  const token = tokenResult.token;

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
        status: response.status,
        retryable:
          response.status === 408 ||
          response.status === 429 ||
          response.status >= 500,
        authFailure: response.status === 401 || response.status === 403,
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
      retryable: true,
      authFailure: false,
    };
  }
}

export async function endShiftOnServer(
  shiftLogId?: string
): Promise<EndShiftResult> {
  const tokenResult = await getTokenWithTimeout();
  if (!tokenResult.ok) {
    return tokenResult;
  }
  const token = tokenResult.token;

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
      // Retry only failures that can reasonably recover without changing the request.
      // Other 4xx responses (including revoked permission and validation failures)
      // are permanent and must not be replayed on every hydration.
      const retryable =
        response.status === 408 ||
        response.status === 429 ||
        response.status >= 500;
      return {
        ok: false,
        message: body.message ?? `Could not end shift (${response.status})`,
        status: response.status,
        retryable,
        authFailure: response.status === 401 || response.status === 403,
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
      authFailure: false,
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
  | ShiftApiFailure
> {
  const tokenResult = await getTokenWithTimeout();
  if (!tokenResult.ok) {
    return tokenResult;
  }
  const token = tokenResult.token;

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
        status: response.status,
        retryable:
          response.status === 408 ||
          response.status === 429 ||
          response.status >= 500,
        authFailure: response.status === 401 || response.status === 403,
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
    return {
      ok: false,
      message: 'Network error — could not verify shift',
      retryable: true,
      authFailure: false,
    };
  }
}
