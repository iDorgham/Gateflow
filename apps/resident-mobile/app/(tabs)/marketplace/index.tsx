import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { residentFetch } from '../../../lib/api';
import { theme } from '../../../lib/theme';
import { Ionicons } from '@expo/vector-icons';

type MarketplaceService = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  priceCents: number;
  currency: string;
  durationMins: number | null;
  merchant: { id: string; name: string };
};

const { colors, spacing, borderRadius, shadows, typography } = theme;

function formatPrice(priceCents: number, currency: string): string {
  const amount = priceCents / 100;
  // v0.1 MVP: keep currency as provided (e.g. USD)
  return `${currency} ${amount.toFixed(2)}`;
}

export default function MarketplaceScreen() {
  const isRTL = I18nManager.isRTL;
  const t = useMemo(
    () => (en: string, ar: string) => (isRTL ? ar : en),
    [isRTL]
  );

  const [services, setServices] = useState<MarketplaceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);
      try {
        const res = await residentFetch('/marketplace/services');
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        const json = (await res.json()) as {
          success?: boolean;
          data?: MarketplaceService[];
          message?: string;
        };

        if (!res.ok || !json.success) {
          setError(
            json.message ?? t('Failed to load services', 'فشل في تحميل الخدمات')
          );
          setServices([]);
          return;
        }

        setServices(json.data ?? []);
      } catch (e) {
        const err = e as Error & { status?: number };
        if (err.status === 401) {
          router.replace('/login');
          return;
        }
        setError(err.message ?? t('Network error', 'خطأ في الاتصال'));
        setServices([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [t]
  );

  useEffect(() => {
    load();
  }, [load]);

  const book = async (serviceId: string) => {
    try {
      const res = await residentFetch('/marketplace/book', {
        method: 'POST',
        body: JSON.stringify({ serviceId }),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }

      const json = (await res.json()) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || !json.success) {
        Alert.alert(
          t('Booking failed', 'فشل الحجز'),
          json.message ?? t('Try again', 'حاول مرة أخرى')
        );
        return;
      }

      Alert.alert(
        t('Booked', 'تم الحجز'),
        t('Your request was confirmed.', 'تم تأكيد طلبك.')
      );
    } catch (e) {
      const err = e as Error;
      Alert.alert(
        t('Booking failed', 'فشل الحجز'),
        err.message ?? t('Try again', 'حاول مرة أخرى')
      );
    }
  };

  const emptyState = (
    <View style={styles.card}>
      <Text style={styles.emptyText}>
        {t('No services available', 'لا توجد خدمات متاحة')}
      </Text>
      <Text style={styles.emptySubtext}>
        {t(
          'Check back later for new providers.',
          'تحقق لاحقا من توفر مزودين جدد.'
        )}
      </Text>
    </View>
  );

  if (loading && services.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <FlatList
        data={services}
        keyExtractor={(s) => s.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={emptyState}
        renderItem={({ item }) => (
          <View style={[styles.card, styles.listCard]}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardSubtext} numberOfLines={1}>
                  {item.merchant.name}
                  {item.category ? ` • ${item.category}` : ''}
                </Text>
              </View>
              <View style={styles.pricePill}>
                <Text style={styles.priceText}>
                  {formatPrice(item.priceCents, item.currency)}
                </Text>
              </View>
            </View>

            {item.description ? (
              <Text style={styles.descriptionText} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.bookButton,
                pressed && styles.bookButtonPressed,
              ]}
              onPress={() => book(item.id)}
            >
              <Ionicons
                name="sparkles"
                color={colors.primaryForeground}
                size={18}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.bookButtonText}>{t('Book', 'احجز')}</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.sm,
  },
  listCard: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
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
  },
  pricePill: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.lg,
  },
  priceText: {
    color: colors.primaryForeground,
    fontWeight: '700',
    fontSize: 13,
  },
  descriptionText: {
    color: colors.mutedForeground,
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    marginBottom: spacing.lg,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
  },
  bookButtonPressed: {
    opacity: 0.92,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryForeground,
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
    color: colors.danger,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
});
