import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { nativeTokens } from '@gate-access/ui/tokens';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useForegroundPermissions, getLastKnownPositionAsync } from 'expo-location';
import * as Haptics from 'expo-haptics';
import { verifyScanQR } from './src/lib/qr-verify';
import { validateOnServer, type ScanResult, type LocationContext } from './src/lib/scanner';
import { login, logout, getValidAccessToken } from './src/lib/auth-client';
import { IDCaptureModal } from './src/components/IDCaptureModal';
import { loadSelectedGate, saveSelectedGate, type SelectedGate } from './src/components/GateSelector';

const GateSelector = lazy(() =>
  import('./src/components/GateSelector').then((m) => ({ default: m.GateSelector }))
);
const QueueStatus = lazy(() =>
  import('./src/components/QueueStatus').then((m) => ({ default: m.QueueStatus }))
);
const SupervisorOverride = lazy(() =>
  import('./src/components/SupervisorOverride').then((m) => ({ default: m.SupervisorOverride }))
);
const HistoryTab = lazy(() =>
  import('./src/components/HistoryTab').then((m) => ({ default: m.HistoryTab }))
);
const SettingsTab = lazy(() =>
  import('./src/components/SettingsTab').then((m) => ({ default: m.SettingsTab }))
);
import { addHistoryEntry } from './src/lib/scan-history';
import { getPreferences } from './src/lib/preferences';
import { useFonts, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';

/** Shared HMAC secret provisioned via .env: EXPO_PUBLIC_QR_SECRET=<32+ chars> */
const QR_SECRET = process.env.EXPO_PUBLIC_QR_SECRET ?? '';

const SCAN_COOLDOWN_MS = 2_500;
const RESULT_DISPLAY_MS = 3_000;
const SHORT_URL_RESOLVE_TIMEOUT_MS = 5_000;

// Corner marker dimensions for the viewfinder frame
const CORNER_LEN = 28;
const CORNER_W = 3.5;

// ─── App-level state machine ──────────────────────────────────────────────────

/** Top-level phase of the application. */
type AppPhase = 'initializing' | 'login' | 'scanner';

/**
 * Camera/verification sub-phase, only active when AppPhase === 'scanner'.
 *
 * 'decision' — QR validated successfully; operator must choose Pass or Deny.
 */
type ScannerPhase =
  | { phase: 'scanning' }
  | { phase: 'processing' }
  | { phase: 'id_capture'; result: ScanResult }
  | { phase: 'decision'; result: ScanResult }
  | { phase: 'result'; result: ScanResult };

// ─── Viewfinder with L-shaped corner markers ─────────────────────────────────

function Viewfinder({ processing }: { processing: boolean }) {
  const c = processing ? '#f59e0b' : '#3b82f6';
  return (
    <View style={{ width: FRAME_SIZE, height: FRAME_SIZE }}>
      {/* Top-left */}
      <View style={{ position: 'absolute', top: 0, left: 0, width: CORNER_LEN, height: CORNER_LEN }}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: CORNER_LEN, height: CORNER_W, backgroundColor: c, borderTopLeftRadius: 2 }} />
        <View style={{ position: 'absolute', top: 0, left: 0, width: CORNER_W, height: CORNER_LEN, backgroundColor: c, borderTopLeftRadius: 2 }} />
      </View>
      {/* Top-right */}
      <View style={{ position: 'absolute', top: 0, right: 0, width: CORNER_LEN, height: CORNER_LEN }}>
        <View style={{ position: 'absolute', top: 0, right: 0, width: CORNER_LEN, height: CORNER_W, backgroundColor: c, borderTopRightRadius: 2 }} />
        <View style={{ position: 'absolute', top: 0, right: 0, width: CORNER_W, height: CORNER_LEN, backgroundColor: c, borderTopRightRadius: 2 }} />
      </View>
      {/* Bottom-left */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, width: CORNER_LEN, height: CORNER_LEN }}>
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: CORNER_LEN, height: CORNER_W, backgroundColor: c, borderBottomLeftRadius: 2 }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: CORNER_W, height: CORNER_LEN, backgroundColor: c, borderBottomLeftRadius: 2 }} />
      </View>
      {/* Bottom-right */}
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: CORNER_LEN, height: CORNER_LEN }}>
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: CORNER_LEN, height: CORNER_W, backgroundColor: c, borderBottomRightRadius: 2 }} />
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: CORNER_W, height: CORNER_LEN, backgroundColor: c, borderBottomRightRadius: 2 }} />
      </View>
    </View>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>('initializing');
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // On mount: check SecureStore for a valid (or refreshable) token.
  // If found → skip login and go straight to scanner.
  useEffect(() => {
    getValidAccessToken()
      .then((token) => setAppPhase(token ? 'scanner' : 'login'))
      .catch(() => setAppPhase('login'));
  }, []);

  const handleLoginSuccess = () => setAppPhase('scanner');

  const handleLogout = async () => {
    await logout();
    setAppPhase('login');
  };

  if (appPhase === 'initializing') {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.splashLogo}>
          <View style={styles.splashInner} />
        </View>
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 32 }} />
        <Text style={styles.initBrand}>GateFlow</Text>
        <Text style={styles.initSub}>SCANNER</Text>
      </View>
    );
  }

  if (appPhase === 'login') {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  return <ScannerScreen onLogout={handleLogout} />;
}

