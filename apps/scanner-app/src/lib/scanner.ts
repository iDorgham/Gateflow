import * as Haptics from 'expo-haptics';
import * as Device from 'expo-device';
import { getValidAccessToken } from './auth-client';
import { scanQueue } from './offline-queue';
import type { QRPayload } from '@gate-access/types';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export interface LocationContext {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export interface ScanResult {
  status: 'accepted' | 'rejected';
  reason?: string;
  message?: string;
  scanId?: string;
  /** true when the result is locally optimistic (network unavailable or no auth) */
  offline: boolean;
  /** true when the visitor is on the ESCORT watchlist — access is granted but escort is required */
  escortRequired?: boolean;
}

/**
 * Validate a locally-verified QR code against the server.
 *
 * Precondition: the QR string has already passed verifyScanQR() locally.
 * Falls back to optimistic local acceptance + offline queue ONLY for true
 * network/server failures (5xx, connection refused).
 *
 * 4xx responses are treated as server rejections (invalid QR, wrong org, etc.)
 * and surfaced as rejected results — they are NOT queued offline.
 *
 * @param gateId Optional gate ID from the gate selector; used in scanContext
 *               and as the queue gateId for offline syncing.
 * @param shiftLogId Optional active ShiftLog id for accountable scan linkage.
 */
export async function validateOnServer(
  qrPayload: string,
  localPayload: QRPayload,
  location?: LocationContext,
  gateId?: string,
  shiftLogId?: string
): Promise<ScanResult> {
  const token = await getValidAccessToken();

  if (!token) {
    await enqueueOfflineScan(qrPayload, localPayload, gateId, shiftLogId);
    await haptic(Haptics.NotificationFeedbackType.Warning);
    return {
      status: 'accepted',
      message: 'Not signed in — result queued for sync',
      offline: true,
    };
  }

  const deviceId = buildDeviceId();

  try {
    const response = await fetch(`${API_BASE_URL}/qrcodes/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        qrPayload,
        scanContext: {
          deviceId,
          ...(location
            ? {
                location,
                latitude: location.latitude,
                longitude: location.longitude,
              }
            : {}),
          ...(gateId ? { gateId } : {}),
          ...(shiftLogId ? { shiftLogId } : {}),
        },
      }),
    });

    if (!response.ok) {
      // 5xx → true server error; queue for later retry
      if (response.status >= 500) {
        await enqueueOfflineScan(qrPayload, localPayload, gateId, shiftLogId);
        await haptic(Haptics.NotificationFeedbackType.Warning);
        return {
          status: 'accepted',
          message: `Server error (${response.status}) — queued for sync`,
          offline: true,
        };
      }

      // 4xx → server explicitly rejected this QR (wrong org, expired, not found, etc.)
      // Do NOT queue offline; surface the rejection to the operator.
      let body: { reason?: string; message?: string } = {};
      try {
        body = await response.json();
      } catch {
        // response body may be empty
      }
      await haptic(Haptics.NotificationFeedbackType.Error);
      return {
        status: 'rejected',
        reason: body.reason,
        message: body.message ?? serverReasonMessage(body.reason ?? ''),
        offline: false,
      };
    }

    const body = await response.json();

    if (body.status === 'accepted') {
      const escortRequired = body.escortRequired === true;
      if (escortRequired) {
        await haptic(Haptics.NotificationFeedbackType.Warning);
      } else {
        await haptic(Haptics.NotificationFeedbackType.Success);
      }
      return {
        status: 'accepted',
        scanId: body.scanId as string | undefined,
        message: escortRequired
          ? 'Access granted — escort required'
          : (body.message as string | undefined),
        offline: false,
        escortRequired,
      };
    }

    await haptic(Haptics.NotificationFeedbackType.Error);
    return {
      status: 'rejected',
      reason: body.reason as string | undefined,
      message:
        (body.message as string | undefined) ??
        serverReasonMessage(body.reason as string),
      offline: false,
    };
  } catch {
    // Network-level failure (no connection, DNS failure, timeout)
    await enqueueOfflineScan(qrPayload, localPayload, gateId, shiftLogId);
    await haptic(Haptics.NotificationFeedbackType.Warning);
    return {
      status: 'accepted',
      message: 'No network — queued for sync',
      offline: true,
    };
  }
}

import { maintenanceQueue } from './maintenance-queue';

/**
 * Report a hardware or facility issue discovered at a gate.
 *
 * @param gateId The gate where the issue occurred (required)
 * @param scanLogId Optional scan log associated with the discovery (for evidence)
 */
export async function createMaintenanceRequest(params: {
  title: string;
  description?: string;
  category: 'HARDWARE' | 'FACILITY' | 'OTHER';
  gateId: string;
  scanLogId?: string;
}): Promise<{ success: boolean; message?: string; offline?: boolean }> {
  const token = await getValidAccessToken();
  if (!token) {
    // If not signed in, we can't really queue it with the correct org context
    // unless we use the last known orgId. For now, require auth.
    return { success: false, message: 'Not signed in' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/maintenance/work-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: params.title,
        description: params.description,
        category: params.category,
        gateId: params.gateId,
        scanLogId: params.scanLogId,
        priority: 'MEDIUM', // Default priority for field reports
        source: 'SCANNER_APP',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
      };
    }

    // 5xx or network error → fallback to offline queue
    if (response.status >= 500) {
      throw new Error('Server error');
    }

    const data = await response.json();
    return {
      success: false,
      message: data.message ?? `Error ${response.status}`,
    };
  } catch (err) {
    // Queue offline
    try {
      await maintenanceQueue.addReport({
        title: params.title,
        description: params.description,
        category: params.category,
        gateId: params.gateId,
        scanLogId: params.scanLogId,
      });
      return {
        success: true,
        offline: true,
        message: 'No connection — report queued for sync',
      };
    } catch (queueErr) {
      return {
        success: false,
        message: (err as Error).message ?? 'Network failure',
      };
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function enqueueOfflineScan(
  qrPayload: string,
  localPayload: QRPayload,
  gateId?: string,
  shiftLogId?: string
): Promise<void> {
  try {
    // Use the selected gateId when available; fall back to organizationId
    const resolvedGateId = gateId ?? localPayload.organizationId;
    if (shiftLogId) {
      await scanQueue.addScan(qrPayload, resolvedGateId, shiftLogId);
    } else {
      await scanQueue.addScan(qrPayload, resolvedGateId);
    }
  } catch {
    // Queue throws if the user is not authenticated — silently ignore.
  }
}

function buildDeviceId(): string {
  const os = Device.osName ?? 'unknown';
  const model = Device.modelName ?? 'device';
  return `${os}-${model}`.replace(/\s+/g, '-');
}

async function haptic(type: Haptics.NotificationFeedbackType): Promise<void> {
  try {
    await Haptics.notificationAsync(type);
  } catch {
    // Unavailable in simulators — ignore.
  }
}

function serverReasonMessage(reason: string): string {
  const map: Record<string, string> = {
    expired: 'QR code has expired',
    max_uses_reached: 'QR code has reached its scan limit',
    revoked: 'QR code has been revoked',
    inactive: 'QR code is not active',
    invalid_signature: 'Invalid QR code',
    malformed_payload: 'Corrupted QR payload',
    not_found: 'QR code not found in system',
    wrong_org: 'QR code belongs to a different organization',
    rate_limited: 'Too many scans — try again later',
    unauthorized: 'Authentication required',
    internal_error: 'Server error — please retry',
    invalid_format: 'No gate assigned for this QR code',
    denied: 'You are not allowed to scan at this gate',
    not_on_location:
      'Scanning is only allowed at the gate location. Enable device location or move closer to the gate.',
    blocked_watchlist: 'Blocked person on security list.',
    no_active_shift: 'Start a shift before scanning',
  };
  return map[reason] ?? 'Access denied';
}
