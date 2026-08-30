import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { theme } from '../../../../lib/theme';
import { ContactPickerButton } from '../../../../components/ContactPickerButton';
import {
  type VisitorTemplate,
  type VisitorTemplateType,
  type VisitorInviteRecord,
  type AccessType,
} from '../types';
import { VisitorTemplatePicker } from '../components/VisitorTemplatePicker';
import { ShareSheet } from '../components/ShareSheet';
import { useVisitorInvite } from '../hooks/useVisitorInvite';

const { colors, spacing, borderRadius, typography, shadows } = theme;

export function CreateVisitorScreen() {
  const { createInvite, rateLimit, isLoading, error } = useVisitorInvite();

  const [selectedTemplate, setSelectedTemplate] =
    useState<VisitorTemplateType>('DAY_GUEST');
  const [accessType, setAccessType] = useState<AccessType>('ONETIME');
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('');
  const [createdInvite, setCreatedInvite] =
    useState<VisitorInviteRecord | null>(null);
  const [shareSheetVisible, setShareSheetVisible] = useState<boolean>(false);

  const handleTemplateSelect = (tpl: VisitorTemplate) => {
    setSelectedTemplate(tpl.id);
    setAccessType(tpl.defaultAccessType);
  };

  const handleCreateAndShare = async () => {
    const invite = await createInvite({
      visitorName,
      visitorPhone,
      templateType: selectedTemplate,
      accessType,
    });

    if (invite) {
      setCreatedInvite(invite);
      setShareSheetVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Rate limit quota header */}
        <View style={styles.quotaHeader}>
          <Text style={styles.quotaText}>
            Remaining Hourly Quota:{' '}
            <Text style={styles.quotaBold}>
              {rateLimit.remainingQuota}/{rateLimit.totalLimit}
            </Text>
          </Text>
          {rateLimit.isBlocked && (
            <Text style={styles.quotaBlocked}>Rate limit active</Text>
          )}
        </View>

        {/* Step 1: Template Picker */}
        <VisitorTemplatePicker
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleTemplateSelect}
        />

        {/* Step 2: Contact Selection & Name Entry */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Visitor Information</Text>

          <ContactPickerButton
            onContactSelected={(name, phone) => {
              setVisitorName(name);
              setVisitorPhone(phone);
            }}
            onFallback={() => {}}
          />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Visitor Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tarek Mahmoud"
              placeholderTextColor={colors.mutedForeground}
              value={visitorName}
              onChangeText={setVisitorName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number (optional for WhatsApp)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="+20 10 1234 5678"
              placeholderTextColor={colors.mutedForeground}
              value={visitorPhone}
              onChangeText={setVisitorPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {error != null && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Step 3: Action Button */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.buttonPressed,
            (isLoading || rateLimit.isBlocked || !visitorName.trim()) &&
              styles.buttonDisabled,
          ]}
          onPress={handleCreateAndShare}
          disabled={isLoading || rateLimit.isBlocked || !visitorName.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={styles.submitButtonText}>Generate & Share Pass</Text>
          )}
        </Pressable>
      </ScrollView>

      <ShareSheet
        visible={shareSheetVisible}
        invite={createdInvite}
        onClose={() => {
          setShareSheetVisible(false);
          router.replace('/(tabs)/qrs');
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  quotaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quotaText: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  quotaBold: {
    fontWeight: '700',
    color: colors.foreground,
  },
  quotaBlocked: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeading: {
    fontSize: typography.sm.fontSize,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginTop: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.foreground,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  submitButton: {
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    ...shadows.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
