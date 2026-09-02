import { useCallback, useRef, useState } from 'react';
import type { BarcodeScanningResult } from 'expo-camera';
import { useForegroundPermissions, getLastKnownPositionAsync } from 'expo-location';
import * as Haptics from 'expo-haptics';
import { verifyScanQR } from '../lib/qr-verify';
import {
  validateOnServer,
  type ScanResult,
  type LocationContext,
} from '../lib/scanner';
import { getValidAccessToken } from '../lib/auth-client';
import { resolveRuntimeQrSecret } from '../lib/security/qr-secret';
import { addHistoryEntry } from '../lib/scan-history';
import { getPreferences } from '../lib/preferences';
import { haptic } from '../lib/haptics';
import type { SelectedGate } from '../components/GateSelector';
import type { ScannerPhase } from '../components/views/camera-scanner-view';

const SCAN_COOLDOWN_MS = 2_500;
const RESULT_DISPLAY_MS = 3_000;
const SHORT_URL_RESOLVE_TIMEOUT_MS = 5_000;

function localRejectMessage(reason: string): string {
  const map: Record<string, string> = {
    EXPIRED: 'QR code has expired',
    INVALID_SIGNATURE: 'Invalid QR code — tampered or unknown',
    NONCE_REUSED: 'QR code already used at this gate',
    INVALID_FORMAT: 'Not a GateFlow QR code',
    UNKNOWN_VERSION: 'Unsupported QR version',
    MALFORMED_PAYLOAD: 'Corrupted QR payload',
  };
  return map[reason] ?? 'Scan rejected';
}

export interface UseScannerLogicOptions {
  selectedGate: SelectedGate | null;
  canScan: (gateId?: string) => boolean;
  shiftLogId: string | undefined;
  clearLocalShift: (shiftLogId?: string) => Promise<void>;
  onGateSelectorNeeded: () => void;
  locationPermGranted: boolean;
}

