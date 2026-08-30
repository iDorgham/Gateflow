import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useBiometricAuth } from '../hooks/useBiometricAuth';
import { useSecureQR } from '../hooks/useSecureQR';
import { BiometricGate } from '../components/BiometricGate';
import { FullScreenQR } from '../components/FullScreenQR';

export function OneTapHomeScreen() {
  const auth = useBiometricAuth();
  const {
    activePass,
    isLoading,
    isOffline,
    isExpiringSoon,
    remainingSeconds,
    refreshPass,
  } = useSecureQR();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />
      <BiometricGate auth={auth}>
        <FullScreenQR
          pass={activePass}
          isLoading={isLoading}
          isOffline={isOffline}
          isExpiringSoon={isExpiringSoon}
          remainingSeconds={remainingSeconds}
          onRefresh={refreshPass}
          onLock={auth.lockSession}
        />
      </BiometricGate>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#090D16',
  },
});
