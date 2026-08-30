import { useCallback } from 'react';
import { Share, Linking, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { type VisitorInviteRecord } from '../types';

export interface UseShareVisitorResult {
  shareViaWhatsApp: (invite: VisitorInviteRecord) => Promise<boolean>;
  shareViaSystem: (invite: VisitorInviteRecord) => Promise<boolean>;
  generateShareMessage: (invite: VisitorInviteRecord) => string;
}

export function useShareVisitor(): UseShareVisitorResult {
  const generateShareMessage = useCallback(
    (invite: VisitorInviteRecord): string => {
      const code = invite.qrCode?.code ?? '';
      const unitName = invite.unit?.name ?? 'Assigned Unit';
      const visitor = invite.visitorName;

      return (
        `*GateFlow Security Pass / تصريح دخول جيت فلو*\n\n` +
        `Hello ${visitor}, your visitor gate pass for *${unitName}* is ready.\n` +
        `مرحباً ${visitor}، تصريح الدخول الخاص بك للوحدة *${unitName}* جاهز للاستخدام.\n\n` +
        `🔑 *Pass Code / كود الدخول:*\n${code}\n\n` +
        `Present this pass to the gate security guard upon arrival.\n` +
        `يرجى إبراز هذا التصريح لمسؤول الأمن عند الوصول إلى البوابة.`
      );
    },
    []
  );

  const shareViaWhatsApp = useCallback(
    async (invite: VisitorInviteRecord): Promise<boolean> => {
      const message = generateShareMessage(invite);
      const phone = invite.visitorPhone?.replace(/[^0-9]/g, '');

      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Haptics fallback
      }

      try {
        let url: string;
        if (phone) {
          url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
        } else {
          url = `whatsapp://send?text=${encodeURIComponent(message)}`;
        }

        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return true;
        } else {
          // Fallback to web WhatsApp or generic share
          const webUrl = phone
            ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`
            : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
          await Linking.openURL(webUrl);
          return true;
        }
      } catch (err) {
        console.warn(
          '[useShareVisitor] WhatsApp open failed, falling back to system share:',
          err
        );
        return shareViaSystem(invite);
      }
    },
    [generateShareMessage]
  );

  const shareViaSystem = useCallback(
    async (invite: VisitorInviteRecord): Promise<boolean> => {
      const message = generateShareMessage(invite);
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Haptics fallback
      }

      try {
        const result = await Share.share(
          {
            title: `GateFlow Pass - ${invite.visitorName}`,
            message,
          },
          {
            dialogTitle: `Share Gate Pass for ${invite.visitorName}`,
          }
        );
        return result.action === Share.sharedAction;
      } catch (e) {
        console.warn('[useShareVisitor] Share error:', e);
        return false;
      }
    },
    [generateShareMessage]
  );

  return {
    shareViaWhatsApp,
    shareViaSystem,
    generateShareMessage,
  };
}
