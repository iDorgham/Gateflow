/**
 * QueueStatus
 *
 * A modal screen showing the offline scan queue state:
 *   • Pending count (unsynced, retry < MAX_RETRIES)
 *   • Failed count (exceeded retry limit)
 *   • Total items in storage
 *   • Last successful sync timestamp
 *
 * Actions:
 *   • "Sync Now" — triggers syncManager.triggerSync()
 *   • "Clear Failed" — removes max-retry items via scanQueue.clearSynced()
 */

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
import { nativeTokens } from '@gateflow/ui/tokens';

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
                  color={nativeTokens.colors.destructive}
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
                    color={nativeTokens.colors.primaryForeground}
                  />
                ) : (
                  <Text style={s.syncBtnText}>↑ Sync Now</Text>
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
                      color={nativeTokens.colors.destructive}
                    />
                  ) : (
                    <Text style={s.clearBtnText}>
                      ✕ Clear Failed ({stats.failed})
                    </Text>
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
    <View style={[s.statCard, { borderColor: color + '55' }]}>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: nativeTokens.colors.neutral700,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.neutral700,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: nativeTokens.colors.neutral700,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: nativeTokens.colors.primaryForeground,
  },
  doneBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: nativeTokens.colors.neutral700,
    borderRadius: 8,
  },
  doneBtnText: {
    color: nativeTokens.colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  doneBtnDisabled: {
    opacity: 0.4,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 16,
  },
  loadingText: {
    color: nativeTokens.colors.mutedForeground,
    fontSize: 14,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: nativeTokens.colors.neutral700,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: nativeTokens.colors.mutedForeground,
    fontWeight: '500',
  },
  syncTime: {
    fontSize: 13,
    color: nativeTokens.colors.mutedForeground,
    textAlign: 'center',
  },
  syncTimeValue: {
    color: nativeTokens.colors.mutedForeground,
    fontWeight: '500',
  },
  statusBox: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  statusBoxOk: {
    backgroundColor: 'rgba(22,163,74,0.12)',
    borderColor: 'rgba(22,163,74,0.35)',
  },
  statusBoxErr: {
    backgroundColor: 'rgba(127,29,29,0.2)',
    borderColor: 'rgba(239,68,68,0.35)',
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
  },
  statusTextOk: {
    color: nativeTokens.colors.success,
  },
  statusTextErr: {
    color: nativeTokens.colors.destructive,
  },
  syncBtn: {
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  syncBtnText: {
    color: nativeTokens.colors.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  clearBtn: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.45)',
    paddingVertical: 13,
    alignItems: 'center',
  },
  clearBtnText: {
    color: nativeTokens.colors.destructive,
    fontSize: 15,
    fontWeight: '600',
  },
  btnBusy: {
    opacity: 0.5,
  },
  note: {
    fontSize: 12,
    color: nativeTokens.colors.mutedForeground,
    lineHeight: 18,
    textAlign: 'center',
  },
});
