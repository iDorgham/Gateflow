import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';
import { theme } from '../../../../lib/theme';

const { colors, borderRadius, spacing } = theme;

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: object;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  radius = borderRadius.md,
  style,
}: SkeletonLoaderProps) {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

export function QRSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <SkeletonLoader
        width={140}
        height={24}
        style={{ marginBottom: spacing.sm }}
      />
      <SkeletonLoader
        width={90}
        height={14}
        style={{ marginBottom: spacing.xl }}
      />
      <SkeletonLoader
        width={220}
        height={220}
        radius={borderRadius.xl}
        style={{ marginBottom: spacing.xl }}
      />
      <SkeletonLoader width={180} height={36} radius={borderRadius.lg} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardSkeleton: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
