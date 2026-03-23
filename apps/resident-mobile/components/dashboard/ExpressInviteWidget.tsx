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
  ScrollView,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../lib/theme';
import { residentFetch } from '../../lib/api';
import { type CachedVisitor } from '../../lib/qr-cache';

const { colors, spacing, borderRadius, shadows } = theme;

interface ExpressInviteWidgetProps {
  onSuccess?: (data: { shortId: string; shareUrl: string }) => void;
  recentVisitors?: CachedVisitor[];
  lang?: 'en' | 'ar';
}

export const ExpressInviteWidget: React.FC<ExpressInviteWidgetProps> = ({
  onSuccess,
  recentVisitors = [],
  lang = 'en',
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null);
  const [delegateToAi, setDelegateToAi] = useState(false);

  // Simple local i18n
  const t = {
    en: {
      title: 'Express Invite',
      subtitle: 'One-tap link for guests',
      recent: 'Recent Guests',
      aiToggle: 'Delegate to GateAI',
      aiSubtitle: 'AI Concierge handles guest help',
      inviteMsg:
        'Hello {{name}}! Here is your secure visitor pass for my unit at GateFlow. Please present this at the gate: ',
      inviteMsgAnon:
        'Hello! Here is your secure visitor pass for my unit at GateFlow. Please present this at the gate: ',
      expiryMsg: '\n\n*This link is valid for 24 hours.',
    },
    ar: {
      title: 'دعوة سريعة',
      subtitle: 'رابط بنقرة واحدة للضيوف',
      recent: 'ضيوف مؤخراً',
      aiToggle: 'تفويض GateAI',
      aiSubtitle: 'المساعد الذكي يتولى مساعدة الضيف',
      inviteMsg:
        'مرحباً {{name}}! إليك تصريح الزيارة الآمن لوحدتي في GateFlow. يرجى إبرازه عند البوابة: ',
      inviteMsgAnon:
        'مرحباً! إليك تصريح الزيارة الآمن لوحدتي في GateFlow. يرجى إبرازه عند البوابة: ',
      expiryMsg: '\n\n*هذا الرابط صالح لمدة 24 ساعة.',
    },
  }[lang];

  const handlePress = async (visitorName?: string | null) => {
    if (loading) return;

    if (visitorName) setSelectedVisitor(visitorName);
    setLoading(true);

    try {
      const response = await residentFetch('/resident/express-invite', {
        method: 'POST',
        body: JSON.stringify({ delegateToAi }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to generate invite');
      }

      const { shareUrl } = result.data;

      // Prepare message
      const messageTemplate = visitorName
        ? t.inviteMsg.replace('{{name}}', visitorName)
        : t.inviteMsgAnon;
      const fullMessage = `${messageTemplate}${shareUrl}${t.expiryMsg}`;

      // native share
      await Share.share({
        message: fullMessage,
        url: Platform.OS === 'ios' ? shareUrl : undefined,
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
      setSelectedVisitor(null);
    }
  };

  // Filter unique visitor names for "Recent" list
  const uniqueRecents = Array.from(
    new Set(
      recentVisitors
        .map((v) => v.visitorName)
        .filter((name): name is string => name !== null && name.length > 0)
    )
  ).slice(0, 5);

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.95, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <Pressable
          onPress={() => handlePress()}
          disabled={loading}
          style={({ pressed }) => [
            styles.mainCard,
            pressed && styles.cardPressed,
            loading && !selectedVisitor && styles.cardLoading,
          ]}
        >
          <View
            style={[styles.iconContainer, { backgroundColor: colors.accent }]}
          >
            {loading && !selectedVisitor ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Ionicons name="flash" size={24} color={colors.primary} />
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.subtitle}>{t.subtitle}</Text>
          </View>

          <View style={styles.actionBtn}>
            <Ionicons
              name="share-outline"
              size={20}
              color={colors.primaryForeground}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => setDelegateToAi(!delegateToAi)}
          style={[
            styles.aiToggleCard,
            delegateToAi && { borderColor: colors.accent },
          ]}
        >
          <View
            style={[
              styles.aiIcon,
              {
                backgroundColor: delegateToAi
                  ? colors.accent
                  : colors.secondary,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={16}
              color={delegateToAi ? colors.primary : colors.mutedForeground}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>{t.aiToggle}</Text>
            <Text style={styles.aiSubtitle}>{t.aiSubtitle}</Text>
          </View>
          <View
            style={[
              styles.toggleTrack,
              delegateToAi
                ? { backgroundColor: colors.accent }
                : { backgroundColor: colors.border },
            ]}
          >
            <MotiView
              animate={{ translateX: delegateToAi ? 16 : 0 }}
              transition={{ type: 'spring', damping: 20 }}
              style={styles.toggleThumb}
            />
          </View>
        </Pressable>
      </MotiView>

      {uniqueRecents.length > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: 5 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200 }}
          style={styles.recentSection}
        >
          <Text style={styles.sectionHeader}>{t.recent}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
          >
            {uniqueRecents.map((name, index) => (
              <Pressable
                key={`${name}-${index}`}
                onPress={() => handlePress(name)}
                disabled={loading}
                style={({ pressed }) => [
                  styles.recentItem,
                  pressed && styles.recentItemPressed,
                  selectedVisitor === name && styles.recentItemSelected,
                ]}
              >
                {selectedVisitor === name ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.recentName} numberOfLines={1}>
                    {name}
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </MotiView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  mainCard: {
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
  recentSection: {
    marginTop: spacing.md,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  recentList: {
    paddingRight: spacing.xl,
  },
  recentItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentItemPressed: {
    backgroundColor: colors.secondary,
  },
  recentItemSelected: {
    borderColor: colors.primary,
  },
  recentName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  aiToggleCard: {
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
  },
  aiSubtitle: {
    fontSize: 11,
    color: colors.mutedForeground,
  },
  toggleTrack: {
    width: 36,
    height: 20,
    borderRadius: 10,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    ...shadows.sm,
  },
});
