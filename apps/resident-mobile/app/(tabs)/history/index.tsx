import { View, Text, StyleSheet, FlatList, RefreshControl, Animated } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { router } from 'expo-router';
import { residentFetch } from '../../../lib/api';
import { theme } from '../../../lib/theme';
import { getCachedHistory, setCachedHistory, type ResidentHistoryItem } from '../../../lib/history-cache';

const { colors, spacing, borderRadius, shadows, typography } = theme;

// ─── Status Badge ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  SUCCESS:         { bg: '#d1fae5', text: '#065f46', label: 'Admitted' },
  DENIED:          { bg: '#fee2e2', text: '#991b1b', label: 'Denied' },
  FAILED:          { bg: '#fee2e2', text: '#991b1b', label: 'Failed' },
  EXPIRED:         { bg: '#fef3c7', text: '#92400e', label: 'Expired' },
  MAX_USES_REACHED:{ bg: '#fef3c7', text: '#92400e', label: 'Limit Reached' },
  INACTIVE:        { bg: '#f3f4f6', text: '#6b7280', label: 'Inactive' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_COLORS[status] ?? { bg: '#f3f4f6', text: '#6b7280', label: status };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonMeta} />
    </Animated.View>
  );
}

// ─── Date grouping helpers ────────────────────────────────────────────────────

function toDateLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = today.getTime() - itemDay.getTime();
  if (diff === 0) return 'Today';
  if (diff === 86_400_000) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

type ListRow =
  | { kind: 'header'; date: string; key: string }
  | { kind: 'item'; item: ResidentHistoryItem; key: string };

function buildListRows(rows: ResidentHistoryItem[]): ListRow[] {
  const result: ListRow[] = [];
  let lastDate = '';
  for (const item of rows) {
    const date = toDateLabel(item.scannedAt);
    if (date !== lastDate) {
      result.push({ kind: 'header', date, key: `header-${date}` });
      lastDate = date;
    }
    result.push({ kind: 'item', item, key: item.id });
  }
  return result;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const [rows, setRows] = useState<ResidentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await residentFetch('/resident/history');
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = (await res.json()) as {
        success?: boolean;
        data?: Array<{
          id: string;
          status: string;
          scannedAt: string;
          gateName: string;
          visitorName: string;
        }>;
        message?: string;
      };
      if (!res.ok || !data.success) {
        const cached = await getCachedHistory();
        if (cached?.length) {
          setRows(cached);
          setFromCache(true);
        } else {
          setError(data.message ?? 'Failed to load history');
          setRows([]);
        }
        return;
      }
      const list: ResidentHistoryItem[] = (data.data ?? []).map((r) => ({
        id: r.id,
        status: r.status,
        scannedAt: r.scannedAt,
        gateName: r.gateName,
        visitorName: r.visitorName,
      }));
      setRows(list);
      setFromCache(false);
      await setCachedHistory(list);
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 401) {
        router.replace('/login');
        return;
      }
      const cached = await getCachedHistory();
      if (cached?.length) {
        setRows(cached);
        setFromCache(true);
      } else {
        setError(err.message ?? 'Network error');
        setRows([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const listRows = useMemo(() => buildListRows(rows), [rows]);

  if (loading && rows.length === 0) {
    return (
      <View style={styles.container}>
        {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {fromCache ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Showing cached history (offline)</Text>
        </View>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={listRows}
        keyExtractor={(row) => row.key}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.emptyText}>No history yet.</Text>
            <Text style={styles.emptySubtext}>Scans of your visitor passes will appear here.</Text>
          </View>
        }
        renderItem={({ item: row }) => {
          if (row.kind === 'header') {
            return <Text style={styles.dateHeader}>{row.date}</Text>;
          }
          const { item } = row;
          return (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.visitorName}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.cardMeta}>
                {new Date(item.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {' • '}
                {item.gateName}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing['2xl'],
  },
  banner: {
    backgroundColor: '#fef3c7',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  bannerText: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: '#92400e',
  },
  dateHeader: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.foreground,
    flex: 1,
    marginRight: spacing.sm,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  skeletonTitle: {
    height: 16,
    width: '60%',
    backgroundColor: colors.mutedForeground,
    borderRadius: 4,
    marginBottom: 10,
    opacity: 0.2,
  },
  skeletonMeta: {
    height: 12,
    width: '40%',
    backgroundColor: colors.mutedForeground,
    borderRadius: 4,
    opacity: 0.15,
  },
});
