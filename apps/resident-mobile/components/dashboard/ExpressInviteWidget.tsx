import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../lib/theme';
import { residentFetch } from '../../lib/api';

const { colors, spacing, borderRadius, shadows, typography } = theme;

interface ExpressInviteWidgetProps {
  onSuccess?: (data: { shortId: string; shareUrl: string }) => void;
  lang?: 'en' | 'ar';
}

export const ExpressInviteWidget: React.FC<ExpressInviteWidgetProps> = ({
  onSuccess,
  lang = 'en',
}) => {
  const [loading, setLoading] = useState(false);

  // Simple local i18n for the widget
  const t = {
    en: {
      title: 'Express Invite',
      subtitle: 'One-tap link for guests',
      btn: 'Generate & Share',
      sharing: 'Generating...',
      inviteMsg: 'Hello! Here is your visitor pass for my unit at GateFlow: ',
      expiryMsg: '\nValid for 24 hours.',
    },
    ar: {
      title: 'دعوة سريعة',
      subtitle: 'رابط بنقرة واحدة للضيوف',
      btn: 'إنشاء ومشاركة',
      sharing: 'جاري الإنشاء...',
      inviteMsg: 'مرحباً! إليك تصريح الزيارة الخاص بك لوحدتي في GateFlow: ',
      expiryMsg: '\nصالح لمدة 24 ساعة.',
    },
  }[lang];

  const handlePress = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await residentFetch('/resident/express-invite', {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to generate invite');
      }

      const { shareUrl } = result.data;

      // native share
      await Share.share({
        message: `${t.inviteMsg}${shareUrl}${t.expiryMsg}`,
        url: Platform.OS === 'ios' ? shareUrl : undefined, // iOS handles URL property
      });

      onSuccess?.(result.data);
    } catch (error) {
      console.error('[ExpressInvite] Error:', error);
      Alert.alert(
        'Error',
        'Could not generate secure link. Please check your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 15 }}
      style={styles.container}
    >
      <Pressable
        onPress={handlePress}
        disabled={loading}
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
          loading && styles.cardLoading,
        ]}
      >
        <View style={styles.iconContainer}>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Ionicons name="flash" size={24} color={colors.primary} />
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
        </View>

        <MotiView
          animate={{ scale: loading ? 0.95 : 1 }}
          style={styles.actionBtn}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryForeground} size="small" />
          ) : (
            <Ionicons
              name="share-outline"
              size={20}
              color={colors.primaryForeground}
            />
          )}
        </MotiView>
      </Pressable>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardLoading: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.foreground,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
});
