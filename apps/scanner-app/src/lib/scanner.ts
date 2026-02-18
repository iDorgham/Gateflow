import * as Haptics from 'expo-haptics';
import * as Device from 'expo-device';
import { getValidAccessToken } from './auth-client';
import { scanQueue } from './offline-queue';
import type { QRPayload } from '@gate-access/types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

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
}

/**
 * Validate a locally-verified QR code against the server.
 *
 * Precondition: the QR string has already passed verifyScanQR() locally.
 * Falls back to optimistic local acceptance + offline queue when network is
 * unavailable or the access token cannot be refreshed.
 */
export async function validateOnServer(
  qrPayload: string,
  localPayload: QRPayload,
  location?: LocationContext,
): Promise<ScanResult> {
  const token = await getValidAccessToken();

  if (!token) {
    await enqueueOfflineScan(qrPayload, localPayload);
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
          ...(location ? { location } : {}),
        },
      }),
    });

    if (!response.ok) {
      await enqueueOfflineScan(qrPayload, localPayload);
      await haptic(Haptics.NotificationFeedbackType.Warning);
      return {
        status: 'accepted',
        message: `Server unavailable (${response.status}) — queued for sync`,
        offline: true,
      };
    }

    const body = await response.json();

    if (body.status === 'accepted') {
      await haptic(Haptics.NotificationFeedbackType.Success);
      return {
        status: 'accepted',
        scanId: body.scanId as string | undefined,
        message: body.message as string | undefined,
        offline: false,
      };
    }

    await haptic(Haptics.NotificationFeedbackType.Error);
    return {
      status: 'rejected',
      reason: body.reason as string | undefined,
      message: (body.message as string | undefined) ?? serverReasonMessage(body.reason as string),
      offline: false,
    };
  } catch {
    await enqueueOfflineScan(qrPayload, localPayload);
    await haptic(Haptics.NotificationFeedbackType.Warning);
    return {
      status: 'accepted',
      message: 'No network — queued for sync',
      offline: true,
    };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function enqueueOfflineScan(
  qrPayload: string,
  localPayload: QRPayload,
): Promise<void> {
  try {
    await scanQueue.addScan(qrPayload, localPayload.organizationId);
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
    not_found: 'QR code not found',
    wrong_org: 'QR code belongs to a different organization',
    rate_limited: 'Too many scans — try again later',
    unauthorized: 'Authentication required',
    internal_error: 'Server error — please retry',
  };
  return map[reason] ?? 'Access denied';
}
