import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';
import { useBiometry } from '../hooks/use-biometry';
import { hasSecurePIN, verifySecurePIN } from '../lib/security/secure-pin';
import {
  evaluateDeviceUnlockRequirement,
  type DeviceUnlockRequirement,
} from '../lib/security/device-unlock';

type Props = {
  onUnlocked: () => void;
  onLogout: () => void;
};

export function DeviceUnlockScreen({ onUnlocked, onLogout }: Props) {
  const {
    isEnrolled,
    authenticate,
    loading: bioLoading,
    biometryType,
  } = useBiometry();
  const [requirement, setRequirement] =
    useState<DeviceUnlockRequirement | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const autoBioTried = useRef(false);

  const stableUnlock = useCallback(() => {
    onUnlocked();
  }, [onUnlocked]);

  useEffect(() => {
    let mounted = true;
    if (bioLoading) return;
    (async () => {
      const hasPin = await hasSecurePIN();
      if (!mounted) return;
      const next = evaluateDeviceUnlockRequirement({
        hasPin,
        biometryEnrolled: isEnrolled,
      });
      setRequirement(next);
      if (!next.requiresUnlock) {
        stableUnlock();
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isEnrolled, bioLoading, stableUnlock]);

  useEffect(() => {
    if (!requirement?.allowBiometry || bioLoading || autoBioTried.current)
      return;
    autoBioTried.current = true;
    let cancelled = false;
    (async () => {
      setBusy(true);
      const ok = await authenticate('Unlock GateFlow Scanner');
      if (cancelled) return;
      setBusy(false);
      if (ok) stableUnlock();
    })();
    return () => {
      cancelled = true;
    };
  }, [requirement?.allowBiometry, bioLoading, authenticate, stableUnlock]);

  const handlePinSubmit = async () => {
    if (!requirement?.allowPin) return;
    setError(null);
    setBusy(true);
    const ok = await verifySecurePIN(pin.trim());
    setBusy(false);
    if (!ok) {
      setError('Incorrect PIN');
      setPin('');
      return;
    }
    stableUnlock();
  };

  if (requirement === null || bioLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={nativeTokens.colors.primary} size="large" />
        <Text style={styles.sub}>Checking device security…</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Unlock Scanner</Text>
      <Text style={styles.sub}>
        {requirement.allowBiometry
          ? `Use ${biometryType === 'FACE_ID' ? 'Face ID' : 'biometrics'} or PIN`
          : 'Enter your device PIN'}
      </Text>

      {requirement.allowPin ? (
        <>
          <TextInput
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            placeholder="PIN"
            placeholderTextColor={nativeTokens.colors.textSubtlest}
            style={styles.input}
            editable={!busy}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            onPress={handlePinSubmit}
            disabled={busy || pin.length < 4}
            style={[
              styles.button,
              (busy || pin.length < 4) && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.buttonText}>Unlock</Text>
          </Pressable>
        </>
      ) : null}

      {requirement.allowBiometry ? (
        <Pressable
          onPress={async () => {
            setError(null);
            setBusy(true);
            const ok = await authenticate('Unlock GateFlow Scanner');
            setBusy(false);
            if (ok) stableUnlock();
            else setError('Biometric unlock failed — try again or use PIN');
          }}
          disabled={busy}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Retry biometrics</Text>
        </Pressable>
      ) : null}

      <Pressable onPress={onLogout} style={styles.linkButton}>
        <Text style={styles.linkText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: nativeTokens.spacing['space-300'],
    backgroundColor: nativeTokens.colors.background,
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 28,
    color: nativeTokens.colors.textHeading,
    marginBottom: nativeTokens.spacing['space-100'],
  },
  sub: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtlest,
    textAlign: 'center',
    marginBottom: nativeTokens.spacing['space-300'],
  },
  input: {
    width: '100%',
    maxWidth: 280,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    borderRadius: 6,
    paddingHorizontal: nativeTokens.spacing['space-200'],
    paddingVertical: nativeTokens.spacing['space-150'],
    color: nativeTokens.colors.textPrimary,
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 20,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: nativeTokens.spacing['space-150'],
  },
  error: {
    color: nativeTokens.colors.danger,
    fontFamily: 'Cairo_400Regular',
    marginBottom: nativeTokens.spacing['space-150'],
  },
  button: {
    backgroundColor: nativeTokens.colors.primary,
    paddingHorizontal: nativeTokens.spacing['space-400'],
    paddingVertical: nativeTokens.spacing['space-150'],
    borderRadius: 6,
    marginBottom: nativeTokens.spacing['space-200'],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: nativeTokens.colors.textInverse,
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 16,
  },
  linkButton: {
    padding: nativeTokens.spacing['space-150'],
  },
  linkText: {
    color: nativeTokens.colors.primary,
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
  },
});
