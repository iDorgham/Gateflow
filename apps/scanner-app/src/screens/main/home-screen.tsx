import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Network from 'expo-network';
import { CheckCircle2, UploadCloud, Activity } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { ShiftInfoWidget } from '../../components/home/shift-info-widget';
import { MasterScanFab } from '../../components/home/master-scan-fab';
import {
  StatsGridItem,
  type StatTone,
} from '../../components/common/stats-grid-item';
import { countScansToday, getSystemStatus } from '../../lib/duty-stats';
import { getHistory } from '../../lib/scan-history';
import { scanQueue } from '../../lib/offline-queue';
import type { useShiftSession } from '../../hooks/use-shift-session';

const TOP_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 20 : 60;

const STATUS_TONE: Record<'success' | 'warning' | 'danger', StatTone> = {
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export interface HomeScreenProps {
  shift: ReturnType<typeof useShiftSession>;
  onStartScanning: () => void;
}

/**
 * Duty home dashboard shown after unlock. Presents the active shift, a
 * high-density stats grid, and the Master Scan FAB that jumps into the
 * live camera scanner (owned by `ScannerScreen`, unchanged by this screen).
 */
export function HomeScreen({ shift, onStartScanning }: HomeScreenProps) {
  const [scansToday, setScansToday] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [online, setOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [history, pending, failed, netState] = await Promise.all([
        getHistory(),
        scanQueue.getPendingScans(),
        scanQueue.getFailedScans(),
        Network.getNetworkStateAsync(),
      ]);
      setScansToday(countScansToday(history, Date.now()));
      setPendingCount(pending.length);
      setFailedCount(failed.length);
      setOnline(netState.isConnected ?? false);
    } catch (error) {
      // Preserve last-known stats on failure; avoid resetting to defaults
      console.error('Failed to load stats:', error);
    } finally {
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats, shift.session?.shiftLogId]);

  useEffect(() => {
    const subscription = Network.addNetworkStateListener((state) => {
      setOnline(state.isConnected ?? false);
    });
    return () => subscription.remove();
  }, []);

  const systemStatus = getSystemStatus({ online, failedCount });

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void loadStats(true)}
          tintColor={nativeTokens.colors.primary}
          colors={[nativeTokens.colors.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>GateFlow Scanner</Text>
        <Text style={styles.title}>Duty Home</Text>
      </View>

      <ShiftInfoWidget session={shift.session} loading={shift.loading} />

      <View style={styles.fabRow}>
        <MasterScanFab onPress={onStartScanning} />
        <Text style={styles.fabHint}>Tap to start scanning</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatsGridItem
          icon={CheckCircle2}
          label="Scans today"
          value={scansToday}
          tone="info"
          testID="stat-scans-today"
        />
        <StatsGridItem
          icon={UploadCloud}
          label="Pending sync"
          value={pendingCount}
          tone={pendingCount > 0 ? 'warning' : 'default'}
          testID="stat-pending-sync"
        />
        <StatsGridItem
          icon={Activity}
          label={systemStatus.label}
          value={
            systemStatus.tone === 'success'
              ? 'OK'
              : failedCount > 0
                ? failedCount
                : '—'
          }
          tone={STATUS_TONE[systemStatus.tone]}
          testID="stat-system-status"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
  },
  content: {
    paddingTop: TOP_OFFSET,
    paddingHorizontal: nativeTokens.spacing['space-200'],
    paddingBottom: 140, // room for bottom nav
    gap: nativeTokens.spacing['space-300'],
  },
  header: {
    gap: 2,
  },
  eyebrow: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 12,
    color: nativeTokens.colors.textSubtlest,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 28,
    color: nativeTokens.colors.textHeading,
  },
  fabRow: {
    alignItems: 'center',
    gap: nativeTokens.spacing['space-100'],
    paddingVertical: nativeTokens.spacing['space-100'],
  },
  fabHint: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 12,
    color: nativeTokens.colors.textSubtlest,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: nativeTokens.spacing['space-150'],
  },
});
