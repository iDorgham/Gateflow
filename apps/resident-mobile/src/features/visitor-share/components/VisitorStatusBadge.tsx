import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../lib/theme';
import { type VisitorInviteStatus } from '../types';

const { borderRadius } = theme;

interface VisitorStatusBadgeProps {
  status: VisitorInviteStatus;
}

export function VisitorStatusBadge({ status }: VisitorStatusBadgeProps) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'SENT':
        return {
          bg: '#EFF6FF',
          border: '#BFDBFE',
          text: '#1D4ED8',
          label: 'Sent',
        };
      case 'OPENED':
        return {
          bg: '#FEF3C7',
          border: '#FDE68A',
          text: '#B45309',
          label: 'Opened',
        };
      case 'USED':
        return {
          bg: '#DCFCE7',
          border: '#BBF7D0',
          text: '#15803D',
          label: 'Used',
        };
      case 'EXPIRED':
      default:
        return {
          bg: '#F1F5F9',
          border: '#E2E8F0',
          text: '#64748B',
          label: 'Expired',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg, borderColor: config.border },
      ]}
    >
      <Text style={[styles.badgeText, { color: config.text }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
