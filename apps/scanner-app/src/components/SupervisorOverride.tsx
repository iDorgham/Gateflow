/**
 * SupervisorOverride
 *
 * Shown when a scan is rejected. Allows an authorised supervisor to grant
 * access by entering their PIN (stored in expo-secure-store as 'supervisor_pin').
 *
 * Flow:
 *   1. Operator taps "Request Override" on the rejected-scan overlay.
 *   2. Supervisor enters reason + PIN (4–6 digits).
 *   3. Up to 3 attempts; on exhaustion a force-override becomes available.
 *   4. Every override attempt (succeeded or forced) is appended to the
 *      AsyncStorage audit log ('supervisor_overrides').
 */

import { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Constants ────────────────────────────────────────────────────────────────

const SUPERVISOR_PIN_KEY = 'supervisor_pin';
const OVERRIDE_LOG_KEY = 'supervisor_overrides';
const MAX_ATTEMPTS = 3;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OverrideEvent {
  id: string;
  timestamp: string;
  reason: string;
  /** true = valid PIN entered; false = forced after exhausting attempts */
  supervisorAuth: boolean;
  attempts: number;
}

export interface SupervisorOverrideProps {
  visible: boolean;
  /** Called when access is granted (either via valid PIN or forced override). */
  onGranted: (supervisorAuth: boolean, reason: string) => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SupervisorOverride({
  visible,
  onGranted,
  onCancel,
}: SupervisorOverrideProps) {
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [hasPinConfigured, setHasPinConfigured] = useState<boolean | null>(null);

  // Check PIN provisioning state when modal opens
  useEffect(() => {
    if (visible) {
      SecureStore.getItemAsync(SUPERVISOR_PIN_KEY)
        .then((stored) => setHasPinConfigured(stored !== null))
        .catch(() => setHasPinConfigured(false));
    }
  }, [visible]);

  const reset = useCallback(() => {
    setPin('');
    setReason('');
    setAttempts(0);
    setError('');
    setHasPinConfigured(null);
  }, []);

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const logOverride = async (supervisorAuth: boolean, currentAttempts: number) => {
    try {
      const raw = await AsyncStorage.getItem(OVERRIDE_LOG_KEY);
      const log: OverrideEvent[] = raw ? (JSON.parse(raw) as OverrideEvent[]) : [];
      log.push({
        id: `ovr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        reason: reason.trim() || 'No reason provided',
        supervisorAuth,
        attempts: currentAttempts,
      });
      await AsyncStorage.setItem(OVERRIDE_LOG_KEY, JSON.stringify(log));
    } catch {
      // Audit log failure is non-fatal — override still proceeds
    }
  };

  const appendDigit = (digit: string) => {
    if (pin.length < 6) setPin((p) => p + digit);
    setError('');
  };

  const deleteLast = () => setPin((p) => p.slice(0, -1));

  const handleValidate = async () => {
    if (!reason.trim()) {
      setError('A reason for the override is required.');
      return;
    }
    if (pin.length < 4) {
      setError('PIN must be 4–6 digits.');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const stored = await SecureStore.getItemAsync(SUPERVISOR_PIN_KEY);

      if (!stored) {
        setError('No supervisor PIN configured. Contact your administrator.');
        setIsValidating(false);
        return;
      }

      if (pin === stored) {
        await haptic(Haptics.NotificationFeedbackType.Success);
        await logOverride(true, attempts + 1);
        const capturedReason = reason.trim() || 'No reason provided';
        reset();
        onGranted(true, capturedReason);
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setPin('');
        await haptic(Haptics.NotificationFeedbackType.Error);

        if (next >= MAX_ATTEMPTS) {
          setError(
            `Incorrect PIN — ${MAX_ATTEMPTS} attempts used. You may force-override (logged).`
          );
        } else {
          const remaining = MAX_ATTEMPTS - next;
          setError(
            `Incorrect PIN. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          );
        }
      }
    } catch {
      setError('Validation error. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleForceOverride = async () => {
    await haptic(Haptics.NotificationFeedbackType.Warning);
    await logOverride(false, attempts);
    const capturedReason = reason.trim() || 'No reason provided';
    reset();
    onGranted(false, capturedReason);
  };

  const exhausted = attempts >= MAX_ATTEMPTS;
  const noPinSetup = hasPinConfigured === false;

  const PAD: string[][] = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['←', '0', '✓'],
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <ScrollView
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <Text style={s.title}>Supervisor Override</Text>
            <Text style={s.sub}>
              Grant access after a failed scan. Requires a reason and supervisor PIN.
              All overrides are permanently logged.
            </Text>

            {/* Reason field */}
            <Text style={s.label}>Reason for override *</Text>
            <TextInput
              style={s.reasonInput}
              value={reason}
              onChangeText={(t) => {
                setReason(t);
                setError('');
              }}
              placeholder="e.g. Emergency access — ID verified manually"
              placeholderTextColor="#475569"
              multiline
              maxLength={200}
              returnKeyType="done"
            />

            {/* PIN section (hidden when exhausted or no PIN configured) */}
            {!exhausted && !noPinSetup && (
              <>
                <Text style={s.label}>Supervisor PIN (4–6 digits)</Text>
                <View style={s.dotRow}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <View
                      key={i}
                      style={[
                        s.dot,
                        i < pin.length && s.dotFilled,
                        i >= 4 && i >= Math.max(pin.length, 4) && s.dotOptional,
                      ]}
                    />
                  ))}
                </View>

                {/* Numeric keypad */}
                <View style={s.pad}>
                  {PAD.map((row, ri) => (
                    <View key={ri} style={s.padRow}>
                      {row.map((key) => (
                        <Pressable
                          key={key}
                          style={({ pressed }) => [
                            s.padKey,
                            key === '✓' && s.padConfirm,
                            pressed && s.padKeyPressed,
                          ]}
                          onPress={() => {
                            if (key === '←') deleteLast();
                            else if (key === '✓') handleValidate();
                            else appendDigit(key);
                          }}
                          disabled={isValidating}
                        >
                          {key === '✓' && isValidating ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <Text
                              style={[s.padKeyText, key === '✓' && s.padConfirmText]}
                            >
                              {key}
                            </Text>
                          )}
                        </Pressable>
                      ))}
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* No PIN configured warning */}
            {noPinSetup && !exhausted && (
              <View style={s.noPinBox}>
                <Text style={s.noPinText}>
                  ⚠ No supervisor PIN is configured on this device. Contact your
                  administrator to provision one. You may only force-override below.
                </Text>
              </View>
            )}

            {/* Error message */}
            {!!error && <Text style={s.error}>{error}</Text>}

            {/* Force override (after 3 failed attempts OR no PIN configured) */}
            {(exhausted || noPinSetup) && (
              <Pressable style={s.forceBtn} onPress={handleForceOverride}>
                <Text style={s.forceBtnText}>⚠ Override with Warning (logged)</Text>
              </Pressable>
            )}

            {/* Cancel */}
            <Pressable style={s.cancelBtn} onPress={handleCancel}>
              <Text style={s.cancelText}>Cancel — Keep Access Denied</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function haptic(type: Haptics.NotificationFeedbackType): Promise<void> {
  try {
    await Haptics.notificationAsync(type);
  } catch { /* simulators */ }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    borderTopWidth: 1,
    borderColor: '#1e293b',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  reasonInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#f1f5f9',
    minHeight: 72,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#475569',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dotOptional: {
    borderColor: '#334155',
    opacity: 0.5,
  },
  pad: {
    gap: 10,
    marginBottom: 16,
  },
  padRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  padKey: {
    width: 76,
    height: 56,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  padConfirm: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  padKeyPressed: {
    opacity: 0.6,
  },
  padKeyText: {
    fontSize: 22,
    color: '#f1f5f9',
    fontWeight: '500',
  },
  padConfirmText: {
    fontWeight: '700',
  },
  noPinBox: {
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.4)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  noPinText: {
    color: '#fde68a',
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: '#fca5a5',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  forceBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  forceBtnText: {
    color: '#fca5a5',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
});
