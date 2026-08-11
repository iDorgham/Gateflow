import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';
import {
  useForegroundPermissions,
  getLastKnownPositionAsync,
} from 'expo-location';
import * as Haptics from 'expo-haptics';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { verifyScanQR } from '../../lib/qr-verify';
import {
  validateOnServer,
  type ScanResult,
  type LocationContext,
} from '../../lib/scanner';
import { getValidAccessToken } from '../../lib/auth-client';
import { IDCaptureModal } from '../../components/IDCaptureModal';
import { MaintenanceReportModal } from '../../components/MaintenanceReportModal';
import { resolveRuntimeQrSecret } from '../../lib/security/qr-secret';
import { useShiftSession } from '../../hooks/use-shift-session';
import {
  loadSelectedGate,
  saveSelectedGate,
  type SelectedGate,
} from '../../components/GateSelector';
import { addHistoryEntry } from '../../lib/scan-history';
import { getPreferences } from '../../lib/preferences';
import { haptic } from '../../lib/haptics';
import { Viewfinder } from '../../components/scanner/viewfinder';
import { DecisionDialog } from '../../components/scanner/decision-dialog';
import { ResultOverlay } from '../../components/scanner/result-overlay';
import { feedbackStyles } from '../../components/scanner/feedback-styles';

const HomeScreen = lazy(() =>
  import('../main/home-screen').then((m) => ({
    default: m.HomeScreen,
  }))
);
const GateSelector = lazy(() =>
  import('../../components/GateSelector').then((m) => ({
    default: m.GateSelector,
  }))
);
const QueueStatus = lazy(() =>
  import('../../components/QueueStatus').then((m) => ({
    default: m.QueueStatus,
  }))
);
const SupervisorOverride = lazy(() =>
  import('../../components/SupervisorOverride').then((m) => ({
    default: m.SupervisorOverride,
  }))
);
const LogTab = lazy(() =>
  import('../../components/HistoryTab').then((m) => ({ default: m.LogTab }))
);
const TodayVisitsTab = lazy(() =>
  import('../../components/TodayVisitsTab').then((m) => ({
    default: m.TodayVisitsTab,
  }))
);
const ChatTab = lazy(() =>
  import('../../components/ChatTab').then((m) => ({ default: m.ChatTab }))
);
const SettingsTab = lazy(() =>
  import('../../components/SettingsTab').then((m) => ({
    default: m.SettingsTab,
  }))
);

const SCAN_COOLDOWN_MS = 2_500;
const RESULT_DISPLAY_MS = 3_000;
const SHORT_URL_RESOLVE_TIMEOUT_MS = 5_000;

/**
 * Camera/verification sub-phase, only active while the scanner tab is active.
 *
 * 'decision' — QR validated successfully; operator must choose Pass or Deny.
 */
type ScannerPhase =
  | { phase: 'scanning' }
  | { phase: 'processing' }
  | { phase: 'id_capture'; result: ScanResult }
  | { phase: 'decision'; result: ScanResult }
  | { phase: 'result'; result: ScanResult };

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

