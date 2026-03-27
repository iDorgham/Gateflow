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
} from 'lucide-react-native';
import { nativeTokens } from '@gate-access/ui/tokens';
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

  const categories: { id: Category; label: string; icon: any }[] = [
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
                      active ? '#fff' : nativeTokens.colors.mutedForeground
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
            placeholderTextColor="#475569"
            autoFocus
          />

          <Text style={s.label}>Description (Optional)</Text>
          <TextInput
            style={[s.input, s.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Provide more details if needed..."
            placeholderTextColor="#475569"
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
                <ActivityIndicator size="small" color="#fff" />
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
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
    backgroundColor: 'rgba(245,158,11,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    color: '#f1f5f9',
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
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: '#fff',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  footer: {
    marginTop: 32,
    gap: 12,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#3b82f6',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelBtnText: {
    color: '#64748b',
    fontSize: 15,
  },
});
