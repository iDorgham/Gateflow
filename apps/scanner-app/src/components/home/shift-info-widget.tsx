import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, MapPin } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { formatElapsedDuration } from '../../lib/duty-timer';
import type { ShiftSession } from '../../lib/shift-session';

export interface ShiftInfoWidgetProps {
  session: ShiftSession | null;
  loading?: boolean;
}

/**
 * Live duty-status card for the Master Scan Home Screen. Ticks its own
 * elapsed-time text every second without touching any shared app state —
 * only this card re-renders on each tick.
 */
export function ShiftInfoWidget({ session, loading }: ShiftInfoWidgetProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session]);

  const onDuty = !!session;
  const elapsed = session
    ? formatElapsedDuration(session.startTime, now)
    : '00:00:00';

  return (
    <View
      style={[styles.card, onDuty ? styles.cardOnDuty : styles.cardOffDuty]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: onDuty
                ? nativeTokens.colors.successSubtle
                : nativeTokens.colors.surfaceOverlay,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: onDuty
                  ? nativeTokens.colors.success
                  : nativeTokens.colors.textSubtlest,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: onDuty
                  ? nativeTokens.colors.success
                  : nativeTokens.colors.textSubtle,
              },
            ]}
          >
            {loading ? 'Checking…' : onDuty ? 'On duty' : 'Off duty'}
          </Text>
        </View>
      </View>

      <View style={styles.timerRow}>
        <Clock
          color={
            onDuty
              ? nativeTokens.colors.primary
              : nativeTokens.colors.textSubtlest
          }
          size={22}
        />
        <Text
          style={[
            styles.timerText,
            {
              color: onDuty
                ? nativeTokens.colors.textHeading
                : nativeTokens.colors.textSubtlest,
            },
          ]}
        >
          {elapsed}
        </Text>
      </View>

      <View style={styles.gateRow}>
        <MapPin color={nativeTokens.colors.textSubtlest} size={14} />
        <Text style={styles.gateText} numberOfLines={1}>
          {onDuty
            ? (session?.gateName ?? 'Assigned gate')
            : 'Start a shift to begin scanning'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: nativeTokens.spacing['space-200'],
    gap: nativeTokens.spacing['space-100'],
    ...nativeTokens.shadows.satinRaised,
  },
  cardOnDuty: {
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderColor: nativeTokens.colors.primarySubtle,
  },
  cardOffDuty: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderColor: nativeTokens.colors.border,
  },
  headerRow: {
    flexDirection: 'row',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: nativeTokens.spacing['space-100'],
  },
  timerText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 32,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  gateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gateText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 13,
    color: nativeTokens.colors.textSubtle,
    flexShrink: 1,
  },
});
