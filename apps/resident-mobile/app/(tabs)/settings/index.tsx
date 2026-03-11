import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { logout } from '../../../lib/auth-client';
import { theme } from '../../../lib/theme';

const { colors, spacing, borderRadius, shadows, typography } = theme;

export default function SettingsScreen() {
  const [logoutPending, setLogoutPending] = useState(false);

  const apiBase = useMemo(() => {
    const base = process.env.EXPO_PUBLIC_API_URL;
    return base && base.trim() ? base.trim().replace(/\/$/, '') : 'http://localhost:3001';
  }, []);

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>Theme</Text>
          <Text style={styles.rowValue}>Real Estate Palette</Text>
          <Text style={styles.hint}>Dark mode toggle can be added later.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language</Text>
        <View style={styles.card}>
          <Text style={styles.rowLabel}>App language</Text>
          <Text style={styles.rowValue}>English</Text>
          <Text style={styles.hint}>Arabic support can be wired to @gate-access/i18n later.</Text>
        </View>
      </View>

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

