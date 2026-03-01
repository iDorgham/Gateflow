import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users, AlertCircle } from 'lucide-react-native';
import { nativeTokens } from '@gate-access/ui/tokens';

export interface QueueStatusBadgeProps {
  queueSize: number;
}

export function QueueStatusBadge({ queueSize }: QueueStatusBadgeProps) {
  const isHighVolume = queueSize > 15;
  const isCriticalVolume = queueSize > 30;

  const getColors = () => {
    if (isCriticalVolume) return { bg: `${nativeTokens.colors.danger}20`, text: nativeTokens.colors.danger, icon: AlertCircle };
    if (isHighVolume) return { bg: `${nativeTokens.colors.warning}20`, text: nativeTokens.colors.warning, icon: Users };
    return { bg: `${nativeTokens.colors.primary}20`, text: nativeTokens.colors.primary, icon: Users };
  };

  const { bg, text, icon: Icon } = getColors();

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Icon color={text} size={14} />
      <Text style={[styles.text, { color: text }]}>
        {queueSize} in queue
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: nativeTokens.spacing.xs,
    paddingHorizontal: nativeTokens.spacing.md,
    paddingVertical: nativeTokens.spacing.xs,
    borderRadius: nativeTokens.borderRadius.full,
  },
  text: {
    ...nativeTokens.typography.xs,
    fontWeight: 'bold',
  },
});
