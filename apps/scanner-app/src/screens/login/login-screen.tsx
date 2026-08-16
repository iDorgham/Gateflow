import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { login } from '../../lib/auth-client';
import { haptic } from '../../lib/haptics';
import { CircleAlert } from 'lucide-react-native';

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleLogin = async () => {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const result = await login(trimmed, password);
    setIsLoading(false);

    if (result.success) {
      await haptic(Haptics.NotificationFeedbackType.Success);
      onSuccess();
    } else {
      await haptic(Haptics.NotificationFeedbackType.Error);
      setError(result.error ?? 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.loginRoot}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={nativeTokens.colors.background}
      />
      <KeyboardAvoidingView
        style={styles.loginKAV}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.loginInner}>
          {/* Brand mark */}
          <View style={styles.loginHeader}>
            <View style={styles.logoMark}>
              <View style={styles.logoMarkInner} />
            </View>
            <Text style={styles.logoTitle}>GateFlow</Text>
            <Text style={styles.logoLabel}>SCANNER</Text>
          </View>

          {/* Form */}
          <View style={styles.loginForm}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.fieldInput}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                clearError();
              }}
              placeholder="operator@company.com"
              placeholderTextColor={nativeTokens.colors.textSubtlest}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              editable={!isLoading}
              accessibilityLabel="Email"
            />

            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
            <TextInput
              style={styles.fieldInput}
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                clearError();
              }}
              placeholder="••••••••"
              placeholderTextColor={nativeTokens.colors.textSubtlest}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              editable={!isLoading}
              accessibilityLabel="Password"
            />

            {!!error && (
              <View style={styles.errorBox}>
                <CircleAlert
                  size={16}
                  color={nativeTokens.colors.danger}
                  strokeWidth={1.5}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={[styles.loginButton, isLoading && styles.loginButtonBusy]}
              onPress={handleLogin}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              accessibilityState={{ disabled: isLoading, busy: isLoading }}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={nativeTokens.colors.textInverse}
                />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </Pressable>

            {/* Stub — no forgot-password flow yet */}
            <Pressable
              style={styles.forgotWrap}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
            {__DEV__ ? (
              <Text style={styles.devApiUrl} selectable>
                {process.env.EXPO_PUBLIC_API_URL ?? 'API URL unset'}
              </Text>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginRoot: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
  },
  loginKAV: {
    flex: 1,
  },
  loginInner: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...nativeTokens.shadows.satinRaised,
  },
  logoMarkInner: {
    width: 30,
    height: 30,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: nativeTokens.colors.primary,
  },
  logoTitle: {
    fontSize: 30,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    letterSpacing: nativeTokens.typography.headerTracking,
    textTransform: 'uppercase',
  },
  logoLabel: {
    fontSize: 12,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtlest,
    letterSpacing: 3,
    marginTop: 4,
  },
  loginForm: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtle,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  fieldInput: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textHeading,
  },
  errorBox: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: nativeTokens.colors.primarySubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  errorIcon: {
    fontSize: 14,
    color: nativeTokens.colors.danger,
    lineHeight: 20,
  },
  errorText: {
    flex: 1,
    color: nativeTokens.colors.danger,
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    lineHeight: 20,
  },
  loginButton: {
    marginTop: 24,
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...nativeTokens.shadows.brandGlow,
  },
  loginButtonBusy: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: nativeTokens.colors.textInverse,
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  forgotWrap: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    color: nativeTokens.colors.textSubtlest,
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
  },
  devApiUrl: {
    marginTop: 8,
    textAlign: 'center',
    color: nativeTokens.colors.textSubtlest,
    fontSize: 11,
    fontFamily: 'Cairo_400Regular',
  },
});
