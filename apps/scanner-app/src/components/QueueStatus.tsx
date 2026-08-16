import { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scanQueue, syncManager } from '../lib/offline-queue';
import { maintenanceQueue } from '../lib/maintenance-queue';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';
import { UploadCloud, X } from 'lucide-react-native';

// ─── Constants ────────────────────────────────────────────────────────────────

const LAST_SYNC_KEY = 'last_sync_at';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QueueStats {
  pendingScans: number;
  pendingReports: number;
  failed: number;
  total: number;
}

export interface QueueStatusProps {
  visible: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function QueueStatus({ visible, onClose }: QueueStatusProps) {
  const [stats, setStats] = useState<QueueStats>({
    pendingScans: 0,
    pendingReports: 0,
    failed: 0,
    total: 0,
  });
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusOk, setStatusOk] = useState(true);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        pendingScans,
        pendingReports,
        failedScans,
        scans,
        reports,
        syncTs,
      ] = await Promise.all([
        scanQueue.getPendingScans(),
        maintenanceQueue.getQueue().then((q) => q.filter((r) => !r.synced)),
        scanQueue.getFailedScans(),
        scanQueue.getQueue(),
        maintenanceQueue.getQueue(),
        AsyncStorage.getItem(LAST_SYNC_KEY),
      ]);

      setStats({
        pendingScans: pendingScans.length,
        pendingReports: pendingReports.length,
        failed: failedScans.length, // Reports don't have explicit "failed" yet in this simple impl
        total: scans.length + reports.length,
      });
      setLastSync(syncTs);
    } catch {
      // Silently ignore — stats stay at last known values
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      setStatusMsg('');
      loadStats();
    }
  }, [visible, loadStats]);

  const handleSync = async () => {
    setStatusMsg('');
    setIsSyncing(true);
    try {
      await Promise.all([
        syncManager.triggerSync(),
        maintenanceQueue.triggerSync(),
      ]);
      const now = new Date().toISOString();
      await AsyncStorage.setItem(LAST_SYNC_KEY, now);
      await loadStats();
      setStatusMsg('Sync completed.');
      setStatusOk(true);
    } catch {
      setStatusMsg('Sync partial or failed. Check connection.');
      setStatusOk(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearFailed = async () => {
    setStatusMsg('');
    setIsClearing(true);
    try {
      // clearSynced() removes all items where synced === true
      // (which includes max-retry-exceeded items)
      await scanQueue.clearSynced();
      await loadStats();
      setStatusMsg('Failed items cleared from queue.');
      setStatusOk(true);
    } catch {
      setStatusMsg('Failed to clear queue.');
      setStatusOk(false);
    } finally {
      setIsClearing(false);
    }
  };

  const busy = isSyncing || isClearing;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Offline Queue</Text>
            <Pressable onPress={onClose} style={s.doneBtn} disabled={busy}>
              <Text style={[s.doneBtnText, busy && s.doneBtnDisabled]}>
                Done
              </Text>
            </Pressable>
          </View>

          {isLoading ? (
            <View style={s.loadingWrap}>
              <ActivityIndicator
                size="large"
                color={nativeTokens.colors.primary}
              />
              <Text style={s.loadingText}>Loading queue…</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={s.body}
              showsVerticalScrollIndicator={false}
            >
              {/* Stats */}
              <View style={s.statsRow}>
                <StatCard
                  label="Scans"
                  value={stats.pendingScans}
                  color={nativeTokens.colors.primary}
                />
                <StatCard
                  label="Reports"
                  value={stats.pendingReports}
                  color={nativeTokens.colors.warning}
                />
                <StatCard
                  label="Failed"
                  value={stats.failed}
                  color={nativeTokens.colors.danger}
                />
              </View>

              {/* Last sync */}
              <Text style={s.syncTime}>
                Last sync:{' '}
                <Text style={s.syncTimeValue}>{formatDate(lastSync)}</Text>
              </Text>

              {/* Status message */}
              {!!statusMsg && (
                <View
                  style={[
                    s.statusBox,
                    statusOk ? s.statusBoxOk : s.statusBoxErr,
                  ]}
                >
                  <Text
                    style={[
                      s.statusText,
                      statusOk ? s.statusTextOk : s.statusTextErr,
                    ]}
                  >
                    {statusMsg}
                  </Text>
                </View>
              )}

              {/* Sync button */}
              <Pressable
                style={[s.syncBtn, busy && s.btnBusy]}
                onPress={handleSync}
                disabled={busy}
              >
                {isSyncing ? (
                  <ActivityIndicator
                    size="small"
                    color={nativeTokens.colors.textInverse}
                  />
                ) : (
                  <View style={s.syncBtnInner}>
                    <UploadCloud
                      size={16}
                      strokeWidth={1.5}
                      color={nativeTokens.colors.textInverse}
                    />
                    <Text style={s.syncBtnText}>Sync Now</Text>
                  </View>
                )}
              </Pressable>

              {/* Clear failed button (only shown when there are failed items) */}
              {stats.failed > 0 && (
                <Pressable
                  style={[s.clearBtn, busy && s.btnBusy]}
                  onPress={handleClearFailed}
                  disabled={busy}
                >
                  {isClearing ? (
                    <ActivityIndicator
                      size="small"
                      color={nativeTokens.colors.danger}
                    />
                  ) : (
                    <View style={s.clearBtnInner}>
                      <X
                        size={16}
                        strokeWidth={1.5}
                        color={nativeTokens.colors.danger}
                      />
                      <Text style={s.clearBtnText}>
                        Clear Failed ({stats.failed})
                      </Text>
                    </View>
                  )}
                </Pressable>
              )}

              {/* Info note */}
              <Text style={s.note}>
                Pending scans are automatically synced when a network connection
                is detected. Failed scans have exceeded the retry limit (10
                attempts) and must be cleared manually.
              </Text>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={[s.statCard, { borderColor: color }]}>
      <Text style={[s.statValue, { color }]}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return 'Never';
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = d.toLocaleDateString([], { day: '2-digit', month: 'short' });
  return `${time} · ${date}`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: nativeTokens.colors.backdropGlass,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '90%',
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 20,
    color: nativeTokens.colors.textHeading,
  },
  doneBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderRadius: 8,
  },
  doneBtnText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.primary,
    fontSize: 15,
  },
  doneBtnDisabled: {
    opacity: 0.4,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 64,
    gap: 16,
  },
  loadingText: {
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtle,
    fontSize: 14,
  },
  body: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 32,
  },
  statLabel: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 12,
    color: nativeTokens.colors.textSubtlest,
    textTransform: 'uppercase',
  },
  syncTime: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 13,
    color: nativeTokens.colors.textSubtlest,
    textAlign: 'center',
  },
  syncTimeValue: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtle,
  },
  statusBox: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  statusBoxOk: {
    backgroundColor: nativeTokens.colors.successSubtle,
    borderColor: nativeTokens.colors.success,
  },
  statusBoxErr: {
    backgroundColor: nativeTokens.colors.dangerSubtle,
    borderColor: nativeTokens.colors.danger,
  },
  statusText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
  statusTextOk: {
    color: nativeTokens.colors.success,
  },
  statusTextErr: {
    color: nativeTokens.colors.danger,
  },
  syncBtn: {
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  syncBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncBtnText: {
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textInverse,
    fontSize: 16,
  },
  clearBtn: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nativeTokens.colors.borderBold,
    paddingVertical: 15,
    alignItems: 'center',
  },
  clearBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearBtnText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.danger,
    fontSize: 15,
  },
  btnBusy: {
    opacity: 0.5,
  },
  note: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 12,
    color: nativeTokens.colors.textSubtlest,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
});