export function ScannerScreen({
  onLogout,
  shift,
}: {
  onLogout: () => Promise<void>;
  shift: ReturnType<typeof useShiftSession>;
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPerm, requestLocationPerm] = useForegroundPermissions();
  const [ui, setUi] = useState<ScannerPhase>({ phase: 'scanning' });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const {
    session: shiftSession,
    loading: shiftLoading,
    busy: shiftBusy,
    error: shiftError,
    startShift,
    endShift,
    canScan,
    clearLocalShift,
  } = shift;

  // ── Gate state ────────────────────────────────────────────────────────────
  const [selectedGate, setSelectedGate] = useState<SelectedGate | null>(null);
  const [showGateSelector, setShowGateSelector] = useState(false);

  // ── Overlay states ────────────────────────────────────────────────────────
  const [showQueueStatus, setShowQueueStatus] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<
    'home' | 'scanner' | 'today' | 'log' | 'chat' | 'settings'
  >('home');

  const lastScanAt = useRef<number>(0);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Store the last rejected scan's raw QR string and result for override
  const lastRejectedResult = useRef<ScanResult | null>(null);
  const lastRejectedQRData = useRef<string | null>(null);

  // Load persisted selected gate on mount
  useEffect(() => {
    loadSelectedGate().then((g) => {
      if (g) setSelectedGate(g);
    });
  }, []);

  // Silently request location once camera is granted.
  useEffect(() => {
    if (permission?.granted) {
      requestLocationPerm().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  // ── Timer helpers ─────────────────────────────────────────────────────────

  const clearResultTimer = () => {
    if (resultTimer.current !== null) {
      clearTimeout(resultTimer.current);
      resultTimer.current = null;
    }
  };

  const showResult = (result: ScanResult) => {
    clearResultTimer();
    setUi({ phase: 'result', result });
    // Auto-dismiss after timeout — tapping "Scan Again" also dismisses early
    resultTimer.current = setTimeout(() => {
      setUi({ phase: 'scanning' });
      resultTimer.current = null;
    }, RESULT_DISPLAY_MS);
  };

  const handleScanAgain = () => {
    clearResultTimer();
    setUi({ phase: 'scanning' });
  };

  // ── Logout ────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    if (isLoggingOut || shiftBusy) return;
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      // A blocked/failed logout leaves ScannerScreen mounted and must restore
      // the control. Successful logout navigates away, making this harmless.
      setIsLoggingOut(false);
    }
  };

  // ── Gate selector ─────────────────────────────────────────────────────────

  const handleGateSelect = (gate: SelectedGate | null) => {
    setSelectedGate(gate);
    saveSelectedGate(gate);
  };

  // ── Decision dialog (Pass / Deny Entry) ───────────────────────────────────

  /** Operator approved entry — QR is valid and person is let through. */
  const handleDecisionPass = (result: ScanResult) => {
    haptic(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addHistoryEntry({
      outcome: 'pass',
      qrPrefix: lastRejectedQRData.current?.slice(0, 24) ?? '—',
      gateName: selectedGate?.name,
      message: result.message,
      scanId: result.scanId,
    }).catch(() => {});
    showResult(result);
  };

  /** Operator denied entry — QR was valid but person is turned away. */
  const handleDecisionDeny = (result: ScanResult) => {
    haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});

    // Fire-and-forget: update ScanLog status to DENIED on server
    if (result.scanId) {
      const scanId = result.scanId;
      const apiBase =
        process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
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
        .catch(() => {
          /* non-fatal — scan was already logged as SUCCESS */
        });
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
  };

  // ── Barcode handler ───────────────────────────────────────────────────────

  const onBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    const now = Date.now();
    if (ui.phase !== 'scanning') return;
    if (now - lastScanAt.current < SCAN_COOLDOWN_MS) return;
    lastScanAt.current = now;

    // Require a gate to be selected before scanning
    if (!selectedGate) {
      setShowGateSelector(true);
      return;
    }

    // Require an active shift for the selected gate (Phase 03)
    if (!canScan(selectedGate.id)) {
      showResult({
        status: 'rejected',
        reason: 'no_active_shift',
        message: 'Start a shift before scanning',
        offline: false,
      });
      return;
    }
    const scanShiftLogId = shiftSession?.shiftLogId;

    setUi({ phase: 'processing' });
    __DEV__ &&
      console.debug(
        '[Scanner] Scan started — gate:',
        selectedGate.id,
        'data prefix:',
        data.slice(0, 40)
      );

    // Load preferences (non-blocking; falls back to defaults on error)
    const prefs = await getPreferences().catch(() => ({
      hapticsEnabled: true,
      locationEnabled: true,
    }));

    // Step 0 — If the QR encodes a short URL (/s/{shortId}), resolve it to
    //          the full signed payload before local verification.
    let qrData = data;
    if (data.startsWith('http://') || data.startsWith('https://')) {
      __DEV__ && console.debug('[Scanner] Resolving short URL:', data);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          SHORT_URL_RESOLVE_TIMEOUT_MS
        );
        const res = await fetch(data, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          __DEV__ &&
            console.debug(
              '[Scanner] Short URL resolve failed — status:',
              res.status
            );
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
        __DEV__ &&
          console.debug(
            '[Scanner] Short URL resolved — payload prefix:',
            qrData.slice(0, 40)
          );
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

    // Step 1 — Local: signature + expiry + nonce replay (fail closed without secret)
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
      if (prefs.hapticsEnabled)
        haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showResult(result);
      return;
    }

    const local = await verifyScanQR(qrData, secretResolution.secret);
    __DEV__ &&
      console.debug(
        '[Scanner] Local verify:',
        local.valid ? 'PASS' : `FAIL (${local.reason})`
      );
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
      if (prefs.hapticsEnabled)
        haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showResult(result);
      return;
    }

    // Step 2 — Best-effort location snapshot (skipped if preference is off)
    let location: LocationContext | undefined;
    if (prefs.locationEnabled && locationPerm?.granted) {
      try {
        const pos = await getLastKnownPositionAsync();
        if (pos) {
          location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
        }
      } catch {
        /* unavailable */
      }
    }

    // Step 3 — Server validation with offline fallback
    __DEV__ &&
      console.debug(
        '[Scanner] Calling validateOnServer — gate:',
        selectedGate.id,
        'location:',
        !!location
      );
    const result = await validateOnServer(
      qrData,
      local.payload,
      location,
      selectedGate.id,
      scanShiftLogId
    );
    __DEV__ &&
      console.debug(
        '[Scanner] Server result:',
        result.status,
        'scanId:',
        result.scanId,
        'offline:',
        result.offline
      );

    if (result.status === 'rejected') {
      if (result.reason === 'no_active_shift') {
        await clearLocalShift(scanShiftLogId);
      }
      lastRejectedResult.current = result;
      lastRejectedQRData.current = qrData;
      addHistoryEntry({
        outcome: 'rejected',
        qrPrefix: qrData.slice(0, 24),
        gateName: selectedGate.name,
        message: result.message,
      }).catch(() => {});
      if (prefs.hapticsEnabled)
        haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showResult(result);
      return;
    }

    // Offline / no scanId → record as offline and show result directly
    if (result.offline || !result.scanId) {
      addHistoryEntry({
        outcome: 'offline',
        qrPrefix: qrData.slice(0, 24),
        gateName: selectedGate.name,
        message: result.message,
      }).catch(() => {});
      if (prefs.hapticsEnabled)
        haptic(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      showResult(result);
      return;
    }

    // Store qrData for history in case operator makes a decision
    lastRejectedQRData.current = qrData;

    const effectiveIdentityLevel = selectedGate?.requiredIdentityLevel ?? 0;
    if (effectiveIdentityLevel >= 1 && result.scanId) {
      setUi({ phase: 'id_capture', result });
    } else {
      setUi({ phase: 'decision', result });
    }
  };

  // ── Supervisor override ───────────────────────────────────────────────────

  const handleRequestOverride = () => {
    clearResultTimer();
    setShowOverride(true);
  };

  const handleOverrideGranted = (supervisorAuth: boolean, reason: string) => {
    setShowOverride(false);
    const overrideResult: ScanResult = {
      status: 'accepted',
      message: supervisorAuth
        ? 'Access granted by supervisor override'
        : '⚠ Access granted — forced override (logged)',
      offline: false,
    };
    showResult(overrideResult);

    // Fire-and-forget: log to server
    if (selectedGate && lastRejectedQRData.current) {
      const qrData = lastRejectedQRData.current;
      const gateId = selectedGate.id;
      const rejectReason = lastRejectedResult.current?.reason;
      getValidAccessToken()
        .then((token) => {
          if (!token) return;
          const apiBase =
            process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
          fetch(`${apiBase}/override/log`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              gateId,
              qrCode: qrData,
              reason,
              supervisorAuth,
              rejectReason,
            }),
          }).catch(() => {
            /* non-fatal — local log already recorded */
          });
        })
        .catch(() => {});
    }
  };

  const handleOverrideCancel = () => {
    setShowOverride(false);
    // Re-show the rejected result if still in result phase
    if (lastRejectedResult.current) {
      showResult(lastRejectedResult.current);
    }
  };

  // ── Permission states ─────────────────────────────────────────────────────

  if (!permission) {
    return (
      <View style={styles.center}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={nativeTokens.colors.background}
        />
        <ActivityIndicator size="large" color={nativeTokens.colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={nativeTokens.colors.background}
        />
        <View style={styles.permIcon}>
          <Text style={styles.permIconText}>⬡</Text>
        </View>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permSub}>
          GateFlow needs your camera to scan QR codes.
        </Text>
        <Pressable style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  // ── Main scanner UI ───────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {activeTab === 'home' && (
        <Suspense
          fallback={
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.center,
                { backgroundColor: nativeTokens.colors.background },
              ]}
            >
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.primary}
              />
            </View>
          }
        >
          <HomeScreen
            shift={shift}
            onStartScanning={() => setActiveTab('scanner')}
          />
        </Suspense>
      )}

      {activeTab === 'scanner' && (
        <>
          {/* Keep the preview mounted while shift state hydrates; only scanning is gated. */}
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={
              canScan(selectedGate?.id) && ui.phase === 'scanning'
                ? onBarcodeScanned
                : undefined
            }
          />

          {/* Decorative overlay — non-interactive */}
          <View style={styles.overlay} pointerEvents="none">
            <Text style={styles.scannerHeader}>GateFlow Scanner</Text>
            <Viewfinder
              frameSize={FRAME_SIZE}
              processing={
                ui.phase === 'processing' ||
                ui.phase === 'decision' ||
                ui.phase === 'id_capture'
              }
            />
            <Text style={styles.scannerHint}>
              {!selectedGate
                ? 'Select a gate to begin scanning'
                : !canScan(selectedGate.id)
                  ? 'Start your shift to unlock scanning'
                  : `Gate: ${selectedGate.name} · On duty`}
            </Text>
          </View>

          {/* Top-left controls (gate + queue + shift) */}
          <View style={styles.topBarLeft} pointerEvents="box-none">
            {/* Gate selector button */}
            <Pressable
              style={styles.topBarBtn}
              onPress={() => setShowGateSelector(true)}
            >
              <Text style={styles.topBarBtnText} numberOfLines={1}>
                {selectedGate ? `⬡  ${selectedGate.name}` : '⬡  Select Gate'}
              </Text>
            </Pressable>

            {/* Shift start / end */}
            <Pressable
              style={styles.topBarBtn}
              disabled={shiftLoading || shiftBusy}
              onPress={() => {
                if (!selectedGate) {
                  setShowGateSelector(true);
                  return;
                }
                if (canScan(selectedGate.id)) {
                  void endShift();
                  return;
                }
                void startShift(selectedGate.id, selectedGate.name);
              }}
            >
              <Text style={styles.topBarBtnText} numberOfLines={1}>
                {shiftLoading || shiftBusy
                  ? '…'
                  : canScan(selectedGate?.id)
                    ? '■ End shift'
                    : '▶ Start shift'}
              </Text>
            </Pressable>

            {/* Queue status button */}
            <Pressable
              style={styles.topBarBtn}
              onPress={() => setShowQueueStatus(true)}
            >
              <Text style={styles.topBarBtnText}>⇅ Queue</Text>
            </Pressable>

            {shiftError ? (
              <View style={styles.shiftErrorBanner} pointerEvents="none">
                <Text style={styles.shiftErrorText}>{shiftError}</Text>
              </View>
            ) : null}
          </View>

          {/* Top-right: Sign-out */}
          <View style={styles.topBarRight} pointerEvents="box-none">
            <Pressable
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={isLoggingOut || shiftBusy}
            >
              {isLoggingOut ? (
                <ActivityIndicator
                  size="small"
                  color={nativeTokens.colors.textSubtle}
                />
              ) : (
                <Text style={styles.logoutText}>Sign out</Text>
              )}
            </Pressable>
          </View>

          {/* ID capture (when gate requires identity level 1+) */}
          {ui.phase === 'id_capture' && (
            <IDCaptureModal
              visible
              scanLogId={ui.result.scanId!}
              onSuccess={() => setUi({ phase: 'decision', result: ui.result })}
              required
            />
          )}

          {/* Processing spinner */}
          {ui.phase === 'processing' && (
            <View style={feedbackStyles.feedbackLayer}>
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.textInverse}
              />
              <Text style={feedbackStyles.feedbackTitle}>Verifying…</Text>
            </View>
          )}

          {/* Pass / Deny decision dialog */}
          {ui.phase === 'decision' && (
            <DecisionDialog
              result={ui.result}
              onPass={() => handleDecisionPass(ui.result)}
              onDeny={() => handleDecisionDeny(ui.result)}
            />
          )}

          {/* Result overlay */}
          {ui.phase === 'result' && (
            <ResultOverlay
              result={ui.result}
              onScanAgain={handleScanAgain}
              onRequestOverride={
                ui.result.status === 'rejected' &&
                !ui.result.offline &&
                ui.result.reason !== 'no_active_shift'
                  ? handleRequestOverride
                  : undefined
              }
              onReportIssue={() => setShowMaintenanceModal(true)}
            />
          )}
        </>
      )}

      {activeTab === 'log' && (
        <Suspense
          fallback={
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.center,
                { backgroundColor: nativeTokens.colors.background },
              ]}
            >
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.primary}
              />
            </View>
          }
        >
          <LogTab />
        </Suspense>
      )}

      {activeTab === 'today' && (
        <Suspense
          fallback={
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.center,
                { backgroundColor: nativeTokens.colors.background },
              ]}
            >
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.primary}
              />
            </View>
          }
        >
          <TodayVisitsTab />
        </Suspense>
      )}

      {activeTab === 'chat' && (
        <Suspense
          fallback={
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.center,
                { backgroundColor: nativeTokens.colors.background },
              ]}
            >
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.primary}
              />
            </View>
          }
        >
          <ChatTab />
        </Suspense>
      )}

      {activeTab === 'settings' && (
        <Suspense
          fallback={
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.center,
                { backgroundColor: nativeTokens.colors.background },
              ]}
            >
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.primary}
              />
            </View>
          }
        >
          <SettingsTab onLogout={handleLogout} />
        </Suspense>
      )}

      {/* ── Modals ────────────────────────────────────────────────────────── */}

      {showGateSelector && (
        <Suspense fallback={null}>
          <GateSelector
            visible
            selectedGate={selectedGate}
            onSelect={handleGateSelect}
            onClose={() => setShowGateSelector(false)}
          />
        </Suspense>
      )}

      {showQueueStatus && (
        <Suspense fallback={null}>
          <QueueStatus visible onClose={() => setShowQueueStatus(false)} />
        </Suspense>
      )}

      {showOverride && (
        <Suspense fallback={null}>
          <SupervisorOverride
            visible
            onGranted={(supervisorAuth, reason) =>
              handleOverrideGranted(supervisorAuth, reason)
            }
            onCancel={handleOverrideCancel}
          />
        </Suspense>
      )}

      {showMaintenanceModal && selectedGate && (
        <MaintenanceReportModal
          visible
          gateId={selectedGate.id}
          scanLogId={ui.phase === 'result' ? ui.result.scanId : undefined}
          onClose={() => setShowMaintenanceModal(false)}
          onSuccess={() => {
            setShowMaintenanceModal(false);
            haptic(Haptics.NotificationFeedbackType.Success).catch(() => {});
          }}
        />
      )}

      {/* ── Bottom navigation ────────────────────────────────────────────── */}
      <View style={styles.bottomNav} pointerEvents="box-none">
        {/* Home */}
        <Pressable
          style={[styles.navTab, activeTab === 'home' && styles.navTabActive]}
          onPress={() => setActiveTab('home')}
        >
          <Text
            style={[
              styles.navTabIcon,
              activeTab === 'home' && styles.navTabIconActive,
            ]}
          >
            🏠
          </Text>
          <Text
            style={[
              styles.navTabLabel,
              activeTab === 'home' && styles.navTabLabelActive,
            ]}
          >
            Home
          </Text>
        </Pressable>

        {/* Scanner */}
        <Pressable
          style={[
            styles.navTab,
            activeTab === 'scanner' && styles.navTabActive,
          ]}
          onPress={() => setActiveTab('scanner')}
        >
          <Text
            style={[
              styles.navTabIcon,
              activeTab === 'scanner' && styles.navTabIconActive,
            ]}
          >
            ⬡
          </Text>
          <Text
            style={[
              styles.navTabLabel,
              activeTab === 'scanner' && styles.navTabLabelActive,
            ]}
          >
            Scan
          </Text>
        </Pressable>

        {/* Today */}
        <Pressable
          style={[styles.navTab, activeTab === 'today' && styles.navTabActive]}
          onPress={() => setActiveTab('today')}
        >
          <Text
            style={[
              styles.navTabIcon,
              activeTab === 'today' && styles.navTabIconActive,
            ]}
          >
            📅
          </Text>
          <Text
            style={[
              styles.navTabLabel,
              activeTab === 'today' && styles.navTabLabelActive,
            ]}
          >
            Today
          </Text>
        </Pressable>

        {/* Log */}
        <Pressable
          style={[styles.navTab, activeTab === 'log' && styles.navTabActive]}
          onPress={() => setActiveTab('log')}
        >
          <Text
            style={[
              styles.navTabIcon,
              activeTab === 'log' && styles.navTabIconActive,
            ]}
          >
            ≡
          </Text>
          <Text
            style={[
              styles.navTabLabel,
              activeTab === 'log' && styles.navTabLabelActive,
            ]}
          >
            Log
          </Text>
        </Pressable>

        {/* Chat */}
        <Pressable
          style={[styles.navTab, activeTab === 'chat' && styles.navTabActive]}
          onPress={() => setActiveTab('chat')}
        >
          <Text
            style={[
              styles.navTabIcon,
              activeTab === 'chat' && styles.navTabIconActive,
            ]}
          >
            💬
          </Text>
          <Text
            style={[
              styles.navTabLabel,
              activeTab === 'chat' && styles.navTabLabelActive,
            ]}
          >
            Chat
          </Text>
        </Pressable>

        {/* Settings */}
        <Pressable
          style={[
            styles.navTab,
            activeTab === 'settings' && styles.navTabActive,
          ]}
          onPress={() => setActiveTab('settings')}
        >
          <Text
            style={[
              styles.navTabIcon,
              activeTab === 'settings' && styles.navTabIconActive,
            ]}
          >
            ⚙
          </Text>
          <Text
            style={[
              styles.navTabLabel,
              activeTab === 'settings' && styles.navTabLabelActive,
            ]}
          >
            Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.65;

