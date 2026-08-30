import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../../lib/theme';

const { colors, spacing, borderRadius, typography, shadows } = theme;

interface PinFallbackModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  verifyPin: (pin: string) => Promise<boolean>;
  maxDigits?: number;
}

export function PinFallbackModal({
  visible,
  onSuccess,
  onCancel,
  verifyPin,
  maxDigits = 4,
}: PinFallbackModalProps) {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const handleDigitPress = async (digit: string) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }

    setErrorMsg(null);
    if (pin.length < maxDigits) {
      const nextPin = pin + digit;
      setPin(nextPin);

      if (nextPin.length === maxDigits) {
        setIsVerifying(true);
        const valid = await verifyPin(nextPin);
        setIsVerifying(false);
        if (valid) {
          setPin('');
          onSuccess();
        } else {
          setErrorMsg('Incorrect PIN. Please try again.');
          setPin('');
        }
      }
    }
  };

  const handleDelete = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    setErrorMsg(null);
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg(null);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter Security PIN</Text>
          <Text style={styles.subtitle}>
            Biometric unlock reached attempt limit. Enter your backup PIN to
            access your gate pass.
          </Text>

          {/* PIN Indicators */}
          <View style={styles.pinIndicatorRow}>
            {Array.from({ length: maxDigits }).map((_, idx) => {
              const filled = idx < pin.length;
              return (
                <View
                  key={idx}
                  style={[
                    styles.pinDot,
                    filled && styles.pinDotFilled,
                    errorMsg != null && styles.pinDotError,
                  ]}
                />
              );
            })}
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Numeric Keypad */}
          <View style={styles.keypad}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
            ].map((row, rowIdx) => (
              <View key={rowIdx} style={styles.keypadRow}>
                {row.map((digit) => (
                  <Pressable
                    key={digit}
                    style={({ pressed }) => [
                      styles.keypadButton,
                      pressed && styles.keypadButtonPressed,
                    ]}
                    onPress={() => handleDigitPress(digit)}
                    disabled={isVerifying}
                  >
                    <Text style={styles.keypadButtonText}>{digit}</Text>
                  </Pressable>
                ))}
              </View>
            ))}

            {/* Bottom Row: Clear, 0, Backspace */}
            <View style={styles.keypadRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.keypadButton,
                  styles.keypadAuxButton,
                  pressed && styles.keypadButtonPressed,
                ]}
                onPress={handleClear}
                disabled={isVerifying}
              >
                <Text style={styles.keypadAuxText}>Clear</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.keypadButton,
                  pressed && styles.keypadButtonPressed,
                ]}
                onPress={() => handleDigitPress('0')}
                disabled={isVerifying}
              >
                <Text style={styles.keypadButtonText}>0</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.keypadButton,
                  styles.keypadAuxButton,
                  pressed && styles.keypadButtonPressed,
                ]}
                onPress={handleDelete}
                disabled={isVerifying}
              >
                <Text style={styles.keypadAuxText}>Delete</Text>
              </Pressable>
            </View>
          </View>

          {/* Cancel button */}
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? spacing['3xl'] : spacing.xl,
    alignItems: 'center',
    ...shadows.lg,
  },
  title: {
    fontSize: typography.xl.fontSize,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  pinIndicatorRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pinDotError: {
    borderColor: colors.danger,
    backgroundColor: colors.danger,
  },
  errorText: {
    fontSize: typography.sm.fontSize,
    color: colors.danger,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  keypad: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  keypadButton: {
    flex: 1,
    aspectRatio: 1.3,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  keypadButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.foreground,
  },
  keypadAuxButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  keypadAuxText: {
    fontSize: typography.sm.fontSize,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
  cancelButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontSize: typography.base.fontSize,
    fontWeight: '600',
    color: colors.mutedForeground,
  },
});
