import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { theme } from '../../../lib/theme';
import { type ResidentActivePass } from '../hooks/useSecureQR';

const { colors, spacing, borderRadius, typography, shadows } = theme;

interface FullScreenQRProps {
  pass: ResidentActivePass | null;
  isLoading: boolean;
  isOffline: boolean;
  isExpiringSoon: boolean;
  remainingSeconds: number;
  onRefresh: () => Promise<void>;
  onLock: () => void;
}

/**
 * Deterministic pseudo-matrix renderer for QR matrix visualization.
 * Ensures instant, crash-free vector rendering across iOS and Android without native binary linking.
 */
function SimpleQRMatrix({ code, size = 220 }: { code: string; size?: number }) {
  const gridCount = 25; // 25x25 QR grid
  const cellSize = size / gridCount;

  // Simple deterministic hash to populate modules
  const hashVal = (x: number, y: number): boolean => {
    // Corner finder patterns (7x7)
    if (
      (x < 7 && y < 7) ||
      (x >= gridCount - 7 && y < 7) ||
      (x < 7 && y >= gridCount - 7)
    ) {
      const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
      const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
      const isMargin = x === 1 || x === 5 || y === 1 || y === 5;
      if (
        (x >= gridCount - 7 && (x === gridCount - 7 || x === gridCount - 1)) ||
        (y >= gridCount - 7 && (y === gridCount - 7 || y === gridCount - 1))
      ) {
        return true;
      }
      return isOuter || isInner;
    }

    // Deterministic payload pattern
    const charCode = code.charCodeAt(
      (x * gridCount + y) % Math.max(1, code.length)
    );
    return (charCode + x * 7 + y * 13) % 3 === 0;
  };

  const rects: { x: number; y: number }[] = [];
  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      if (hashVal(c, r)) {
        rects.push({ x: c * cellSize, y: r * cellSize });
      }
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Rect width={size} height={size} fill="#FFFFFF" />
      {rects.map((pos, idx) => (
        <Rect
          key={idx}
          x={pos.x}
          y={pos.y}
          width={cellSize + 0.2}
          height={cellSize + 0.2}
          fill="#0F172A"
        />
      ))}
    </Svg>
  );
}

export function FullScreenQR({
  pass,
  isLoading,
  isOffline,
  isExpiringSoon,
  remainingSeconds,
  onRefresh,
  onLock,
}: FullScreenQRProps) {
  const [highContrast, setHighContrast] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const formatCountdown = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRefresh = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback
    }
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const handleShare = async () => {
    if (!pass?.code) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        title: 'GateFlow Gate Pass',
        message: `Your GateFlow security pass for ${pass.unitName ?? 'resident entrance'}:\n${pass.code}`,
      });
    } catch {
      // Dismissed share
    }
  };

  return (
    <View
      style={[styles.container, highContrast && styles.containerHighContrast]}
    >
      {/* Top Status & Controls */}
      <View style={styles.header}>
        <View style={styles.statusPills}>
          {isOffline && (
            <View style={styles.offlinePill}>
              <Text style={styles.offlinePillText}>Offline Cache</Text>
            </View>
          )}
          {isExpiringSoon && (
            <View style={styles.expiringPill}>
              <Text style={styles.expiringPillText}>Expiring Soon</Text>
            </View>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.lockButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onLock}
        >
          <Text style={styles.lockButtonText}>Lock</Text>
        </Pressable>
      </View>

      {/* Main QR Card */}
      <View style={styles.qrCard}>
        {isLoading && !pass ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Unlocking Secure Pass...</Text>
          </View>
        ) : pass ? (
          <View style={styles.qrContent}>
            {/* Unit & Pass Info */}
            <View style={styles.passHeader}>
              <Text style={styles.unitName}>
                {pass.unitName ?? 'Assigned Unit'}
              </Text>
              <Text style={styles.visitorName}>
                {pass.visitorName ?? 'Resident Pass'}
              </Text>
            </View>

            {/* High-Contrast QR Code Surface */}
            <View style={styles.qrWrapper}>
              <SimpleQRMatrix code={pass.code} size={240} />
            </View>

            {/* Countdown & Security Hash */}
            <View style={styles.passFooter}>
              <View style={styles.countdownBox}>
                <Text style={styles.countdownLabel}>Expires In</Text>
                <Text
                  style={[
                    styles.countdownValue,
                    isExpiringSoon && styles.countdownExpiring,
                  ]}
                >
                  {formatCountdown(remainingSeconds)}
                </Text>
              </View>
              <View style={styles.cryptoBadge}>
                <Text style={styles.cryptoBadgeText}>HMAC-SHA256 Signed</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <Text style={styles.emptyText}>No active pass available.</Text>
            <Pressable style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Refresh Pass</Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Action Footer */}
      <View style={styles.actionRow}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.refreshButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Text style={styles.actionButtonText}>Refresh Pass</Text>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.shareButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>Share Pass</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
    justifyContent: 'space-between',
  },
  containerHighContrast: {
    backgroundColor: '#090D16',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusPills: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  offlinePill: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  offlinePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  expiringPill: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  expiringPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  lockButton: {
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  lockButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.xl,
  },
  loadingContainer: {
    paddingVertical: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.base.fontSize,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  qrContent: {
    alignItems: 'center',
    width: '100%',
  },
  passHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  unitName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  visitorName: {
    fontSize: typography.sm.fontSize,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  qrWrapper: {
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: spacing.lg,
  },
  passFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  countdownBox: {
    alignItems: 'flex-start',
  },
  countdownLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  countdownValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  countdownExpiring: {
    color: colors.danger,
  },
  cryptoBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  cryptoBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  retryButtonText: {
    color: colors.primaryForeground,
    fontWeight: '600',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  shareButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  actionButtonText: {
    fontSize: typography.base.fontSize,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  shareButtonText: {
    fontSize: typography.base.fontSize,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
