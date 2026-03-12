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
  { label: string; bg: string; text: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    bg: 'rgba(59,130,246,0.18)',
    text: '#60a5fa',
    icon: '⏳',
  },
  used: {
    label: 'Used',
    bg: 'rgba(22,163,74,0.18)',
    text: '#4ade80',
    icon: '✓',
  },
  expired: {
    label: 'Expired',
    bg: 'rgba(100,116,139,0.22)',
    text: '#94a3b8',
    icon: '✗',
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
        <Text style={[s.badgeIcon, { color: cfg.text }]}>{cfg.icon}</Text>
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
      <Text style={s.emptyIcon}>📅</Text>
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
          <ActivityIndicator size="large" color="#3b82f6" />
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
              tintColor="#3b82f6"
              colors={['#3b82f6']}
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
  subtitle: {
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
    paddingBottom: 100,
    paddingTop: 8,
  },

  // List item
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
  visitorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  gateName: {
    fontSize: 12,
    color: '#64748b',
  },
  time: {
    fontSize: 12,
    color: '#475569',
  },
  actionButton: {
    backgroundColor: 'rgba(59,130,246,0.18)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.3)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#60a5fa',
  },
});