export function useScannerLogic({
  selectedGate,
  canScan,
  shiftLogId,
  clearLocalShift,
  onGateSelectorNeeded,
  locationPermGranted,
}: UseScannerLogicOptions) {
  const [ui, setUi] = useState<ScannerPhase>({ phase: 'scanning' });

  const lastScanAt = useRef<number>(0);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRejectedResult = useRef<ScanResult | null>(null);
  const lastRejectedQRData = useRef<string | null>(null);

  const clearResultTimer = useCallback(() => {
    if (resultTimer.current !== null) {
      clearTimeout(resultTimer.current);
      resultTimer.current = null;
    }
  }, []);

  const showResult = useCallback((result: ScanResult) => {
    clearResultTimer();
    setUi({ phase: 'result', result });
    resultTimer.current = setTimeout(() => {
      setUi({ phase: 'scanning' });
      resultTimer.current = null;
    }, RESULT_DISPLAY_MS);
  }, [clearResultTimer]);

  const handleScanAgain = useCallback(() => {
    clearResultTimer();
    setUi({ phase: 'scanning' });
  }, [clearResultTimer]);

  const handleDecisionPass = useCallback((result: ScanResult) => {
    haptic(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addHistoryEntry({
      outcome: 'pass',
      qrPrefix: lastRejectedQRData.current?.slice(0, 24) ?? '—',
      gateName: selectedGate?.name,
      message: result.message,
      scanId: result.scanId,
    }).catch(() => {});
    showResult(result);
  }, [selectedGate?.name, showResult]);

  const handleDecisionDeny = useCallback((result: ScanResult) => {
    haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});

    if (result.scanId) {
      const scanId = result.scanId;
      const apiBase = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
      getValidAccessToken()
        .then((token) => {
          if (!token) return;
          return fetch(`${apiBase}/scans/${scanId}/deny`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reason: 'operator_denied' }),
          });
        })
        .catch(() => {});
    }

    addHistoryEntry({
      outcome: 'deny',
      qrPrefix: lastRejectedQRData.current?.slice(0, 24) ?? '—',
      gateName: selectedGate?.name,
      message: 'Entry denied by operator',
      scanId: result.scanId,
    }).catch(() => {});

    showResult({
      status: 'rejected',
      message: 'Entry denied by operator',
      offline: false,
    });
  }, [selectedGate?.name, showResult]);

  const onBarcodeScanned = useCallback(async ({ data }: BarcodeScanningResult) => {
    const now = Date.now();
    if (ui.phase !== 'scanning') return;
    if (now - lastScanAt.current < SCAN_COOLDOWN_MS) return;
    lastScanAt.current = now;

    if (!selectedGate) {
      onGateSelectorNeeded();
      return;
    }

    if (!canScan(selectedGate.id)) {
      showResult({
        status: 'rejected',
        reason: 'no_active_shift',
        message: 'Start a shift before scanning',
        offline: false,
      });
      return;
    }

    setUi({ phase: 'processing' });
    __DEV__ && console.debug('[Scanner] Scan started — gate:', selectedGate.id, 'data prefix:', data.slice(0, 40));

    const prefs = await getPreferences().catch(() => ({
      hapticsEnabled: true,
      locationEnabled: true,
    }));

    let qrData = data;
    if (data.startsWith('http://') || data.startsWith('https://')) {
      __DEV__ && console.debug('[Scanner] Resolving short URL:', data);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SHORT_URL_RESOLVE_TIMEOUT_MS);
        const res = await fetch(data, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          const result: ScanResult = {
            status: 'rejected',
            reason: 'not_found',
            message: 'QR link not found or expired',
            offline: false,
          };
          addHistoryEntry({
            outcome: 'rejected',
            qrPrefix: data.slice(0, 24),
            gateName: selectedGate.name,
            message: result.message,
          }).catch(() => {});
          showResult(result);
          return;
        }
        qrData = (await res.text()).trim();
      } catch {
        const result: ScanResult = {
          status: 'rejected',
          reason: 'network',
          message: 'Could not resolve QR link — check connection',
          offline: false,
        };
        addHistoryEntry({
          outcome: 'rejected',
          qrPrefix: data.slice(0, 24),
          gateName: selectedGate.name,
          message: result.message,
        }).catch(() => {});
        showResult(result);
        return;
      }
    }

    const secretResolution = resolveRuntimeQrSecret();
    if (!secretResolution.ok) {
      const result: ScanResult = {
        status: 'rejected',
        reason: 'invalid',
        message: secretResolution.message,
        offline: false,
      };
      addHistoryEntry({
        outcome: 'rejected',
        qrPrefix: qrData.slice(0, 24),
        gateName: selectedGate.name,
        message: result.message,
      }).catch(() => {});
      if (prefs.hapticsEnabled) haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showResult(result);
      return;
    }

    const local = await verifyScanQR(qrData, secretResolution.secret);
    if (!local.valid) {
      const result: ScanResult = {
        status: 'rejected',
        reason: local.reason,
        message: local.details ?? localRejectMessage(local.reason),
        offline: false,
      };
      lastRejectedResult.current = result;
      lastRejectedQRData.current = qrData;
      addHistoryEntry({
        outcome: 'rejected',
        qrPrefix: qrData.slice(0, 24),
        gateName: selectedGate.name,
        message: result.message,
      }).catch(() => {});
      if (prefs.hapticsEnabled) haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showResult(result);
      return;
    }

    let location: LocationContext | undefined;
    if (prefs.locationEnabled && locationPermGranted) {
      try {
        const pos = await getLastKnownPositionAsync();
        if (pos) {
          location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
        }
      } catch {}
    }

    const result = await validateOnServer(qrData, local.payload, location, selectedGate.id, shiftLogId);

    if (result.status === 'rejected') {
      if (result.reason === 'no_active_shift') {
        await clearLocalShift(shiftLogId);
      }
      lastRejectedResult.current = result;
      lastRejectedQRData.current = qrData;
      addHistoryEntry({
        outcome: 'rejected',
        qrPrefix: qrData.slice(0, 24),
        gateName: selectedGate.name,
        message: result.message,
      }).catch(() => {});
      if (prefs.hapticsEnabled) haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showResult(result);
      return;
    }

    if (result.status === 'pending') {
      addHistoryEntry({
        outcome: 'pending',
        qrPrefix: qrData.slice(0, 24),
        gateName: selectedGate.name,
        message: result.message,
      }).catch(() => {});
      if (prefs.hapticsEnabled) haptic(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      showResult(result);
      return;
    }

    if (!result.scanId) {
      const invalidResult: ScanResult = {
        status: 'rejected',
        reason: 'invalid_server_response',
        message: 'Validation incomplete — do not grant entry',
        offline: false,
      };
      lastRejectedResult.current = invalidResult;
      lastRejectedQRData.current = qrData;
      addHistoryEntry({
        outcome: 'rejected',
        qrPrefix: qrData.slice(0, 24),
        gateName: selectedGate.name,
        message: invalidResult.message,
      }).catch(() => {});
      showResult(invalidResult);
      return;
    }

    lastRejectedQRData.current = qrData;

    const effectiveIdentityLevel = selectedGate?.requiredIdentityLevel ?? 0;
    if (effectiveIdentityLevel >= 1 && result.scanId) {
      setUi({ phase: 'id_capture', result });
    } else {
      setUi({ phase: 'decision', result });
    }
  }, [ui.phase, selectedGate, canScan, onGateSelectorNeeded, showResult, locationPermGranted, shiftLogId, clearLocalShift]);

  const handleRequestOverride = useCallback(() => {
    clearResultTimer();
  }, [clearResultTimer]);

  const handleOverrideGranted = useCallback((supervisorAuth: boolean, reason: string) => {
    const overrideResult: ScanResult = {
      status: 'accepted',
      message: supervisorAuth
        ? 'Access granted by supervisor override'
        : 'Access granted — forced override (logged)',
      offline: false,
    };
    showResult(overrideResult);

    if (selectedGate && lastRejectedQRData.current) {
      const qrData = lastRejectedQRData.current;
      const gateId = selectedGate.id;
      const rejectReason = lastRejectedResult.current?.reason;
      getValidAccessToken()
        .then((token) => {
          if (!token) return;
          const apiBase = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
          fetch(`${apiBase}/override/log`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ gateId, qrCode: qrData, reason, supervisorAuth, rejectReason }),
          }).catch(() => {});
        })
        .catch(() => {});
    }
  }, [selectedGate, showResult]);

  const handleOverrideCancel = useCallback(() => {
    if (lastRejectedResult.current) {
      showResult(lastRejectedResult.current);
    }
  }, [showResult]);

  const setDecisionPhase = useCallback((result: ScanResult) => {
    setUi({ phase: 'decision', result });
  }, []);

  return {
    ui,
    onBarcodeScanned,
    handleDecisionPass,
    handleDecisionDeny,
    handleScanAgain,
    handleRequestOverride,
    handleOverrideGranted,
    handleOverrideCancel,
    setDecisionPhase,
    lastRejectedResult,
  };
}
