import { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { residentFetch } from '../../lib/api';
import { ContactPickerButton } from '../../components/ContactPickerButton';
import { theme } from '../../lib/theme';

const { colors, spacing, borderRadius, shadows } = theme;

type AccessType = 'ONETIME' | 'DATERANGE' | 'RECURRING' | 'PERMANENT';

const ACCESS_TYPES: { key: AccessType; label: string; description: string }[] = [
  { key: 'ONETIME', label: 'One-time', description: 'Single visit, used once' },
  { key: 'DATERANGE', label: 'Date range', description: 'Multiple visits in a period' },
  { key: 'RECURRING', label: 'Recurring', description: 'Regular visits (e.g. weekly)' },
  { key: 'PERMANENT', label: 'Permanent', description: 'Ongoing access, no expiry' },
];

export default function CreateQRScreen() {
  // Pre-fill params from contact picker
  const params = useLocalSearchParams<{ prefillName?: string; prefillPhone?: string }>();

  const [visitorName, setVisitorName] = useState(params.prefillName ?? '');
  const [visitorPhone, setVisitorPhone] = useState(params.prefillPhone ?? '');
  const [accessType, setAccessType] = useState<AccessType>('ONETIME');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync if navigated back from contact-picker with params
  useEffect(() => {
    if (params.prefillName) setVisitorName(params.prefillName);
    if (params.prefillPhone) setVisitorPhone(params.prefillPhone);
  }, [params.prefillName, params.prefillPhone]);

  const validate = (): string | null => {
    if (!visitorName.trim()) return 'Visitor name is required.';
    if (accessType === 'DATERANGE' && (!startDate || !endDate)) {
      return 'Start and end dates are required for date-range access.';
    }
    if (accessType === 'DATERANGE' && startDate && endDate && startDate > endDate) {
      return 'End date must be after start date.';
    }
    return null;
  };

  const handleCreate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Fetch resident's first unit to get unitId
      const meRes = await residentFetch('/resident/me');
      if (meRes.status === 401) { router.replace('/login'); return; }
      const meData = await meRes.json() as { success?: boolean; data?: { id: string }[] };
      if (!meRes.ok || !meData.success || !meData.data?.length) {
        setError('No unit linked to your account. Contact your property manager.');
        setLoading(false);
        return;
      }
      const unitId = meData.data[0].id;

      const body: Record<string, unknown> = {
        unitId,
        visitorName: visitorName.trim(),
        visitorPhone: visitorPhone.trim() || undefined,
        type: accessType,
        isOpenQR: false,
      };
      if (accessType === 'DATERANGE') {
        body.startDate = startDate;
        body.endDate = endDate;
      }

      const res = await residentFetch('/resident/visitors', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (res.status === 401) { router.replace('/login'); return; }

      const data = await res.json() as { success?: boolean; message?: string; data?: { qrCode?: { code?: string } } };
      if (!res.ok || !data.success) {
        setError(data.message ?? 'Failed to create visitor pass.');
        setLoading(false);
        return;
      }

      // Try to share the QR link via OS share sheet
      const qrCode = data.data?.qrCode?.code;
      const shareMessage = `Your gate pass for ${visitorName.trim()} is ready.\n\n${qrCode ?? ''}`;
      const canShare = await Sharing.isAvailableAsync();

      if (canShare && qrCode) {
        try {
          await Share.share({ message: shareMessage, title: 'Visitor pass' });
        } catch {
          // share dismissed or unavailable — continue
        }
      }

      router.back();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>Visitor details</Text>

        {/* Contact picker — navigates to full picker screen */}
        <ContactPickerButton
          onContactSelected={(name, phone) => {
            setVisitorName(name);
            setVisitorPhone(phone);
          }}
          onFallback={() => {
            // Permission denied — user stays in manual entry mode
          }}
        />

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={visitorName}
            onChangeText={setVisitorName}
            placeholder="e.g. Ahmed Hassan"
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput
            style={styles.input}
            value={visitorPhone}
            onChangeText={setVisitorPhone}
            placeholder="+20 10 0000 0000"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="phone-pad"
            returnKeyType="done"
          />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>Access type</Text>

        <View style={styles.segmentGroup}>
          {ACCESS_TYPES.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.segmentItem, accessType === t.key && styles.segmentItemActive]}
              onPress={() => setAccessType(t.key)}
            >
              <Text style={[styles.segmentLabel, accessType === t.key && styles.segmentLabelActive]}>
                {t.label}
              </Text>
              <Text style={[styles.segmentDesc, accessType === t.key && styles.segmentDescActive]}>
                {t.description}
              </Text>
            </Pressable>
          ))}
        </View>

        {accessType === 'DATERANGE' && (
          <View style={styles.dateRow}>
            <View style={[styles.fieldGroup, { flex: 1, marginEnd: spacing.sm }]}>
              <Text style={styles.label}>Start date *</Text>
              <TextInput
                style={styles.input}
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1, marginStart: spacing.sm }]}>
              <Text style={styles.label}>End date *</Text>
              <TextInput
                style={styles.input}
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
        )}

        {error != null && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed, loading && styles.submitButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} />
          ) : (
            <Text style={styles.submitButtonText}>Create visitor pass</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.mutedForeground,
    marginBottom: spacing.lg,
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.foreground,
    backgroundColor: colors.card,
  },
  segmentGroup: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  segmentItem: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backgroundColor: colors.card,
  },
  segmentItemActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF2ED',
  },
  segmentLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  segmentLabelActive: {
    color: colors.primary,
  },
  segmentDesc: {
    fontSize: 13,
    color: colors.mutedForeground,
  },
  segmentDescActive: {
    color: colors.primary,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
  },
  submitButton: {
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  submitButtonPressed: {
    opacity: 0.9,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
});