// ─── Login screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleLogin = async () => {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await login(trimmed, password);
    setIsLoading(false);

    if (result.success) {
      await haptic(Haptics.NotificationFeedbackType.Success);
      onSuccess();
    } else {
      await haptic(Haptics.NotificationFeedbackType.Error);
      setError(result.error ?? 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.loginRoot}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <KeyboardAvoidingView
        style={styles.loginKAV}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.loginInner}>
          {/* Brand mark */}
          <View style={styles.loginHeader}>
            <View style={styles.logoMark}>
              <View style={styles.logoMarkInner} />
            </View>
            <Text style={styles.logoTitle}>GateFlow</Text>
            <Text style={styles.logoLabel}>SCANNER</Text>
          </View>

          {/* Form */}
          <View style={styles.loginForm}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={(t) => { setEmail(t); clearError(); }}
              placeholder="operator@company.com"
              placeholderTextColor="#475569"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              editable={!isLoading}
            />

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
            <TextInput
              style={styles.fieldInput}
              value={password}
              onChangeText={(t) => { setPassword(t); clearError(); }}
              placeholder="••••••••"
              placeholderTextColor="#475569"
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!isLoading}
            />

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={[styles.loginButton, isLoading && styles.loginButtonBusy]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </Pressable>

            {/* Stub — no forgot-password flow yet */}
            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Scanner screen ───────────────────────────────────────────────────────────

function ScannerScreen({ onLogout }: { onLogout: () => Promise<void> }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPerm, requestLocationPerm] = useForegroundPermissions();
  const [ui, setUi] = useState<ScannerPhase>({ phase: 'scanning' });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ── Gate state ────────────────────────────────────────────────────────────
  const [selectedGate, setSelectedGate] = useState<SelectedGate | null>(null);
  const [showGateSelector, setShowGateSelector] = useState(false);

  // ── Overlay states ────────────────────────────────────────────────────────
  const [showQueueStatus, setShowQueueStatus] = useState(false);
  const [showOverride, setShowOverride] = useState(false);

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'settings'>('scan');

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
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await onLogout(); // navigates away — no need to reset flag
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
        .catch(() => { /* non-fatal — scan was already logged as SUCCESS */ });
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

    setUi({ phase: 'processing' });
    __DEV__ && console.debug('[Scanner] Scan started — gate:', selectedGate.id, 'data prefix:', data.slice(0, 40));

    // Load preferences (non-blocking; falls back to defaults on error)
    const prefs = await getPreferences().catch(() => ({ hapticsEnabled: true, locationEnabled: true }));

    // Step 0 — If the QR encodes a short URL (/s/{shortId}), resolve it to
    //          the full signed payload before local verification.
    let qrData = data;
    if (data.startsWith('http://') || data.startsWith('https://')) {
      __DEV__ && console.debug('[Scanner] Resolving short URL:', data);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), SHORT_URL_RESOLVE_TIMEOUT_MS);
        const res = await fetch(data, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
          __DEV__ && console.debug('[Scanner] Short URL resolve failed — status:', res.status);
          const result: ScanResult = {
            status: 'rejected',
            reason: 'not_found',
            message: 'QR link not found or expired',
            offline: false,
          };
          addHistoryEntry({ outcome: 'rejected', qrPrefix: data.slice(0, 24), gateName: selectedGate.name, message: result.message }).catch(() => {});
          showResult(result);
          return;
        }
        qrData = (await res.text()).trim();
        __DEV__ && console.debug('[Scanner] Short URL resolved — payload prefix:', qrData.slice(0, 40));
      } catch {
        const result: ScanResult = {
          status: 'rejected',
          reason: 'network',
          message: 'Could not resolve QR link — check connection',
          offline: false,
        };
        addHistoryEntry({ outcome: 'rejected', qrPrefix: data.slice(0, 24), gateName: selectedGate.name, message: result.message }).catch(() => {});
        showResult(result);
        return;
      }
    }

    // Step 1 — Local: signature + expiry + nonce replay
    const local = await verifyScanQR(qrData, QR_SECRET);
    __DEV__ && console.debug('[Scanner] Local verify:', local.valid ? 'PASS' : `FAIL (${local.reason})`);
    if (!local.valid) {
      const result: ScanResult = {
        status: 'rejected',
        reason: local.reason,
        message: local.details ?? localRejectMessage(local.reason),
        offline: false,
      };
      lastRejectedResult.current = result;
      lastRejectedQRData.current = qrData;
      addHistoryEntry({ outcome: 'rejected', qrPrefix: qrData.slice(0, 24), gateName: selectedGate.name, message: result.message }).catch(() => {});
      if (prefs.hapticsEnabled) haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
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
      } catch { /* unavailable */ }
    }

    // Step 3 — Server validation with offline fallback
    __DEV__ && console.debug('[Scanner] Calling validateOnServer — gate:', selectedGate.id, 'location:', !!location);
    const result = await validateOnServer(qrData, local.payload, location, selectedGate.id);
    __DEV__ && console.debug('[Scanner] Server result:', result.status, 'scanId:', result.scanId, 'offline:', result.offline);

    if (result.status === 'rejected') {
      lastRejectedResult.current = result;
      lastRejectedQRData.current = qrData;
      addHistoryEntry({ outcome: 'rejected', qrPrefix: qrData.slice(0, 24), gateName: selectedGate.name, message: result.message }).catch(() => {});
      if (prefs.hapticsEnabled) haptic(Haptics.NotificationFeedbackType.Error).catch(() => {});
      showResult(result);
      return;
    }

    // Offline / no scanId → record as offline and show result directly
    if (result.offline || !result.scanId) {
      addHistoryEntry({ outcome: 'offline', qrPrefix: qrData.slice(0, 24), gateName: selectedGate.name, message: result.message }).catch(() => {});
      if (prefs.hapticsEnabled) haptic(Haptics.NotificationFeedbackType.Warning).catch(() => {});
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
      getValidAccessToken().then((token) => {
        if (!token) return;
        const apiBase = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
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
        }).catch(() => { /* non-fatal — local log already recorded */ });
      }).catch(() => {});
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
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <View style={styles.permIcon}>
          <Text style={styles.permIconText}>⬡</Text>
        </View>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permSub}>GateFlow needs your camera to scan QR codes.</Text>
        <Pressable style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  // ── Main scanner UI ───────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {activeTab === 'scan' && (
        <>
          {/* Live camera feed */}
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={ui.phase === 'scanning' ? onBarcodeScanned : undefined}
          />

          {/* Decorative overlay — non-interactive */}
          <View style={styles.overlay} pointerEvents="none">
            <Text style={styles.scannerHeader}>GateFlow Scanner</Text>
            <Viewfinder processing={ui.phase === 'processing' || ui.phase === 'decision' || ui.phase === 'id_capture'} />
            <Text style={styles.scannerHint}>
              {selectedGate ? `Gate: ${selectedGate.name}` : 'Select a gate to begin scanning'}
            </Text>
          </View>

          {/* Top-left controls (gate + queue) */}
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

            {/* Queue status button */}
            <Pressable
              style={styles.topBarBtn}
              onPress={() => setShowQueueStatus(true)}
            >
              <Text style={styles.topBarBtnText}>⇅  Queue</Text>
            </Pressable>
          </View>

          {/* Top-right: Sign-out */}
          <View style={styles.topBarRight} pointerEvents="box-none">
            <Pressable
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#94a3b8" />
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
            <View style={styles.feedbackLayer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.feedbackTitle}>Verifying…</Text>
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
                ui.result.status === 'rejected' && !ui.result.offline
                  ? handleRequestOverride
                  : undefined
              }
            />
          )}
        </>
      )}

      {activeTab === 'history' && (
        <Suspense fallback={
          <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: '#0f172a' }]}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        }>
          <HistoryTab />
        </Suspense>
      )}

      {activeTab === 'settings' && (
        <Suspense fallback={
          <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: '#0f172a' }]}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        }>
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
            onGranted={(supervisorAuth, reason) => handleOverrideGranted(supervisorAuth, reason)}
            onCancel={handleOverrideCancel}
          />
        </Suspense>
      )}

      {/* ── Bottom navigation ────────────────────────────────────────────── */}
      <View style={styles.bottomNav} pointerEvents="box-none">
        {/* Scan */}
        <Pressable
          style={[styles.navTab, activeTab === 'scan' && styles.navTabActive]}
          onPress={() => setActiveTab('scan')}
        >
          <Text style={[styles.navTabIcon, activeTab === 'scan' && styles.navTabIconActive]}>⬡</Text>
          <Text style={[styles.navTabLabel, activeTab === 'scan' && styles.navTabLabelActive]}>Scan</Text>
        </Pressable>

        {/* History */}
        <Pressable
          style={[styles.navTab, activeTab === 'history' && styles.navTabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.navTabIcon, activeTab === 'history' && styles.navTabIconActive]}>≡</Text>
          <Text style={[styles.navTabLabel, activeTab === 'history' && styles.navTabLabelActive]}>History</Text>
        </Pressable>

        {/* Settings */}
        <Pressable
          style={[styles.navTab, activeTab === 'settings' && styles.navTabActive]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.navTabIcon, activeTab === 'settings' && styles.navTabIconActive]}>⚙</Text>
          <Text style={[styles.navTabLabel, activeTab === 'settings' && styles.navTabLabelActive]}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Decision dialog (Pass / Deny Entry) ─────────────────────────────────────

