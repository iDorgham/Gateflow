import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../../../lib/theme';
import { type VisitorTemplate, type VisitorTemplateType } from '../types';

const { colors, spacing, borderRadius, typography, shadows } = theme;

export const VISITOR_TEMPLATES: VisitorTemplate[] = [
  {
    id: 'DAY_GUEST',
    title: 'Day Guest',
    subtitle: 'Single visit, 24h validity',
    icon: '👋',
    defaultAccessType: 'ONETIME',
    defaultValidityHours: 24,
    badgeLabel: 'Most Popular',
  },
  {
    id: 'FAMILY',
    title: 'Family Member',
    subtitle: 'Permanent clearance',
    icon: '👨‍👩‍👧‍👦',
    defaultAccessType: 'PERMANENT',
    defaultValidityHours: 8760,
    badgeLabel: 'Full Access',
  },
  {
    id: 'DRIVER',
    title: 'Driver / Delivery',
    subtitle: 'Recurring daytime entry',
    icon: '🚗',
    defaultAccessType: 'RECURRING',
    defaultValidityHours: 720,
    badgeLabel: 'Recurring',
  },
  {
    id: 'CONTRACTOR',
    title: 'Contractor',
    subtitle: 'Date range work pass',
    icon: '🛠️',
    defaultAccessType: 'DATERANGE',
    defaultValidityHours: 168,
    badgeLabel: 'Scheduled',
  },
];

interface VisitorTemplatePickerProps {
  selectedTemplate: VisitorTemplateType;
  onSelectTemplate: (template: VisitorTemplate) => void;
}

export function VisitorTemplatePicker({
  selectedTemplate,
  onSelectTemplate,
}: VisitorTemplatePickerProps) {
  const handleSelect = async (t: VisitorTemplate) => {
    try {
      await Haptics.selectionAsync();
    } catch {
      // Haptics fallback
    }
    onSelectTemplate(t);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Visitor Type</Text>
      <View style={styles.grid}>
        {VISITOR_TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <Pressable
              key={tpl.id}
              style={({ pressed }) => [
                styles.card,
                isSelected && styles.cardSelected,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleSelect(tpl)}
            >
              <View style={styles.topRow}>
                <Text style={styles.icon}>{tpl.icon}</Text>
                <View
                  style={[
                    styles.badge,
                    isSelected ? styles.badgeSelected : styles.badgeDefault,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      isSelected && styles.badgeTextSelected,
                    ]}
                  >
                    {tpl.badgeLabel}
                  </Text>
                </View>
              </View>

              <Text style={[styles.title, isSelected && styles.titleSelected]}>
                {tpl.title}
              </Text>
              <Text style={styles.subtitle}>{tpl.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  heading: {
    fontSize: typography.sm.fontSize,
    fontWeight: '700',
    color: colors.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '47.5%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF5F0',
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: borderRadius.full,
  },
  badgeDefault: {
    backgroundColor: colors.secondary,
  },
  badgeSelected: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.mutedForeground,
  },
  badgeTextSelected: {
    color: colors.primaryForeground,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.foreground,
    marginBottom: 2,
  },
  titleSelected: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    lineHeight: 16,
  },
});
