import { useEffect, useState, lazy, Suspense } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { useForegroundPermissions } from 'expo-location';
import * as Haptics from 'expo-haptics';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { MaintenanceReportModal } from '../../components/MaintenanceReportModal';
import { useShiftSession } from '../../hooks/use-shift-session';
import { useScannerLogic } from '../../hooks/use-scanner-logic';
import {
  loadSelectedGate,
  saveSelectedGate,
  type SelectedGate,
} from '../../components/GateSelector';
import { getPreferences } from '../../lib/preferences';
import { ScanLine } from 'lucide-react-native';
import { haptic } from '../../lib/haptics';
import { CameraScannerView } from '../../components/views/camera-scanner-view';
import {
  ScannerTabBar,
  type ScannerTabKey,
} from '../../components/views/scanner-tab-bar';
import { ScannerTopBar } from '../../components/views/scanner-top-bar';
import type { SupportedLocale } from '../../lib/i18n';

const HomeScreen = lazy(() =>
  import('../main/home-screen').then((m) => ({ default: m.HomeScreen }))
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

function TabFallback() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.center,
        { backgroundColor: nativeTokens.colors.background },
      ]}
    >
      <ActivityIndicator size="large" color={nativeTokens.colors.primary} />
    </View>
  );
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

  const [selectedGate, setSelectedGate] = useState<SelectedGate | null>(null);
  const [showGateSelector, setShowGateSelector] = useState(false);
  const [showQueueStatus, setShowQueueStatus] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ScannerTabKey>('home');
  const [locale, setLocale] = useState<SupportedLocale>('en');

  const {
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
  } = useScannerLogic({
    selectedGate,
    canScan,
    shiftLogId: shiftSession?.shiftLogId,
    clearLocalShift,
    onGateSelectorNeeded: () => setShowGateSelector(true),
    locationPermGranted: locationPerm?.granted ?? false,
  });

  useEffect(() => {
    loadSelectedGate().then((g) => {
      if (g) setSelectedGate(g);
    });
    getPreferences()
      .then((p) => {
        if (p.locale) setLocale(p.locale);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (permission?.granted) {
      requestLocationPerm().catch(() => {});
    }
  }, [permission?.granted, requestLocationPerm]);

  const handleLogout = async () => {
    if (isLoggingOut || shiftBusy) return;
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleGateSelect = (gate: SelectedGate | null) => {
    setSelectedGate(gate);
    saveSelectedGate(gate);
  };

  const openOverride = () => {
    handleRequestOverride();
    setShowOverride(true);
  };

  const onOverrideGranted = (supervisorAuth: boolean, reason: string) => {
    setShowOverride(false);
    handleOverrideGranted(supervisorAuth, reason);
  };

  const onOverrideCancel = () => {
    setShowOverride(false);
    handleOverrideCancel();
  };

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
          <ScanLine
            size={36}
            strokeWidth={1.5}
            color={nativeTokens.colors.primary}
          />
        </View>
        <Text style={styles.permTitle}>Camera Access Required</Text>
        <Text style={styles.permSub}>
          GateFlow needs your camera to scan QR codes.
        </Text>
        <Pressable
          style={styles.permButton}
          onPress={requestPermission}
          accessibilityRole="button"
          accessibilityLabel="Grant camera permission"
        >
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {activeTab === 'home' && (
        <Suspense fallback={<TabFallback />}>
          <HomeScreen
            shift={shift}
            onStartScanning={() => setActiveTab('scanner')}
          />
        </Suspense>
      )}

      {activeTab === 'scanner' && (
        <>
          <CameraScannerView
            canScan={canScan(selectedGate?.id)}
            uiPhase={ui}
            selectedGate={selectedGate}
            onBarcodeScanned={onBarcodeScanned}
            onPass={handleDecisionPass}
            onDeny={handleDecisionDeny}
            onScanAgain={handleScanAgain}
            onRequestOverride={
              ui.phase === 'result' &&
              ui.result.status === 'rejected' &&
              !ui.result.offline &&
              ui.result.reason !== 'no_active_shift'
                ? openOverride
                : undefined
            }
            onReportIssue={() => setShowMaintenanceModal(true)}
            onIdCaptured={setDecisionPhase}
            locale={locale}
          />

          <ScannerTopBar
            selectedGate={selectedGate}
            onOpenGateSelector={() => setShowGateSelector(true)}
            shiftLoading={shiftLoading}
            shiftBusy={shiftBusy}
            isShiftActive={canScan(selectedGate?.id)}
            onToggleShift={() => {
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
            onOpenQueue={() => setShowQueueStatus(true)}
            shiftError={shiftError}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            locale={locale}
          />
        </>
      )}

      {activeTab === 'log' && (
        <Suspense fallback={<TabFallback />}>
          <LogTab />
        </Suspense>
      )}

      {activeTab === 'today' && (
        <Suspense fallback={<TabFallback />}>
          <TodayVisitsTab />
        </Suspense>
      )}

      {activeTab === 'chat' && (
        <Suspense fallback={<TabFallback />}>
          <ChatTab />
        </Suspense>
      )}

      {activeTab === 'settings' && (
        <Suspense fallback={<TabFallback />}>
          <SettingsTab onLogout={handleLogout} />
        </Suspense>
      )}

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
            onGranted={onOverrideGranted}
            onCancel={onOverrideCancel}
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

      <ScannerTabBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        locale={locale}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: nativeTokens.colors.background,
  },
  root: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
  },
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
