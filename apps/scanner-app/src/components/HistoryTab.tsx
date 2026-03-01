import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getHistory, type HistoryEntry, type ScanOutcome } from '../lib/scan-history';

const TOP_OFFSET = Platform.OS === 'android'
  ? (StatusBar.currentHeight ?? 24) + 20
  : 60;

// ─── Outcome badge config ─────────────────────────────────────────────────────

const OUTCOME_CONFIG: Record<
  ScanOutcome,
  { label: string; bg: string; text: string; icon: string }
> = {
  pass:     { label: 'Pass',     bg: 'rgba(22,163,74,0.18)',   text: '#4ade80', icon: '✓' },
  deny:     { label: 'Deny',     bg: 'rgba(220,38,38,0.18)',   text: '#f87171', icon: '✗' },
  offline:  { label: 'Offline',  bg: 'rgba(245,158,11,0.18)', text: '#fbbf24', icon: '⚡' },
  rejected: { label: 'Rejected', bg: 'rgba(100,116,139,0.22)', text: '#94a3b8', icon: '✗' },
};

// ─── Date grouping helpers ────────────────────────────────────────────────────

function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

function dayLabel(key: string): string {
  const d = new Date(key + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (dayKey(today.toISOString()) === key) return 'Today';
  if (dayKey(yesterday.toISOString()) === key) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

// ─── List item ────────────────────────────────────────────────────────────────

function HistoryItem({ item }: { item: HistoryEntry }) {
  const cfg = OUTCOME_CONFIG[item.outcome];
  const time = new Date(item.scannedAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={s.item}>
      {/* Outcome badge */}
      <View style={[s.badge, { backgroundColor: cfg.bg }]}>
        <Text style={[s.badgeIcon, { color: cfg.text }]}>{cfg.icon}</Text>
        <Text style={[s.badgeLabel, { color: cfg.text }]}>{cfg.label}</Text>
      </View>

      {/* Details */}
      <View style={s.details}>
        <Text style={s.qrText} numberOfLines={1}>
          {item.qrPrefix}
        </Text>
        {item.gateName ? (
          <Text style={s.gateName} numberOfLines={1}>
            @ {item.gateName}
          </Text>
        ) : null}
        {item.message ? (
          <Text style={s.message} numberOfLines={1}>
            {item.message}
          </Text>
        ) : null}
      </View>

      {/* Time */}
      <Text style={s.time}>{time}</Text>
    </View>
  );
}

// ─── Day header ───────────────────────────────────────────────────────────────

function DayHeader({ label }: { label: string }) {
  return (
    <View style={s.dayHeader}>
      <Text style={s.dayLabel}>{label}</Text>
    </View>
  );
}

// ─── List item types ──────────────────────────────────────────────────────────

type ListRow =
  | { type: 'header'; key: string; label: string }
  | { type: 'item'; key: string; entry: HistoryEntry };

function buildRows(entries: HistoryEntry[]): ListRow[] {
  const rows: ListRow[] = [];
  let lastDay = '';
  for (const entry of entries) {
    const dk = dayKey(entry.scannedAt);
    if (dk !== lastDay) {
      lastDay = dk;
      rows.push({ type: 'header', key: `hdr-${dk}`, label: dayLabel(dk) });
    }
    rows.push({ type: 'item', key: entry.id, entry });
  }
  return rows;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HistoryTab() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const data = await getHistory();
      setEntries(data);
    } catch {
      // keep current entries on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = buildRows(entries);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Scan History</Text>
        {entries.length > 0 && (
          <Text style={s.count}>{entries.length} scan{entries.length !== 1 ? 's' : ''}</Text>
        )}
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : entries.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyIcon}>📋</Text>
          <Text style={s.emptyTitle}>No scans yet</Text>
          <Text style={s.emptySub}>
            Your recent scan activity will appear here after you scan QR codes.
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(r) => r.key}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor="#3b82f6"
              colors={['#3b82f6']}
            />
          }
          renderItem={({ item: row }) => {
            if (row.type === 'header') {
              return <DayHeader label={row.label} />;
            }
            return <HistoryItem item={row.entry} />;
          }}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: TOP_OFFSET,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  count: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  listContent: {
    paddingBottom: 100, // room for bottom nav
  },

  // Day header
  dayHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Row item
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#1e293b',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 4,
    minWidth: 82,
    justifyContent: 'center',
  },
  badgeIcon: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  qrText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    color: '#94a3b8',
  },
  gateName: {
    fontSize: 12,
    color: '#64748b',
  },
  message: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
  },
  time: {
    fontSize: 12,
    color: '#475569',
    fontVariant: ['tabular-nums'],
  },
});
