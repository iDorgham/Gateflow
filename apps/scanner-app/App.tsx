import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { nativeTokensNewEra as nativeTokens } from '../../packages/ui/src/tokens';
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
import { verifyScanQR } from './src/lib/qr-verify';
import {
  validateOnServer,
  type ScanResult,
  type LocationContext,
} from './src/lib/scanner';
import { login, logout, getValidAccessToken } from './src/lib/auth-client';
import { IDCaptureModal } from './src/components/IDCaptureModal';
import { MaintenanceReportModal } from './src/components/MaintenanceReportModal';
import { DeviceUnlockScreen } from './src/components/DeviceUnlockScreen';
import { OnboardingNavigator } from './src/navigators/onboarding-navigator';
import { BiometricGuard } from './src/components/security/biometric-guard';
import { resolveRuntimeQrSecret } from './src/lib/security/qr-secret';
import { hasCompletedOnboarding } from './src/lib/security/onboarding';
import { useShiftSession } from './src/hooks/use-shift-session';
import {
  loadSelectedGate,
  saveSelectedGate,
  type SelectedGate,
} from './src/components/GateSelector';

const HomeScreen = lazy(() =>
  import('./src/screens/main/home-screen').then((m) => ({
    default: m.HomeScreen,
  }))
);
const GateSelector = lazy(() =>
  import('./src/components/GateSelector').then((m) => ({
    default: m.GateSelector,
  }))
);
const QueueStatus = lazy(() =>
  import('./src/components/QueueStatus').then((m) => ({
    default: m.QueueStatus,
  }))
);
const SupervisorOverride = lazy(() =>
  import('./src/components/SupervisorOverride').then((m) => ({
    default: m.SupervisorOverride,
  }))
);
const LogTab = lazy(() =>
  import('./src/components/HistoryTab').then((m) => ({ default: m.LogTab }))
);
const TodayVisitsTab = lazy(() =>
  import('./src/components/TodayVisitsTab').then((m) => ({
    default: m.TodayVisitsTab,
  }))
);
const ChatTab = lazy(() =>
  import('./src/components/ChatTab').then((m) => ({ default: m.ChatTab }))
);
const SettingsTab = lazy(() =>
  import('./src/components/SettingsTab').then((m) => ({
    default: m.SettingsTab,
  }))
);
import { addHistoryEntry } from './src/lib/scan-history';
import { getPreferences } from './src/lib/preferences';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';

const SCAN_COOLDOWN_MS = 2_500;
const RESULT_DISPLAY_MS = 3_000;
const SHORT_URL_RESOLVE_TIMEOUT_MS = 5_000;

// Corner marker dimensions for the viewfinder frame
const CORNER_LEN = 28;
const CORNER_W = 3.5;

// ─── App-level state machine ──────────────────────────────────────────────────

/** Top-level phase of the application. */
type AppPhase =
  'initializing' | 'login' | 'onboarding' | 'unlock' | 'scanner' | 'locked';

