import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Check, Delete } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

const BACKSPACE = 'back';
const SUBMIT = 'submit';

const PAD: string[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  [BACKSPACE, '0', SUBMIT],
];

type PinDotsProps = {
  filled: number;
  maxLength?: number;
  selected?: boolean;
};

export function PinDots({
  filled,
  maxLength = 6,
  selected = false,
}: PinDotsProps) {
  return (
    <View style={[styles.dotRow, selected && styles.dotRowSelected]}>
      {Array.from({ length: maxLength }).map((_, i) => (
        <View key={i} style={[styles.dot, i < filled && styles.dotFilled]} />
      ))}
    </View>
  );
}

type PinKeypadProps = {
  value: string;
  onChange: (pin: string) => void;
  maxLength?: number;
  disabled?: boolean;
  onSubmit?: () => void;
  submitBusy?: boolean;
  showSubmit?: boolean;
};

export function PinKeypad({
  value,
  onChange,
  maxLength = 6,
  disabled = false,
  onSubmit,
  submitBusy = false,
  showSubmit = true,
}: PinKeypadProps) {
  const appendDigit = (digit: string) => {
    if (value.length >= maxLength) return;
    onChange(value + digit);
  };

  const deleteLast = () => onChange(value.slice(0, -1));

  return (
    <View style={styles.pad}>
      {PAD.map((row, ri) => (
        <View key={ri} style={styles.padRow}>
          {row.map((key) => {
            if (key === SUBMIT && !showSubmit) {
              return <View key={key} style={styles.padKeyGhost} />;
            }
            return (
              <Pressable
                key={key}
                style={({ pressed }) => [
                  styles.padKey,
                  key === SUBMIT && styles.padConfirm,
                  pressed && styles.padKeyPressed,
                ]}
                onPress={() => {
                  if (key === BACKSPACE) deleteLast();
                  else if (key === SUBMIT) onSubmit?.();
                  else appendDigit(key);
                }}
                disabled={disabled || submitBusy}
                accessibilityLabel={
                  key === BACKSPACE
                    ? 'Delete'
                    : key === SUBMIT
                      ? 'Submit PIN'
                      : key
                }
              >
                {key === SUBMIT && submitBusy ? (
                  <ActivityIndicator
                    size="small"
                    color={nativeTokens.colors.textInverse}
                  />
                ) : key === BACKSPACE ? (
                  <Delete
                    size={22}
                    strokeWidth={1.5}
                    color={nativeTokens.colors.textHeading}
                  />
                ) : key === SUBMIT ? (
                  <Check
                    size={22}
                    strokeWidth={1.5}
                    color={nativeTokens.colors.textInverse}
                  />
                ) : (
                  <Text style={styles.padKeyText}>{key}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dotRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  dotRowSelected: {
    backgroundColor: nativeTokens.colors.primarySubtle,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: nativeTokens.colors.borderBold,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: nativeTokens.colors.primary,
    borderColor: nativeTokens.colors.primary,
  },
  pad: {
    gap: 10,
  },
  padRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  padKey: {
    width: 72,
    height: 52,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padKeyGhost: {
    width: 72,
    height: 52,
  },
  padConfirm: {
    backgroundColor: nativeTokens.colors.primary,
    borderColor: nativeTokens.colors.primary,
  },
  padKeyPressed: {
    opacity: 0.4,
  },
  padKeyText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 22,
    color: nativeTokens.colors.textHeading,
  },
  padConfirmText: {
    color: nativeTokens.colors.textInverse,
  },
});
