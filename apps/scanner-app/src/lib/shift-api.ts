import { getValidAccessToken } from './auth-client';
import type { ShiftSession } from './shift-session';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type ShiftApiData = {
  id: string;
  gateId: string;
  organizationId: string;
  startTime: string;
  endTime: string | null;
  gateName?: string;
};

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
    const response = await fetch(`${API_BASE_URL}/scanner/shift/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ gateId: params.gateId }),
    });

    const body = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      data?: ShiftApiData;
    };

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
  } catch {
    return { ok: false, message: 'Network error — could not start shift' };
  }
}

export async function endShiftOnServer(
  shiftLogId?: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const token = await getValidAccessToken();
  if (!token) {
    return { ok: false, message: 'Not signed in' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/scanner/shift/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(shiftLogId ? { shiftLogId } : {}),
    });

    const body = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    if (!response.ok || !body.success) {
      return {
        ok: false,
        message: body.message ?? `Could not end shift (${response.status})`,
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: 'Network error — could not end shift' };
  }
}
