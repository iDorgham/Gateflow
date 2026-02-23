import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { nativeTokens } from '../../tokens';

export type ScanResult = 'success' | 'denied' | 'invalid';

export interface ScanResultOverlayProps {
  result: ScanResult;
  message: string;
  visitorName?: string;
  visible: boolean;
}

export function ScanResultOverlay({ result, message, visitorName, visible }: ScanResultOverlayProps) {
  const [opacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, opacity]);

  if (!visible && opacity.addListener(() => {}) === undefined) {
    // Note: In a real app we'd unmount after animation completes,
    // but returning null immediately is fine for a simple implementation.
  }

  const config = {
    success: { bg: nativeTokens.colors.success, icon: CheckCircle, title: 'Access Granted' },
    denied: { bg: nativeTokens.colors.danger, icon: XCircle, title: 'Access Denied' },
    invalid: { bg: nativeTokens.colors.warning, icon: AlertTriangle, title: 'Invalid QR' },
  }[result];

  const Icon = config.icon;

  return (
    <Animated.View style={[styles.overlay, { opacity, backgroundColor: config.bg }]} pointerEvents={visible ? 'auto' : 'none'}>
      <View style={styles.content}>
        <Icon size={80} color={nativeTokens.colors.background} strokeWidth={nativeTokens.borderRadius.sm / 2} />
        <Text style={styles.title}>{config.title}</Text>
        {visitorName && <Text style={styles.visitorName}>{visitorName}</Text>}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: nativeTokens.spacing['4xl'],
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: nativeTokens.spacing['3xl'],
    borderRadius: nativeTokens.borderRadius.xl,
    width: '100%',
  },
  title: {
    ...nativeTokens.typography['3xl'],
    color: nativeTokens.colors.background,
    fontWeight: 'bold',
    marginTop: nativeTokens.spacing.lg,
    textAlign: 'center',
  },
  visitorName: {
    ...nativeTokens.typography.xl,
    color: nativeTokens.colors.background,
    fontWeight: '600',
    marginTop: nativeTokens.spacing.sm,
    textAlign: 'center',
    opacity: 0.9,
  },
  message: {
    ...nativeTokens.typography.base,
    color: nativeTokens.colors.background,
    marginTop: nativeTokens.spacing.md,
    textAlign: 'center',
    opacity: 0.9,
  },
});
