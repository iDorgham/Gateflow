import { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { residentFetch } from '../../../lib/api';
import {
  getCachedVisitorsList,
  setCachedVisitorsList,
  type CachedVisitor,
} from '../../../lib/qr-cache';
import { theme } from '../../../lib/theme';

const { colors, spacing, borderRadius, shadows, typography } = theme;

export default function QRsScreen() {
  const [visitors, setVisitors] = useState<CachedVisitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await residentFetch('/resident/visitors');
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = (await res.json()) as {
        success?: boolean;
        data?: CachedVisitor[];
        message?: string;
      };
      if (!res.ok || !data.success) {
        const cached = await getCachedVisitorsList();
        if (cached?.length) {
          setVisitors(cached);
          setFromCache(true);
        } else {
          setError(data.message ?? 'Failed to load visitor passes');
        }
        return;
      }
      const list = data.data ?? [];
      setVisitors(list);
      setFromCache(false);
      await setCachedVisitorsList(list);
    } catch (e) {
      const err = e as Error & { status?: number };
      if (err.status === 401) {
        router.replace('/login');
        return;
      }
      const cached = await getCachedVisitorsList();
      if (cached?.length) {
        setVisitors(cached);
        setFromCache(true);
      } else {
        setError(err?.message ?? 'Network error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const onRefresh = () => fetchList(true);

  const handleDelete = (item: CachedVisitor) => {
    Alert.alert(
      'Delete pass',
      `Delete visitor pass for ${item.visitorName ?? 'this visitor'}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await residentFetch(`/resident/visitors/${item.id}`, { method: 'DELETE' });
              if (res.status === 401) { router.replace('/login'); return; }
              if (res.ok) {
                setVisitors((prev) => prev.filter((v) => v.id !== item.id));
              } else {
                const data = await res.json() as { message?: string };
                Alert.alert('Error', data.message ?? 'Failed to delete pass.');
              }
            } catch {
              Alert.alert('Error', 'Network error. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (loading && visitors.length === 0) {
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
          <Text style={styles.bannerText}>
            Showing cached passes (offline or last load)
          </Text>
        </View>
      ) : null}
      {error != null && visitors.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => fetchList(true)} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={visitors}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.card}>
              <Text style={styles.emptyText}>No visitor passes yet.</Text>
              <Text style={styles.emptySubtext}>
                Tap + to create your first visitor pass.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                styles.listCard,
                pressed && styles.listCardPressed,
              ]}
              onPress={() => router.push(`/visitors/${item.id}`)}
            >
              <View style={styles.cardRow}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.visitorName ??
                      (item.isOpenQR ? 'Open QR' : 'Visitor pass')}
                  </Text>
                  {item.unit?.name ? (
                    <Text style={styles.cardSubtext}>{item.unit.name}</Text>
                  ) : null}
                  <Text style={styles.cardMeta}>
                    {item.isOpenQR ? 'Open' : item.accessRule?.type ?? 'One-time'} •{' '}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}

      {/* FAB — create new visitor pass */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push('/qrs/new')}
        accessibilityLabel="Create visitor pass"
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
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
  listContent: {
    paddingBottom: spacing['2xl'],
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  listCard: {},
  listCardPressed: {
    opacity: 0.9,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: spacing.lg,
  },
  deleteButtonText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    end: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  fabText: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.primaryForeground,
    lineHeight: 32,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: colors.mutedForeground,
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
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: colors.mutedForeground,
  },
  errorText: {
    fontSize: 15,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
});


