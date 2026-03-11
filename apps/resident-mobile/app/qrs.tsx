import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { residentFetch } from '../lib/api';
import { getCachedVisitorsList, setCachedVisitorsList, type CachedVisitor } from '../lib/qr-cache';

const colors = {
  background: '#f4f4f5',
  surface: '#ffffff',
  foreground: '#18181b',
  muted: '#71717a',
  border: '#e4e4e7',
  accent: '#3b82f6',
};

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
      const data = (await res.json()) as { success?: boolean; data?: CachedVisitor[] };
      if (!res.ok || !data.success) {
        const cached = await getCachedVisitorsList();
        if (cached?.length) {
          setVisitors(cached);
          setFromCache(true);
        } else {
          setError(data && typeof (data as { message?: string }).message === 'string'
            ? (data as { message: string }).message
            : 'Failed to load visitor passes');
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

  if (loading && visitors.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {fromCache ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Showing cached passes (offline or last load)</Text>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.card}>
              <Text style={styles.emptyText}>No visitor passes yet.</Text>
              <Text style={styles.emptySubtext}>Create passes in the resident portal to see them here.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.card, styles.listCard, pressed && styles.listCardPressed]}
              onPress={() => router.push(`/visitors/${item.id}`)}
            >
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.visitorName ?? (item.isOpenQR ? 'Open QR' : 'Visitor pass')}
              </Text>
              {item.unit?.name ? (
                <Text style={styles.cardSubtext}>{item.unit.name}</Text>
              ) : null}
              <Text style={styles.cardMeta}>
                {item.isOpenQR ? 'Open' : 'One-time'} • {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  bannerText: {
    fontSize: 14,
    color: '#92400e',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listCard: {},
  listCardPressed: {
    opacity: 0.9,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.muted,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.muted,
  },
  errorText: {
    fontSize: 15,
    color: '#dc2626',
    marginBottom: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.accent,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
