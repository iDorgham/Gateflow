import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ScanLine } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

const FAB_SIZE = 72;

export interface MasterScanFabProps {
  onPress: () => void;
}

/** Primary action on the duty home screen — jumps straight into the camera scanner. */
export function MasterScanFab({ onPress }: MasterScanFabProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Start scanning"
      hitSlop={8}
      style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
    >
      <ScanLine
        color={nativeTokens.colors.textInverse}
        size={30}
        strokeWidth={2.25}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: nativeTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...nativeTokens.shadows.brandGlow,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});
