import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';
import { AlertCircle } from 'lucide-react-native';

export interface PassCancelDialogProps {
  visible: boolean;
  visitorName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PassCancelDialog({
  visible,
  visitorName,
  onConfirm,
  onCancel,
}: PassCancelDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <AlertCircle color={nativeTokens.colors.danger} size={32} />
          </View>
          <Text style={styles.title}>Cancel Visitor Pass?</Text>
          <Text style={styles.message}>
            Are you sure you want to cancel the pass for{' '}
            <Text style={{ fontWeight: 'bold' }}>{visitorName}</Text>? They will
            no longer be able to access the property.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Keep Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>Cancel Pass</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  iconContainer: {
    backgroundColor: nativeTokens.colors.dangerSubtle,
    padding: 16,
    borderRadius: 32,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 20,
    color: nativeTokens.colors.textHeading,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtle,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: nativeTokens.colors.surfaceRaised,
  },
  cancelButtonText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 15,
    color: nativeTokens.colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: nativeTokens.colors.danger,
  },
  confirmButtonText: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 15,
    color: nativeTokens.colors.textInverse,
  },
});