function DecisionDialog({
  result,
  onPass,
  onDeny,
}: {
  result: ScanResult;
  onPass: () => void;
  onDeny: () => void;
}) {
  return (
    <View style={[styles.feedbackLayer, decision.backdrop]}>
      {/* Icon */}
      <View style={decision.iconWrap}>
        <Text style={decision.icon}>?</Text>
      </View>

      <Text style={styles.feedbackTitle}>Approve Entry?</Text>

      {!!result.message && (
        <Text style={[styles.feedbackSub, { color: '#cbd5e1' }]}>{result.message}</Text>
      )}

      <Text style={decision.hint}>QR code verified — operator decision required</Text>

      {/* Action buttons */}
      <View style={decision.buttonRow}>
        <Pressable
          style={[decision.btn, decision.passBtn]}
          onPress={onPass}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
        >
          <Text style={decision.passIcon}>✓</Text>
          <Text style={decision.btnLabel}>Pass</Text>
        </Pressable>

        <Pressable
          style={[decision.btn, decision.denyBtn]}
          onPress={onDeny}
          android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
        >
          <Text style={decision.denyIcon}>✗</Text>
          <Text style={decision.btnLabel}>Deny</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Result overlay ───────────────────────────────────────────────────────────

function ResultOverlay({
  result,
  onScanAgain,
  onRequestOverride,
}: {
  result: ScanResult;
  onScanAgain: () => void;
  /** Defined only for non-offline rejections */
  onRequestOverride?: () => void;
}) {
  const ok = result.status === 'accepted';
  return (
    <View
      style={[
        styles.feedbackLayer,
        { backgroundColor: ok ? '#16a34aee' : '#dc2626ee' },
      ]}
    >
      <Text style={styles.feedbackIcon}>{ok ? '✓' : '✗'}</Text>
      <Text style={styles.feedbackTitle}>
        {ok ? 'Access Granted' : 'Access Denied'}
      </Text>
      {!!result.message && (
        <Text style={styles.feedbackSub}>{result.message}</Text>
      )}
      {result.offline && (
        <Text style={styles.offlineBadge}>⚡ Offline — queued for sync</Text>
      )}

      {/* Override button — only for non-offline rejections */}
      {!!onRequestOverride && (
        <Pressable style={styles.overrideButton} onPress={onRequestOverride}>
          <Text style={styles.overrideButtonText}>Request Override</Text>
        </Pressable>
      )}

      <Pressable style={styles.scanAgainButton} onPress={onScanAgain}>
        <Text style={styles.scanAgainText}>Scan Again</Text>
      </Pressable>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

async function haptic(type: Haptics.NotificationFeedbackType): Promise<void> {
  try {
    await Haptics.notificationAsync(type);
  } catch { /* simulators don't support haptics */ }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.65;

// Dynamic top offset: respects Android status bar height
const TOP_OFFSET = Platform.OS === 'android'
  ? (StatusBar.currentHeight ?? 24) + 20
  : 60;

const styles = StyleSheet.create({
  // ── Shared ────────────────────────────────────────────────────────────────
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 32,
    gap: 8,
  },

  // ── Initializing splash ───────────────────────────────────────────────────
  splashLogo: {
    width: 64,
    height: 64,
    borderRadius: nativeTokens.borderRadius.lg,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashInner: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  initBrand: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: 1,
    marginTop: 8,
  },
  initSub: {
    fontSize: 11,
    color: '#64748b',
    letterSpacing: 3,
  },

  // ── Login screen ──────────────────────────────────────────────────────────
  loginRoot: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loginKAV: {
    flex: 1,
  },
  loginInner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: nativeTokens.borderRadius.lg,
    backgroundColor: '#3b82f6',
    marginBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoMarkInner: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  logoTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#f1f5f9',
    letterSpacing: 0.5,
  },
  logoLabel: {
    fontSize: 12,
    color: '#64748b',
    letterSpacing: 3,
    marginTop: 4,
  },
  loginForm: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: nativeTokens.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#f1f5f9',
  },
  errorBox: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(127,29,29,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    borderRadius: nativeTokens.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  errorIcon: {
    fontSize: 14,
    color: '#fca5a5',
    lineHeight: 20,
  },
  errorText: {
    flex: 1,
    color: '#fca5a5',
    fontSize: 14,
    lineHeight: 20,
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: '#3b82f6',
    borderRadius: nativeTokens.borderRadius.md,
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonBusy: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  forgotWrap: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    color: '#475569',
    fontSize: 14,
  },

  // ── Scanner camera view ───────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: '#000',
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
    color: '#fff',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scannerHint: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: '#cbd5e1',
    textAlign: 'center',
    paddingHorizontal: 24,
    textShadowColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: nativeTokens.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    maxWidth: 150,
  },
  topBarBtnText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontFamily: 'Cairo_400Regular',
  },
  logoutButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: nativeTokens.borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    minWidth: 88,
    alignItems: 'center',
  },
  logoutText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontFamily: 'Cairo_400Regular',
  },

  // ── Feedback layers (processing + result) ─────────────────────────────────
  feedbackLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000c',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  feedbackIcon: {
    fontSize: 80,
    color: '#fff',
    lineHeight: 88,
  },
  feedbackTitle: {
    fontSize: 28,
    fontFamily: 'Cairo_700Bold',
    color: '#fff',
  },
  feedbackSub: {
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
    color: '#f1f5f9',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  offlineBadge: {
    fontSize: 13,
    color: '#fde68a',
    marginTop: 4,
  },
  overrideButton: {
    marginTop: 8,
    backgroundColor: 'rgba(245,158,11,0.25)',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: nativeTokens.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.6)',
  },
  overrideButtonText: {
    fontSize: 15,
    fontFamily: 'Cairo_600SemiBold',
    color: '#fde68a',
  },
  scanAgainButton: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: nativeTokens.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  scanAgainText: {
    fontSize: 17,
    fontFamily: 'Cairo_600SemiBold',
    color: '#fff',
  },

  // ── Bottom navigation bar ─────────────────────────────────────────────────
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.82)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingBottom: Platform.OS === 'ios' ? 26 : 10,
    paddingTop: 10,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    opacity: 0.4,
  },
  navTabActive: {
    opacity: 1,
  },
  navTabIcon: {
    fontSize: 20,
    color: '#94a3b8',
  },
  navTabIconActive: {
    color: '#3b82f6',
  },
  navTabLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  navTabLabelActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },

  // ── Permission screens ────────────────────────────────────────────────────
  permIcon: {
    width: 72,
    height: 72,
    borderRadius: nativeTokens.borderRadius.lg,
    backgroundColor: 'rgba(59,130,246,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  permIconText: {
    fontSize: 32,
    color: '#3b82f6',
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    textAlign: 'center',
  },
  permSub: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  permButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: nativeTokens.borderRadius.md,
    marginTop: 8,
  },
  permButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

// ─── Decision dialog styles ───────────────────────────────────────────────────

const decision = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(15,23,42,0.93)',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: nativeTokens.borderRadius.full,
    backgroundColor: 'rgba(59,130,246,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(59,130,246,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 36,
    color: '#60a5fa',
    fontWeight: '700',
    lineHeight: 42,
  },
  hint: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: -4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingHorizontal: 32,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: nativeTokens.borderRadius.lg,
    gap: 4,
    borderWidth: 1.5,
  },
  passBtn: {
    backgroundColor: 'rgba(22,163,74,0.2)',
    borderColor: 'rgba(34,197,94,0.6)',
  },
  denyBtn: {
    backgroundColor: 'rgba(220,38,38,0.2)',
    borderColor: 'rgba(239,68,68,0.6)',
  },
  passIcon: {
    fontSize: 28,
    color: '#4ade80',
    lineHeight: 32,
  },
  denyIcon: {
    fontSize: 28,
    color: '#f87171',
    lineHeight: 32,
  },
  btnLabel: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    color: '#f1f5f9',
    letterSpacing: 0.3,
  },
});
