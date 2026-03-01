import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import { KeyRound } from 'lucide-react-native';
import { nativeTokens } from '@gate-access/ui/tokens';

export interface SupervisorOverrideModalProps {
  visible: boolean;
  onOverride: (pin: string) => void;
  onCancel: () => void;
  error?: string;
}

export function SupervisorOverrideModal({ visible, onOverride, onCancel, error }: SupervisorOverrideModalProps) {
  const [pin, setPin] = useState('');

  const handleConfirm = () => {
    onOverride(pin);
    setPin(''); // Reset on submit
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <KeyRound color={nativeTokens.colors.warning} size={24} />
            <Text style={styles.title}>Supervisor Override</Text>
          </View>

          <Text style={styles.description}>
            Enter supervisor PIN to force grant access to this visitor.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={pin}
              onChangeText={setPin}
              secureTextEntry
              keyboardType="number-pad"
              maxLength={6}
              placeholder="Enter PIN"
              placeholderTextColor={nativeTokens.colors.neutral}
              autoFocus
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton, pin.length < 4 && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={pin.length < 4}
            >
              <Text style={styles.confirmButtonText}>Authorize</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: nativeTokens.colors.card,
    borderTopLeftRadius: nativeTokens.borderRadius.xl,
    borderTopRightRadius: nativeTokens.borderRadius.xl,
    padding: nativeTokens.spacing['3xl'],
    paddingBottom: nativeTokens.spacing['4xl'], // Extra padding for safe area
    width: '100%',
    ...nativeTokens.shadows.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: nativeTokens.spacing.md,
    gap: nativeTokens.spacing.sm,
  },
  title: {
    ...nativeTokens.typography.xl,
    fontWeight: 'bold',
    color: nativeTokens.colors.foreground,
  },
  description: {
    ...nativeTokens.typography.sm,
    color: nativeTokens.colors.neutral,
    marginBottom: nativeTokens.spacing.xl,
  },
  inputContainer: {
    marginBottom: nativeTokens.spacing['2xl'],
  },
  input: {
    backgroundColor: nativeTokens.colors.secondary,
    borderRadius: nativeTokens.borderRadius.md,
    padding: nativeTokens.spacing.lg,
    ...nativeTokens.typography.lg,
    color: nativeTokens.colors.foreground,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: nativeTokens.colors.danger,
    backgroundColor: `${nativeTokens.colors.danger}10`,
  },
  errorText: {
    ...nativeTokens.typography.xs,
    color: nativeTokens.colors.danger,
    marginTop: nativeTokens.spacing.sm,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: nativeTokens.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: nativeTokens.spacing.lg,
    borderRadius: nativeTokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: nativeTokens.colors.secondary,
  },
  cancelButtonText: {
    ...nativeTokens.typography.base,
    fontWeight: '600',
    color: nativeTokens.colors.foreground,
  },
  confirmButton: {
    backgroundColor: nativeTokens.colors.warning,
  },
  confirmButtonText: {
    ...nativeTokens.typography.base,
    fontWeight: '600',
    color: nativeTokens.colors.background,
  },
});
