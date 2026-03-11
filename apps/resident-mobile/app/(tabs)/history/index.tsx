import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { residentFetch } from '../../../lib/api';
import { theme } from '../../../lib/theme';
import { getCachedHistory, setCachedHistory, type ResidentHistoryItem } from '../../../lib/history-cache';

const { colors, spacing, borderRadius, shadows, typography } = theme;

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

  useEffect(() => {
    load();
  }, []);

  if (loading && rows.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {fromCache ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Showing cached history (offline or last load)</Text>
        </View>
      ) : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.card}>
            <Text style={styles.emptyText}>No history yet.</Text>
            <Text style={styles.emptySubtext}>Scans of your visitor passes will show up here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.visitorName}
            </Text>
            <Text style={styles.cardMeta}>
              {new Date(item.scannedAt).toLocaleString()} • {item.gateName}
            </Text>
          </View>
        )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.mutedForeground,
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
});

