import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

export type StatTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface StatsGridItemProps {
  icon: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
  value: string | number;
  tone?: StatTone;
  testID?: string;
}

const TONE_COLORS: Record<StatTone, { fg: string; bg: string }> = {
  default: {
    fg: nativeTokens.colors.textHeading,
    bg: nativeTokens.colors.surfaceOverlay,
  },
  success: {
    fg: nativeTokens.colors.success,
    bg: nativeTokens.colors.successSubtle,
  },
  warning: {
    fg: nativeTokens.colors.warning,
    bg: nativeTokens.colors.warningSubtle,
  },
  danger: {
    fg: nativeTokens.colors.danger,
    bg: nativeTokens.colors.dangerSubtle,
  },
  info: {
    fg: nativeTokens.colors.info,
    bg: nativeTokens.colors.infoSubtle,
  },
};

/** A single high-density stat card for the duty home screen's stats grid. */
export function StatsGridItem({
  icon: Icon,
  label,
  value,
  tone = 'default',
  testID,
}: StatsGridItemProps) {
  const { fg, bg } = TONE_COLORS[tone];

  return (
    <View style={styles.card} testID={testID}>
      <View style={[styles.iconWrap, { backgroundColor: bg }]}>
        <Icon color={fg} size={18} />
      </View>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    borderRadius: 16,
    paddingVertical: nativeTokens.spacing['space-200'],
    paddingHorizontal: nativeTokens.spacing['space-150'],
    gap: nativeTokens.spacing['space-100'],
    ...nativeTokens.shadows.satinRaised,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 22,
    color: nativeTokens.colors.textHeading,
  },
  label: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 11,
    color: nativeTokens.colors.textSubtlest,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
