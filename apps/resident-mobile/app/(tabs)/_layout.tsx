import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { nativeTokensNewEra as nativeTokens } from '../../../../packages/ui/src/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: nativeTokens.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: nativeTokens.colors.borderSubtle,
        },
        headerTitleStyle: {
          fontFamily: 'Cairo_700Bold',
          fontSize: 18,
          color: nativeTokens.colors.textHeading,
        },
        headerTintColor: nativeTokens.colors.primary,
        tabBarActiveTintColor: nativeTokens.colors.primary,
        tabBarInactiveTintColor: nativeTokens.colors.textSubtle,
        tabBarStyle: {
          backgroundColor: nativeTokens.colors.surfaceSubtle,
          borderTopColor: nativeTokens.colors.borderSubtle,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Cairo_600SemiBold',
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="qrs/index"
        options={{
          title: 'QRs',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" color={color} size={size} />
          ),
          headerTitle: 'My visitor QRs',
        }}
      />
      <Tabs.Screen
        name="ai/index"
        options={{
          title: 'GateAI',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" color={color} size={size} />
          ),
          headerTitle: 'GateAI Assistant',
        }}
      />
      <Tabs.Screen
        name="history/index"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size} />
          ),
          headerTitle: 'Visitor history',
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
          headerTitle: 'Settings',
        }}
      />
      <Tabs.Screen
        name="marketplace/index"
        options={{
          title: 'Marketplace',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bag-handle-outline" color={color} size={size} />
          ),
          headerTitle: 'Marketplace',
        }}
      />
    </Tabs>
  );
}