// Dynamic top offset: respects Android status bar height
const TOP_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 20 : 60;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nativeTokens.colors.background,
  },

  // ── Scanner camera view ───────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: TOP_OFFSET,
    paddingBottom: 108, // room for bottom nav
  },
  scannerHeader: {
    fontSize: 20,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    letterSpacing: nativeTokens.typography.headerTracking,
    textTransform: 'uppercase',
    textShadowColor: nativeTokens.colors.backdropGlass,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  scannerHint: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 24,
    textShadowColor: nativeTokens.colors.backdropGlass,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  // ── Top bar ───────────────────────────────────────────────────────────────
  topBarLeft: {
    position: 'absolute',
    top: TOP_OFFSET,
    left: 16,
    flexDirection: 'column',
    gap: 8,
  },
  topBarRight: {
    position: 'absolute',
    top: TOP_OFFSET,
    right: 16,
  },
  topBarBtn: {
    backgroundColor: nativeTokens.colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    maxWidth: 160,
  },
  topBarBtnText: {
    color: nativeTokens.colors.textHeading,
    fontSize: 12,
    fontFamily: 'Cairo_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  shiftErrorBanner: {
    backgroundColor: nativeTokens.colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: 240,
  },
  shiftErrorText: {
    color: nativeTokens.colors.danger,
    fontSize: 12,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: nativeTokens.colors.background,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    minWidth: 88,
    alignItems: 'center',
  },
  logoutText: {
    color: nativeTokens.colors.textHeading,
    fontSize: 12,
    fontFamily: 'Cairo_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ── Bottom navigation bar ─────────────────────────────────────────────────
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: nativeTokens.colors.background,
    borderTopWidth: 1,
    borderTopColor: nativeTokens.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    paddingTop: 12,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    opacity: 0.3,
  },
  navTabActive: {
    opacity: 1,
  },
  navTabIcon: {
    fontSize: 22,
    color: nativeTokens.colors.textSubtle,
  },
  navTabIconActive: {
    color: nativeTokens.colors.primary,
  },
  navTabLabel: {
    fontSize: 10,
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtlest,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  navTabLabelActive: {
    color: nativeTokens.colors.primary,
  },

  // ── Permission screens ────────────────────────────────────────────────────
  permIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderWidth: 2,
    borderColor: nativeTokens.colors.primarySubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...nativeTokens.shadows.satinRaised,
  },
  permIconText: {
    fontSize: 36,
    color: nativeTokens.colors.primary,
  },
  permTitle: {
    fontSize: 24,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  permSub: {
    fontSize: 15,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textPrimary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginTop: 8,
  },
  permButton: {
    backgroundColor: nativeTokens.colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    marginTop: 24,
    ...nativeTokens.shadows.brandGlow,
  },
  permButtonText: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textInverse,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
