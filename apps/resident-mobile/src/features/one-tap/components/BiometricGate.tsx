import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../../../lib/theme';
import { type UseBiometricAuthResult } from '../hooks/useBiometricAuth';
import { PinFallbackModal } from './PinFallbackModal';

const { colors, spacing, borderRadius, typography, shadows } = theme;

interface BiometricGateProps {
  auth: UseBiometricAuthResult;
  children: React.ReactNode;
}

export function BiometricGate({ auth, children }: BiometricGateProps) {
  const {
    isAuthenticated,
    isAuthenticating,
    isSupported,
    biometryType,
    showPinFallback,
    authenticate,
    verifyPin,
    resetPinFallback,
  } = auth;

  // Auto-trigger biometrics on mount if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !showPinFallback) {
      authenticate();
    }
  }, [isAuthenticated, showPinFallback, authenticate]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const getBiometricLabel = (): string => {
    if (biometryType === 'FACE_ID') return 'Face ID';
    if (biometryType === 'FINGERPRINT') return 'Touch ID / Fingerprint';
    if (biometryType === 'IRIS') return 'Iris Scan';
    return 'Biometrics';
  };

  return (
    <View style={styles.container}>
      {/* Visual Shield / Biometric Brand Area */}
      <View style={styles.contentCard}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>🛡️</Text>
        </View>

        <Text style={styles.title}>GateFlow One-Tap</Text>
        <Text style={styles.subtitle}>
          Authenticate to instantly unlock your high-security resident gate
          pass.
        </Text>

        <View style={styles.actionContainer}>
          {isSupported && (
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
                isAuthenticating && styles.buttonDisabled,
              ]}
              onPress={() => authenticate()}
              disabled={isAuthenticating}
            >
              {isAuthenticating ? (
                <ActivityIndicator color={colors.primaryForeground} />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Unlock with {getBiometricLabel()}
                </Text>
              )}
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => auth.authenticate()}
          >
            <Text style={styles.secondaryButtonText}>Use Security PIN</Text>
          </Pressable>
        </View>
      </View>

      {/* Backup PIN Modal */}
      <PinFallbackModal
        visible={showPinFallback}
        onSuccess={() => {
          // Auth state updated in hook
        }}
        onCancel={() => resetPinFallback()}
        verifyPin={verifyPin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  contentCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    alignItems: 'center',
    ...shadows.lg,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconText: {
    fontSize: 34,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sm.fontSize,
    lineHeight: typography.sm.lineHeight,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    paddingHorizontal: spacing.sm,
  },
  actionContainer: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    height: 52,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  primaryButtonText: {
    fontSize: typography.base.fontSize,
    fontWeight: '700',
    color: colors.primaryForeground,
  },
  secondaryButton: {
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.sm.fontSize,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
