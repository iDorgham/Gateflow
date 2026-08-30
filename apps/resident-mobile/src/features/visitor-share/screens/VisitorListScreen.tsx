import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { theme } from '../../../../lib/theme';
import { residentFetch } from '../../../../lib/api';
import { type VisitorInviteRecord } from '../types';
import { VisitorStatusBadge } from '../components/VisitorStatusBadge';
import { ShareSheet } from '../components/ShareSheet';

const { colors, spacing, borderRadius, shadows } = theme;

type FilterTab = 'ALL' | 'ACTIVE' | 'EXPIRED';

export function VisitorListScreen() {
  const [visitors, setVisitors] = useState<VisitorInviteRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('ALL');
  const [selectedInvite, setSelectedInvite] =
    useState<VisitorInviteRecord | null>(null);
  const [shareSheetVisible, setShareSheetVisible] = useState<boolean>(false);

  const fetchVisitors = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await residentFetch('/resident/visitors');
      if (res.ok) {
        const payload = (await res.json()) as {
          success?: boolean;
          data?: any[];
        };
        if (payload.success && Array.isArray(payload.data)) {
          const mapped: VisitorInviteRecord[] = payload.data.map(
            (item: any) => {
              const isExp = item.validUntil
                ? new Date(item.validUntil).getTime() < Date.now()
                : false;
              return {
                id: item.id,
                visitorName: item.visitorName ?? 'Visitor',
                visitorPhone: item.visitorPhone ?? undefined,
                templateType:
                  item.type === 'PERMANENT'
                    ? 'FAMILY'
                    : item.type === 'RECURRING'
                      ? 'DRIVER'
                      : item.type === 'DATERANGE'
                        ? 'CONTRACTOR'
                        : 'DAY_GUEST',
                accessType: item.type ?? 'ONETIME',
                status: isExp ? 'EXPIRED' : (item.status ?? 'SENT'),
                createdAt: item.createdAt ?? new Date().toISOString(),
                validUntil:
                  item.validUntil ??
                  new Date(Date.now() + 86400000).toISOString(),
                qrCode: item.qrCode,
                unit: item.unit,
              };
            }
          );
          setVisitors(mapped);
        }
      }
    } catch (e) {
      console.warn('[VisitorListScreen] Fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const matchesSearch = v.visitorName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (selectedFilter === 'ACTIVE') return v.status !== 'EXPIRED';
      if (selectedFilter === 'EXPIRED') return v.status === 'EXPIRED';
      return true;
    });
  }, [visitors, searchQuery, selectedFilter]);

  const handleShareInvite = (invite: VisitorInviteRecord) => {
    setSelectedInvite(invite);
    setShareSheetVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Search & Filter Header */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search visitors..."
          placeholderTextColor={colors.mutedForeground}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.tabRow}>
          {(['ALL', 'ACTIVE', 'EXPIRED'] as FilterTab[]).map((tab) => {
            const isTabActive = selectedFilter === tab;
            return (
              <Pressable
                key={tab}
                style={[
                  styles.tabButton,
                  isTabActive && styles.tabButtonActive,
                ]}
                onPress={() => setSelectedFilter(tab)}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    isTabActive && styles.tabButtonTextActive,
                  ]}
                >
                  {tab === 'ALL'
                    ? 'All Passes'
                    : tab === 'ACTIVE'
                      ? 'Active'
                      : 'Expired'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Visitor List */}
      {loading && visitors.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredVisitors}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchVisitors(true)}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No visitor passes found</Text>
              <Text style={styles.emptySubtitle}>
                Create an instant visitor pass in 3 taps using the button below.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.visitorName}>{item.visitorName}</Text>
                  <Text style={styles.unitName}>
                    {item.unit?.name ?? 'Assigned Unit'}
                  </Text>
                </View>
                <VisitorStatusBadge status={item.status} />
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.cardMeta}>
                  {item.accessType} •{' '}
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Pressable
                  style={({ pressed }) => [
                    styles.sharePassButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => handleShareInvite(item)}
                >
                  <Text style={styles.sharePassButtonText}>Share</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      {/* Share Sheet Modal */}
      <ShareSheet
        visible={shareSheetVisible}
        invite={selectedInvite}
        onClose={() => setShareSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    height: 44,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  tabButtonTextActive: {
    color: colors.primaryForeground,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  unitName: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  sharePassButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sharePassButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyState: {
    paddingVertical: spacing['3xl'],
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: 'center',
    maxWidth: 280,
  },
  buttonPressed: {
    opacity: 0.8,
  },
});
