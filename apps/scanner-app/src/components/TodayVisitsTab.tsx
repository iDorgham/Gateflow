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
  Pressable,
} from 'react-native';
import { getValidAccessToken } from '../lib/auth-client';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';
import { Calendar, Check, Clock, X } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

const TOP_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 20 : 60;

interface ExpectedVisit {
  id: string;
  visitorName: string;
  qrCode: string;
  expectedTime: string;
  gateName: string;
  status: 'pending' | 'used' | 'expired';
  createdAt: string;
}

// Status badge config
const STATUS_CONFIG: Record<
  ExpectedVisit['status'],
  { label: string; bg: string; text: string; Icon: LucideIcon }
> = {
  pending: {
    label: 'Pending',
    bg: nativeTokens.colors.infoSubtle,
    text: nativeTokens.colors.info,
    Icon: Clock,
  },
  used: {
    label: 'Used',
    bg: nativeTokens.colors.successSubtle,
    text: nativeTokens.colors.success,
    Icon: Check,
  },
  expired: {
    label: 'Expired',
    bg: nativeTokens.colors.surfaceSubtle,
    text: nativeTokens.colors.textSubtlest,
    Icon: X,
  },
};

// Time formatting
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayStr = today.toISOString().slice(0, 10);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const dateStr = iso.slice(0, 10);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';
  return d.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// List item
function VisitItem({ item }: { item: ExpectedVisit }) {
  const cfg = STATUS_CONFIG[item.status];

  return (
    <View style={s.item}>
      {/* Status badge */}
      <View style={[s.badge, { backgroundColor: cfg.bg }]}>
        <cfg.Icon size={14} strokeWidth={1.5} color={cfg.text} />
        <Text style={[s.badgeLabel, { color: cfg.text }]}>{cfg.label}</Text>
      </View>

      {/* Details */}
      <View style={s.details}>
        <Text style={s.visitorName} numberOfLines={1}>
          {item.visitorName}
        </Text>
        <Text style={s.gateName} numberOfLines={1}>
          @ {item.gateName}
        </Text>
        <Text style={s.time}>
          {formatDate(item.expectedTime)} • {formatTime(item.expectedTime)}
        </Text>
      </View>

      {/* Action */}
      {item.status === 'pending' && (
        <Pressable style={s.actionButton}>
          <Text style={s.actionText}>View</Text>
        </Pressable>
      )}
    </View>
  );
}

// Empty state
function EmptyState() {
  return (
    <View style={s.center}>
      <Calendar
        size={40}
        color={nativeTokens.colors.textSubtlest}
        strokeWidth={1.5}
      />
      <Text style={s.emptyTitle}>No expected visits today</Text>
      <Text style={s.emptySub}>
        QR codes scheduled for today will appear here. Expected visitor passes
        are synced automatically.
      </Text>
    </View>
  );
}

// Main component
export function TodayVisitsTab() {
  const [visits, setVisits] = useState<ExpectedVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const token = await getValidAccessToken();
      if (!token) {
        setVisits([]);
        return;
      }

      const apiBase =
        process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api';
      const res = await fetch(`${apiBase}/qrcodes/expected-today`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setVisits(data.data || []);
      } else {
        // Keep current visits on error
        setVisits([]);
      }
    } catch {
      // Keep current visits on error
      setVisits([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Today</Text>
        <Text style={s.subtitle}>
          {visits.length > 0
            ? `${visits.filter((v) => v.status === 'pending').length} pending`
            : 'Expected visits'}
        </Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={nativeTokens.colors.info} />
        </View>
      ) : visits.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor={nativeTokens.colors.info}
              colors={[nativeTokens.colors.info]}
            />
          }
          renderItem={({ item }) => <VisitItem item={item} />}
        />
      )}
    </View>
  );
}

// Styles
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
    paddingTop: TOP_OFFSET,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 28,
    color: nativeTokens.colors.textInverse,
  },
  subtitle: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 13,
    color: nativeTokens.colors.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    fontFamily: 'Cairo_700Bold',
    fontSize: 18,
    color: nativeTokens.colors.textSubtle,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtlest,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },

  // List item
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: nativeTokens.colors.border,
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
    fontFamily: 'Cairo_700Bold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  visitorName: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 16,
    color: nativeTokens.colors.textHeading,
  },
  gateName: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 12,
    color: nativeTokens.colors.textSubtle,
  },
  time: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 12,
    color: nativeTokens.colors.textSubtlest,
  },
  actionButton: {
    backgroundColor: nativeTokens.colors.infoSubtle,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: nativeTokens.colors.infoSubtle,
  },
  actionText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 12,
    color: nativeTokens.colors.info,
  },
});
