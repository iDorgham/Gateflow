import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getPreferences, setPreference, type AppPreferences } from '../lib/preferences';
import { clearHistory } from '../lib/scan-history';
import { scanQueue } from '../lib/offline-queue';
import { clearNonceCache } from '../lib/qr-verify';

const SUPERVISOR_PIN_KEY = 'supervisor_pin';

const TOP_OFFSET = Platform.OS === 'android'
  ? (StatusBar.currentHeight ?? 24) + 20
  : 60;

const APP_VERSION = '0.1.0';

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionCard}>{children}</View>
    </View>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({
  label,
  sub,
  value,
  onValueChange,
  disabled,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={s.row}>
      <View style={s.rowText}>
        <Text style={s.rowLabel}>{label}</Text>
        {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#334155', true: '#2563eb' }}
        thumbColor={value ? '#93c5fd' : '#64748b'}
        ios_backgroundColor="#334155"
      />
    </View>
  );
}

// ─── Destructive action row ───────────────────────────────────────────────────

function ActionRow({
  label,
  sub,
  onPress,
  busy,
  danger,
}: {
  label: string;
  sub?: string;
  onPress: () => void;
  busy?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [s.row, pressed && s.rowPressed]}
      onPress={onPress}
      disabled={busy}
    >
      <View style={s.rowText}>
        <Text style={[s.rowLabel, danger && s.rowLabelDanger]}>{label}</Text>
        {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
      </View>
      {busy ? (
        <ActivityIndicator size="small" color="#64748b" />
      ) : (
        <Text style={[s.chevron, danger && s.chevronDanger]}>›</Text>
      )}
    </Pressable>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <View style={s.divider} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface SettingsTabProps {
  onLogout: () => Promise<void>;
}

export function SettingsTab({ onLogout }: SettingsTabProps) {
  const [prefs, setPrefs] = useState<AppPreferences>({
    hapticsEnabled: true,
    locationEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClearingQueue, setIsClearingQueue] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
  const [isClearingNonce, setIsClearingNonce] = useState(false);

  // ── Supervisor PIN state ────────────────────────────────────────────────
  const [pinConfigured, setPinConfigured] = useState<boolean>(false);
  const [showPinInput, setShowPinInput] = useState<'set' | 'change' | null>(null);
  const [pinValue, setPinValue] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinBusy, setPinBusy] = useState(false);

  const refreshPinStatus = useCallback(async () => {
    try {
      const stored = await SecureStore.getItemAsync(SUPERVISOR_PIN_KEY);
      setPinConfigured(stored !== null);
    } catch {
      setPinConfigured(false);
    }
  }, []);

  const loadPrefs = useCallback(async () => {
    const p = await getPreferences();
    setPrefs(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPrefs();
    refreshPinStatus();
  }, [loadPrefs, refreshPinStatus]);

  async function toggle<K extends keyof AppPreferences>(key: K, value: AppPreferences[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    await setPreference(key, value);
  }

  const handleClearQueue = () => {
    Alert.alert(
      'Clear Offline Queue',
      'This will permanently delete all queued scans that have not been synced. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Queue',
          style: 'destructive',
          onPress: async () => {
            setIsClearingQueue(true);
            try {
              await scanQueue.clearQueue();
              Alert.alert('Done', 'Offline queue cleared.');
            } catch {
              Alert.alert('Error', 'Failed to clear queue. Please try again.');
            } finally {
              setIsClearingQueue(false);
            }
          },
        },
      ],
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Scan History',
      'This will remove all local scan history from this device. Server records are not affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear History',
          style: 'destructive',
          onPress: async () => {
            setIsClearingHistory(true);
            try {
              await clearHistory();
              Alert.alert('Done', 'Local scan history cleared.');
            } catch {
              Alert.alert('Error', 'Failed to clear history. Please try again.');
            } finally {
              setIsClearingHistory(false);
            }
          },
        },
      ],
    );
  };

  const handleClearNonce = () => {
    Alert.alert(
      'Clear Nonce Cache',
      'This will clear the local replay protection cache, allowing previously scanned QR codes to be tested again. Only use for debugging.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: async () => {
            setIsClearingNonce(true);
            try {
              await clearNonceCache();
              Alert.alert('Done', 'Local nonce cache cleared.');
            } catch {
              Alert.alert('Error', 'Failed to clear nonce cache. Please try again.');
            } finally {
              setIsClearingNonce(false);
            }
          },
        },
      ],
    );
  };

  // ── Supervisor PIN handlers ─────────────────────────────────────────────

  const openSetPin = () => {
    setPinValue('');
    setPinConfirm('');
    setPinError('');
    setShowPinInput('set');
  };

  const openChangePin = () => {
    setPinValue('');
    setPinConfirm('');
    setPinError('');
    setShowPinInput('change');
  };

  const handleSavePin = async () => {
    if (pinValue.length < 4 || pinValue.length > 6) {
      setPinError('PIN must be 4–6 digits.');
      return;
    }
    if (!/^\d+$/.test(pinValue)) {
      setPinError('PIN must contain digits only.');
      return;
    }
    if (pinValue !== pinConfirm) {
      setPinError('PINs do not match.');
      return;
    }
    setPinBusy(true);
    try {
      await SecureStore.setItemAsync(SUPERVISOR_PIN_KEY, pinValue);
      setPinConfigured(true);
      setShowPinInput(null);
      Alert.alert('PIN Saved', 'Supervisor PIN has been saved securely on this device.');
    } catch {
      setPinError('Failed to save PIN. Please try again.');
    } finally {
      setPinBusy(false);
    }
  };

  const handleClearPin = () => {
    Alert.alert(
      'Remove Supervisor PIN',
      'This will remove the supervisor PIN from this device. Override requests will only be possible via force-override (fully logged).',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove PIN',
          style: 'destructive',
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync(SUPERVISOR_PIN_KEY);
              setPinConfigured(false);
              Alert.alert('PIN Removed', 'Supervisor PIN has been removed from this device.');
            } catch {
              Alert.alert('Error', 'Failed to remove PIN. Please try again.');
            }
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Any unsynced scans will remain in the offline queue.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await onLogout();
          },
        },
      ],
    );
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Settings</Text>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Preferences */}
          <Section title="Preferences">
            <ToggleRow
              label="Haptic Feedback"
              sub="Vibrate on scan result"
              value={prefs.hapticsEnabled}
              onValueChange={(v) => toggle('hapticsEnabled', v)}
            />
            <Divider />
            <ToggleRow
              label="Location Sharing"
              sub="Attach GPS to scan events"
              value={prefs.locationEnabled}
              onValueChange={(v) => toggle('locationEnabled', v)}
            />
          </Section>

          {/* Data */}
          <Section title="Data">
            <ActionRow
              label="Clear Offline Queue"
              sub="Delete all unsynced scans"
              onPress={handleClearQueue}
              busy={isClearingQueue}
              danger
            />
            <Divider />
            <ActionRow
              label="Clear Scan History"
              sub="Remove local history from this device"
              onPress={handleClearHistory}
              busy={isClearingHistory}
              danger
            />
            <Divider />
            <ActionRow
              label="Clear Nonce Cache (Debug)"
              sub="Allow scanning the same QR code again"
              onPress={handleClearNonce}
              busy={isClearingNonce}
              danger
            />
          </Section>

          {/* Supervisor PIN */}
          <Section title="Supervisor Override PIN">
            {showPinInput ? (
              <View style={s.pinInputBlock}>
                <Text style={s.pinInputLabel}>
                  {showPinInput === 'set' ? 'Set a new supervisor PIN (4–6 digits):' : 'Change supervisor PIN (4–6 digits):'}
                </Text>
                <TextInput
                  style={s.pinInput}
                  value={pinValue}
                  onChangeText={(t) => { setPinValue(t.replace(/[^0-9]/g, '')); setPinError(''); }}
                  placeholder="New PIN"
                  placeholderTextColor="#475569"
                  secureTextEntry
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <TextInput
                  style={[s.pinInput, { marginTop: 8 }]}
                  value={pinConfirm}
                  onChangeText={(t) => { setPinConfirm(t.replace(/[^0-9]/g, '')); setPinError(''); }}
                  placeholder="Confirm PIN"
                  placeholderTextColor="#475569"
                  secureTextEntry
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {!!pinError && <Text style={s.pinError}>{pinError}</Text>}
                <View style={s.pinBtnRow}>
                  <Pressable style={[s.pinBtn, s.pinBtnCancel]} onPress={() => setShowPinInput(null)}>
                    <Text style={s.pinBtnCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[s.pinBtn, s.pinBtnSave]} onPress={handleSavePin} disabled={pinBusy}>
                    {pinBusy
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={s.pinBtnSaveText}>Save PIN</Text>
                    }
                  </Pressable>
                </View>
              </View>
            ) : (
              <>
                <View style={s.row}>
                  <View style={s.rowText}>
                    <Text style={s.rowLabel}>Supervisor PIN</Text>
                    <Text style={s.rowSub}>
                      {pinConfigured ? '✅ PIN configured on this device' : '⚠ No PIN set — only force-override available'}
                    </Text>
                  </View>
                </View>
                <Divider />
                {pinConfigured ? (
                  <>
                    <ActionRow
                      label="Change PIN"
                      sub="Update the supervisor PIN"
                      onPress={openChangePin}
                    />
                    <Divider />
                    <ActionRow
                      label="Remove PIN"
                      sub="Delete PIN from this device"
                      onPress={handleClearPin}
                      danger
                    />
                  </>
                ) : (
                  <ActionRow
                    label="Set Supervisor PIN"
                    sub="Required for authenticated overrides"
                    onPress={openSetPin}
                  />
                )}
              </>
            )}
          </Section>

          {/* Account */}
          <Section title="Account">
            <ActionRow
              label="Sign Out"
              onPress={handleLogout}
              busy={isLoggingOut}
              danger
            />
          </Section>

          {/* About */}
          <Section title="About">
            <View style={s.row}>
              <Text style={s.rowLabel}>Version</Text>
              <Text style={s.rowValue}>{APP_VERSION}</Text>
            </View>
            <Divider />
            <View style={s.row}>
              <Text style={s.rowLabel}>Platform</Text>
              <Text style={s.rowValue}>{Platform.OS} {Platform.Version}</Text>
            </View>
          </Section>

          {/* Footer */}
          <Text style={s.footer}>GateFlow Scanner · All data encrypted at rest</Text>
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: TOP_OFFSET,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#1e293b',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: 20,
    paddingBottom: 120,
    gap: 6,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },

  // Rows
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 15,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  rowLabelDanger: {
    color: '#f87171',
  },
  rowSub: {
    fontSize: 12,
    color: '#64748b',
  },
  rowValue: {
    fontSize: 14,
    color: '#64748b',
    fontVariant: ['tabular-nums'],
  },
  chevron: {
    fontSize: 22,
    color: '#334155',
    lineHeight: 26,
  },
  chevronDanger: {
    color: 'rgba(248,113,113,0.4)',
  },

  // Divider
  divider: {
    marginLeft: 18,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#1e293b',
  },

  // Footer
  footer: {
    fontSize: 12,
    color: '#334155',
    textAlign: 'center',
    marginTop: 8,
  },

  // Supervisor PIN input
  pinInputBlock: {
    padding: 18,
    gap: 4,
  },
  pinInputLabel: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 10,
  },
  pinInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#f1f5f9',
    letterSpacing: 4,
  },
  pinError: {
    fontSize: 13,
    color: '#fca5a5',
    marginTop: 6,
  },
  pinBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  pinBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  pinBtnCancel: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pinBtnCancelText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 14,
  },
  pinBtnSave: {
    backgroundColor: '#2563eb',
  },
  pinBtnSaveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
