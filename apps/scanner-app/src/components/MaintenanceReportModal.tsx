import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  AlertCircle,
  Wrench,
  Building2,
  HelpCircle,
  LucideIcon,
} from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';
import { createMaintenanceRequest } from '../lib/scanner';

export interface MaintenanceReportModalProps {
  visible: boolean;
  gateId: string;
  scanLogId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

type Category = 'HARDWARE' | 'FACILITY' | 'OTHER';

export function MaintenanceReportModal({
  visible,
  gateId,
  scanLogId,
  onClose,
  onSuccess,
}: MaintenanceReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('HARDWARE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please provide a title for the issue.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createMaintenanceRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        gateId,
        scanLogId,
      });

      if (result.success) {
        setTitle('');
        setDescription('');
        setCategory('HARDWARE');
        onSuccess();
      } else {
        setError(result.message ?? 'Failed to submit report.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { id: Category; label: string; icon: LucideIcon }[] = [
    { id: 'HARDWARE', label: 'Hardware', icon: Wrench },
    { id: 'FACILITY', label: 'Facility', icon: Building2 },
    { id: 'OTHER', label: 'Other', icon: HelpCircle },
  ];

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.backdrop}
      >
        <View style={s.sheet}>
          <View style={s.header}>
            <View style={s.headerIcon}>
              <AlertCircle size={24} color={nativeTokens.colors.warning} />
            </View>
            <View>
              <Text style={s.title}>Report Issue</Text>
              <Text style={s.subtitle}>Report a problem at this gate</Text>
            </View>
          </View>

          {!!error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          <Text style={s.label}>Category</Text>
          <View style={s.categoryRow}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[s.categoryBtn, active && s.categoryBtnActive]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Icon
                    size={20}
                    color={
                      active
                        ? nativeTokens.colors.textInverse
                        : nativeTokens.colors.textSubtle
                    }
                  />
                  <Text
                    style={[s.categoryLabel, active && s.categoryLabelActive]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.label}>Issue Title</Text>
          <TextInput
            style={s.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Gate won't open, Scanner blurry"
            placeholderTextColor={nativeTokens.colors.textSubtlest}
            autoFocus
          />

          <Text style={s.label}>Description (Optional)</Text>
          <TextInput
            style={[s.input, s.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Provide more details if needed..."
            placeholderTextColor={nativeTokens.colors.textSubtlest}
            multiline
            numberOfLines={3}
          />

          <View style={s.footer}>
            <Pressable
              style={[s.btn, s.submitBtn, isSubmitting && s.btnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator
                  size="small"
                  color={nativeTokens.colors.textInverse}
                />
              ) : (
                <Text style={s.submitBtnText}>Submit Report</Text>
              )}
            </Pressable>

            <Pressable
              style={[s.btn, s.cancelBtn]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={s.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: nativeTokens.colors.backdropGlass,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 48 : 24,
    borderTopWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: nativeTokens.colors.warningSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 22,
    color: nativeTokens.colors.textHeading,
  },
  subtitle: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtle,
  },
  label: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 13,
    color: nativeTokens.colors.textSubtlest,
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: nativeTokens.colors.background,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    borderRadius: 12,
    padding: 14,
    color: nativeTokens.colors.textPrimary,
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: nativeTokens.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
  },
  categoryBtnActive: {
    backgroundColor: nativeTokens.colors.primary,
    borderColor: nativeTokens.colors.primary,
  },
  categoryLabel: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtle,
    fontSize: 13,
  },
  categoryLabelActive: {
    color: nativeTokens.colors.textInverse,
  },
  errorBox: {
    backgroundColor: nativeTokens.colors.dangerSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.danger,
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    gap: 12,
  },
  btn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: nativeTokens.colors.primary,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textInverse,
    fontSize: 16,
  },
  cancelBtnText: {
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtlest,
    fontSize: 15,
  },
});
