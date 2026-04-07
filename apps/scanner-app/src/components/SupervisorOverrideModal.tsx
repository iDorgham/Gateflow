import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { KeyRound } from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';

export interface SupervisorOverrideModalProps {
  visible: boolean;
  onOverride: (pin: string) => void;
  onCancel: () => void;
  error?: string;
}

export function SupervisorOverrideModal({
  visible,
  onOverride,
  onCancel,
  error,
}: SupervisorOverrideModalProps) {
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
              placeholderTextColor={nativeTokens.colors.textSubtlest}
              autoFocus
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                pin.length < 4 && styles.buttonDisabled,
              ]}
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
    backgroundColor: nativeTokens.colors.backdropGlass,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
    width: '100%',
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 20,
    color: nativeTokens.colors.textHeading,
  },
  description: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtle,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: nativeTokens.colors.background,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Cairo_700Bold',
    fontSize: 18,
    color: nativeTokens.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  inputError: {
    borderColor: nativeTokens.colors.danger,
    backgroundColor: nativeTokens.colors.dangerSubtle,
  },
  errorText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 12,
    color: nativeTokens.colors.danger,
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: nativeTokens.colors.surfaceRaised,
  },
  cancelButtonText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 16,
    color: nativeTokens.colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: nativeTokens.colors.primary,
  },
  confirmButtonText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 16,
    color: nativeTokens.colors.textInverse,
  },
});
