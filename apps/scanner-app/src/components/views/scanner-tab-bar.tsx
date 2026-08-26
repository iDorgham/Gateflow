import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Calendar,
  ClipboardList,
  Home,
  MessageCircle,
  ScanLine,
  Settings,
  type LucideIcon,
} from 'lucide-react-native';
import { nativeTokensNewEra as nativeTokens } from '../../../../../packages/ui/src/tokens';

import { getScannerTranslations, type SupportedLocale } from '../../lib/i18n';

export type ScannerTabKey =
  'home' | 'scanner' | 'today' | 'log' | 'chat' | 'settings';

interface TabItemConfig {
  key: ScannerTabKey;
  icon: LucideIcon;
}

const TAB_ITEMS: TabItemConfig[] = [
  { key: 'home', icon: Home },
  { key: 'scanner', icon: ScanLine },
  { key: 'today', icon: Calendar },
  { key: 'log', icon: ClipboardList },
  { key: 'chat', icon: MessageCircle },
  { key: 'settings', icon: Settings },
];

export interface ScannerTabBarProps {
  activeTab: ScannerTabKey;
  onSelectTab: (tab: ScannerTabKey) => void;
  locale?: SupportedLocale;
}

export function ScannerTabBar({
  activeTab,
  onSelectTab,
  locale = 'en',
}: ScannerTabBarProps) {
  const t = getScannerTranslations(locale).tabs;

  return (
    <View style={styles.bottomNav} pointerEvents="box-none">
      {TAB_ITEMS.map((tab) => {
        const isActive = activeTab === tab.key;
        const IconComponent = tab.icon;
        const label = t[tab.key] ?? tab.key;
        return (
          <Pressable
            key={tab.key}
            style={[styles.navTab, isActive && styles.navTabActive]}
            onPress={() => onSelectTab(tab.key)}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isActive }}
          >
            <IconComponent
              size={22}
              strokeWidth={1.5}
              color={
                isActive
                  ? nativeTokens.colors.primary
                  : nativeTokens.colors.textSubtle
              }
            />
            <Text
              style={[styles.navTabLabel, isActive && styles.navTabLabelActive]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: nativeTokens.colors.surface,
    borderTopWidth: 1,
    borderTopColor: nativeTokens.colors.border,
    paddingBottom: 24,
    paddingTop: 8,
    paddingHorizontal: 8,
    zIndex: 20,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },
  navTabActive: {
    backgroundColor: nativeTokens.colors.surfaceSubtle,
  },
  navTabLabel: {
    fontSize: 10,
    color: nativeTokens.colors.textSubtle,
    marginTop: 2,
    fontWeight: '500',
  },
  navTabLabelActive: {
    color: nativeTokens.colors.primary,
    fontWeight: '700',
  },
});
