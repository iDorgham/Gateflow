import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { nativeTokens } from '../../tokens';
import { AlertCircle } from 'lucide-react-native';

export interface PassCancelDialogProps {
  visible: boolean;
  visitorName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PassCancelDialog({ visible, visitorName, onConfirm, onCancel }: PassCancelDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <AlertCircle color={nativeTokens.colors.danger} size={32} />
          </View>
          <Text style={styles.title}>Cancel Visitor Pass?</Text>
          <Text style={styles.message}>
            Are you sure you want to cancel the pass for <Text style={{fontWeight: 'bold'}}>{visitorName}</Text>? They will no longer be able to access the property.
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Keep Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: nativeTokens.spacing.lg,
  },
  container: {
    backgroundColor: nativeTokens.colors.card,
    borderRadius: nativeTokens.borderRadius.lg,
    padding: nativeTokens.spacing['2xl'],
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    ...nativeTokens.shadows.lg,
  },
  iconContainer: {
    backgroundColor: `${nativeTokens.colors.danger}20`, // 20% opacity hex
    padding: nativeTokens.spacing.md,
    borderRadius: nativeTokens.borderRadius.full,
    marginBottom: nativeTokens.spacing.lg,
  },
  title: {
    ...nativeTokens.typography.xl,
    fontWeight: 'bold',
    color: nativeTokens.colors.foreground,
    marginBottom: nativeTokens.spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...nativeTokens.typography.base,
    color: nativeTokens.colors.neutral,
    textAlign: 'center',
    marginBottom: nativeTokens.spacing['2xl'],
  },
  actions: {
    flexDirection: 'row',
    gap: nativeTokens.spacing.md,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: nativeTokens.spacing.md,
    borderRadius: nativeTokens.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: nativeTokens.colors.danger,
  },
  confirmButtonText: {
    ...nativeTokens.typography.base,
    fontWeight: '600',
    color: nativeTokens.colors.background,
  },
});
