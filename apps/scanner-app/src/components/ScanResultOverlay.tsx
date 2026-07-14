import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';

export type ScanResult = 'success' | 'denied' | 'invalid';

export interface ScanResultOverlayProps {
  result: ScanResult;
  message: string;
  visitorName?: string;
  visible: boolean;
}

export function ScanResultOverlay({
  result,
  message,
  visitorName,
  visible,
}: ScanResultOverlayProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: visible ? 300 : 250,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  const config = {
    success: {
      bg: nativeTokens.colors.success,
      icon: CheckCircle,
      title: 'Access Granted',
    },
    denied: {
      bg: nativeTokens.colors.danger,
      icon: XCircle,
      title: 'Access Denied',
    },
    invalid: {
      bg: nativeTokens.colors.warning,
      icon: AlertTriangle,
      title: 'Invalid QR',
    },
  }[result];

  const Icon = config.icon;

  return (
    <Animated.View
      style={[styles.overlay, { opacity, backgroundColor: config.bg }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.content}>
        <Icon
          size={80}
          color={nativeTokens.colors.textInverse}
          strokeWidth={3}
        />
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
    padding: nativeTokens.spacing['space-400'],
  },
  content: {
    alignItems: 'center',
    backgroundColor: nativeTokens.colors.surfaceGlass,
    padding: nativeTokens.spacing['space-300'],
    borderRadius: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: nativeTokens.colors.borderGlass,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 32,
    color: nativeTokens.colors.textInverse,
    marginTop: nativeTokens.spacing['space-200'],
    textAlign: 'center',
    letterSpacing: nativeTokens.typography.headerTracking,
  },
  visitorName: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 20,
    color: nativeTokens.colors.textInverse,
    marginTop: nativeTokens.spacing['space-100'],
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    color: nativeTokens.colors.textInverse,
    marginTop: nativeTokens.spacing['space-150'],
    textAlign: 'center',
    opacity: 0.9,
  },
});
