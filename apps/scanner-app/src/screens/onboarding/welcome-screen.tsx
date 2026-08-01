import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

export function WelcomeScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <View style={styles.heroRing} />
        <Text style={styles.heroMark}>GF</Text>
      </View>
      <Text style={styles.heading}>GateFlow Scanner</Text>
      <Text style={styles.body}>
        Set up device security and camera access so you can verify guest QR
        codes at the gate — online or offline.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What you will configure</Text>
        <Text style={styles.cardLine}>
          1. Device PIN (and biometrics if available)
        </Text>
        <Text style={styles.cardLine}>2. Camera permission for scanning</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: nativeTokens.spacing['space-200'],
  },
  hero: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: nativeTokens.spacing['space-100'],
    backgroundColor: nativeTokens.colors.surfaceRaised,
  },
  heroRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: nativeTokens.colors.primary,
    opacity: 0.7,
  },
  heroMark: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 28,
    color: nativeTokens.colors.primary,
  },
  heading: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 24,
    color: nativeTokens.colors.textHeading,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: nativeTokens.colors.textSubtle,
    textAlign: 'center',
  },
  card: {
    marginTop: nativeTokens.spacing['space-200'],
    padding: nativeTokens.spacing['space-200'],
    borderRadius: 8,
    backgroundColor: nativeTokens.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: nativeTokens.colors.border,
    gap: nativeTokens.spacing['space-100'],
  },
  cardTitle: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 14,
    color: nativeTokens.colors.textPrimary,
    marginBottom: nativeTokens.spacing['space-050'],
  },
  cardLine: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.textSubtle,
  },
});
