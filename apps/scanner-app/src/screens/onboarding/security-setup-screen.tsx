import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';
import { setSecurePIN } from '../../lib/security/secure-pin';
import { useBiometry } from '../../hooks/use-biometry';

type Props = {
  onReady: () => void;
};

export function SecuritySetupScreen({ onReady }: Props) {
  const { isSupported, isEnrolled, biometryType, authenticate } = useBiometry();
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [preferBio, setPreferBio] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canUseBio = isSupported && isEnrolled;

  const handleContinue = async () => {
    setError(null);
    if (pin.length !== 4 && pin.length !== 6) {
      setError('PIN must be 4 or 6 digits');
      return;
    }
    if (pin !== confirm) {
      setError('PINs do not match');
      return;
    }

    setBusy(true);
    try {
      await setSecurePIN(pin);
      if (preferBio && canUseBio) {
        const ok = await authenticate(
          'Confirm biometrics for GateFlow Scanner'
        );
        if (!ok) {
          setError(
            'Biometric confirmation failed — PIN is saved; you can retry later'
          );
          setBusy(false);
          return;
        }
      }
      onReady();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save PIN');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.body}>
        Create a device PIN. It unlocks the scanner after login when biometrics
        are unavailable.
      </Text>

      <Text style={styles.label}>PIN</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        style={styles.input}
        placeholder="4 or 6 digits"
        placeholderTextColor={nativeTokens.colors.textSubtlest}
        editable={!busy}
      />

      <Text style={styles.label}>Confirm PIN</Text>
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
        style={styles.input}
        placeholder="Repeat PIN"
        placeholderTextColor={nativeTokens.colors.textSubtlest}
        editable={!busy}
      />

      <View style={styles.switchRow}>
        <View style={styles.switchCopy}>
          <Text style={styles.switchTitle}>
            Prefer {biometryType === 'FACE_ID' ? 'Face ID' : 'biometrics'}
          </Text>
          <Text style={styles.switchHint}>
            {canUseBio
              ? 'Use biometrics at unlock when available'
              : 'Not available on this device'}
          </Text>
        </View>
        <Switch
          value={preferBio && canUseBio}
          onValueChange={setPreferBio}
          disabled={!canUseBio || busy}
          trackColor={{
            false: nativeTokens.colors.border,
            true: nativeTokens.colors.primarySubtle,
          }}
          thumbColor={
            preferBio && canUseBio
              ? nativeTokens.colors.primary
              : nativeTokens.colors.textSubtlest
          }
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.primary, busy && styles.disabled]}
        onPress={handleContinue}
        disabled={busy}
      >
        <Text style={styles.primaryText}>Save and continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: nativeTokens.spacing['space-100'],
  },
  body: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: nativeTokens.colors.textSubtle,
    marginBottom: nativeTokens.spacing['space-200'],
  },
  label: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 13,
    color: nativeTokens.colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    backgroundColor: nativeTokens.colors.surfaceRaised,
    borderRadius: 8,
    paddingHorizontal: nativeTokens.spacing['space-200'],
    paddingVertical: nativeTokens.spacing['space-150'],
    color: nativeTokens.colors.textPrimary,
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 20,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: nativeTokens.spacing['space-150'],
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: nativeTokens.spacing['space-150'],
    marginBottom: nativeTokens.spacing['space-100'],
  },
  switchCopy: {
    flex: 1,
    paddingEnd: nativeTokens.spacing['space-200'],
  },
  switchTitle: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 15,
    color: nativeTokens.colors.textPrimary,
  },
  switchHint: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 13,
    color: nativeTokens.colors.textSubtlest,
    marginTop: 2,
  },
  error: {
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.danger,
    marginBottom: nativeTokens.spacing['space-100'],
  },
  primary: {
    marginTop: nativeTokens.spacing['space-100'],
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 8,
    paddingVertical: nativeTokens.spacing['space-150'],
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 16,
    color: nativeTokens.colors.textInverse,
  },
});
