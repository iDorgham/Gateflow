import { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getValidAccessToken, logout } from '../lib/auth-client';
import { theme } from '../lib/theme';

const { colors, spacing, borderRadius, shadows, typography } = theme;

export default function HomeScreen() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getValidAccessToken().then((token) => {
      setChecking(false);
      if (!token) {
        router.replace('/login');
        return;
      }
      router.replace('/qrs');
    });
  }, []);

  const handleSignInDifferent = () => {
    logout();
    router.push('/login');
  };

  if (checking) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Should be unreachable (we redirect immediately after the session check),
  // but keep a minimal surface for slow devices / transition frames.
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>GateFlow Resident</Text>
        <Text style={styles.subtitle}>
          Quickly open and share visitor passes for your unit.
        </Text>

        <Pressable
          onPress={() => router.push('/qrs')}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonText}>View my visitor QRs</Text>
        </Pressable>

        <Pressable
          onPress={handleSignInDifferent}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
        >
          <Text style={styles.secondaryButtonText}>Sign in with a different account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    ...shadows.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.base.fontSize,
    lineHeight: typography.base.lineHeight,
    color: colors.mutedForeground,
    marginBottom: 28,
  },
  primaryButton: {
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    fontSize: typography.base.fontSize,
    fontWeight: '600',
    color: colors.primaryForeground,
  },
  secondaryButton: {
    height: 48,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: colors.secondary,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.foreground,
  },
});


