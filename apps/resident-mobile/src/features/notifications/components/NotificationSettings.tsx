import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { theme } from '../../../lib/theme';
import { type NotificationPreferences } from '../types';

const { colors, spacing, borderRadius, typography, shadows } = theme;

const PREFERENCES_STORAGE_KEY = 'resident_notification_preferences';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enableArrivalAlerts: true,
  enableSound: true,
  enableHaptics: true,
  enableQuietHours: false,
  quietHoursStart: '23:00',
  quietHoursEnd: '07:00',
  autoOpenForFamily: false,
};

export function NotificationSettings() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (raw) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(raw) });
        }
      } catch (e) {
        console.warn('[NotificationSettings] Load error:', e);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const updatePreference = async <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    try {
      await Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }

    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    try {
      await AsyncStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (e) {
      console.warn('[NotificationSettings] Save error:', e);
    }
  };

  if (!loaded) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionHeader}>Alerts & Notifications</Text>

      {/* Arrival Alerts */}
      <View style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Visitor Arrival Alerts</Text>
            <Text style={styles.settingDescription}>
              Instant push notification when your visitor arrives at the gate.
            </Text>
          </View>
          <Switch
            value={preferences.enableArrivalAlerts}
            onValueChange={(val) =>
              updatePreference('enableArrivalAlerts', val)
            }
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        {/* Sound */}
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Alert Sounds</Text>
            <Text style={styles.settingDescription}>
              Play sound when arrival notifications are received.
            </Text>
          </View>
          <Switch
            value={preferences.enableSound}
            onValueChange={(val) => updatePreference('enableSound', val)}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        {/* Haptics */}
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Vibration & Haptics</Text>
            <Text style={styles.settingDescription}>
              Haptic pulse feedback for gate clearance actions.
            </Text>
          </View>
          <Switch
            value={preferences.enableHaptics}
            onValueChange={(val) => updatePreference('enableHaptics', val)}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>

      <Text style={styles.sectionHeader}>Automation & Privacy</Text>

      <View style={styles.settingCard}>
        {/* Quiet Hours */}
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Quiet Hours</Text>
            <Text style={styles.settingDescription}>
              Mute arrival sounds from {preferences.quietHoursStart} to{' '}
              {preferences.quietHoursEnd}.
            </Text>
          </View>
          <Switch
            value={preferences.enableQuietHours}
            onValueChange={(val) => updatePreference('enableQuietHours', val)}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        {/* Auto Open for Family */}
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Auto-Open for Family Passes</Text>
            <Text style={styles.settingDescription}>
              Automatically grant clearance when verified family members scan.
            </Text>
          </View>
          <Switch
            value={preferences.autoOpenForFamily}
            onValueChange={(val) => updatePreference('autoOpenForFamily', val)}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
