import { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { login as doLogin, getValidAccessToken } from '../lib/auth-client';
import { nativeTokensNewEra as nativeTokens } from '../../../packages/ui/src/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    getValidAccessToken().then((token) => {
      setCheckingSession(false);
      if (token) {
        router.replace('/');
      }
    });
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    const result = await doLogin(email.trim(), password);
    setLoading(false);
    if (result.success) {
      router.replace('/');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  if (checkingSession) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={nativeTokens.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <RNStatusBar barStyle="light-content" />
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <View style={styles.logoMarkInner} />
          </View>
          <Text style={styles.logoTitle}>GateFlow</Text>
          <Text style={styles.logoLabel}>RESIDENT PORTAL</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.fieldLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="resident@example.com"
            placeholderTextColor={nativeTokens.colors.textSubtlest}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            editable={!loading}
          />

          <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={nativeTokens.colors.textSubtlest}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {error != null ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.primaryButton,
              (pressed || loading) && styles.primaryButtonPressed,
            ]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={nativeTokens.colors.textInverse} />
            ) : (
              <Text style={styles.primaryButtonText}>SIGN IN</Text>
            )}
          </Pressable>

          <Pressable style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot your secure pass-key?</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
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
    fontSize: 28,
    fontFamily: 'Cairo_700Bold',
    color: nativeTokens.colors.textHeading,
    letterSpacing: nativeTokens.typography.headerTracking,
    textTransform: 'uppercase',
  },
  logoLabel: {
    fontSize: 11,
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.textSubtlest,
    letterSpacing: 4,
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Cairo_600SemiBold',
    color: nativeTokens.colors.textSubtle,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
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
    marginTop: 16,
    backgroundColor: nativeTokens.colors.dangerSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.danger,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  errorText: {
    color: nativeTokens.colors.danger,
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 32,
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...nativeTokens.shadows.brandGlow,
  },
  primaryButtonPressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: nativeTokens.colors.textInverse,
    fontSize: 16,
    fontFamily: 'Cairo_700Bold',
    letterSpacing: 1,
  },
  forgotWrap: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    color: nativeTokens.colors.textSubtlest,
    fontSize: 13,
    fontFamily: 'Cairo_400Regular',
  },
});
