import React, { useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { useInactivityTimer } from '../../hooks/use-inactivity-timer';

/** 5 minutes — balances re-lock security against interrupting an on-duty guard mid-shift. */
export const DEFAULT_INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

export interface BiometricGuardProps {
  /** Disable entirely (e.g. while already locked) to stop polling and AppState tracking. */
  enabled: boolean;
  timeoutMs?: number;
  onLock: () => void;
  children: React.ReactNode;
}

/**
 * Wraps the unlocked scanner shell and calls `onLock` after `timeoutMs` of no
 * touch activity, or after being backgrounded for at least `timeoutMs`.
 * Observes touches without consuming them (`onStartShouldSetPanResponderCapture`
 * returns `false`), so it never interferes with taps, scrolls, or the camera view.
 * Does not read, store, or log the PIN/biometric credential itself — unlocking
 * is delegated entirely to the existing `DeviceUnlockScreen` (Phase 01).
 */
export function BiometricGuard({
  enabled,
  timeoutMs = DEFAULT_INACTIVITY_TIMEOUT_MS,
  onLock,
  children,
}: BiometricGuardProps) {
  const { recordActivity } = useInactivityTimer({ enabled, timeoutMs, onLock });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        recordActivity();
        return false;
      },
    })
  ).current;

  return (
    <View style={styles.flex} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
