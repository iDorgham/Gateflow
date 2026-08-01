import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';
import { StepIndicator } from '../components/onboarding/StepIndicator';
import { WelcomeScreen } from '../screens/onboarding/welcome-screen';
import { SecuritySetupScreen } from '../screens/onboarding/security-setup-screen';
import { PermissionsScreen } from '../screens/onboarding/permissions-screen';
import { setOnboardingComplete } from '../lib/security/onboarding';
import { FadeIn } from '../components/common/fade-in';

export type OnboardingStepId = 'welcome' | 'security' | 'permissions';

const STEPS: OnboardingStepId[] = ['welcome', 'security', 'permissions'];

type Props = {
  onComplete: () => void;
  onLogout: () => void;
};

export function OnboardingNavigator({ onComplete, onLogout }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex] ?? 'welcome';
  const title = useMemo(() => {
    switch (step) {
      case 'welcome':
        return 'Welcome';
      case 'security':
        return 'Device security';
      case 'permissions':
        return 'Permissions';
      default:
        return 'Setup';
    }
  }, [step]);

  const goNext = async () => {
    if (stepIndex >= STEPS.length - 1) {
      await setOnboardingComplete();
      onComplete();
      return;
    }
    setStepIndex((value) => value + 1);
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((value) => value - 1);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.kicker}>SETUP</Text>
        <Text style={styles.title}>{title}</Text>
        <StepIndicator total={STEPS.length} current={stepIndex} />
      </View>

      <View style={styles.body}>
        <FadeIn key={step} style={styles.stepFade}>
          {step === 'welcome' ? <WelcomeScreen /> : null}
          {step === 'security' ? (
            <SecuritySetupScreen onReady={goNext} />
          ) : null}
          {step === 'permissions' ? (
            <PermissionsScreen onReady={goNext} />
          ) : null}
        </FadeIn>
      </View>

      {step === 'welcome' ? (
        <View style={styles.footer}>
          <Pressable style={styles.primary} onPress={goNext}>
            <Text style={styles.primaryText}>Continue</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={onLogout}>
            <Text style={styles.linkText}>Sign out</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.footer}>
          <Pressable style={styles.link} onPress={goBack}>
            <Text style={styles.linkText}>Back</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={onLogout}>
            <Text style={styles.linkText}>Sign out</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: nativeTokens.colors.background,
    paddingHorizontal: nativeTokens.spacing['space-300'],
    paddingTop: nativeTokens.spacing['space-500'],
    paddingBottom: nativeTokens.spacing['space-400'],
  },
  header: {
    marginBottom: nativeTokens.spacing['space-200'],
  },
  kicker: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 12,
    letterSpacing: nativeTokens.typography.subtitleTracking,
    color: nativeTokens.colors.textSubtlest,
    marginBottom: nativeTokens.spacing['space-050'],
  },
  title: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 28,
    color: nativeTokens.colors.textHeading,
    marginBottom: nativeTokens.spacing['space-200'],
  },
  body: {
    flex: 1,
  },
  stepFade: {
    flex: 1,
  },
  footer: {
    gap: nativeTokens.spacing['space-100'],
    alignItems: 'center',
  },
  primary: {
    width: '100%',
    backgroundColor: nativeTokens.colors.primary,
    borderRadius: 8,
    paddingVertical: nativeTokens.spacing['space-150'],
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 16,
    color: nativeTokens.colors.textInverse,
  },
  link: {
    padding: nativeTokens.spacing['space-100'],
  },
  linkText: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    color: nativeTokens.colors.primary,
  },
});
