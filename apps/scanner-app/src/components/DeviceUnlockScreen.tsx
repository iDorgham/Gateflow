import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';
import { useBiometry } from '../hooks/use-biometry';
import { hasSecurePIN, verifySecurePIN } from '../lib/security/secure-pin';
import {
  evaluateDeviceUnlockRequirement,
  type DeviceUnlockRequirement,
} from '../lib/security/device-unlock';
import { PinDots, PinKeypad } from './security/pin-keypad';

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

  const handlePinSubmit = async (enteredPin = pin) => {
    if (!requirement?.allowPin) return;
    const candidate = enteredPin.trim();
    if (candidate.length !== 4 && candidate.length !== 6) return;
    setError(null);
    setBusy(true);
    const ok = await verifySecurePIN(candidate);
    setBusy(false);
    if (!ok) {
      setError('Incorrect PIN');
      setPin('');
      return;
    }
    stableUnlock();
  };

  const pinReady = pin.length === 4 || pin.length === 6;

  const unlockHint = (() => {
    if (!requirement) return 'Checking device security…';
    const bioLabel = biometryType === 'FACE_ID' ? 'Face ID' : 'biometrics';
    if (requirement.allowBiometry && requirement.allowPin) {
      return `Use ${bioLabel}, or enter your 6-digit device PIN`;
    }
    if (requirement.allowBiometry) {
      return `Use ${bioLabel} to unlock`;
    }
    return 'Enter your 6-digit device PIN';
  })();

  if (requirement === null || bioLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={nativeTokens.colors.primary} size="large" />
        <Text style={styles.sub}>Checking device security…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.center}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Unlock Scanner</Text>
      <Text style={styles.sub}>{unlockHint}</Text>

      {requirement.allowPin ? (
        <>
          <PinDots filled={pin.length} />
          <PinKeypad
            value={pin}
            onChange={(next) => {
              setPin(next);
              setError(null);
              if (next.length === 6) void handlePinSubmit(next);
            }}
            disabled={busy}
            onSubmit={() => void handlePinSubmit()}
            submitBusy={busy}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            onPress={() => void handlePinSubmit()}
            disabled={busy || !pinReady}
            style={[
              styles.button,
              (busy || !pinReady) && styles.buttonDisabled,
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
            else
              setError(
                requirement.allowPin
                  ? 'Biometric unlock failed — try again or use PIN'
                  : 'Biometric unlock failed — try again'
              );
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: nativeTokens.spacing['space-300'],
    paddingVertical: nativeTokens.spacing['space-400'],
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
  error: {
    color: nativeTokens.colors.danger,
    fontFamily: 'Cairo_400Regular',
    marginTop: nativeTokens.spacing['space-150'],
    marginBottom: nativeTokens.spacing['space-150'],
  },
  button: {
    backgroundColor: nativeTokens.colors.primary,
    paddingHorizontal: nativeTokens.spacing['space-400'],
    paddingVertical: nativeTokens.spacing['space-150'],
    borderRadius: 6,
    marginTop: nativeTokens.spacing['space-200'],
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