async function nextPhaseAfterAuth(): Promise<'onboarding' | 'unlock'> {
  const onboarded = await hasCompletedOnboarding();
  return onboarded ? 'unlock' : 'onboarding';
}

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
  const c = processing
    ? nativeTokens.colors.warning
    : nativeTokens.colors.primary;
  return (
    <View style={{ width: FRAME_SIZE, height: FRAME_SIZE }}>
      {/* Top-left */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
      {/* Top-right */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
      {/* Bottom-left */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
      {/* Bottom-right */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: CORNER_LEN,
          height: CORNER_LEN,
        }}
      >
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: CORNER_LEN,
            height: CORNER_W,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: CORNER_W,
            height: CORNER_LEN,
            backgroundColor: c,
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>('initializing');
  const shift = useShiftSession({
    enabled: appPhase !== 'login' && appPhase !== 'initializing',
  });
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  // On mount: check SecureStore for a valid (or refreshable) token.
  // First-run devices enter onboarding; otherwise the unlock gate.
  useEffect(() => {
    getValidAccessToken()
      .then(async (token) => {
        if (!token) {
          setAppPhase('login');
          return;
        }
        setAppPhase(await nextPhaseAfterAuth());
      })
      .catch(() => setAppPhase('login'));
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleLoginSuccess = async () => {
    setAppPhase(await nextPhaseAfterAuth());
  };

  const handleOnboardingComplete = () => setAppPhase('unlock');

  const handleUnlocked = () => setAppPhase('scanner');

  const handleInactivityLock = useCallback(() => setAppPhase('locked'), []);

  const handleLogout = async () => {
    const mayProceed = await shift.disposeForLogout();
    if (!mayProceed) return;
    await logout();
    setAppPhase('login');
  };

  if (appPhase === 'initializing') {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: nativeTokens.colors.background },
        ]}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={nativeTokens.colors.background}
        />
        <View style={styles.splashLogo}>
          <View
            style={[
              styles.splashInner,
              { borderColor: nativeTokens.colors.primary },
            ]}
          />
        </View>
        <ActivityIndicator
          size="large"
          color={nativeTokens.colors.primary}
          style={{ marginTop: 32 }}
        />
        <Text style={styles.initBrand}>GateFlow</Text>
        <Text style={styles.initSub}>SCANNER</Text>
      </View>
    );
  }

  if (appPhase === 'login') {
    return <LoginScreen onSuccess={handleLoginSuccess} />;
  }

  if (appPhase === 'onboarding') {
    return (
      <OnboardingNavigator
        onComplete={handleOnboardingComplete}
        onLogout={handleLogout}
      />
    );
  }

  if (appPhase === 'unlock' || appPhase === 'locked') {
    return (
      <DeviceUnlockScreen onUnlocked={handleUnlocked} onLogout={handleLogout} />
    );
  }

  return (
    <BiometricGuard enabled onLock={handleInactivityLock}>
      <ScannerScreen onLogout={handleLogout} shift={shift} />
    </BiometricGuard>
  );
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
      <StatusBar
        barStyle="light-content"
        backgroundColor={nativeTokens.colors.background}
      />
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
              onChangeText={(t) => {
                setEmail(t);
                clearError();
              }}
              placeholder="operator@company.com"
              placeholderTextColor={nativeTokens.colors.textSubtlest}
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
              onChangeText={(t) => {
                setPassword(t);
                clearError();
              }}
              placeholder="••••••••"
              placeholderTextColor={nativeTokens.colors.textSubtlest}
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
                <ActivityIndicator
                  size="small"
                  color={nativeTokens.colors.textInverse}
                />
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

function ScannerScreen({
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
            <View style={styles.feedbackLayer}>
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.textInverse}
              />
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
        <Text
          style={[
            styles.feedbackSub,
            { color: nativeTokens.colors.textPrimary },
          ]}
        >
          {result.message}
        </Text>
      )}

      <Text style={decision.hint}>
        QR code verified — operator decision required
      </Text>

      {/* Action buttons */}
      <View style={decision.buttonRow}>
        <Pressable
          style={[decision.btn, decision.passBtn]}
          onPress={onPass}
          android_ripple={{ color: nativeTokens.colors.primarySubtle }}
        >
          <Text style={decision.passIcon}>✓</Text>
          <Text style={decision.btnLabel}>Pass</Text>
        </Pressable>

        <Pressable
          style={[decision.btn, decision.denyBtn]}
          onPress={onDeny}
          android_ripple={{ color: nativeTokens.colors.surfaceGlass }}
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
  onReportIssue,
}: {
  result: ScanResult;
  onScanAgain: () => void;
  /** Defined only for non-offline rejections */
  onRequestOverride?: () => void;
  onReportIssue?: () => void;
}) {
  const ok = result.status === 'accepted';
  return (
    <View
      style={[
        styles.feedbackLayer,
        {
          backgroundColor: ok
            ? nativeTokens.colors.success
            : nativeTokens.colors.danger,
        },
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

      {/* Report Issue button */}
      <Pressable style={styles.maintenanceButton} onPress={onReportIssue}>
        <Text style={styles.maintenanceButtonText}>⚐ Report Issue</Text>
      </Pressable>

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
  } catch {
    /* simulators don't support haptics */
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  splashLogo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    ...nativeTokens.shadows.satinRaised,
  },
  splashInner: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: nativeTokens.colors.primary,
  },
  initBrand: {
    marginTop: 24,
    fontSize: 32,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    letterSpacing: nativeTokens.typography.headerTracking,
    textTransform: 'uppercase',
  },
  initSub: {
    fontSize: 12,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtlest,
    letterSpacing: 4,
    marginTop: 4,
  },

  // ── Login styles ──────────────────────────────────────────────────────────
  loginRoot: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
  },
  loginKAV: {
    flex: 1,
  },
  loginInner: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...nativeTokens.shadows.satinRaised,
  },
  logoMarkInner: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: nativeTokens.colors.primary,
  },
  logoTitle: {
    fontSize: 30,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    letterSpacing: nativeTokens.typography.headerTracking,
    textTransform: 'uppercase',
  },
  logoLabel: {
    fontSize: 12,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtlest,
    letterSpacing: 3,
    marginTop: 4,
  },
  loginForm: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtle,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fieldInput: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textHeading,
  },
  errorBox: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: nativeTokens.colors.primarySubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  errorIcon: {
    fontSize: 14,
    color: nativeTokens.colors.danger,
    lineHeight: 20,
  },
  errorText: {
    flex: 1,
    color: nativeTokens.colors.danger,
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    lineHeight: 20,
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...nativeTokens.shadows.brandGlow,
  },
  loginButtonBusy: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: nativeTokens.colors.textInverse,
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forgotWrap: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    color: nativeTokens.colors.textSubtlest,
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
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

  // ── Feedback layers (processing + result) ─────────────────────────────────
  feedbackLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  feedbackIcon: {
    fontSize: 80,
    color: nativeTokens.colors.textHeading,
    lineHeight: 88,
  },
  feedbackTitle: {
    fontSize: 28,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    textTransform: 'uppercase',
    letterSpacing: nativeTokens.typography.headerTracking,
  },
  feedbackSub: {
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  offlineBadge: {
    fontSize: 13,
    color: nativeTokens.colors.warning,
    fontFamily: 'Cairo_600SemiBold',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  overrideButton: {
    marginTop: 12,
    backgroundColor: nativeTokens.colors.warningSubtle,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: nativeTokens.colors.warning,
  },
  overrideButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scanAgainButton: {
    marginTop: 12,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: nativeTokens.colors.borderBold,
  },
  scanAgainText: {
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  maintenanceButton: {
    marginTop: 8,
    backgroundColor: nativeTokens.colors.warningSubtle,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: nativeTokens.colors.warning,
  },
  maintenanceButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.warning,
    textTransform: 'uppercase',
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

// ─── Decision dialog styles ───────────────────────────────────────────────────

const decision = StyleSheet.create({
  backdrop: {
    backgroundColor: nativeTokens.colors.backdropGlass,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderWidth: 3,
    borderColor: nativeTokens.colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...nativeTokens.shadows.satinRaised,
  },
  icon: {
    fontSize: 40,
    color: nativeTokens.colors.primary,
    fontFamily: 'Cairo_700Bold',
    lineHeight: 48,
  },
  hint: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtlest,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 6,
    borderWidth: 2,
  },
  passBtn: {
    backgroundColor: nativeTokens.colors.successSubtle,
    borderColor: nativeTokens.colors.success,
  },
  denyBtn: {
    backgroundColor: nativeTokens.colors.dangerSubtle,
    borderColor: nativeTokens.colors.danger,
  },
  passIcon: {
    fontSize: 32,
    color: nativeTokens.colors.success,
    lineHeight: 36,
  },
  denyIcon: {
    fontSize: 32,
    color: nativeTokens.colors.danger,
    lineHeight: 36,
  },
  btnLabel: {
    fontSize: 15,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
