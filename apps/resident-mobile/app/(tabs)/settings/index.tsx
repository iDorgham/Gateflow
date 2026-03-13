import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../../lib/auth-client';
import { residentFetch } from '../../../lib/api';
import { theme } from '../../../lib/theme';

const { colors, spacing, borderRadius, shadows, typography } = theme;

const APP_VERSION = '0.1.0';
const KEY_NOTIFY_SCAN    = 'resident_notify_scan_v1';
const KEY_NOTIFY_ARRIVAL = 'resident_notify_arrival_v1';

export default function SettingsScreen() {
  const [logoutPending, setLogoutPending]     = useState(false);
  const [notifyScan, setNotifyScan]           = useState(true);
  const [notifyArrival, setNotifyArrival]     = useState(true);
  const [prefsSaving, setPrefsSaving]         = useState(false);

  // Load saved prefs on mount
  useEffect(() => {
    AsyncStorage.multiGet([KEY_NOTIFY_SCAN, KEY_NOTIFY_ARRIVAL]).then((pairs) => {
      for (const [key, val] of pairs) {
        if (val === null) continue;
        if (key === KEY_NOTIFY_SCAN)    setNotifyScan(val === 'true');
        if (key === KEY_NOTIFY_ARRIVAL) setNotifyArrival(val === 'true');
      }
    }).catch(() => {});
  }, []);

  const apiBase = useMemo(() => {
    const base = process.env.EXPO_PUBLIC_API_URL;
    return base && base.trim() ? base.trim().replace(/\/$/, '') : 'http://localhost:3001';
  }, []);

  const toggleNotifyScan = async (value: boolean) => {
    setNotifyScan(value);
    await AsyncStorage.setItem(KEY_NOTIFY_SCAN, String(value)).catch(() => {});
    setPrefsSaving(true);
    residentFetch('/resident/push-token', {
      method: 'POST',
      body: JSON.stringify({ notifyScan: value }),
    }).catch(() => {}).finally(() => setPrefsSaving(false));
  };

  const toggleNotifyArrival = async (value: boolean) => {
    setNotifyArrival(value);
    await AsyncStorage.setItem(KEY_NOTIFY_ARRIVAL, String(value)).catch(() => {});
    setPrefsSaving(true);
    residentFetch('/resident/push-token', {
      method: 'POST',
      body: JSON.stringify({ notifyArrival: value }),
    }).catch(() => {}).finally(() => setPrefsSaving(false));
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          setLogoutPending(true);
          await logout();
          setLogoutPending(false);
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <ToggleRow
            label="Visitor scan alerts"
            description="Notify when your visitor's QR is scanned at the gate"
            value={notifyScan}
            onValueChange={toggleNotifyScan}
            disabled={prefsSaving}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Arrival notifications"
            description={"Notify when a visitor taps \"I've arrived\""}
            value={notifyArrival}
            onValueChange={toggleNotifyArrival}
            disabled={prefsSaving}
          />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Status</Text>
          <Text style={styles.rowValue}>Signed in</Text>
        </View>
        <Pressable
          onPress={handleLogout}
          disabled={logoutPending}
          style={({ pressed }) => [
            styles.button,
            styles.buttonDestructive,
            pressed && styles.buttonPressed,
            logoutPending && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </Pressable>
      </View>

      {/* App info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Version</Text>
          <Text style={styles.rowValue}>{APP_VERSION}</Text>
        </View>
      </View>

      {/* Debug */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug</Text>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>API base</Text>
          <Text style={styles.rowValueMono}>{apiBase}</Text>
          <Text style={styles.hint}>Set via EXPO_PUBLIC_API_URL in resident-mobile .env.local</Text>
        </View>
      </View>

    </ScrollView>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  disabled,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled: boolean;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLabelWrap}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#d1d5db', true: colors.primary }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    fontWeight: '700',
    color: colors.mutedForeground,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border ?? '#e5e7eb',
    marginVertical: spacing.lg,
  },
  rowLabel: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  rowValue: {
    fontSize: typography.base.fontSize,
    lineHeight: typography.base.lineHeight,
    fontWeight: '600',
    color: colors.foreground,
  },
  rowValueMono: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Menlo',
    color: colors.foreground,
  },
  hint: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  toggleLabelWrap: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: typography.base.fontSize,
    lineHeight: typography.base.lineHeight,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: colors.mutedForeground,
  },
  button: {
    height: 52,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDestructive: {
    backgroundColor: colors.danger,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: typography.base.fontSize,
    lineHeight: typography.base.lineHeight,
    fontWeight: '700',
    color: colors.dangerForeground,
  },
});
