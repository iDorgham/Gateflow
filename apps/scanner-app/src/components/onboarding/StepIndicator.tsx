import React from 'react';
import { StyleSheet, View } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

type Props = {
  total: number;
  current: number;
};

export function StepIndicator({ total, current }: Props) {
  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: total }, (_, index) => {
        const active = index <= current;
        return (
          <View
            key={index}
            style={[styles.dot, active ? styles.dotActive : styles.dotIdle]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: nativeTokens.spacing['space-100'],
    marginBottom: nativeTokens.spacing['space-300'],
  },
  dot: {
    width: nativeTokens.spacing['space-200'],
    height: nativeTokens.spacing['space-050'],
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: nativeTokens.colors.primary,
  },
  dotIdle: {
    backgroundColor: nativeTokens.colors.border,
  },
});
