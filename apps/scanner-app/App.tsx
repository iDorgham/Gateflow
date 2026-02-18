import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import {
  useForegroundPermissions,
  getLastKnownPositionAsync,
} from 'expo-location';
import { verifyScanQR } from './src/lib/qr-verify';
import { validateOnServer, type ScanResult, type LocationContext } from './src/lib/scanner';

/** Shared HMAC secret provisioned via .env: EXPO_PUBLIC_QR_SECRET=<32+ chars> */
const QR_SECRET = process.env.EXPO_PUBLIC_QR_SECRET ?? '';

/** Minimum ms between accepted scans — prevents double-firing on the same QR. */
const SCAN_COOLDOWN_MS = 2_500;

/** How long (ms) to auto-dismiss the result overlay if the user doesn't tap "Scan Again". */
const RESULT_DISPLAY_MS = 3_000;

// ─── UI state machine ─────────────────────────────────────────────────────────

type UIPhase =
  | { phase: 'scanning' }
  | { phase: 'processing' }
  | { phase: 'result'; result: ScanResult };

// ─── Root component ───────────────────────────────────────────────────────────

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPerm, requestLocationPerm] = useForegroundPermissions();
  const [ui, setUi] = useState<UIPhase>({ phase: 'scanning' });
  const lastScanAt = useRef<number>(0);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Once camera is granted, silently request location in the background.
  // Location is best-effort and never blocks the camera UX.
  useEffect(() => {
    if (permission?.granted) {
      requestLocationPerm().catch(() => {});
    }
    // requestLocationPerm is stable; permission.granted is the only trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission?.granted]);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const clearResultTimer = () => {
    if (resultTimer.current !== null) {
      clearTimeout(resultTimer.current);
      resultTimer.current = null;
    }
  };

  const showResult = (result: ScanResult) => {
    clearResultTimer();
    setUi({ phase: 'result', result });
    resultTimer.current = setTimeout(() => {
      setUi({ phase: 'scanning' });
      resultTimer.current = null;
    }, RESULT_DISPLAY_MS);
  };

  const handleScanAgain = () => {
    clearResultTimer();
    setUi({ phase: 'scanning' });
  };

  // ── Scan handler ─────────────────────────────────────────────────────────────

  const onBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    const now = Date.now();
    if (ui.phase !== 'scanning') return;
    if (now - lastScanAt.current < SCAN_COOLDOWN_MS) return;
    lastScanAt.current = now;

    setUi({ phase: 'processing' });

    // Step 1 — Local verification: signature, expiry, nonce replay
    const local = await verifyScanQR(data, QR_SECRET);

    if (!local.valid) {
      showResult({
        status: 'rejected',
        reason: local.reason,
        message: local.details ?? localRejectMessage(local.reason),
        offline: false,
      });
      return;
    }

    // Step 2 — Best-effort location snapshot (non-blocking, never throws)
    let location: LocationContext | undefined;
    if (locationPerm?.granted) {
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
        // Location unavailable — proceed without it
      }
    }

    // Step 3 — Server validation with offline fallback
    const result = await validateOnServer(data, local.payload, location);
    showResult(result);
  };

  // ── Permission: loading ──────────────────────────────────────────────────────

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // ── Permission: denied ───────────────────────────────────────────────────────

  if (!permission.granted) {
    return (
      <View style={styles.center}>
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

  // ── Main scanner UI ──────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      {/* Live camera feed — scanner disabled while processing/showing result */}
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={ui.phase === 'scanning' ? onBarcodeScanned : undefined}
      />

      {/* Viewfinder frame + labels (pass-through touch) */}
      <View style={styles.overlay} pointerEvents="none">
        <Text style={styles.header}>GateFlow Scanner</Text>
        <View style={styles.viewfinder} />
        <Text style={styles.hint}>Align QR code within the frame</Text>
      </View>

      {/* Processing spinner */}
      {ui.phase === 'processing' && (
        <View style={styles.feedbackLayer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.feedbackTitle}>Verifying…</Text>
        </View>
      )}

      {/* Result feedback */}
      {ui.phase === 'result' && (
        <ResultOverlay result={ui.result} onScanAgain={handleScanAgain} />
      )}
    </View>
  );
}

// ─── Result overlay ───────────────────────────────────────────────────────────

function ResultOverlay({
  result,
  onScanAgain,
}: {
  result: ScanResult;
  onScanAgain: () => void;
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');
const FRAME_SIZE = width * 0.65;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Permission screens
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 32,
    gap: 16,
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
  },
  permButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 13,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  permButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Viewfinder
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 56,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  viewfinder: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 3,
    borderColor: '#3b82f6',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  hint: {
    fontSize: 14,
    color: '#cbd5e1',
  },

  // Feedback overlay (processing + result)
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
    fontWeight: '700',
    color: '#fff',
  },
  feedbackSub: {
    fontSize: 16,
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

  // "Scan Again" button inside result overlay
  scanAgainButton: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  scanAgainText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
