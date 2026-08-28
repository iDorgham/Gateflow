import React, { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

type Props = {
  onReady: () => void;
};

export function PermissionsScreen({ onReady }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const granted = Boolean(permission?.granted);
  const isBlocked = permission?.canAskAgain === false && !granted;

  const handleAllow = async () => {
    setError(null);
    setBusy(true);
    try {
      if (!granted) {
        const result = await requestPermission();
        if (!result.granted) {
          setError('Camera access is required to scan guest QR codes.');
          setBusy(false);
          return;
        }
      }
      onReady();
    } catch {
      setError('Could not request camera permission.');
    } finally {
      setBusy(false);
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.root}>
      <Text style={styles.body}>
        The scanner requires hardware permissions to validate signed GateFlow QR
        codes and provide instant haptic feedback at the gate terminal.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Camera (Required)</Text>
        <Text style={styles.cardBody}>
          Status:{' '}
          {granted
            ? 'Allowed'
            : isBlocked
              ? 'Blocked in System Settings'
              : 'Not granted'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Haptic Feedback</Text>
        <Text style={styles.cardBody}>
          Status: Enabled (tactile feedback on access decisions)
        </Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isBlocked ? (
        <Pressable style={styles.secondary} onPress={handleOpenSettings}>
          <Text style={styles.secondaryText}>Open Device Settings</Text>
        </Pressable>
      ) : null}

      <Pressable
        style={[styles.primary, busy && styles.disabled]}
        onPress={handleAllow}
        disabled={busy}
      >
        <Text style={styles.primaryText}>
          {granted ? 'Continue' : 'Allow Camera & Complete Setup'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: nativeTokens.spacing['space-200'],
  },
  body: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: nativeTokens.colors.textSubtle,
  },
  card: {
    padding: nativeTokens.spacing['space-200'],
    borderRadius: 8,
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    gap: nativeTokens.spacing['space-050'],
  },
  cardTitle: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 16,
    color: nativeTokens.colors.textHeading,
  },
  cardBody: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtle,
  },
  error: {
    fontFamily: 'Cairo_400Regular',
    color: nativeTokens.colors.danger,
  },
  secondary: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    borderRadius: 8,
    paddingVertical: nativeTokens.spacing['space-150'],
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 15,
    color: nativeTokens.colors.textDefault,
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
