import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../../../lib/theme';
import { type VisitorInviteRecord } from '../types';
import { useShareVisitor } from '../hooks/useShareVisitor';

const { colors, spacing, borderRadius, typography, shadows } = theme;

interface ShareSheetProps {
  visible: boolean;
  invite: VisitorInviteRecord | null;
  onClose: () => void;
}

export function ShareSheet({ visible, invite, onClose }: ShareSheetProps) {
  const { shareViaWhatsApp, shareViaSystem } = useShareVisitor();

  if (!invite) return null;

  const handleWhatsApp = async () => {
    await shareViaWhatsApp(invite);
    onClose();
  };

  const handleSystemShare = async () => {
    await shareViaSystem(invite);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.title}>Share Gate Pass</Text>
          <Text style={styles.subtitle}>
            Share instant security clearance with {invite.visitorName}.
          </Text>

          {/* Pass Preview Card */}
          <View style={styles.passCard}>
            <View style={styles.passHeader}>
              <Text style={styles.passVisitor}>{invite.visitorName}</Text>
              <Text style={styles.passUnit}>
                {invite.unit?.name ?? 'Unit Pass'}
              </Text>
            </View>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Security Code</Text>
              <Text style={styles.codeValue}>
                {invite.qrCode?.code
                  ? `${invite.qrCode.code.slice(0, 32)}...`
                  : 'PASS-SECURE'}
              </Text>
            </View>
          </View>

          {/* Channel Actions */}
          <View style={styles.actionList}>
            <Pressable
              style={({ pressed }) => [
                styles.channelButton,
                styles.whatsAppButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleWhatsApp}
            >
              <Text style={styles.channelIcon}>💬</Text>
              <View style={styles.channelTextCol}>
                <Text style={styles.whatsAppButtonText}>
                  Share via WhatsApp
                </Text>
                <Text style={styles.whatsAppSubtext}>
                  Direct instant message with pass code
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.channelButton,
                styles.systemButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSystemShare}
            >
              <Text style={styles.channelIcon}>📲</Text>
              <View style={styles.channelTextCol}>
                <Text style={styles.systemButtonText}>
                  Other Apps & Share Sheet
                </Text>
                <Text style={styles.systemSubtext}>
                  iMessage, SMS, Email, or AirDrop
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Close Button */}
          <Pressable
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing['3xl'] : spacing.xl,
    ...shadows.xl,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.xl.fontSize,
    fontWeight: '700',
    color: colors.foreground,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sm.fontSize,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  passCard: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  passVisitor: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.foreground,
  },
  passUnit: {
    fontSize: 13,
    color: colors.mutedForeground,
    fontWeight: '500',
  },
  codeContainer: {
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.foreground,
  },
  actionList: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  channelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
  },
  whatsAppButton: {
    backgroundColor: '#25D366',
    borderColor: '#22BF5B',
  },
  systemButton: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  channelIcon: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  channelTextCol: {
    flex: 1,
  },
  whatsAppButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  whatsAppSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  systemButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
  },
  systemSubtext: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  closeButton: {
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: typography.base.fontSize,
    fontWeight: '600',
    color: colors.foreground,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
